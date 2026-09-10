using VDungCoffe.DTO.User.Catalog;
using Microsoft.EntityFrameworkCore;
using VDungCoffe.Common;
using VDungCoffe.Common.Exceptions;
using VDungCoffe.DTO.Admin.Categories;
using VDungCoffe.DTO.Admin.Common;
using VDungCoffe.DTO.Common;
using VDungCoffe.Mappings;
using VDungCoffe.Models;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly AuraCoffeeContext _context;
    private readonly ICacheService _cache;
    private readonly IAuditLogService _auditLog;

    public CategoryService(AuraCoffeeContext context, ICacheService cache, IAuditLogService auditLog)
    {
        _context = context;
        _cache = cache;
        _auditLog = auditLog;
    }

    public async Task<PagedResult<AdminCategoryResponse>> GetAdminCategoriesAsync(PaginationQuery query)
    {
        VDungCoffe.Common.ServiceInput.Validate(query);
        var dbQuery = _context.Categories.Include(c => c.Products).AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var kw = query.Keyword.Trim();
            dbQuery = dbQuery.Where(c => c.Name.Contains(kw) || c.Code.Contains(kw));
        }

        var total = await dbQuery.CountAsync();
        var items = await Sort(dbQuery, query)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        return new PagedResult<AdminCategoryResponse>
        {
            Items = items.Select(c => c.ToAdminDto()).ToList(),
            Page = query.Page,
            PageSize = query.PageSize,
            TotalItems = total
        };
    }

    public async Task<AdminCategoryResponse> GetCategoryByIdAsync(Guid id)
    {
        var category = await _context.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) throw new NotFoundException("Danh mục", id);
        return category.ToAdminDto();
    }

    public async Task<AdminCategoryResponse> CreateCategoryAsync(CreateCategoryRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var code = request.Code.Trim().ToLowerInvariant();
        var exists = await _context.Categories.AnyAsync(c => c.Code == code);
        if (exists) throw new ValidationException($"Mã danh mục '{code}' đã tồn tại.");

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Code = code,
            Name = request.Name.Trim(),
            Domain = request.Domain,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        await _auditLog.LogActionAsync("Create", "Category", category.Id.ToString(), null, category.ToAdminDto());
        await _cache.InvalidateCatalogCacheAsync();

        return category.ToAdminDto();
    }

    public async Task<AdminCategoryResponse> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var category = await _context.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) throw new NotFoundException("Danh mục", id);

        ApplyConcurrency(category, request.Version);

        var code = request.Code.Trim().ToLowerInvariant();
        var exists = await _context.Categories.AnyAsync(c => c.Code == code && c.Id != id);
        if (exists) throw new ValidationException($"Mã danh mục '{code}' đã tồn tại.");

        var oldSnapshot = category.ToAdminDto();

        if (category.Domain != request.Domain && await _context.Products.IgnoreQueryFilters().AnyAsync(p => p.CategoryId == id))
            throw new ValidationException("Không đổi nhóm danh mục đã có sản phẩm, kể cả sản phẩm lưu trữ.");

        category.Name = request.Name.Trim();
        category.Code = code;
        category.Domain = request.Domain;
        category.DisplayOrder = request.DisplayOrder;
        category.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        await _auditLog.LogActionAsync("Update", "Category", category.Id.ToString(), oldSnapshot, category.ToAdminDto());
        await _cache.InvalidateCatalogCacheAsync();

        return category.ToAdminDto();
    }

    public async Task DeleteCategoryAsync(Guid id, DeleteResourceRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var category = await _context.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) throw new NotFoundException("Danh mục", id);

        ApplyConcurrency(category, request.Version);

        var oldSnapshot = category.ToAdminDto();

        // Soft delete: Deactivate category to protect products & historical orders
        category.IsActive = false;
        await _context.SaveChangesAsync();

        await _auditLog.LogActionAsync("Deactivate", "Category", category.Id.ToString(), oldSnapshot, new { IsActive = false });
        await _cache.InvalidateCatalogCacheAsync();
    }

    public async Task<PagedResult<PublicCategoryResponse>> GetActiveCategoriesAsync(PublicCategoryQuery query)
    {
        ServiceInput.Validate(query);
        var source = _context.Categories.AsNoTracking().Where(c => c.IsActive);
        if (!string.IsNullOrWhiteSpace(query.Domain)) source = source.Where(c => c.Domain == query.Domain);
        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var keyword = query.Keyword.Trim();
            source = source.Where(c => c.Name.Contains(keyword) || c.Code.Contains(keyword));
        }
        var total = await source.CountAsync();
        var items = await Sort(source, query).Skip((query.Page - 1) * query.PageSize).Take(query.PageSize)
            .Select(c => new PublicCategoryResponse { Id = c.Id, Name = c.Name, Code = c.Code, Domain = c.Domain, DisplayOrder = c.DisplayOrder }).ToListAsync();
        return new() { Items = items, Page = query.Page, PageSize = query.PageSize, TotalItems = total };
    }

    private static IOrderedQueryable<Category> Sort(IQueryable<Category> source, PaginationQuery query)
    {
        IOrderedQueryable<Category> sorted = query.SortBy switch
        {
            "name" => query.IsAscending ? source.OrderBy(x => x.Name) : source.OrderByDescending(x => x.Name),
            "code" => query.IsAscending ? source.OrderBy(x => x.Code) : source.OrderByDescending(x => x.Code),
            "createdAt" => query.IsAscending ? source.OrderBy(x => x.CreatedAt) : source.OrderByDescending(x => x.CreatedAt),
            null => source.OrderBy(x => x.DisplayOrder),
            "displayOrder" => query.IsAscending ? source.OrderBy(x => x.DisplayOrder) : source.OrderByDescending(x => x.DisplayOrder),
            _ => throw new ValidationException("SortBy: name, code, createdAt, displayOrder.")
        };
        return sorted.ThenBy(x => x.Id);
    }
    private void ApplyConcurrency(Category category, string base64Version)
    {
        if (string.IsNullOrWhiteSpace(base64Version)) throw new ValidationException("Thiếu Version để kiểm soát sửa đồng thời.");
        try
        {
            _context.Entry(category).OriginalValues[nameof(Category.Version)] = ServiceInput.DecodeVersion(base64Version);
            _context.Entry(category).Property(c => c.IsActive).IsModified = true;
        }
        catch
        {
            throw new ValidationException("Version không đúng định dạng.");
        }
    }
}


