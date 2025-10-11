using ATSRecruitSys.Server.DTOs;
using ATSRecruitSys.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ATSRecruitSys.Server.Controllers
{
    [Route("api/[controller]")]
    public class JobsController : BaseApiController
    {
        private readonly JobService _jobService;
        private const int DefaultPageSize = 10;
        private const int MaxPageSize = 50;

        public JobsController(
            JobService jobService,
            ILogger<JobsController> logger) : base(logger)
        {
            _jobService = jobService;
        }

        /// <summary>
        /// Get paginated jobs with filters
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<PaginatedJobResponseDto>> GetJobs(
            [FromQuery] int page = 0,
            [FromQuery] int pageSize = 0,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? location = null,
            [FromQuery] string? department = null,
            [FromQuery] string? employmentType = null,
            [FromQuery] string? experienceLevel = null)
        {
            // Apply pagination settings
            if (pageSize <= 0) pageSize = DefaultPageSize;
            if (pageSize > MaxPageSize) pageSize = MaxPageSize;

            var publicView = !IsInAnyRole("Admin", "Recruiter", "HiringManager");
            var jobs = await _jobService.GetJobsAsync(
                page, pageSize, searchTerm, location, department, 
                employmentType, experienceLevel, publicView);

            return Ok(jobs);
        }

        /// <summary>
        /// Get specific job by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<JobDto>> GetJob(int id)
        {
            try
            {
                var job = await _jobService.GetJobByIdAsync(id);
                
                if (job == null)
                    return NotFound("Job not found");

                // Check authorization
                if (!CanViewJob(job))
                    return NotFound("Job not found");

                return Ok(job);
            }
            catch (Exception ex)
            {
                return HandleException(ex, $"Error retrieving job with ID {id}");
            }
        }

        /// <summary>
        /// Create a new job posting
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin,Recruiter,HiringManager")]
        public async Task<ActionResult<JobDto>> CreateJob([FromBody] CreateJobDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var job = await _jobService.CreateJobAsync(dto, userId);
                
                return CreatedAtAction(nameof(GetJob), new { id = job.Id }, new
                {
                    success = true,
                    message = "Job created successfully.",
                    data = job
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "Error creating job");
            }
        }

        /// <summary>
        /// Update an existing job
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Recruiter,HiringManager")]
        public async Task<ActionResult<JobDto>> UpdateJob(int id, [FromBody] UpdateJobDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID mismatch");

            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var job = await _jobService.UpdateJobAsync(dto, userId);
                
                if (job == null)
                    return NotFound("Job not found");

                return Ok(new
                {
                    success = true,
                    message = dto.IsPublished 
                        ? "Job updated and published successfully." 
                        : "Job updated successfully.",
                    data = job
                });
            }
            catch (Exception ex)
            {
                return HandleException(ex, $"Error updating job with ID {id}");
            }
        }

        /// <summary>
        /// Publish a job posting
        /// </summary>
        [HttpPut("{id}/publish")]
        [Authorize(Roles = "Admin,Recruiter,HiringManager")]
        public async Task<ActionResult<JobDto>> PublishJob(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var job = await _jobService.PublishJobAsync(id, userId);
                
                if (job == null)
                    return NotFound("Job not found");

                return Ok(new
                {
                    success = true,
                    message = "Job published successfully.",
                    data = job
                });
            }
            catch (Exception ex)
            {
                return HandleException(ex, $"Error publishing job with ID {id}");
            }
        }

        /// <summary>
        /// Unpublish a job posting
        /// </summary>
        [HttpPut("{id}/unpublish")]
        [Authorize(Roles = "Admin,Recruiter,HiringManager")]
        public async Task<ActionResult<JobDto>> UnpublishJob(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var job = await _jobService.UnpublishJobAsync(id, userId);
                
                if (job == null)
                    return NotFound("Job not found");

                return Ok(new
                {
                    success = true,
                    message = "Job unpublished successfully.",
                    data = job
                });
            }
            catch (Exception ex)
            {
                return HandleException(ex, $"Error unpublishing job with ID {id}");
            }
        }

        /// <summary>
        /// Delete a job posting
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteJob(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var result = await _jobService.DeleteJobAsync(id, userId);
                
                if (!result)
                    return NotFound("Job not found");

                return Ok(new
                {
                    success = true,
                    message = "Job deleted successfully."
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return HandleException(ex, $"Error deleting job with ID {id}");
            }
        }

        private bool CanViewJob(JobDto job)
        {
            var isAdminOrRecruiterOrHiringManager = IsInAnyRole("Admin", "Recruiter", "HiringManager");
            return isAdminOrRecruiterOrHiringManager || job.IsPublished;
        }
    }
}