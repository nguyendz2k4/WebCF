namespace VDungCoffe.DTO.User.Contacts;

public class ContactSubmitRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? BusinessName { get; set; }
    public string ServiceType { get; set; } = "full-setup"; // "full-setup" | "equipment" | "coffee-beans" | "bar-training"
    public string BudgetRange { get; set; } = "100m-300m"; // "under-100m" | "100m-300m" | "300m-600m" | "above-600m" | "custom"
    public string Message { get; set; } = string.Empty;
}
