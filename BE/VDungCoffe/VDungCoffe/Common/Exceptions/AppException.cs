namespace VDungCoffe.Common.Exceptions;

public abstract class AppException : Exception
{
    public int StatusCode { get; }
    public List<string>? Errors { get; }

    protected AppException(string message, int statusCode = 400, List<string>? errors = null)
        : base(message)
    {
        StatusCode = statusCode;
        Errors = errors;
    }
}

public class NotFoundException : AppException
{
    public NotFoundException(string entityName, object key)
        : base($"Không tìm thấy {entityName} với mã '{key}'.", 404)
    {
    }

    public NotFoundException(string message)
        : base(message, 404)
    {
    }
}

public class ValidationException : AppException
{
    public ValidationException(List<string> errors)
        : base("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.", 400, errors)
    {
    }

    public ValidationException(string error)
        : base(error, 400, new List<string> { error })
    {
    }
}

public class ConcurrencyConflictException : AppException
{
    public ConcurrencyConflictException(string message = "Dữ liệu đã bị thay đổi bởi quản trị viên khác. Vui lòng tải lại trang và thử lại.")
        : base(message, 409)
    {
    }
}

public class ForbiddenException : AppException
{
    public ForbiddenException(string message = "Bạn không có quyền thực hiện hành động này.")
        : base(message, 403)
    {
    }
}

public class BadRequestException : AppException
{
    public BadRequestException(string message)
        : base(message, 400)
    {
    }
}
