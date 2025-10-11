using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ATSRecruitSys.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixJobApplicationNavigation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobApplications_Jobs_JobId1",
                table: "JobApplications");

            migrationBuilder.DropIndex(
                name: "IX_JobApplications_JobId1",
                table: "JobApplications");

            migrationBuilder.DropColumn(
                name: "JobId1",
                table: "JobApplications");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "JobId1",
                table: "JobApplications",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobApplications_JobId1",
                table: "JobApplications",
                column: "JobId1");

            migrationBuilder.AddForeignKey(
                name: "FK_JobApplications_Jobs_JobId1",
                table: "JobApplications",
                column: "JobId1",
                principalTable: "Jobs",
                principalColumn: "Id");
        }
    }
}
