namespace VDungCoffe.DTO.Admin.Categories;

public class CreateCategoryRequest
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Domain { get; set; } = "equipment"; // "equipment" or "ingredients"
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}

public class UpdateCategoryRequest
{
    public string Version { get; set; } = string.Empty; // Optimistic concurrency
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}
