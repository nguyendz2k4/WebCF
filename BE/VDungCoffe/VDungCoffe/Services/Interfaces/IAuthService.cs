using VDungCoffe.DTO.User.Auth;

namespace VDungCoffe.Services.Interfaces;

public interface IAuthService
{
    Task<AuthTokenResponse> LoginAsync(LoginRequest request);
    Task<AuthUserResponse> RegisterAsync(RegisterRequest request);
    Task<AuthMeResponse> GetCurrentProfileAsync();
    Task LogoutAsync();
}

public class AuthUserResponse
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
