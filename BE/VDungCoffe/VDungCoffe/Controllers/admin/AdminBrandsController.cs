using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Brands;
using VDungCoffe.DTO.Admin.Common;
using VDungCoffe.DTO.Common;
using VDungCoffe.Security;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Controllers.Admin;

[ApiController]
[Route("api/admin/brands")]
[Authorize]
public class AdminBrandsController : ControllerBase
{
    private readonly IBrandService _brandService;

    public AdminBrandsController(IBrandService brandService)
    {
        _brandService = brandService;
    }

    [HttpGet]
    [HasPermission(Permissions.BrandsView)]
    public async Task<ActionResult<ApiResponse<PagedResult<AdminBrandResponse>>>> GetBrands([FromQuery] PaginationQuery query)
    {
        var result = await _brandService.GetAdminBrandsAsync(query);
        return Ok(ApiResponse<PagedResult<AdminBrandResponse>>.Ok(result));
    }

    [HttpGet("{id:guid}")]
    [HasPermission(Permissions.BrandsView)]
    public async Task<ActionResult<ApiResponse<AdminBrandResponse>>> GetBrand(Guid id)
    {
        var result = await _brandService.GetBrandByIdAsync(id);
        return Ok(ApiResponse<AdminBrandResponse>.Ok(result));
    }

    [HttpPost]
    [HasPermission(Permissions.BrandsManage)]
    public async Task<ActionResult<ApiResponse<AdminBrandResponse>>> CreateBrand([FromBody] CreateBrandRequest request)
    {
        var result = await _brandService.CreateBrandAsync(request);
        return CreatedAtAction(nameof(GetBrand), new { id = result.Id }, ApiResponse<AdminBrandResponse>.Ok(result, "Tạo thương hiệu thành công"));
    }

    [HttpPut("{id:guid}")]
    [HasPermission(Permissions.BrandsManage)]
    public async Task<ActionResult<ApiResponse<AdminBrandResponse>>> UpdateBrand(Guid id, [FromBody] UpdateBrandRequest request)
    {
        var result = await _brandService.UpdateBrandAsync(id, request);
        return Ok(ApiResponse<AdminBrandResponse>.Ok(result, "Cập nhật thương hiệu thành công"));
    }

    [HttpDelete("{id:guid}")]
    [HasPermission(Permissions.BrandsManage)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteBrand(Guid id, [FromBody] DeleteResourceRequest request)
    {
        await _brandService.DeleteBrandAsync(id, request);
        return Ok(ApiResponse<object>.Ok(new { id }, "Ẩn thương hiệu thành công"));
    }
}
