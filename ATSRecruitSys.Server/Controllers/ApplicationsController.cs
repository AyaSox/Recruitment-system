using ATSRecruitSys.Server.DTOs;
using ATSRecruitSys.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ATSRecruitSys.Server.Controllers
{
    [Route("api/[controller]")]
    public class ApplicationsController : BaseApiController
    {
        private readonly ApplicationService _applicationService;
        private const int DefaultPageSize = 10;

        public ApplicationsController(
            ApplicationService applicationService,
            ILogger<ApplicationsController> logger) : base(logger)
        {
            _applicationService = applicationService;
        }

        /// <summary>
        /// Get paginated applications with filters (Admin/Recruiter only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin,Recruiter,HiringManager")]
        public async Task<ActionResult<PaginatedResponse<ApplicationDto>>> GetApplications(
            [FromQuery] int page = 0,
            [FromQuery] int pageSize = 0,
            [FromQuery] int? jobId = null,
            [FromQuery] string? status = null,
            [FromQuery] string? searchTerm = null)
        {
            if (pageSize <= 0) pageSize = DefaultPageSize;

            var applications = await _applicationService.GetApplicationsAsync(
                page, pageSize, jobId, status, searchTerm);
            
            return Ok(applications);
        }

        /// <summary>
        /// Get specific application by ID
        /// </summary>
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ApplicationDto>> GetApplication(int id)
        {
            try
            {
                var application = await _applicationService.GetApplicationByIdAsync(id);
                if (application == null)
                    return NotFound("Application not found");

                // Check authorization
                var userId = GetCurrentUserId();
                if (userId == null) return Unauthorized();

                var isRecruiterOrAdminOrHiringManager = IsInAnyRole("Recruiter", "Admin", "HiringManager");
                if (!isRecruiterOrAdminOrHiringManager && application.ApplicantId != userId)
                    return Forbid();

                return Ok(application);
            }
            catch (Exception ex)
            {
                return HandleException(ex, $"Error retrieving application with ID {id}");
            }
        }

        /// <summary>
        /// Submit a simplified job application without requiring user authentication
        /// </summary>
        /// <remarks>
        /// Note: This endpoint is hidden from Swagger UI due to limitations with file upload documentation.
        /// Use the React frontend or tools like Postman to test file uploads.
        /// </remarks>
        [HttpPost("simple")]
        [AllowAnonymous]
        [Consumes("multipart/form-data")]
        [ApiExplorerSettings(IgnoreApi = true)] // Hide from Swagger to prevent IFormFile documentation error
        public async Task<ActionResult> CreateSimpleApplication(
            [FromForm] int jobId,
            [FromForm] string firstName,
            [FromForm] string lastName,
            [FromForm] string email,
            [FromForm] string phoneNumber,
            [FromForm] string? message,
            [FromForm] IFormFile resume)
        {
            try
            {
                // Validate required fields
                if (string.IsNullOrWhiteSpace(firstName))
                    return BadRequest("First name is required");

                if (string.IsNullOrWhiteSpace(lastName))
                    return BadRequest("Last name is required");

                if (string.IsNullOrWhiteSpace(email))
                    return BadRequest("Email is required");

                if (string.IsNullOrWhiteSpace(phoneNumber))
                    return BadRequest("Phone number is required");

                if (resume == null || resume.Length == 0)
                    return BadRequest("Resume file is required");

                // Create simplified application DTO
                var simpleApplicationDto = new SimpleApplicationDto
                {
                    JobId = jobId,
                    FirstName = firstName.Trim(),
                    LastName = lastName.Trim(),
                    Email = email.Trim().ToLowerInvariant(),
                    PhoneNumber = phoneNumber.Trim(),
                    Message = message?.Trim()
                };

                await _applicationService.CreateSimpleApplicationAsync(simpleApplicationDto, resume);
                
                return Ok(new
                {
                    success = true,
                    message = "Thank you for your application! We have received your CV and will be in touch if your profile matches our requirements."
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "Error submitting application");
            }
        }

        /// <summary>
        /// Submit a new job application with resume upload
        /// </summary>
        /// <remarks>
        /// Note: This endpoint is hidden from Swagger UI due to limitations with file upload documentation.
        /// Use the React frontend or tools like Postman to test file uploads.
        /// </remarks>
        [HttpPost]
        [Authorize(Roles = "Applicant")]
        [Consumes("multipart/form-data")]
        [ApiExplorerSettings(IgnoreApi = true)] // Hide from Swagger to prevent IFormFile documentation error
        public async Task<ActionResult<ApplicationDto>> CreateApplication(
            [FromForm] CreateApplicationDto dto,
            [FromForm] IFormFile resume)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var application = await _applicationService.CreateApplicationAsync(dto, resume, userId);
                
                return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, new
                {
                    success = true,
                    message = "Application submitted successfully! You will receive a confirmation email shortly.",
                    data = application
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "Error submitting application");
            }
        }

        /// <summary>
        /// Update application status (Admin/Recruiter only)
        /// </summary>
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Recruiter,HiringManager")]
        public async Task<ActionResult<ApplicationDto>> UpdateApplicationStatus(
            int id, 
            [FromBody] UpdateApplicationDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID mismatch");

            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var application = await _applicationService.UpdateApplicationStatusAsync(dto, userId);
                
                if (application == null)
                    return NotFound("Application not found");

                return Ok(new
                {
                    success = true,
                    message = $"Application status updated to '{dto.Status}' successfully. The applicant has been notified.",
                    data = application
                });
            }
            catch (Exception ex)
            {
                return HandleException(ex, $"Error updating application status with ID {id}");
            }
        }

        /// <summary>
        /// Download resume file for an application
        /// </summary>
        [HttpGet("{id}/resume")]
        [Authorize]
        public async Task<ActionResult> GetResume(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var file = await _applicationService.GetResumeFileAsync(id, userId);
                if (file == null)
                    return NotFound("Resume file not found");

                var contentType = GetContentType(file.Name);
                return File(file, contentType, Path.GetFileName(file.Name));
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return HandleException(ex, $"Error retrieving resume for application with ID {id}");
            }
        }

        /// <summary>
        /// Get application statistics for a specific job (Admin/Recruiter only)
        /// </summary>
        [HttpGet("stats/{jobId}")]
        [Authorize(Roles = "Admin,Recruiter,HiringManager")]
        public async Task<ActionResult<List<ApplicationStatDto>>> GetJobApplicationStats(int jobId)
        {
            try
            {
                var stats = await _applicationService.GetApplicationStatsByJobAsync(jobId);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return HandleException(ex, $"Error retrieving application stats for job with ID {jobId}");
            }
        }

        /// <summary>
        /// Get overall application statistics (Admin/Recruiter only)
        /// </summary>
        [HttpGet("stats")]
        [Authorize(Roles = "Admin,Recruiter,HiringManager")]
        public async Task<ActionResult<List<ApplicationStatDto>>> GetOverallApplicationStats()
        {
            try
            {
                var stats = await _applicationService.GetOverallApplicationStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "Error retrieving overall application stats");
            }
        }

        private string GetContentType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            return extension switch
            {
                ".pdf" => "application/pdf",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".doc" => "application/msword",
                _ => "application/octet-stream"
            };
        }
    }
}