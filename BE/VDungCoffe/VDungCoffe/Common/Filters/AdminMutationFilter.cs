using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using VDungCoffe.Models;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Common.Filters;

public sealed class MutationState
{
    public bool InTransaction { get; set; }
    public bool InvalidateCatalog { get; set; }
}

// A successful admin write and its audit records commit together, before cache eviction.
public sealed class AdminMutationFilter(AuraCoffeeContext db, MutationState state, ICacheService cache) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.HttpContext.Request.Path.StartsWithSegments("/api/admin") ||
            HttpMethods.IsGet(context.HttpContext.Request.Method) || HttpMethods.IsHead(context.HttpContext.Request.Method))
        {
            await next();
            return;
        }
        await using var transaction = await db.Database.BeginTransactionAsync(context.HttpContext.RequestAborted);
        state.InTransaction = true;
        try
        {
            var result = await next();
            var failed = result.Exception != null || (result.Result is ObjectResult obj && obj.StatusCode >= 400)
                || (result.Result is StatusCodeResult status && status.StatusCode >= 400);
            if (failed) { await transaction.RollbackAsync(); return; }
            if (state.InvalidateCatalog)
            {
                db.Set<CacheInvalidation>().Add(new CacheInvalidation { Id = Guid.NewGuid(), CreatedAt = DateTime.UtcNow, NextAttemptAt = DateTime.UtcNow });
                await db.SaveChangesAsync(context.HttpContext.RequestAborted);
            }
            await transaction.CommitAsync(context.HttpContext.RequestAborted);
            state.InTransaction = false;
            if (state.InvalidateCatalog) await cache.InvalidateCatalogCacheAsync();
        }
        finally { state.InTransaction = false; }
    }
}
