using ATSRecruitSys.Server.Services;
using ATSRecruitSys.Server.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ATSRecruitSys.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditController : BaseApiController
    {
        private readonly IAuditService _auditService;

        public AuditController(IAuditService auditService, ILogger<AuditController> logger) : base(logger)
        {
            _auditService = auditService;
        }

        /// <summary>
        /// Get audit logs with pagination and filtering (Admin only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PaginatedResponse<AuditLogDto>>> GetAuditLogs(
            [FromQuery] int page = 0,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? entityType = null,
            [FromQuery] string? userId = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                if (pageSize <= 0 || pageSize > 100) pageSize = 20;

                var auditLogs = await _auditService.GetAuditLogsAsync(page, pageSize, entityType, userId, fromDate, toDate);
                var totalCount = await _auditService.GetTotalAuditLogsCountAsync(entityType, userId, fromDate, toDate);

                var response = new PaginatedResponse<AuditLogDto>
                {
                    Items = auditLogs,
                    TotalCount = totalCount,
                    PageIndex = page,
                    PageSize = pageSize
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "Error retrieving audit logs");
            }
        }

        /// <summary>
        /// Get audit log statistics (Admin only)
        /// </summary>
        [HttpGet("stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AuditStatsDto>> GetAuditStats()
        {
            try
            {
                var totalLogs = await _auditService.GetTotalAuditLogsCountAsync();
                var last24Hours = await _auditService.GetTotalAuditLogsCountAsync(
                    fromDate: DateTime.UtcNow.AddDays(-1));
                var lastWeek = await _auditService.GetTotalAuditLogsCountAsync(
                    fromDate: DateTime.UtcNow.AddDays(-7));

                var stats = new AuditStatsDto
                {
                    TotalLogs = totalLogs,
                    LogsLast24Hours = last24Hours,
                    LogsLastWeek = lastWeek
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "Error retrieving audit statistics");
            }
        }
    }

    public class AuditStatsDto
    {
        public int TotalLogs { get; set; }
        public int LogsLast24Hours { get; set; }
        public int LogsLastWeek { get; set; }
    }
}