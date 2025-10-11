using System.ComponentModel.DataAnnotations;

namespace ATSRecruitSys.Server.DTOs
{
    // Candidate Profile DTOs
    public class CandidateProfileDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        
        // Personal Information
        public string? IdNumber { get; set; }
        public string? PassportNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Nationality { get; set; }
        
        // South African Employment Equity Fields
        public string Race { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public bool HasDisability { get; set; }
        public string? DisabilityDescription { get; set; }
        
        // Contact Information
        public string? AlternativePhoneNumber { get; set; }
        public string? LinkedInProfile { get; set; }
        public string? PersonalWebsite { get; set; }
        
        // Address Information
        public string? StreetAddress { get; set; }
        public string? Suburb { get; set; }
        public string? City { get; set; }
        public string? Province { get; set; }
        public string? PostalCode { get; set; }
        
        // Professional Information
        public string? CurrentJobTitle { get; set; }
        public string? CurrentEmployer { get; set; }
        public int YearsOfExperience { get; set; }
        public string? HighestQualification { get; set; }
        public string? Institution { get; set; }
        public int? GraduationYear { get; set; }
        
        // Preferences
        public decimal? ExpectedSalaryMin { get; set; }
        public decimal? ExpectedSalaryMax { get; set; }
        public string Currency { get; set; } = "ZAR";
        public bool IsAvailableImmediately { get; set; }
        public int? NoticePeriodDays { get; set; }
        public bool WillingToRelocate { get; set; }
        public string? PreferredLocations { get; set; }
        public bool OpenToRemoteWork { get; set; }
        
        // Additional Information
        public string? PersonalSummary { get; set; }
        public string? CareerObjectives { get; set; }
        public string? Hobbies { get; set; }
        public string? Languages { get; set; }
        
        // System Fields
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsPublic { get; set; }
        
        // File Paths
        public string? ResumeFilePath { get; set; }
        public string? CoverLetterTemplatePath { get; set; }
        
        // Related Data
        public List<CandidateSkillDto> Skills { get; set; } = new List<CandidateSkillDto>();
        public List<WorkExperienceDto> WorkExperience { get; set; } = new List<WorkExperienceDto>();
        public List<EducationDto> Education { get; set; } = new List<EducationDto>();
        public List<CertificationDto> Certifications { get; set; } = new List<CertificationDto>();
        
        // User Information
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ProfilePictureUrl { get; set; }
    }

    public class CreateCandidateProfileDto
    {
        // Personal Information
        public string? IdNumber { get; set; }
        public string? PassportNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Nationality { get; set; } = "South African";
        
        // South African Employment Equity Fields (Required)
        [Required(ErrorMessage = "Race is required for Employment Equity reporting")]
        public string Race { get; set; } = string.Empty; // White, African, Indian, Coloured, Other
        
        [Required(ErrorMessage = "Gender is required for Employment Equity reporting")]
        public string Gender { get; set; } = string.Empty; // Male, Female, Other
        
        public bool HasDisability { get; set; } = false;
        public string? DisabilityDescription { get; set; }
        
        // Contact Information
        public string? AlternativePhoneNumber { get; set; }
        public string? LinkedInProfile { get; set; }
        public string? PersonalWebsite { get; set; }
        
        // Address Information
        public string? StreetAddress { get; set; }
        public string? Suburb { get; set; }
        public string? City { get; set; }
        public string? Province { get; set; }
        public string? PostalCode { get; set; }
        
        // Professional Information
        public string? CurrentJobTitle { get; set; }
        public string? CurrentEmployer { get; set; }
        public int YearsOfExperience { get; set; } = 0;
        public string? HighestQualification { get; set; }
        public string? Institution { get; set; }
        public int? GraduationYear { get; set; }
        
        // Preferences
        public decimal? ExpectedSalaryMin { get; set; }
        public decimal? ExpectedSalaryMax { get; set; }
        public string Currency { get; set; } = "ZAR";
        public bool IsAvailableImmediately { get; set; } = false;
        public int? NoticePeriodDays { get; set; }
        public bool WillingToRelocate { get; set; } = false;
        public string? PreferredLocations { get; set; }
        public bool OpenToRemoteWork { get; set; } = false;
        
