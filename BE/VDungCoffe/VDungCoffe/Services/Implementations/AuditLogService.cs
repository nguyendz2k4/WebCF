using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.AuditLogs;
using VDungCoffe.Models;
using VDungCoffe.Security;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Services.Implementations;

public class AuditLogService : IAuditLogService
{
    private readonly AuraCoffeeContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly ILogger<AuditLogService> _logger;

    public AuditLogService(AuraCoffeeContext context, ICurrentUser currentUser, ILogger<AuditLogService> logger)
    {
        _context = context;
        _currentUser = currentUser;
        _logger = logger;
    }

    public async Task LogActionAsync(string action, string entityType, string entityId, object? oldValues = null, object? newValues = null)
    {
        try
        {
            var auditLog = new AuditLog
            {
                Id = Guid.NewGuid(),
                UserId = _currentUser.UserId,
                UserEmail = _currentUser.Email ?? "system",
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                OldValuesJson = oldValues != null ? JsonSerializer.Serialize(oldValues) : null,
                NewValuesJson = newValues != null ? JsonSerializer.Serialize(newValues) : null,
                IpAddress = _currentUser.IpAddress,
                CreatedAt = DateTime.UtcNow
            };

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to write audit log for action {Action} on {EntityType} {EntityId}", action, entityType, entityId);
            throw;
        }
    }

    public async Task<PagedResult<AuditLogResponse>> GetAuditLogsAsync(AuditLogFilterQuery query)
    {
        VDungCoffe.Common.ServiceInput.Validate(query);
        var dbQuery = _context.AuditLogs.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.EntityType))
        {
            dbQuery = dbQuery.Where(l => l.EntityType == query.EntityType);
        }

        if (!string.IsNullOrWhiteSpace(query.Action))
        {
            dbQuery = dbQuery.Where(l => l.Action == query.Action);
        }

        if (!string.IsNullOrWhiteSpace(query.UserEmail))
        {
            dbQuery = dbQuery.Where(l => l.UserEmail != null && l.UserEmail.Contains(query.UserEmail));
        }

        if (query.FromDate.HasValue)
        {
            dbQuery = dbQuery.Where(l => l.CreatedAt >= query.FromDate.Value);
        }

        if (query.ToDate.HasValue)
        {
            dbQuery = dbQuery.Where(l => l.CreatedAt <= query.ToDate.Value);
        }

        var totalItems = await dbQuery.CountAsync();

        var items = await dbQuery
            .Sort(query, "CreatedAt", "CreatedAt", "Action", "EntityType")
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(l => new AuditLogResponse
            {
                Id = l.Id,
                UserId = l.UserId,
                UserEmail = l.UserEmail,
                Action = l.Action,
                EntityType = l.EntityType,
                EntityId = l.EntityId,
                OldValuesJson = l.OldValuesJson,
                NewValuesJson = l.NewValuesJson,
                IpAddress = l.IpAddress,
                CreatedAt = l.CreatedAt
            })
            .ToListAsync();

        return new PagedResult<AuditLogResponse>
        {
            Items = items,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalItems = totalItems
        };
    }
}
