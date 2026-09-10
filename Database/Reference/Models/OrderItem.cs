namespace Aura.Api.Models;

public sealed class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public int LineNumber { get; set; }
    public string ProductName { get; set; } = null!;
    public string? Sku { get; set; }
    public string? Specification { get; set; }
    public string? UnitLabel { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal LineTotal { get; private set; }
    public decimal? TaxIncludedAmount { get; set; }
    public Order Order { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
