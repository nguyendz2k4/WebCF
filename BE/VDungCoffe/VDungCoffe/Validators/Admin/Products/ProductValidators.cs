using FluentValidation;
using VDungCoffe.DTO.Admin.Products;

namespace VDungCoffe.Validators.Admin.Products;

public class CreateProductValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên sản phẩm không được để trống.")
            .MaximumLength(250).WithMessage("Tên sản phẩm không được vượt quá 250 ký tự.");

        RuleFor(x => x.Domain)
            .NotEmpty().WithMessage("Nhóm sản phẩm không được để trống.")
            .Must(d => d == "equipment" || d == "ingredients")
            .WithMessage("Nhóm sản phẩm phải là 'equipment' hoặc 'ingredients'.");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Vui lòng chọn danh mục.");

        RuleFor(x => x.BrandId)
            .NotEmpty().WithMessage("Vui lòng chọn thương hiệu.");

        RuleFor(x => x.PriceMode)
            .NotEmpty().WithMessage("Kiểu giá không được để trống.")
            .Must(m => m == "fixed" || m == "from" || m == "contact")
            .WithMessage("Kiểu giá phải là 'fixed', 'from' hoặc 'contact'.");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).When(x => x.Price.HasValue)
            .WithMessage("Giá sản phẩm không thể âm.");

        RuleFor(x => x.ShortDescription)
            .MaximumLength(2000).WithMessage("Mô tả ngắn không được vượt quá 2000 ký tự.");

        RuleFor(x => x.Sku)
            .MaximumLength(60).WithMessage("Mã SKU không được vượt quá 60 ký tự.");
    }
}

public class UpdateProductGeneralValidator : AbstractValidator<UpdateProductGeneralRequest>
{
    public UpdateProductGeneralValidator()
    {
        RuleFor(x => x.Version)
            .NotEmpty().WithMessage("Thiếu trường Version (RowVersion) để kiểm soát sửa đồng thời.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên sản phẩm không được để trống.")
            .MaximumLength(250).WithMessage("Tên sản phẩm không được vượt quá 250 ký tự.");

        RuleFor(x => x.Domain)
            .NotEmpty().WithMessage("Nhóm sản phẩm không được để trống.")
            .Must(d => d == "equipment" || d == "ingredients")
            .WithMessage("Nhóm sản phẩm phải là 'equipment' hoặc 'ingredients'.");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Vui lòng chọn danh mục.");

        RuleFor(x => x.BrandId)
            .NotEmpty().WithMessage("Vui lòng chọn thương hiệu.");

        RuleFor(x => x.ShortDescription)
            .MaximumLength(2000).WithMessage("Mô tả ngắn không được vượt quá 2000 ký tự.");
    }
}

public class UpdateProductPriceValidator : AbstractValidator<UpdateProductPriceRequest>
{
    public UpdateProductPriceValidator()
    {
        RuleFor(x => x.Version)
            .NotEmpty().WithMessage("Thiếu trường Version để kiểm soát sửa đồng thời.");

        RuleFor(x => x.PriceMode)
            .NotEmpty().WithMessage("Kiểu giá không được để trống.")
            .Must(m => m == "fixed" || m == "from" || m == "contact")
            .WithMessage("Kiểu giá phải là 'fixed', 'from' hoặc 'contact'.");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).When(x => x.Price.HasValue)
            .WithMessage("Giá sản phẩm không được nhỏ hơn 0.");

        RuleFor(x => x.Price)
            .NotNull().When(x => x.PriceMode == "fixed")
            .WithMessage("Giá sản phẩm là bắt buộc khi kiểu giá là cố định ('fixed').");
    }
}
