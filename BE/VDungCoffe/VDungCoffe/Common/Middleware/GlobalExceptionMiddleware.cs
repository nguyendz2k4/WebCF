using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using VDungCoffe.Common.Exceptions;

namespace VDungCoffe.Common.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        var response = new ApiResponse<object>
        {
            Success = false,
            Timestamp = DateTime.UtcNow
        };

        switch (exception)
        {
            case DbUpdateException dbEx when (dbEx.InnerException is Microsoft.Data.SqlClient.SqlException sql && sql.Number is 2601 or 2627):
                context.Response.StatusCode = 409;
                response.Message = "Dữ liệu hoặc mã yêu cầu đã tồn tại. Tải lại trước khi thử lại.";
                response.Errors = new List<string> { "Duplicate resource or request." };
                _logger.LogWarning(dbEx, "Unique constraint conflict");
                break;
            case AppException appEx:
                context.Response.StatusCode = appEx.StatusCode;
                response.Message = appEx.Message;
                response.Errors = appEx.Errors ?? new List<string> { appEx.Message };
                _logger.LogWarning(exception, "Application exception: {Message}", appEx.Message);
                break;

            case DbUpdateConcurrencyException concurrencyEx:
                context.Response.StatusCode = (int)HttpStatusCode.Conflict;
                response.Message = "Dữ liệu đã bị thay đổi bởi người khác. Vui lòng tải lại trang để xem thông tin mới nhất.";
                response.Errors = new List<string> { "Optimistic concurrency conflict detected." };
                _logger.LogWarning(concurrencyEx, "Concurrency conflict detected");
                break;

            case FluentValidation.ValidationException fvEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response.Message = "Dữ liệu gửi lên không đúng định dạng hoặc thiếu trường bắt buộc.";
                response.Errors = fvEx.Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}").ToList();
                _logger.LogWarning(fvEx, "FluentValidation failed");
                break;

            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response.Message = "Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.";
                response.Errors = new List<string> { "Internal server error occurred." };
                _logger.LogError(exception, "Unhandled exception occurred: {Message}", exception.Message);
                break;
        }

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        });

        await context.Response.WriteAsync(json);
    }
}
