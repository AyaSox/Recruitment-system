using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ATSRecruitSys.Server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRequiredSkillsFromJobs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequiredSkills",
                table: "Jobs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RequiredSkills",
                table: "Jobs",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
