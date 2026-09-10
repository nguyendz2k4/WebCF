namespace VDungCoffe.DTO.Admin.Categories;

public class AdminCategoryResponse
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public int ProductsCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Version { get; set; } = string.Empty; // Base64 rowversion
}
