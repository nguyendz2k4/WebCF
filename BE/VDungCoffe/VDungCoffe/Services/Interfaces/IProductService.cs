using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Common;
using VDungCoffe.DTO.Admin.Products;
using VDungCoffe.DTO.User.Catalog;

namespace VDungCoffe.Services.Interfaces;

public interface IProductService
{
    // Admin API
    Task<PagedResult<AdminProductResponse>> GetAdminProductsAsync(AdminProductFilterQuery query);
    Task<AdminProductResponse> GetAdminProductByIdAsync(Guid id);
    Task<PublicProductResponse> GetProductPreviewAsync(Guid id);
    Task<AdminProductResponse> CreateProductAsync(CreateProductRequest request);
    Task<AdminProductResponse> UpdateProductGeneralAsync(Guid id, UpdateProductGeneralRequest request);
    Task<AdminProductResponse> UpdateProductPriceAsync(Guid id, UpdateProductPriceRequest request);
    Task<AdminProductResponse> PublishProductAsync(Guid id, PublishProductRequest request);
    Task SoftDeleteProductAsync(Guid id, DeleteResourceRequest request);

    // Public API
    Task<PagedResult<PublicProductResponse>> GetPublicProductsAsync(PublicCatalogQuery query);
    Task<PublicProductResponse> GetPublicProductBySlugAsync(string slug);
}
