using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.AuditLogs;
using VDungCoffe.Security;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Controllers.Admin;

[ApiController]
[Route("api/admin/audit-logs")]
[Authorize]
public class AdminAuditLogsController : ControllerBase
{
    private readonly IAuditLogService _auditLogService;

    public AdminAuditLogsController(IAuditLogService auditLogService)
    {
        _auditLogService = auditLogService;
    }

    [HttpGet]
    [HasPermission(Permissions.AuditLogsView)]
    public async Task<ActionResult<ApiResponse<PagedResult<AuditLogResponse>>>> GetAuditLogs([FromQuery] AuditLogFilterQuery query)
    {
        var result = await _auditLogService.GetAuditLogsAsync(query);
        return Ok(ApiResponse<PagedResult<AuditLogResponse>>.Ok(result));
    }
}
