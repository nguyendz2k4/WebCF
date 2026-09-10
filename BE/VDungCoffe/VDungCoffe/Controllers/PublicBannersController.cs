using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Banners;
using VDungCoffe.Services.Interfaces;
namespace VDungCoffe.Controllers.User;
[ApiController, Route("api/public/banners"), AllowAnonymous]
public class PublicBannersController(IBannerService banners) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<PublicBannerResponse>>>> List([FromQuery] BannerQuery query)
        => Ok(ApiResponse<PagedResult<PublicBannerResponse>>.Ok(await banners.GetPublicAsync(query)));
}
