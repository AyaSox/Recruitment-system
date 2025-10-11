using System.ComponentModel.DataAnnotations;

namespace ATSRecruitSys.Server.DTOs
{
    /// <summary>
    /// DTO for displaying an application note
    /// </summary>
    public class ApplicationNoteDto
    {
        public int Id { get; set; }
        public int JobApplicationId { get; set; }
        public string AuthorId { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsInternal { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsEdited { get; set; }
        public List<string> MentionedUsers { get; set; } = new();
        public string? AttachmentFileName { get; set; }
    }

    /// <summary>
    /// DTO for creating a new application note
    /// </summary>
    public class CreateApplicationNoteDto
    {
        [Required]
        public int JobApplicationId { get; set; }

        [Required]
        [StringLength(2000, ErrorMessage = "Note content cannot exceed 2000 characters")]
        public string Content { get; set; } = string.Empty;

        public bool IsInternal { get; set; } = true;
        
        /// <summary>
        /// List of user IDs to mention
        /// </summary>
        public List<string>? MentionedUserIds { get; set; }
    }

    /// <summary>
    /// DTO for updating an existing application note
    /// </summary>
    public class UpdateApplicationNoteDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(2000, ErrorMessage = "Note content cannot exceed 2000 characters")]
        public string Content { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response with paginated notes
    /// </summary>
    public class PaginatedNotesResponseDto
    {
        public List<ApplicationNoteDto> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
