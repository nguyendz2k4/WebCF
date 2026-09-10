namespace Aura.Api.Models;

public sealed class Order : BaseEntity
{
    public string OrderCode { get; set; } = null!;
    public Guid CustomerId { get; set; }
    public Guid IdempotencyKey { get; set; }
    public string RequestHash { get; set; } = null!;
    public string Currency { get; set; } = null!;
    public string PreferredPaymentMethod { get; set; } = null!;
    public string RecipientName { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string? Email { get; set; }
    public string AddressLine { get; set; } = null!;
    public string Province { get; set; } = null!;
    public string? District { get; set; }
    public string? DeliveryNote { get; set; }
    public decimal Subtotal { get; set; }
    public decimal DiscountTotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal Total { get; set; }
    public decimal? TaxIncludedAmount { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public byte[] Version { get; set; } = [];
    public AppUser Customer { get; set; } = null!;
}
