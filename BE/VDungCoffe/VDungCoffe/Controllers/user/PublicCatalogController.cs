using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;


using VDungCoffe.DTO.Common;
using VDungCoffe.DTO.User.Catalog;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Controllers.User;

[ApiController]
[Route("api/catalog")]
public class PublicCatalogController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ICategoryService _categoryService;
    private readonly IBrandService _brandService;
    private readonly IArticleService _articleService;

    public PublicCatalogController(
        IProductService productService,
        ICategoryService categoryService,
        IBrandService brandService,
        IArticleService articleService)
    {
        _productService = productService;
        _categoryService = categoryService;
        _brandService = brandService;
        _articleService = articleService;
    }

    [HttpGet("products")]
    public async Task<ActionResult<ApiResponse<PagedResult<PublicProductResponse>>>> GetProducts([FromQuery] PublicCatalogQuery query)
    {
        var result = await _productService.GetPublicProductsAsync(query);
        return Ok(ApiResponse<PagedResult<PublicProductResponse>>.Ok(result));
    }

    [HttpGet("products/{slug}")]
    public async Task<ActionResult<ApiResponse<PublicProductResponse>>> GetProductBySlug(string slug)
    {
        var result = await _productService.GetPublicProductBySlugAsync(slug);
        return Ok(ApiResponse<PublicProductResponse>.Ok(result));
    }

    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<PagedResult<PublicCategoryResponse>>>> GetCategories([FromQuery] PublicCategoryQuery query)
    {
        var result = await _categoryService.GetActiveCategoriesAsync(query);
        return Ok(ApiResponse<PagedResult<PublicCategoryResponse>>.Ok(result));
    }

    [HttpGet("brands")]
    public async Task<ActionResult<ApiResponse<PagedResult<PublicBrandResponse>>>> GetBrands([FromQuery] PaginationQuery query)
    {
        var result = await _brandService.GetActiveBrandsAsync(query);
        return Ok(ApiResponse<PagedResult<PublicBrandResponse>>.Ok(result));
    }

    [HttpGet("articles")]
    public async Task<ActionResult<ApiResponse<PagedResult<PublicArticleResponse>>>> GetArticles([FromQuery] PaginationQuery query)
    {
        var result = await _articleService.GetPublicArticlesAsync(query);
        return Ok(ApiResponse<PagedResult<PublicArticleResponse>>.Ok(result));
    }

    [HttpGet("articles/{slug}")]
    public async Task<ActionResult<ApiResponse<PublicArticleResponse>>> GetArticleBySlug(string slug)
    {
        var result = await _articleService.GetPublicArticleBySlugAsync(slug);
        return Ok(ApiResponse<PublicArticleResponse>.Ok(result));
    }
}

