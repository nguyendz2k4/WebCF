using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VDungCoffe.Common;
using VDungCoffe.DTO.Common;
using VDungCoffe.Models;
using VDungCoffe.Security;

namespace VDungCoffe.Controllers.Admin;

[ApiController, Authorize, Route("api/admin")]
public class AdminReadModelsController(AuraCoffeeContext db) : ControllerBase
{
    [HttpGet("customers"), HasPermission(Permissions.CustomersView)]
    public async Task<IActionResult> Customers([FromQuery] PaginationQuery query, CancellationToken cancellationToken)
    {
        ServiceInput.Validate(query);
        // Customer directory does not expose staff accounts or Identity credentials.
        var source = db.Users.AsNoTracking().Where(u => !db.UserRoles.Any(r => r.UserId == u.Id));
        var count = await source.CountAsync(cancellationToken);
        var rows = await source.OrderBy(u => u.CreatedAt).ThenBy(u => u.Id)
            .Skip((query.Page - 1) * query.PageSize).Take(query.PageSize)
            .Select(u => new { u.Id, Name = u.DisplayName, Email = u.Email ?? "", Phone = u.PhoneNumber ?? "", Address = u.Address ?? "", Status = u.CustomerGroup == "business" ? "Doanh nghiệp" : u.CustomerGroup == "partner" ? "Đối tác" : "Khách lẻ" })
            .ToListAsync(cancellationToken);
        return Ok(ApiResponse<PagedResult<object>>.Ok(new() { Items = rows.Cast<object>().ToList(), Page = query.Page, PageSize = query.PageSize, TotalItems = count }));
    }

    [HttpGet("payments"), HasPermission(Permissions.PaymentsView)]
    public async Task<IActionResult> Payments([FromQuery] PaginationQuery query, CancellationToken cancellationToken)
    {
        ServiceInput.Validate(query);
        var source = db.Set<PaymentEntry>().AsNoTracking();
        var count = await source.CountAsync(cancellationToken);
        var entries = await source.OrderByDescending(e => e.OccurredAt).ThenBy(e => e.Id)
            .Skip((query.Page - 1) * query.PageSize).Take(query.PageSize)
            .Select(e => new { e.Id, e.ExternalReference, Order = e.Order.OrderCode, Customer = e.Order.RecipientName,
                Total = e.Amount, e.PaymentAttempt.Method, Date = e.OccurredAt, e.Kind }).ToListAsync(cancellationToken);
        var rows = entries.Select(e => (object)new { e.Id, Name = string.IsNullOrEmpty(e.ExternalReference) ? e.Id.ToString() : e.ExternalReference,
            e.Order, e.Customer, e.Total, e.Method, Date = e.Date.ToString("yyyy-MM-dd"), Status = e.Kind == "receipt" ? "Đã ghi nhận thu" : e.Kind == "refund" ? "Đã ghi nhận hoàn" : e.Kind }).ToList();
        return Ok(ApiResponse<PagedResult<object>>.Ok(new() { Items = rows, Page = query.Page, PageSize = query.PageSize, TotalItems = count }));
    }
}
