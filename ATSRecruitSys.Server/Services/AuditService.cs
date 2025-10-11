using ATSRecruitSys.Server.Models;
using ATSRecruitSys.Server.Data;
using ATSRecruitSys.Server.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Security.Claims;

namespace ATSRecruitSys.Server.Services
{
    public interface IAuditService
    {
        Task LogAsync(string action, string entityType, string entityId, object? oldValues = null, object? newValues = null, string? details = null);
        Task<List<AuditLogDto>> GetAuditLogsAsync(int page, int pageSize, string? entityType = null, string? userId = null, DateTime? fromDate = null, DateTime? toDate = null);
        Task<int> GetTotalAuditLogsCountAsync(string? entityType = null, string? userId = null, DateTime? fromDate = null, DateTime? toDate = null);
    }

    public class AuditService : IAuditService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<AuditService> _logger;

        public AuditService(
            ApplicationDbContext context,
            IHttpContextAccessor httpContextAccessor,
            ILogger<AuditService> logger)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        public async Task LogAsync(string action, string entityType, string entityId, object? oldValues = null, object? newValues = null, string? details = null)
        {
            try
            {
                var httpContext = _httpContextAccessor.HttpContext;
                var user = httpContext?.User;

                // Extract user information from claims
                string userId = "System";
                string userName = "System";
                string userEmail = "system@ats.com";

                if (user?.Identity?.IsAuthenticated == true)
                {
                    // Try multiple claim types for user ID
                    userId = user.FindFirst("id")?.Value 
                        ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                        ?? user.FindFirst("sub")?.Value 
                        ?? "System";

                    // Try multiple claim types for user name
                    userName = user.FindFirst("name")?.Value 
                        ?? user.FindFirst(ClaimTypes.Name)?.Value 
                        ?? "System";

                    // Try multiple claim types for email
                    userEmail = user.FindFirst("email")?.Value 
                        ?? user.FindFirst(ClaimTypes.Email)?.Value 
                        ?? "system@ats.com";

                    _logger.LogDebug("Audit - User authenticated: ID={UserId}, Name={UserName}, Email={UserEmail}", 
                        userId, userName, userEmail);
                }
                else
                {
                    _logger.LogDebug("Audit - No authenticated user, using System");
                }

                var auditLog = new AuditLog
                {
                    UserId = userId,
                    UserName = userName,
                    UserEmail = userEmail,
                    Action = action,
                    EntityType = entityType,
                    EntityId = entityId,
                    OldValues = oldValues != null ? JsonSerializer.Serialize(oldValues) : string.Empty,
                    NewValues = newValues != null ? JsonSerializer.Serialize(newValues) : string.Empty,
                    IPAddress = GetClientIpAddress(),
                    UserAgent = httpContext?.Request.Headers["User-Agent"].ToString() ?? string.Empty,
                    Details = details ?? string.Empty,
                    Timestamp = DateTime.UtcNow
                };

                _context.AuditLogs.Add(auditLog);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Audit log created: {Action} on {EntityType} {EntityId} by {UserName}", 
                    action, entityType, entityId, userName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create audit log entry for {Action} on {EntityType} {EntityId}", 
                    action, entityType, entityId);
            }
        }

        public async Task<List<AuditLogDto>> GetAuditLogsAsync(int page, int pageSize, string? entityType = null, string? userId = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _context.AuditLogs.AsQueryable();

            if (!string.IsNullOrEmpty(entityType))
            {
                query = query.Where(a => a.EntityType == entityType);
            }

            if (!string.IsNullOrEmpty(userId))
            {
                query = query.Where(a => a.UserId == userId);
            }

            if (fromDate.HasValue)
            {
                query = query.Where(a => a.Timestamp >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(a => a.Timestamp <= toDate.Value);
            }

            var auditLogs = await query
                .OrderByDescending(a => a.Timestamp)
                .Skip(page * pageSize)
                .Take(pageSize)
                .Select(a => new AuditLogDto
                {
                    Id = a.Id,
                    UserId = a.UserId,
                    UserName = a.UserName,
                    UserEmail = a.UserEmail,
                    Action = a.Action,
                    EntityType = a.EntityType,
                    EntityId = a.EntityId,
                    OldValues = a.OldValues,
                    NewValues = a.NewValues,
                    Timestamp = a.Timestamp,
                    IPAddress = a.IPAddress,
                    UserAgent = a.UserAgent,
                    Details = a.Details
                })
                .ToListAsync();

            return auditLogs;
        }

        public async Task<int> GetTotalAuditLogsCountAsync(string? entityType = null, string? userId = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _context.AuditLogs.AsQueryable();

            if (!string.IsNullOrEmpty(entityType))
            {
                query = query.Where(a => a.EntityType == entityType);
            }

            if (!string.IsNullOrEmpty(userId))
            {
                query = query.Where(a => a.UserId == userId);
            }

            if (fromDate.HasValue)
            {
                query = query.Where(a => a.Timestamp >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(a => a.Timestamp <= toDate.Value);
            }

            return await query.CountAsync();
        }

        private string GetClientIpAddress()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                _logger.LogDebug("Audit - No HTTP context available for IP address");
                return "N/A";
            }

            // Try various headers for IP address (useful for proxies/load balancers)
            var ipAddress = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            
            if (string.IsNullOrEmpty(ipAddress))
            {
                ipAddress = httpContext.Request.Headers["X-Real-IP"].FirstOrDefault();
            }
            
            if (string.IsNullOrEmpty(ipAddress))
            {
                ipAddress = httpContext.Connection.RemoteIpAddress?.ToString();
            }

            // Handle IPv6 loopback and localhost
            if (!string.IsNullOrEmpty(ipAddress))
            {
                if (ipAddress == "::1" || ipAddress == "127.0.0.1")
                {
                    ipAddress = "localhost";
                }
                // Clean up IPv6 format
                else if (ipAddress.Contains("::ffff:"))
                {
                    ipAddress = ipAddress.Replace("::ffff:", "");
                }
            }

            var result = ipAddress ?? "Unknown";
            _logger.LogDebug("Audit - Client IP address: {IpAddress}", result);
            
            return result;
        }
    }
}