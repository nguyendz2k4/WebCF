namespace Aura.Api.Models;

public sealed class ProductMedia : BaseEntity
{
    public Guid ProductId { get; set; }
    public string Url { get; set; } = null!;
    public string? AltText { get; set; }
    public int Position { get; set; }
    public Product Product { get; set; } = null!;
}
