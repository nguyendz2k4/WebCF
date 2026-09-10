using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Contacts;
using VDungCoffe.Security;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Controllers.Admin;

[ApiController]
[Route("api/admin/contacts")]
[Authorize]
public class AdminContactsController : ControllerBase
{
    private readonly IContactService _contactService;

    public AdminContactsController(IContactService contactService)
    {
        _contactService = contactService;
    }

    [HttpGet]
    [HasPermission(Permissions.ContactsView)]
    public async Task<ActionResult<ApiResponse<PagedResult<AdminContactResponse>>>> GetContacts([FromQuery] AdminContactFilterQuery query)
    {
        var result = await _contactService.GetAdminContactsAsync(query);
        return Ok(ApiResponse<PagedResult<AdminContactResponse>>.Ok(result));
    }

    [HttpGet("{id:guid}")]
    [HasPermission(Permissions.ContactsView)]
    public async Task<ActionResult<ApiResponse<AdminContactResponse>>> GetContact(Guid id)
    {
        var result = await _contactService.GetContactByIdAsync(id);
        return Ok(ApiResponse<AdminContactResponse>.Ok(result));
    }

    [HttpPatch("{id:guid}/status")]
    [HasPermission(Permissions.ContactsManage)]
    public async Task<ActionResult<ApiResponse<AdminContactResponse>>> UpdateStatus(Guid id, [FromBody] UpdateContactStatusRequest request)
    {
        var result = await _contactService.UpdateContactStatusAsync(id, request);
        return Ok(ApiResponse<AdminContactResponse>.Ok(result, "Cập nhật tiến độ xử lý liên hệ thành công"));
    }
}
