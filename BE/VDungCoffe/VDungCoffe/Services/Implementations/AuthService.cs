using VDungCoffe.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using VDungCoffe.Common.Exceptions;
using VDungCoffe.DTO.User.Auth;
using VDungCoffe.Models;
using VDungCoffe.Security;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly IConfiguration _configuration;
    private readonly ICurrentUser _currentUser;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        RoleManager<IdentityRole<Guid>> roleManager,
        IConfiguration configuration,
        ICurrentUser currentUser,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _configuration = configuration;
        _currentUser = currentUser;
        _logger = logger;
    }

    public async Task<AuthTokenResponse> LoginAsync(LoginRequest request)
    {
        ServiceInput.Validate(request);
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || user.DisabledAt != null)
        {
            throw new BadRequestException("Email hoặc mật khẩu không chính xác.");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
        if (result.IsLockedOut)
        {
            throw new BadRequestException("Tài khoản đã bị tạm khóa do nhập sai mật khẩu nhiều lần. Vui lòng thử lại sau.");
        }

        if (!result.Succeeded)
        {
            throw new BadRequestException("Email hoặc mật khẩu không chính xác.");
        }

        // Get user roles
        var roles = await _userManager.GetRolesAsync(user);

        // Calculate permissions from user claims and role claims
        var userClaims = await _userManager.GetClaimsAsync(user);
        var permissions = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var claim in userClaims.Where(c => c.Type == "Permission" || c.Type == "permission"))
        {
            permissions.Add(claim.Value);
        }

        foreach (var roleName in roles)
        {
            if (roleName == Permissions.RoleDefaults.SuperAdmin)
            {
                foreach (var p in Permissions.AllPermissions.Concat(BannerPermissions.AllPermissions)) permissions.Add(p);
                break;
            }

            var role = await _roleManager.FindByNameAsync(roleName);
            if (role != null)
            {
                var roleClaims = await _roleManager.GetClaimsAsync(role);
                foreach (var rc in roleClaims.Where(c => c.Type == "Permission" || c.Type == "permission"))
                {
                    permissions.Add(rc.Value);
                }
            }
        }

        // Generate JWT token
        var (token, expiresAt) = GenerateJwtToken(user, roles, permissions);

        // Also sign in with cookie claims for Next.js compatibility
        var authClaims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new(ClaimTypes.Name, user.DisplayName)
        };
        foreach (var r in roles) authClaims.Add(new Claim(ClaimTypes.Role, r));
        foreach (var p in permissions) authClaims.Add(new Claim("Permission", p));

        await _signInManager.SignInWithClaimsAsync(user, isPersistent: true, authClaims);

        var isAdmin = roles.Any(LivePrincipal.IsAdminRole);

        return new AuthTokenResponse
        {
            Token = token,
            ExpiresAt = expiresAt,
            IsAdmin = isAdmin,
            Permissions = permissions.ToList(),
            User = new UserProfileDto
            {
                Id = user.Id.ToString(),
                Name = user.DisplayName,
                Email = user.Email ?? string.Empty,
                Role = user.CustomerPersona ?? "guest",
                Phone = user.PhoneNumber,
                Avatar = user.AvatarUrl,
                ShopName = user.ShopName
            }
        };
    }

    public async Task<AuthUserResponse> RegisterAsync(RegisterRequest request)
    {
        ServiceInput.Validate(request);
        var existing = await _userManager.FindByEmailAsync(request.Email);
        if (existing != null)
        {
            throw new ValidationException("Email đã được đăng ký trong hệ thống.");
        }

        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            UserName = request.Email.Trim(),
            Email = request.Email.Trim(),
            DisplayName = request.Name.Trim(),
            ShopName = request.ShopName?.Trim(),
            PhoneNumber = request.Phone?.Trim(),
            CustomerPersona = "guest", // Default customer persona; client CANNOT select privileges
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToList();
            throw new ValidationException(errors);
        }

        return new AuthUserResponse
        {
            Id = user.Id.ToString(),
            Email = user.Email,
            Name = user.DisplayName
        };
    }

    public async Task<AuthMeResponse> GetCurrentProfileAsync()
    {
        if (!_currentUser.UserId.HasValue)
        {
            throw new UnauthorizedException();
        }

        var user = await _userManager.FindByIdAsync(_currentUser.UserId.Value.ToString());
        if (user == null)
        {
            throw new NotFoundException("Người dùng không tồn tại.");
        }

        var roles = await _userManager.GetRolesAsync(user);
        var isAdmin = roles.Any(LivePrincipal.IsAdminRole);

        var permissions = (await _userManager.GetClaimsAsync(user)).Where(c => c.Type is "Permission" or "permission").Select(c => c.Value).ToList();
        if (isAdmin)
        {
            if (roles.Contains(Permissions.RoleDefaults.SuperAdmin))
            {
                permissions.AddRange(Permissions.AllPermissions.Concat(BannerPermissions.AllPermissions));
            }
            else
            {
                foreach (var roleName in roles)
                {
                    var role = await _roleManager.FindByNameAsync(roleName);
                    if (role != null)
                    {
                        var roleClaims = await _roleManager.GetClaimsAsync(role);
                        permissions.AddRange(roleClaims.Where(c => c.Type == "Permission" || c.Type == "permission").Select(c => c.Value));
                    }
                }
            }
        }

        return new AuthMeResponse
        {
            IsAdmin = isAdmin,
            Permissions = permissions.Distinct().ToList(),
            User = new UserProfileDto
            {
                Id = user.Id.ToString(),
                Name = user.DisplayName,
                Email = user.Email ?? string.Empty,
                Role = user.CustomerPersona ?? "guest",
                Phone = user.PhoneNumber,
                Avatar = user.AvatarUrl,
                ShopName = user.ShopName
            }
        };
    }

    public async Task LogoutAsync()
    {
        await _signInManager.SignOutAsync();
    }

    private (string Token, DateTime ExpiresAt) GenerateJwtToken(AppUser user, IList<string> roles, IEnumerable<string> permissions)
    {
        var jwtKey = JwtSettings.RequireKey(_configuration);
        var jwtIssuer = _configuration["Jwt:Issuer"] ?? "AuraCoffeeServer";
        var jwtAudience = _configuration["Jwt:Audience"] ?? "AuraCoffeeClients";

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new(ClaimTypes.Name, user.DisplayName),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(_userManager.Options.ClaimsIdentity.SecurityStampClaimType, user.SecurityStamp ?? string.Empty)
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        foreach (var p in permissions)
        {
            claims.Add(new Claim("Permission", p));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddHours(1);

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds
        );

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }
}

public class UnauthorizedException : AppException
{
    public UnauthorizedException(string message = "Chưa đăng nhập hoặc phiên làm việc đã hết hạn.")
        : base(message, 401)
    {
    }
}





