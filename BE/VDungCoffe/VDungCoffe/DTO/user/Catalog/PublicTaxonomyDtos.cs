using System.ComponentModel.DataAnnotations;
using VDungCoffe.DTO.Common;
namespace VDungCoffe.DTO.User.Catalog;
public class PublicCategoryQuery : PaginationQuery
{
    [MaxLength(50)] public string? Domain { get; set; }
}
public class PublicCategoryResponse
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
public class PublicBrandResponse
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
