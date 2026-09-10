-- AuraCoffee: SQL Server 2022+, chay bang SSMS hoac sqlcmd.
-- Tao/chon database TRONG voi collation Vietnamese_100_CI_AI truoc khi chay.
-- Chay mot lan; khong chay tren database da co cac bang nay.
-- Bao gom schema, trigger, stored procedure va du lieu danh muc.
-- Chua cai ASP.NET Core Identity. AppUser la ho so nghiep vu, KHONG luu mat khau.
-- Khi cai Identity: lien ket IdentityIssuer/IdentitySubject voi tai khoan Identity.
-- Xem README.md cung thu muc truoc khi ket noi va scaffold models.
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- ===== 001_schema.sql =====

-- Generated from AuraDbContext. Run in a new AuraCoffee database.
CREATE TABLE [dbo].[AppUser] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [IdentityIssuer] varchar(100) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [IdentitySubject] varchar(200) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [DisplayName] nvarchar(150) NOT NULL,
    [Email] nvarchar(254) NOT NULL,
    [Phone] nvarchar(30) NULL,
    [AvatarUrl] nvarchar(1000) NULL,
    [CustomerPersona] varchar(20) COLLATE Latin1_General_100_BIN2 NULL,
    [ShopName] nvarchar(150) NULL,
    [DisabledAt] datetime2(3) NULL,
    [Version] rowversion NOT NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_AppUser] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_AppUser_CustomerPersona] CHECK ([CustomerPersona] IS NULL OR [CustomerPersona] IN ('owner','barista','guest')),
    CONSTRAINT [CK_AppUser_DisplayName_NonBlank] CHECK (LEN(LTRIM(RTRIM([DisplayName]))) > 0),
    CONSTRAINT [CK_AppUser_Email_NonBlank] CHECK (LEN(LTRIM(RTRIM([Email]))) > 0),
    CONSTRAINT [CK_AppUser_IdentityIssuer_NonBlank] CHECK (LEN(LTRIM(RTRIM([IdentityIssuer]))) > 0),
    CONSTRAINT [CK_AppUser_IdentitySubject_NonBlank] CHECK (LEN(LTRIM(RTRIM([IdentitySubject]))) > 0)
);
GO


CREATE TABLE [dbo].[Brand] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Code] varchar(60) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [Name] nvarchar(120) NOT NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [Version] rowversion NOT NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_Brand] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_Brand_Code_NonBlank] CHECK (LEN(LTRIM(RTRIM([Code]))) > 0),
    CONSTRAINT [CK_Brand_Name_NonBlank] CHECK (LEN(LTRIM(RTRIM([Name]))) > 0)
);
GO


CREATE TABLE [dbo].[Category] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Code] varchar(60) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [Name] nvarchar(120) NOT NULL,
    [Domain] varchar(16) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [DisplayOrder] int NOT NULL DEFAULT 0,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [Version] rowversion NOT NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_Category] PRIMARY KEY ([Id]),
    CONSTRAINT [AK_Category_Id_Domain] UNIQUE ([Id], [Domain]),
    CONSTRAINT [CK_Category_Code_NonBlank] CHECK (LEN(LTRIM(RTRIM([Code]))) > 0),
    CONSTRAINT [CK_Category_Domain] CHECK ([Domain] IN ('equipment','ingredients')),
    CONSTRAINT [CK_Category_Name_NonBlank] CHECK (LEN(LTRIM(RTRIM([Name]))) > 0)
);
GO


CREATE TABLE [dbo].[NewsArticle] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Slug] varchar(160) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [Title] nvarchar(250) NOT NULL,
    [Excerpt] nvarchar(2000) NOT NULL,
    [CategoryCode] varchar(30) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [PublishedAt] datetime2(3) NULL,
    [CoverImageUrl] nvarchar(1000) NOT NULL,
    [AuthorName] nvarchar(150) NOT NULL,
    [AuthorRole] nvarchar(200) NOT NULL,
    [AuthorAvatarUrl] nvarchar(1000) NULL,
    [ReadTimeMinutes] int NOT NULL,
    [TagsJson] nvarchar(max) NOT NULL DEFAULT N'[]',
    [LeadParagraph] nvarchar(max) NOT NULL,
    [SectionsJson] nvarchar(max) NOT NULL,
    [IsFeatured] bit NOT NULL DEFAULT CAST(0 AS bit),
    [ArchivedAt] datetime2(3) NULL,
    [Version] rowversion NOT NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_NewsArticle] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_NewsArticle_CategoryCode] CHECK ([CategoryCode] IN ('new-products','market-trends','barista-tech')),
    CONSTRAINT [CK_NewsArticle_ReadTime] CHECK ([ReadTimeMinutes] > 0),
    CONSTRAINT [CK_NewsArticle_SectionsJson] CHECK ([SectionsJson] IS NULL OR ISJSON([SectionsJson], ARRAY) = 1),
    CONSTRAINT [CK_NewsArticle_Slug_NonBlank] CHECK (LEN(LTRIM(RTRIM([Slug]))) > 0),
    CONSTRAINT [CK_NewsArticle_TagsJson] CHECK ([TagsJson] IS NULL OR ISJSON([TagsJson], ARRAY) = 1),
    CONSTRAINT [CK_NewsArticle_Title_NonBlank] CHECK (LEN(LTRIM(RTRIM([Title]))) > 0)
);
GO


CREATE TABLE [dbo].[UseCase] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Code] varchar(40) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [Name] nvarchar(120) NOT NULL,
    [Description] nvarchar(500) NULL,
    [DisplayOrder] int NOT NULL DEFAULT 0,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [Version] rowversion NOT NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_UseCase] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_UseCase_Code_NonBlank] CHECK (LEN(LTRIM(RTRIM([Code]))) > 0),
    CONSTRAINT [CK_UseCase_Name_NonBlank] CHECK (LEN(LTRIM(RTRIM([Name]))) > 0)
);
GO


CREATE TABLE [dbo].[ContactInquiry] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [CustomerId] uniqueidentifier NULL,
    [FullName] nvarchar(150) NOT NULL,
    [Phone] nvarchar(30) NOT NULL,
    [Email] nvarchar(254) NOT NULL,
    [BusinessName] nvarchar(150) NULL,
    [ServiceType] varchar(30) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [BudgetRange] varchar(30) COLLATE Latin1_General_100_BIN2 NULL,
    [Message] nvarchar(4000) NULL,
    [Source] varchar(30) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [LegacyPackageCode] varchar(100) COLLATE Latin1_General_100_BIN2 NULL,
    [ConfigurationJson] nvarchar(max) NULL,
    [Status] varchar(20) COLLATE Latin1_General_100_BIN2 NOT NULL DEFAULT 'new',
    [Version] rowversion NOT NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_ContactInquiry] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_ContactInquiry_ConfigurationJson] CHECK ([ConfigurationJson] IS NULL OR ISJSON([ConfigurationJson], OBJECT) = 1),
    CONSTRAINT [CK_ContactInquiry_Email_NonBlank] CHECK (LEN(LTRIM(RTRIM([Email]))) > 0),
    CONSTRAINT [CK_ContactInquiry_FullName_NonBlank] CHECK (LEN(LTRIM(RTRIM([FullName]))) > 0),
    CONSTRAINT [CK_ContactInquiry_Phone_NonBlank] CHECK (LEN(LTRIM(RTRIM([Phone]))) > 0),
    CONSTRAINT [CK_ContactInquiry_ServiceType] CHECK ([ServiceType] IN ('full-setup','equipment','coffee-beans','bar-training')),
    CONSTRAINT [CK_ContactInquiry_Source] CHECK ([Source] IN ('contact','solution-package','project-builder','product-quote')),
    CONSTRAINT [CK_ContactInquiry_Status] CHECK ([Status] IN ('new','contacted','closed')),
    CONSTRAINT [FK_ContactInquiry_AppUser_CustomerId] FOREIGN KEY ([CustomerId]) REFERENCES [dbo].[AppUser] ([Id])
);
GO


