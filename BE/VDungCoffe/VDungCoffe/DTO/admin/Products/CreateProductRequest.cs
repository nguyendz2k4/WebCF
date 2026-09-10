namespace VDungCoffe.DTO.Admin.Products;

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Sku { get; set; }
    public string Domain { get; set; } = "equipment"; // "equipment" or "ingredients"
    public Guid CategoryId { get; set; }
    public Guid BrandId { get; set; }
    public string ShortDescription { get; set; } = string.Empty;
    public string PriceMode { get; set; } = "fixed"; // "fixed", "from", "contact"
    public decimal? Price { get; set; }
    public bool IsAvailableForOrder { get; set; } = true;
    public bool IsFeatured { get; set; } = false;
    public string? LeadTimeNotice { get; set; }

    // Media
    public List<string>? Images { get; set; }

    // Specs
    public int? GroupsCount { get; set; }
    public string? Boiler { get; set; }
    public string? BoilerCapacity { get; set; }
    public string? Pump { get; set; }
    public string? PowerLabel { get; set; }
    public string? Voltage { get; set; }
    public string? Dimensions { get; set; }
    public string? WeightLabel { get; set; }
    public string? Warranty { get; set; }
    public string? DailyCapacityLabel { get; set; }
    public string? Origin { get; set; }
    public string? SubRegion { get; set; }
    public string? Altitude { get; set; }
    public string? Process { get; set; }
    public string? RoastProfile { get; set; }
    public decimal? CuppingScore { get; set; }
    public string? FlavorNotesJson { get; set; }
    public string? UnitSize { get; set; }
    public string? CaseSize { get; set; }
    public string? ShelfLife { get; set; }
}
