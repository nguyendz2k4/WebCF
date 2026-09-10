namespace Aura.Api.Models;

public sealed class AppUser : BaseEntity
{
    public string IdentityIssuer { get; set; } = null!;
    public string IdentitySubject { get; set; } = null!;
    public string DisplayName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }
    public string? CustomerPersona { get; set; }
    public string? ShopName { get; set; }
    public DateTime? DisabledAt { get; set; }
    public byte[] Version { get; set; } = [];
}
