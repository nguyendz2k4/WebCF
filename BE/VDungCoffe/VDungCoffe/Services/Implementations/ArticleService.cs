using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using VDungCoffe.Common;
using VDungCoffe.Common.Exceptions;
using VDungCoffe.DTO.Admin.Articles;
using VDungCoffe.DTO.Admin.Common;
using VDungCoffe.DTO.Common;
using VDungCoffe.DTO.User.Catalog;
using VDungCoffe.Mappings;
using VDungCoffe.Models;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Services.Implementations;

public class ArticleService : IArticleService
{
    private readonly AuraCoffeeContext _context;
    private readonly IHtmlSanitizerService _sanitizer;
    private readonly ICacheService _cache;
    private readonly IAuditLogService _auditLog;

    public ArticleService(
        AuraCoffeeContext context,
        IHtmlSanitizerService sanitizer,
        ICacheService cache,
        IAuditLogService auditLog)
    {
        _context = context;
        _sanitizer = sanitizer;
        _cache = cache;
        _auditLog = auditLog;
    }

    #region Admin API

    public async Task<PagedResult<AdminArticleResponse>> GetAdminArticlesAsync(AdminArticleFilterQuery query)
    {
        VDungCoffe.Common.ServiceInput.Validate(query);
        var dbQuery = query.IsArchived == true
            ? _context.NewsArticles.Where(a => a.ArchivedAt != null)
            : _context.NewsArticles.Where(a => a.ArchivedAt == null);

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var kw = query.Keyword.Trim();
            dbQuery = dbQuery.Where(a => a.Title.Contains(kw) || a.AuthorName.Contains(kw));
        }

        if (!string.IsNullOrWhiteSpace(query.CategoryCode))
        {
            dbQuery = dbQuery.Where(a => a.CategoryCode == query.CategoryCode);
        }

        if (query.IsPublished.HasValue)
        {
            dbQuery = query.IsPublished.Value
                ? dbQuery.Where(a => a.PublishedAt != null)
                : dbQuery.Where(a => a.PublishedAt == null);
        }

        var total = await dbQuery.CountAsync();
        var items = await dbQuery
            .Sort(query, "CreatedAt", "CreatedAt", "Title", "PublishedAt")
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .AsNoTracking()
            .ToListAsync();

