using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class Remove_StartAndEndDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDateOfAbsence",
                schema: "identity",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "StartDateOfAbsence",
                schema: "identity",
                table: "Posts",
                newName: "DateOfAbsence");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DateOfAbsence",
                schema: "identity",
                table: "Posts",
                newName: "StartDateOfAbsence");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDateOfAbsence",
                schema: "identity",
                table: "Posts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
