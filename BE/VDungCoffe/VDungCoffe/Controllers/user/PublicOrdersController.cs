using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;
using VDungCoffe.DTO.User.Orders;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Controllers.User;

[Authorize]
[ApiController]
[Route("api")]
public class PublicOrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public PublicOrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost("checkout/quote")]
    public async Task<ActionResult<ApiResponse<CheckoutQuoteResponse>>> CalculateQuote([FromBody] CheckoutQuoteRequest request)
    {
        var result = await _orderService.CalculateQuoteAsync(request);
        return Ok(ApiResponse<CheckoutQuoteResponse>.Ok(result, "Tạo báo giá đơn hàng thành công"));
    }

    [HttpPost("orders")]
    public async Task<ActionResult<ApiResponse<OrderReceiptResponse>>> CreateOrder(
        [FromBody] CreateOrderRequest request,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey)
    {
        var result = await _orderService.CreateOrderAsync(request, idempotencyKey);
        return Ok(ApiResponse<OrderReceiptResponse>.Ok(result, "Đặt hàng thành công"));
    }

    [HttpGet("orders/{id:guid}")]
    public async Task<ActionResult<ApiResponse<OrderReceiptResponse>>> GetOrderReceipt(Guid id)
    {
        var result = await _orderService.GetOrderReceiptAsync(id);
        return Ok(ApiResponse<OrderReceiptResponse>.Ok(result));
    }
}

