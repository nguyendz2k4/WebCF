using VDungCoffe.DTO.User.Catalog;
using Microsoft.EntityFrameworkCore;
using VDungCoffe.Common;
using VDungCoffe.Common.Exceptions;
using VDungCoffe.DTO.Admin.Brands;
using VDungCoffe.DTO.Admin.Common;
using VDungCoffe.DTO.Common;
using VDungCoffe.Mappings;
using VDungCoffe.Models;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Services.Implementations;

public class BrandService : IBrandService
{
    private readonly AuraCoffeeContext _context;
    private readonly ICacheService _cache;
    private readonly IAuditLogService _auditLog;

    public BrandService(AuraCoffeeContext context, ICacheService cache, IAuditLogService auditLog)
    {
        _context = context;
        _cache = cache;
        _auditLog = auditLog;
    }

    public async Task<PagedResult<AdminBrandResponse>> GetAdminBrandsAsync(PaginationQuery query)
    {
        VDungCoffe.Common.ServiceInput.Validate(query);
        var dbQuery = _context.Brands.Include(b => b.Products).AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var kw = query.Keyword.Trim();
            dbQuery = dbQuery.Where(b => b.Name.Contains(kw) || b.Code.Contains(kw));
        }

        var total = await dbQuery.CountAsync();
        var items = await Sort(dbQuery, query)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        return new PagedResult<AdminBrandResponse>
        {
            Items = items.Select(b => b.ToAdminDto()).ToList(),
            Page = query.Page,
            PageSize = query.PageSize,
            TotalItems = total
        };
    }

    public async Task<AdminBrandResponse> GetBrandByIdAsync(Guid id)
    {
        var brand = await _context.Brands.Include(b => b.Products).FirstOrDefaultAsync(b => b.Id == id);
        if (brand == null) throw new NotFoundException("Thương hiệu", id);
        return brand.ToAdminDto();
    }

    public async Task<AdminBrandResponse> CreateBrandAsync(CreateBrandRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var code = request.Code.Trim().ToLowerInvariant();
        var exists = await _context.Brands.AnyAsync(b => b.Code == code);
        if (exists) throw new ValidationException($"Mã thương hiệu '{code}' đã tồn tại.");

        var brand = new Brand
        {
            Id = Guid.NewGuid(),
            Code = code,
            Name = request.Name.Trim(),
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _context.Brands.Add(brand);
        await _context.SaveChangesAsync();

        await _auditLog.LogActionAsync("Create", "Brand", brand.Id.ToString(), null, brand.ToAdminDto());
        await _cache.InvalidateCatalogCacheAsync();

        return brand.ToAdminDto();
    }

    public async Task<AdminBrandResponse> UpdateBrandAsync(Guid id, UpdateBrandRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var brand = await _context.Brands.Include(b => b.Products).FirstOrDefaultAsync(b => b.Id == id);
        if (brand == null) throw new NotFoundException("Thương hiệu", id);

        ApplyConcurrency(brand, request.Version);

        var code = request.Code.Trim().ToLowerInvariant();
        var exists = await _context.Brands.AnyAsync(b => b.Code == code && b.Id != id);
        if (exists) throw new ValidationException($"Mã thương hiệu '{code}' đã tồn tại.");

        var oldSnapshot = brand.ToAdminDto();

        brand.Name = request.Name.Trim();
        brand.Code = code;
        brand.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        await _auditLog.LogActionAsync("Update", "Brand", brand.Id.ToString(), oldSnapshot, brand.ToAdminDto());
        await _cache.InvalidateCatalogCacheAsync();

        return brand.ToAdminDto();
    }

    public async Task DeleteBrandAsync(Guid id, DeleteResourceRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var brand = await _context.Brands.Include(b => b.Products).FirstOrDefaultAsync(b => b.Id == id);
        if (brand == null) throw new NotFoundException("Thương hiệu", id);

        ApplyConcurrency(brand, request.Version);

        var oldSnapshot = brand.ToAdminDto();

        // Soft delete
        brand.IsActive = false;
        await _context.SaveChangesAsync();

        await _auditLog.LogActionAsync("Deactivate", "Brand", brand.Id.ToString(), oldSnapshot, new { IsActive = false });
        await _cache.InvalidateCatalogCacheAsync();
    }

    public async Task<PagedResult<PublicBrandResponse>> GetActiveBrandsAsync(PaginationQuery query)
    {
        ServiceInput.Validate(query);
        var source = _context.Brands.AsNoTracking().Where(b => b.IsActive);
        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var keyword = query.Keyword.Trim();
            source = source.Where(b => b.Name.Contains(keyword) || b.Code.Contains(keyword));
        }
        var total = await source.CountAsync();
        var items = await Sort(source, query).Skip((query.Page - 1) * query.PageSize).Take(query.PageSize)
            .Select(b => new PublicBrandResponse { Id = b.Id, Name = b.Name, Code = b.Code }).ToListAsync();
        return new() { Items = items, Page = query.Page, PageSize = query.PageSize, TotalItems = total };
    }

    private static IOrderedQueryable<Brand> Sort(IQueryable<Brand> source, PaginationQuery query)
    {
        IOrderedQueryable<Brand> sorted = query.SortBy switch
        {
            null => source.OrderBy(x => x.Name),
            "name" => query.IsAscending ? source.OrderBy(x => x.Name) : source.OrderByDescending(x => x.Name),
            "code" => query.IsAscending ? source.OrderBy(x => x.Code) : source.OrderByDescending(x => x.Code),
            "createdAt" => query.IsAscending ? source.OrderBy(x => x.CreatedAt) : source.OrderByDescending(x => x.CreatedAt),
            _ => throw new ValidationException("SortBy: name, code, createdAt.")
        };
        return sorted.ThenBy(x => x.Id);
    }
    private void ApplyConcurrency(Brand brand, string base64Version)
    {
        if (string.IsNullOrWhiteSpace(base64Version)) throw new ValidationException("Thiếu Version để kiểm soát sửa đồng thời.");
        try
        {
            _context.Entry(brand).OriginalValues[nameof(Brand.Version)] = ServiceInput.DecodeVersion(base64Version);
            _context.Entry(brand).Property(b => b.IsActive).IsModified = true;
        }
        catch
        {
            throw new ValidationException("Version không đúng định dạng.");
        }
    }
}


