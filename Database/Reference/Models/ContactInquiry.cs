namespace Aura.Api.Models;

public sealed class ContactInquiry : BaseEntity
{
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
    public string Status { get; set; } = "new";
    public byte[] Version { get; set; } = [];
    public AppUser? Customer { get; set; }
}
