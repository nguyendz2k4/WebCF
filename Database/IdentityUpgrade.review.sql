IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF OBJECT_ID(N'[dbo].[AppUser]', N'U') IS NULL
    THROW 51000, 'Expected the existing AuraCoffee schema. AppUser is missing.', 1;
IF COL_LENGTH(N'dbo.AppUser', N'UserName') IS NOT NULL
    OR OBJECT_ID(N'[dbo].[AspNetRoles]', N'U') IS NOT NULL
    THROW 51001, 'Identity schema already exists or was partially applied. Review migration history first.', 1;

DROP INDEX [IX_AppUser_IdentityIssuer_IdentitySubject] ON [AppUser];

DECLARE @var sysname;
SELECT @var = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AppUser]') AND [c].[name] = N'IdentityIssuer');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [AppUser] DROP CONSTRAINT [' + @var + '];');
ALTER TABLE [AppUser] ALTER COLUMN [IdentityIssuer] varchar(100) COLLATE Latin1_General_100_BIN2 NULL;

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AppUser]') AND [c].[name] = N'IdentitySubject');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [AppUser] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [AppUser] ALTER COLUMN [IdentitySubject] varchar(200) COLLATE Latin1_General_100_BIN2 NULL;

ALTER TABLE [AppUser] ADD [Address] nvarchar(500) NULL;

ALTER TABLE [AppUser] ADD [CustomerGroup] varchar(20) NULL;

ALTER TABLE [AppUser] ADD [UserName] nvarchar(256) NULL;

ALTER TABLE [AppUser] ADD [NormalizedUserName] nvarchar(256) NULL;

ALTER TABLE [AppUser] ADD [NormalizedEmail] nvarchar(256) NULL;

ALTER TABLE [AppUser] ADD [EmailConfirmed] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [AppUser] ADD [PasswordHash] nvarchar(max) NULL;

ALTER TABLE [AppUser] ADD [SecurityStamp] nvarchar(max) NULL;

ALTER TABLE [AppUser] ADD [ConcurrencyStamp] nvarchar(max) NULL;

ALTER TABLE [AppUser] ADD [PhoneNumberConfirmed] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [AppUser] ADD [TwoFactorEnabled] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [AppUser] ADD [LockoutEnd] datetimeoffset NULL;

ALTER TABLE [AppUser] ADD [LockoutEnabled] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [AppUser] ADD [AccessFailedCount] int NOT NULL DEFAULT 0;

CREATE TABLE [AspNetRoles] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] uniqueidentifier NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AppUser_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUser] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AppUser_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUser] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserTokens] (
    [UserId] uniqueidentifier NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AppUser_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUser] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] uniqueidentifier NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserRoles] (
    [UserId] uniqueidentifier NOT NULL,
    [RoleId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AppUser_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUser] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [EmailIndex] ON [AppUser] ([NormalizedEmail]);

CREATE UNIQUE INDEX [IX_AppUser_IdentityIssuer_IdentitySubject] ON [AppUser] ([IdentityIssuer], [IdentitySubject]) WHERE [IdentityIssuer] IS NOT NULL AND [IdentitySubject] IS NOT NULL;

CREATE UNIQUE INDEX [UserNameIndex] ON [AppUser] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260909083317_AddIdentityTables', N'9.0.20');

COMMIT;
GO

