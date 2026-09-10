using VDungCoffe.DTO.Admin.Categories;
using VDungCoffe.Models;

namespace VDungCoffe.Mappings;

public static class CategoryMappings
{
    public static AdminCategoryResponse ToAdminDto(this Category category)
    {
        return new AdminCategoryResponse
        {
            Id = category.Id,
            Code = category.Code,
            Name = category.Name,
            Domain = category.Domain,
            DisplayOrder = category.DisplayOrder,
            IsActive = category.IsActive,
            ProductsCount = category.Products?.Count ?? 0,
            CreatedAt = category.CreatedAt,
            Version = category.Version != null ? Convert.ToBase64String(category.Version) : string.Empty
        };
    }

    public static Dictionary<string, object?> ToAdminRow(this Category category)
    {
        return new Dictionary<string, object?>
        {
            ["id"] = category.Id.ToString(),
            ["name"] = category.Name,
            ["code"] = category.Code,
            ["domain"] = category.Domain,
            ["displayOrder"] = category.DisplayOrder,
            ["status"] = category.IsActive ? "Đang hiển thị" : "Ẩn",
            ["version"] = category.Version != null ? Convert.ToBase64String(category.Version) : string.Empty
        };
    }
}
