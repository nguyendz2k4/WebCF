using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Orders;
using VDungCoffe.DTO.User.Orders;

namespace VDungCoffe.Services.Interfaces;

public interface IOrderService
{
    // Admin
    Task<PagedResult<AdminOrderResponse>> GetAdminOrdersAsync(AdminOrderFilterQuery query);
    Task<AdminOrderResponse> GetAdminOrderByIdAsync(Guid id);
    Task<AdminOrderResponse> UpdateOrderStatusAsync(Guid id, UpdateOrderStatusRequest request);

    // Public Checkout
    Task<CheckoutQuoteResponse> CalculateQuoteAsync(CheckoutQuoteRequest request);
    Task<OrderReceiptResponse> CreateOrderAsync(CreateOrderRequest request, string? idempotencyKey);
    Task<OrderReceiptResponse> GetOrderReceiptAsync(Guid id);
}
