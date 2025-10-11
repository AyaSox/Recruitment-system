namespace ATSRecruitSys.Server.Exceptions
{
    /// <summary>
    /// Base exception for all business rule violations
    /// </summary>
    public class BusinessRuleException : Exception
    {
        public BusinessRuleException(string message) : base(message) { }
        
        public BusinessRuleException(string message, Exception innerException) 
            : base(message, innerException) { }
    }

    /// <summary>
    /// Exception thrown when a requested resource is not found
    /// </summary>
    public class ResourceNotFoundException : Exception
    {
        public string ResourceType { get; init; } = string.Empty;
        public object ResourceId { get; init; } = string.Empty;

        public ResourceNotFoundException(string resourceType, object resourceId)
            : base($"{resourceType} with ID '{resourceId}' was not found.")
        {
            ResourceType = resourceType;
            ResourceId = resourceId;
        }

        public ResourceNotFoundException(string message) : base(message) { }
    }

    /// <summary>
    /// Exception thrown when a job-related business rule is violated
    /// </summary>
    public class JobNotFoundException : ResourceNotFoundException
    {
        public JobNotFoundException(int jobId) 
            : base("Job", jobId) { }
    }

    public class JobClosedException : BusinessRuleException
    {
        public JobClosedException(string jobTitle) 
            : base($"The job '{jobTitle}' is no longer accepting applications as the closing date has passed.") { }
    }

    public class JobAlreadyExistsException : BusinessRuleException
    {
        public JobAlreadyExistsException(string jobTitle) 
            : base($"A job with the title '{jobTitle}' already exists and is currently active.") { }
    }

    public class JobHasApplicationsException : BusinessRuleException
    {
        public JobHasApplicationsException(int jobId, int applicationCount) 
            : base($"Cannot delete job with ID {jobId} because it has {applicationCount} application(s).") { }
    }

    /// <summary>
    /// Exception thrown when an application-related business rule is violated
    /// </summary>
    public class ApplicationNotFoundException : ResourceNotFoundException
    {
        public ApplicationNotFoundException(int applicationId) 
            : base("Application", applicationId) { }
    }

    public class DuplicateApplicationException : BusinessRuleException
    {
        public DuplicateApplicationException(string applicantName, string jobTitle) 
            : base($"User '{applicantName}' has already applied to '{jobTitle}'.") { }
    }

    public class InvalidApplicationStatusException : BusinessRuleException
    {
        public InvalidApplicationStatusException(string currentStatus, string targetStatus) 
            : base($"Cannot change application status from '{currentStatus}' to '{targetStatus}'.") { }
    }

    /// <summary>
    /// Exception thrown when an interview-related business rule is violated
    /// </summary>
    public class InterviewNotFoundException : ResourceNotFoundException
    {
        public InterviewNotFoundException(int interviewId) 
            : base("Interview", interviewId) { }
    }

    public class InterviewSchedulingConflictException : BusinessRuleException
    {
        public InterviewSchedulingConflictException(DateTime scheduledDate) 
            : base($"An interview is already scheduled for {scheduledDate:yyyy-MM-dd HH:mm}.") { }
    }

    public class InterviewAlreadyCompletedException : BusinessRuleException
    {
        public InterviewAlreadyCompletedException(int interviewId) 
            : base($"Interview {interviewId} has already been completed and cannot be modified.") { }
    }

    /// <summary>
    /// Exception thrown when file validation fails
    /// </summary>
    public class FileValidationException : Exception
    {
        public string FileName { get; }
        public string ValidationError { get; }

        public FileValidationException(string fileName, string validationError)
            : base($"File validation failed for '{fileName}': {validationError}")
        {
            FileName = fileName;
            ValidationError = validationError;
        }
    }

    /// <summary>
    /// Exception thrown when a candidate profile-related business rule is violated
    /// </summary>
    public class ProfileNotFoundException : ResourceNotFoundException
    {
        public ProfileNotFoundException(string userId) 
            : base("Candidate Profile", userId) { }
    }

    public class ProfileAlreadyExistsException : BusinessRuleException
    {
        public ProfileAlreadyExistsException(string userId) 
            : base($"A profile already exists for user '{userId}'.") { }
    }

    /// <summary>
    /// Exception thrown when validation fails
    /// </summary>
    public class ValidationException : Exception
    {
        public Dictionary<string, List<string>> Errors { get; }

        public ValidationException(string message) : base(message)
        {
            Errors = new Dictionary<string, List<string>>();
        }

        public ValidationException(Dictionary<string, List<string>> errors) 
            : base("One or more validation errors occurred.")
        {
            Errors = errors;
        }

        public ValidationException(string field, string error) : base(error)
        {
            Errors = new Dictionary<string, List<string>>
            {
                { field, new List<string> { error } }
            };
        }
    }
}