        return new PagedResult<AdminArticleResponse>
        {
            Items = items.Select(a => a.ToAdminDto()).ToList(),
            Page = query.Page,
            PageSize = query.PageSize,
            TotalItems = total
        };
    }

    public async Task<AdminArticleResponse> GetAdminArticleByIdAsync(Guid id)
    {
        var article = await _context.NewsArticles.FirstOrDefaultAsync(a => a.Id == id);
        if (article == null) throw new NotFoundException("Bài viết", id);
        return article.ToAdminDto();
    }

    public async Task<AdminArticleResponse> CreateArticleAsync(CreateArticleRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var slug = string.IsNullOrWhiteSpace(request.Slug) ? GenerateSlug(request.Title) : GenerateSlug(request.Slug);
        var exists = await _context.NewsArticles.AnyAsync(a => a.Slug == slug);
        if (exists) slug = $"{slug}-{Guid.NewGuid().ToString()[..6]}";

        var sanitizedExcerpt = _sanitizer.Sanitize(request.Excerpt);
        var sanitizedLead = _sanitizer.Sanitize(request.LeadParagraph);
        var sanitizedSections = RichTextJson.Sanitize(request.SectionsJson, _sanitizer);

        var article = new NewsArticle
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Slug = slug,
            Excerpt = sanitizedExcerpt,
            CategoryCode = request.CategoryCode,
            CoverImageUrl = request.CoverImageUrl,
            AuthorName = request.AuthorName,
            AuthorRole = request.AuthorRole,
            AuthorAvatarUrl = request.AuthorAvatarUrl,
            ReadTimeMinutes = request.ReadTimeMinutes,
            TagsJson = request.TagsJson ?? "[]",
            LeadParagraph = sanitizedLead,
            SectionsJson = sanitizedSections,
            IsFeatured = request.IsFeatured,
            PublishedAt = null,
            CreatedAt = DateTime.UtcNow
        };

        _context.NewsArticles.Add(article);
        await _context.SaveChangesAsync();

        await _auditLog.LogActionAsync("Create", "NewsArticle", article.Id.ToString(), null, article.ToAdminDto());
        await _cache.InvalidateCatalogCacheAsync();

        return article.ToAdminDto();
    }

    public async Task<AdminArticleResponse> UpdateArticleAsync(Guid id, UpdateArticleRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var article = await _context.NewsArticles.FirstOrDefaultAsync(a => a.Id == id);
        if (article == null) throw new NotFoundException("Bài viết", id);

        ApplyConcurrency(article, request.Version);

        var slug = string.IsNullOrWhiteSpace(request.Slug) ? GenerateSlug(request.Title) : GenerateSlug(request.Slug);
        if (article.ArchivedAt != null || article.PublishedAt != null) throw new ConcurrencyConflictException("Cần chuyển bài viết về nháp trước khi sửa.");
        var conflict = await _context.NewsArticles.AnyAsync(a => a.Slug == slug && a.Id != id);
        if (conflict) throw new ValidationException($"Slug '{slug}' đã tồn tại.");

        var oldSnapshot = article.ToAdminDto();

        article.Title = request.Title.Trim();
        article.Slug = slug;
        article.Excerpt = _sanitizer.Sanitize(request.Excerpt);
        article.CategoryCode = request.CategoryCode;
        article.CoverImageUrl = request.CoverImageUrl;
        article.AuthorName = request.AuthorName;
        article.AuthorRole = request.AuthorRole;
        article.AuthorAvatarUrl = request.AuthorAvatarUrl;
        article.ReadTimeMinutes = request.ReadTimeMinutes;
        article.TagsJson = request.TagsJson ?? "[]";
        article.LeadParagraph = _sanitizer.Sanitize(request.LeadParagraph);
        article.SectionsJson = RichTextJson.Sanitize(request.SectionsJson, _sanitizer);
        article.IsFeatured = request.IsFeatured;

        await _context.SaveChangesAsync();

        await _auditLog.LogActionAsync("Update", "NewsArticle", article.Id.ToString(), oldSnapshot, article.ToAdminDto());
        await _cache.InvalidateCatalogCacheAsync();

        return article.ToAdminDto();
    }

    public async Task DeleteArticleAsync(Guid id, DeleteResourceRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var article = await _context.NewsArticles.FirstOrDefaultAsync(a => a.Id == id);
        if (article == null) throw new NotFoundException("Bài viết", id);

        ApplyConcurrency(article, request.Version);

        var oldSnapshot = article.ToAdminDto();

        // Soft delete
        article.ArchivedAt = DateTime.UtcNow;
        article.PublishedAt = null;

        await _context.SaveChangesAsync();

        await _auditLog.LogActionAsync("SoftDelete", "NewsArticle", article.Id.ToString(), oldSnapshot, new { ArchivedAt = article.ArchivedAt });
        await _cache.InvalidateCatalogCacheAsync();
    }

    #endregion

    #region Public API

    public async Task<PagedResult<PublicArticleResponse>> GetPublicArticlesAsync(PaginationQuery query)
    {
        VDungCoffe.Common.ServiceInput.Validate(query);
        var dbQuery = _context.NewsArticles
            .Where(a => a.PublishedAt != null && a.ArchivedAt == null)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var kw = query.Keyword.Trim();
            dbQuery = dbQuery.Where(a => a.Title.Contains(kw) || a.Excerpt.Contains(kw));
        }

        var total = await dbQuery.CountAsync();
        var items = await dbQuery
            .Sort(query, "PublishedAt", "PublishedAt", "Title", "CreatedAt")
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        return new PagedResult<PublicArticleResponse>
        {
            Items = items.Select(a => a.ToPublicDto()).ToList(),
            Page = query.Page,
            PageSize = query.PageSize,
            TotalItems = total
        };
    }

    public async Task<PublicArticleResponse> GetPublicArticleBySlugAsync(string slug)
    {
        var article = await _context.NewsArticles
            .Where(a => a.Slug == slug && a.PublishedAt != null && a.ArchivedAt == null)
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (article == null) throw new NotFoundException($"Không tìm thấy bài viết '{slug}'.");
        return article.ToPublicDto();
    }

    #endregion

    public async Task<PublicArticleResponse> PreviewArticleAsync(Guid id)
    {
        var article = await _context.NewsArticles.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id && a.ArchivedAt == null)
            ?? throw new NotFoundException("Bài viết", id);
        return article.ToPublicDto();
    }

    public async Task<AdminArticleResponse> PublishArticleAsync(Guid id, PublishArticleRequest request)
    {
        ServiceInput.Validate(request);
        var article = await _context.NewsArticles.FirstOrDefaultAsync(a => a.Id == id && a.ArchivedAt == null)
            ?? throw new NotFoundException("Bài viết", id);
        ApplyConcurrency(article, request.Version);
        var old = article.ToAdminDto();
        article.PublishedAt = request.IsPublished ? DateTime.UtcNow : null;
        _context.Entry(article).Property(a => a.PublishedAt).IsModified = true;
        await _context.SaveChangesAsync();
        await _auditLog.LogActionAsync(request.IsPublished ? "Publish" : "Unpublish", "NewsArticle", id.ToString(), old, article.ToAdminDto());
        await _cache.InvalidateCatalogCacheAsync();
        return article.ToAdminDto();
    }

    private void ApplyConcurrency(NewsArticle article, string base64Version)
    {
        if (string.IsNullOrWhiteSpace(base64Version)) throw new ValidationException("Thiếu Version để kiểm soát sửa đồng thời.");
        try
        {
            _context.Entry(article).OriginalValues[nameof(NewsArticle.Version)] = ServiceInput.DecodeVersion(base64Version);
            _context.Entry(article).Property(a => a.IsFeatured).IsModified = true;
        }
        catch
        {
            throw new ValidationException("Version không đúng định dạng.");
        }
    }

    private static string GenerateSlug(string text)
    {
        var str = text.ToLowerInvariant().Trim();
        str = Regex.Replace(str, @"\s+", "-");
        str = Regex.Replace(str, @"[^\w\-]+", "");
        str = Regex.Replace(str, @"\-\-+", "-");
        return str.Trim('-');
    }
}
