using System;
using System.Collections.Generic;

namespace VDungCoffe.Models;

public partial class OrderEvent
{
    public Guid Id { get; set; }

    public Guid OrderId { get; set; }

    public int Sequence { get; set; }

    public string Status { get; set; } = null!;

    public Guid ActorId { get; set; }

    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual AppUser Actor { get; set; } = null!;

    public virtual Order Order { get; set; } = null!;
}
