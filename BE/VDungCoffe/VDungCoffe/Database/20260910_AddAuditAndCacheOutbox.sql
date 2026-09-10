-- Apply to the existing AuraCoffee database AFTER its base schema/Identity upgrade.
-- Additive deployment script; application startup deliberately does not execute DDL.
SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF OBJECT_ID(N'dbo.AuditLog', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.AuditLog (
        Id uniqueidentifier NOT NULL CONSTRAINT PK_AuditLog PRIMARY KEY,
        UserId uniqueidentifier NULL,
        UserEmail nvarchar(256) NULL,
        Action nvarchar(50) NOT NULL,
        EntityType nvarchar(50) NOT NULL,
        EntityId nvarchar(100) NOT NULL,
        OldValuesJson nvarchar(max) NULL,
        NewValuesJson nvarchar(max) NULL,
        IpAddress nvarchar(50) NULL,
        CreatedAt datetime2(3) NOT NULL DEFAULT SYSUTCDATETIME()
    );
    CREATE INDEX IX_AuditLog_CreatedAt ON dbo.AuditLog(CreatedAt DESC);
    CREATE INDEX IX_AuditLog_Entity ON dbo.AuditLog(EntityType, EntityId);
END;
IF OBJECT_ID(N'dbo.CacheInvalidation', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CacheInvalidation (
        Id uniqueidentifier NOT NULL CONSTRAINT PK_CacheInvalidation PRIMARY KEY,
        CreatedAt datetime2 NOT NULL,
        CompletedAt datetime2 NULL,
        Attempts int NOT NULL,
        NextAttemptAt datetime2 NOT NULL
    );
    CREATE INDEX IX_CacheInvalidation_CompletedAt_NextAttemptAt ON dbo.CacheInvalidation(CompletedAt, NextAttemptAt);
END;
IF OBJECT_ID(N'dbo.CheckoutQuoteUse', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CheckoutQuoteUse (
        QuoteId varchar(32) NOT NULL CONSTRAINT PK_CheckoutQuoteUse PRIMARY KEY,
        OrderId uniqueidentifier NOT NULL CONSTRAINT FK_CheckoutQuoteUse_Order REFERENCES dbo.[Order](Id)
    );
END;
COMMIT;
