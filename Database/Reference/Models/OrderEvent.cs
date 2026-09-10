namespace Aura.Api.Models;

public sealed class OrderEvent : BaseEntity
{
    public Guid OrderId { get; set; }
    public int Sequence { get; set; }
    public string Status { get; set; } = null!;
    public Guid ActorId { get; set; }
    public string? Note { get; set; }
    public Order Order { get; set; } = null!;
    public AppUser Actor { get; set; } = null!;
}
