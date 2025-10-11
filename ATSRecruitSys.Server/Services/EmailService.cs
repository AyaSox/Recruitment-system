using System.Net;
using System.Net.Mail;

namespace ATSRecruitSys.Server.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;
        private readonly IWebHostEnvironment _environment;

        public EmailService(
            IConfiguration configuration, 
            ILogger<EmailService> logger,
            IWebHostEnvironment environment)
        {
            _configuration = configuration;
            _logger = logger;
            _environment = environment;
        }

        /// <summary>
        /// Check if email notifications are enabled
        /// </summary>
        private bool EmailNotificationsEnabled()
        {
            var enabled = _configuration.GetValue<bool>("EmailSettings:EnableEmailNotifications");
            return enabled;
        }

        /// <summary>
        /// Gets the standard 1-month timeline note
        /// </summary>
        private string GetTimelineNote()
        {
            return "Should you not hear from us within 1 month after the closing date, please consider your application unsuccessful.";
        }

        /// <summary>
        /// Sends an email using the configured SMTP settings
        /// </summary>
        public async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            if (!EmailNotificationsEnabled())
            {
                _logger.LogInformation("Email notifications are disabled. Skipping email to {Email}", to);
                return;
            }

            var smtpSettings = _configuration.GetSection("EmailSettings");
            var smtpServer = smtpSettings["SmtpServer"];
            var smtpPort = int.Parse(smtpSettings["SmtpPort"] ?? "587");
            var smtpUsername = smtpSettings["SmtpUsername"];
            var smtpPassword = smtpSettings["SmtpPassword"];
            var fromEmail = smtpSettings["FromEmail"];
            var fromName = smtpSettings["FromName"];

            using var client = new SmtpClient(smtpServer, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail ?? "", fromName ?? "ATS Recruitment System"),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };

            mailMessage.To.Add(to);

            try
            {
                await client.SendMailAsync(mailMessage);
                _logger.LogInformation("Email sent successfully to {Email}", to);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {Email}", to);
                // Don't throw - email failures shouldn't break the application
            }
        }

        /// <summary>
        /// Gets a standardized email template
        /// </summary>
        protected string GetEmailTemplate(string title, string body)
        {
            return $@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>{title}</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }}
        .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 5px 5px; }}
        .footer {{ text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px; }}
        .timeline-note {{ background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; color: #856404; }}
        h2 {{ color: #007bff; margin-top: 0; }}
        strong {{ color: #007bff; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>ATS Recruitment System</h1>
        </div>
        <div class='content'>
            {body}
        </div>
        <div class='footer'>
            <p>&copy; 2025 ATS Recruitment System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
        }

        /// <summary>
        /// Send application received confirmation with 1-month timeline note
        /// </summary>
        public async Task SendApplicationReceivedAsync(
            string recipientEmail, 
            string candidateName, 
            string jobTitle,
            DateTime jobClosingDate)
        {
            var subject = $"Application Received: {jobTitle}";
            var body = $@"
                <h2>Application Confirmation</h2>
                <p>Dear {candidateName},</p>
                <p>Thank you for applying for the position of <strong>{jobTitle}</strong>.</p>
                <p>We have successfully received your application and it is currently being reviewed by our recruitment team.</p>
                
                <div class='timeline-note'>
                    <strong>Important:</strong> {GetTimelineNote()}
                </div>
                
                <p>Thank you for your interest in joining our team!</p>
                <p>Best regards,<br />The Recruitment Team</p>";

            var htmlBody = GetEmailTemplate(subject, body);
            await SendEmailAsync(recipientEmail, subject, htmlBody);
        }

        /// <summary>
        /// Send simple application confirmation for external candidates
        /// </summary>
        public async Task SendSimpleApplicationConfirmationAsync(
            string recipientEmail, 
            string candidateName, 
            string jobTitle,
            DateTime jobClosingDate)
        {
            var subject = $"Thank you for your application - {jobTitle}";
            var body = $@"
                <h2>Application Received</h2>
                <p>Dear {candidateName},</p>
                <p>Thank you for your interest in the position of <strong>{jobTitle}</strong>.</p>
                <p>We have successfully received your CV and application details. Our recruitment team will review your application and contact you if your profile matches our requirements.</p>
                
                <div class='timeline-note'>
                    <strong>Please note:</strong> {GetTimelineNote()}
                </div>
                
                <p>We appreciate the time you took to apply and your interest in joining our organization.</p>
                <p>Best regards,<br />The Recruitment Team</p>";

            var htmlBody = GetEmailTemplate(subject, body);
            await SendEmailAsync(recipientEmail, subject, htmlBody);
        }

        /// <summary>
        /// Send application status change notification with 1-month timeline note
        /// </summary>
        public async Task SendApplicationStatusChangeAsync(
            string recipientEmail,
            string candidateName,
            string jobTitle,
            string newStatus,
            DateTime jobClosingDate)
        {
            var subject = $"Application Status Update: {jobTitle}";
            var body = $@"
                <h2>Application Status Update</h2>
                <p>Dear {candidateName},</p>
                <p>We wanted to update you on the status of your application for the position of <strong>{jobTitle}</strong>.</p>
                <p><strong>New Status:</strong> {newStatus}</p>
                
                <div class='timeline-note'>
                    <strong>Please note:</strong> {GetTimelineNote()}
                </div>
                
                <p>Best regards,<br />The Recruitment Team</p>";

            var htmlBody = GetEmailTemplate(subject, body);
            await SendEmailAsync(recipientEmail, subject, htmlBody);
        }

        /// <summary>
        /// Send application status update notification
        /// </summary>
        public async Task SendApplicationStatusUpdateAsync(string toEmail, string applicantName, string jobTitle, string newStatus)
        {
            try
            {
                var subject = $"Application Status Update - {jobTitle}";
                var body = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                        <div style='background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;'>
                            <h2 style='color: #333; margin: 0;'>Application Status Update</h2>
                        </div>
                        
                        <p>Dear {applicantName},</p>
                        
                        <p>We wanted to update you on the status of your application for the position:</p>
                        
                        <div style='background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                            <strong>Job Title:</strong> {jobTitle}<br>
                            <strong>New Status:</strong> <span style='color: #28a745; font-weight: bold;'>{newStatus}</span>
                        </div>
                        
                        {GetStatusMessage(newStatus)}
                        
                        <p>Thank you for your interest in joining our organization.</p>
                        
                        <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 30px; font-size: 0.9em; color: #666;'>
                            <p><strong>ATS Recruitment System</strong></p>
                            <p>This is an automated message. Please do not reply to this email.</p>
                        </div>
                    </div>";

                await SendEmailAsync(toEmail, subject, body);
                _logger.LogInformation("Application status update email sent to {Email} for job {JobTitle} - Status: {Status}", 
                    toEmail, jobTitle, newStatus);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send application status update email to {Email}", toEmail);
                throw;
            }
        }

        private string GetStatusMessage(string status)
        {
            return status.ToUpper() switch
            {
                "NEW" => "<p>Your application has been received and is under review.</p>",
                "SCREENING" => "<p>Your application has passed the initial review and is now being screened by our recruitment team.</p>",
                "INTERVIEW" => "<p>Congratulations! We would like to invite you for an interview. Our team will contact you shortly to schedule a convenient time.</p>",
                "OFFER" => "<p><strong>Congratulations!</strong> We are pleased to offer you the position. Our HR team will contact you with the details.</p>",
                "REJECTED" => "<p>Thank you for your interest in this position. Unfortunately, we have decided to move forward with other candidates at this time. We encourage you to apply for future opportunities.</p>",
                "WITHDRAWN" => "<p>We understand that you have withdrawn your application. Thank you for your interest in our organization.</p>",
                _ => "<p>Your application status has been updated. If you have any questions, please feel free to contact us.</p>"
            };
        }
    }
}