CREATE TABLE [dbo].[Order] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [OrderCode] varchar(32) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [CustomerId] uniqueidentifier NOT NULL,
    [IdempotencyKey] uniqueidentifier NOT NULL,
    [RequestHash] varchar(64) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [Currency] varchar(3) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [PreferredPaymentMethod] varchar(12) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [RecipientName] nvarchar(150) NOT NULL,
    [Phone] nvarchar(30) NOT NULL,
    [Email] nvarchar(254) NULL,
    [AddressLine] nvarchar(400) NOT NULL,
    [Province] nvarchar(120) NOT NULL,
    [District] nvarchar(120) NULL,
    [DeliveryNote] nvarchar(1000) NULL,
    [Subtotal] decimal(18,0) NOT NULL,
    [DiscountTotal] decimal(18,0) NOT NULL,
    [ShippingFee] decimal(18,0) NOT NULL,
    [Total] decimal(18,0) NOT NULL,
    [TaxIncludedAmount] decimal(18,0) NULL,
    [SubmittedAt] datetime2(3) NULL,
    [Version] rowversion NOT NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_Order] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_Order_AddressLine_NonBlank] CHECK (LEN(LTRIM(RTRIM([AddressLine]))) > 0),
    CONSTRAINT [CK_Order_Amounts] CHECK ([Subtotal] >= 0 AND [DiscountTotal] BETWEEN 0 AND [Subtotal] AND [ShippingFee] >= 0 AND [Total] = [Subtotal] - [DiscountTotal] + [ShippingFee] AND ([TaxIncludedAmount] IS NULL OR [TaxIncludedAmount] BETWEEN 0 AND [Total])),
    CONSTRAINT [CK_Order_Currency] CHECK ([Currency] = 'VND'),
    CONSTRAINT [CK_Order_OrderCode_NonBlank] CHECK (LEN(LTRIM(RTRIM([OrderCode]))) > 0),
    CONSTRAINT [CK_Order_Phone_NonBlank] CHECK (LEN(LTRIM(RTRIM([Phone]))) > 0),
    CONSTRAINT [CK_Order_PreferredPaymentMethod] CHECK ([PreferredPaymentMethod] IN ('vietqr','cod')),
    CONSTRAINT [CK_Order_Province_NonBlank] CHECK (LEN(LTRIM(RTRIM([Province]))) > 0),
    CONSTRAINT [CK_Order_RecipientName_NonBlank] CHECK (LEN(LTRIM(RTRIM([RecipientName]))) > 0),
    CONSTRAINT [CK_Order_RequestHash] CHECK (LEN([RequestHash]) = 64),
    CONSTRAINT [FK_Order_AppUser_CustomerId] FOREIGN KEY ([CustomerId]) REFERENCES [dbo].[AppUser] ([Id])
);
GO


CREATE TABLE [dbo].[Product] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [LegacyId] varchar(100) COLLATE Latin1_General_100_BIN2 NULL,
    [Slug] varchar(160) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [Sku] varchar(60) COLLATE Latin1_General_100_BIN2 NULL,
    [Name] nvarchar(250) NOT NULL,
    [CategoryId] uniqueidentifier NOT NULL,
    [Domain] varchar(16) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [BrandId] uniqueidentifier NOT NULL,
    [ShortDescription] nvarchar(2000) NOT NULL,
    [PriceMode] varchar(12) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [Price] decimal(18,0) NULL,
    [IsAvailableForOrder] bit NOT NULL,
    [IsPublished] bit NOT NULL DEFAULT CAST(0 AS bit),
    [IsFeatured] bit NOT NULL DEFAULT CAST(0 AS bit),
    [LeadTimeNotice] nvarchar(300) NULL,
    [ArchivedAt] datetime2(3) NULL,
    [UpdatedAt] datetime2(3) NULL,
    [Version] rowversion NOT NULL,
    [GroupsCount] int NULL,
    [Boiler] nvarchar(200) NULL,
    [BoilerCapacity] nvarchar(120) NULL,
    [Pump] nvarchar(150) NULL,
    [PowerLabel] nvarchar(100) NULL,
    [Voltage] varchar(16) COLLATE Latin1_General_100_BIN2 NULL,
    [Dimensions] nvarchar(120) NULL,
    [WeightLabel] nvarchar(80) NULL,
    [Warranty] nvarchar(200) NULL,
    [DailyCapacityLabel] nvarchar(150) NULL,
    [Origin] nvarchar(150) NULL,
    [SubRegion] nvarchar(150) NULL,
    [Altitude] nvarchar(100) NULL,
    [Process] nvarchar(150) NULL,
    [RoastProfile] varchar(20) COLLATE Latin1_General_100_BIN2 NULL,
    [CuppingScore] decimal(5,2) NULL,
    [FlavorNotesJson] nvarchar(max) NULL,
    [UnitSize] nvarchar(100) NULL,
    [CaseSize] nvarchar(100) NULL,
    [ShelfLife] nvarchar(150) NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_Product] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_Product_CuppingScore] CHECK ([CuppingScore] IS NULL OR [CuppingScore] BETWEEN 0 AND 100),
    CONSTRAINT [CK_Product_Domain] CHECK ([Domain] IN ('equipment','ingredients')),
    CONSTRAINT [CK_Product_FlavorNotesJson] CHECK ([FlavorNotesJson] IS NULL OR ISJSON([FlavorNotesJson], ARRAY) = 1),
    CONSTRAINT [CK_Product_GroupsCount] CHECK ([GroupsCount] IS NULL OR [GroupsCount] > 0),
    CONSTRAINT [CK_Product_Name_NonBlank] CHECK (LEN(LTRIM(RTRIM([Name]))) > 0),
    CONSTRAINT [CK_Product_PriceMode] CHECK ([PriceMode] IN ('fixed','from','contact')),
    CONSTRAINT [CK_Product_PriceMode_Value] CHECK (([PriceMode] = 'contact' AND [Price] IS NULL) OR ([PriceMode] IN ('fixed','from') AND [Price] IS NOT NULL AND [Price] BETWEEN 0 AND 999999999999)),
    CONSTRAINT [CK_Product_PublishedCompleteness] CHECK ([IsPublished] = 0 OR ([Domain] = 'equipment' AND [Warranty] IS NOT NULL AND LEN(LTRIM(RTRIM([Warranty]))) > 0) OR ([Domain] = 'ingredients' AND [UnitSize] IS NOT NULL AND LEN(LTRIM(RTRIM([UnitSize]))) > 0)),
    CONSTRAINT [CK_Product_RoastProfile] CHECK ([RoastProfile] IS NULL OR [RoastProfile] IN ('Light','Medium','Medium-Dark','Dark')),
    CONSTRAINT [CK_Product_Slug_NonBlank] CHECK (LEN(LTRIM(RTRIM([Slug]))) > 0),
    CONSTRAINT [CK_Product_Subtype] CHECK (([Domain] = 'equipment' AND [Origin] IS NULL AND [SubRegion] IS NULL AND [Altitude] IS NULL AND [Process] IS NULL AND [RoastProfile] IS NULL AND [CuppingScore] IS NULL AND [FlavorNotesJson] IS NULL AND [UnitSize] IS NULL AND [CaseSize] IS NULL AND [ShelfLife] IS NULL) OR ([Domain] = 'ingredients' AND [GroupsCount] IS NULL AND [Boiler] IS NULL AND [BoilerCapacity] IS NULL AND [Pump] IS NULL AND [PowerLabel] IS NULL AND [Voltage] IS NULL AND [Dimensions] IS NULL AND [WeightLabel] IS NULL AND [Warranty] IS NULL AND [DailyCapacityLabel] IS NULL)),
    CONSTRAINT [CK_Product_Voltage] CHECK ([Voltage] IS NULL OR [Voltage] IN ('220V','380V','220V/380V')),
    CONSTRAINT [FK_Product_Brand_BrandId] FOREIGN KEY ([BrandId]) REFERENCES [dbo].[Brand] ([Id]),
    CONSTRAINT [FK_Product_Category_CategoryId_Domain] FOREIGN KEY ([CategoryId], [Domain]) REFERENCES [dbo].[Category] ([Id], [Domain])
);
GO


