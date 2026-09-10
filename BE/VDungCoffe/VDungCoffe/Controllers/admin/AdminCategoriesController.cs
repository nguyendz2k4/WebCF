using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Categories;
using VDungCoffe.DTO.Admin.Common;
using VDungCoffe.DTO.Common;
using VDungCoffe.Security;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Controllers.Admin;

[ApiController]
[Route("api/admin/categories")]
[Authorize]
public class AdminCategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public AdminCategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    [HasPermission(Permissions.CategoriesView)]
    public async Task<ActionResult<ApiResponse<PagedResult<AdminCategoryResponse>>>> GetCategories([FromQuery] PaginationQuery query)
    {
        var result = await _categoryService.GetAdminCategoriesAsync(query);
        return Ok(ApiResponse<PagedResult<AdminCategoryResponse>>.Ok(result));
    }

    [HttpGet("{id:guid}")]
    [HasPermission(Permissions.CategoriesView)]
    public async Task<ActionResult<ApiResponse<AdminCategoryResponse>>> GetCategory(Guid id)
    {
        var result = await _categoryService.GetCategoryByIdAsync(id);
        return Ok(ApiResponse<AdminCategoryResponse>.Ok(result));
    }

    [HttpPost]
    [HasPermission(Permissions.CategoriesManage)]
    public async Task<ActionResult<ApiResponse<AdminCategoryResponse>>> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        var result = await _categoryService.CreateCategoryAsync(request);
        return CreatedAtAction(nameof(GetCategory), new { id = result.Id }, ApiResponse<AdminCategoryResponse>.Ok(result, "Tạo danh mục thành công"));
    }

    [HttpPut("{id:guid}")]
    [HasPermission(Permissions.CategoriesManage)]
    public async Task<ActionResult<ApiResponse<AdminCategoryResponse>>> UpdateCategory(Guid id, [FromBody] UpdateCategoryRequest request)
    {
        var result = await _categoryService.UpdateCategoryAsync(id, request);
        return Ok(ApiResponse<AdminCategoryResponse>.Ok(result, "Cập nhật danh mục thành công"));
    }

    [HttpDelete("{id:guid}")]
    [HasPermission(Permissions.CategoriesManage)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteCategory(Guid id, [FromBody] DeleteResourceRequest request)
    {
        await _categoryService.DeleteCategoryAsync(id, request);
        return Ok(ApiResponse<object>.Ok(new { id }, "Ẩn danh mục (Soft Delete) thành công"));
    }
}
