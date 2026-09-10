using System.Text.Json;
using VDungCoffe.DTO.Admin.Articles;
using VDungCoffe.DTO.User.Catalog;
using VDungCoffe.Models;

namespace VDungCoffe.Mappings;

public static class ArticleMappings
{
    public static AdminArticleResponse ToAdminDto(this NewsArticle article)
    {
        return new AdminArticleResponse
        {
            Id = article.Id,
            Slug = article.Slug,
            Title = article.Title,
            Excerpt = article.Excerpt,
            CategoryCode = article.CategoryCode,
            PublishedAt = article.PublishedAt,
            CoverImageUrl = article.CoverImageUrl,
            AuthorName = article.AuthorName,
            AuthorRole = article.AuthorRole,
            AuthorAvatarUrl = article.AuthorAvatarUrl,
            ReadTimeMinutes = article.ReadTimeMinutes,
            TagsJson = article.TagsJson,
            LeadParagraph = article.LeadParagraph,
            SectionsJson = article.SectionsJson,
            IsFeatured = article.IsFeatured,
            ArchivedAt = article.ArchivedAt,
            CreatedAt = article.CreatedAt,
            Version = article.Version != null ? Convert.ToBase64String(article.Version) : string.Empty
        };
    }

    public static PublicArticleResponse ToPublicDto(this NewsArticle article)
    {
        List<string>? tags = null;
        if (!string.IsNullOrWhiteSpace(article.TagsJson))
        {
            try
            {
                tags = JsonSerializer.Deserialize<List<string>>(article.TagsJson);
            }
            catch
            {
                tags = new List<string>();
            }
        }

        return new PublicArticleResponse
        {
            Id = article.Id.ToString(),
            Slug = article.Slug,
            Title = article.Title,
            Excerpt = article.Excerpt,
            Category = article.CategoryCode,
            CoverImage = article.CoverImageUrl,
            AuthorName = article.AuthorName,
            AuthorRole = article.AuthorRole,
            AuthorAvatar = article.AuthorAvatarUrl,
            ReadTime = article.ReadTimeMinutes,
            Tags = tags ?? new List<string>(),
            LeadParagraph = article.LeadParagraph,
            Content = article.SectionsJson,
            PublishedAt = article.PublishedAt
        };
    }

    public static Dictionary<string, object?> ToAdminRow(this NewsArticle article)
    {
        return new Dictionary<string, object?>
        {
            ["id"] = article.Id.ToString(),
            ["name"] = article.Title,
            ["slug"] = article.Slug,
            ["category"] = article.CategoryCode,
            ["author"] = article.AuthorName,
            ["status"] = article.PublishedAt.HasValue ? "Đã xuất bản" : "Bản nháp",
            ["description"] = article.Excerpt,
            ["content"] = article.LeadParagraph,
            ["image"] = article.CoverImageUrl,
            ["version"] = article.Version != null ? Convert.ToBase64String(article.Version) : string.Empty
        };
    }
}