CREATE TABLE [dbo].[OrderEvent] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [OrderId] uniqueidentifier NOT NULL,
    [Sequence] int NOT NULL,
    [Status] varchar(20) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [ActorId] uniqueidentifier NOT NULL,
    [Note] nvarchar(1000) NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_OrderEvent] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_OrderEvent_Sequence] CHECK ([Sequence] > 0),
    CONSTRAINT [CK_OrderEvent_Status] CHECK ([Status] IN ('submitted','confirmed','processing','dispatched','completed','cancelled')),
    CONSTRAINT [FK_OrderEvent_AppUser_ActorId] FOREIGN KEY ([ActorId]) REFERENCES [dbo].[AppUser] ([Id]),
    CONSTRAINT [FK_OrderEvent_Order_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [dbo].[Order] ([Id])
);
GO


CREATE TABLE [dbo].[PaymentAttempt] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [OrderId] uniqueidentifier NOT NULL,
    [RequestedById] uniqueidentifier NOT NULL,
    [IdempotencyKey] uniqueidentifier NOT NULL,
    [Method] varchar(12) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [RequestedAmount] decimal(18,0) NOT NULL,
    [TransferReference] varchar(100) COLLATE Latin1_General_100_BIN2 NULL,
    [DestinationSnapshot] nvarchar(1000) NULL,
    [ExpiresAt] datetime2(3) NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_PaymentAttempt] PRIMARY KEY ([Id]),
    CONSTRAINT [AK_PaymentAttempt_Id_OrderId] UNIQUE ([Id], [OrderId]),
    CONSTRAINT [CK_PaymentAttempt_Expiry] CHECK ([ExpiresAt] IS NULL OR [ExpiresAt] > [CreatedAt]),
    CONSTRAINT [CK_PaymentAttempt_Method] CHECK ([Method] IN ('vietqr','cod')),
    CONSTRAINT [CK_PaymentAttempt_RequestedAmount] CHECK ([RequestedAmount] > 0),
    CONSTRAINT [CK_PaymentAttempt_Transfer] CHECK (([Method] = 'cod' AND [TransferReference] IS NULL AND [DestinationSnapshot] IS NULL) OR ([Method] = 'vietqr' AND [TransferReference] IS NOT NULL AND LEN(LTRIM(RTRIM([TransferReference]))) > 0 AND [DestinationSnapshot] IS NOT NULL AND LEN(LTRIM(RTRIM([DestinationSnapshot]))) > 0)),
    CONSTRAINT [FK_PaymentAttempt_AppUser_RequestedById] FOREIGN KEY ([RequestedById]) REFERENCES [dbo].[AppUser] ([Id]),
    CONSTRAINT [FK_PaymentAttempt_Order_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [dbo].[Order] ([Id])
);
GO


CREATE TABLE [dbo].[OrderItem] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [OrderId] uniqueidentifier NOT NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [LineNumber] int NOT NULL,
    [ProductName] nvarchar(250) NOT NULL,
    [Sku] varchar(60) COLLATE Latin1_General_100_BIN2 NULL,
    [Specification] nvarchar(1000) NULL,
    [UnitLabel] nvarchar(100) NULL,
    [UnitPrice] decimal(18,0) NOT NULL,
    [Quantity] int NOT NULL,
    [DiscountAmount] decimal(18,0) NOT NULL,
    [LineTotal] AS CONVERT(decimal(18,0), [UnitPrice] * [Quantity] - [DiscountAmount]) PERSISTED,
    [TaxIncludedAmount] decimal(18,0) NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_OrderItem] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_OrderItem_Amounts] CHECK ([UnitPrice] BETWEEN 0 AND 999999999999 AND [Quantity] BETWEEN 1 AND 10000 AND [DiscountAmount] BETWEEN 0 AND [UnitPrice] * [Quantity] AND ([TaxIncludedAmount] IS NULL OR [TaxIncludedAmount] BETWEEN 0 AND [UnitPrice] * [Quantity] - [DiscountAmount])),
    CONSTRAINT [CK_OrderItem_LineNumber] CHECK ([LineNumber] > 0),
    CONSTRAINT [CK_OrderItem_ProductName_NonBlank] CHECK (LEN(LTRIM(RTRIM([ProductName]))) > 0),
    CONSTRAINT [FK_OrderItem_Order_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [dbo].[Order] ([Id]),
    CONSTRAINT [FK_OrderItem_Product_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product] ([Id])
);
GO


CREATE TABLE [dbo].[ProductMedia] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [ProductId] uniqueidentifier NOT NULL,
    [Url] nvarchar(1000) NOT NULL,
    [AltText] nvarchar(300) NULL,
    [Position] int NOT NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_ProductMedia] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_ProductMedia_Position] CHECK ([Position] >= 0),
    CONSTRAINT [CK_ProductMedia_Url_NonBlank] CHECK (LEN(LTRIM(RTRIM([Url]))) > 0),
    CONSTRAINT [FK_ProductMedia_Product_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product] ([Id])
);
GO


CREATE TABLE [dbo].[ProductUseCase] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [ProductId] uniqueidentifier NOT NULL,
    [UseCaseId] uniqueidentifier NOT NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_ProductUseCase] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ProductUseCase_Product_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product] ([Id]),
    CONSTRAINT [FK_ProductUseCase_UseCase_UseCaseId] FOREIGN KEY ([UseCaseId]) REFERENCES [dbo].[UseCase] ([Id])
);
GO


CREATE TABLE [dbo].[PaymentAttemptEvent] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [PaymentAttemptId] uniqueidentifier NOT NULL,
    [ActorId] uniqueidentifier NOT NULL,
    [EventType] varchar(24) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [Note] nvarchar(1000) NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_PaymentAttemptEvent] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_PaymentAttemptEvent_EventType] CHECK ([EventType] IN ('customer_reported','failed','expired','cancelled')),
    CONSTRAINT [FK_PaymentAttemptEvent_AppUser_ActorId] FOREIGN KEY ([ActorId]) REFERENCES [dbo].[AppUser] ([Id]),
    CONSTRAINT [FK_PaymentAttemptEvent_PaymentAttempt_PaymentAttemptId] FOREIGN KEY ([PaymentAttemptId]) REFERENCES [dbo].[PaymentAttempt] ([Id])
);
GO


