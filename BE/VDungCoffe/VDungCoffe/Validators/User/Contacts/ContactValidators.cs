using FluentValidation;
using VDungCoffe.DTO.User.Contacts;

namespace VDungCoffe.Validators.User.Contacts;

public class ContactSubmitValidator : AbstractValidator<ContactSubmitRequest>
{
    public ContactSubmitValidator()
    {
        RuleFor(x => x.ServiceType).Must(x => x is "full-setup" or "equipment" or "coffee-beans" or "bar-training");
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Họ và tên không được để trống.")
            .MaximumLength(150).WithMessage("Họ và tên tối đa 150 ký tự.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email không được để trống.")
            .EmailAddress().WithMessage("Email không đúng định dạng.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Số điện thoại không được để trống.")
            .Matches(@"^(0|\+84)[0-9]{9,10}$").WithMessage("Số điện thoại không đúng định dạng.");

        RuleFor(x => x.ServiceType)
            .NotEmpty().WithMessage("Vui lòng chọn loại dịch vụ.");

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Nội dung lời nhắn không được để trống.")
            .MaximumLength(2000).WithMessage("Nội dung lời nhắn tối đa 2000 ký tự.");
    }
}
