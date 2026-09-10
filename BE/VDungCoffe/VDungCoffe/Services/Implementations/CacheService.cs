using Microsoft.Extensions.Caching.Memory;
using VDungCoffe.Common.Filters;
using VDungCoffe.Services.Interfaces;
namespace VDungCoffe.Services.Implementations;
public class CacheService(IMemoryCache memoryCache, IHttpContextAccessor accessor) : ICacheService
{
    // Read catalog from SQL until a shared revision-aware cache is deployed.
    public Task<T?> GetAsync<T>(string key)
    {
        if (key.StartsWith("catalog:", StringComparison.Ordinal)) return Task.FromResult(default(T));
        memoryCache.TryGetValue(key, out T? value);
        return Task.FromResult(value);
    }
    public Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        if (!key.StartsWith("catalog:", StringComparison.Ordinal))
            memoryCache.Set(key, value, expiration ?? TimeSpan.FromMinutes(10));
        return Task.CompletedTask;
    }
    public Task RemoveAsync(string key) { memoryCache.Remove(key); return Task.CompletedTask; }
    public Task InvalidateCatalogCacheAsync()
    {
        var state = accessor.HttpContext?.RequestServices.GetService<MutationState>();
        if (state?.InTransaction == true) state.InvalidateCatalog = true;
        return Task.CompletedTask;
    }
}
