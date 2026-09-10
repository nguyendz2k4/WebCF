using System;
using System.Collections.Generic;

namespace VDungCoffe.Models;

public partial class OrderItem
{
    public Guid Id { get; set; }

    public Guid OrderId { get; set; }

    public Guid ProductId { get; set; }

    public int LineNumber { get; set; }

    public string ProductName { get; set; } = null!;

    public string? Sku { get; set; }

    public string? Specification { get; set; }

    public string? UnitLabel { get; set; }

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal? LineTotal { get; set; }

    public decimal? TaxIncludedAmount { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
