using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using VDungCoffe.Models;
using VDungCoffe.Security;

namespace VDungCoffe.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(IServiceProvider serviceProvider, IConfiguration configuration)
    {
        using var scope = serviceProvider.CreateScope();
        var roles = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var users = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        foreach (var name in new[] { Permissions.RoleDefaults.SuperAdmin, Permissions.RoleDefaults.AdminAssistant, Permissions.RoleDefaults.ContentEditor })
        {
            if (!await roles.RoleExistsAsync(name)) Ensure(await roles.CreateAsync(new IdentityRole<Guid>(name)));
        }
        foreach (var pair in new[] {
            (Permissions.RoleDefaults.AdminAssistant, Permissions.RoleDefaults.AdminAssistantPermissions),
            (Permissions.RoleDefaults.ContentEditor, Permissions.RoleDefaults.ContentEditorPermissions) })
        {
            var role = (await roles.FindByNameAsync(pair.Item1))!;
            var existing = await roles.GetClaimsAsync(role);
            foreach (var permission in pair.Item2)
                if (!existing.Any(c => c.Type == "Permission" && c.Value == permission))
                    Ensure(await roles.AddClaimAsync(role, new Claim("Permission", permission)));
        }

        // Explicit provisioning only. Never promote an account registered through the public API.
        if (!configuration.GetValue<bool>("InitialAdmin:Enabled")) return;
        var email = configuration["InitialAdmin:Email"]?.Trim();
        var password = configuration["InitialAdmin:Password"];
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password) || password.Length < 12)
            throw new InvalidOperationException("InitialAdmin requires an email and a unique password of at least 12 characters from secrets configuration.");
        var existingUser = await users.FindByEmailAsync(email);
        if (existingUser != null)
        {
            if (!await users.IsInRoleAsync(existingUser, Permissions.RoleDefaults.SuperAdmin))
                throw new InvalidOperationException("InitialAdmin email already belongs to a non-SuperAdmin account; automatic promotion is prohibited.");
            return;
        }
        var user = new AppUser
        {
            Id = Guid.NewGuid(), UserName = email, Email = email, DisplayName = "Quản trị viên trưởng",
            EmailConfirmed = true, CustomerPersona = "owner", CreatedAt = DateTime.UtcNow
        };
        Ensure(await users.CreateAsync(user, password));
        Ensure(await users.AddToRoleAsync(user, Permissions.RoleDefaults.SuperAdmin));
    }

    private static void Ensure(IdentityResult result)
    {
        if (!result.Succeeded) throw new InvalidOperationException(string.Join("; ", result.Errors.Select(e => e.Description)));
    }
}
