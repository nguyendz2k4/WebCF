-- Additive SQL Server schema change. Review and run against the intended database.
-- Does not delete or alter existing business data. Run before enabling banner endpoints.
SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF OBJECT_ID(N'dbo.Banners', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Banners (
        Id uniqueidentifier NOT NULL CONSTRAINT PK_Banners PRIMARY KEY,
        Title nvarchar(200) NOT NULL,
        ImageUrl nvarchar(2048) NOT NULL,
        LinkUrl nvarchar(2048) NULL,
        AltText nvarchar(300) NOT NULL,
        DisplayOrder int NOT NULL,
        CreatedAt datetime2 NOT NULL,
        PublishedAt datetime2 NULL,
        ArchivedAt datetime2 NULL,
        Version rowversion NOT NULL
    );
    CREATE INDEX IX_Banners_ArchivedAt_PublishedAt_DisplayOrder
        ON dbo.Banners (ArchivedAt, PublishedAt, DisplayOrder);
END;
COMMIT TRANSACTION;
