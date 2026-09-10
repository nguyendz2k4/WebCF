using VDungCoffe.DTO.Common;

namespace VDungCoffe.DTO.Admin.Articles;

public class AdminArticleResponse
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string CategoryCode { get; set; } = string.Empty;
    public DateTime? PublishedAt { get; set; }
    public bool IsPublished => PublishedAt.HasValue;
    public string CoverImageUrl { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public string AuthorRole { get; set; } = string.Empty;
    public string? AuthorAvatarUrl { get; set; }
    public int ReadTimeMinutes { get; set; }
    public string TagsJson { get; set; } = string.Empty;
    public string LeadParagraph { get; set; } = string.Empty;
    public string SectionsJson { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
    public DateTime? ArchivedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Version { get; set; } = string.Empty;
}

public class CreateArticleRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string Excerpt { get; set; } = string.Empty;
    public string CategoryCode { get; set; } = "new-products";
    public string CoverImageUrl { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public string AuthorRole { get; set; } = "Aura Specialist";
    public string? AuthorAvatarUrl { get; set; }
    public int ReadTimeMinutes { get; set; } = 5;
    public string? TagsJson { get; set; }
    public string LeadParagraph { get; set; } = string.Empty;
    public string SectionsJson { get; set; } = "[]";
    public bool IsFeatured { get; set; } = false;
}

public class UpdateArticleRequest
{
    public string Version { get; set; } = string.Empty; // Concurrency check
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string Excerpt { get; set; } = string.Empty;
    public string CategoryCode { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public string AuthorRole { get; set; } = string.Empty;
    public string? AuthorAvatarUrl { get; set; }
    public int ReadTimeMinutes { get; set; }
    public string? TagsJson { get; set; }
    public string LeadParagraph { get; set; } = string.Empty;
    public string SectionsJson { get; set; } = "[]";
    public bool IsFeatured { get; set; }
}

public class AdminArticleFilterQuery : PaginationQuery
{
    public string? CategoryCode { get; set; }
    public bool? IsPublished { get; set; }
    public bool? IsArchived { get; set; } = false;
}

public class PublishArticleRequest
{
    public string Version { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
}
