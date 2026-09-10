namespace VDungCoffe.DTO.Common;

public class PaginationQuery
{
    private const int MaxPageSize = 100;
    private int _pageSize = 20;

    [System.ComponentModel.DataAnnotations.Range(1, 1000000)]
    public int Page { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : (value < 1 ? 1 : value);
    }

    public string? Keyword { get; set; }

    public string? SortBy { get; set; }

    public string SortDir { get; set; } = "desc"; // "asc" or "desc"

    public void Validate()
    {
        if (Page < 1 || Page > 1000000) throw new VDungCoffe.Common.Exceptions.ValidationException("Page phải từ 1 đến 1000000.");
        if (SortDir != "asc" && SortDir != "desc") throw new VDungCoffe.Common.Exceptions.ValidationException("SortDir phải là asc hoặc desc.");
        if (Keyword?.Length > 250) throw new VDungCoffe.Common.Exceptions.ValidationException("Keyword tối đa 250 ký tự.");
    }

    public bool IsAscending => string.Equals(SortDir, "asc", StringComparison.OrdinalIgnoreCase);
}
