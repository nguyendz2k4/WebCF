using System;
using System.Collections.Generic;

namespace VDungCoffe.Models;

public partial class CurrentOrderStatus
{
    public Guid OrderId { get; set; }

    public string Status { get; set; } = null!;

    public int Sequence { get; set; }

    public DateTime StatusAt { get; set; }
}
