using System;
using System.Collections.Generic;

namespace VDungCoffe.Models;

public partial class PaymentEntry
{
    public Guid Id { get; set; }

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

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<PaymentEntry> InverseReversesEntry { get; set; } = new List<PaymentEntry>();

    public virtual Order Order { get; set; } = null!;

    public virtual PaymentAttempt PaymentAttempt { get; set; } = null!;

    public virtual AppUser RecordedBy { get; set; } = null!;

    public virtual PaymentEntry? ReversesEntry { get; set; }
}
