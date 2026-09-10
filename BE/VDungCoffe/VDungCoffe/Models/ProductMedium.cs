using System;
using System.Collections.Generic;

namespace VDungCoffe.Models;

public partial class ProductMedium
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }

    public string Url { get; set; } = null!;

    public string? AltText { get; set; }

    public int Position { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Product Product { get; set; } = null!;
}
