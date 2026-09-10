using System.ComponentModel.DataAnnotations;
using FluentValidation;
using VDungCoffe.DTO.Common;

namespace VDungCoffe.Common;

// Shared by services as well as HTTP validation: internal callers cannot bypass input rules.
public static class ServiceInput
{
    public static void Validate(object value)
    {
        ArgumentNullException.ThrowIfNull(value);
        var results = new List<ValidationResult>();
        System.ComponentModel.DataAnnotations.Validator.TryValidateObject(value, new ValidationContext(value), results, true);
        if (results.Count != 0)
            throw new Exceptions.ValidationException(results.Select(x => x.ErrorMessage ?? "Invalid input").ToList());
        if (value is PaginationQuery query) query.Validate();
        ValidateDomainInput(value);
        var contract = typeof(IValidator<>).MakeGenericType(value.GetType());
        foreach (var type in typeof(ServiceInput).Assembly.GetTypes().Where(t => !t.IsAbstract && contract.IsAssignableFrom(t)))
        {
            var validator = (IValidator)Activator.CreateInstance(type)!;
            var contextType = typeof(ValidationContext<>).MakeGenericType(value.GetType());
            var result = validator.Validate((IValidationContext)Activator.CreateInstance(contextType, value)!);
            if (!result.IsValid) throw new FluentValidation.ValidationException(result.Errors);
        }
        var version = value.GetType().GetProperty("Version");
        if (version != null) DecodeVersion(version.GetValue(value) as string);
    }

    public static byte[] DecodeVersion(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) throw new Exceptions.ValidationException("Version là bắt buộc.");
        try
        {
            var bytes = Convert.FromBase64String(value);
            if (bytes.Length != 8) throw new FormatException();
            return bytes;
        }
        catch (FormatException) { throw new Exceptions.ValidationException("Version phải là rowversion 8 byte dạng base64."); }
    }

    private static void ValidateDomainInput(object value)
    {
        var type = value.GetType();
        object? Get(string name) => type.GetProperty(name)?.GetValue(value);
        void Fail(string message) => throw new Exceptions.ValidationException(message);
        if (Get("MinPrice") is decimal min && min < 0 || Get("MaxPrice") is decimal max && max < 0) Fail("Giá lọc không được âm.");
        if (Get("MinPrice") is decimal low && Get("MaxPrice") is decimal high && low > high) Fail("MinPrice phải <= MaxPrice.");
        if (value is PaginationQuery productQuery && (type.Name == "PublicCatalogQuery" || type.Name == "AdminProductFilterQuery") &&
            productQuery.SortBy != null && !new[] { "name", "price", "createdat" }.Contains(productQuery.SortBy.ToLowerInvariant())) Fail("SortBy hỗ trợ name, price, createdAt.");
        if (Get("PriceMode") is string mode)
        {
            var price = Get("Price") as decimal?;
            if (mode == "contact" ? price != null : mode is not ("fixed" or "from") || price == null || price < 0 || price > 999999999999m || decimal.Truncate(price.Value) != price)
                Fail("Giá VND phải là số nguyên hợp lệ; contact không được gửi giá.");
        }
        if (type.Namespace?.Contains("Products") == true && Get("Domain") is string domain)
        {
            var forbidden = domain == "equipment"
                ? new[] { "Origin", "SubRegion", "Altitude", "Process", "RoastProfile", "CuppingScore", "FlavorNotesJson", "UnitSize", "CaseSize", "ShelfLife" }
                : new[] { "GroupsCount", "Boiler", "BoilerCapacity", "Pump", "PowerLabel", "Voltage", "Dimensions", "WeightLabel", "Warranty", "DailyCapacityLabel" };
            if (forbidden.Any(name => Get(name) != null)) Fail("Thông số không phù hợp nhóm sản phẩm.");
        }
        if (Get("GroupsCount") is int groups && groups <= 0) Fail("GroupsCount phải dương.");
        if (Get("CuppingScore") is decimal score && (score < 0 || score > 100)) Fail("CuppingScore phải từ 0 đến 100.");
        if (Get("Voltage") is string voltage && voltage is not ("220V" or "380V" or "220V/380V")) Fail("Voltage không hợp lệ.");
        if (Get("RoastProfile") is string roast && roast is not ("Light" or "Medium" or "Medium-Dark" or "Dark")) Fail("RoastProfile không hợp lệ.");
        if (type.Name.Contains("Article") && Get("CategoryCode") is string category && category is not ("new-products" or "market-trends" or "barista-tech")) Fail("CategoryCode bài viết không hợp lệ.");
        if (Get("ReadTimeMinutes") is int readTime && readTime <= 0) Fail("ReadTimeMinutes phải dương.");
        foreach (var name in new[] { "TagsJson", "FlavorNotesJson", "SectionsJson" })
        {
            if (Get(name) is not string json) continue;
            try
            {
                using var doc = System.Text.Json.JsonDocument.Parse(json);
                if (doc.RootElement.ValueKind != System.Text.Json.JsonValueKind.Array) Fail(name + " phải là mảng JSON.");
            }
            catch (System.Text.Json.JsonException) { Fail(name + " không phải JSON hợp lệ."); }
        }
        foreach (var property in type.GetProperties().Where(p => p.Name.EndsWith("Url")))
            if (property.GetValue(value) is string url && url.Length > 0 && !SafeUrl(url)) Fail(property.Name + " chỉ chấp nhận URL http(s) hoặc đường dẫn gốc.");
        if (Get("Images") is IEnumerable<string> images && (images.Count() > 30 || images.Any(url => !SafeUrl(url)))) Fail("Images tối đa 30 URL http(s) hoặc đường dẫn gốc.");
    }

    private static bool SafeUrl(string url) => !string.IsNullOrWhiteSpace(url) && url.Length <= 1000 && !url.Contains('\\') &&
        ((url.StartsWith('/') && !url.StartsWith("//")) || (Uri.TryCreate(url, UriKind.Absolute, out var uri) && uri.Scheme is "http" or "https"));
}
