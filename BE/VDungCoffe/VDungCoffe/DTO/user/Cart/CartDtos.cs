namespace VDungCoffe.DTO.User.Cart;

public class CartItemDto
{
    public string Id { get; set; } = string.Empty; // Product ID
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // "equipment" | "beans" | "package" | "service"
    public decimal Price { get; set; }
    public string FormattedPrice { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public string? Subtitle { get; set; }
    public string? Specs { get; set; }
}

public class AddCartItemRequest
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; } = 1;
}

public class UpdateCartItemQuantityRequest
{
    public int Quantity { get; set; }
}

public class CartResponse
{
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalAmount => Items.Sum(i => i.Price * i.Quantity);
}
