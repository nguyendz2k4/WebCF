using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace VDungCoffe.Models;

public partial class AuraCoffeeContext : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
{
    public AuraCoffeeContext(DbContextOptions<AuraCoffeeContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AppUser> AppUsers { get; set; }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<ContactInquiry> ContactInquiries { get; set; }

    public virtual DbSet<CurrentOrderStatus> CurrentOrderStatuses { get; set; }

    public virtual DbSet<NewsArticle> NewsArticles { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderEvent> OrderEvents { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<OrderPaymentBalance> OrderPaymentBalances { get; set; }

    public virtual DbSet<PaymentAttempt> PaymentAttempts { get; set; }

    public virtual DbSet<PaymentAttemptEvent> PaymentAttemptEvents { get; set; }

    public virtual DbSet<PaymentEntry> PaymentEntries { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductMedium> ProductMedia { get; set; }

    public virtual DbSet<ProductUseCase> ProductUseCases { get; set; }

    public virtual DbSet<UseCase> UseCases { get; set; }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<CheckoutQuoteUse>(entity =>
        {
            entity.ToTable("CheckoutQuoteUse");
            entity.HasKey(e => e.QuoteId);
            entity.Property(e => e.QuoteId).HasMaxLength(32).IsUnicode(false);
            entity.HasOne<Order>().WithMany().HasForeignKey(e => e.OrderId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<CacheInvalidation>(entity =>
        {
            entity.ToTable("CacheInvalidation");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.CompletedAt, e.NextAttemptAt });
        });
        modelBuilder.ApplyConfiguration(new BannerConfiguration());

        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.ToTable("AppUser");

            entity.HasIndex(e => new { e.IdentityIssuer, e.IdentitySubject }, "IX_AppUser_IdentityIssuer_IdentitySubject")
                .IsUnique()
                .HasFilter("[IdentityIssuer] IS NOT NULL AND [IdentitySubject] IS NOT NULL");

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.AvatarUrl).HasMaxLength(1000);
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.CustomerPersona)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.DisabledAt).HasPrecision(3);
            entity.Property(e => e.DisplayName).HasMaxLength(150);
            entity.Property(e => e.Email).HasMaxLength(254).IsRequired();
            entity.Property(e => e.IdentityIssuer)
                .HasMaxLength(100)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.IdentitySubject)
                .HasMaxLength(200)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.PhoneNumber).HasColumnName("Phone").HasMaxLength(30);
            entity.Property(e => e.ShopName).HasMaxLength(150);
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.CustomerGroup).HasMaxLength(20).IsUnicode(false);
            entity.Property(e => e.Version)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<Brand>(entity =>
        {
            entity.ToTable("Brand");

            entity.HasIndex(e => e.Code, "IX_Brand_Code").IsUnique();

            entity.HasIndex(e => e.Name, "IX_Brand_Name").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.Code)
                .HasMaxLength(60)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(120);
            entity.Property(e => e.Version)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Category");

            entity.HasIndex(e => new { e.Id, e.Domain }, "AK_Category_Id_Domain").IsUnique();

            entity.HasIndex(e => e.Code, "IX_Category_Code").IsUnique();

            entity.HasIndex(e => new { e.Domain, e.DisplayOrder }, "IX_Category_Domain_DisplayOrder");

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.Code)
                .HasMaxLength(60)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Domain)
                .HasMaxLength(16)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(120);
            entity.Property(e => e.Version)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<ContactInquiry>(entity =>
        {
            entity.ToTable("ContactInquiry");

            entity.HasIndex(e => e.CustomerId, "IX_ContactInquiry_CustomerId");

            entity.HasIndex(e => new { e.Status, e.CreatedAt }, "IX_ContactInquiry_Status_CreatedAt");

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.BudgetRange)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.BusinessName).HasMaxLength(150);
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Email).HasMaxLength(254);
            entity.Property(e => e.FullName).HasMaxLength(150);
            entity.Property(e => e.LegacyPackageCode)
                .HasMaxLength(100)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.Message).HasMaxLength(4000);
            entity.Property(e => e.Phone).HasMaxLength(30);
            entity.Property(e => e.ServiceType)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.Source)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("new")
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.Version)
                .IsRowVersion()
                .IsConcurrencyToken();

            entity.HasOne(d => d.Customer).WithMany(p => p.ContactInquiries).HasForeignKey(d => d.CustomerId);
        });

        modelBuilder.Entity<CurrentOrderStatus>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("CurrentOrderStatus");

            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.StatusAt).HasPrecision(3);
        });

        modelBuilder.Entity<NewsArticle>(entity =>
        {
            entity.ToTable("NewsArticle");

            entity.HasIndex(e => new { e.CategoryCode, e.PublishedAt, e.Id }, "IX_NewsArticle_CategoryCode_PublishedAt_Id")
                .IsDescending(false, true, false)
                .HasFilter("([ArchivedAt] IS NULL AND [PublishedAt] IS NOT NULL)");

            entity.HasIndex(e => e.Slug, "IX_NewsArticle_Slug").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.ArchivedAt).HasPrecision(3);
            entity.Property(e => e.AuthorAvatarUrl).HasMaxLength(1000);
            entity.Property(e => e.AuthorName).HasMaxLength(150);
            entity.Property(e => e.AuthorRole).HasMaxLength(200);
            entity.Property(e => e.CategoryCode)
                .HasMaxLength(30)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.CoverImageUrl).HasMaxLength(1000);
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Excerpt).HasMaxLength(2000);
            entity.Property(e => e.PublishedAt).HasPrecision(3);
            entity.Property(e => e.Slug)
                .HasMaxLength(160)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.TagsJson).HasDefaultValue("[]");
            entity.Property(e => e.Title).HasMaxLength(250);
            entity.Property(e => e.Version)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("Order", tb => tb.HasTrigger("TR_Order_Guard"));

            entity.HasIndex(e => new { e.CustomerId, e.CreatedAt, e.Id }, "IX_Order_CustomerId_CreatedAt_Id").IsDescending(false, true, false);

            entity.HasIndex(e => new { e.CustomerId, e.IdempotencyKey }, "IX_Order_CustomerId_IdempotencyKey").IsUnique();

            entity.HasIndex(e => e.OrderCode, "IX_Order_OrderCode").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.AddressLine).HasMaxLength(400);
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Currency)
                .HasMaxLength(3)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.DeliveryNote).HasMaxLength(1000);
            entity.Property(e => e.DiscountTotal).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.District).HasMaxLength(120);
            entity.Property(e => e.Email).HasMaxLength(254);
            entity.Property(e => e.OrderCode)
                .HasMaxLength(32)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.Phone).HasMaxLength(30);
            entity.Property(e => e.PreferredPaymentMethod)
                .HasMaxLength(12)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.Province).HasMaxLength(120);
            entity.Property(e => e.RecipientName).HasMaxLength(150);
            entity.Property(e => e.RequestHash)
                .HasMaxLength(64)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.ShippingFee).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.SubmittedAt).HasPrecision(3);
            entity.Property(e => e.Subtotal).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.TaxIncludedAmount).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.Total).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.Version)
                .IsRowVersion()
                .IsConcurrencyToken();

            entity.HasOne(d => d.Customer).WithMany(p => p.Orders)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<OrderEvent>(entity =>
        {
            entity.ToTable("OrderEvent", tb => tb.HasTrigger("TR_OrderEvent_Guard"));

            entity.HasIndex(e => e.ActorId, "IX_OrderEvent_ActorId");

            entity.HasIndex(e => new { e.OrderId, e.Sequence }, "IX_OrderEvent_OrderId_Sequence").IsUnique();

            entity.HasIndex(e => new { e.Status, e.CreatedAt }, "IX_OrderEvent_Status_CreatedAt");

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Note).HasMaxLength(1000);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");

            entity.HasOne(d => d.Actor).WithMany(p => p.OrderEvents)
                .HasForeignKey(d => d.ActorId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Order).WithMany(p => p.OrderEvents)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.ToTable("OrderItem", tb => tb.HasTrigger("TR_OrderItem_Guard"));

            entity.HasIndex(e => new { e.OrderId, e.LineNumber }, "IX_OrderItem_OrderId_LineNumber").IsUnique();

            entity.HasIndex(e => e.ProductId, "IX_OrderItem_ProductId");

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.DiscountAmount).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.LineTotal)
                .HasComputedColumnSql("(CONVERT([decimal](18,0),[UnitPrice]*[Quantity]-[DiscountAmount]))", true)
                .HasColumnType("decimal(18, 0)");
            entity.Property(e => e.ProductName).HasMaxLength(250);
            entity.Property(e => e.Sku)
                .HasMaxLength(60)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.Specification).HasMaxLength(1000);
            entity.Property(e => e.TaxIncludedAmount).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.UnitLabel).HasMaxLength(100);
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 0)");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Product).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<OrderPaymentBalance>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("OrderPaymentBalance");

            entity.Property(e => e.Currency)
                .HasMaxLength(3)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.NetReceived).HasColumnType("decimal(38, 0)");
            entity.Property(e => e.OrderCode)
                .HasMaxLength(32)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.OutstandingAmount).HasColumnType("decimal(38, 0)");
            entity.Property(e => e.ReceivedAmount).HasColumnType("decimal(38, 0)");
            entity.Property(e => e.RefundedAmount).HasColumnType("decimal(38, 0)");
            entity.Property(e => e.Total).HasColumnType("decimal(18, 0)");
        });

        modelBuilder.Entity<PaymentAttempt>(entity =>
        {
            entity.ToTable("PaymentAttempt", tb => tb.HasTrigger("TR_PaymentAttempt_Guard"));

            entity.HasIndex(e => new { e.Id, e.OrderId }, "AK_PaymentAttempt_Id_OrderId").IsUnique();

            entity.HasIndex(e => new { e.OrderId, e.IdempotencyKey }, "IX_PaymentAttempt_OrderId_IdempotencyKey").IsUnique();

            entity.HasIndex(e => e.RequestedById, "IX_PaymentAttempt_RequestedById");

            entity.HasIndex(e => e.TransferReference, "IX_PaymentAttempt_TransferReference")
                .IsUnique()
                .HasFilter("([TransferReference] IS NOT NULL)");

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.DestinationSnapshot).HasMaxLength(1000);
            entity.Property(e => e.ExpiresAt).HasPrecision(3);
            entity.Property(e => e.Method)
                .HasMaxLength(12)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.RequestedAmount).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.TransferReference)
                .HasMaxLength(100)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");

            entity.HasOne(d => d.Order).WithMany(p => p.PaymentAttempts)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.RequestedBy).WithMany(p => p.PaymentAttempts)
                .HasForeignKey(d => d.RequestedById)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<PaymentAttemptEvent>(entity =>
        {
            entity.ToTable("PaymentAttemptEvent", tb => tb.HasTrigger("TR_PaymentAttemptEvent_Guard"));

            entity.HasIndex(e => e.ActorId, "IX_PaymentAttemptEvent_ActorId");

            entity.HasIndex(e => new { e.PaymentAttemptId, e.CreatedAt, e.Id }, "IX_PaymentAttemptEvent_PaymentAttemptId_CreatedAt_Id");

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.EventType)
                .HasMaxLength(24)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.Note).HasMaxLength(1000);

            entity.HasOne(d => d.Actor).WithMany(p => p.PaymentAttemptEvents)
                .HasForeignKey(d => d.ActorId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.PaymentAttempt).WithMany(p => p.PaymentAttemptEvents)
                .HasForeignKey(d => d.PaymentAttemptId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<PaymentEntry>(entity =>
        {
            entity.ToTable("PaymentEntry", tb => tb.HasTrigger("TR_PaymentEntry_Guard"));

            entity.HasIndex(e => new { e.ExternalSource, e.ExternalReference }, "IX_PaymentEntry_ExternalSource_ExternalReference").IsUnique();

            entity.HasIndex(e => e.IdempotencyKey, "IX_PaymentEntry_IdempotencyKey").IsUnique();

            entity.HasIndex(e => new { e.OrderId, e.CreatedAt, e.Id }, "IX_PaymentEntry_OrderId_CreatedAt_Id");

            entity.HasIndex(e => new { e.PaymentAttemptId, e.OrderId }, "IX_PaymentEntry_PaymentAttemptId_OrderId");

            entity.HasIndex(e => e.RecordedById, "IX_PaymentEntry_RecordedById");

            entity.HasIndex(e => e.ReversesEntryId, "IX_PaymentEntry_ReversesEntryId").HasFilter("([ReversesEntryId] IS NOT NULL)");

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.Amount).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.ExternalReference)
                .HasMaxLength(160)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.ExternalSource)
                .HasMaxLength(80)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.Kind)
                .HasMaxLength(12)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.OccurredAt).HasPrecision(3);
            entity.Property(e => e.Reason).HasMaxLength(1000);

            entity.HasOne(d => d.Order).WithMany(p => p.PaymentEntries)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.RecordedBy).WithMany(p => p.PaymentEntries)
                .HasForeignKey(d => d.RecordedById)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.ReversesEntry).WithMany(p => p.InverseReversesEntry).HasForeignKey(d => d.ReversesEntryId);

            entity.HasOne(d => d.PaymentAttempt).WithMany(p => p.PaymentEntries)
                .HasPrincipalKey(p => new { p.Id, p.OrderId })
                .HasForeignKey(d => new { d.PaymentAttemptId, d.OrderId })
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("Product");
            entity.HasQueryFilter(e => e.ArchivedAt == null);

            entity.HasIndex(e => new { e.BrandId, e.CategoryId }, "IX_Product_BrandId_CategoryId");

            entity.HasIndex(e => new { e.CategoryId, e.Domain }, "IX_Product_CategoryId_Domain");

            entity.HasIndex(e => new { e.CategoryId, e.Price, e.Id }, "IX_Product_CategoryId_Price_Id").HasFilter("([ArchivedAt] IS NULL AND [IsPublished]=(1))");

            entity.HasIndex(e => new { e.Domain, e.IsFeatured, e.CreatedAt, e.Id }, "IX_Product_Domain_IsFeatured_CreatedAt_Id")
                .IsDescending(false, true, true, false)
                .HasFilter("([ArchivedAt] IS NULL AND [IsPublished]=(1))");

            entity.HasIndex(e => e.LegacyId, "IX_Product_LegacyId")
                .IsUnique()
                .HasFilter("([LegacyId] IS NOT NULL)");

            entity.HasIndex(e => e.Sku, "IX_Product_Sku")
                .IsUnique()
                .HasFilter("([Sku] IS NOT NULL)");

            entity.HasIndex(e => e.Slug, "IX_Product_Slug").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.Altitude).HasMaxLength(100);
            entity.Property(e => e.ArchivedAt).HasPrecision(3);
            entity.Property(e => e.Boiler).HasMaxLength(200);
            entity.Property(e => e.BoilerCapacity).HasMaxLength(120);
            entity.Property(e => e.CaseSize).HasMaxLength(100);
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.CuppingScore).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.DailyCapacityLabel).HasMaxLength(150);
            entity.Property(e => e.Dimensions).HasMaxLength(120);
            entity.Property(e => e.Domain)
                .HasMaxLength(16)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.LeadTimeNotice).HasMaxLength(300);
            entity.Property(e => e.LegacyId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.Name).HasMaxLength(250);
            entity.Property(e => e.Origin).HasMaxLength(150);
            entity.Property(e => e.PowerLabel).HasMaxLength(100);
            entity.Property(e => e.Price).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.PriceMode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.Process).HasMaxLength(150);
            entity.Property(e => e.Pump).HasMaxLength(150);
            entity.Property(e => e.RoastProfile)
                .HasMaxLength(20)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.ShelfLife).HasMaxLength(150);
            entity.Property(e => e.ShortDescription).HasMaxLength(2000);
            entity.Property(e => e.Sku)
                .HasMaxLength(60)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.Slug)
                .HasMaxLength(160)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.SubRegion).HasMaxLength(150);
            entity.Property(e => e.UnitSize).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt).HasPrecision(3);
            entity.Property(e => e.Version)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.Voltage)
                .HasMaxLength(16)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.Warranty).HasMaxLength(200);
            entity.Property(e => e.WeightLabel).HasMaxLength(80);

            entity.HasOne(d => d.Brand).WithMany(p => p.Products)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .HasPrincipalKey(p => new { p.Id, p.Domain })
                .HasForeignKey(d => new { d.CategoryId, d.Domain })
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<ProductMedium>(entity =>
        {
            entity.HasIndex(e => new { e.ProductId, e.Position }, "IX_ProductMedia_ProductId_Position").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.AltText).HasMaxLength(300);
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Url).HasMaxLength(1000);

            entity.HasOne(d => d.Product).WithMany(p => p.ProductMedia)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<ProductUseCase>(entity =>
        {
            entity.ToTable("ProductUseCase");

            entity.HasIndex(e => new { e.ProductId, e.UseCaseId }, "IX_ProductUseCase_ProductId_UseCaseId").IsUnique();

            entity.HasIndex(e => new { e.UseCaseId, e.ProductId }, "IX_ProductUseCase_UseCaseId_ProductId");

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductUseCases)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.UseCase).WithMany(p => p.ProductUseCases)
                .HasForeignKey(d => d.UseCaseId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<UseCase>(entity =>
        {
            entity.ToTable("UseCase");

            entity.HasIndex(e => e.Code, "IX_UseCase_Code").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.Code)
                .HasMaxLength(40)
                .IsUnicode(false)
                .UseCollation("Latin1_General_100_BIN2");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(120);
            entity.Property(e => e.Version)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("AuditLog");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.Action).HasMaxLength(50).IsRequired();
            entity.Property(e => e.EntityType).HasMaxLength(50).IsRequired();
            entity.Property(e => e.EntityId).HasMaxLength(100).IsRequired();
            entity.Property(e => e.UserEmail).HasMaxLength(256);
            entity.Property(e => e.IpAddress).HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())");
        });

        modelBuilder.HasSequence("OrderNumber");

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

