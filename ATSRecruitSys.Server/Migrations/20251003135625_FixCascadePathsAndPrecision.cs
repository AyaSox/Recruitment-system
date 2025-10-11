using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ATSRecruitSys.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixCascadePathsAndPrecision : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationNotes_AspNetUsers_AuthorId",
                table: "ApplicationNotes");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationNotes_JobApplications_JobApplicationId",
                table: "ApplicationNotes");

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "ApplicationNotes",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationNotes_ApplicationUserId",
                table: "ApplicationNotes",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationNotes_AspNetUsers_ApplicationUserId",
                table: "ApplicationNotes",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationNotes_AspNetUsers_AuthorId",
                table: "ApplicationNotes",
                column: "AuthorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationNotes_JobApplications_JobApplicationId",
                table: "ApplicationNotes",
                column: "JobApplicationId",
                principalTable: "JobApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationNotes_AspNetUsers_ApplicationUserId",
                table: "ApplicationNotes");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationNotes_AspNetUsers_AuthorId",
                table: "ApplicationNotes");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationNotes_JobApplications_JobApplicationId",
                table: "ApplicationNotes");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationNotes_ApplicationUserId",
                table: "ApplicationNotes");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "ApplicationNotes");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationNotes_AspNetUsers_AuthorId",
                table: "ApplicationNotes",
                column: "AuthorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationNotes_JobApplications_JobApplicationId",
                table: "ApplicationNotes",
                column: "JobApplicationId",
                principalTable: "JobApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
