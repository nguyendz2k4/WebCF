using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Banners;
using VDungCoffe.DTO.Admin.Common;
namespace VDungCoffe.Services.Interfaces;
public interface IBannerService
{
    Task<PagedResult<AdminBannerResponse>> GetAdminAsync(AdminBannerQuery query);
    Task<AdminBannerResponse> GetAdminByIdAsync(Guid id);
    Task<AdminBannerResponse> CreateAsync(CreateBannerRequest request);
    Task<AdminBannerResponse> UpdateAsync(Guid id, UpdateBannerRequest request);
    Task<AdminBannerResponse> PublishAsync(Guid id, BannerPublishRequest request);
    Task DeleteAsync(Guid id, DeleteResourceRequest request);
    Task<PagedResult<PublicBannerResponse>> GetPublicAsync(BannerQuery query);
}
