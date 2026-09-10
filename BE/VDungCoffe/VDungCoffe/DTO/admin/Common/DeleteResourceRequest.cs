namespace VDungCoffe.DTO.Admin.Common;

public class DeleteResourceRequest
{
    // Base64 RowVersion string for optimistic concurrency check
    public string Version { get; set; } = string.Empty;
}