CREATE TABLE [dbo].[PaymentEntry] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [OrderId] uniqueidentifier NOT NULL,
    [PaymentAttemptId] uniqueidentifier NOT NULL,
    [RecordedById] uniqueidentifier NOT NULL,
    [IdempotencyKey] uniqueidentifier NOT NULL,
    [Kind] varchar(12) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [Amount] decimal(18,0) NOT NULL,
    [ExternalSource] varchar(80) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [ExternalReference] varchar(160) COLLATE Latin1_General_100_BIN2 NOT NULL,
    [OccurredAt] datetime2(3) NOT NULL,
    [ReversesEntryId] uniqueidentifier NULL,
    [Reason] nvarchar(1000) NULL,
    [CreatedAt] datetime2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_PaymentEntry] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_PaymentEntry_Amount] CHECK ([Amount] > 0),
    CONSTRAINT [CK_PaymentEntry_ExternalReference_NonBlank] CHECK (LEN(LTRIM(RTRIM([ExternalReference]))) > 0),
    CONSTRAINT [CK_PaymentEntry_ExternalSource_NonBlank] CHECK (LEN(LTRIM(RTRIM([ExternalSource]))) > 0),
    CONSTRAINT [CK_PaymentEntry_Kind] CHECK ([Kind] IN ('receipt','refund')),
    CONSTRAINT [CK_PaymentEntry_Reversal] CHECK (([Kind] = 'receipt' AND [ReversesEntryId] IS NULL) OR ([Kind] = 'refund' AND [ReversesEntryId] IS NOT NULL AND [Reason] IS NOT NULL AND LEN(LTRIM(RTRIM([Reason]))) > 0)),
    CONSTRAINT [FK_PaymentEntry_AppUser_RecordedById] FOREIGN KEY ([RecordedById]) REFERENCES [dbo].[AppUser] ([Id]),
    CONSTRAINT [FK_PaymentEntry_Order_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [dbo].[Order] ([Id]),
    CONSTRAINT [FK_PaymentEntry_PaymentAttempt_PaymentAttemptId_OrderId] FOREIGN KEY ([PaymentAttemptId], [OrderId]) REFERENCES [dbo].[PaymentAttempt] ([Id], [OrderId]),
    CONSTRAINT [FK_PaymentEntry_PaymentEntry_ReversesEntryId] FOREIGN KEY ([ReversesEntryId]) REFERENCES [dbo].[PaymentEntry] ([Id])
);
GO


CREATE UNIQUE INDEX [IX_AppUser_IdentityIssuer_IdentitySubject] ON [dbo].[AppUser] ([IdentityIssuer], [IdentitySubject]);
GO


CREATE UNIQUE INDEX [IX_Brand_Code] ON [dbo].[Brand] ([Code]);
GO


CREATE UNIQUE INDEX [IX_Brand_Name] ON [dbo].[Brand] ([Name]);
GO


CREATE UNIQUE INDEX [IX_Category_Code] ON [dbo].[Category] ([Code]);
GO


CREATE INDEX [IX_Category_Domain_DisplayOrder] ON [dbo].[Category] ([Domain], [DisplayOrder]);
GO


CREATE INDEX [IX_ContactInquiry_CustomerId] ON [dbo].[ContactInquiry] ([CustomerId]);
GO


CREATE INDEX [IX_ContactInquiry_Status_CreatedAt] ON [dbo].[ContactInquiry] ([Status], [CreatedAt]);
GO


CREATE INDEX [IX_NewsArticle_CategoryCode_PublishedAt_Id] ON [dbo].[NewsArticle] ([CategoryCode], [PublishedAt] DESC, [Id]) WHERE [ArchivedAt] IS NULL AND [PublishedAt] IS NOT NULL;
GO


CREATE UNIQUE INDEX [IX_NewsArticle_Slug] ON [dbo].[NewsArticle] ([Slug]);
GO


CREATE INDEX [IX_Order_CustomerId_CreatedAt_Id] ON [dbo].[Order] ([CustomerId], [CreatedAt] DESC, [Id]);
GO


CREATE UNIQUE INDEX [IX_Order_CustomerId_IdempotencyKey] ON [dbo].[Order] ([CustomerId], [IdempotencyKey]);
GO


CREATE UNIQUE INDEX [IX_Order_OrderCode] ON [dbo].[Order] ([OrderCode]);
GO


CREATE INDEX [IX_OrderEvent_ActorId] ON [dbo].[OrderEvent] ([ActorId]);
GO


CREATE UNIQUE INDEX [IX_OrderEvent_OrderId_Sequence] ON [dbo].[OrderEvent] ([OrderId], [Sequence]);
GO


CREATE INDEX [IX_OrderEvent_Status_CreatedAt] ON [dbo].[OrderEvent] ([Status], [CreatedAt]);
GO


CREATE UNIQUE INDEX [IX_OrderItem_OrderId_LineNumber] ON [dbo].[OrderItem] ([OrderId], [LineNumber]);
GO


CREATE INDEX [IX_OrderItem_ProductId] ON [dbo].[OrderItem] ([ProductId]);
GO


CREATE UNIQUE INDEX [IX_PaymentAttempt_OrderId_IdempotencyKey] ON [dbo].[PaymentAttempt] ([OrderId], [IdempotencyKey]);
GO


CREATE INDEX [IX_PaymentAttempt_RequestedById] ON [dbo].[PaymentAttempt] ([RequestedById]);
GO


CREATE UNIQUE INDEX [IX_PaymentAttempt_TransferReference] ON [dbo].[PaymentAttempt] ([TransferReference]) WHERE [TransferReference] IS NOT NULL;
GO


CREATE INDEX [IX_PaymentAttemptEvent_ActorId] ON [dbo].[PaymentAttemptEvent] ([ActorId]);
GO


CREATE INDEX [IX_PaymentAttemptEvent_PaymentAttemptId_CreatedAt_Id] ON [dbo].[PaymentAttemptEvent] ([PaymentAttemptId], [CreatedAt], [Id]);
GO


CREATE UNIQUE INDEX [IX_PaymentEntry_ExternalSource_ExternalReference] ON [dbo].[PaymentEntry] ([ExternalSource], [ExternalReference]);
GO


CREATE UNIQUE INDEX [IX_PaymentEntry_IdempotencyKey] ON [dbo].[PaymentEntry] ([IdempotencyKey]);
GO


CREATE INDEX [IX_PaymentEntry_OrderId_CreatedAt_Id] ON [dbo].[PaymentEntry] ([OrderId], [CreatedAt], [Id]);
GO


CREATE INDEX [IX_PaymentEntry_PaymentAttemptId_OrderId] ON [dbo].[PaymentEntry] ([PaymentAttemptId], [OrderId]);
GO


CREATE INDEX [IX_PaymentEntry_RecordedById] ON [dbo].[PaymentEntry] ([RecordedById]);
GO


CREATE INDEX [IX_PaymentEntry_ReversesEntryId] ON [dbo].[PaymentEntry] ([ReversesEntryId]) WHERE [ReversesEntryId] IS NOT NULL;
GO


CREATE INDEX [IX_Product_BrandId_CategoryId] ON [dbo].[Product] ([BrandId], [CategoryId]);
GO


CREATE INDEX [IX_Product_CategoryId_Domain] ON [dbo].[Product] ([CategoryId], [Domain]);
GO


