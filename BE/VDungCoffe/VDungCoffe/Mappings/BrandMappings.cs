using VDungCoffe.DTO.Admin.Brands;
using VDungCoffe.Models;

namespace VDungCoffe.Mappings;

public static class BrandMappings
{
    public static AdminBrandResponse ToAdminDto(this Brand brand)
    {
        return new AdminBrandResponse
        {
            Id = brand.Id,
            Code = brand.Code,
            Name = brand.Name,
            IsActive = brand.IsActive,
            ProductsCount = brand.Products?.Count ?? 0,
            CreatedAt = brand.CreatedAt,
            Version = brand.Version != null ? Convert.ToBase64String(brand.Version) : string.Empty
        };
    }

    public static Dictionary<string, object?> ToAdminRow(this Brand brand)
    {
        return new Dictionary<string, object?>
        {
            ["id"] = brand.Id.ToString(),
            ["name"] = brand.Name,
            ["code"] = brand.Code,
            ["status"] = brand.IsActive ? "Đang hiển thị" : "Ẩn",
            ["version"] = brand.Version != null ? Convert.ToBase64String(brand.Version) : string.Empty
        };
    }
}
