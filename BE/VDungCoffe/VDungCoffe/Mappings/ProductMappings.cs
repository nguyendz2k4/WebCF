using System.Globalization;
using System.Text.Json;
using VDungCoffe.DTO.Admin.Products;
using VDungCoffe.DTO.User.Catalog;
using VDungCoffe.Models;

namespace VDungCoffe.Mappings;

public static class ProductMappings
{
    public static AdminProductResponse ToAdminDto(this Product product)
    {
        return new AdminProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            Sku = product.Sku,
            Domain = product.Domain,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name ?? string.Empty,
            BrandId = product.BrandId,
            BrandName = product.Brand?.Name ?? string.Empty,
            ShortDescription = product.ShortDescription,
            PriceMode = product.PriceMode,
            Price = product.Price,
            IsAvailableForOrder = product.IsAvailableForOrder,
            IsPublished = product.IsPublished,
            IsFeatured = product.IsFeatured,
            LeadTimeNotice = product.LeadTimeNotice,
            ArchivedAt = product.ArchivedAt,
            UpdatedAt = product.UpdatedAt,
            CreatedAt = product.CreatedAt,
            Version = product.Version != null ? Convert.ToBase64String(product.Version) : string.Empty,
            Images = product.ProductMedia?.OrderBy(m => m.Position).Select(m => m.Url).ToList() ?? new List<string>(),
            Warranty = product.Warranty,
            PowerLabel = product.PowerLabel,
            Dimensions = product.Dimensions,
            WeightLabel = product.WeightLabel,
            Origin = product.Origin,
            RoastProfile = product.RoastProfile,
            CuppingScore = product.CuppingScore
        };
    }

    public static PublicProductResponse ToPublicDto(this Product product)
    {
        var price = product.Price ?? 0m;
        var culture = new CultureInfo("vi-VN");
        var formatted = string.Format(culture, "{0:C0}", price);

        List<string>? flavorNotes = null;
        if (!string.IsNullOrWhiteSpace(product.FlavorNotesJson))
        {
            try
            {
                flavorNotes = JsonSerializer.Deserialize<List<string>>(product.FlavorNotesJson);
            }
            catch
            {
                flavorNotes = new List<string>();
            }
        }

        return new PublicProductResponse
        {
            Id = product.Id.ToString(),
            Slug = product.Slug,
            Title = product.Name,
            Sku = product.Sku,
            Category = product.Category?.Code ?? string.Empty,
            CategoryName = product.Category?.Name ?? string.Empty,
            Domain = product.Domain,
            Brand = product.Brand?.Name ?? string.Empty,
            PriceType = product.PriceMode,
            Price = price,
            FormattedPrice = formatted,
            Description = product.ShortDescription,
            InStock = product.IsAvailableForOrder,
            IsFeatured = product.IsFeatured,
            LeadTimeNotice = product.LeadTimeNotice,
            Images = product.ProductMedia?.OrderBy(m => m.Position).Select(m => m.Url).ToList() ?? new List<string>(),
            Specs = product.Domain == "equipment" ? new EquipmentSpecsDto
            {
                Groups = product.GroupsCount,
                Boiler = product.Boiler,
                BoilerCapacity = product.BoilerCapacity,
                Pump = product.Pump,
                Power = product.PowerLabel,
                Voltage = product.Voltage,
                Dimensions = product.Dimensions,
                Weight = product.WeightLabel,
                Warranty = product.Warranty,
                DailyCapacity = product.DailyCapacityLabel
            } : null,
            BeanDetails = product.Domain == "ingredients" ? new BeanSpecsDto
            {
                Origin = product.Origin,
                SubRegion = product.SubRegion,
                Altitude = product.Altitude,
                Process = product.Process,
                RoastProfile = product.RoastProfile,
                CuppingScore = product.CuppingScore,
                FlavorNotes = flavorNotes,
                UnitSize = product.UnitSize
            } : null
        };
    }

    public static Dictionary<string, object?> ToAdminRow(this Product product)
    {
        return new Dictionary<string, object?>
        {
            ["id"] = product.Id.ToString(),
            ["name"] = product.Name,
            ["slug"] = product.Slug,
            ["domain"] = product.Domain,
            ["sku"] = product.Sku ?? string.Empty,
            ["categoryId"] = product.CategoryId.ToString(),
            ["brandId"] = product.BrandId.ToString(),
            ["priceType"] = product.PriceMode,
            ["price"] = product.Price ?? 0m,
            ["stock"] = product.IsAvailableForOrder ? 10 : 0, // Fallback representation for dashboard
            ["status"] = product.IsPublished ? "Đang bán" : "Ẩn",
            ["image"] = product.ProductMedia?.OrderBy(m => m.Position).FirstOrDefault()?.Url ?? string.Empty,
            ["description"] = product.ShortDescription,
            ["version"] = product.Version != null ? Convert.ToBase64String(product.Version) : string.Empty
        };
    }
}
