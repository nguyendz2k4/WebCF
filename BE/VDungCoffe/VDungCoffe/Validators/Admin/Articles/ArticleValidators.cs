using FluentValidation;
using VDungCoffe.DTO.Admin.Articles;

namespace VDungCoffe.Validators.Admin.Articles;

public class CreateArticleValidator : AbstractValidator<CreateArticleRequest>
{
    public CreateArticleValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Tiêu đề bài viết không được để trống.")
            .MaximumLength(250).WithMessage("Tiêu đề bài viết tối đa 250 ký tự.");

        RuleFor(x => x.Excerpt)
            .NotEmpty().WithMessage("Tóm tắt bài viết không được để trống.")
            .MaximumLength(1000).WithMessage("Tóm tắt bài viết tối đa 1000 ký tự.");

        RuleFor(x => x.CoverImageUrl)
            .NotEmpty().WithMessage("Ảnh bìa không được để trống.")
            .MaximumLength(1000).WithMessage("URL ảnh bìa tối đa 1000 ký tự.");
    }
}

public class UpdateArticleValidator : AbstractValidator<UpdateArticleRequest>
{
    public UpdateArticleValidator()
    {
        RuleFor(x => x.Version)
            .NotEmpty().WithMessage("Thiếu trường Version để kiểm soát sửa đồng thời.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Tiêu đề bài viết không được để trống.")
            .MaximumLength(250).WithMessage("Tiêu đề bài viết tối đa 250 ký tự.");

        RuleFor(x => x.Excerpt)
            .NotEmpty().WithMessage("Tóm tắt bài viết không được để trống.")
            .MaximumLength(1000).WithMessage("Tóm tắt bài viết tối đa 1000 ký tự.");
    }
}
