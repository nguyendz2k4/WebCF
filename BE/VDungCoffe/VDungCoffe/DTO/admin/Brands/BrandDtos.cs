namespace VDungCoffe.DTO.Admin.Brands;

public class AdminBrandResponse
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int ProductsCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Version { get; set; } = string.Empty;
}

public class CreateBrandRequest
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class UpdateBrandRequest
{
    public string Version { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
