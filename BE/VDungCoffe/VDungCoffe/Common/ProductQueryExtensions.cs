using VDungCoffe.Models;
namespace VDungCoffe.Common;

public static class ProductQueryExtensions
{
    public static IOrderedQueryable<Product> OrderByStableId(this IQueryable<Product> query) =>
        ((IOrderedQueryable<Product>)query).ThenBy(p => p.Id);
}
