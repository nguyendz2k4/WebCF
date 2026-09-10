namespace Aura.Api.Models;

public sealed class Brand : BaseEntity
{
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public bool IsActive { get; set; } = true;
    public byte[] Version { get; set; } = [];
}
