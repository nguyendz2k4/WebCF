using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Articles;
using VDungCoffe.DTO.Admin.Common;
using VDungCoffe.DTO.Common;
using VDungCoffe.DTO.User.Catalog;

namespace VDungCoffe.Services.Interfaces;

public interface IArticleService
{
    // Admin
    Task<PagedResult<AdminArticleResponse>> GetAdminArticlesAsync(AdminArticleFilterQuery query);
    Task<AdminArticleResponse> GetAdminArticleByIdAsync(Guid id);
    Task<AdminArticleResponse> CreateArticleAsync(CreateArticleRequest request);
    Task<AdminArticleResponse> UpdateArticleAsync(Guid id, UpdateArticleRequest request);
    Task<AdminArticleResponse> PublishArticleAsync(Guid id, PublishArticleRequest request);
    Task<PublicArticleResponse> PreviewArticleAsync(Guid id);
    Task DeleteArticleAsync(Guid id, DeleteResourceRequest request);

    // Public
    Task<PagedResult<PublicArticleResponse>> GetPublicArticlesAsync(PaginationQuery query);
    Task<PublicArticleResponse> GetPublicArticleBySlugAsync(string slug);
}
