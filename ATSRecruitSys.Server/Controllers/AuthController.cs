using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using ATSRecruitSys.Server.Services;
using ATSRecruitSys.Server.Models;
using ATSRecruitSys.Server.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ATSRecruitSys.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : BaseApiController
    {
        private readonly AuthService _authService;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthController(AuthService authService, UserManager<ApplicationUser> userManager, ILogger<AuthController> logger) : base(logger)
        {
            _authService = authService;
            _userManager = userManager;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto model)
        {
            try
            {
                Logger.LogInformation("POST /api/auth/login - Login attempt for email: {Email}", model?.Email);
                
                if (model == null)
                {
                    Logger.LogWarning("POST /api/auth/login - Request body is null");
                    return BadRequest(new AuthResponseDto
                    {
                        IsSuccess = false,
                        Message = "Request body cannot be null."
                    });
                }

                var result = await _authService.LoginAsync(model);

                Logger.LogInformation("POST /api/auth/login - Login {Status} for email: {Email}", 
                    result.IsSuccess ? "successful" : "failed", model.Email);

                if (result.IsSuccess)
                {
                    return Ok(result);
                }
                
                Logger.LogWarning("POST /api/auth/login - Failed login attempt for email: {Email}", model?.Email);
                
                return Unauthorized(result);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "POST /api/auth/login - Error during login for email: {Email}", model?.Email);
                return StatusCode(500, new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "An error occurred during login."
                });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult<Result<object>>> Logout()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            try
            {
                if (!string.IsNullOrEmpty(userId))
                {
                    await _authService.LogoutAsync(userId);
                }
                
                // JWT tokens are stateless, so just return success
                return Ok(Result<object>.Success(new { message = "Logged out successfully" }));
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Logout error for user {UserId}", userId);
                return StatusCode(500, Result<object>.Failure("Logout failed"));
            }
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<Result<UserProfileDto>>> GetProfile()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return NotFound(Result<UserProfileDto>.Failure("User not found"));

                var roles = await _userManager.GetRolesAsync(user);

                var profile = new UserProfileDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Roles = roles.ToList()
                };

                return Ok(Result<UserProfileDto>.Success(profile));
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error getting profile for user {UserId}", userId);
                return StatusCode(500, Result<UserProfileDto>.Failure("Failed to get profile"));
            }
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<ActionResult<Result<UserProfileDto>>> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return NotFound(Result<UserProfileDto>.Failure("User not found"));

                // Update user information
                user.FirstName = dto.FirstName;
                user.LastName = dto.LastName;

                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    var roles = await _userManager.GetRolesAsync(user);

                    var profile = new UserProfileDto
                    {
                        Id = user.Id,
                        Email = user.Email!,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Roles = roles.ToList()
                    };

                    Logger.LogInformation("User {UserId} updated their profile", userId);
                    return Ok(Result<UserProfileDto>.Success(profile));
                }

                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest(Result<UserProfileDto>.Failure($"Profile update failed: {errors}"));
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error updating profile for user {UserId}", userId);
                return StatusCode(500, Result<UserProfileDto>.Failure("Failed to update profile"));
            }
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult<Result<object>>> ChangePassword(ChangePasswordDto dto)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return NotFound(Result<object>.Failure("User not found"));

                var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
                
                if (result.Succeeded)
                {
                    return Ok(Result<object>.Success(new { message = "Password changed successfully" }));
                }

                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest(Result<object>.Failure($"Password change failed: {errors}"));
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error changing password for user {UserId}", userId);
                return StatusCode(500, Result<object>.Failure("Failed to change password"));
            }
        }

        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result<List<UserDto>>>> GetAllUsers()
        {
            try
            {
                var users = await _authService.GetAllUsersAsync();
                return Ok(Result<List<UserDto>>.Success(users));
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error getting all users");
                return StatusCode(500, Result<List<UserDto>>.Failure("Failed to get users"));
            }
        }

        [HttpPost("create-user")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AuthResponseDto>> CreateUser([FromBody] CreateUserDto dto)
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var result = await _authService.CreateUserAsync(dto, userId);
                
                if (result.IsSuccess)
                {
                    return Ok(result);
                }
                
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error creating user");
                return StatusCode(500, new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "An error occurred while creating the user."
                });
            }
        }

        [HttpDelete("users/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result<object>>> DeleteUser(string id)
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var result = await _authService.DeleteUserAsync(id, userId);
                
                if (result)
                {
                    return Ok(Result<object>.Success(new { message = "User deleted successfully" }));
                }
                
                return NotFound(Result<object>.Failure("User not found"));
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error deleting user {UserId}", id);
                return StatusCode(500, Result<object>.Failure("Failed to delete user"));
            }
        }

        [HttpPost("assign-role")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result<object>>> AssignRole(AssignRoleDto dto)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(dto.UserId);
                if (user == null)
                    return NotFound(Result<object>.Failure("User not found"));

                var result = await _userManager.AddToRoleAsync(user, dto.Role);

                if (result.Succeeded)
                {
                    return Ok(Result<object>.Success(new { message = $"Role '{dto.Role}' assigned successfully" }));
                }

                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest(Result<object>.Failure($"Role assignment failed: {errors}"));
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error assigning role {Role} to user {UserId}", dto.Role, dto.UserId);
                return StatusCode(500, Result<object>.Failure("Failed to assign role"));
            }
        }

        [HttpPost("remove-role")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result<object>>> RemoveRole(RemoveRoleDto dto)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(dto.UserId);
                if (user == null)
                    return NotFound(Result<object>.Failure("User not found"));

                var result = await _userManager.RemoveFromRoleAsync(user, dto.Role);

                if (result.Succeeded)
                {
                    return Ok(Result<object>.Success(new { message = $"Role '{dto.Role}' removed successfully" }));
                }

                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest(Result<object>.Failure($"Role removal failed: {errors}"));
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error removing role {Role} from user {UserId}", dto.Role, dto.UserId);
                return StatusCode(500, Result<object>.Failure("Failed to remove role"));
            }
        }
    }

    // DTOs specific to AuthController endpoints (not shared)
    public class UserProfileDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new();
    }

    public class UpdateProfileDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class AssignRoleDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public class RemoveRoleDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}