namespace Aura.Api.Models;

public sealed class PaymentEntry : BaseEntity
{
    public Guid OrderId { get; set; }
    public Guid PaymentAttemptId { get; set; }
    public Guid RecordedById { get; set; }
    public Guid IdempotencyKey { get; set; }
    public string Kind { get; set; } = null!;
    public decimal Amount { get; set; }
    public string ExternalSource { get; set; } = null!;
    public string ExternalReference { get; set; } = null!;
    public DateTime OccurredAt { get; set; }
    public Guid? ReversesEntryId { get; set; }
    public string? Reason { get; set; }
    public Order Order { get; set; } = null!;
    public PaymentAttempt PaymentAttempt { get; set; } = null!;
    public AppUser RecordedBy { get; set; } = null!;
    public PaymentEntry? ReversesEntry { get; set; }
}
