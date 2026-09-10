namespace Aura.Api.Models;

public sealed class Product : BaseEntity
{
    public string? LegacyId { get; set; }
    public string Slug { get; set; } = null!;
    public string? Sku { get; set; }
    public string Name { get; set; } = null!;
    public Guid CategoryId { get; set; }
    public string Domain { get; set; } = null!;
    public Guid BrandId { get; set; }
    public string ShortDescription { get; set; } = null!;
    public string PriceMode { get; set; } = null!;
    public decimal? Price { get; set; }
    public bool IsAvailableForOrder { get; set; }
    public bool IsPublished { get; set; } = false;
    public bool IsFeatured { get; set; } = false;
    public string? LeadTimeNotice { get; set; }
    public DateTime? ArchivedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public byte[] Version { get; set; } = [];
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
    public Category Category { get; set; } = null!;
    public Brand Brand { get; set; } = null!;
}
