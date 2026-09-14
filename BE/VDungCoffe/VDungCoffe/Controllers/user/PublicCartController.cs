using System.Globalization;
using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VDungCoffe.Common;
using VDungCoffe.Common.Exceptions;
using VDungCoffe.DTO.User.Cart;
using VDungCoffe.Models;

namespace VDungCoffe.Controllers.User;

[ApiController]
[Route("api/cart")]
public class PublicCartController(AuraCoffeeContext db, IDataProtectionProvider protection) : ControllerBase
{
    private const string CookieName = ".Aura.Cart";
    private const int MaxItems = 20;
    private readonly IDataProtector protector = protection.CreateProtector("Aura.Cart.v1");

    // Only product IDs and quantities are stored; prices are always read from SQL.
    private Dictionary<Guid, int> ReadCart()
    {
        if (!Request.Cookies.TryGetValue(CookieName, out var cookie)) return new();
        try
        {
            var items = JsonSerializer.Deserialize<Dictionary<Guid, int>>(protector.Unprotect(cookie));
            if (items is not null && items.Count <= MaxItems && items.All(x => x.Key != Guid.Empty && x.Value is >= 1 and <= 999)) return items;
        }
        catch (Exception ex) when (ex is CryptographicException or JsonException or FormatException) { }
        Response.Cookies.Delete(CookieName, CookieOptions());
        return new();
    }

    private CookieOptions CookieOptions() => new()
    {
        HttpOnly = true, Secure = Request.IsHttps, SameSite = SameSiteMode.Lax,
        Path = "/", MaxAge = TimeSpan.FromDays(30), IsEssential = true
    };

    private void WriteCart(Dictionary<Guid, int> items)
    {
        if (items.Count == 0) Response.Cookies.Delete(CookieName, CookieOptions());
        else Response.Cookies.Append(CookieName, protector.Protect(JsonSerializer.Serialize(items)), CookieOptions());
    }

    private async Task<CartResponse> ResolveCart(Dictionary<Guid, int> items, CancellationToken cancellationToken)
    {
        if (items.Count == 0) return new();
        var ids = items.Keys.ToArray();
        var products = await db.Products.AsNoTracking()
            .Where(p => ids.Contains(p.Id) && p.IsPublished && p.ArchivedAt == null
                && p.IsAvailableForOrder && p.PriceMode != "contact" && p.Price != null
                && p.Category.IsActive && p.Brand.IsActive)
            .Include(p => p.ProductMedia).ToListAsync(cancellationToken);
        return new CartResponse
        {
            Items = products.Select(p => new CartItemDto
            {
                Id = p.Id.ToString(), Title = p.Name, Category = p.Domain == "equipment" ? "equipment" : "beans",
                Price = p.Price!.Value, FormattedPrice = p.Price.Value.ToString("C0", CultureInfo.GetCultureInfo("vi-VN")),
                Image = p.ProductMedia.OrderBy(m => m.Position).FirstOrDefault()?.Url ?? "/images/product-placeholder.svg",
                Quantity = items[p.Id]
            }).ToList()
        };
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<CartResponse>>> Get(CancellationToken cancellationToken)
        => Ok(ApiResponse<CartResponse>.Ok(await ResolveCart(ReadCart(), cancellationToken)));

    [HttpPost("items")]
    public async Task<ActionResult<ApiResponse<CartResponse>>> Add(AddCartItemRequest request, CancellationToken cancellationToken)
    {
        if (request.ProductId == Guid.Empty || request.Quantity is < 1 or > 999)
            throw new ValidationException("Sản phẩm và số lượng không hợp lệ.");
        var items = ReadCart();
        var quantity = items.GetValueOrDefault(request.ProductId) + request.Quantity;
        if (quantity > 999 || (!items.ContainsKey(request.ProductId) && items.Count >= MaxItems))
            throw new ValidationException("Giỏ hàng tối đa 20 sản phẩm, mỗi sản phẩm tối đa 999 đơn vị.");
        items[request.ProductId] = quantity;
        var result = await ResolveCart(items, cancellationToken);
        if (!result.Items.Any(x => x.Id == request.ProductId.ToString()))
            throw new ValidationException("Sản phẩm không còn được bán trực tuyến.");
        WriteCart(items);
        return Ok(ApiResponse<CartResponse>.Ok(result));
    }

    [HttpPut("items/{id:guid}")]
    public async Task<ActionResult<ApiResponse<CartResponse>>> Update(Guid id, UpdateCartItemQuantityRequest request, CancellationToken cancellationToken)
    {
        if (request.Quantity is < 1 or > 999) throw new ValidationException("Số lượng phải từ 1 đến 999.");
        var items = ReadCart();
        if (!items.ContainsKey(id)) throw new NotFoundException("Sản phẩm không có trong giỏ hàng.");
        items[id] = request.Quantity;
        var result = await ResolveCart(items, cancellationToken);
        WriteCart(items);
        return Ok(ApiResponse<CartResponse>.Ok(result));
    }

    [HttpDelete("items/{id:guid}")]
    public async Task<ActionResult<ApiResponse<CartResponse>>> Remove(Guid id, CancellationToken cancellationToken)
    {
        var items = ReadCart();
        items.Remove(id);
        var result = await ResolveCart(items, cancellationToken);
        WriteCart(items);
        return Ok(ApiResponse<CartResponse>.Ok(result));
    }

    [HttpDelete]
    public ActionResult<ApiResponse<CartResponse>> Clear()
    {
        WriteCart(new());
        return Ok(ApiResponse<CartResponse>.Ok(new()));
    }
}
