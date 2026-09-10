using VDungCoffe.DTO.Common;
namespace VDungCoffe.DTO.Admin.Banners;
public class CreateBannerRequest
{
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public string AltText { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
public class UpdateBannerRequest : CreateBannerRequest
{
    public string Version { get; set; } = string.Empty;
}
public class BannerPublishRequest
{
    public string Version { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
}
public class BannerQuery : PaginationQuery { }
public class AdminBannerQuery : BannerQuery
{
    public bool? IsPublished { get; set; }
    public bool IsArchived { get; set; }
}
public class PublicBannerResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public string AltText { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
public class AdminBannerResponse : PublicBannerResponse
{
    public DateTime CreatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? ArchivedAt { get; set; }
    public bool IsPublished => PublishedAt.HasValue;
    public string Version { get; set; } = string.Empty;
}
