using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Orders;
using VDungCoffe.Security;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Controllers.Admin;

[ApiController]
[Route("api/admin/orders")]
[Authorize]
public class AdminOrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public AdminOrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    [HasPermission(Permissions.OrdersView)]
    public async Task<ActionResult<ApiResponse<PagedResult<AdminOrderResponse>>>> GetOrders([FromQuery] AdminOrderFilterQuery query)
    {
        var result = await _orderService.GetAdminOrdersAsync(query);
        return Ok(ApiResponse<PagedResult<AdminOrderResponse>>.Ok(result));
    }

    [HttpGet("{id:guid}")]
    [HasPermission(Permissions.OrdersView)]
    public async Task<ActionResult<ApiResponse<AdminOrderResponse>>> GetOrder(Guid id)
    {
        var result = await _orderService.GetAdminOrderByIdAsync(id);
        return Ok(ApiResponse<AdminOrderResponse>.Ok(result));
    }

    [HttpPatch("{id:guid}/status")]
    [HasPermission(Permissions.OrdersUpdateStatus)]
    public async Task<ActionResult<ApiResponse<AdminOrderResponse>>> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
    {
        var result = await _orderService.UpdateOrderStatusAsync(id, request);
        return Ok(ApiResponse<AdminOrderResponse>.Ok(result, "Cập nhật trạng thái đơn hàng thành công"));
    }
}
