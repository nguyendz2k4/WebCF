using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VDungCoffe.Common;
using VDungCoffe.Common.Exceptions;
using VDungCoffe.DTO.Admin.Banners;
using VDungCoffe.DTO.Admin.Common;
using VDungCoffe.Mappings;
using VDungCoffe.Models;
using VDungCoffe.Services.Interfaces;
using VDungCoffe.Validators.Admin.Banners;
namespace VDungCoffe.Services.Implementations;
public class BannerService(AuraCoffeeContext context, ICacheService cache, IAuditLogService audit) : IBannerService
{
    public async Task<PagedResult<AdminBannerResponse>> GetAdminAsync(AdminBannerQuery query)
    {
        Check(new AdminBannerQueryValidator(), query);
        var source = context.Set<Banner>().AsNoTracking().Where(x => query.IsArchived ? x.ArchivedAt != null : x.ArchivedAt == null);
        if (query.IsPublished.HasValue) source = source.Where(x => (x.PublishedAt != null) == query.IsPublished.Value);
        source = Filter(source, query);
        var count = await source.CountAsync();
        var items = await Page(source, query).ToListAsync();
        return new() { Items = items.Select(x => x.ToAdminDto()).ToList(), Page = query.Page, PageSize = query.PageSize, TotalItems = count };
    }
    public async Task<AdminBannerResponse> GetAdminByIdAsync(Guid id) => (await Find(id)).ToAdminDto();
    public async Task<AdminBannerResponse> CreateAsync(CreateBannerRequest request)
    {
        Check(new CreateBannerValidator(), request);
        var b = new Banner { Id = Guid.NewGuid(), CreatedAt = DateTime.UtcNow };
        Copy(b, request);
        context.Set<Banner>().Add(b);
        await Save(b, "Create", null);
        return b.ToAdminDto();
    }
    public async Task<AdminBannerResponse> UpdateAsync(Guid id, UpdateBannerRequest request)
    {
        Check(new UpdateBannerValidator(), request);
        var b = await Find(id);
        Editable(b);
        if (b.PublishedAt != null) throw new ConcurrencyConflictException("Unpublish banner before editing; review the draft before publishing again.");
        Concurrency(b, request.Version);
        var old = b.ToAdminDto();
        Copy(b, request);
        await Save(b, "Update", old);
        return b.ToAdminDto();
    }
    public async Task<AdminBannerResponse> PublishAsync(Guid id, BannerPublishRequest request)
    {
        Check(new BannerPublishValidator(), request);
        var b = await Find(id);
        Editable(b);
        Concurrency(b, request.Version);
        var old = b.ToAdminDto();
        b.PublishedAt = request.IsPublished ? DateTime.UtcNow : null;
        // Force a guarded UPDATE even for repeated unpublish requests.
        context.Entry(b).Property(x => x.PublishedAt).IsModified = true;
        await Save(b, request.IsPublished ? "Publish" : "Unpublish", old);
        return b.ToAdminDto();
    }
    public async Task DeleteAsync(Guid id, DeleteResourceRequest request)
    {
        var b = await Find(id);
        Editable(b);
        Concurrency(b, request.Version);
        var old = b.ToAdminDto();
        b.ArchivedAt = DateTime.UtcNow;
        b.PublishedAt = null;
        await Save(b, "SoftDelete", old);
    }
    public async Task<PagedResult<PublicBannerResponse>> GetPublicAsync(BannerQuery query)
    {
        Check(new BannerQueryValidator(), query);
        var source = Filter(context.Set<Banner>().AsNoTracking().Where(x => x.PublishedAt != null && x.ArchivedAt == null), query);
        var count = await source.CountAsync();
        var items = await Page(source, query).ToListAsync();
        return new() { Items = items.Select(x => x.ToPublicDto()).ToList(), Page = query.Page, PageSize = query.PageSize, TotalItems = count };
    }
    private async Task<Banner> Find(Guid id) => await context.Set<Banner>().FirstOrDefaultAsync(x => x.Id == id) ?? throw new NotFoundException("Banner", id);
    private static void Editable(Banner b) { if (b.ArchivedAt != null) throw new ConcurrencyConflictException("Archived banners cannot be modified or published."); }
    private void Concurrency(Banner b, string version)
    {
        if (!CreateBannerValidator.ValidVersion(version)) throw new VDungCoffe.Common.Exceptions.ValidationException("Version must be an 8-byte base64 rowversion.");
        var bytes = Convert.FromBase64String(version);
        if (!b.Version.SequenceEqual(bytes)) throw new ConcurrencyConflictException();
        context.Entry(b).Property(x => x.Version).OriginalValue = bytes;
        context.Entry(b).Property(x => x.DisplayOrder).IsModified = true;
    }
    private async Task Save(Banner b, string action, object? old)
    {
        await context.SaveChangesAsync();
        await audit.LogActionAsync(action, "Banner", b.Id.ToString(), old, b.ToAdminDto());
        await cache.InvalidateCatalogCacheAsync();
    }
    private static void Check<T>(IValidator<T> validator, T request)
    {
        var result = validator.Validate(request);
        if (!result.IsValid) throw new VDungCoffe.Common.Exceptions.ValidationException(result.Errors.Select(x => x.ErrorMessage).ToList());
    }
    private static void Copy(Banner b, CreateBannerRequest r)
    { b.Title = r.Title.Trim(); b.ImageUrl = r.ImageUrl.Trim(); b.LinkUrl = string.IsNullOrWhiteSpace(r.LinkUrl) ? null : r.LinkUrl.Trim(); b.AltText = r.AltText.Trim(); b.DisplayOrder = r.DisplayOrder; }
    private static IQueryable<Banner> Filter(IQueryable<Banner> source, BannerQuery q) => string.IsNullOrWhiteSpace(q.Keyword) ? source : source.Where(x => x.Title.Contains(q.Keyword.Trim()));
    private static IQueryable<Banner> Page(IQueryable<Banner> source, BannerQuery q)
    {
        IOrderedQueryable<Banner> ordered = q.SortBy switch
        {
            "name" or "title" => q.IsAscending ? source.OrderBy(x => x.Title) : source.OrderByDescending(x => x.Title),
            "createdAt" => q.IsAscending ? source.OrderBy(x => x.CreatedAt) : source.OrderByDescending(x => x.CreatedAt),
            _ => q.IsAscending ? source.OrderBy(x => x.DisplayOrder) : source.OrderByDescending(x => x.DisplayOrder)
        };
        return ordered.ThenBy(x => x.Id).Skip((q.Page - 1) * q.PageSize).Take(q.PageSize);
    }
}
