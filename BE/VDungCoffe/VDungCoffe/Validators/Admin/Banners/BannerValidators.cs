using FluentValidation;
using VDungCoffe.DTO.Admin.Banners;
namespace VDungCoffe.Validators.Admin.Banners;
public class CreateBannerValidator : AbstractValidator<CreateBannerRequest>
{
    public CreateBannerValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.ImageUrl).NotEmpty().MaximumLength(2048).Must(SafeUrl);
        RuleFor(x => x.LinkUrl).MaximumLength(2048).Must(x => string.IsNullOrEmpty(x) || SafeUrl(x));
        RuleFor(x => x.AltText).NotEmpty().MaximumLength(300);
        RuleFor(x => x.DisplayOrder).InclusiveBetween(0, 100000);
    }
    private static bool SafeUrl(string? value) => !string.IsNullOrWhiteSpace(value) && !value.Any(char.IsControl) && !value.Contains('\\') &&
        ((value.StartsWith('/') && !value.StartsWith("//")) ||
         (Uri.TryCreate(value, UriKind.Absolute, out var uri) && (uri.Scheme == "https" || uri.Scheme == "http")));
    internal static bool ValidVersion(string value) { try { return Convert.FromBase64String(value).Length == 8; } catch { return false; } }
}
public class UpdateBannerValidator : AbstractValidator<UpdateBannerRequest>
{
    public UpdateBannerValidator()
    {
        Include(new CreateBannerValidator());
        RuleFor(x => x.Version).NotEmpty().Must(CreateBannerValidator.ValidVersion);
    }
}
public class BannerPublishValidator : AbstractValidator<BannerPublishRequest>
{
    public BannerPublishValidator() => RuleFor(x => x.Version).NotEmpty().Must(CreateBannerValidator.ValidVersion);
}
public class BannerQueryValidator : AbstractValidator<BannerQuery>
{
    public BannerQueryValidator()
    {
        RuleFor(x => x.Page).InclusiveBetween(1, 1000000);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
        RuleFor(x => x.Keyword).MaximumLength(200);
        RuleFor(x => x.SortDir).Must(x => x is "asc" or "desc");
        RuleFor(x => x.SortBy).Must(x => x == null || new[] { "name", "title", "displayOrder", "createdAt" }.Contains(x));
    }
}
public class AdminBannerQueryValidator : AbstractValidator<AdminBannerQuery>
{
    public AdminBannerQueryValidator() => Include(new BannerQueryValidator());
}
