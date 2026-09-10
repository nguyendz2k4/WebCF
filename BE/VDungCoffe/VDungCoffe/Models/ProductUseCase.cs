using System;
using System.Collections.Generic;

namespace VDungCoffe.Models;

public partial class ProductUseCase
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }

    public Guid UseCaseId { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual UseCase UseCase { get; set; } = null!;
}
