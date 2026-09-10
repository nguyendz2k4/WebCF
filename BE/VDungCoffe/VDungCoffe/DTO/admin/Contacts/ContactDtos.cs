using VDungCoffe.DTO.Common;

namespace VDungCoffe.DTO.Admin.Contacts;

public class AdminContactResponse
{
    public string Version { get; set; } = string.Empty;
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? BusinessName { get; set; }
    public string ServiceType { get; set; } = string.Empty;
    public string BudgetRange { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // "Mới", "Đang xử lý", "Đã giải quyết"
    public DateTime CreatedAt { get; set; }
}

public class UpdateContactStatusRequest
{
    public string Version { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class AdminContactFilterQuery : PaginationQuery
{
    public string? Status { get; set; }
}
