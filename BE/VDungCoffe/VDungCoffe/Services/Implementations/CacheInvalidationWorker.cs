using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using VDungCoffe.Models;

namespace VDungCoffe.Services.Implementations;

// At-least-once delivery: the frontend webhook must be idempotent.
public sealed class CacheInvalidationWorker(IServiceScopeFactory scopes, IHttpClientFactory clients,
    IConfiguration configuration, ILogger<CacheInvalidationWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var url = configuration["NextJs:RevalidateUrl"];
                var secret = configuration["NextJs:RevalidateSecret"];
                if (!string.IsNullOrWhiteSpace(url) && !string.IsNullOrWhiteSpace(secret))
                {
                    using var scope = scopes.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<AuraCoffeeContext>();
                    var now = DateTime.UtcNow;
                    var pending = await db.Set<CacheInvalidation>().Where(x => x.CompletedAt == null && x.NextAttemptAt <= now)
                        .OrderBy(x => x.CreatedAt).Take(20).ToListAsync(stoppingToken);
                    foreach (var entry in pending)
                    {
                        try
                        {
                            var client = clients.CreateClient();
                            client.Timeout = TimeSpan.FromSeconds(5);
                            using var request = new HttpRequestMessage(HttpMethod.Post, url);
                            request.Headers.Add("X-Revalidation-Secret", secret);
                            request.Content = JsonContent.Create(new { tags = new[] { "catalog", "products", "categories", "brands", "articles", "banners" }, eventId = entry.Id });
                            using var response = await client.SendAsync(request, stoppingToken);
                            response.EnsureSuccessStatusCode();
                            entry.CompletedAt = DateTime.UtcNow;
                        }
                        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException)
                        {
                            logger.LogWarning("Cache revalidation event {EventId} failed ({ExceptionType}); retry queued.", entry.Id, ex.GetType().Name);
                        }
                        entry.Attempts++;
                        entry.NextAttemptAt = DateTime.UtcNow.AddSeconds(Math.Min(300, 5 * Math.Pow(2, Math.Min(entry.Attempts, 6))));
                        await db.SaveChangesAsync(stoppingToken);
                    }
                }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) { break; }
            catch (Exception ex) { logger.LogError(ex, "Cannot process cache invalidation outbox."); }
            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }
    }
}
