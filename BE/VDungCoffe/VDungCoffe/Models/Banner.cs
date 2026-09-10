using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace VDungCoffe.Models;

public class Banner
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public string AltText { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? ArchivedAt { get; set; }
    public byte[] Version { get; set; } = Array.Empty<byte>();
}

public class BannerConfiguration : IEntityTypeConfiguration<Banner>
{
    public void Configure(EntityTypeBuilder<Banner> b)
    {
        b.ToTable("Banners");
        b.HasKey(x => x.Id);
        b.Property(x => x.Title).HasMaxLength(200).IsRequired();
        b.Property(x => x.ImageUrl).HasMaxLength(2048).IsRequired();
        b.Property(x => x.LinkUrl).HasMaxLength(2048);
        b.Property(x => x.AltText).HasMaxLength(300).IsRequired();
        b.Property(x => x.Version).IsRowVersion();
        b.HasIndex(x => new { x.ArchivedAt, x.PublishedAt, x.DisplayOrder });
    }
}
