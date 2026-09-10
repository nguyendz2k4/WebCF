using System;
using System.Collections.Generic;

namespace VDungCoffe.Models;

public partial class OrderPaymentBalance
{
    public Guid OrderId { get; set; }

    public string OrderCode { get; set; } = null!;

    public string Currency { get; set; } = null!;

    public decimal Total { get; set; }

    public decimal? ReceivedAmount { get; set; }

    public decimal? RefundedAmount { get; set; }

    public decimal? NetReceived { get; set; }

    public decimal? OutstandingAmount { get; set; }
}
