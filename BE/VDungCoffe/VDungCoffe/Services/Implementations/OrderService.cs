using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using VDungCoffe.Common;
using VDungCoffe.Common.Exceptions;
using VDungCoffe.DTO.Admin.Orders;
using VDungCoffe.DTO.User.Cart;
using VDungCoffe.DTO.User.Orders;
using VDungCoffe.Mappings;
using VDungCoffe.Models;
using VDungCoffe.Security;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly AuraCoffeeContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly ICacheService _cache;
    private readonly IAuditLogService _auditLog;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        AuraCoffeeContext context,
        ICurrentUser currentUser,
        ICacheService cache,
        IAuditLogService auditLog,
        ILogger<OrderService> logger)
    {
        _context = context;
        _currentUser = currentUser;
        _cache = cache;
        _auditLog = auditLog;
        _logger = logger;
    }

    #region Admin API

    public async Task<PagedResult<AdminOrderResponse>> GetAdminOrdersAsync(AdminOrderFilterQuery query)
    {
        VDungCoffe.Common.ServiceInput.Validate(query);
        var dbQuery = _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderEvents)
            .Include(o => o.OrderItems)
            .Include(o => o.PaymentEntries)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var kw = query.Keyword.Trim();
            dbQuery = dbQuery.Where(o => o.OrderCode.Contains(kw) || o.RecipientName.Contains(kw) || o.Phone.Contains(kw));
        }

        if (query.FromDate.HasValue)
        {
            dbQuery = dbQuery.Where(o => o.CreatedAt >= query.FromDate.Value);
        }

        if (query.ToDate.HasValue)
        {
            dbQuery = dbQuery.Where(o => o.CreatedAt <= query.ToDate.Value);
        }

                if (query.Status != null)
        {
            if (!new[] { "submitted", "confirmed", "processing", "dispatched", "completed", "cancelled" }.Contains(query.Status)) throw new ValidationException("Status không hợp lệ.");
            dbQuery = dbQuery.Where(o => (o.OrderEvents.OrderByDescending(e => e.Sequence).Select(e => e.Status).FirstOrDefault() ?? "submitted") == query.Status);
        }
        if (query.PaymentStatus != null)
        {
            if (query.PaymentStatus is not ("Đã thanh toán" or "Chưa thanh toán")) throw new ValidationException("PaymentStatus không hợp lệ.");
            var paid = query.PaymentStatus == "Đã thanh toán";
            dbQuery = dbQuery.Where(o => o.PaymentEntries.Any(p => p.Kind == "receipt") == paid);
        }
        if (query.FromDate > query.ToDate) throw new ValidationException("Khoảng ngày không hợp lệ.");
        var sorted = (query.SortBy?.ToLowerInvariant() ?? "createdat") switch
        {
            "createdat" => query.IsAscending ? dbQuery.OrderBy(o => o.CreatedAt) : dbQuery.OrderByDescending(o => o.CreatedAt),
            "ordercode" => query.IsAscending ? dbQuery.OrderBy(o => o.OrderCode) : dbQuery.OrderByDescending(o => o.OrderCode),
            "total" => query.IsAscending ? dbQuery.OrderBy(o => o.Total) : dbQuery.OrderByDescending(o => o.Total),
            _ => throw new ValidationException("SortBy hỗ trợ createdAt, orderCode, total.")
        };
        var total = await dbQuery.CountAsync();
        var items = await sorted.ThenBy(o => o.Id)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        return new PagedResult<AdminOrderResponse>
        {
            Items = items.Select(o => o.ToAdminDto()).ToList(),
            Page = query.Page,
            PageSize = query.PageSize,
            TotalItems = total
        };
    }

    public async Task<AdminOrderResponse> GetAdminOrderByIdAsync(Guid id)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderEvents).ThenInclude(e => e.Actor)
            .Include(o => o.OrderItems)
            .Include(o => o.PaymentEntries)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) throw new NotFoundException("Đơn hàng", id);
        return order.ToAdminDto();
    }

    public async Task<AdminOrderResponse> UpdateOrderStatusAsync(Guid id, UpdateOrderStatusRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var order = await _context.Orders
            .FromSqlInterpolated($"SELECT * FROM dbo.[Order] WITH (UPDLOCK, HOLDLOCK) WHERE Id = {id}")
            .Include(o => o.Customer)
            .Include(o => o.OrderEvents)
            .Include(o => o.OrderItems)
            .Include(o => o.PaymentEntries)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) throw new NotFoundException("Đơn hàng", id);

        if (string.IsNullOrWhiteSpace(request.Version))
        {
            throw new ValidationException("Thiếu trường Version để kiểm soát sửa đồng thời.");
        }

        try
        {
            _context.Entry(order).OriginalValues[nameof(Order.Version)] = ServiceInput.DecodeVersion(request.Version);
        }
        catch
        {
            throw new ValidationException("Version không hợp lệ.");
        }

        var latestEvent = order.OrderEvents.OrderByDescending(e => e.Sequence).FirstOrDefault();
        var currentStatus = latestEvent?.Status ?? "submitted";
        if (!order.Version.SequenceEqual(ServiceInput.DecodeVersion(request.Version)) || request.ExpectedSequence != latestEvent?.Sequence)
            throw new ConcurrencyConflictException();

        var allowed = currentStatus switch
        {
            "submitted" => new[] { "confirmed", "cancelled" },
            "confirmed" => new[] { "processing", "cancelled" },
            "processing" => new[] { "dispatched", "cancelled" },
            "dispatched" => new[] { "completed" },
            _ => Array.Empty<string>()
        };
        if (!allowed.Contains(request.Status)) throw new ValidationException($"Không thể chuyển trạng thái từ '{currentStatus}' sang '{request.Status}'.");
        var nextSequence = (latestEvent?.Sequence ?? 0) + 1;
        var actorId = _currentUser.UserId ?? order.CustomerId;

        var orderEvent = new OrderEvent
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            Sequence = nextSequence,
            Status = request.Status,
            ActorId = actorId,
            Note = request.Note,
            CreatedAt = DateTime.UtcNow
        };

        _context.OrderEvents.Add(orderEvent);
        await _context.SaveChangesAsync();

        await _auditLog.LogActionAsync("UpdateStatus", "Order", order.Id.ToString(),
            new { Status = currentStatus },
            new { Status = request.Status, Note = request.Note });

        return await GetAdminOrderByIdAsync(order.Id);
    }

    #endregion

    #region Public Checkout API

    public async Task<CheckoutQuoteResponse> CalculateQuoteAsync(CheckoutQuoteRequest request)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        if (!_currentUser.UserId.HasValue) throw new UnauthorizedException();
        var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id) && p.IsPublished && p.ArchivedAt == null && p.Category.IsActive && p.Brand.IsActive)
            .Include(p => p.Category)
            .Include(p => p.ProductMedia)
            .ToDictionaryAsync(p => p.Id);

        var cartItems = new List<CartItemDto>();
        decimal subtotal = 0m;
        var viCulture = new CultureInfo("vi-VN");

        foreach (var reqItem in request.Items)
        {
            if (!products.TryGetValue(reqItem.ProductId, out var product))
            {
                throw new ValidationException($"Sản phẩm mã '{reqItem.ProductId}' không tồn tại hoặc đã ngừng kinh doanh.");
            }

            if (!product.IsAvailableForOrder)
            {
                throw new ValidationException($"Sản phẩm '{product.Name}' hiện đã hết hàng.");
            }

            if (product.PriceMode != "fixed" || !product.Price.HasValue || product.Price <= 0) throw new ValidationException("Sản phẩm cần liên hệ báo giá, không thể đặt với giá 0.");
            var price = product.Price.Value;
            var lineTotal = price * reqItem.Quantity;
            subtotal += lineTotal;

            cartItems.Add(new CartItemDto
            {
                Id = product.Id.ToString(),
                Title = product.Name,
                Category = product.Domain == "equipment" ? "equipment" : "beans",
                Price = price,
                FormattedPrice = string.Format(viCulture, "{0:C0}", price),
                Image = product.ProductMedia?.OrderBy(m => m.Position).FirstOrDefault()?.Url ?? string.Empty,
                Quantity = reqItem.Quantity
            });
        }

        // Standard shipping calculation (free above 500.000 VND)
        decimal shippingFee = subtotal >= 500000m ? 0m : 30000m;
        decimal grandTotal = subtotal + shippingFee;

        var quoteId = Guid.NewGuid().ToString("N");
        var expiresAt = DateTime.UtcNow.AddMinutes(30);

        var quoteData = new StoredQuoteData
        {
            QuoteId = quoteId,
            CustomerId = _currentUser.UserId.Value,
            RecipientName = request.RecipientName.Trim(),
            Phone = request.Phone.Trim(),
            Province = request.Province.Trim(),
            District = request.District.Trim(),
            AddressLine = request.AddressLine.Trim(),
            DeliveryNote = request.DeliveryNote,
            Subtotal = subtotal,
            ShippingFee = shippingFee,
            Total = grandTotal,
            ExpiresAt = expiresAt,
            Items = cartItems
        };

        // Cache quote for checkout creation
        await _cache.SetAsync($"quote:{quoteId}", quoteData, TimeSpan.FromMinutes(35));

        return new CheckoutQuoteResponse
        {
            Id = quoteId,
            Total = grandTotal,
            ExpiresAt = expiresAt.ToString("o"),
            Items = cartItems,
            PaymentMethods = new List<PaymentMethodOptionDto>
            {
                new() { Id = "cod", Label = "Thanh toán khi nhận hàng (COD)" },
                new() { Id = "vietqr", Label = "Chuyển khoản ngân hàng" }
            }
        };
    }

    public async Task<OrderReceiptResponse> CreateOrderAsync(CreateOrderRequest request, string? idempotencyKeyHeader)
    {
        VDungCoffe.Common.ServiceInput.Validate(request);
        var customerId = _currentUser.UserId ?? throw new UnauthorizedException();
        if (!Guid.TryParse(idempotencyKeyHeader, out var idempotencyGuid) || idempotencyGuid == Guid.Empty)
            throw new ValidationException("Idempotency-Key bắt buộc là GUID hợp lệ.");
        var requestHash = ComputeSha256(JsonSerializer.Serialize(request));
        // Check if an order was already processed with this idempotency key
        var existingOrder = await _context.Orders
            .Include(o => o.OrderEvents)
            .Include(o => o.PaymentEntries)
            .FirstOrDefaultAsync(o => o.IdempotencyKey == idempotencyGuid);

        if (existingOrder != null)
        {
            if (existingOrder.CustomerId != customerId) throw new ForbiddenException();
            if (existingOrder.RequestHash != requestHash) throw new ConcurrencyConflictException("Idempotency-Key đã dùng cho nội dung khác.");
            var latest = existingOrder.OrderEvents.OrderByDescending(e => e.Sequence).FirstOrDefault();
            var hasPayment = existingOrder.PaymentEntries.Any(p => p.Kind == "receipt");
            return new OrderReceiptResponse
            {
                Id = existingOrder.Id.ToString(),
                OrderCode = existingOrder.OrderCode,
                Total = existingOrder.Total,
                Status = latest?.Status ?? "submitted",
                PaymentStatus = hasPayment ? "Đã thanh toán" : "Chưa thanh toán"
            };
        }

        // Retrieve Quote
        var quoteKey = $"quote:{request.QuoteId}";
        var quote = await _cache.GetAsync<StoredQuoteData>(quoteKey);
        if (quote == null || quote.ExpiresAt < DateTime.UtcNow)
        {
            throw new ValidationException("Báo giá đơn hàng đã hết hạn hoặc không tồn tại. Vui lòng tải lại giỏ hàng và thử lại.");
        }

        if (quote.CustomerId != customerId) throw new ForbiddenException();
        await using var transaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        var ids = quote.Items.Select(i => Guid.Parse(i.Id)).ToList();
        var currentProducts = await _context.Products.Where(p => ids.Contains(p.Id) && p.Category.IsActive && p.Brand.IsActive).AsNoTracking().ToDictionaryAsync(p => p.Id);
        foreach (var item in quote.Items)
        {
            if (!currentProducts.TryGetValue(Guid.Parse(item.Id), out var product) || !product.IsPublished || product.ArchivedAt != null ||
                !product.IsAvailableForOrder || product.PriceMode != "fixed" || product.Price != item.Price || product.Price <= 0)
                throw new ConcurrencyConflictException("Sản phẩm/giá/tình trạng bán đã thay đổi. Vui lòng tạo báo giá mới.");
        }
        var orderCode = $"AUR-{Guid.NewGuid():N}"[..32];
        var order = new Order
        {
            Id = Guid.NewGuid(),
            OrderCode = orderCode,
            CustomerId = customerId,
            IdempotencyKey = idempotencyGuid,
            RequestHash = requestHash,
            Currency = "VND",
            PreferredPaymentMethod = request.PreferredPaymentMethod,
            RecipientName = quote.RecipientName,
            Phone = quote.Phone,
            Email = _currentUser.Email,
            AddressLine = quote.AddressLine,
            Province = quote.Province,
            District = quote.District,
            DeliveryNote = quote.DeliveryNote,
            Subtotal = quote.Subtotal,
            DiscountTotal = 0m,
            ShippingFee = quote.ShippingFee,
            Total = quote.Total,
            SubmittedAt = null,
            CreatedAt = DateTime.UtcNow
        };

        // Add Order Items
        int lineNumber = 1;
        foreach (var item in quote.Items)
        {
            order.OrderItems.Add(new OrderItem
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                ProductId = Guid.Parse(item.Id),
                LineNumber = lineNumber++,
                ProductName = item.Title,
                UnitPrice = item.Price,
                Quantity = item.Quantity,
                LineTotal = item.Price * item.Quantity,
                CreatedAt = DateTime.UtcNow
            });
        }

        // Add Initial Order Event
        var initialEvent = new OrderEvent
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            Sequence = 1,
            Status = "submitted",
            ActorId = customerId,
            Note = "Đơn hàng đã được đặt trực tuyến.",
            CreatedAt = DateTime.UtcNow
        };

        _context.Orders.Add(order);
        _context.Set<CheckoutQuoteUse>().Add(new CheckoutQuoteUse { QuoteId = quote.QuoteId, OrderId = order.Id });
        // Respect existing SQL triggers: draft + items, seal, then append submitted event.
        await _context.SaveChangesAsync();
        order.SubmittedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        _context.OrderEvents.Add(initialEvent);
        await _context.SaveChangesAsync();

        await transaction.CommitAsync();

        // Invalidate quote after use
        await _cache.RemoveAsync(quoteKey);

        return new OrderReceiptResponse
        {
            Id = order.Id.ToString(),
            OrderCode = order.OrderCode,
            Total = order.Total,
            Status = "submitted",
            PaymentStatus = "Chưa thanh toán"
        };
    }

    public async Task<OrderReceiptResponse> GetOrderReceiptAsync(Guid id)
    {
        var order = await _context.Orders
            .Include(o => o.OrderEvents)
            .Include(o => o.PaymentEntries)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) throw new NotFoundException("Đơn hàng", id);

        if (!_currentUser.IsAuthenticated || order.CustomerId != _currentUser.UserId) throw new ForbiddenException();
        var latest = order.OrderEvents.OrderByDescending(e => e.Sequence).FirstOrDefault();
        var hasPayment = order.PaymentEntries.Any(p => p.Kind == "receipt");

        return new OrderReceiptResponse
        {
            Id = order.Id.ToString(),
            OrderCode = order.OrderCode,
            Total = order.Total,
            Status = latest?.Status ?? "submitted",
            PaymentStatus = hasPayment ? "Đã thanh toán" : "Chưa thanh toán"
        };
    }

    #endregion

    private static string ComputeSha256(string input)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    private class StoredQuoteData
    {
        public Guid CustomerId { get; set; }
        public string QuoteId { get; set; } = string.Empty;
        public string RecipientName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string AddressLine { get; set; } = string.Empty;
        public string? DeliveryNote { get; set; }
        public decimal Subtotal { get; set; }
        public decimal ShippingFee { get; set; }
        public decimal Total { get; set; }
        public DateTime ExpiresAt { get; set; }
        public List<CartItemDto> Items { get; set; } = new();
    }
}

