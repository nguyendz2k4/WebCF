using Microsoft.EntityFrameworkCore;
using VDungCoffe.Common;
using VDungCoffe.Common.Exceptions;
using VDungCoffe.DTO.Admin.Contacts;
using VDungCoffe.DTO.User.Contacts;
using VDungCoffe.Mappings;
using VDungCoffe.Models;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Services.Implementations;

public class ContactService : IContactService
{
    private readonly AuraCoffeeContext _context;
    private readonly IAuditLogService _auditLog;

    public ContactService(AuraCoffeeContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    public async Task<PagedResult<AdminContactResponse>> GetAdminContactsAsync(AdminContactFilterQuery query)
    {
        VDungCoffe.Common.ServiceInput.Validate(query);
        var dbQuery = _context.ContactInquiries.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            dbQuery = dbQuery.Where(c => c.Status == query.Status);
        }

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var kw = query.Keyword.Trim();
            dbQuery = dbQuery.Where(c => c.FullName.Contains(kw) || c.Email.Contains(kw) || c.Phone.Contains(kw));
        }

        var total = await dbQuery.CountAsync();
        var items = await dbQuery
            .Sort(query, "CreatedAt", "CreatedAt", "FullName", "Status")
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        return new PagedResult<AdminContactResponse>
        {
            Items = items.Select(c => c.ToAdminDto()).ToList(),
            Page = query.Page,
            PageSize = query.PageSize,
            TotalItems = total
        };
    }

    public async Task<AdminContactResponse> GetContactByIdAsync(Guid id)
    {
        var contact = await _context.ContactInquiries.FirstOrDefaultAsync(c => c.Id == id);
        if (contact == null) throw new NotFoundException("Yêu cầu liên hệ", id);
        return contact.ToAdminDto();
    }

    public async Task<AdminContactResponse> UpdateContactStatusAsync(Guid id, UpdateContactStatusRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var contact = await _context.ContactInquiries.FirstOrDefaultAsync(c => c.Id == id);
        if (contact == null) throw new NotFoundException("Yêu cầu liên hệ", id);

        _context.Entry(contact).Property(c => c.Version).OriginalValue = ServiceInput.DecodeVersion(request.Version);
        _context.Entry(contact).Property(c => c.Status).IsModified = true;
        var oldStatus = contact.Status;
        contact.Status = request.Status;

        await _context.SaveChangesAsync();

        await _auditLog.LogActionAsync("UpdateStatus", "ContactInquiry", contact.Id.ToString(), new { Status = oldStatus }, new { Status = contact.Status });

        return contact.ToAdminDto();
    }

    public async Task SubmitContactAsync(ContactSubmitRequest request, string? idempotencyKey = null)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var inquiry = new ContactInquiry
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim(),
            Phone = request.Phone.Trim(),
            BusinessName = request.BusinessName?.Trim(),
            ServiceType = request.ServiceType,
            BudgetRange = request.BudgetRange,
            Message = request.Message.Trim(),
            Source = "contact",
            Status = "new",
            CreatedAt = DateTime.UtcNow
        };

        _context.ContactInquiries.Add(inquiry);
        await _context.SaveChangesAsync();
    }
}
