using System;
using System.Collections.Generic;

namespace VDungCoffe.Models;

public partial class ContactInquiry
{
    public Guid Id { get; set; }

    public Guid? CustomerId { get; set; }

    public string FullName { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? BusinessName { get; set; }

    public string ServiceType { get; set; } = null!;

    public string? BudgetRange { get; set; }

    public string? Message { get; set; }

    public string Source { get; set; } = null!;

    public string? LegacyPackageCode { get; set; }

    public string? ConfigurationJson { get; set; }

    public string Status { get; set; } = null!;

    public byte[] Version { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual AppUser? Customer { get; set; }
}
