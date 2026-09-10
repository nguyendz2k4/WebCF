using FluentValidation;
using VDungCoffe.DTO.Admin.Brands;

namespace VDungCoffe.Validators.Admin.Brands;

public class CreateBrandValidator : AbstractValidator<CreateBrandRequest>
{
    public CreateBrandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên thương hiệu không được để trống.")
            .MaximumLength(120).WithMessage("Tên thương hiệu tối đa 120 ký tự.");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Mã thương hiệu không được để trống.")
            .MaximumLength(60).WithMessage("Mã thương hiệu tối đa 60 ký tự.");
    }
}

public class UpdateBrandValidator : AbstractValidator<UpdateBrandRequest>
{
    public UpdateBrandValidator()
    {
        RuleFor(x => x.Version)
            .NotEmpty().WithMessage("Thiếu trường Version để kiểm soát sửa đồng thời.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên thương hiệu không được để trống.")
            .MaximumLength(120).WithMessage("Tên thương hiệu tối đa 120 ký tự.");
    }
}
