namespace VDungCoffe.DTO.Admin.Workspace;

public class AdminWorkspaceResponse
{
    public List<Dictionary<string, object?>> Products { get; set; } = new();
    public List<Dictionary<string, object?>> Categories { get; set; } = new();
    public List<Dictionary<string, object?>> Brands { get; set; } = new();
    public List<Dictionary<string, object?>> Orders { get; set; } = new();
    public List<Dictionary<string, object?>> Customers { get; set; } = new();
    public List<Dictionary<string, object?>> Articles { get; set; } = new();
    public List<Dictionary<string, object?>> Contacts { get; set; } = new();
    public List<Dictionary<string, object?>> Payments { get; set; } = new();
}
