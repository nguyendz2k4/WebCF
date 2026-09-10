using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace VDungCoffe.Security;

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        if (context.User?.Identity?.IsAuthenticated != true)
        {
            return Task.CompletedTask;
        }

        // SuperAdmin has all permissions implicitly
        if (context.User.IsInRole(Permissions.RoleDefaults.SuperAdmin))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // Check if user has explicit permission claim
        var hasPermission = context.User.Claims
            .Any(c => (c.Type == "Permission" || c.Type == "permission") &&
                      string.Equals(c.Value, requirement.Permission, StringComparison.OrdinalIgnoreCase));

        if (hasPermission)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