CREATE INDEX [IX_Product_CategoryId_Price_Id] ON [dbo].[Product] ([CategoryId], [Price], [Id]) WHERE [ArchivedAt] IS NULL AND [IsPublished] = 1;
GO


CREATE INDEX [IX_Product_Domain_IsFeatured_CreatedAt_Id] ON [dbo].[Product] ([Domain], [IsFeatured] DESC, [CreatedAt] DESC, [Id]) WHERE [ArchivedAt] IS NULL AND [IsPublished] = 1;
GO


CREATE UNIQUE INDEX [IX_Product_LegacyId] ON [dbo].[Product] ([LegacyId]) WHERE [LegacyId] IS NOT NULL;
GO


CREATE UNIQUE INDEX [IX_Product_Sku] ON [dbo].[Product] ([Sku]) WHERE [Sku] IS NOT NULL;
GO


CREATE UNIQUE INDEX [IX_Product_Slug] ON [dbo].[Product] ([Slug]);
GO


CREATE UNIQUE INDEX [IX_ProductMedia_ProductId_Position] ON [dbo].[ProductMedia] ([ProductId], [Position]);
GO


CREATE UNIQUE INDEX [IX_ProductUseCase_ProductId_UseCaseId] ON [dbo].[ProductUseCase] ([ProductId], [UseCaseId]);
GO


CREATE INDEX [IX_ProductUseCase_UseCaseId_ProductId] ON [dbo].[ProductUseCase] ([UseCaseId], [ProductId]);
GO


CREATE UNIQUE INDEX [IX_UseCase_Code] ON [dbo].[UseCase] ([Code]);
GO




-- ===== 002_integrity.sql =====

-- Run after 001_schema.sql, in the target AuraCoffee database, with a migration principal.
-- SQL Server 2022. GO is a client batch delimiter (sqlcmd/SSMS), not T-SQL.
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO
CREATE OR ALTER TRIGGER dbo.TR_Order_Guard ON dbo.[Order]
AFTER INSERT, UPDATE, DELETE AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM deleted WHERE SubmittedAt IS NOT NULL)
        THROW 51001, 'Submitted orders cannot be updated or deleted. Use append-only events.', 1;
    IF EXISTS (SELECT 1 FROM inserted i LEFT JOIN deleted d ON d.Id=i.Id
               WHERE d.Id IS NULL AND i.SubmittedAt IS NOT NULL)
        THROW 51002, 'Insert draft and its items, then seal inside one transaction.', 1;
    IF EXISTS (
        SELECT 1 FROM inserted i
        OUTER APPLY (SELECT COUNT_BIG(*) AS N, SUM(x.UnitPrice*x.Quantity) AS Subtotal,
                     SUM(x.DiscountAmount) AS Discounts
                     FROM dbo.OrderItem x WITH (HOLDLOCK) WHERE x.OrderId=i.Id) a
        WHERE i.SubmittedAt IS NOT NULL AND
          (a.N=0 OR a.Subtotal<>i.Subtotal OR a.Discounts<>i.DiscountTotal))
        THROW 51003, 'Cannot seal empty order or inconsistent totals.', 1;
END;
GO
CREATE OR ALTER TRIGGER dbo.TR_OrderItem_Guard ON dbo.OrderItem
AFTER INSERT, UPDATE, DELETE AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @lock uniqueidentifier;
    -- Same parent lock used by order sealing/payment writers. Multi-row aware.
    SELECT @lock=o.Id FROM dbo.[Order] o WITH (UPDLOCK,HOLDLOCK)
      WHERE o.Id IN (SELECT OrderId FROM inserted UNION SELECT OrderId FROM deleted);
    IF EXISTS (SELECT 1 FROM dbo.[Order] o
       WHERE o.SubmittedAt IS NOT NULL AND o.Id IN
       (SELECT OrderId FROM inserted UNION SELECT OrderId FROM deleted))
        THROW 51004, 'Items of submitted orders cannot change.', 1;
END;
GO
CREATE OR ALTER TRIGGER dbo.TR_OrderEvent_Guard ON dbo.OrderEvent
AFTER INSERT, UPDATE, DELETE AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM deleted) THROW 51005, 'Order events are append-only.', 1;
    DECLARE @lock uniqueidentifier;
    SELECT @lock=o.Id FROM dbo.[Order] o WITH (UPDLOCK,HOLDLOCK)
      WHERE o.Id IN (SELECT OrderId FROM inserted);
    IF EXISTS (SELECT 1 FROM inserted i JOIN dbo.[Order] o ON o.Id=i.OrderId
      LEFT JOIN dbo.OrderEvent p ON p.OrderId=i.OrderId AND p.Sequence=i.Sequence-1
      WHERE o.SubmittedAt IS NULL OR NOT (
        (i.Sequence=1 AND i.Status='submitted') OR
        (i.Sequence>1 AND p.Id IS NOT NULL AND (
          (p.Status='submitted' AND i.Status IN ('confirmed','cancelled')) OR
          (p.Status='confirmed' AND i.Status IN ('processing','cancelled')) OR
          (p.Status='processing' AND i.Status IN ('dispatched','cancelled')) OR
          (p.Status='dispatched' AND i.Status='completed')))))
        THROW 51006, 'Invalid order state transition.', 1;
END;
GO
CREATE OR ALTER TRIGGER dbo.TR_PaymentAttempt_Guard ON dbo.PaymentAttempt
AFTER INSERT, UPDATE, DELETE AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM deleted) THROW 51007, 'Payment attempts are append-only.', 1;
    DECLARE @lock uniqueidentifier;
    SELECT @lock=o.Id FROM dbo.[Order] o WITH (UPDLOCK,HOLDLOCK)
      WHERE o.Id IN (SELECT OrderId FROM inserted);
    IF EXISTS (SELECT 1 FROM inserted i JOIN dbo.[Order] o ON o.Id=i.OrderId
      WHERE o.SubmittedAt IS NULL OR i.RequestedAmount>o.Total)
        THROW 51008, 'Attempt requires submitted order and amount no greater than order total.', 1;
END;
GO
CREATE OR ALTER TRIGGER dbo.TR_PaymentAttemptEvent_Guard ON dbo.PaymentAttemptEvent
AFTER UPDATE, DELETE AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM deleted) THROW 51009, 'Payment attempt events are append-only.', 1;
END;
GO
CREATE OR ALTER TRIGGER dbo.TR_PaymentEntry_Guard ON dbo.PaymentEntry
AFTER INSERT, UPDATE, DELETE AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM deleted) THROW 51010, 'Money entries are append-only. Record a refund instead.', 1;
    DECLARE @lock uniqueidentifier;
    SELECT @lock=o.Id FROM dbo.[Order] o WITH (UPDLOCK,HOLDLOCK)
      WHERE o.Id IN (SELECT OrderId FROM inserted);
    IF EXISTS (SELECT 1 FROM inserted i JOIN dbo.[Order] o ON o.Id=i.OrderId WHERE o.SubmittedAt IS NULL)
        THROW 51011, 'Money requires a submitted order.', 1;
    IF EXISTS (SELECT 1 FROM inserted i LEFT JOIN dbo.PaymentEntry r ON r.Id=i.ReversesEntryId
      WHERE i.Kind='refund' AND (r.Id IS NULL OR r.Kind<>'receipt' OR r.OrderId<>i.OrderId
                                    OR r.PaymentAttemptId<>i.PaymentAttemptId))
        THROW 51012, 'Refund must reference a receipt in the same order and attempt.', 1;
    IF EXISTS (SELECT 1 FROM dbo.PaymentEntry r
      CROSS APPLY (SELECT SUM(x.Amount) Refunded FROM dbo.PaymentEntry x WITH (HOLDLOCK)
                   WHERE x.ReversesEntryId=r.Id) a
      WHERE r.Id IN (SELECT ReversesEntryId FROM inserted WHERE ReversesEntryId IS NOT NULL)
        AND a.Refunded>r.Amount)
        THROW 51013, 'Cumulative refund exceeds its receipt.', 1;
    -- No cap at order.Total: real accidental overpayments must not disappear.
