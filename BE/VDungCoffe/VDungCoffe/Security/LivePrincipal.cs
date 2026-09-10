using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using VDungCoffe.Models;

namespace VDungCoffe.Security;

public static class LivePrincipal
{
    public static bool IsAdminRole(string role) => role is Permissions.RoleDefaults.SuperAdmin
        or Permissions.RoleDefaults.AdminAssistant or Permissions.RoleDefaults.ContentEditor;

    // Never authorize with permissions captured in a long-lived cookie or token.
    public static async Task<bool> RefreshAsync(ClaimsPrincipal? principal, IServiceProvider services)
    {
        if (principal?.Identity is not ClaimsIdentity identity) return false;
        var users = services.GetRequiredService<UserManager<AppUser>>();
        var roles = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var id = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = id == null ? null : await users.FindByIdAsync(id);
        if (user == null || user.DisabledAt != null || await users.IsLockedOutAsync(user)) return false;
        var stampType = services.GetRequiredService<Microsoft.Extensions.Options.IOptions<IdentityOptions>>().Value.ClaimsIdentity.SecurityStampClaimType;
        var stamp = principal.FindFirstValue(stampType);
        if (stamp != user.SecurityStamp) return false;
        foreach (var old in identity.Claims.Where(c => c.Type == ClaimTypes.Role || c.Type is "Permission" or "permission").ToList())
            identity.RemoveClaim(old);
        var currentRoles = await users.GetRolesAsync(user);
        foreach (var roleName in currentRoles)
        {
            identity.AddClaim(new Claim(ClaimTypes.Role, roleName));
            var role = await roles.FindByNameAsync(roleName);
            if (role != null)
                identity.AddClaims((await roles.GetClaimsAsync(role)).Where(c => c.Type is "Permission" or "permission"));
        }
        identity.AddClaims((await users.GetClaimsAsync(user)).Where(c => c.Type is "Permission" or "permission"));
        return true;
    }
}
