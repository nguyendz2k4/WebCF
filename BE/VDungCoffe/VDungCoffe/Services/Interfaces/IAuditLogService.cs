using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.AuditLogs;
using VDungCoffe.Models;

namespace VDungCoffe.Services.Interfaces;

public interface IAuditLogService
{
    Task LogActionAsync(string action, string entityType, string entityId, object? oldValues = null, object? newValues = null);
    Task<PagedResult<AuditLogResponse>> GetAuditLogsAsync(AuditLogFilterQuery query);
}