        // Additional Information
        public string? PersonalSummary { get; set; }
        public string? CareerObjectives { get; set; }
        public string? Hobbies { get; set; }
        public string? Languages { get; set; }
        
        public bool IsPublic { get; set; } = true;
    }

    public class UpdateCandidateProfileDto : CreateCandidateProfileDto
    {
        public int Id { get; set; }
    }

    public class CandidateSkillDto
    {
        public int Id { get; set; }
        public int SkillId { get; set; }
        public string SkillName { get; set; } = string.Empty;
        public string SkillCategory { get; set; } = string.Empty;
        public string Level { get; set; } = "Beginner";
        public int YearsOfExperience { get; set; }
        public bool IsCertified { get; set; }
    }

    public class CreateCandidateSkillDto
    {
        [Required]
        public int SkillId { get; set; }
        
        [Required]
        public string Level { get; set; } = "Beginner";
        
        public int YearsOfExperience { get; set; } = 0;
        public bool IsCertified { get; set; } = false;
    }

    public class WorkExperienceDto
    {
        public int Id { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string? Industry { get; set; }
        public string? Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrent { get; set; }
        public string? Description { get; set; }
        public string? Achievements { get; set; }
        public string? Technologies { get; set; }
    }

    public class CreateWorkExperienceDto
    {
        [Required]
        public string JobTitle { get; set; } = string.Empty;
        
        [Required]
        public string CompanyName { get; set; } = string.Empty;
        
        public string? Industry { get; set; }
        public string? Location { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        public DateTime? EndDate { get; set; }
        public bool IsCurrent { get; set; } = false;
        public string? Description { get; set; }
        public string? Achievements { get; set; }
        public string? Technologies { get; set; }
    }

    public class EducationDto
    {
        public int Id { get; set; }
        public string Institution { get; set; } = string.Empty;
        public string Degree { get; set; } = string.Empty;
        public string? FieldOfStudy { get; set; }
        public string? Grade { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrent { get; set; }
        public string? Description { get; set; }
        public string? Activities { get; set; }
    }

    public class CreateEducationDto
    {
        [Required]
        public string Institution { get; set; } = string.Empty;
        
        [Required]
        public string Degree { get; set; } = string.Empty;
        
        public string? FieldOfStudy { get; set; }
        public string? Grade { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        public DateTime? EndDate { get; set; }
        public bool IsCurrent { get; set; } = false;
        public string? Description { get; set; }
        public string? Activities { get; set; }
    }

    public class CertificationDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string IssuingOrganization { get; set; } = string.Empty;
        public DateTime IssueDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? CredentialId { get; set; }
        public string? CredentialUrl { get; set; }
        public string? Description { get; set; }
    }

    public class CreateCertificationDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string IssuingOrganization { get; set; } = string.Empty;
        
        [Required]
        public DateTime IssueDate { get; set; }
        
        public DateTime? ExpiryDate { get; set; }
        public string? CredentialId { get; set; }
        public string? CredentialUrl { get; set; }
        public string? Description { get; set; }
    }

    // Constants for dropdowns
    public static class SouthAfricanConstants
    {
        public static readonly string[] Races = { "White", "African", "Indian", "Coloured", "Other" };
        public static readonly string[] Genders = { "Male", "Female", "Other" };
        public static readonly string[] Provinces = 
        { 
            "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", 
            "Limpopo", "Mpumalanga", "North West", "Free State", "Northern Cape" 
        };
        public static readonly string[] QualificationLevels = 
        { 
            "Matric", "Certificate", "Diploma", "Bachelor's Degree", 
            "Honours Degree", "Master's Degree", "Doctorate", "Other" 
        };
        public static readonly string[] ExperienceLevels = 
        { 
            "Entry Level (0-2 years)", "Mid Level (3-5 years)", 
            "Senior Level (6-10 years)", "Executive Level (10+ years)" 
        };
    }
}