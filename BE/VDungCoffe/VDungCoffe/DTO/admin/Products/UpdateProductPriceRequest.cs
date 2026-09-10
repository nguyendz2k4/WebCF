namespace VDungCoffe.DTO.Admin.Products;

public class UpdateProductPriceRequest
{
    public string Version { get; set; } = string.Empty; // Required for optimistic concurrency

    public string PriceMode { get; set; } = "fixed"; // "fixed", "from", "contact"

    public decimal? Price { get; set; }
}
