using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Contacts;
using VDungCoffe.DTO.User.Contacts;

namespace VDungCoffe.Services.Interfaces;

public interface IContactService
{
    Task<PagedResult<AdminContactResponse>> GetAdminContactsAsync(AdminContactFilterQuery query);
    Task<AdminContactResponse> GetContactByIdAsync(Guid id);
    Task<AdminContactResponse> UpdateContactStatusAsync(Guid id, UpdateContactStatusRequest request);
    Task SubmitContactAsync(ContactSubmitRequest request, string? idempotencyKey = null);
}
