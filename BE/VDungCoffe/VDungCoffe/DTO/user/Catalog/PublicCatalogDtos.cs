using VDungCoffe.DTO.Common;

namespace VDungCoffe.DTO.User.Catalog;

public class PublicProductResponse
{
    public string Id { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Sku { get; set; }
    public string Category { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string PriceType { get; set; } = "fixed"; // "fixed", "from", "contact"
    public decimal Price { get; set; }
    public string FormattedPrice { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool InStock { get; set; } = true;
    public bool IsFeatured { get; set; }
    public string? LeadTimeNotice { get; set; }
    public List<string> Images { get; set; } = new();

    // Technical specs (for machines/equipment)
    public EquipmentSpecsDto? Specs { get; set; }

    // Origin specs (for coffee beans)
    public BeanSpecsDto? BeanDetails { get; set; }
}

public class EquipmentSpecsDto
{
    public int? Groups { get; set; }
    public string? Boiler { get; set; }
    public string? BoilerCapacity { get; set; }
    public string? Pump { get; set; }
    public string? Power { get; set; }
    public string? Voltage { get; set; }
    public string? Dimensions { get; set; }
    public string? Weight { get; set; }
    public string? Warranty { get; set; }
    public string? DailyCapacity { get; set; }
}

public class BeanSpecsDto
{
    public string? Origin { get; set; }
    public string? SubRegion { get; set; }
    public string? Altitude { get; set; }
    public string? Process { get; set; }
    public string? RoastProfile { get; set; }
    public decimal? CuppingScore { get; set; }
    public List<string>? FlavorNotes { get; set; }
    public string? UnitSize { get; set; }
}

public class PublicArticleResponse
{
    public string Id { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string CoverImage { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public string AuthorRole { get; set; } = string.Empty;
    public string? AuthorAvatar { get; set; }
    public int ReadTime { get; set; }
    public List<string> Tags { get; set; } = new();
    public string LeadParagraph { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty; // Sanitized HTML or JSON content
    public DateTime? PublishedAt { get; set; }
}

public class PublicCatalogQuery : PaginationQuery
{
    public string? Domain { get; set; }
    public string? CategoryCode { get; set; }
    public string? BrandCode { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? FeaturedOnly { get; set; }
}
