namespace VDungCoffe.Services.Interfaces;

public interface IHtmlSanitizerService
{
    string Sanitize(string? rawHtml);
}
