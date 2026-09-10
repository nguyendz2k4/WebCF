namespace VDungCoffe.Models;

public sealed class CacheInvalidation
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int Attempts { get; set; }
    public DateTime NextAttemptAt { get; set; }
}
