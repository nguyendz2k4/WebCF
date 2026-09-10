using VDungCoffe.DTO.Common;

namespace VDungCoffe.DTO.Admin.Orders;

public class AdminOrderResponse
{
    public int CurrentSequence { get; set; }
    public Guid Id { get; set; }
    public string OrderCode { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public string ShippingAddress { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // "submitted", "processing", "dispatched", "completed", "cancelled"
    public string PaymentStatus { get; set; } = string.Empty; // "Chưa thanh toán", "Đã thanh toán", etc.
    public decimal Subtotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal GrandTotal { get; set; }
    public string Currency { get; set; } = "VND";
    public string? CustomerNote { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string Version { get; set; } = string.Empty;

    public List<AdminOrderItemResponse> Items { get; set; } = new();
}

public class AdminOrderItemResponse
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ProductSku { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal { get; set; }
}

public class UpdateOrderStatusRequest
{
    public int ExpectedSequence { get; set; }
    public string Version { get; set; } = string.Empty; // Concurrency check
    public string Status { get; set; } = string.Empty;
    public string? Note { get; set; }
}

public class AdminOrderFilterQuery : PaginationQuery
{
    public string? Status { get; set; }
    public string? PaymentStatus { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
