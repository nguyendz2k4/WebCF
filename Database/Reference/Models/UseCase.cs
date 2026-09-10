namespace Aura.Api.Models;

public sealed class UseCase : BaseEntity
{
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public byte[] Version { get; set; } = [];
}
