using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace VDungCoffe.Models;

public partial class AppUser : IdentityUser<Guid>
{
    // Legacy identifiers retained for existing data; Identity manages new logins.
    public string? IdentityIssuer { get; set; }

    public string? IdentitySubject { get; set; }

    public string DisplayName { get; set; } = null!;

    public string? AvatarUrl { get; set; }

    public string? CustomerPersona { get; set; }

    public string? ShopName { get; set; }

    public string? Address { get; set; }

    // retail = Khach le, partner = Doi tac, business = Doanh nghiep.
    public string? CustomerGroup { get; set; }

    public DateTime? DisabledAt { get; set; }

    public byte[] Version { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<ContactInquiry> ContactInquiries { get; set; } = new List<ContactInquiry>();

    public virtual ICollection<OrderEvent> OrderEvents { get; set; } = new List<OrderEvent>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<PaymentAttemptEvent> PaymentAttemptEvents { get; set; } = new List<PaymentAttemptEvent>();

    public virtual ICollection<PaymentAttempt> PaymentAttempts { get; set; } = new List<PaymentAttempt>();

    public virtual ICollection<PaymentEntry> PaymentEntries { get; set; } = new List<PaymentEntry>();
}
