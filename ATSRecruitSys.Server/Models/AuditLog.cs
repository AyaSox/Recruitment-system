namespace ATSRecruitSys.Server.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string EntityType { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public string OldValues { get; set; } = string.Empty;
        public string NewValues { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string IPAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
    }

    public enum AuditAction
    {
        Create,
        Update,
        Delete,
        Login,
        Logout,
        Export,
        StatusChange,
        Approve,
        Reject,
        Publish,
        Archive
    }

    public enum AuditEntityType
    {
        User,
        Job,
        Application,
        Report
    }
}