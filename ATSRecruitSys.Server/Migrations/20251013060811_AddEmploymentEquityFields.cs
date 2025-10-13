using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ATSRecruitSys.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddEmploymentEquityFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmploymentEquityNotes",
                table: "Jobs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsEmploymentEquityPosition",
                table: "Jobs",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmploymentEquityNotes",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "IsEmploymentEquityPosition",
                table: "Jobs");
        }
    }
}
