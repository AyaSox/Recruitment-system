# Multiple File Upload & Application Fix - Complete Guide

## ?? Issue Summary

1. **500 Error**: Application submission failing due to skills parsing or other backend issues
2. **Single File Only**: Currently only supports CV/Resume upload
3. **Missing Documents**: Need support for certifications, qualifications, and other supporting documents

## ? Complete Solution

### Part 1: Fix Application DTOs (Backend)

Update `ATSRecruitSys.Server/DTOs/ApplicationDTOs.cs` to support multiple documents:

```csharp
namespace ATSRecruitSys.Server.DTOs
{
    public class CreateApplicationDto
    {
        public int JobId { get; set; }
        public string? CoverLetter { get; set; }
        public string? ApplicantNotes { get; set; }
        public string? Skills { get; set; } // Changed from List to JSON string for FormData compatibility
    }

    public class ApplicationDocumentDto
    {
        public int Id { get; set; }
        public string DocumentType { get; set; } = string.Empty; // Resume, Certificate, Qualification, Other
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime UploadedDate { get; set; }
    }

    public class ApplicationDto
    {
        // ... existing properties ...
        public List<ApplicationDocumentDto> Documents { get; set; } = new List<ApplicationDocumentDto>();
    }
}
```

### Part 2: Update Database Model

Create new migration for application documents:

```csharp
// ATSRecruitSys.Server/Models/ApplicationDocument.cs
namespace ATSRecruitSys.Server.Models
{
    public class ApplicationDocument
    {
        public int Id { get; set; }
        public int JobApplicationId { get; set; }
        public JobApplication JobApplication { get; set; } = null!;
        public string DocumentType { get; set; } = string.Empty; // Resume, Certificate, Qualification, Other
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime UploadedDate { get; set; }
    }
}
```

Update `JobApplication` model:

```csharp
public class JobApplication
{
    // ... existing properties ...
    public List<ApplicationDocument> Documents { get; set; } = new List<ApplicationDocument>();
}
```

### Part 3: Update Application Controller

```csharp
[HttpPost]
[Authorize(Roles = "Applicant")]
public async Task<ActionResult<ApplicationDto>> CreateApplication(
    [FromForm] CreateApplicationDto dto,
    [FromForm] IFormFile resume,
    [FromForm] List<IFormFile>? certificates,
    [FromForm] List<IFormFile>? qualifications,
    [FromForm] List<IFormFile>? otherDocuments)
{
    var userId = GetCurrentUserId();
    if (userId == null) return UnauthorizedResponse();

    // Validate resume
    var validationResult = _fileValidator.ValidateResume(resume);
    if (!validationResult.IsValid)
        return BadRequestResponse(validationResult.ErrorMessage ?? "Invalid resume file");

    // Validate additional documents
    var allDocuments = new List<(IFormFile file, string type)> { (resume, "Resume") };
    
    if (certificates != null)
        allDocuments.AddRange(certificates.Select(f => (f, "Certificate")));
    
    if (qualifications != null)
        allDocuments.AddRange(qualifications.Select(f => (f, "Qualification")));
    
    if (otherDocuments != null)
        allDocuments.AddRange(otherDocuments.Select(f => (f, "Other")));

    // Validate total size (max 25MB total)
    var totalSize = allDocuments.Sum(d => d.file.Length);
    if (totalSize > 25 * 1024 * 1024)
        return BadRequestResponse("Total file size exceeds 25MB limit");

    try
    {
        var application = await _applicationService.CreateApplicationWithDocumentsAsync(
            dto, allDocuments, userId);
        
        return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, application);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error submitting application");
        return HandleException(ex, "Error submitting application");
    }
}
```

### Part 4: Update Application Service

