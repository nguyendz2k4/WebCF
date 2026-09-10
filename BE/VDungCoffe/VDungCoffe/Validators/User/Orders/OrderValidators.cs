using FluentValidation;
using VDungCoffe.DTO.User.Orders;

namespace VDungCoffe.Validators.User.Orders;

public class CheckoutQuoteValidator : AbstractValidator<CheckoutQuoteRequest>
{
    public CheckoutQuoteValidator()
    {
        RuleFor(x => x.Items).Must(items => items != null && items.Count <= 100 && items.All(i => i != null) && items.Select(i => i.ProductId).Distinct().Count() == items.Count)
            .WithMessage("Giỏ hàng tối đa 100 dòng, không trùng sản phẩm.");
        RuleFor(x => x.RecipientName)
            .NotEmpty().WithMessage("Tên người nhận không được để trống.")
            .MaximumLength(150).WithMessage("Tên người nhận tối đa 150 ký tự.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Số điện thoại không được để trống.")
            .Matches(@"^(0|\+84)[0-9]{9,10}$").WithMessage("Số điện thoại không đúng định dạng.");

        RuleFor(x => x.Province)
            .NotEmpty().WithMessage("Tỉnh/Thành phố không được để trống.");

        RuleFor(x => x.District)
            .NotEmpty().WithMessage("Quận/Huyện/Phường không được để trống.");

        RuleFor(x => x.AddressLine)
            .NotEmpty().WithMessage("Địa chỉ chi tiết không được để trống.");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Danh sách sản phẩm không được rỗng.");

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.ProductId).NotEmpty().WithMessage("Mã sản phẩm không hợp lệ.");
            item.RuleFor(i => i.Quantity).InclusiveBetween(1, 999).WithMessage("Số lượng phải từ 1 đến 999.");
        });
    }
}

public class CreateOrderValidator : AbstractValidator<CreateOrderRequest>
{
    public CreateOrderValidator()
    {
        RuleFor(x => x.PreferredPaymentMethod).Must(x => x is "cod" or "vietqr");
        RuleFor(x => x.QuoteId)
            .NotEmpty().WithMessage("Mã báo giá (QuoteId) không được để trống.");

        RuleFor(x => x.PreferredPaymentMethod)
            .NotEmpty().WithMessage("Phương thức thanh toán không được để trống.");
    }
}
