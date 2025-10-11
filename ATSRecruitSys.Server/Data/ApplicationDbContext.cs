using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ATSRecruitSys.Server.Models;

namespace ATSRecruitSys.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Job> Jobs { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Job configuration
            modelBuilder.Entity<Job>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Department).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Location).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.EmploymentType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.ExperienceLevel).IsRequired().HasMaxLength(50);
                entity.Property(e => e.CreatedById).IsRequired();

                // Configure decimal precision for salary fields
                entity.Property(e => e.SalaryRangeMin)
                    .HasPrecision(18, 2); // 18 digits total, 2 decimal places

                entity.Property(e => e.SalaryRangeMax)
                    .HasPrecision(18, 2); // 18 digits total, 2 decimal places

                entity.HasOne(e => e.CreatedBy)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict);

                // Configure the JobApplications navigation property
                entity.HasMany(e => e.JobApplications)
                    .WithOne(a => a.Job)
                    .HasForeignKey(a => a.JobId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // JobApplication configuration
            modelBuilder.Entity<JobApplication>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
                entity.Property(e => e.ApplicantId).IsRequired();
                entity.Property(e => e.JobId).IsRequired();

                entity.HasOne(e => e.Job)
                    .WithMany(j => j.JobApplications)
                    .HasForeignKey(e => e.JobId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Applicant)
                    .WithMany()
                    .HasForeignKey(e => e.ApplicantId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // AuditLog configuration
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UserId).IsRequired().HasMaxLength(450);
                entity.Property(e => e.UserName).IsRequired().HasMaxLength(256);
                entity.Property(e => e.UserEmail).IsRequired().HasMaxLength(256);
                entity.Property(e => e.Action).IsRequired().HasMaxLength(50);
                entity.Property(e => e.EntityType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.EntityId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.IPAddress).HasMaxLength(45);
                entity.Property(e => e.UserAgent).HasMaxLength(500);

                // Index for performance
                entity.HasIndex(e => e.Timestamp);
                entity.HasIndex(e => e.EntityType);
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => new { e.EntityType, e.EntityId });
            });
        }
    }
}