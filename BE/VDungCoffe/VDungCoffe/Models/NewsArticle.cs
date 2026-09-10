using System;
using System.Collections.Generic;

namespace VDungCoffe.Models;

public partial class NewsArticle
{
    public Guid Id { get; set; }

    public string Slug { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Excerpt { get; set; } = null!;

    public string CategoryCode { get; set; } = null!;

    public DateTime? PublishedAt { get; set; }

    public string CoverImageUrl { get; set; } = null!;

    public string AuthorName { get; set; } = null!;

    public string AuthorRole { get; set; } = null!;

    public string? AuthorAvatarUrl { get; set; }

    public int ReadTimeMinutes { get; set; }

    public string TagsJson { get; set; } = null!;

    public string LeadParagraph { get; set; } = null!;

    public string SectionsJson { get; set; } = null!;

    public bool IsFeatured { get; set; }

    public DateTime? ArchivedAt { get; set; }

    public byte[] Version { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}
