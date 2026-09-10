using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;

namespace VDungCoffe.Controllers.Admin;

[ApiController]
[Route("api/admin/workspace")]
[Authorize]
public class AdminWorkspaceController : ControllerBase
{
    [HttpGet]
    public IActionResult GetWorkspace() => StatusCode(StatusCodes.Status410Gone,
        ApiResponse<object>.Fail("API snapshot đã ngừng hỗ trợ. Sử dụng API admin riêng có phân quyền và phân trang: /api/admin/products, /api/admin/categories, /api/admin/brands, /api/admin/orders, /api/admin/articles, /api/admin/contacts."));
}
