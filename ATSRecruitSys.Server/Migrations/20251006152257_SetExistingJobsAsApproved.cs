using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ATSRecruitSys.Server.Migrations
{
    /// <inheritdoc />
    public partial class SetExistingJobsAsApproved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Set all existing jobs as approved
            migrationBuilder.Sql("UPDATE Jobs SET IsApproved = 1 WHERE IsApproved = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Rollback - set all jobs as not approved
            migrationBuilder.Sql("UPDATE Jobs SET IsApproved = 0");
        }
    }
}
