namespace VDungCoffe.Models;

public class AuditLog
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public string? UserEmail { get; set; }

    public string Action { get; set; } = null!; // e.g. "Create", "UpdateGeneral", "UpdatePrice", "SoftDelete", "Publish", "Unpublish"

    public string EntityType { get; set; } = null!; // e.g. "Product", "Category", "Brand", "Order", "NewsArticle"

    public string EntityId { get; set; } = null!;

    public string? OldValuesJson { get; set; }

    public string? NewValuesJson { get; set; }

    public string? IpAddress { get; set; }

    public DateTime CreatedAt { get; set; }
}
