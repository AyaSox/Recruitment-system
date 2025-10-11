using ATSRecruitSys.Server.Exceptions;
using Microsoft.Extensions.Options;

namespace ATSRecruitSys.Server.Services
{
    public class FileUploadSettings
    {
        public long MaxResumeSize { get; set; } = 5242880; // 5MB
        public long MaxProfilePictureSize { get; set; } = 2097152; // 2MB
        public long MaxDocumentSize { get; set; } = 10485760; // 10MB
        public List<string> AllowedResumeExtensions { get; set; } = new() { ".pdf", ".doc", ".docx" };
        public List<string> AllowedImageExtensions { get; set; } = new() { ".jpg", ".jpeg", ".png", ".gif" };
        public List<string> AllowedDocumentExtensions { get; set; } = new() { ".pdf", ".doc", ".docx", ".txt", ".rtf" };
    }

    public interface IFileValidator
    {
        ValidationResult ValidateResume(IFormFile file);
        ValidationResult ValidateProfilePicture(IFormFile file);
        ValidationResult ValidateDocument(IFormFile file); // New method for general documents
        ValidationResult ValidateFile(IFormFile file, FileType fileType);
    }

    public enum FileType
    {
        Resume,
        ProfilePicture,
        Document,
        General
    }

    public class ValidationResult
    {
        public bool IsValid { get; init; }
        public string? ErrorMessage { get; init; }
        public List<string> Errors { get; init; } = new();

        public static ValidationResult Success() => new() { IsValid = true };

        public static ValidationResult Failure(string errorMessage) => new()
        {
            IsValid = false,
            ErrorMessage = errorMessage,
            Errors = new List<string> { errorMessage }
        };

        public static ValidationResult Failure(List<string> errors) => new()
        {
            IsValid = false,
            ErrorMessage = string.Join("; ", errors),
            Errors = errors
        };
    }

    public class FileValidator : IFileValidator
    {
        private readonly IOptions<FileUploadSettings> _settings;
        private readonly ILogger<FileValidator> _logger;

        // Valid MIME types for resumes
        private readonly string[] _resumeMimeTypes = new[]
        {
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };

        // Valid MIME types for images
        private readonly string[] _imageMimeTypes = new[]
        {
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif"
        };

        // Valid MIME types for documents
        private readonly string[] _documentMimeTypes = new[]
        {
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
            "application/rtf"
        };

        public FileValidator(IOptions<FileUploadSettings> settings, ILogger<FileValidator> logger)
        {
            _settings = settings;
            _logger = logger;
        }

        public ValidationResult ValidateResume(IFormFile file)
        {
            return ValidateFile(file, FileType.Resume);
        }

        public ValidationResult ValidateProfilePicture(IFormFile file)
        {
            return ValidateFile(file, FileType.ProfilePicture);
        }

        public ValidationResult ValidateDocument(IFormFile file)
        {
            // For general documents, accept both resumes and image formats
            var errors = new List<string>();

            if (file == null || file.Length == 0)
            {
                return ValidationResult.Failure("No file provided or file is empty.");
            }

            // Max 5MB for general documents
            if (file.Length > _settings.Value.MaxResumeSize)
            {
                var maxSizeMB = _settings.Value.MaxResumeSize / 1024.0 / 1024.0;
                errors.Add($"File size exceeds maximum limit of {maxSizeMB:F2}MB.");
            }

            // Accept both document and image formats
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var allowedExtensions = _settings.Value.AllowedResumeExtensions
                .Concat(_settings.Value.AllowedImageExtensions).ToList();
            
            if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
            {
                errors.Add($"File type '{extension}' is not allowed. Allowed types: PDF, DOC, DOCX, JPG, PNG");
            }

            // Validate file name
            if (ContainsInvalidCharacters(file.FileName))
            {
                errors.Add("File name contains invalid characters.");
            }

            if (errors.Any())
            {
                _logger.LogWarning("Document validation failed for {FileName}: {Errors}", 
                    file.FileName, string.Join("; ", errors));
                return ValidationResult.Failure(errors);
            }

            return ValidationResult.Success();
        }

