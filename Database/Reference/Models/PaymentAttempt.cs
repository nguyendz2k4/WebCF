namespace Aura.Api.Models;

public sealed class PaymentAttempt : BaseEntity
{
    public Guid OrderId { get; set; }
    public Guid RequestedById { get; set; }
    public Guid IdempotencyKey { get; set; }
    public string Method { get; set; } = null!;
    public decimal RequestedAmount { get; set; }
    public string? TransferReference { get; set; }
    public string? DestinationSnapshot { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public Order Order { get; set; } = null!;
    public AppUser RequestedBy { get; set; } = null!;
}