END;
GO
CREATE OR ALTER VIEW dbo.OrderPaymentBalance AS
SELECT o.Id AS OrderId, o.OrderCode, o.Currency, o.Total,
       COALESCE(SUM(CASE WHEN e.Kind='receipt' THEN e.Amount ELSE 0 END),0) AS ReceivedAmount,
       COALESCE(SUM(CASE WHEN e.Kind='refund' THEN e.Amount ELSE 0 END),0) AS RefundedAmount,
       COALESCE(SUM(CASE WHEN e.Kind='receipt' THEN e.Amount ELSE -e.Amount END),0) AS NetReceived,
       o.Total - COALESCE(SUM(CASE WHEN e.Kind='receipt' THEN e.Amount ELSE -e.Amount END),0) AS OutstandingAmount
FROM dbo.[Order] o LEFT JOIN dbo.PaymentEntry e ON e.OrderId=o.Id
WHERE o.SubmittedAt IS NOT NULL
GROUP BY o.Id,o.OrderCode,o.Currency,o.Total;
GO
CREATE OR ALTER VIEW dbo.CurrentOrderStatus AS
SELECT o.Id AS OrderId, s.Status, s.Sequence, s.CreatedAt AS StatusAt
FROM dbo.[Order] o
CROSS APPLY (SELECT TOP(1) e.Status,e.Sequence,e.CreatedAt FROM dbo.OrderEvent e
             WHERE e.OrderId=o.Id ORDER BY e.Sequence DESC) s;
GO
-- A separate database role for the future application. No login/password embedded.
IF DATABASE_PRINCIPAL_ID('aura_runtime') IS NULL EXEC('CREATE ROLE aura_runtime');
GO
GRANT SELECT ON SCHEMA::dbo TO aura_runtime;
-- Financial writes go through the reviewed procedures below, never DbSet.Update/Remove.
DENY INSERT, UPDATE, DELETE ON dbo.[Order] TO aura_runtime;
DENY INSERT, UPDATE, DELETE ON dbo.OrderItem TO aura_runtime;
DENY INSERT, UPDATE, DELETE ON dbo.OrderEvent TO aura_runtime;
DENY INSERT, UPDATE, DELETE ON dbo.PaymentAttempt TO aura_runtime;
DENY INSERT, UPDATE, DELETE ON dbo.PaymentAttemptEvent TO aura_runtime;
DENY INSERT, UPDATE, DELETE ON dbo.PaymentEntry TO aura_runtime;
-- Do not grant ALTER, CONTROL, db_owner, db_ddladmin or schema-wide EXECUTE.
-- Ownership chaining permits the individually granted procedures to perform writes.
GO


-- ===== 003_commands.sql =====

-- Requires 001_schema.sql and 002_integrity.sql. These are BE-internal commands,
-- NOT public API permission checks. Bind CustomerId/ActorId from trusted identity.
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO
IF OBJECT_ID('dbo.OrderNumber','SO') IS NULL
    EXEC('CREATE SEQUENCE dbo.OrderNumber AS bigint START WITH 1 INCREMENT BY 1 NO CYCLE');
GO
CREATE OR ALTER PROCEDURE dbo.CreateOrder
    @CustomerId uniqueidentifier, @IdempotencyKey uniqueidentifier,
    @ItemsJson nvarchar(max), -- [{"productId":"...","quantity":1}], NO client prices
    @RecipientName nvarchar(150), @Phone nvarchar(30), @Email nvarchar(254),
    @AddressLine nvarchar(400), @Province nvarchar(120), @District nvarchar(120),
    @DeliveryNote nvarchar(1000), @PreferredPaymentMethod varchar(12),
    @ShippingFee decimal(18,0) -- trusted BE shipping calculation, explicit even if zero
