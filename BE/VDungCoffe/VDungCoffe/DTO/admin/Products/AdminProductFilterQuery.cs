using VDungCoffe.DTO.Common;

namespace VDungCoffe.DTO.Admin.Products;

public class AdminProductFilterQuery : PaginationQuery
{
    public Guid? CategoryId { get; set; }

    public Guid? BrandId { get; set; }

    public string? Domain { get; set; }

    public bool? IsPublished { get; set; }

    public bool? IsArchived { get; set; } = false; // Default: show only active products

    public decimal? MinPrice { get; set; }

    public decimal? MaxPrice { get; set; }
}
