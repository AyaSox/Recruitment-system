namespace ATSRecruitSys.Server.DTOs
{
    // Application DTOs
    public class CreateApplicationDto
    {
        public int JobId { get; set; }
        public string? CoverLetter { get; set; }
        public string? ApplicantNotes { get; set; }
        public string? Skills { get; set; } // JSON string of skills
    }

    // Simplified application DTO for external candidates
    public class SimpleApplicationDto
    {
        public int JobId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Message { get; set; }
    }

    public class UpdateApplicationDto
    {
        public int Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? RecruiterNotes { get; set; }
    }

    public class ApplicationDto
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string JobDepartment { get; set; } = string.Empty;
        public string ApplicantId { get; set; } = string.Empty;
        public string ApplicantName { get; set; } = string.Empty;
        public string ApplicantEmail { get; set; } = string.Empty;
        public DateTime AppliedDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime StatusUpdatedDate { get; set; }
        public string? CoverLetter { get; set; }
        public string? ApplicantNotes { get; set; }
        public string? RecruiterNotes { get; set; }
        public string? Skills { get; set; } // JSON string of skills
        public string? PhoneNumber { get; set; } // For simple applications
    }

    // For user's view of their own applications
    public class MyApplicationDto
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyDepartment { get; set; } = string.Empty;
        public DateTime AppliedDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime StatusUpdatedDate { get; set; }
    }

    // For dashboard statistics
    public class ApplicationStatDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}