using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Banners;
using VDungCoffe.DTO.Admin.Common;
using VDungCoffe.Security;
using VDungCoffe.Services.Interfaces;
namespace VDungCoffe.Controllers.Admin;
[ApiController, Route("api/admin/banners"), Authorize]
public class AdminBannersController(IBannerService banners) : ControllerBase
{
    [HttpGet, HasPermission(BannerPermissions.View)]
    public async Task<ActionResult<ApiResponse<PagedResult<AdminBannerResponse>>>> List([FromQuery] AdminBannerQuery query)
        => Ok(ApiResponse<PagedResult<AdminBannerResponse>>.Ok(await banners.GetAdminAsync(query)));
    [HttpGet("{id:guid}"), HasPermission(BannerPermissions.View)]
    public async Task<ActionResult<ApiResponse<AdminBannerResponse>>> Get(Guid id)
        => Ok(ApiResponse<AdminBannerResponse>.Ok(await banners.GetAdminByIdAsync(id)));
    [HttpGet("{id:guid}/preview"), HasPermission(BannerPermissions.View)]
    public async Task<ActionResult<ApiResponse<AdminBannerResponse>>> Preview(Guid id)
        => Ok(ApiResponse<AdminBannerResponse>.Ok(await banners.GetAdminByIdAsync(id)));
    [HttpPost, HasPermission(BannerPermissions.Create)]
    public async Task<ActionResult<ApiResponse<AdminBannerResponse>>> Create(CreateBannerRequest request)
    {
        var result = await banners.CreateAsync(request);
        return CreatedAtAction(nameof(Get), new { id = result.Id }, ApiResponse<AdminBannerResponse>.Ok(result));
    }
    [HttpPut("{id:guid}"), HasPermission(BannerPermissions.Edit)]
    public async Task<ActionResult<ApiResponse<AdminBannerResponse>>> Update(Guid id, UpdateBannerRequest request)
        => Ok(ApiResponse<AdminBannerResponse>.Ok(await banners.UpdateAsync(id, request)));
    [HttpPatch("{id:guid}/publish"), HasPermission(BannerPermissions.Publish)]
    public async Task<ActionResult<ApiResponse<AdminBannerResponse>>> Publish(Guid id, BannerPublishRequest request)
        => Ok(ApiResponse<AdminBannerResponse>.Ok(await banners.PublishAsync(id, request)));
    [HttpDelete("{id:guid}"), HasPermission(BannerPermissions.Delete)]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, [FromBody] DeleteResourceRequest request)
    {
        await banners.DeleteAsync(id, request);
        return Ok(ApiResponse<object>.Ok(new { id }));
    }
}
