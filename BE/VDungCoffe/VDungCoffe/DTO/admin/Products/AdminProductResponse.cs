namespace VDungCoffe.DTO.Admin.Products;

public class AdminProductResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Sku { get; set; }
    public string Domain { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public Guid BrandId { get; set; }
    public string BrandName { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string PriceMode { get; set; } = string.Empty; // "fixed", "from", "contact"
    public decimal? Price { get; set; }
    public bool IsAvailableForOrder { get; set; }
    public bool IsPublished { get; set; }
    public bool IsFeatured { get; set; }
    public string? LeadTimeNotice { get; set; }
    public DateTime? ArchivedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Version { get; set; } = string.Empty; // Base64 rowversion

    // Media & specs
    public List<string> Images { get; set; } = new();
    public string? Warranty { get; set; }
    public string? PowerLabel { get; set; }
    public string? Dimensions { get; set; }
    public string? WeightLabel { get; set; }
    public string? Origin { get; set; }
    public string? RoastProfile { get; set; }
    public decimal? CuppingScore { get; set; }
    public int? GroupsCount { get; set; }
    public string? Boiler { get; set; }
    public string? BoilerCapacity { get; set; }
    public string? Pump { get; set; }
    public string? Voltage { get; set; }
    public string? DailyCapacityLabel { get; set; }
    public string? SubRegion { get; set; }
    public string? Altitude { get; set; }
    public string? Process { get; set; }
    public string? FlavorNotesJson { get; set; }
    public string? UnitSize { get; set; }
    public string? CaseSize { get; set; }
    public string? ShelfLife { get; set; }
}
