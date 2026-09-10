using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;
using VDungCoffe.DTO.User.Contacts;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Controllers.User;

[ApiController]
[Route("api/contacts")]
public class PublicContactsController : ControllerBase
{
    private readonly IContactService _contactService;

    public PublicContactsController(IContactService contactService)
    {
        _contactService = contactService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<object>>> SubmitContact(
        [FromBody] ContactSubmitRequest request,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey)
    {
        await _contactService.SubmitContactAsync(request, idempotencyKey);
        return Ok(ApiResponse<object>.Ok(new { }, "Gửi thông tin liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất!"));
    }
}
