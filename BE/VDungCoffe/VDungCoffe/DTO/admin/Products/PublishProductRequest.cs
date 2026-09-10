namespace VDungCoffe.DTO.Admin.Products;

public class PublishProductRequest
{
    public string Version { get; set; } = string.Empty; // Required for optimistic concurrency

    public bool IsPublished { get; set; }
}
