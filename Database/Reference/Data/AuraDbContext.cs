// SQL Server mappings retained from the reviewed database design.
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Aura.Api.Models;

namespace Aura.Api.Data;

public sealed class AuraDbContext(DbContextOptions<AuraDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<UseCase> UseCases => Set<UseCase>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductUseCase> ProductUseCases => Set<ProductUseCase>();
    public DbSet<ProductMedia> ProductMediaItems => Set<ProductMedia>();
    public DbSet<AppUser> AppUsers => Set<AppUser>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<OrderEvent> OrderEvents => Set<OrderEvent>();
    public DbSet<PaymentAttempt> PaymentAttempts => Set<PaymentAttempt>();
    public DbSet<PaymentAttemptEvent> PaymentAttemptEvents => Set<PaymentAttemptEvent>();
    public DbSet<PaymentEntry> PaymentEntries => Set<PaymentEntry>();
    public DbSet<NewsArticle> NewsArticles => Set<NewsArticle>();
    public DbSet<ContactInquiry> ContactInquiries => Set<ContactInquiry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("dbo");
        modelBuilder.UseCollation("Vietnamese_100_CI_AI");

        modelBuilder.Entity<Category>(b =>
        {
            Base(b);
            b.ToTable("Category", t =>
            {
                t.HasCheckConstraint("CK_Category_Domain", "[Domain] IN ('equipment','ingredients')");
                t.HasCheckConstraint("CK_Category_Code_NonBlank", "LEN(LTRIM(RTRIM([Code]))) > 0");
                t.HasCheckConstraint("CK_Category_Name_NonBlank", "LEN(LTRIM(RTRIM([Name]))) > 0");
            });
            b.Property(x => x.Code).HasColumnType("varchar(60)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Name).HasColumnType("nvarchar(120)").IsRequired();
            b.Property(x => x.Domain).HasColumnType("varchar(16)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.DisplayOrder).HasColumnType("int").IsRequired().HasDefaultValue(0);
            b.Property(x => x.IsActive).HasColumnType("bit").IsRequired().HasDefaultValue(true).HasSentinel(true);
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.HasAlternateKey(x => new { x.Id, x.Domain });
            b.HasIndex(x => x.Code).HasDatabaseName("IX_Category_Code").IsUnique();
            b.HasIndex(x => new { x.Domain, x.DisplayOrder }).HasDatabaseName("IX_Category_Domain_DisplayOrder");
        });

        modelBuilder.Entity<Brand>(b =>
        {
            Base(b);
            b.ToTable("Brand", t =>
            {
                t.HasCheckConstraint("CK_Brand_Code_NonBlank", "LEN(LTRIM(RTRIM([Code]))) > 0");
                t.HasCheckConstraint("CK_Brand_Name_NonBlank", "LEN(LTRIM(RTRIM([Name]))) > 0");
            });
            b.Property(x => x.Code).HasColumnType("varchar(60)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Name).HasColumnType("nvarchar(120)").IsRequired();
            b.Property(x => x.IsActive).HasColumnType("bit").IsRequired().HasDefaultValue(true).HasSentinel(true);
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.HasIndex(x => x.Code).HasDatabaseName("IX_Brand_Code").IsUnique();
            b.HasIndex(x => x.Name).HasDatabaseName("IX_Brand_Name").IsUnique();
        });

        modelBuilder.Entity<UseCase>(b =>
        {
            Base(b);
            b.ToTable("UseCase", t =>
            {
                t.HasCheckConstraint("CK_UseCase_Code_NonBlank", "LEN(LTRIM(RTRIM([Code]))) > 0");
                t.HasCheckConstraint("CK_UseCase_Name_NonBlank", "LEN(LTRIM(RTRIM([Name]))) > 0");
            });
            b.Property(x => x.Code).HasColumnType("varchar(40)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Name).HasColumnType("nvarchar(120)").IsRequired();
            b.Property(x => x.Description).HasColumnType("nvarchar(500)");
            b.Property(x => x.DisplayOrder).HasColumnType("int").IsRequired().HasDefaultValue(0);
            b.Property(x => x.IsActive).HasColumnType("bit").IsRequired().HasDefaultValue(true).HasSentinel(true);
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.HasIndex(x => x.Code).HasDatabaseName("IX_UseCase_Code").IsUnique();
        });

        modelBuilder.Entity<Product>(b =>
        {
            Base(b);
            b.ToTable("Product", t =>
            {
                t.HasCheckConstraint("CK_Product_Domain", "[Domain] IN ('equipment','ingredients')");
                t.HasCheckConstraint("CK_Product_PriceMode", "[PriceMode] IN ('fixed','from','contact')");
                t.HasCheckConstraint("CK_Product_PriceMode_Value", "([PriceMode] = 'contact' AND [Price] IS NULL) OR ([PriceMode] IN ('fixed','from') AND [Price] IS NOT NULL AND [Price] BETWEEN 0 AND 999999999999)");
                t.HasCheckConstraint("CK_Product_Slug_NonBlank", "LEN(LTRIM(RTRIM([Slug]))) > 0");
                t.HasCheckConstraint("CK_Product_Name_NonBlank", "LEN(LTRIM(RTRIM([Name]))) > 0");
                t.HasCheckConstraint("CK_Product_GroupsCount", "[GroupsCount] IS NULL OR [GroupsCount] > 0");
                t.HasCheckConstraint("CK_Product_Voltage", "[Voltage] IS NULL OR [Voltage] IN ('220V','380V','220V/380V')");
                t.HasCheckConstraint("CK_Product_CuppingScore", "[CuppingScore] IS NULL OR [CuppingScore] BETWEEN 0 AND 100");
                t.HasCheckConstraint("CK_Product_RoastProfile", "[RoastProfile] IS NULL OR [RoastProfile] IN ('Light','Medium','Medium-Dark','Dark')");
                t.HasCheckConstraint("CK_Product_FlavorNotesJson", "[FlavorNotesJson] IS NULL OR ISJSON([FlavorNotesJson], ARRAY) = 1");
                t.HasCheckConstraint("CK_Product_Subtype", "([Domain] = 'equipment' AND [Origin] IS NULL AND [SubRegion] IS NULL AND [Altitude] IS NULL AND [Process] IS NULL AND [RoastProfile] IS NULL AND [CuppingScore] IS NULL AND [FlavorNotesJson] IS NULL AND [UnitSize] IS NULL AND [CaseSize] IS NULL AND [ShelfLife] IS NULL) OR ([Domain] = 'ingredients' AND [GroupsCount] IS NULL AND [Boiler] IS NULL AND [BoilerCapacity] IS NULL AND [Pump] IS NULL AND [PowerLabel] IS NULL AND [Voltage] IS NULL AND [Dimensions] IS NULL AND [WeightLabel] IS NULL AND [Warranty] IS NULL AND [DailyCapacityLabel] IS NULL)");
                t.HasCheckConstraint("CK_Product_PublishedCompleteness", "[IsPublished] = 0 OR ([Domain] = 'equipment' AND [Warranty] IS NOT NULL AND LEN(LTRIM(RTRIM([Warranty]))) > 0) OR ([Domain] = 'ingredients' AND [UnitSize] IS NOT NULL AND LEN(LTRIM(RTRIM([UnitSize]))) > 0)");
            });
            b.Property(x => x.LegacyId).HasColumnType("varchar(100)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.Slug).HasColumnType("varchar(160)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Sku).HasColumnType("varchar(60)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.Name).HasColumnType("nvarchar(250)").IsRequired();
            b.Property(x => x.CategoryId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.Domain).HasColumnType("varchar(16)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.BrandId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.ShortDescription).HasColumnType("nvarchar(2000)").IsRequired();
            b.Property(x => x.PriceMode).HasColumnType("varchar(12)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Price).HasColumnType("decimal(18,0)");
            b.Property(x => x.IsAvailableForOrder).HasColumnType("bit").IsRequired();
            b.Property(x => x.IsPublished).HasColumnType("bit").IsRequired().HasDefaultValue(false);
            b.Property(x => x.IsFeatured).HasColumnType("bit").IsRequired().HasDefaultValue(false);
            b.Property(x => x.LeadTimeNotice).HasColumnType("nvarchar(300)");
            b.Property(x => x.ArchivedAt).HasColumnType("datetime2(3)");
            b.Property(x => x.UpdatedAt).HasColumnType("datetime2(3)");
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.Property(x => x.GroupsCount).HasColumnType("int");
            b.Property(x => x.Boiler).HasColumnType("nvarchar(200)");
            b.Property(x => x.BoilerCapacity).HasColumnType("nvarchar(120)");
            b.Property(x => x.Pump).HasColumnType("nvarchar(150)");
            b.Property(x => x.PowerLabel).HasColumnType("nvarchar(100)");
            b.Property(x => x.Voltage).HasColumnType("varchar(16)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.Dimensions).HasColumnType("nvarchar(120)");
            b.Property(x => x.WeightLabel).HasColumnType("nvarchar(80)");
            b.Property(x => x.Warranty).HasColumnType("nvarchar(200)");
            b.Property(x => x.DailyCapacityLabel).HasColumnType("nvarchar(150)");
            b.Property(x => x.Origin).HasColumnType("nvarchar(150)");
            b.Property(x => x.SubRegion).HasColumnType("nvarchar(150)");
            b.Property(x => x.Altitude).HasColumnType("nvarchar(100)");
            b.Property(x => x.Process).HasColumnType("nvarchar(150)");
            b.Property(x => x.RoastProfile).HasColumnType("varchar(20)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.CuppingScore).HasColumnType("decimal(5,2)");
            b.Property(x => x.FlavorNotesJson).HasColumnType("nvarchar(max)");
            b.Property(x => x.UnitSize).HasColumnType("nvarchar(100)");
            b.Property(x => x.CaseSize).HasColumnType("nvarchar(100)");
            b.Property(x => x.ShelfLife).HasColumnType("nvarchar(150)");
            b.HasIndex(x => x.Slug).HasDatabaseName("IX_Product_Slug").IsUnique();
            b.HasIndex(x => x.Sku).HasDatabaseName("IX_Product_Sku").IsUnique().HasFilter("[Sku] IS NOT NULL");
            b.HasIndex(x => x.LegacyId).HasDatabaseName("IX_Product_LegacyId").IsUnique().HasFilter("[LegacyId] IS NOT NULL");
            b.HasIndex(x => new { x.CategoryId, x.Price, x.Id }).HasDatabaseName("IX_Product_CategoryId_Price_Id").HasFilter("[ArchivedAt] IS NULL AND [IsPublished] = 1");
            b.HasIndex(x => new { x.BrandId, x.CategoryId }).HasDatabaseName("IX_Product_BrandId_CategoryId");
            b.HasIndex(x => new { x.Domain, x.IsFeatured, x.CreatedAt, x.Id }).HasDatabaseName("IX_Product_Domain_IsFeatured_CreatedAt_Id").HasFilter("[ArchivedAt] IS NULL AND [IsPublished] = 1").IsDescending(false, true, true, false);
            b.HasIndex(x => new { x.CategoryId, x.Domain }).HasDatabaseName("IX_Product_CategoryId_Domain");
            b.HasOne(x => x.Category).WithMany().HasForeignKey(x => new { x.CategoryId, x.Domain }).HasPrincipalKey(x => new { x.Id, x.Domain }).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.Brand).WithMany().HasForeignKey(x => x.BrandId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<ProductUseCase>(b =>
        {
            Base(b);
            b.ToTable("ProductUseCase", t =>
            {
            });
            b.Property(x => x.ProductId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.UseCaseId).HasColumnType("uniqueidentifier").IsRequired();
            b.HasIndex(x => new { x.ProductId, x.UseCaseId }).HasDatabaseName("IX_ProductUseCase_ProductId_UseCaseId").IsUnique();
            b.HasIndex(x => new { x.UseCaseId, x.ProductId }).HasDatabaseName("IX_ProductUseCase_UseCaseId_ProductId");
            b.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.UseCase).WithMany().HasForeignKey(x => x.UseCaseId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<ProductMedia>(b =>
        {
            Base(b);
            b.ToTable("ProductMedia", t =>
            {
                t.HasCheckConstraint("CK_ProductMedia_Position", "[Position] >= 0");
                t.HasCheckConstraint("CK_ProductMedia_Url_NonBlank", "LEN(LTRIM(RTRIM([Url]))) > 0");
            });
            b.Property(x => x.ProductId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.Url).HasColumnType("nvarchar(1000)").IsRequired();
            b.Property(x => x.AltText).HasColumnType("nvarchar(300)");
            b.Property(x => x.Position).HasColumnType("int").IsRequired();
            b.HasIndex(x => new { x.ProductId, x.Position }).HasDatabaseName("IX_ProductMedia_ProductId_Position").IsUnique();
            b.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<AppUser>(b =>
        {
            Base(b);
            b.ToTable("AppUser", t =>
            {
                t.HasCheckConstraint("CK_AppUser_IdentityIssuer_NonBlank", "LEN(LTRIM(RTRIM([IdentityIssuer]))) > 0");
                t.HasCheckConstraint("CK_AppUser_IdentitySubject_NonBlank", "LEN(LTRIM(RTRIM([IdentitySubject]))) > 0");
                t.HasCheckConstraint("CK_AppUser_DisplayName_NonBlank", "LEN(LTRIM(RTRIM([DisplayName]))) > 0");
                t.HasCheckConstraint("CK_AppUser_Email_NonBlank", "LEN(LTRIM(RTRIM([Email]))) > 0");
                t.HasCheckConstraint("CK_AppUser_CustomerPersona", "[CustomerPersona] IS NULL OR [CustomerPersona] IN ('owner','barista','guest')");
            });
            b.Property(x => x.IdentityIssuer).HasColumnType("varchar(100)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.IdentitySubject).HasColumnType("varchar(200)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.DisplayName).HasColumnType("nvarchar(150)").IsRequired();
            b.Property(x => x.Email).HasColumnType("nvarchar(254)").IsRequired();
            b.Property(x => x.Phone).HasColumnType("nvarchar(30)");
            b.Property(x => x.AvatarUrl).HasColumnType("nvarchar(1000)");
            b.Property(x => x.CustomerPersona).HasColumnType("varchar(20)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.ShopName).HasColumnType("nvarchar(150)");
            b.Property(x => x.DisabledAt).HasColumnType("datetime2(3)");
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.HasIndex(x => new { x.IdentityIssuer, x.IdentitySubject }).HasDatabaseName("IX_AppUser_IdentityIssuer_IdentitySubject").IsUnique();
        });

        modelBuilder.Entity<Order>(b =>
        {
            Base(b);
            b.ToTable("Order", t =>
            {
                t.UseSqlOutputClause(false); // SQL triggers are installed by 002_integrity.sql.
                t.HasCheckConstraint("CK_Order_OrderCode_NonBlank", "LEN(LTRIM(RTRIM([OrderCode]))) > 0");
                t.HasCheckConstraint("CK_Order_RecipientName_NonBlank", "LEN(LTRIM(RTRIM([RecipientName]))) > 0");
                t.HasCheckConstraint("CK_Order_Phone_NonBlank", "LEN(LTRIM(RTRIM([Phone]))) > 0");
                t.HasCheckConstraint("CK_Order_AddressLine_NonBlank", "LEN(LTRIM(RTRIM([AddressLine]))) > 0");
                t.HasCheckConstraint("CK_Order_Province_NonBlank", "LEN(LTRIM(RTRIM([Province]))) > 0");
                t.HasCheckConstraint("CK_Order_RequestHash", "LEN([RequestHash]) = 64");
                t.HasCheckConstraint("CK_Order_Currency", "[Currency] = 'VND'");
                t.HasCheckConstraint("CK_Order_PreferredPaymentMethod", "[PreferredPaymentMethod] IN ('vietqr','cod')");
                t.HasCheckConstraint("CK_Order_Amounts", "[Subtotal] >= 0 AND [DiscountTotal] BETWEEN 0 AND [Subtotal] AND [ShippingFee] >= 0 AND [Total] = [Subtotal] - [DiscountTotal] + [ShippingFee] AND ([TaxIncludedAmount] IS NULL OR [TaxIncludedAmount] BETWEEN 0 AND [Total])");
            });
            b.Property(x => x.OrderCode).HasColumnType("varchar(32)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.CustomerId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.IdempotencyKey).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.RequestHash).HasColumnType("varchar(64)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Currency).HasColumnType("varchar(3)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.PreferredPaymentMethod).HasColumnType("varchar(12)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.RecipientName).HasColumnType("nvarchar(150)").IsRequired();
            b.Property(x => x.Phone).HasColumnType("nvarchar(30)").IsRequired();
            b.Property(x => x.Email).HasColumnType("nvarchar(254)");
            b.Property(x => x.AddressLine).HasColumnType("nvarchar(400)").IsRequired();
            b.Property(x => x.Province).HasColumnType("nvarchar(120)").IsRequired();
            b.Property(x => x.District).HasColumnType("nvarchar(120)");
            b.Property(x => x.DeliveryNote).HasColumnType("nvarchar(1000)");
            b.Property(x => x.Subtotal).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.DiscountTotal).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.ShippingFee).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.Total).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.TaxIncludedAmount).HasColumnType("decimal(18,0)");
            b.Property(x => x.SubmittedAt).HasColumnType("datetime2(3)");
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.HasIndex(x => x.OrderCode).HasDatabaseName("IX_Order_OrderCode").IsUnique();
            b.HasIndex(x => new { x.CustomerId, x.IdempotencyKey }).HasDatabaseName("IX_Order_CustomerId_IdempotencyKey").IsUnique();
            b.HasIndex(x => new { x.CustomerId, x.CreatedAt, x.Id }).HasDatabaseName("IX_Order_CustomerId_CreatedAt_Id").IsDescending(false, true, false);
            b.HasOne(x => x.Customer).WithMany().HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<OrderItem>(b =>
        {
            Base(b);
            b.ToTable("OrderItem", t =>
            {
                t.UseSqlOutputClause(false); // SQL triggers are installed by 002_integrity.sql.
                t.HasCheckConstraint("CK_OrderItem_ProductName_NonBlank", "LEN(LTRIM(RTRIM([ProductName]))) > 0");
                t.HasCheckConstraint("CK_OrderItem_LineNumber", "[LineNumber] > 0");
                t.HasCheckConstraint("CK_OrderItem_Amounts", "[UnitPrice] BETWEEN 0 AND 999999999999 AND [Quantity] BETWEEN 1 AND 10000 AND [DiscountAmount] BETWEEN 0 AND [UnitPrice] * [Quantity] AND ([TaxIncludedAmount] IS NULL OR [TaxIncludedAmount] BETWEEN 0 AND [UnitPrice] * [Quantity] - [DiscountAmount])");
            });
            b.Property(x => x.OrderId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.ProductId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.LineNumber).HasColumnType("int").IsRequired();
            b.Property(x => x.ProductName).HasColumnType("nvarchar(250)").IsRequired();
            b.Property(x => x.Sku).HasColumnType("varchar(60)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.Specification).HasColumnType("nvarchar(1000)");
            b.Property(x => x.UnitLabel).HasColumnType("nvarchar(100)");
            b.Property(x => x.UnitPrice).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.Quantity).HasColumnType("int").IsRequired();
            b.Property(x => x.DiscountAmount).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.LineTotal).HasColumnType("decimal(18,0)").IsRequired().HasComputedColumnSql("CONVERT(decimal(18,0), [UnitPrice] * [Quantity] - [DiscountAmount])", stored: true);
            b.Property(x => x.TaxIncludedAmount).HasColumnType("decimal(18,0)");
            b.HasIndex(x => new { x.OrderId, x.LineNumber }).HasDatabaseName("IX_OrderItem_OrderId_LineNumber").IsUnique();
            b.HasIndex(x => x.ProductId).HasDatabaseName("IX_OrderItem_ProductId");
            b.HasOne(x => x.Order).WithMany().HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<OrderEvent>(b =>
        {
            Base(b);
            b.ToTable("OrderEvent", t =>
            {
                t.UseSqlOutputClause(false); // SQL triggers are installed by 002_integrity.sql.
                t.HasCheckConstraint("CK_OrderEvent_Sequence", "[Sequence] > 0");
                t.HasCheckConstraint("CK_OrderEvent_Status", "[Status] IN ('submitted','confirmed','processing','dispatched','completed','cancelled')");
            });
            b.Property(x => x.OrderId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.Sequence).HasColumnType("int").IsRequired();
            b.Property(x => x.Status).HasColumnType("varchar(20)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.ActorId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.Note).HasColumnType("nvarchar(1000)");
            b.HasIndex(x => new { x.OrderId, x.Sequence }).HasDatabaseName("IX_OrderEvent_OrderId_Sequence").IsUnique();
            b.HasIndex(x => new { x.Status, x.CreatedAt }).HasDatabaseName("IX_OrderEvent_Status_CreatedAt");
            b.HasIndex(x => x.ActorId).HasDatabaseName("IX_OrderEvent_ActorId");
            b.HasOne(x => x.Order).WithMany().HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.Actor).WithMany().HasForeignKey(x => x.ActorId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<PaymentAttempt>(b =>
        {
            Base(b);
            b.ToTable("PaymentAttempt", t =>
            {
                t.UseSqlOutputClause(false); // SQL triggers are installed by 002_integrity.sql.
                t.HasCheckConstraint("CK_PaymentAttempt_Method", "[Method] IN ('vietqr','cod')");
                t.HasCheckConstraint("CK_PaymentAttempt_RequestedAmount", "[RequestedAmount] > 0");
                t.HasCheckConstraint("CK_PaymentAttempt_Transfer", "([Method] = 'cod' AND [TransferReference] IS NULL AND [DestinationSnapshot] IS NULL) OR ([Method] = 'vietqr' AND [TransferReference] IS NOT NULL AND LEN(LTRIM(RTRIM([TransferReference]))) > 0 AND [DestinationSnapshot] IS NOT NULL AND LEN(LTRIM(RTRIM([DestinationSnapshot]))) > 0)");
                t.HasCheckConstraint("CK_PaymentAttempt_Expiry", "[ExpiresAt] IS NULL OR [ExpiresAt] > [CreatedAt]");
            });
            b.Property(x => x.OrderId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.RequestedById).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.IdempotencyKey).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.Method).HasColumnType("varchar(12)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.RequestedAmount).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.TransferReference).HasColumnType("varchar(100)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.DestinationSnapshot).HasColumnType("nvarchar(1000)");
            b.Property(x => x.ExpiresAt).HasColumnType("datetime2(3)");
            b.HasAlternateKey(x => new { x.Id, x.OrderId });
            b.HasIndex(x => new { x.OrderId, x.IdempotencyKey }).HasDatabaseName("IX_PaymentAttempt_OrderId_IdempotencyKey").IsUnique();
            b.HasIndex(x => x.TransferReference).HasDatabaseName("IX_PaymentAttempt_TransferReference").IsUnique().HasFilter("[TransferReference] IS NOT NULL");
            b.HasIndex(x => x.RequestedById).HasDatabaseName("IX_PaymentAttempt_RequestedById");
            b.HasOne(x => x.Order).WithMany().HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.RequestedBy).WithMany().HasForeignKey(x => x.RequestedById).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<PaymentAttemptEvent>(b =>
        {
            Base(b);
            b.ToTable("PaymentAttemptEvent", t =>
            {
                t.UseSqlOutputClause(false); // SQL triggers are installed by 002_integrity.sql.
                t.HasCheckConstraint("CK_PaymentAttemptEvent_EventType", "[EventType] IN ('customer_reported','failed','expired','cancelled')");
            });
            b.Property(x => x.PaymentAttemptId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.ActorId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.EventType).HasColumnType("varchar(24)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Note).HasColumnType("nvarchar(1000)");
            b.HasIndex(x => new { x.PaymentAttemptId, x.CreatedAt, x.Id }).HasDatabaseName("IX_PaymentAttemptEvent_PaymentAttemptId_CreatedAt_Id");
            b.HasIndex(x => x.ActorId).HasDatabaseName("IX_PaymentAttemptEvent_ActorId");
            b.HasOne(x => x.PaymentAttempt).WithMany().HasForeignKey(x => x.PaymentAttemptId).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.Actor).WithMany().HasForeignKey(x => x.ActorId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<PaymentEntry>(b =>
        {
            Base(b);
            b.ToTable("PaymentEntry", t =>
            {
                t.UseSqlOutputClause(false); // SQL triggers are installed by 002_integrity.sql.
                t.HasCheckConstraint("CK_PaymentEntry_Kind", "[Kind] IN ('receipt','refund')");
                t.HasCheckConstraint("CK_PaymentEntry_Amount", "[Amount] > 0");
                t.HasCheckConstraint("CK_PaymentEntry_ExternalSource_NonBlank", "LEN(LTRIM(RTRIM([ExternalSource]))) > 0");
                t.HasCheckConstraint("CK_PaymentEntry_ExternalReference_NonBlank", "LEN(LTRIM(RTRIM([ExternalReference]))) > 0");
                t.HasCheckConstraint("CK_PaymentEntry_Reversal", "([Kind] = 'receipt' AND [ReversesEntryId] IS NULL) OR ([Kind] = 'refund' AND [ReversesEntryId] IS NOT NULL AND [Reason] IS NOT NULL AND LEN(LTRIM(RTRIM([Reason]))) > 0)");
            });
            b.Property(x => x.OrderId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.PaymentAttemptId).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.RecordedById).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.IdempotencyKey).HasColumnType("uniqueidentifier").IsRequired();
            b.Property(x => x.Kind).HasColumnType("varchar(12)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Amount).HasColumnType("decimal(18,0)").IsRequired();
            b.Property(x => x.ExternalSource).HasColumnType("varchar(80)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.ExternalReference).HasColumnType("varchar(160)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.OccurredAt).HasColumnType("datetime2(3)").IsRequired();
            b.Property(x => x.ReversesEntryId).HasColumnType("uniqueidentifier");
            b.Property(x => x.Reason).HasColumnType("nvarchar(1000)");
            b.HasIndex(x => x.IdempotencyKey).HasDatabaseName("IX_PaymentEntry_IdempotencyKey").IsUnique();
            b.HasIndex(x => new { x.ExternalSource, x.ExternalReference }).HasDatabaseName("IX_PaymentEntry_ExternalSource_ExternalReference").IsUnique();
            b.HasIndex(x => new { x.OrderId, x.CreatedAt, x.Id }).HasDatabaseName("IX_PaymentEntry_OrderId_CreatedAt_Id");
            b.HasIndex(x => x.ReversesEntryId).HasDatabaseName("IX_PaymentEntry_ReversesEntryId").HasFilter("[ReversesEntryId] IS NOT NULL");
            b.HasIndex(x => new { x.PaymentAttemptId, x.OrderId }).HasDatabaseName("IX_PaymentEntry_PaymentAttemptId_OrderId");
            b.HasIndex(x => x.RecordedById).HasDatabaseName("IX_PaymentEntry_RecordedById");
            b.HasOne(x => x.Order).WithMany().HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.PaymentAttempt).WithMany().HasForeignKey(x => new { x.PaymentAttemptId, x.OrderId }).HasPrincipalKey(x => new { x.Id, x.OrderId }).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.RecordedBy).WithMany().HasForeignKey(x => x.RecordedById).OnDelete(DeleteBehavior.NoAction);
            b.HasOne(x => x.ReversesEntry).WithMany().HasForeignKey(x => x.ReversesEntryId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<NewsArticle>(b =>
        {
            Base(b);
            b.ToTable("NewsArticle", t =>
            {
                t.HasCheckConstraint("CK_NewsArticle_Slug_NonBlank", "LEN(LTRIM(RTRIM([Slug]))) > 0");
                t.HasCheckConstraint("CK_NewsArticle_Title_NonBlank", "LEN(LTRIM(RTRIM([Title]))) > 0");
                t.HasCheckConstraint("CK_NewsArticle_CategoryCode", "[CategoryCode] IN ('new-products','market-trends','barista-tech')");
                t.HasCheckConstraint("CK_NewsArticle_ReadTime", "[ReadTimeMinutes] > 0");
                t.HasCheckConstraint("CK_NewsArticle_TagsJson", "[TagsJson] IS NULL OR ISJSON([TagsJson], ARRAY) = 1");
                t.HasCheckConstraint("CK_NewsArticle_SectionsJson", "[SectionsJson] IS NULL OR ISJSON([SectionsJson], ARRAY) = 1");
            });
            b.Property(x => x.Slug).HasColumnType("varchar(160)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.Title).HasColumnType("nvarchar(250)").IsRequired();
            b.Property(x => x.Excerpt).HasColumnType("nvarchar(2000)").IsRequired();
            b.Property(x => x.CategoryCode).HasColumnType("varchar(30)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.PublishedAt).HasColumnType("datetime2(3)");
            b.Property(x => x.CoverImageUrl).HasColumnType("nvarchar(1000)").IsRequired();
            b.Property(x => x.AuthorName).HasColumnType("nvarchar(150)").IsRequired();
            b.Property(x => x.AuthorRole).HasColumnType("nvarchar(200)").IsRequired();
            b.Property(x => x.AuthorAvatarUrl).HasColumnType("nvarchar(1000)");
            b.Property(x => x.ReadTimeMinutes).HasColumnType("int").IsRequired();
            b.Property(x => x.TagsJson).HasColumnType("nvarchar(max)").IsRequired().HasDefaultValue("[]");
            b.Property(x => x.LeadParagraph).HasColumnType("nvarchar(max)").IsRequired();
            b.Property(x => x.SectionsJson).HasColumnType("nvarchar(max)").IsRequired();
            b.Property(x => x.IsFeatured).HasColumnType("bit").IsRequired().HasDefaultValue(false);
            b.Property(x => x.ArchivedAt).HasColumnType("datetime2(3)");
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.HasIndex(x => x.Slug).HasDatabaseName("IX_NewsArticle_Slug").IsUnique();
            b.HasIndex(x => new { x.CategoryCode, x.PublishedAt, x.Id }).HasDatabaseName("IX_NewsArticle_CategoryCode_PublishedAt_Id").HasFilter("[ArchivedAt] IS NULL AND [PublishedAt] IS NOT NULL").IsDescending(false, true, false);
        });

        modelBuilder.Entity<ContactInquiry>(b =>
        {
            Base(b);
            b.ToTable("ContactInquiry", t =>
            {
                t.HasCheckConstraint("CK_ContactInquiry_FullName_NonBlank", "LEN(LTRIM(RTRIM([FullName]))) > 0");
                t.HasCheckConstraint("CK_ContactInquiry_Phone_NonBlank", "LEN(LTRIM(RTRIM([Phone]))) > 0");
                t.HasCheckConstraint("CK_ContactInquiry_Email_NonBlank", "LEN(LTRIM(RTRIM([Email]))) > 0");
                t.HasCheckConstraint("CK_ContactInquiry_ServiceType", "[ServiceType] IN ('full-setup','equipment','coffee-beans','bar-training')");
                t.HasCheckConstraint("CK_ContactInquiry_Source", "[Source] IN ('contact','solution-package','project-builder','product-quote')");
                t.HasCheckConstraint("CK_ContactInquiry_Status", "[Status] IN ('new','contacted','closed')");
                t.HasCheckConstraint("CK_ContactInquiry_ConfigurationJson", "[ConfigurationJson] IS NULL OR ISJSON([ConfigurationJson], OBJECT) = 1");
            });
            b.Property(x => x.CustomerId).HasColumnType("uniqueidentifier");
            b.Property(x => x.FullName).HasColumnType("nvarchar(150)").IsRequired();
            b.Property(x => x.Phone).HasColumnType("nvarchar(30)").IsRequired();
            b.Property(x => x.Email).HasColumnType("nvarchar(254)").IsRequired();
            b.Property(x => x.BusinessName).HasColumnType("nvarchar(150)");
            b.Property(x => x.ServiceType).HasColumnType("varchar(30)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.BudgetRange).HasColumnType("varchar(30)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.Message).HasColumnType("nvarchar(4000)");
            b.Property(x => x.Source).HasColumnType("varchar(30)").UseCollation("Latin1_General_100_BIN2").IsRequired();
            b.Property(x => x.LegacyPackageCode).HasColumnType("varchar(100)").UseCollation("Latin1_General_100_BIN2");
            b.Property(x => x.ConfigurationJson).HasColumnType("nvarchar(max)");
            b.Property(x => x.Status).HasColumnType("varchar(20)").UseCollation("Latin1_General_100_BIN2").IsRequired().HasDefaultValue("new");
            b.Property(x => x.Version).HasColumnType("rowversion").IsRequired().IsRowVersion();
            b.HasIndex(x => new { x.Status, x.CreatedAt }).HasDatabaseName("IX_ContactInquiry_Status_CreatedAt");
            b.HasIndex(x => x.CustomerId).HasDatabaseName("IX_ContactInquiry_CustomerId");
            b.HasOne(x => x.Customer).WithMany().HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.NoAction);
        });
    }

    private static void Base<T>(EntityTypeBuilder<T> b) where T : BaseEntity
    {
        // BaseEntity is a CLR reuse type, not a mapped inheritance hierarchy.
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
        b.Property(x => x.CreatedAt).HasColumnType("datetime2(3)")
            .HasDefaultValueSql("SYSUTCDATETIME()").IsRequired();
    }
}

