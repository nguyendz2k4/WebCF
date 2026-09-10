namespace VDungCoffe.Models;
public sealed class CheckoutQuoteUse
{
    public string QuoteId { get; set; } = string.Empty;
    public Guid OrderId { get; set; }
}
