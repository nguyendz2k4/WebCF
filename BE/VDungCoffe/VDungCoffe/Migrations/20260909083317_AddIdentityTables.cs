using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VDungCoffe.Migrations
{
    /// <summary>
    /// Upgrades the existing schema from Database/AuraCoffee.sql.
    /// This migration does not bootstrap an empty database.
    /// </summary>
    public partial class AddIdentityTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                IF OBJECT_ID(N'[dbo].[AppUser]', N'U') IS NULL
                    THROW 51000, 'Expected the existing AuraCoffee schema. AppUser is missing.', 1;
                IF COL_LENGTH(N'dbo.AppUser', N'UserName') IS NOT NULL
                    OR OBJECT_ID(N'[dbo].[AspNetRoles]', N'U') IS NOT NULL
                    THROW 51001, 'Identity schema already exists or was partially applied. Review migration history first.', 1;
                """);

            migrationBuilder.DropIndex(
                name: "IX_AppUser_IdentityIssuer_IdentitySubject",
                table: "AppUser");
            migrationBuilder.AlterColumn<string>(
                name: "IdentityIssuer", table: "AppUser",
                type: "varchar(100)", unicode: false, maxLength: 100, nullable: true,
                collation: "Latin1_General_100_BIN2",
                oldClrType: typeof(string), oldType: "varchar(100)",
                oldUnicode: false, oldMaxLength: 100,
                oldCollation: "Latin1_General_100_BIN2");

            migrationBuilder.AlterColumn<string>(
                name: "IdentitySubject", table: "AppUser",
                type: "varchar(200)", unicode: false, maxLength: 200, nullable: true,
                collation: "Latin1_General_100_BIN2",
                oldClrType: typeof(string), oldType: "varchar(200)",
                oldUnicode: false, oldMaxLength: 200,
                oldCollation: "Latin1_General_100_BIN2");
            migrationBuilder.AddColumn<string>(
                name: "Address", table: "AppUser",
                type: "nvarchar(500)", maxLength: 500, nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomerGroup", table: "AppUser",
                type: "varchar(20)", unicode: false, maxLength: 20, nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserName", table: "AppUser",
                type: "nvarchar(256)", maxLength: 256, nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NormalizedUserName", table: "AppUser",
                type: "nvarchar(256)", maxLength: 256, nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NormalizedEmail", table: "AppUser",
                type: "nvarchar(256)", maxLength: 256, nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EmailConfirmed", table: "AppUser",
                type: "bit", nullable: false, defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash", table: "AppUser",
                type: "nvarchar(max)", nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecurityStamp", table: "AppUser",
                type: "nvarchar(max)", nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp", table: "AppUser",
                type: "nvarchar(max)", nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "PhoneNumberConfirmed", table: "AppUser",
                type: "bit", nullable: false, defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "TwoFactorEnabled", table: "AppUser",
                type: "bit", nullable: false, defaultValue: false);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LockoutEnd", table: "AppUser",
                type: "datetimeoffset", nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "LockoutEnabled", table: "AppUser",
                type: "bit", nullable: false, defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "AccessFailedCount", table: "AppUser",
                type: "int", nullable: false, defaultValue: 0);
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AppUser_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AppUser_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AppUser_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AppUser_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AppUser",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "IX_AppUser_IdentityIssuer_IdentitySubject",
                table: "AppUser",
                columns: new[] { "IdentityIssuer", "IdentitySubject" },
                unique: true,
                filter: "[IdentityIssuer] IS NOT NULL AND [IdentitySubject] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AppUser",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Do not invent legacy identifiers for accounts created after the upgrade.
            migrationBuilder.Sql("""
                IF EXISTS (SELECT 1 FROM [dbo].[AppUser]
                    WHERE [IdentityIssuer] IS NULL OR [IdentitySubject] IS NULL)
                    THROW 51002, 'Cannot roll back: some users have no legacy identifiers. Resolve these accounts before rollback.', 1;
                """);
            migrationBuilder.DropTable(name: "AspNetRoleClaims");
            migrationBuilder.DropTable(name: "AspNetUserClaims");
            migrationBuilder.DropTable(name: "AspNetUserLogins");
            migrationBuilder.DropTable(name: "AspNetUserRoles");
            migrationBuilder.DropTable(name: "AspNetUserTokens");
            migrationBuilder.DropTable(name: "AspNetRoles");

            migrationBuilder.DropIndex(name: "EmailIndex", table: "AppUser");
            migrationBuilder.DropIndex(name: "UserNameIndex", table: "AppUser");
            migrationBuilder.DropIndex(name: "IX_AppUser_IdentityIssuer_IdentitySubject", table: "AppUser");

            migrationBuilder.DropColumn(name: "Address", table: "AppUser");
            migrationBuilder.DropColumn(name: "CustomerGroup", table: "AppUser");
            migrationBuilder.DropColumn(name: "UserName", table: "AppUser");
            migrationBuilder.DropColumn(name: "NormalizedUserName", table: "AppUser");
            migrationBuilder.DropColumn(name: "NormalizedEmail", table: "AppUser");
            migrationBuilder.DropColumn(name: "EmailConfirmed", table: "AppUser");
            migrationBuilder.DropColumn(name: "PasswordHash", table: "AppUser");
            migrationBuilder.DropColumn(name: "SecurityStamp", table: "AppUser");
            migrationBuilder.DropColumn(name: "ConcurrencyStamp", table: "AppUser");
            migrationBuilder.DropColumn(name: "PhoneNumberConfirmed", table: "AppUser");
            migrationBuilder.DropColumn(name: "TwoFactorEnabled", table: "AppUser");
            migrationBuilder.DropColumn(name: "LockoutEnd", table: "AppUser");
            migrationBuilder.DropColumn(name: "LockoutEnabled", table: "AppUser");
            migrationBuilder.DropColumn(name: "AccessFailedCount", table: "AppUser");

            migrationBuilder.AlterColumn<string>(
                name: "IdentityIssuer", table: "AppUser",
                type: "varchar(100)", unicode: false, maxLength: 100, nullable: false,
                collation: "Latin1_General_100_BIN2",
                oldClrType: typeof(string), oldType: "varchar(100)",
                oldUnicode: false, oldMaxLength: 100, oldNullable: true,
                oldCollation: "Latin1_General_100_BIN2");

            migrationBuilder.AlterColumn<string>(
                name: "IdentitySubject", table: "AppUser",
                type: "varchar(200)", unicode: false, maxLength: 200, nullable: false,
                collation: "Latin1_General_100_BIN2",
                oldClrType: typeof(string), oldType: "varchar(200)",
                oldUnicode: false, oldMaxLength: 200, oldNullable: true,
                oldCollation: "Latin1_General_100_BIN2");
            migrationBuilder.CreateIndex(
                name: "IX_AppUser_IdentityIssuer_IdentitySubject",
                table: "AppUser",
                columns: new[] { "IdentityIssuer", "IdentitySubject" },
                unique: true);
        }
    }
}