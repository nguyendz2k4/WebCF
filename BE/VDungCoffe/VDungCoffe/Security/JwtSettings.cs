namespace VDungCoffe.Security;

public static class JwtSettings
{
    public static string RequireKey(IConfiguration configuration)
    {
        var key = configuration["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(key) || System.Text.Encoding.UTF8.GetByteCount(key) < 32 ||
            key == "AuraCoffeeSuperSecretKeyForDevelopment2026!@#$%^&*()")
            throw new InvalidOperationException("Set Jwt:Key using user-secrets or Jwt__Key environment variable to a new random secret of at least 32 bytes.");
        return key;
    }
}
