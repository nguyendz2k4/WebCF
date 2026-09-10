using Ganss.Xss;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Services.Implementations;

public class HtmlSanitizerService : IHtmlSanitizerService
{
    private readonly HtmlSanitizer _sanitizer;

    public HtmlSanitizerService()
    {
        _sanitizer = new HtmlSanitizer();

        // Allowed safe tags for rich text
        _sanitizer.AllowedTags.Clear();
        foreach (var tag in new[] { "p", "br", "b", "strong", "i", "em", "u", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "span", "a" })
        {
            _sanitizer.AllowedTags.Add(tag);
        }

        // Allowed safe attributes
        _sanitizer.AllowedAttributes.Clear();
        foreach (var attr in new[] { "href", "title", "class", "target" })
        {
            _sanitizer.AllowedAttributes.Add(attr);
        }

        // Allowed URI schemes
        _sanitizer.AllowedSchemes.Clear();
        _sanitizer.AllowedSchemes.Add("http");
        _sanitizer.AllowedSchemes.Add("https");
        _sanitizer.AllowedSchemes.Add("mailto");
    }

    public string Sanitize(string? rawHtml)
    {
        if (string.IsNullOrWhiteSpace(rawHtml))
        {
            return string.Empty;
        }

        return _sanitizer.Sanitize(rawHtml);
    }
}
