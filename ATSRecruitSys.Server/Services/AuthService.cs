using ATSRecruitSys.Server.DTOs;
using ATSRecruitSys.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ATSRecruitSys.Server.Services
{
    public class AuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IAuditService _auditService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            IAuditService auditService,
            ILogger<AuthService> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _auditService = auditService;
            _logger = logger;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                // Audit failed login attempt
                await _auditService.LogAsync("Login", "User", loginDto.Email, null, null, $"Failed login attempt for email: {loginDto.Email} - User not found");
                return new AuthResponseDto { IsSuccess = false, Message = "Invalid email or password" };
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded)
            {
                // Audit failed login attempt
                await _auditService.LogAsync("Login", "User", user.Id, null, null, $"Failed login attempt for {user.Email} - Invalid password");
                return new AuthResponseDto { IsSuccess = false, Message = "Invalid email or password" };
            }

            var token = await GenerateJwtTokenAsync(user);
            var roles = await _userManager.GetRolesAsync(user);

            // Audit successful login
            await _auditService.LogAsync("Login", "User", user.Id, null, new { Email = user.Email, Roles = roles }, $"Successful login for {user.Email}");

            return new AuthResponseDto
            {
                IsSuccess = true,
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email!,
                    Roles = roles.ToList()
                },
                Message = "Login successful"
            };
        }

        public async Task<AuthResponseDto> CreateUserAsync(CreateUserDto createUserDto, string createdByUserId)
        {
            var existingUser = await _userManager.FindByEmailAsync(createUserDto.Email);
            if (existingUser != null)
            {
                return new AuthResponseDto { IsSuccess = false, Message = "User with this email already exists" };
            }

            // Validate role
            if (!await _roleManager.RoleExistsAsync(createUserDto.Role))
            {
                return new AuthResponseDto { IsSuccess = false, Message = "Invalid role specified" };
            }

            var user = new ApplicationUser
            {
                UserName = createUserDto.Email,
                Email = createUserDto.Email,
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                EmailConfirmed = true, // Admin-created users are pre-confirmed
                CreatedAt = DateTime.UtcNow // Explicitly set creation time
            };

            var result = await _userManager.CreateAsync(user, createUserDto.Password);
            if (!result.Succeeded)
            {
                return new AuthResponseDto { IsSuccess = false, Message = string.Join("; ", result.Errors.Select(e => e.Description)) };
            }

            // Assign specified role
            await _userManager.AddToRoleAsync(user, createUserDto.Role);

            // Audit user creation by admin
            await _auditService.LogAsync("Create", "User", user.Id, null, new
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = createUserDto.Role,
                CreatedBy = createdByUserId
            }, $"User created by admin: {user.Email} with role {createUserDto.Role}");

            var roles = await _userManager.GetRolesAsync(user);

            return new AuthResponseDto
            {
                IsSuccess = true,
                User = new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt,
                    LastLoginDate = user.LastLoginDate,
                    ProfilePictureUrl = user.ProfilePictureUrl ?? string.Empty,
                    Roles = roles.ToList()
                },
                Message = "User created successfully"
            };
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userDtos.Add(new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email!,
                    CreatedAt = user.CreatedAt,
                    LastLoginDate = user.LastLoginDate,
                    ProfilePictureUrl = user.ProfilePictureUrl ?? string.Empty,
                    Roles = roles.ToList()
                });
            }

            return userDtos.OrderBy(u => u.Email).ToList();
        }

        public async Task<bool> DeleteUserAsync(string userId, string deletedByUserId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            // Capture user details for audit before deletion
            var userDetails = new
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = await _userManager.GetRolesAsync(user)
            };

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                // Audit user deletion
                await _auditService.LogAsync("Delete", "User", userId, userDetails, null, 
                    $"User deleted: {userDetails.Email} by admin");
            }

            return result.Succeeded;
        }

        public async Task LogoutAsync(string userId)
        {
            // Find user for audit
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                // Audit logout
                await _auditService.LogAsync("Logout", "User", userId, null, null, $"User logged out: {user.Email}");
            }
        }

        private async Task<string> GenerateJwtTokenAsync(ApplicationUser user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!";
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var roles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("id", user.Id),
                new Claim("name", $"{user.FirstName} {user.LastName}"),
                new Claim("email", user.Email!)
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"] ?? "ATSRecruitSys",
                audience: jwtSettings["Audience"] ?? "ATSRecruitSys",
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7), // Token expires in 7 days
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}