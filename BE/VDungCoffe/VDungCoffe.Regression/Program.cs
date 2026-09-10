using System.Reflection;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using VDungCoffe.Controllers.Admin;
using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Products;
using VDungCoffe.DTO.Admin.Articles;
using VDungCoffe.DTO.Common;
using VDungCoffe.Models;
using VDungCoffe.Security;
using VDungCoffe.Services.Implementations;
using VDungCoffe.Validators.Admin.Products;

var failures = new List<string>();
var passed = 0;
async Task Test(string name, Func<Task> check)
{
    try { await check(); passed++; Console.WriteLine($"PASS {name}"); }
    catch (Exception ex) { failures.Add(name); Console.Error.WriteLine($"FAIL {name}: {ex.Message}"); }
}
void Assert(bool condition, string reason)
{
    if (!condition) throw new InvalidOperationException(reason);
}
ClaimsPrincipal Principal(string? role, IEnumerable<string>? permissions = null, bool authenticated = true)
{
    var claims = new List<Claim>();
    if (role != null) claims.Add(new Claim(ClaimTypes.Role, role));
    claims.AddRange((permissions ?? []).Select(p => new Claim("permission", p)));
    return new ClaimsPrincipal(new ClaimsIdentity(claims, authenticated ? "regression" : null));
}
async Task<bool> Allowed(ClaimsPrincipal user, string permission)
{
    var requirement = new PermissionRequirement(permission);
    var context = new AuthorizationHandlerContext([requirement], user, null);
    await new PermissionAuthorizationHandler().HandleAsync(context);
    return context.HasSucceeded;
}

var assistant = Principal(Permissions.RoleDefaults.AdminAssistant, Permissions.RoleDefaults.AdminAssistantPermissions);
await Test("Assistant may edit product descriptions", async () =>
    Assert(await Allowed(assistant, Permissions.ProductsEditGeneral), "Expected EditGeneral permission"));
foreach (var denied in new[] { Permissions.ProductsEditPrice, Permissions.ProductsDelete, Permissions.ProductsPublish })
    await Test($"Assistant cannot {denied}", async () =>
        Assert(!await Allowed(assistant, denied), "Privileged action unexpectedly authorized"));
await Test("Role alone does not grant edit access", async () =>
    Assert(!await Allowed(Principal(Permissions.RoleDefaults.AdminAssistant), Permissions.ProductsEditGeneral), "Role-only principal granted access"));
await Test("Unauthenticated SuperAdmin cannot bypass authentication", async () =>
    Assert(!await Allowed(Principal(Permissions.RoleDefaults.SuperAdmin, authenticated: false), Permissions.ProductsDelete), "Anonymous role bypass"));
await Test("SuperAdmin can delete", async () =>
    Assert(await Allowed(Principal(Permissions.RoleDefaults.SuperAdmin), Permissions.ProductsDelete), "SuperAdmin denied"));

foreach (var (method, policy) in new[]
{
    ("UpdateProductGeneral", Permissions.ProductsEditGeneral),
    ("UpdateProductPrice", Permissions.ProductsEditPrice),
    ("PublishProduct", Permissions.ProductsPublish),
    ("SoftDeleteProduct", Permissions.ProductsDelete)
})
    await Test($"Controller action {method} requires its specific policy", () =>
    {
        var action = typeof(AdminProductsController).GetMethod(method)!;
        Assert(action.GetCustomAttributes<HasPermissionAttribute>().Any(a => a.Policy == policy), "Missing action permission");
        return Task.CompletedTask;
    });

