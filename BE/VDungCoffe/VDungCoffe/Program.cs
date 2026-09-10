using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;
using VDungCoffe.Common.Filters;
using System.Text;
using System.Text.Json;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using VDungCoffe.Common.Middleware;
using VDungCoffe.Data;
using VDungCoffe.Models;
using VDungCoffe.Security;
using VDungCoffe.Services.Implementations;
using VDungCoffe.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Explicit ID also works when the IDE launches with stale assembly metadata.
// Environment/CLI settings still take precedence over local development secrets.
if (builder.Environment.IsDevelopment())
{
    builder.Configuration
        .AddUserSecrets("vdungcoffe-local-development-6a2ca501")
        .AddEnvironmentVariables()
        .AddCommandLine(args);
}

// 1. Controllers & JSON Serializer settings
builder.Services.AddScoped<AdminMutationFilter>();
builder.Services.AddScoped<MutationState>();
builder.Services.AddControllers(options => options.Filters.AddService<AdminMutationFilter>())
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context => new BadRequestObjectResult(
        ApiResponse<object>.Fail("Dữ liệu không hợp lệ.", context.ModelState
            .SelectMany(entry => entry.Value!.Errors.Select(error => $"{entry.Key}: {error.ErrorMessage}")).ToList()));
});

// 2. Register FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// 3. OpenAPI Documentation
builder.Services.AddOpenApi();

// 4. Database Connection & Context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is missing.");

builder.Services.AddDbContext<AuraCoffeeContext>(options =>
    options.UseSqlServer(connectionString));

// 5. ASP.NET Core Identity
builder.Services
    .AddIdentity<AppUser, IdentityRole<Guid>>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 6;
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10);
        options.Lockout.MaxFailedAccessAttempts = 5;
    })
    .AddEntityFrameworkStores<AuraCoffeeContext>()
    .AddDefaultTokenProviders();

// 6. Dual Authentication (Cookie for Next.js Gateway + JWT Bearer for Postman/API)
var jwtKey = JwtSettings.RequireKey(builder.Configuration);
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "AuraCoffeeServer";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "AuraCoffeeClients";

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = "JWT_OR_COOKIE";
    options.DefaultChallengeScheme = "JWT_OR_COOKIE";
})
.AddPolicyScheme("JWT_OR_COOKIE", "JWT_OR_COOKIE", options =>
{
    options.ForwardDefaultSelector = context =>
    {
        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return JwtBearerDefaults.AuthenticationScheme;
        }
        return IdentityConstants.ApplicationScheme;
    };
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
    options.SaveToken = false;
    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = async context =>
        {
            if (!await LivePrincipal.RefreshAsync(context.Principal, context.HttpContext.RequestServices))
                context.Fail("Account or session is no longer valid.");
        }
    };
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateLifetime = true,
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;
    options.Events.OnValidatePrincipal = async context =>
    {
        if (!await LivePrincipal.RefreshAsync(context.Principal, context.HttpContext.RequestServices))
        {
            context.RejectPrincipal();
            await context.HttpContext.RequestServices.GetRequiredService<SignInManager<AppUser>>().SignOutAsync();
        }
    };
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});

// 7. Action-Based Authorization Policies
builder.Services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();
builder.Services.AddAuthorization(options =>
{
    foreach (var permission in Permissions.AllPermissions.Concat(BannerPermissions.AllPermissions))
    {
        options.AddPolicy(permission, policy =>
            policy.Requirements.Add(new PermissionRequirement(permission)));
    }
});

// 8. Dependency Injection: Application Services & Utilities
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();
builder.Services.AddSingleton<IHtmlSanitizerService, HtmlSanitizerService>();
builder.Services.AddSingleton<ICacheService, CacheService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IBrandService, BrandService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IArticleService, ArticleService>();
builder.Services.AddScoped<IBannerService, BannerService>();
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IWorkspaceService, WorkspaceService>();

builder.Services.AddMemoryCache();
builder.Services.AddHttpClient();
builder.Services.AddHostedService<CacheInvalidationWorker>();

// 9. CORS policy for Next.js frontend (http://localhost:3000)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[] { "http://localhost:3000", "https://localhost:3000" })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// 10. Global Exception Handling Middleware
app.UseMiddleware<GlobalExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseStatusCodePages(async context =>
{
    var status = context.HttpContext.Response.StatusCode;
    await context.HttpContext.Response.WriteAsJsonAsync(ApiResponse<object>.Fail(status switch
    {
        401 => "Chưa đăng nhập hoặc phiên làm việc đã hết hạn.",
        403 => "Bạn không có quyền thực hiện hành động này.",
        404 => "Không tìm thấy tài nguyên.",
        _ => "Yêu cầu không thể được xử lý."
    }));
});
app.UseCors("AllowFrontend");
app.Use(async (context, next) =>
{
    // Origin checks also protect login from browser CSRF; API clients without browser headers remain supported.
    if (!HttpMethods.IsGet(context.Request.Method) && !HttpMethods.IsHead(context.Request.Method) && !HttpMethods.IsOptions(context.Request.Method))
    {
        var origin = context.Request.Headers.Origin.FirstOrDefault();
        var referer = context.Request.Headers.Referer.FirstOrDefault();
        if (origin == null && Uri.TryCreate(referer, UriKind.Absolute, out var refererUri)) origin = refererUri.GetLeftPart(UriPartial.Authority);
        var allowed = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[] { "http://localhost:3000", "https://localhost:3000" };
        var sameOrigin = $"{context.Request.Scheme}://{context.Request.Host}";
        if (origin != null && !string.Equals(origin, sameOrigin, StringComparison.OrdinalIgnoreCase) && !allowed.Contains(origin, StringComparer.OrdinalIgnoreCase))
        {
            context.Response.StatusCode = 403;
            return;
        }
    }
    await next();
});

app.UseAuthentication();
app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/api")) context.Response.Headers.CacheControl = "no-store";
    await next();
});
app.UseAuthorization();

app.MapControllers();

// 11. Seed Roles, Fine-Grained Permissions & Initial Accounts
try
{
    await DbInitializer.SeedAsync(app.Services, app.Configuration);
}
catch (Exception ex)
{
    app.Logger.LogWarning(ex, "DbInitializer encountered an error during startup.");
}

app.Run();



