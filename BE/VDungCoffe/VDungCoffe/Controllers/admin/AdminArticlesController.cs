using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Articles;
using VDungCoffe.DTO.Admin.Common;
using VDungCoffe.Security;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Controllers.Admin;

[ApiController]
[Route("api/admin/articles")]
[Authorize]
public class AdminArticlesController : ControllerBase
{
    private readonly IArticleService _articleService;

    public AdminArticlesController(IArticleService articleService)
    {
        _articleService = articleService;
    }

    [HttpGet]
    [HasPermission(Permissions.ArticlesView)]
    public async Task<ActionResult<ApiResponse<PagedResult<AdminArticleResponse>>>> GetArticles([FromQuery] AdminArticleFilterQuery query)
    {
        var result = await _articleService.GetAdminArticlesAsync(query);
        return Ok(ApiResponse<PagedResult<AdminArticleResponse>>.Ok(result));
    }

    [HttpGet("{id:guid}")]
    [HasPermission(Permissions.ArticlesView)]
    public async Task<ActionResult<ApiResponse<AdminArticleResponse>>> GetArticle(Guid id)
    {
        var result = await _articleService.GetAdminArticleByIdAsync(id);
        return Ok(ApiResponse<AdminArticleResponse>.Ok(result));
    }

    [HttpPost]
    [HasPermission(Permissions.ArticlesCreate)]
    public async Task<ActionResult<ApiResponse<AdminArticleResponse>>> CreateArticle([FromBody] CreateArticleRequest request)
    {
        var result = await _articleService.CreateArticleAsync(request);
        return CreatedAtAction(nameof(GetArticle), new { id = result.Id }, ApiResponse<AdminArticleResponse>.Ok(result, "Tạo bài viết thành công"));
    }

    [HttpPut("{id:guid}")]
    [HasPermission(Permissions.ArticlesEdit)]
    public async Task<ActionResult<ApiResponse<AdminArticleResponse>>> UpdateArticle(Guid id, [FromBody] UpdateArticleRequest request)
    {
        var result = await _articleService.UpdateArticleAsync(id, request);
        return Ok(ApiResponse<AdminArticleResponse>.Ok(result, "Cập nhật bài viết thành công"));
    }

    [HttpDelete("{id:guid}")]
    [HasPermission(Permissions.ArticlesDelete)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteArticle(Guid id, [FromBody] DeleteResourceRequest request)
    {
        await _articleService.DeleteArticleAsync(id, request);
        return Ok(ApiResponse<object>.Ok(new { id }, "Lưu trữ bài viết thành công"));
    }

    [HttpPatch("{id:guid}/publish")]
    [HasPermission(Permissions.ArticlesPublish)]
    public async Task<IActionResult> Publish(Guid id, PublishArticleRequest request) =>
        Ok(ApiResponse<AdminArticleResponse>.Ok(await _articleService.PublishArticleAsync(id, request)));

    [HttpGet("{id:guid}/preview")]
    [HasPermission(Permissions.ArticlesView)]
    public async Task<IActionResult> Preview(Guid id) =>
        Ok(ApiResponse<VDungCoffe.DTO.User.Catalog.PublicArticleResponse>.Ok(await _articleService.PreviewArticleAsync(id)));
}
