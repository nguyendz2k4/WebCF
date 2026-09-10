using VDungCoffe.DTO.Admin.Banners;
using VDungCoffe.Models;
namespace VDungCoffe.Mappings;
public static class BannerMappings
{
    public static PublicBannerResponse ToPublicDto(this Banner b) => new()
    { Id = b.Id, Title = b.Title, ImageUrl = b.ImageUrl, LinkUrl = b.LinkUrl, AltText = b.AltText, DisplayOrder = b.DisplayOrder };
    public static AdminBannerResponse ToAdminDto(this Banner b) => new()
    { Id = b.Id, Title = b.Title, ImageUrl = b.ImageUrl, LinkUrl = b.LinkUrl, AltText = b.AltText, DisplayOrder = b.DisplayOrder,
      CreatedAt = b.CreatedAt, PublishedAt = b.PublishedAt, ArchivedAt = b.ArchivedAt, Version = Convert.ToBase64String(b.Version) };
}
