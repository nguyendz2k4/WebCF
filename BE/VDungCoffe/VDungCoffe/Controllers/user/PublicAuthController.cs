using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VDungCoffe.Common;
using VDungCoffe.DTO.User.Auth;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Controllers.User;

[ApiController]
[Route("api/auth")]
public class PublicAuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public PublicAuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthTokenResponse>>> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        return Ok(ApiResponse<AuthTokenResponse>.Ok(result, "Đăng nhập thành công"));
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthUserResponse>>> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        return Ok(ApiResponse<AuthUserResponse>.Ok(result, "Đăng ký tài khoản thành công"));
    }

    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<AuthMeResponse>>> GetCurrentProfile()
    {
        var result = await _authService.GetCurrentProfileAsync();
        return Ok(ApiResponse<AuthMeResponse>.Ok(result));
    }

    [HttpPost("logout")]
    public async Task<ActionResult<ApiResponse<object>>> Logout()
    {
        await _authService.LogoutAsync();
        return Ok(ApiResponse<object>.Ok(new { }, "Đăng xuất thành công"));
    }
}
