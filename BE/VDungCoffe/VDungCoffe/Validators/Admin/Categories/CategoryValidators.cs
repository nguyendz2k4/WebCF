using FluentValidation;
using VDungCoffe.DTO.Admin.Categories;

namespace VDungCoffe.Validators.Admin.Categories;

public class CreateCategoryValidator : AbstractValidator<CreateCategoryRequest>
{
    public CreateCategoryValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên danh mục không được để trống.")
            .MaximumLength(120).WithMessage("Tên danh mục tối đa 120 ký tự.");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Mã danh mục không được để trống.")
            .MaximumLength(60).WithMessage("Mã danh mục tối đa 60 ký tự.")
            .Matches("^[a-z0-9-]+$").WithMessage("Mã danh mục chỉ chứa chữ thường, số và dấu gạch nối.");

        RuleFor(x => x.Domain)
            .NotEmpty().WithMessage("Nhóm sản phẩm không được để trống.")
            .Must(d => d == "equipment" || d == "ingredients")
            .WithMessage("Nhóm sản phẩm phải là 'equipment' hoặc 'ingredients'.");
    }
}

public class UpdateCategoryValidator : AbstractValidator<UpdateCategoryRequest>
{
    public UpdateCategoryValidator()
    {
        RuleFor(x => x.Version)
            .NotEmpty().WithMessage("Thiếu trường Version để kiểm soát sửa đồng thời.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên danh mục không được để trống.")
            .MaximumLength(120).WithMessage("Tên danh mục tối đa 120 ký tự.");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Mã danh mục không được để trống.")
            .MaximumLength(60).WithMessage("Mã danh mục tối đa 60 ký tự.");
    }
}
