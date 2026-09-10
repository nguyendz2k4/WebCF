using System;
using System.Collections.Generic;

namespace VDungCoffe.Models;

public partial class PaymentAttemptEvent
{
    public Guid Id { get; set; }

    public Guid PaymentAttemptId { get; set; }

    public Guid ActorId { get; set; }

    public string EventType { get; set; } = null!;

    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual AppUser Actor { get; set; } = null!;

    public virtual PaymentAttempt PaymentAttempt { get; set; } = null!;
}
