using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class updatePost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "PostDate",
                schema: "identity",
                table: "Posts",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "PostTime",
                schema: "identity",
                table: "Posts",
                type: "time without time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Private",
                schema: "identity",
                table: "Posts",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RequestedSub",
                schema: "identity",
                table: "Posts",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PostDate",
                schema: "identity",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "PostTime",
                schema: "identity",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "Private",
                schema: "identity",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "RequestedSub",
                schema: "identity",
                table: "Posts");
        }
    }
}