```csharp
public async Task<ApplicationDto> CreateApplicationWithDocumentsAsync(
    CreateApplicationDto dto,
    List<(IFormFile file, string type)> documents,
    string userId)
{
    // Validate job exists and is open
    var job = await _context.Jobs.FindAsync(dto.JobId);
    if (job == null)
        throw new JobNotFoundException($"Job with ID {dto.JobId} not found");

    if (job.ClosingDate < DateTime.UtcNow)
        throw new JobClosedException("This job posting has closed");

    // Check for duplicate application
    var existingApplication = await _context.JobApplications
        .FirstOrDefaultAsync(a => a.JobId == dto.JobId && a.ApplicantId == userId);
    
    if (existingApplication != null)
        throw new DuplicateApplicationException("You have already applied for this job");

    // Parse skills from JSON string
    List<ApplicantSkillDto>? skills = null;
    if (!string.IsNullOrEmpty(dto.Skills))
    {
        try
        {
            skills = JsonSerializer.Deserialize<List<ApplicantSkillDto>>(dto.Skills);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Error parsing skills JSON");
            // Continue without skills rather than failing
        }
    }

    // Create application
    var application = new JobApplication
    {
        JobId = dto.JobId,
        ApplicantId = userId,
        AppliedDate = DateTime.UtcNow,
        Status = "Applied",
        CoverLetter = dto.CoverLetter,
        ApplicantNotes = dto.ApplicantNotes
    };

    // Add skills
    if (skills != null)
    {
        application.Skills = skills.Select(s => new ApplicantSkill
        {
            SkillId = s.SkillId,
            SkillName = s.SkillName,
            Level = s.Level,
            YearsOfExperience = s.YearsOfExperience
        }).ToList();
    }

    // Save documents
    foreach (var (file, type) in documents)
    {
        var filePath = await _fileStorageService.SaveFileAsync(file, "applications");
        
        application.Documents.Add(new ApplicationDocument
        {
            DocumentType = type,
            FileName = file.FileName,
            FilePath = filePath,
            FileSize = file.Length,
            UploadedDate = DateTime.UtcNow
        });
    }

    _context.JobApplications.Add(application);
    await _context.SaveChangesAsync();

    // Send notification email
    try
    {
        await _emailService.SendApplicationConfirmationAsync(application);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Failed to send application confirmation email");
        // Don't fail the application if email fails
    }

    return await GetApplicationByIdAsync(application.Id);
}
```

### Part 5: Update Frontend Types

```typescript
// atsrecruitsys.client/src/types/application.ts
export interface ApplicationDocument {
  id: number;
  documentType: 'Resume' | 'Certificate' | 'Qualification' | 'Other';
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedDate: string;
}

export interface Application {
  // ... existing properties ...
  documents: ApplicationDocument[];
}
```

### Part 6: Update Frontend Service

```typescript
// atsrecruitsys.client/src/services/application.service.ts
submitApplication: async (
  data: CreateApplicationRequest,
  resumeFile: File,
  certificates?: File[],
  qualifications?: File[],
  otherDocuments?: File[]
): Promise<Application> => {
  const formData = new FormData();

  // Add form data
  formData.append('jobId', data.jobId.toString());
  if (data.coverLetter) {
    formData.append('coverLetter', data.coverLetter);
  }
  if (data.applicantNotes) {
    formData.append('applicantNotes', data.applicantNotes);
  }

  // Add skills as JSON string for FormData compatibility
  if (data.skills && data.skills.length > 0) {
    formData.append('skills', JSON.stringify(data.skills));
  }

  // Add resume file (required)
  formData.append('resume', resumeFile);

  // Add certificates (optional)
  if (certificates && certificates.length > 0) {
    certificates.forEach((file) => {
      formData.append('certificates', file);
    });
  }

  // Add qualifications (optional)
  if (qualifications && qualifications.length > 0) {
    qualifications.forEach((file) => {
      formData.append('qualifications', file);
    });
  }

  // Add other documents (optional)
  if (otherDocuments && otherDocuments.length > 0) {
    otherDocuments.forEach((file) => {
      formData.append('otherDocuments', file);
    });
  }

  const response = await api.post<Application>('/applications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
},
```

### Part 7: Update Frontend Component (JobApplyPage.tsx)

See the complete updated component in the next section.

## ?? Quick Implementation Steps

1. **Update Backend DTOs** - Add ApplicationDocument support
2. **Create Migration** - Add ApplicationDocuments table
3. **Update Controller** - Handle multiple file uploads
4. **Update Service** - Process and save all documents
5. **Update Frontend Types** - Add document interfaces
6. **Update Service** - Support multiple files
7. **Update Component** - Add UI for multiple file uploads
8. **Test** - Verify application submission works

## ?? Testing Checklist

- [ ] Can submit application with just CV
- [ ] Can submit application with CV + certificates
- [ ] Can submit application with all document types
- [ ] File size validation works (individual and total)
- [ ] File type validation works
- [ ] Error messages are clear
- [ ] Documents appear in application details
- [ ] Can download each document type

## ?? Benefits

- ? Support for multiple document types
- ? Better candidate profiles
- ? Comprehensive application packages
- ? Flexible file management
- ? Professional application process
