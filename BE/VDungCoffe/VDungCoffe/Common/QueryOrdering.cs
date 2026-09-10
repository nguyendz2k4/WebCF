using System.Linq.Expressions;
using VDungCoffe.DTO.Common;

namespace VDungCoffe.Common;

public static class QueryOrdering
{
    public static IOrderedQueryable<T> Sort<T>(this IQueryable<T> source, PaginationQuery query, string fallback, params string[] allowed)
    {
        var name = allowed.FirstOrDefault(n => string.Equals(n, query.SortBy ?? fallback, StringComparison.OrdinalIgnoreCase))
            ?? throw new Exceptions.ValidationException("SortBy hỗ trợ: " + string.Join(", ", allowed));
        var parameter = Expression.Parameter(typeof(T), "x");
        var property = Expression.Property(parameter, name);
        var call = Expression.Call(typeof(Queryable), query.IsAscending ? "OrderBy" : "OrderByDescending", new[] { typeof(T), property.Type },
            source.Expression, Expression.Quote(Expression.Lambda(property, parameter)));
        var sorted = (IOrderedQueryable<T>)source.Provider.CreateQuery<T>(call);
        var id = Expression.Property(parameter, "Id");
        return (IOrderedQueryable<T>)source.Provider.CreateQuery<T>(Expression.Call(typeof(Queryable), "ThenBy", new[] { typeof(T), id.Type },
            sorted.Expression, Expression.Quote(Expression.Lambda(id, parameter))));
    }
}
