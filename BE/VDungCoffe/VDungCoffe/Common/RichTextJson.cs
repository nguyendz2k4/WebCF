using System.Text.Json;
using System.Text.Json.Nodes;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Common;

public static class RichTextJson
{
    public static string Sanitize(string input, IHtmlSanitizerService sanitizer)
    {
        try
        {
            var root = JsonNode.Parse(input, documentOptions: new JsonDocumentOptions { MaxDepth = 16 });
            if (root is not JsonArray) throw new JsonException();
            Visit(root, sanitizer);
            return root.ToJsonString();
        }
        catch (JsonException) { throw new Exceptions.ValidationException("SectionsJson phải là mảng JSON hợp lệ."); }
    }

    private static void Visit(JsonNode node, IHtmlSanitizerService sanitizer)
    {
        if (node is JsonObject obj)
        {
            foreach (var key in obj.Select(p => p.Key).ToArray())
                if (obj[key] is JsonValue value && value.TryGetValue<string>(out var text)) obj[key] = sanitizer.Sanitize(text);
                else if (obj[key] is { } child) Visit(child, sanitizer);
        }
        else if (node is JsonArray array)
        {
            for (var i = 0; i < array.Count; i++)
                if (array[i] is JsonValue value && value.TryGetValue<string>(out var text)) array[i] = sanitizer.Sanitize(text);
                else if (array[i] is { } child) Visit(child, sanitizer);
        }
    }
}