AS
BEGIN
    SET NOCOUNT ON; SET XACT_ABORT ON;
    IF @@TRANCOUNT<>0 THROW 51100, 'Call command without an ambient transaction.', 1;
    IF ISJSON(@ItemsJson, ARRAY)<>1 THROW 51101, 'Items must be a JSON array.', 1;
    DECLARE @Items table (ProductId uniqueidentifier PRIMARY KEY, Quantity int NOT NULL);
    -- Accept integer JSON notation only; reject fractions before int conversion.
    IF EXISTS (SELECT 1 FROM OPENJSON(@ItemsJson) a
      OUTER APPLY OPENJSON(a.value) WITH (productId varchar(100), quantity nvarchar(100)) p
      WHERE a.type<>5 OR TRY_CONVERT(uniqueidentifier,p.productId) IS NULL
       OR p.quantity IS NULL OR p.quantity COLLATE Latin1_General_100_BIN2 LIKE '%[^0-9]%'
       OR TRY_CONVERT(int,p.quantity) IS NULL OR TRY_CONVERT(int,p.quantity) NOT BETWEEN 1 AND 10000)
        THROW 51102, 'Each item needs a valid product ID and an integer quantity 1..10000.', 1;
    INSERT @Items SELECT productId,quantity FROM OPENJSON(@ItemsJson)
        WITH(productId uniqueidentifier,quantity int);
    IF NOT EXISTS(SELECT 1 FROM @Items) OR (SELECT COUNT(*) FROM @Items)>100
        THROW 51103, 'Order must contain 1..100 distinct products.', 1;
    DECLARE @NormalizedItems nvarchar(max)=(SELECT ProductId,Quantity FROM @Items ORDER BY ProductId FOR JSON PATH);
    DECLARE @Payload nvarchar(max)=(SELECT @NormalizedItems Items,@RecipientName Recipient,@Phone Phone,
        @Email Email,@AddressLine AddressLine,@Province Province,@District District,@DeliveryNote Note,
        @PreferredPaymentMethod Method,@ShippingFee ShippingFee FOR JSON PATH,INCLUDE_NULL_VALUES,WITHOUT_ARRAY_WRAPPER);
    DECLARE @Hash varchar(64)=CONVERT(varchar(64),HASHBYTES('SHA2_256',@Payload),2);
    DECLARE @Id uniqueidentifier,@ExistingHash varchar(64),@LockResult int;
    DECLARE @Resource nvarchar(255)=CONCAT('order:',@CustomerId,':',@IdempotencyKey);
    BEGIN TRY
      BEGIN TRAN;
      EXEC @LockResult=sys.sp_getapplock @Resource=@Resource,@LockMode='Exclusive',@LockOwner='Transaction',@LockTimeout=10000;
      IF @LockResult<0 THROW 51104, 'Could not acquire idempotency lock.', 1;
      SELECT @Id=Id,@ExistingHash=RequestHash FROM dbo.[Order] WITH(UPDLOCK,HOLDLOCK)
         WHERE CustomerId=@CustomerId AND IdempotencyKey=@IdempotencyKey;
      IF @Id IS NOT NULL
      BEGIN
        IF @ExistingHash<>@Hash THROW 51105, 'Idempotency key already belongs to another request.', 1;
        COMMIT; SELECT Id,OrderCode,Total,SubmittedAt FROM dbo.[Order] WHERE Id=@Id; RETURN;
      END;
      IF NOT EXISTS (SELECT 1 FROM dbo.AppUser WITH(HOLDLOCK) WHERE Id=@CustomerId AND DisabledAt IS NULL)
          THROW 51106, 'Active authenticated customer required.', 1;
      SELECT p.Id,p.Name,p.Sku,p.UnitSize,p.Warranty,p.Boiler,p.PowerLabel,p.Voltage,p.Origin,p.RoastProfile,p.Price,i.Quantity
      INTO #Priced FROM @Items i JOIN dbo.Product p WITH(UPDLOCK,HOLDLOCK) ON p.Id=i.ProductId
      JOIN dbo.Category c WITH(HOLDLOCK) ON c.Id=p.CategoryId
      JOIN dbo.Brand b WITH(HOLDLOCK) ON b.Id=p.BrandId
      WHERE p.IsPublished=1 AND p.ArchivedAt IS NULL AND p.IsAvailableForOrder=1
        AND p.PriceMode='fixed' AND p.Price IS NOT NULL AND c.IsActive=1 AND b.IsActive=1;
      IF (SELECT COUNT(*) FROM #Priced)<>(SELECT COUNT(*) FROM @Items)
          THROW 51107, 'Unknown, unavailable, archived or quote-only product.', 1;
      DECLARE @Subtotal decimal(18,0)=(SELECT SUM(Price*Quantity) FROM #Priced);
      DECLARE @OrderNumber bigint=NEXT VALUE FOR dbo.OrderNumber;
      SET @Id=NEWID();
      INSERT dbo.[Order](Id,OrderCode,CustomerId,IdempotencyKey,RequestHash,Currency,PreferredPaymentMethod,
        RecipientName,Phone,Email,AddressLine,Province,District,DeliveryNote,
        Subtotal,DiscountTotal,ShippingFee,Total,TaxIncludedAmount)
      VALUES(@Id,CONCAT('AURA-',@OrderNumber),@CustomerId,@IdempotencyKey,@Hash,'VND',@PreferredPaymentMethod,
        @RecipientName,@Phone,@Email,@AddressLine,@Province,@District,@DeliveryNote,
        @Subtotal,0,@ShippingFee,@Subtotal+@ShippingFee,NULL);
      INSERT dbo.OrderItem(OrderId,ProductId,LineNumber,ProductName,Sku,Specification,UnitLabel,
        UnitPrice,Quantity,DiscountAmount,TaxIncludedAmount)
      SELECT @Id,Id,ROW_NUMBER() OVER(ORDER BY Id),Name,Sku,
          NULLIF(CONCAT_WS(N' · ',Warranty,Boiler,PowerLabel,Voltage,Origin,RoastProfile),N''),
          UnitSize,Price,Quantity,0,NULL FROM #Priced;
      UPDATE dbo.[Order] SET SubmittedAt=SYSUTCDATETIME() WHERE Id=@Id;
      INSERT dbo.OrderEvent(OrderId,Sequence,Status,ActorId,Note) VALUES(@Id,1,'submitted',@CustomerId,NULL);
      COMMIT;
      SELECT Id,OrderCode,Total,SubmittedAt FROM dbo.[Order] WHERE Id=@Id;
    END TRY
    BEGIN CATCH
      IF XACT_STATE()<>0 ROLLBACK;
      THROW;
    END CATCH;
END;
GO
CREATE OR ALTER PROCEDURE dbo.AppendOrderEvent
 @OrderId uniqueidentifier,@ActorId uniqueidentifier,@ExpectedSequence int,@Status varchar(20),@Note nvarchar(1000)
AS
BEGIN
 SET NOCOUNT ON; SET XACT_ABORT ON;
 IF @@TRANCOUNT<>0 THROW 51100, 'Call command without an ambient transaction.', 1;
 BEGIN TRY
  BEGIN TRAN;
  DECLARE @Locked uniqueidentifier,@Sequence int;
  SELECT @Locked=Id FROM dbo.[Order] WITH(UPDLOCK,HOLDLOCK) WHERE Id=@OrderId AND SubmittedAt IS NOT NULL;
  IF @Locked IS NULL THROW 51110, 'Submitted order not found.', 1;
  SELECT @Sequence=MAX(Sequence) FROM dbo.OrderEvent WHERE OrderId=@OrderId;
  IF @Sequence IS NULL OR @Sequence<>@ExpectedSequence THROW 51111, 'Order state changed; refresh before transition.', 1;
  IF NOT EXISTS(SELECT 1 FROM dbo.AppUser WHERE Id=@ActorId AND DisabledAt IS NULL)
      THROW 51112, 'Active actor required.', 1;
  INSERT dbo.OrderEvent(OrderId,Sequence,Status,ActorId,Note)
   VALUES(@OrderId,@Sequence+1,@Status,@ActorId,@Note);
  COMMIT;
 END TRY
 BEGIN CATCH
  IF XACT_STATE()<>0 ROLLBACK;
  THROW;
 END CATCH;
END;
GO
CREATE OR ALTER PROCEDURE dbo.CreatePaymentAttempt
 @OrderId uniqueidentifier,@RequestedById uniqueidentifier,@IdempotencyKey uniqueidentifier,
 @Method varchar(12),@RequestedAmount decimal(18,0),@TransferReference varchar(100),
 @DestinationSnapshot nvarchar(1000),@ExpiresAt datetime2(3)
AS
BEGIN
 SET NOCOUNT ON; SET XACT_ABORT ON;
 IF @@TRANCOUNT<>0 THROW 51100, 'Call command without an ambient transaction.', 1;
 BEGIN TRY
  BEGIN TRAN;
  DECLARE @Locked uniqueidentifier,@Id uniqueidentifier;
  SELECT @Locked=Id FROM dbo.[Order] WITH(UPDLOCK,HOLDLOCK) WHERE Id=@OrderId AND SubmittedAt IS NOT NULL;
  IF @Locked IS NULL THROW 51120, 'Submitted order not found.', 1;
  SELECT @Id=Id FROM dbo.PaymentAttempt WHERE OrderId=@OrderId AND IdempotencyKey=@IdempotencyKey;
  IF @Id IS NOT NULL
  BEGIN
   IF EXISTS(SELECT @RequestedById,@Method,@RequestedAmount,@TransferReference,@DestinationSnapshot,@ExpiresAt
       EXCEPT SELECT RequestedById,Method,RequestedAmount,TransferReference,DestinationSnapshot,ExpiresAt
       FROM dbo.PaymentAttempt WHERE Id=@Id)
      THROW 51121, 'Payment attempt idempotency conflict.', 1;
   COMMIT; SELECT * FROM dbo.PaymentAttempt WHERE Id=@Id; RETURN;
  END;
  IF NOT EXISTS(SELECT 1 FROM dbo.AppUser WHERE Id=@RequestedById AND DisabledAt IS NULL)
      THROW 51112, 'Active actor required.', 1;
  SET @Id=NEWID();
  INSERT dbo.PaymentAttempt(Id,OrderId,RequestedById,IdempotencyKey,Method,RequestedAmount,TransferReference,DestinationSnapshot,ExpiresAt)
  VALUES(@Id,@OrderId,@RequestedById,@IdempotencyKey,@Method,@RequestedAmount,@TransferReference,@DestinationSnapshot,@ExpiresAt);
  COMMIT; SELECT * FROM dbo.PaymentAttempt WHERE Id=@Id;
 END TRY
 BEGIN CATCH
  IF XACT_STATE()<>0 ROLLBACK;
  THROW;
 END CATCH;
END;
GO
CREATE OR ALTER PROCEDURE dbo.RecordPaymentEntry
 @OrderId uniqueidentifier,@PaymentAttemptId uniqueidentifier,@RecordedById uniqueidentifier,
 @IdempotencyKey uniqueidentifier,@Kind varchar(12),@Amount decimal(18,0),
 @ExternalSource varchar(80),@ExternalReference varchar(160),@OccurredAt datetime2(3),
 @ReversesEntryId uniqueidentifier,@Reason nvarchar(1000)
AS
BEGIN
 SET NOCOUNT ON; SET XACT_ABORT ON;
 IF @@TRANCOUNT<>0 THROW 51100, 'Call command without an ambient transaction.', 1;
 BEGIN TRY
  BEGIN TRAN;
  DECLARE @Locked uniqueidentifier,@Id uniqueidentifier,@Result int;
  -- Same idempotency key cannot race across two different orders.
  DECLARE @Resource nvarchar(255)=CONCAT('payment:',@IdempotencyKey);
  EXEC @Result=sys.sp_getapplock @Resource=@Resource,@LockMode='Exclusive',@LockOwner='Transaction',@LockTimeout=10000;
  IF @Result<0 THROW 51104, 'Could not acquire idempotency lock.', 1;
  SELECT @Locked=Id FROM dbo.[Order] WITH(UPDLOCK,HOLDLOCK) WHERE Id=@OrderId AND SubmittedAt IS NOT NULL;
  IF @Locked IS NULL THROW 51130, 'Submitted order not found.', 1;
  SELECT @Id=Id FROM dbo.PaymentEntry WHERE IdempotencyKey=@IdempotencyKey;
  IF @Id IS NOT NULL
  BEGIN
   IF EXISTS(SELECT @OrderId,@PaymentAttemptId,@RecordedById,@Kind,@Amount,@ExternalSource,@ExternalReference,@OccurredAt,@ReversesEntryId,@Reason
       EXCEPT SELECT OrderId,PaymentAttemptId,RecordedById,Kind,Amount,ExternalSource,ExternalReference,OccurredAt,ReversesEntryId,Reason
       FROM dbo.PaymentEntry WHERE Id=@Id)
       THROW 51131, 'Payment entry idempotency conflict.', 1;
   COMMIT; SELECT * FROM dbo.PaymentEntry WHERE Id=@Id; RETURN;
  END;
  IF NOT EXISTS(SELECT 1 FROM dbo.AppUser WHERE Id=@RecordedById AND DisabledAt IS NULL)
      THROW 51112, 'Active reconciliation actor required.', 1;
  SET @Id=NEWID();
  INSERT dbo.PaymentEntry(Id,OrderId,PaymentAttemptId,RecordedById,IdempotencyKey,Kind,Amount,
     ExternalSource,ExternalReference,OccurredAt,ReversesEntryId,Reason)
  VALUES(@Id,@OrderId,@PaymentAttemptId,@RecordedById,@IdempotencyKey,@Kind,@Amount,
     @ExternalSource,@ExternalReference,@OccurredAt,@ReversesEntryId,@Reason);
  COMMIT; SELECT * FROM dbo.PaymentEntry WHERE Id=@Id;
 END TRY
 BEGIN CATCH
  IF XACT_STATE()<>0 ROLLBACK;
  THROW;
 END CATCH;
END;
GO
CREATE OR ALTER PROCEDURE dbo.AppendPaymentAttemptEvent
 @PaymentAttemptId uniqueidentifier,@ActorId uniqueidentifier,@EventType varchar(24),@Note nvarchar(1000)
AS
BEGIN
 SET NOCOUNT ON; SET XACT_ABORT ON;
 IF NOT EXISTS(SELECT 1 FROM dbo.AppUser WHERE Id=@ActorId AND DisabledAt IS NULL)
    THROW 51112, 'Active actor required.', 1;
 INSERT dbo.PaymentAttemptEvent(PaymentAttemptId,ActorId,EventType,Note)
 VALUES(@PaymentAttemptId,@ActorId,@EventType,@Note);
END;
GO
GRANT EXECUTE ON dbo.CreateOrder TO aura_runtime;
GRANT EXECUTE ON dbo.AppendOrderEvent TO aura_runtime;
GRANT EXECUTE ON dbo.CreatePaymentAttempt TO aura_runtime;
GRANT EXECUTE ON dbo.RecordPaymentEntry TO aura_runtime;
GRANT EXECUTE ON dbo.AppendPaymentAttemptEvent TO aura_runtime;
GO


-- ===== 004_reference_data.sql =====

-- Lookup codes only. No invented products/prices or silent legacy ID mappings.
SET XACT_ABORT ON;
BEGIN TRAN;
INSERT dbo.Category(Code,Name,Domain,DisplayOrder)
SELECT v.Code,v.Name,v.Domain,v.DisplayOrder
FROM (VALUES
 ('espresso-machines',N'Máy pha cà phê','equipment',10),
 ('coffee-grinders',N'Máy xay cà phê','equipment',20),
 ('coffee-roasters',N'Máy rang cà phê','equipment',30),
 ('barista-gear',N'Dụng cụ barista','equipment',40),
 ('accessories',N'Phụ kiện và bảo dưỡng','equipment',50),
 ('coffee-beans',N'Hạt cà phê','ingredients',10),
 ('syrups',N'Siro','ingredients',20),
 ('sauces',N'Sốt','ingredients',30),
 ('powders',N'Bột pha chế','ingredients',40),
 ('matcha',N'Matcha và Houjicha','ingredients',50),
 ('chocolate',N'Socola và cacao','ingredients',60),
 ('tea',N'Trà','ingredients',70),
 ('other',N'Nguyên liệu khác','ingredients',80)
) v(Code,Name,Domain,DisplayOrder)
WHERE NOT EXISTS(SELECT 1 FROM dbo.Category c WITH(UPDLOCK,HOLDLOCK) WHERE c.Code=v.Code);
INSERT dbo.UseCase(Code,Name,Description,DisplayOrder)
SELECT v.Code,v.Name,v.Description,v.DisplayOrder
FROM (VALUES
 ('home',N'Gia đình',N'Nhu cầu sử dụng tại nhà',10),
 ('small-cafe',N'Quán nhỏ',N'Phân loại do người quản lý danh mục xác nhận; không tự suy ra từ giá',20),
 ('boutique-cafe',N'Quán boutique / specialty',N'Giữ code suitableFor hiện có',30),
 ('high-volume',N'Quán đông khách / chuỗi',N'Nhu cầu phục vụ lớn',40),
 ('roastery',N'Xưởng rang',N'Ứng dụng trong xưởng rang',50),
 ('lab',N'Phòng thử nghiệm / đào tạo',N'Cupping, thử nghiệm và đào tạo',60)
) v(Code,Name,Description,DisplayOrder)
WHERE NOT EXISTS(SELECT 1 FROM dbo.UseCase u WITH(UPDLOCK,HOLDLOCK) WHERE u.Code=v.Code);
COMMIT;
GO

