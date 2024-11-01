using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class remove_school_from_post : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Schools_SchoolId",
                schema: "identity",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_SchoolId",
                schema: "identity",
                table: "Posts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Posts_SchoolId",
                schema: "identity",
                table: "Posts",
                column: "SchoolId");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Schools_SchoolId",
                schema: "identity",
                table: "Posts",
                column: "SchoolId",
                principalSchema: "identity",
                principalTable: "Schools",
                principalColumn: "Id");
        }
    }
}
