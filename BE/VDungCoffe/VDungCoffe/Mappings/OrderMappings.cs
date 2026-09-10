using VDungCoffe.DTO.Admin.Orders;
using VDungCoffe.Models;

namespace VDungCoffe.Mappings;

public static class OrderMappings
{
    public static AdminOrderResponse ToAdminDto(this Order order)
    {
        var latestEvent = order.OrderEvents?.OrderByDescending(e => e.Sequence).FirstOrDefault();
        var status = latestEvent?.Status ?? "submitted";
        var hasPayment = order.PaymentEntries?.Any(p => p.Kind == "receipt") == true;
        var paymentStatus = hasPayment ? "Đã thanh toán" : "Chưa thanh toán";

        return new AdminOrderResponse
        {
            CurrentSequence = latestEvent?.Sequence ?? 0,
            Id = order.Id,
            OrderCode = order.OrderCode,
            CustomerId = order.CustomerId,
            CustomerName = order.Customer?.DisplayName ?? order.RecipientName,
            CustomerEmail = order.Email ?? order.Customer?.Email ?? string.Empty,
            CustomerPhone = order.Phone,
            ShippingAddress = $"{order.AddressLine}, {order.District}, {order.Province}",
            Status = status,
            PaymentStatus = paymentStatus,
            Subtotal = order.Subtotal,
            ShippingFee = order.ShippingFee,
            GrandTotal = order.Total,
            Currency = order.Currency,
            CustomerNote = order.DeliveryNote,
            CreatedAt = order.CreatedAt,
            UpdatedAt = latestEvent?.CreatedAt ?? order.CreatedAt,
            Version = order.Version != null ? Convert.ToBase64String(order.Version) : string.Empty,
            Items = order.OrderItems?.Select(i => new AdminOrderItemResponse
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                ProductSku = i.Sku,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                LineTotal = i.LineTotal ?? (i.UnitPrice * i.Quantity)
            }).ToList() ?? new List<AdminOrderItemResponse>()
        };
    }

    public static Dictionary<string, object?> ToAdminRow(this Order order)
    {
        var latestEvent = order.OrderEvents?.OrderByDescending(e => e.Sequence).FirstOrDefault();
        var status = latestEvent?.Status ?? "submitted";
        var hasPayment = order.PaymentEntries?.Any(p => p.Kind == "receipt") == true;
        var paymentStatus = hasPayment ? "Đã thanh toán" : "Chưa thanh toán";

        var itemNames = order.OrderItems?.Select(i => $"{i.ProductName} x{i.Quantity}").ToList() ?? new List<string>();
        var description = itemNames.Count > 0 ? string.Join(", ", itemNames) : (order.DeliveryNote ?? string.Empty);

        return new Dictionary<string, object?>
        {
            ["id"] = order.Id.ToString(),
            ["name"] = order.OrderCode,
            ["customer"] = order.Customer?.DisplayName ?? order.RecipientName,
            ["email"] = order.Email ?? order.Customer?.Email ?? string.Empty,
            ["total"] = order.Total,
            ["date"] = order.CreatedAt.ToString("yyyy-MM-dd"),
            ["status"] = status,
            ["payment"] = paymentStatus,
            ["description"] = description,
            ["version"] = order.Version != null ? Convert.ToBase64String(order.Version) : string.Empty
        };
    }
}
