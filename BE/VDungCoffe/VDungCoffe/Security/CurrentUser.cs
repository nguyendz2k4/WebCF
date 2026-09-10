using System.Security.Claims;

namespace VDungCoffe.Security;

public interface ICurrentUser
{
    Guid? UserId { get; }
    string? Email { get; }
    string? DisplayName { get; }
    bool IsAuthenticated { get; }
    bool IsAdmin { get; }
    string? IpAddress { get; }
    bool HasPermission(string permission);
}

public class CurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public Guid? UserId
    {
        get
        {
            var idClaim = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User?.FindFirst("sub")?.Value;
            return Guid.TryParse(idClaim, out var guid) ? guid : null;
        }
    }

    public string? Email => User?.FindFirst(ClaimTypes.Email)?.Value ?? User?.FindFirst("email")?.Value;

    public string? DisplayName => User?.FindFirst(ClaimTypes.Name)?.Value ?? Email;

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated == true;

    public bool IsAdmin =>
        User?.IsInRole(Permissions.RoleDefaults.SuperAdmin) == true ||
        User?.IsInRole(Permissions.RoleDefaults.AdminAssistant) == true ||
        User?.IsInRole(Permissions.RoleDefaults.ContentEditor) == true ||
        User?.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value.Contains("Admin", StringComparison.OrdinalIgnoreCase)) == true;

    public string? IpAddress => _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString();

    public bool HasPermission(string permission)
    {
        if (!IsAuthenticated) return false;
        if (User?.IsInRole(Permissions.RoleDefaults.SuperAdmin) == true) return true;
        return User?.Claims.Any(c => (c.Type == "Permission" || c.Type == "permission") &&
                                     string.Equals(c.Value, permission, StringComparison.OrdinalIgnoreCase)) == true;
    }
}
