namespace VDungCoffe.DTO.User.Auth;

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? ShopName { get; set; }
    public string? Phone { get; set; }
}

public class UserProfileDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "guest"; // Customer persona: "owner", "barista", "guest"
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public string? ShopName { get; set; }
}

public class AuthMeResponse
{
    public UserProfileDto User { get; set; } = new();
    public bool IsAdmin { get; set; }
    public List<string> Permissions { get; set; } = new();
}

public class AuthTokenResponse
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserProfileDto User { get; set; } = new();
    public bool IsAdmin { get; set; }
    public List<string> Permissions { get; set; } = new();
}
