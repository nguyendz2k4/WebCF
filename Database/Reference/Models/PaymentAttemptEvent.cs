namespace Aura.Api.Models;

public sealed class PaymentAttemptEvent : BaseEntity
{
    public Guid PaymentAttemptId { get; set; }
    public Guid ActorId { get; set; }
    public string EventType { get; set; } = null!;
    public string? Note { get; set; }
    public PaymentAttempt PaymentAttempt { get; set; } = null!;
    public AppUser Actor { get; set; } = null!;
}
