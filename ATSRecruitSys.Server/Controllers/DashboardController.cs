using ATSRecruitSys.Server.DTOs;
using ATSRecruitSys.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ATSRecruitSys.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Recruiter,HiringManager")]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _dashboardService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(DashboardService dashboardService, ILogger<DashboardController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        /// <summary>
        /// Get dashboard statistics summary
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
        {
            try
            {
                var stats = await _dashboardService.GetDashboardStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard statistics");
                return StatusCode(500, "An error occurred while retrieving dashboard statistics.");
            }
        }

        /// <summary>
        /// Get top performing jobs by application count
        /// </summary>
        [HttpGet("top-jobs")]
        public async Task<ActionResult<List<JobPerformanceDto>>> GetTopPerformingJobs([FromQuery] int count = 5)
        {
            try
            {
                var jobs = await _dashboardService.GetTopPerformingJobsAsync(count);
                return Ok(jobs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving top performing jobs");
                return StatusCode(500, "An error occurred while retrieving top performing jobs.");
            }
        }

        /// <summary>
        /// Get application status distribution
        /// </summary>
        [HttpGet("application-distribution")]
        public async Task<ActionResult<ApplicationStatusDistributionDto>> GetApplicationStatusDistribution()
        {
            try
            {
                var distribution = await _dashboardService.GetApplicationStatusDistributionAsync();
                return Ok(distribution);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving application status distribution");
                return StatusCode(500, "An error occurred while retrieving application status distribution.");
            }
        }

        /// <summary>
        /// Get recent activity feed
        /// </summary>
        [HttpGet("recent-activity")]
        public async Task<ActionResult<List<RecentActivityDto>>> GetRecentActivity([FromQuery] int count = 10)
        {
            try
            {
                var activities = await _dashboardService.GetRecentActivityAsync(count);
                return Ok(activities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent activity");
                return StatusCode(500, "An error occurred while retrieving recent activity.");
            }
        }

        /// <summary>
        /// Get department analytics including jobs and applications by department
        /// </summary>
        [HttpGet("department-analytics")]
        public async Task<ActionResult<DepartmentAnalyticsDto>> GetDepartmentAnalytics()
        {
            try
            {
                var analytics = await _dashboardService.GetDepartmentAnalyticsAsync();
                return Ok(analytics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving department analytics");
                return StatusCode(500, "An error occurred while retrieving department analytics.");
            }
        }

        /// <summary>
        /// Get employment type statistics
        /// </summary>
        [HttpGet("employment-type-stats")]
        public async Task<ActionResult<List<EmploymentTypeStatsDto>>> GetEmploymentTypeStats()
        {
            try
            {
                var stats = await _dashboardService.GetEmploymentTypeStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving employment type statistics");
                return StatusCode(500, "An error occurred while retrieving employment type statistics.");
            }
        }

        /// <summary>
        /// Get experience level statistics
        /// </summary>
        [HttpGet("experience-level-stats")]
        public async Task<ActionResult<List<ExperienceLevelStatsDto>>> GetExperienceLevelStats()
        {
            try
            {
                var stats = await _dashboardService.GetExperienceLevelStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving experience level statistics");
                return StatusCode(500, "An error occurred while retrieving experience level statistics.");
            }
        }
    }
}