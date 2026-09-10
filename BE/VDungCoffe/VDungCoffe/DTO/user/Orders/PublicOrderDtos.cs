using VDungCoffe.DTO.User.Cart;

namespace VDungCoffe.DTO.User.Orders;

public class CheckoutQuoteRequest
{
    public string RecipientName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string AddressLine { get; set; } = string.Empty;
    public string? DeliveryNote { get; set; }
    public List<QuoteItemRequest> Items { get; set; } = new();
}

public class QuoteItemRequest
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}

public class PaymentMethodOptionDto
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
}

public class CheckoutQuoteResponse
{
    public string Id { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public string ExpiresAt { get; set; } = string.Empty;
    public List<CartItemDto> Items { get; set; } = new();
    public List<PaymentMethodOptionDto> PaymentMethods { get; set; } = new();
}

public class CreateOrderRequest
{
    public string QuoteId { get; set; } = string.Empty;
    public string PreferredPaymentMethod { get; set; } = string.Empty;
    public bool FromCart { get; set; } = false;
}

public class OrderReceiptResponse
{
    public string Id { get; set; } = string.Empty;
    public string OrderCode { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
}
