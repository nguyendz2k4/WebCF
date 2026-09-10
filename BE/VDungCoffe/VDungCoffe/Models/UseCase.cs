using System;
using System.Collections.Generic;

namespace VDungCoffe.Models;

public partial class UseCase
{
    public Guid Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; }

    public byte[] Version { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<ProductUseCase> ProductUseCases { get; set; } = new List<ProductUseCase>();
}
