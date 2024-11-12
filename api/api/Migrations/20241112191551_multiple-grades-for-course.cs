using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class multiplegradesforcourse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "grade",
                schema: "identity",
                table: "SecondarySchoolCourses");

            migrationBuilder.DropColumn(
                name: "grade",
                schema: "identity",
                table: "PrimarySchoolCourses");

            migrationBuilder.AddColumn<int[]>(
                name: "grades",
                schema: "identity",
                table: "SecondarySchoolCourses",
                type: "integer[]",
                nullable: false,
                defaultValue: new int[0]);

            migrationBuilder.AddColumn<int[]>(
                name: "grades",
                schema: "identity",
                table: "PrimarySchoolCourses",
                type: "integer[]",
                nullable: false,
                defaultValue: new int[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "grades",
                schema: "identity",
                table: "SecondarySchoolCourses");

            migrationBuilder.DropColumn(
                name: "grades",
                schema: "identity",
                table: "PrimarySchoolCourses");

            migrationBuilder.AddColumn<int>(
                name: "grade",
                schema: "identity",
                table: "SecondarySchoolCourses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "grade",
                schema: "identity",
                table: "PrimarySchoolCourses",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
