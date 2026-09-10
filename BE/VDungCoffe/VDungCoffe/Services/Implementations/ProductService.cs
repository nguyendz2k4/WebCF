using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using VDungCoffe.Common;
using VDungCoffe.Common.Exceptions;
using VDungCoffe.DTO.Admin.Common;
using VDungCoffe.DTO.Admin.Products;
using VDungCoffe.DTO.User.Catalog;
using VDungCoffe.Mappings;
using VDungCoffe.Models;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Services.Implementations;

public class ProductService : IProductService
{
    private readonly AuraCoffeeContext _context;
    private readonly IHtmlSanitizerService _sanitizer;
    private readonly ICacheService _cache;
    private readonly IAuditLogService _auditLog;
    private readonly ILogger<ProductService> _logger;

    public ProductService(
        AuraCoffeeContext context,
        IHtmlSanitizerService sanitizer,
        ICacheService cache,
        IAuditLogService auditLog,
        ILogger<ProductService> logger)
    {
        _context = context;
        _sanitizer = sanitizer;
        _cache = cache;
        _auditLog = auditLog;
        _logger = logger;
    }

    #region Admin API

    public async Task<PagedResult<AdminProductResponse>> GetAdminProductsAsync(AdminProductFilterQuery query)
    {
        VDungCoffe.Common.ServiceInput.Validate(query);
        // Admin can view archived products if explicitly requested, otherwise filter them out
        var dbQuery = query.IsArchived == true
            ? _context.Products.IgnoreQueryFilters().Where(p => p.ArchivedAt != null)
            : _context.Products.AsQueryable();

        dbQuery = dbQuery
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.ProductMedia);

