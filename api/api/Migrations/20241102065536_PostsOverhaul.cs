using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class PostsOverhaul : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PostDate",
                schema: "identity",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "PostTime",
                schema: "identity",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "RequestedSub",
                schema: "identity",
                table: "Posts",
                newName: "RequestedSubId");

            migrationBuilder.AddColumn<string>(
                name: "AcceptedByUserId",
                schema: "identity",
                table: "Posts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PostDateTime",
                schema: "identity",
                table: "Posts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Local));

            migrationBuilder.CreateIndex(
                name: "IX_Posts_AcceptedByUserId",
                schema: "identity",
                table: "Posts",
                column: "AcceptedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_PosterId",
                schema: "identity",
                table: "Posts",
                column: "PosterId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_RequestedSubId",
                schema: "identity",
                table: "Posts",
                column: "RequestedSubId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_SchoolId",
                schema: "identity",
                table: "Posts",
                column: "SchoolId");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_AspNetUsers_AcceptedByUserId",
                schema: "identity",
                table: "Posts",
                column: "AcceptedByUserId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_AspNetUsers_PosterId",
                schema: "identity",
                table: "Posts",
                column: "PosterId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_AspNetUsers_RequestedSubId",
                schema: "identity",
                table: "Posts",
                column: "RequestedSubId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Schools_SchoolId",
                schema: "identity",
                table: "Posts",
                column: "SchoolId",
                principalSchema: "identity",
                principalTable: "Schools",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_AspNetUsers_AcceptedByUserId",
                schema: "identity",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_AspNetUsers_PosterId",
                schema: "identity",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_AspNetUsers_RequestedSubId",
                schema: "identity",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Schools_SchoolId",
                schema: "identity",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_AcceptedByUserId",
                schema: "identity",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_PosterId",
                schema: "identity",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_RequestedSubId",
                schema: "identity",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_SchoolId",
                schema: "identity",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "AcceptedByUserId",
                schema: "identity",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "PostDateTime",
                schema: "identity",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "RequestedSubId",
                schema: "identity",
                table: "Posts",
                newName: "RequestedSub");

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
        }
    }
}
