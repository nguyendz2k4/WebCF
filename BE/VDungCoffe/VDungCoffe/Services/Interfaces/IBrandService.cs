using VDungCoffe.DTO.User.Catalog;
using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Brands;
using VDungCoffe.DTO.Admin.Common;
using VDungCoffe.DTO.Common;

namespace VDungCoffe.Services.Interfaces;

public interface IBrandService
{
    Task<PagedResult<AdminBrandResponse>> GetAdminBrandsAsync(PaginationQuery query);
    Task<AdminBrandResponse> GetBrandByIdAsync(Guid id);
    Task<AdminBrandResponse> CreateBrandAsync(CreateBrandRequest request);
    Task<AdminBrandResponse> UpdateBrandAsync(Guid id, UpdateBrandRequest request);
    Task DeleteBrandAsync(Guid id, DeleteResourceRequest request); // Soft delete
    Task<PagedResult<PublicBrandResponse>> GetActiveBrandsAsync(PaginationQuery query);
}