await Test("General update DTO cannot overpost price/publication/deletion", () =>
{
    var payload = """{"name":"safe","price":1,"priceMode":"fixed","isPublished":true,"archivedAt":"2020-01-01T00:00:00Z"}""";
    var dto = JsonSerializer.Deserialize<UpdateProductGeneralRequest>(payload, new JsonSerializerOptions(JsonSerializerDefaults.Web))!;
    var json = JsonSerializer.Serialize(dto, new JsonSerializerOptions(JsonSerializerDefaults.Web));
    Assert(dto.Name == "safe", "Valid DTO field lost");
    foreach (var forbidden in new[] { "price", "priceMode", "isPublished", "archivedAt" })
        Assert(!JsonDocument.Parse(json).RootElement.TryGetProperty(forbidden, out _), $"DTO exposes {forbidden}");
    return Task.CompletedTask;
});
await Test("Sanitizer removes active HTML while retaining formatting", () =>
{
    var sanitizer = new HtmlSanitizerService();
    var html = sanitizer.Sanitize("<p>Hello <strong>coffee</strong></p><script>alert(1)</script><a href='javascript:alert(1)' onclick='evil()'>bad</a><img src=x onerror=evil()><iframe src='https://evil.example'></iframe>");
    foreach (var forbidden in new[] { "<script", "javascript:", "onclick", "onerror", "<iframe", "<img" })
        Assert(!html.Contains(forbidden, StringComparison.OrdinalIgnoreCase), $"Unsafe HTML retained: {forbidden}");
    Assert(html.Contains("<strong>coffee</strong>"), "Safe formatting lost");
    Assert(sanitizer.Sanitize(null) == "", "Null must sanitize to empty");
    return Task.CompletedTask;
});
await Test("Pagination page size is bounded", () =>
{
    Assert(new PaginationQuery().PageSize == 20, "Default size changed");
    Assert(new PaginationQuery { PageSize = int.MaxValue }.PageSize == 100, "Unbounded size");
    Assert(new PaginationQuery { PageSize = -1 }.PageSize >= 1, "Invalid minimum size");
    return Task.CompletedTask;
});
await Test("Price validator rejects negative price and missing version", () =>
{
    var result = new UpdateProductPriceValidator().Validate(new UpdateProductPriceRequest { Price = -1, Version = "" });
    Assert(result.Errors.Any(e => e.PropertyName == "Price"), "Negative price accepted");
    Assert(result.Errors.Any(e => e.PropertyName == "Version"), "Missing concurrency version accepted");
    return Task.CompletedTask;
});
await Test("Service pagination rejects invalid pages and sort directions", () =>
{
    foreach (var invalid in new[] { new PaginationQuery { Page = 0 }, new PaginationQuery { Page = int.MaxValue }, new PaginationQuery { SortDir = "invalid" } })
    {
        var rejected = false;
        try { ServiceInput.Validate(invalid); }
        catch (VDungCoffe.Common.Exceptions.ValidationException) { rejected = true; }
        Assert(rejected, "Invalid pagination reached service queries");
    }
    ServiceInput.Validate(new PaginationQuery { Page = 1, PageSize = 20, SortDir = "asc" });
    return Task.CompletedTask;
});
await Test("SQL Server product model enforces rowversion and soft-delete filter", () =>
{
    // Model inspection only: no connection is opened and no database is required.
    using var context = new AuraCoffeeContext(new DbContextOptionsBuilder<AuraCoffeeContext>()
        .UseSqlServer("Server=localhost;Database=RegressionModelOnly;Integrated Security=true;TrustServerCertificate=true").Options);
    var product = context.Model.FindEntityType(typeof(Product))!;
    var version = product.FindProperty(nameof(Product.Version))!;
    Assert(version.IsConcurrencyToken, "Version is not an EF concurrency token");
    Assert(version.ValueGenerated == ValueGenerated.OnAddOrUpdate, "SQL Server does not generate rowversion");
    Assert(product.GetQueryFilter() != null, "Soft-deleted products have no default query filter");
    return Task.CompletedTask;
});
await Test("Service boundary rejects malformed or missing rowversion", () =>
{
    foreach (var invalid in new string?[] { null, "", "not-base64", Convert.ToBase64String([1, 2, 3]) })
    {
        var rejected = false;
        try { ServiceInput.DecodeVersion(invalid); }
        catch (VDungCoffe.Common.Exceptions.ValidationException) { rejected = true; }
        Assert(rejected, "Invalid rowversion was accepted");
    }
    Assert(ServiceInput.DecodeVersion(Convert.ToBase64String(new byte[8])).Length == 8, "Valid rowversion rejected");
    return Task.CompletedTask;
});

await Test("Article publish action requires publish permission", async () =>
{
    Assert(typeof(AdminArticlesController).GetMethod("Publish")!.GetCustomAttributes<HasPermissionAttribute>()
        .Any(a => a.Policy == Permissions.ArticlesPublish), "Article publish action lacks permission");
    Assert(!await Allowed(assistant, Permissions.ArticlesPublish), "Assistant can publish articles");
});
await Test("Create DTOs cannot set publication", () =>
{
    Assert(typeof(CreateProductRequest).GetProperty("IsPublished") == null, "Product create exposes publication");
    Assert(typeof(CreateArticleRequest).GetProperty("IsPublished") == null, "Article create exposes publication");
    Assert(typeof(UpdateArticleRequest).GetProperty("IsPublished") == null, "Article edit exposes publication");
    return Task.CompletedTask;
});
await Test("Strict JSON binding rejects unknown privileged properties", () =>
{
    var options = new JsonSerializerOptions(JsonSerializerDefaults.Web) { UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow };
    foreach (var json in new[] { """{"name":"safe","price":1}""", """{"name":"safe","isPublished":true}""" })
    {
        var rejected = false;
        try { JsonSerializer.Deserialize<UpdateProductGeneralRequest>(json, options); }
        catch (JsonException) { rejected = true; }
        Assert(rejected, "Unknown privileged property was silently accepted");
    }
    return Task.CompletedTask;
});
await Test("Rich-text JSON decodes escaped attack HTML and preserves structure", () =>
{
    var input = """[{"body":"\u003cscript\u003ealert(1)\u003c/script\u003e<p>Safe</p>","nested":["<a href='javascript:alert(1)'>link</a>"],"count":3,"active":true}]""";
    var sanitized = RichTextJson.Sanitize(input, new HtmlSanitizerService());
    using var document = JsonDocument.Parse(sanitized);
    var section = document.RootElement[0];
    Assert(section.GetProperty("count").GetInt32() == 3 && section.GetProperty("active").GetBoolean(), "JSON scalar values changed");
    Assert(section.GetProperty("body").GetString()!.Contains("<p>Safe</p>"), "Safe rich text lost");
    Assert(!section.GetProperty("body").GetString()!.Contains("<script", StringComparison.OrdinalIgnoreCase), "Escaped script bypassed sanitizer");
    Assert(!section.GetProperty("nested")[0].GetString()!.Contains("javascript:", StringComparison.OrdinalIgnoreCase), "Nested dangerous URL retained");
    return Task.CompletedTask;
});

Console.WriteLine($"\nRegression checks: {passed} passed, {failures.Count} failed.");
return failures.Count == 0 ? 0 : 1;
