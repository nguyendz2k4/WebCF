using System;
using System.Collections.Generic;

namespace VDungCoffe.Models;

public partial class PaymentAttempt
{
    public Guid Id { get; set; }

    public Guid OrderId { get; set; }

    public Guid RequestedById { get; set; }

    public Guid IdempotencyKey { get; set; }

    public string Method { get; set; } = null!;

    public decimal RequestedAmount { get; set; }

    public string? TransferReference { get; set; }

    public string? DestinationSnapshot { get; set; }

    public DateTime? ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual ICollection<PaymentAttemptEvent> PaymentAttemptEvents { get; set; } = new List<PaymentAttemptEvent>();

    public virtual ICollection<PaymentEntry> PaymentEntries { get; set; } = new List<PaymentEntry>();

    public virtual AppUser RequestedBy { get; set; } = null!;
}
