using VDungCoffe.DTO.User.Catalog;
using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Categories;
using VDungCoffe.DTO.Admin.Common;
using VDungCoffe.DTO.Common;

namespace VDungCoffe.Services.Interfaces;

public interface ICategoryService
{
    Task<PagedResult<AdminCategoryResponse>> GetAdminCategoriesAsync(PaginationQuery query);
    Task<AdminCategoryResponse> GetCategoryByIdAsync(Guid id);
    Task<AdminCategoryResponse> CreateCategoryAsync(CreateCategoryRequest request);
    Task<AdminCategoryResponse> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request);
    Task DeleteCategoryAsync(Guid id, DeleteResourceRequest request); // Soft delete / deactivate
    Task<PagedResult<PublicCategoryResponse>> GetActiveCategoriesAsync(PublicCategoryQuery query);
}