        public ValidationResult ValidateFile(IFormFile file, FileType fileType)
        {
            var errors = new List<string>();

            // Check if file is provided
            if (file == null || file.Length == 0)
            {
                return ValidationResult.Failure("No file provided or file is empty.");
            }

            // Get file settings based on type
            var maxSize = fileType switch
            {
                FileType.Resume => _settings.Value.MaxResumeSize,
                FileType.ProfilePicture => _settings.Value.MaxProfilePictureSize,
                FileType.Document => _settings.Value.MaxDocumentSize,
                _ => _settings.Value.MaxResumeSize
            };

            var allowedExtensions = fileType switch
            {
                FileType.Resume => _settings.Value.AllowedResumeExtensions,
                FileType.ProfilePicture => _settings.Value.AllowedImageExtensions,
                FileType.Document => _settings.Value.AllowedDocumentExtensions,
                _ => _settings.Value.AllowedResumeExtensions
            };

            var allowedMimeTypes = fileType switch
            {
                FileType.Resume => _resumeMimeTypes,
                FileType.ProfilePicture => _imageMimeTypes,
                FileType.Document => _documentMimeTypes,
                _ => _resumeMimeTypes
            };

            // Validate file size
            if (file.Length > maxSize)
            {
                var maxSizeMB = maxSize / 1024.0 / 1024.0;
                errors.Add($"File size exceeds maximum limit of {maxSizeMB:F2}MB. Current size: {file.Length / 1024.0 / 1024.0:F2}MB");
            }

            // Validate file extension
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
            {
                errors.Add($"File type '{extension}' is not allowed. Allowed types: {string.Join(", ", allowedExtensions)}");
            }

            // Validate MIME type
            if (!string.IsNullOrEmpty(file.ContentType) && !allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
            {
                errors.Add($"Invalid file content type '{file.ContentType}'. Expected: {string.Join(", ", allowedMimeTypes)}");
            }

            // Validate file name
            if (ContainsInvalidCharacters(file.FileName))
            {
                errors.Add("File name contains invalid characters.");
            }

            // Check file signature (magic numbers) for additional security
            if (!ValidateFileSignature(file, fileType))
            {
                errors.Add("File signature does not match the expected file type. The file may be corrupted or disguised.");
            }

            if (errors.Any())
            {
                _logger.LogWarning("File validation failed for {FileName}: {Errors}", 
                    file.FileName, string.Join("; ", errors));
                return ValidationResult.Failure(errors);
            }

            _logger.LogInformation("File validation successful for {FileName}", file.FileName);
            return ValidationResult.Success();
        }

        private bool ContainsInvalidCharacters(string fileName)
        {
            var invalidChars = Path.GetInvalidFileNameChars();
            return fileName.IndexOfAny(invalidChars) >= 0;
        }

        private bool ValidateFileSignature(IFormFile file, FileType fileType)
        {
            try
            {
                using var reader = new BinaryReader(file.OpenReadStream());
                var headerBytes = reader.ReadBytes(8);

                if (headerBytes.Length < 4)
                    return false;

                return fileType switch
                {
                    FileType.Resume => IsValidResumeSignature(headerBytes),
                    FileType.ProfilePicture => IsValidImageSignature(headerBytes),
                    FileType.Document => IsValidDocumentSignature(headerBytes),
                    _ => true
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating file signature for {FileName}", file.FileName);
                return false;
            }
        }

        private bool IsValidResumeSignature(byte[] headerBytes)
        {
            // PDF signature: %PDF (25 50 44 46)
            if (headerBytes.Length >= 4 && 
                headerBytes[0] == 0x25 && 
                headerBytes[1] == 0x50 && 
                headerBytes[2] == 0x44 && 
                headerBytes[3] == 0x46)
                return true;

            // DOC signature: D0 CF 11 E0 A1 B1 1A E1
            if (headerBytes.Length >= 8 &&
                headerBytes[0] == 0xD0 && 
                headerBytes[1] == 0xCF && 
                headerBytes[2] == 0x11 && 
                headerBytes[3] == 0xE0)
                return true;

            // DOCX signature (ZIP): 50 4B 03 04 or 50 4B 05 06 or 50 4B 07 08
            if (headerBytes.Length >= 4 &&
                headerBytes[0] == 0x50 && 
                headerBytes[1] == 0x4B &&
                (headerBytes[2] == 0x03 || headerBytes[2] == 0x05 || headerBytes[2] == 0x07))
                return true;

            return false;
        }

        private bool IsValidImageSignature(byte[] headerBytes)
        {
            // JPEG signature: FF D8 FF
            if (headerBytes.Length >= 3 &&
                headerBytes[0] == 0xFF && 
                headerBytes[1] == 0xD8 && 
                headerBytes[2] == 0xFF)
                return true;

            // PNG signature: 89 50 4E 47 0D 0A 1A 0A
            if (headerBytes.Length >= 8 &&
                headerBytes[0] == 0x89 && 
                headerBytes[1] == 0x50 && 
                headerBytes[2] == 0x4E && 
                headerBytes[3] == 0x47)
                return true;

            // GIF signature: 47 49 46 38
            if (headerBytes.Length >= 4 &&
                headerBytes[0] == 0x47 && 
                headerBytes[1] == 0x49 && 
                headerBytes[2] == 0x46 && 
                headerBytes[3] == 0x38)
                return true;

            return false;
        }

        private bool IsValidDocumentSignature(byte[] headerBytes)
        {
            // PDF signature: %PDF (25 50 44 46)
            if (headerBytes.Length >= 4 && 
                headerBytes[0] == 0x25 && 
                headerBytes[1] == 0x50 && 
                headerBytes[2] == 0x44 && 
                headerBytes[3] == 0x46)
                return true;

            // DOC signature: D0 CF 11 E0 A1 B1 1A E1
            if (headerBytes.Length >= 8 &&
                headerBytes[0] == 0xD0 && 
                headerBytes[1] == 0xCF && 
                headerBytes[2] == 0x11 && 
                headerBytes[3] == 0xE0)
                return true;

            // DOCX signature (ZIP): 50 4B 03 04 or 50 4B 05 06 or 50 4B 07 08
            if (headerBytes.Length >= 4 &&
                headerBytes[0] == 0x50 && 
                headerBytes[1] == 0x4B &&
                (headerBytes[2] == 0x03 || headerBytes[2] == 0x05 || headerBytes[2] == 0x07))
                return true;

            // TXT and RTF signatures are variable; typically, TXT files might not have a specific magic number,
            // and RTF files start with {\\rtf and typically have a length greater than 10 bytes.
            if (headerBytes.Length >= 10 &&
                headerBytes[0] == 0x7B && 
                headerBytes[1] == 0x5C && 
                headerBytes[2] == 0x72 && 
                headerBytes[3] == 0x74 && 
                headerBytes[4] == 0x66 && 
                headerBytes[5] == 0x31 && 
                headerBytes[6] == 0x2E && 
                headerBytes[7] == 0x30)
                return true;

            return false;
        }
    }
}
