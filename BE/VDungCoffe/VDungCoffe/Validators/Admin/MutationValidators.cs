using FluentValidation;
using VDungCoffe.Common;
using VDungCoffe.DTO.Admin.Orders;
using VDungCoffe.DTO.Admin.Contacts;
using VDungCoffe.DTO.Admin.Products;
using VDungCoffe.DTO.Admin.Articles;
using VDungCoffe.DTO.Admin.Common;

namespace VDungCoffe.Validators.Admin;

public class UpdateOrderStatusValidator : AbstractValidator<UpdateOrderStatusRequest>
{
    public UpdateOrderStatusValidator()
    {
        RuleFor(x => x.ExpectedSequence).GreaterThan(0);
        RuleFor(x => x.Version).Must(VersionRules.Valid);
        RuleFor(x => x.Status).Must(x => new[] { "submitted", "confirmed", "processing", "dispatched", "completed", "cancelled" }.Contains(x));
        RuleFor(x => x.Note).MaximumLength(1000);
    }
}
public class UpdateContactStatusValidator : AbstractValidator<UpdateContactStatusRequest>
{
    public UpdateContactStatusValidator()
    {
        RuleFor(x => x.Version).Must(VersionRules.Valid);
        RuleFor(x => x.Status).Must(x => new[] { "new", "contacted", "closed" }.Contains(x));
    }
}
public class PublishProductValidator : AbstractValidator<PublishProductRequest>
{
    public PublishProductValidator() { RuleFor(x => x.Version).Must(VersionRules.Valid); }
}
public class PublishArticleValidator : AbstractValidator<PublishArticleRequest>
{
    public PublishArticleValidator() { RuleFor(x => x.Version).Must(VersionRules.Valid); }
}
public class DeleteResourceValidator : AbstractValidator<DeleteResourceRequest>
{
    public DeleteResourceValidator() { RuleFor(x => x.Version).Must(VersionRules.Valid); }
}
public static class VersionRules
{
    public static bool Valid(string? value)
    {
        try { ServiceInput.DecodeVersion(value); return true; }
        catch (VDungCoffe.Common.Exceptions.ValidationException) { return false; }
    }
}
