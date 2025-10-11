using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ATSRecruitSys.Server.Controllers
{
    /// <summary>
    /// Base controller providing common functionality for all API controllers
    /// </summary>
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        protected ILogger Logger { get; }

        protected BaseApiController(ILogger logger)
        {
            Logger = logger;
        }

        /// <summary>
        /// Gets the current user's ID from the claims
        /// </summary>
        /// <returns>User ID or null if not found</returns>
        protected string? GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                Logger.LogWarning("User ID not found in claims for user {UserName}", User.Identity?.Name);
                return null;
            }
            return userId;
        }

        /// <summary>
        /// Gets the current user's email from the claims
        /// </summary>
        protected string? GetCurrentUserEmail()
        {
            return User.FindFirstValue(ClaimTypes.Email);
        }

        /// <summary>
        /// Gets the current user's name from the claims
        /// </summary>
        protected string? GetCurrentUserName()
        {
            return User.FindFirstValue(ClaimTypes.Name);
        }

        /// <summary>
        /// Checks if the current user is in a specific role
        /// </summary>
        protected bool IsInRole(string role)
        {
            return User.IsInRole(role);
        }

        /// <summary>
        /// Checks if the current user is in any of the specified roles
        /// </summary>
        protected bool IsInAnyRole(params string[] roles)
        {
            return roles.Any(role => User.IsInRole(role));
        }

        /// <summary>
        /// Handles exceptions by logging and returning appropriate status code
        /// </summary>
        protected ActionResult HandleException(Exception ex, string message)
        {
            Logger.LogError(ex, message);
            return StatusCode(500, $"{message} Please try again later.");
        }

        /// <summary>
        /// Returns a standardized not found response
        /// </summary>
        protected ActionResult NotFoundResponse(string message)
        {
            return NotFound(new { error = message });
        }

        /// <summary>
        /// Returns a standardized bad request response
        /// </summary>
        protected ActionResult BadRequestResponse(string message)
        {
            return BadRequest(new { error = message });
        }

        /// <summary>
        /// Returns a standardized unauthorized response
        /// </summary>
        protected ActionResult UnauthorizedResponse(string? message = null)
        {
            return Unauthorized(new { error = message ?? "Unauthorized access" });
        }
    }
}
