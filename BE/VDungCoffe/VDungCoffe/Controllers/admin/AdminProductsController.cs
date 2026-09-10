using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Common;
using VDungCoffe.DTO.Admin.Products;
using VDungCoffe.DTO.User.Catalog;
using VDungCoffe.Security;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Controllers.Admin;

[ApiController]
[Route("api/admin/products")]
[Authorize]
public class AdminProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public AdminProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    [HasPermission(Permissions.ProductsView)]
    public async Task<ActionResult<ApiResponse<PagedResult<AdminProductResponse>>>> GetProducts([FromQuery] AdminProductFilterQuery query)
    {
        var result = await _productService.GetAdminProductsAsync(query);
        return Ok(ApiResponse<PagedResult<AdminProductResponse>>.Ok(result));
    }

    [HttpGet("{id:guid}")]
    [HasPermission(Permissions.ProductsView)]
    public async Task<ActionResult<ApiResponse<AdminProductResponse>>> GetProduct(Guid id)
    {
        var result = await _productService.GetAdminProductByIdAsync(id);
        return Ok(ApiResponse<AdminProductResponse>.Ok(result));
    }

    [HttpGet("{id:guid}/preview")]
    [HasPermission(Permissions.ProductsView)]
    public async Task<ActionResult<ApiResponse<PublicProductResponse>>> PreviewProduct(Guid id)
    {
        var result = await _productService.GetProductPreviewAsync(id);
        return Ok(ApiResponse<PublicProductResponse>.Ok(result, "Xem trước sản phẩm nháp"));
    }

    [HttpPost]
    [HasPermission(Permissions.ProductsCreate)]
    public async Task<ActionResult<ApiResponse<AdminProductResponse>>> CreateProduct([FromBody] CreateProductRequest request)
    {
        var result = await _productService.CreateProductAsync(request);
        return CreatedAtAction(nameof(GetProduct), new { id = result.Id }, ApiResponse<AdminProductResponse>.Ok(result, "Tạo sản phẩm thành công (bản nháp)"));
    }

    [HttpPut("{id:guid}")]
    [HasPermission(Permissions.ProductsEditGeneral)]
    public async Task<ActionResult<ApiResponse<AdminProductResponse>>> UpdateProductGeneral(Guid id, [FromBody] UpdateProductGeneralRequest request)
    {
        var result = await _productService.UpdateProductGeneralAsync(id, request);
        return Ok(ApiResponse<AdminProductResponse>.Ok(result, "Cập nhật thông tin sản phẩm thành công"));
    }

    [HttpPatch("{id:guid}/price")]
    [HasPermission(Permissions.ProductsEditPrice)]
    public async Task<ActionResult<ApiResponse<AdminProductResponse>>> UpdateProductPrice(Guid id, [FromBody] UpdateProductPriceRequest request)
    {
        var result = await _productService.UpdateProductPriceAsync(id, request);
        return Ok(ApiResponse<AdminProductResponse>.Ok(result, "Cập nhật giá sản phẩm thành công"));
    }

    [HttpPatch("{id:guid}/publish")]
    [HasPermission(Permissions.ProductsPublish)]
    public async Task<ActionResult<ApiResponse<AdminProductResponse>>> PublishProduct(Guid id, [FromBody] PublishProductRequest request)
    {
        var result = await _productService.PublishProductAsync(id, request);
        var msg = request.IsPublished ? "Xuất bản sản phẩm lên cửa hàng thành công" : "Đã chuyển sản phẩm về bản nháp";
        return Ok(ApiResponse<AdminProductResponse>.Ok(result, msg));
    }

    [HttpDelete("{id:guid}")]
    [HasPermission(Permissions.ProductsDelete)]
    public async Task<ActionResult<ApiResponse<object>>> SoftDeleteProduct(Guid id, [FromBody] DeleteResourceRequest request)
    {
        await _productService.SoftDeleteProductAsync(id, request);
        return Ok(ApiResponse<object>.Ok(new { id }, "Lưu trữ (Soft Delete) sản phẩm thành công, an toàn với lịch sử đơn hàng"));
    }
}