        // Filter: Keyword (Name, SKU, Slug)
        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var kw = query.Keyword.Trim();
            dbQuery = dbQuery.Where(p => p.Name.Contains(kw) || (p.Sku != null && p.Sku.Contains(kw)) || p.Slug.Contains(kw));
        }

        // Filter: Category
        if (query.CategoryId.HasValue)
        {
            dbQuery = dbQuery.Where(p => p.CategoryId == query.CategoryId.Value);
        }

        // Filter: Brand
        if (query.BrandId.HasValue)
        {
            dbQuery = dbQuery.Where(p => p.BrandId == query.BrandId.Value);
        }

        // Filter: Domain
        if (!string.IsNullOrWhiteSpace(query.Domain))
        {
            dbQuery = dbQuery.Where(p => p.Domain == query.Domain);
        }

        // Filter: Published
        if (query.IsPublished.HasValue)
        {
            dbQuery = dbQuery.Where(p => p.IsPublished == query.IsPublished.Value);
        }

        // Filter: Price range
        if (query.MinPrice.HasValue)
        {
            dbQuery = dbQuery.Where(p => p.Price >= query.MinPrice.Value);
        }
        if (query.MaxPrice.HasValue)
        {
            dbQuery = dbQuery.Where(p => p.Price <= query.MaxPrice.Value);
        }

        // Sorting
        dbQuery = (query.SortBy?.ToLowerInvariant(), query.IsAscending) switch
        {
            ("name", true) => dbQuery.OrderBy(p => p.Name),
            ("name", false) => dbQuery.OrderByDescending(p => p.Name),
            ("price", true) => dbQuery.OrderBy(p => p.Price),
            ("price", false) => dbQuery.OrderByDescending(p => p.Price),
            ("createdat", true) => dbQuery.OrderBy(p => p.CreatedAt),
            ("createdat", false) => dbQuery.OrderByDescending(p => p.CreatedAt),
            _ => dbQuery.OrderByDescending(p => p.CreatedAt)
        };

        var totalItems = await dbQuery.CountAsync();
        var items = await dbQuery
            .OrderByStableId().Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .AsNoTracking()
            .ToListAsync();

        return new PagedResult<AdminProductResponse>
        {
            Items = items.Select(p => p.ToAdminDto()).ToList(),
            Page = query.Page,
            PageSize = query.PageSize,
            TotalItems = totalItems
        };
    }

    public async Task<AdminProductResponse> GetAdminProductByIdAsync(Guid id)
    {
        var product = await _context.Products
            .IgnoreQueryFilters()
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.ProductMedia)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            throw new NotFoundException("Sản phẩm", id);
        }

        return product.ToAdminDto();
    }

    public async Task<PublicProductResponse> GetProductPreviewAsync(Guid id)
    {
        var product = await _context.Products
            .IgnoreQueryFilters()
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.ProductMedia)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            throw new NotFoundException("Sản phẩm", id);
        }

        return product.ToPublicDto();
    }

    public async Task<AdminProductResponse> CreateProductAsync(CreateProductRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        // Business Validation: Category and Domain match
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == request.CategoryId);
        if (category == null || !category.IsActive)
        {
            throw new ValidationException("Danh mục không tồn tại.");
        }
        if (category.Domain != request.Domain)
        {
            throw new ValidationException($"Danh mục '{category.Name}' thuộc nhóm '{category.Domain}', không khớp với nhóm sản phẩm '{request.Domain}'.");
        }

        // Business Validation: Brand exists and is active
        var brand = await _context.Brands.FirstOrDefaultAsync(b => b.Id == request.BrandId);
        if (brand == null || !brand.IsActive)
        {
            throw new ValidationException("Thương hiệu không tồn tại hoặc đã bị vô hiệu hóa.");
        }

        // Generate and validate Slug
        var slug = string.IsNullOrWhiteSpace(request.Slug) ? GenerateSlug(request.Name) : GenerateSlug(request.Slug);
        var slugExists = await _context.Products.IgnoreQueryFilters().AnyAsync(p => p.Slug == slug);
        if (slugExists)
        {
            slug = $"{slug}-{Guid.NewGuid().ToString()[..6]}";
        }

        // Validate SKU uniqueness if provided
        if (!string.IsNullOrWhiteSpace(request.Sku))
        {
            var skuExists = await _context.Products.IgnoreQueryFilters().AnyAsync(p => p.Sku == request.Sku);
            if (skuExists)
            {
                throw new ValidationException($"Mã SKU '{request.Sku}' đã tồn tại trong hệ thống.");
            }
        }

        // Sanitize rich text description
        var sanitizedDescription = _sanitizer.Sanitize(request.ShortDescription);

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Slug = slug,
            Sku = string.IsNullOrWhiteSpace(request.Sku) ? null : request.Sku.Trim(),
            Domain = request.Domain,
            CategoryId = request.CategoryId,
            BrandId = request.BrandId,
            ShortDescription = sanitizedDescription,
            PriceMode = request.PriceMode,
            Price = request.Price,
            IsAvailableForOrder = request.IsAvailableForOrder,
            IsPublished = false,
            IsFeatured = request.IsFeatured,
            LeadTimeNotice = request.LeadTimeNotice,
            GroupsCount = request.GroupsCount,
            Boiler = request.Boiler,
            BoilerCapacity = request.BoilerCapacity,
            Pump = request.Pump,
            PowerLabel = request.PowerLabel,
            Voltage = request.Voltage,
            Dimensions = request.Dimensions,
            WeightLabel = request.WeightLabel,
            Warranty = request.Warranty,
            DailyCapacityLabel = request.DailyCapacityLabel,
            Origin = request.Origin,
            SubRegion = request.SubRegion,
            Altitude = request.Altitude,
            Process = request.Process,
            RoastProfile = request.RoastProfile,
            CuppingScore = request.CuppingScore,
            FlavorNotesJson = request.FlavorNotesJson,
            UnitSize = request.UnitSize,
            CaseSize = request.CaseSize,
            ShelfLife = request.ShelfLife,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        if (request.Images != null && request.Images.Count > 0)
        {
            int pos = 0;
            foreach (var imgUrl in request.Images.Where(u => !string.IsNullOrWhiteSpace(u)))
            {
                product.ProductMedia.Add(new ProductMedium
                {
                    Id = Guid.NewGuid(),
                    ProductId = product.Id,
                    Url = imgUrl.Trim(),
                    Position = pos++,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Audit Log
        await _auditLog.LogActionAsync("Create", "Product", product.Id.ToString(), null, product.ToAdminDto());

        // Cache Invalidation
        await _cache.InvalidateCatalogCacheAsync();

        return await GetAdminProductByIdAsync(product.Id);
    }

    public async Task<AdminProductResponse> UpdateProductGeneralAsync(Guid id, UpdateProductGeneralRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.ProductMedia)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            throw new NotFoundException("Sản phẩm", id);
        }

        if (product.IsPublished) throw new ConcurrencyConflictException("Cần chuyển sản phẩm về nháp trước khi sửa và duyệt lại.");
        // Concurrency Check
        ApplyConcurrencyVersion(product, request.Version);

        // Business Validation: Category & Domain match
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == request.CategoryId);
        if (category == null || !category.IsActive)
        {
            throw new ValidationException("Danh mục không tồn tại.");
        }
        if (category.Domain != request.Domain)
        {
            throw new ValidationException($"Danh mục '{category.Name}' thuộc nhóm '{category.Domain}', không khớp với nhóm sản phẩm '{request.Domain}'.");
        }

        // Business Validation: Brand exists
        var brand = await _context.Brands.FirstOrDefaultAsync(b => b.Id == request.BrandId);
        if (brand == null || !brand.IsActive)
        {
            throw new ValidationException("Thương hiệu không tồn tại.");
        }

        // Slug validation
        var slug = string.IsNullOrWhiteSpace(request.Slug) ? GenerateSlug(request.Name) : GenerateSlug(request.Slug);
        var slugConflict = await _context.Products.IgnoreQueryFilters().AnyAsync(p => p.Slug == slug && p.Id != id);
        if (slugConflict)
        {
            throw new ValidationException($"Đường dẫn (slug) '{slug}' đã được sử dụng bởi sản phẩm khác.");
        }

        // SKU validation
        if (!string.IsNullOrWhiteSpace(request.Sku))
        {
            var skuConflict = await _context.Products.IgnoreQueryFilters().AnyAsync(p => p.Sku == request.Sku && p.Id != id);
            if (skuConflict)
            {
                throw new ValidationException($"Mã SKU '{request.Sku}' đã tồn tại.");
            }
        }

        var oldSnapshot = product.ToAdminDto();

        // Update general fields (Notice: Price and PriceMode are deliberately NOT touched here!)
        product.Name = request.Name.Trim();
        product.Slug = slug;
        product.Sku = string.IsNullOrWhiteSpace(request.Sku) ? null : request.Sku.Trim();
        product.Domain = request.Domain;
        product.CategoryId = request.CategoryId;
        product.BrandId = request.BrandId;
        product.ShortDescription = _sanitizer.Sanitize(request.ShortDescription);
        product.IsAvailableForOrder = request.IsAvailableForOrder;
        product.IsFeatured = request.IsFeatured;
        product.LeadTimeNotice = request.LeadTimeNotice;
        product.GroupsCount = request.GroupsCount;
        product.Boiler = request.Boiler;
        product.BoilerCapacity = request.BoilerCapacity;
        product.Pump = request.Pump;
        product.PowerLabel = request.PowerLabel;
        product.Voltage = request.Voltage;
        product.Dimensions = request.Dimensions;
        product.WeightLabel = request.WeightLabel;
        product.Warranty = request.Warranty;
        product.DailyCapacityLabel = request.DailyCapacityLabel;
        product.Origin = request.Origin;
        product.SubRegion = request.SubRegion;
        product.Altitude = request.Altitude;
        product.Process = request.Process;
        product.RoastProfile = request.RoastProfile;
        product.CuppingScore = request.CuppingScore;
        product.FlavorNotesJson = request.FlavorNotesJson;
        product.UnitSize = request.UnitSize;
        product.CaseSize = request.CaseSize;
        product.ShelfLife = request.ShelfLife;
        product.UpdatedAt = DateTime.UtcNow;

        // Update Media
        if (request.Images != null)
        {
            _context.ProductMedia.RemoveRange(product.ProductMedia);
            int pos = 0;
            foreach (var imgUrl in request.Images.Where(u => !string.IsNullOrWhiteSpace(u)))
            {
                product.ProductMedia.Add(new ProductMedium
                {
                    Id = Guid.NewGuid(),
                    ProductId = product.Id,
                    Url = imgUrl.Trim(),
                    Position = pos++,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await _context.SaveChangesAsync();

        // Audit Log
        await _auditLog.LogActionAsync("UpdateGeneral", "Product", product.Id.ToString(), oldSnapshot, product.ToAdminDto());

        // Cache Invalidation
        await _cache.InvalidateCatalogCacheAsync();

        return await GetAdminProductByIdAsync(product.Id);
    }

    public async Task<AdminProductResponse> UpdateProductPriceAsync(Guid id, UpdateProductPriceRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
        {
            throw new NotFoundException("Sản phẩm", id);
        }

        ApplyConcurrencyVersion(product, request.Version);

        if (product.IsPublished) throw new ConcurrencyConflictException("Cần chuyển sản phẩm về nháp trước khi đổi giá.");
        var oldSnapshot = new { product.PriceMode, product.Price };

        product.PriceMode = request.PriceMode;
        product.Price = request.Price;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var newSnapshot = new { product.PriceMode, product.Price };
        await _auditLog.LogActionAsync("UpdatePrice", "Product", product.Id.ToString(), oldSnapshot, newSnapshot);

        await _cache.InvalidateCatalogCacheAsync();

        return await GetAdminProductByIdAsync(product.Id);
    }

    public async Task<AdminProductResponse> PublishProductAsync(Guid id, PublishProductRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
        {
            throw new NotFoundException("Sản phẩm", id);
        }

        ApplyConcurrencyVersion(product, request.Version);

        var oldStatus = product.IsPublished;
        if (request.IsPublished)
        {
            if ((product.Domain == "equipment" && string.IsNullOrWhiteSpace(product.Warranty)) ||
                (product.Domain == "ingredients" && string.IsNullOrWhiteSpace(product.UnitSize)))
                throw new ValidationException("Xuất bản cần Warranty cho thiết bị hoặc UnitSize cho nguyên liệu.");
            if (!await _context.Categories.AnyAsync(c => c.Id == product.CategoryId && c.IsActive) ||
                !await _context.Brands.AnyAsync(b => b.Id == product.BrandId && b.IsActive))
                throw new ValidationException("Danh mục và thương hiệu phải đang hoạt động.");
        }
        product.IsPublished = request.IsPublished;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await _auditLog.LogActionAsync(
            request.IsPublished ? "Publish" : "Unpublish",
            "Product",
            product.Id.ToString(),
            new { IsPublished = oldStatus },
            new { IsPublished = product.IsPublished });

        await _cache.InvalidateCatalogCacheAsync();

        return await GetAdminProductByIdAsync(product.Id);
    }

    public async Task SoftDeleteProductAsync(Guid id, DeleteResourceRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
        {
            throw new NotFoundException("Sản phẩm", id);
        }

        ApplyConcurrencyVersion(product, request.Version);

        var oldSnapshot = product.ToAdminDto();

        // Soft delete: Set ArchivedAt
        product.ArchivedAt = DateTime.UtcNow;
        product.IsPublished = false;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await _auditLog.LogActionAsync("SoftDelete", "Product", product.Id.ToString(), oldSnapshot, new { ArchivedAt = product.ArchivedAt });

        await _cache.InvalidateCatalogCacheAsync();
    }

    #endregion

    #region Public API

    public async Task<PagedResult<PublicProductResponse>> GetPublicProductsAsync(PublicCatalogQuery query)
    {
        VDungCoffe.Common.ServiceInput.Validate(query);
        var cacheKey = "catalog:products:" + System.Text.Json.JsonSerializer.Serialize(query);
        var cached = await _cache.GetAsync<PagedResult<PublicProductResponse>>(cacheKey);
        if (cached != null)
        {
            return cached;
        }

        // Public Catalog ONLY reads published and non-archived products!
        var dbQuery = _context.Products
            .Where(p => p.IsPublished && p.ArchivedAt == null && p.Category.IsActive && p.Brand.IsActive)
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.ProductMedia)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Domain))
        {
            dbQuery = dbQuery.Where(p => p.Domain == query.Domain);
        }

        if (!string.IsNullOrWhiteSpace(query.CategoryCode))
        {
            dbQuery = dbQuery.Where(p => p.Category.Code == query.CategoryCode);
        }

        if (!string.IsNullOrWhiteSpace(query.BrandCode))
        {
            dbQuery = dbQuery.Where(p => p.Brand.Code == query.BrandCode);
        }

        if (query.FeaturedOnly == true)
        {
            dbQuery = dbQuery.Where(p => p.IsFeatured);
        }

        if (query.MinPrice.HasValue)
        {
            dbQuery = dbQuery.Where(p => p.Price >= query.MinPrice.Value);
        }

        if (query.MaxPrice.HasValue)
        {
            dbQuery = dbQuery.Where(p => p.Price <= query.MaxPrice.Value);
        }

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var kw = query.Keyword.Trim();
            dbQuery = dbQuery.Where(p => p.Name.Contains(kw) || p.ShortDescription.Contains(kw));
        }

        // Sorting
        dbQuery = (query.SortBy?.ToLowerInvariant(), query.IsAscending) switch
        {
            ("name", true) => dbQuery.OrderBy(p => p.Name),
            ("name", false) => dbQuery.OrderByDescending(p => p.Name),
            ("price", true) => dbQuery.OrderBy(p => p.Price),
            ("price", false) => dbQuery.OrderByDescending(p => p.Price),
            _ => dbQuery.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.CreatedAt)
        };

        var totalItems = await dbQuery.CountAsync();
        var items = await dbQuery
            .OrderByStableId().Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .AsNoTracking()
            .ToListAsync();

        var result = new PagedResult<PublicProductResponse>
        {
            Items = items.Select(p => p.ToPublicDto()).ToList(),
            Page = query.Page,
            PageSize = query.PageSize,
            TotalItems = totalItems
        };

        await _cache.SetAsync(cacheKey, result, TimeSpan.FromMinutes(15));
        return result;
    }

    public async Task<PublicProductResponse> GetPublicProductBySlugAsync(string slug)
    {
        var cacheKey = $"catalog:product:slug:{slug}";
        var cached = await _cache.GetAsync<PublicProductResponse>(cacheKey);
        if (cached != null)
        {
            return cached;
        }

        var product = await _context.Products
            .Where(p => p.IsPublished && p.ArchivedAt == null && p.Category.IsActive && p.Brand.IsActive)
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.ProductMedia)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Slug == slug);

        if (product == null)
        {
            throw new NotFoundException($"Không tìm thấy sản phẩm '{slug}'.");
        }

        var dto = product.ToPublicDto();
        await _cache.SetAsync(cacheKey, dto, TimeSpan.FromMinutes(15));
        return dto;
    }

    #endregion

    #region Helpers

    private void ApplyConcurrencyVersion(Product product, string base64Version)
    {
        if (string.IsNullOrWhiteSpace(base64Version))
        {
            throw new ValidationException("Trường Version là bắt buộc để kiểm soát sửa đồng thời.");
        }

        try
        {
            var rawVersion = ServiceInput.DecodeVersion(base64Version);
            _context.Entry(product).OriginalValues[nameof(Product.Version)] = rawVersion;
        }
        catch (FormatException)
        {
            throw new ValidationException("Giá trị Version không hợp lệ.");
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

    #endregion
}
