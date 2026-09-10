namespace Aura.Api.Models;

public sealed class ProductUseCase : BaseEntity
{
    public Guid ProductId { get; set; }
    public Guid UseCaseId { get; set; }
    public Product Product { get; set; } = null!;
    public UseCase UseCase { get; set; } = null!;
}
