# ?? Audit Log Export & Reporting - Complete Guide

## ? **What Was Added**

### **Export Formats**
1. ? **CSV Export** - Comprehensive format with all columns
2. ? **Excel Export** - Compatible format (ready for EPPlus upgrade)
3. ? **Compliance Report** - Formatted text report for auditors

## ?? **Export Endpoints**

### **1. CSV Export (Enhanced)**
```http
GET /api/Audit/export?startDate=2025-01-01&endDate=2025-12-31&entityType=Job
```

**Query Parameters**:
- `startDate` (optional) - Filter from date
- `endDate` (optional) - Filter to date
- `userId` (optional) - Filter by user
- `action` (optional) - Filter by action (Create, Update, Delete, etc.)
- `entityType` (optional) - Filter by entity (Job, Application, Interview)
- `searchTerm` (optional) - Search in descriptions

**Response**: `audit_logs_20251007_143000.csv`

**Columns Included**:
```
1. ID                    - Audit log ID
2. Timestamp             - When action occurred
3. User ID               - User identifier
4. User Name             - User's name
5. User Email            - User's email
6. Action                - What was done
7. Entity Type           - What was affected
8. Entity ID             - Which specific item
9. Description           - Human-readable description
10. Old Values           - Before state (JSON)
11. New Values           - After state (JSON)
12. IP Address           - Where from
13. User Agent           - Browser/device info
14. Action Result        - Success/Failed
15. Personal Data Access - POPIA flag
16. Data Export          - Export flag
17. Data Deletion        - Deletion flag
```

### **2. Excel Export**
```http
GET /api/Audit/export/excel?startDate=2025-01-01&endDate=2025-12-31
```

**Same Parameters as CSV**

**Response**: `audit_logs_20251007_143000.csv` (Excel format)

**Note**: Currently returns CSV with Excel MIME type. For true `.xlsx` format, install `EPPlus` or `ClosedXML` package.

### **3. Compliance Report**
```http
GET /api/Audit/export/compliance-report?startDate=2025-01-01&endDate=2025-12-31
```

**Parameters**:
- `startDate` (optional) - Report start date
- `endDate` (optional) - Report end date

**Response**: `compliance_report_20251007_143000.txt`

**Report Sections**:
1. Report Header
2. Summary Statistics
3. POPIA/GDPR Compliance Summary
4. Action Breakdown
5. Entity Type Breakdown
6. Top 10 Most Active Users
7. Critical Actions (Deletes, Cancels)
8. Recent Activity

## ?? **Sample Exports**

### **CSV Export Example**
```csv
"ID","Timestamp","User ID","User Name","User Email","Action","Entity Type","Entity ID","Description","Old Values","New Values","IP Address","User Agent","Action Result","Personal Data Access","Data Export","Data Deletion"
42,"2025-10-07 14:30:00","user-123","john.doe","john@company.com","Publish","Job","7","Published job posting: Senior Developer","{""IsPublished"":false}","{""IsPublished"":true}","192.168.1.100","Mozilla/5.0...","Success","No","No","No"
43,"2025-10-07 14:35:00","user-456","jane.smith","jane@company.com","Submit","Application","45","Submitted application for job: Senior Developer","","{""JobId"":7,""Status"":""Applied""}","192.168.1.101","Chrome/95.0...","Success","No","No","No"
44,"2025-10-07 14:40:00","user-123","john.doe","john@company.com","View","Resume","45","Accessed resume for Jane Smith - Application #45","","","192.168.1.100","Mozilla/5.0...","Success","Yes","No","No"
```

### **Compliance Report Example**
```
???????????????????????????????????????????????????????????????
                  AUDIT LOG COMPLIANCE REPORT                  
???????????????????????????????????????????????????????????????

Report Generated: 2025-10-07 15:00:00 UTC
Period: 2025-01-01 to 2025-10-07

?????????????????????????????????????????????????????????????????
SUMMARY STATISTICS
?????????????????????????????????????????????????????????????????
Total Actions: 1,234
Unique Users: 25
Date Range: 2025-01-01 to 2025-10-07

?????????????????????????????????????????????????????????????????
POPIA/GDPR COMPLIANCE SUMMARY
?????????????????????????????????????????????????????????????????
Personal Data Access Events: 156
Data Export Events: 12
Data Deletion Events: 3

?????????????????????????????????????????????????????????????????
ACTION BREAKDOWN
?????????????????????????????????????????????????????????????????
UpdateStatus         :    450 (36.5%)
Submit               :    320 (25.9%)
View                 :    156 (12.6%)
Create               :     89 (7.2%)
Update               :     78 (6.3%)
Schedule             :     65 (5.3%)
Publish              :     34 (2.8%)
Complete             :     22 (1.8%)
Delete               :     12 (1.0%)
Approve              :      8 (0.6%)

?????????????????????????????????????????????????????????????????
ENTITY TYPE BREAKDOWN
?????????????????????????????????????????????????????????????????
Application          :    770 (62.4%)
Job                  :    201 (16.3%)
Interview            :    174 (14.1%)
Resume               :     89 (7.2%)

?????????????????????????????????????????????????????????????????
TOP 10 MOST ACTIVE USERS
?????????????????????????????????????????????????????????????????
john.doe                       :    234 actions
jane.recruiter                 :    189 actions
mark.admin                     :    145 actions
sarah.hr                       :    123 actions
mike.interviewer               :     98 actions
...

?????????????????????????????????????????????????????????????????
CRITICAL ACTIONS (Delete, Remove, Cancel)
?????????????????????????????????????????????????????????????????
2025-10-07 14:25:00 | admin.user           | Delete          | Job             | Deleted job posting: Junior Developer
2025-10-06 10:30:00 | john.doe             | Cancel          | Interview       | Cancelled interview for Jane Smith - Senior Developer
...

?????????????????????????????????????????????????????????????????
RECENT ACTIVITY (Last 20 Actions)
?????????????????????????????????????????????????????????????????
2025-10-07 14:40:00 | john.doe             | View            | Resume          
2025-10-07 14:35:00 | jane.smith           | Submit          | Application     
2025-10-07 14:30:00 | john.doe             | Publish         | Job             
...

???????????????????????????????????????????????????????????????
                    END OF REPORT                              
???????????????????????????????????????????????????????????????
```

## ?? **Use Cases**

### **1. Regular Compliance Audits**
```bash
# Export last quarter's activity
curl -X GET "https://localhost:5000/api/Audit/export/compliance-report?startDate=2025-07-01&endDate=2025-09-30" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o Q3_2025_Audit_Report.txt
```

### **2. POPIA/GDPR Data Subject Requests**
```bash
# Export all personal data access for a specific user
curl -X GET "https://localhost:5000/api/Audit/export?userId=john.doe@company.com&action=View" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o personal_data_access.csv
```

### **3. Security Incident Investigation**
```bash
# Export all delete actions in last 24 hours
curl -X GET "https://localhost:5000/api/Audit/export?action=Delete&startDate=2025-10-06" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o delete_actions.csv
```

### **4. User Activity Report**
```bash
# Export all actions by specific user
curl -X GET "https://localhost:5000/api/Audit/export?userId=suspicious.user@company.com" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o user_activity.csv
```

### **5. Entity Change History**
```bash
# Export all changes to a specific job
curl -X GET "https://localhost:5000/api/Audit/entity/Job/7" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ?? **Frontend Integration**

### **Download Button Component**
```typescript
// AuditLogViewer.tsx
const exportAuditLogs = async (format: 'csv' | 'excel' | 'report') => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    if (selectedUser) params.append('userId', selectedUser);
    if (selectedAction) params.append('action', selectedAction);
    if (selectedEntityType) params.append('entityType', selectedEntityType);
    
    let endpoint = '';
    let filename = '';
    
    switch (format) {
      case 'csv':
        endpoint = `/Audit/export?${params.toString()}`;
        filename = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'excel':
        endpoint = `/Audit/export/excel?${params.toString()}`;
        filename = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'report':
        endpoint = `/Audit/export/compliance-report?${params.toString()}`;
        filename = `compliance_report_${new Date().toISOString().split('T')[0]}.txt`;
        break;
    }
    
    const response = await api.get(endpoint, {
      responseType: 'blob',
    });
    
    // Create blob and download
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success(`Audit logs exported successfully`);
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    toast.error('Failed to export audit logs');
  }
};

// UI
<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
  <Button
    variant="contained"
    startIcon={<DownloadIcon />}
    onClick={() => exportAuditLogs('csv')}
  >
    Export CSV
  </Button>
  <Button
    variant="outlined"
    startIcon={<DownloadIcon />}
    onClick={() => exportAuditLogs('excel')}
  >
    Export Excel
  </Button>
  <Button
    variant="outlined"
    startIcon={<AssessmentIcon />}
    onClick={() => exportAuditLogs('report')}
  >
    Compliance Report
  </Button>
</Box>
```

## ?? **Excel Integration (Optional Upgrade)**

### **Install EPPlus for True Excel Format**
```bash
dotnet add package EPPlus
```

### **Enhanced Excel Export**
```csharp
using OfficeOpenXml;

private byte[] GenerateExcel(List<AuditLog> logs)
{
    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
    
    using (var package = new ExcelPackage())
    {
        var worksheet = package.Workbook.Worksheets.Add("Audit Logs");
        
        // Header
        worksheet.Cells[1, 1].Value = "ID";
        worksheet.Cells[1, 2].Value = "Timestamp";
        worksheet.Cells[1, 3].Value = "User Name";
        worksheet.Cells[1, 4].Value = "User Email";
        worksheet.Cells[1, 5].Value = "Action";
        worksheet.Cells[1, 6].Value = "Entity Type";
        worksheet.Cells[1, 7].Value = "Entity ID";
        worksheet.Cells[1, 8].Value = "Description";
        worksheet.Cells[1, 9].Value = "IP Address";
        worksheet.Cells[1, 10].Value = "Action Result";
        
        // Style header
        using (var range = worksheet.Cells[1, 1, 1, 10])
        {
            range.Style.Font.Bold = true;
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Color.LightBlue);
        }
        
        // Data
        for (int i = 0; i < logs.Count; i++)
        {
            var log = logs[i];
            var row = i + 2;
            
            worksheet.Cells[row, 1].Value = log.Id;
            worksheet.Cells[row, 2].Value = log.Timestamp;
            worksheet.Cells[row, 3].Value = log.UserName;
            worksheet.Cells[row, 4].Value = log.UserEmail;
            worksheet.Cells[row, 5].Value = log.Action;
            worksheet.Cells[row, 6].Value = log.EntityType;
            worksheet.Cells[row, 7].Value = log.EntityId;
            worksheet.Cells[row, 8].Value = log.Description;
            worksheet.Cells[row, 9].Value = log.IpAddress;
            worksheet.Cells[row, 10].Value = log.ActionResult;
        }
        
        // Auto-fit columns
        worksheet.Cells.AutoFitColumns();
        
        return package.GetAsByteArray();
    }
}
```

## ?? **Security & Permissions**

### **Access Control**
- ? **Admin Only** - All export endpoints require Admin role
- ? **Audit Trail** - Exports themselves are logged
- ? **Data Sanitization** - Personal data is escaped properly

### **Best Practices**
1. **Regular Exports**: Schedule monthly compliance reports
2. **Secure Storage**: Store exports in encrypted location
3. **Access Logging**: All exports are audit-logged
4. **Retention Policy**: Keep exports for 7 years (POPIA)

## ?? **Statistics & Insights**

### **Available via Export**
- Total actions per period
- Most active users
- Entity activity breakdown
- Critical actions (deletes, etc.)
- POPIA compliance metrics
- Personal data access tracking

### **Report Frequency**
- **Daily**: Recent activity monitoring
- **Weekly**: Team activity reports
- **Monthly**: Management summaries
- **Quarterly**: Compliance audits
- **Annual**: Comprehensive reviews

## ?? **Testing the Export**

### **Test 1: Basic CSV Export**
```bash
curl -X GET "http://localhost:5000/api/Audit/export" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -o test_export.csv
```

### **Test 2: Filtered Export**
```bash
curl -X GET "http://localhost:5000/api/Audit/export?entityType=Job&action=Publish" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -o job_publishes.csv
```

### **Test 3: Compliance Report**
```bash
curl -X GET "http://localhost:5000/api/Audit/export/compliance-report" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -o compliance_report.txt
```

### **Test 4: Date Range**
```bash
curl -X GET "http://localhost:5000/api/Audit/export?startDate=2025-10-01&endDate=2025-10-07" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -o weekly_export.csv
```

## ?? **Column Descriptions**

| Column | Description | Example |
|--------|-------------|---------|
| **ID** | Unique audit log identifier | 42 |
| **Timestamp** | When action occurred (UTC) | 2025-10-07 14:30:00 |
| **User ID** | User's unique identifier | abc-123-def |
| **User Name** | User's display name | john.doe |
| **User Email** | User's email address | john@company.com |
| **Action** | Type of action performed | Publish, Create, Delete |
| **Entity Type** | Type of entity affected | Job, Application, Interview |
| **Entity ID** | Specific entity identifier | 7 |
| **Description** | Human-readable description | "Published job: Senior Dev" |
| **Old Values** | Before state (JSON) | `{"IsPublished":false}` |
| **New Values** | After state (JSON) | `{"IsPublished":true}` |
| **IP Address** | Source IP address | 192.168.1.100 |
| **User Agent** | Browser/device info | Mozilla/5.0... |
| **Action Result** | Success/Failed status | Success |
| **Personal Data Access** | POPIA flag | Yes/No |
| **Data Export** | Export event flag | Yes/No |
| **Data Deletion** | Deletion event flag | Yes/No |

## ?? **Quick Reference**

### **Export All Logs**
```
GET /api/Audit/export
```

### **Export with Filters**
```
GET /api/Audit/export?startDate=2025-10-01&entityType=Job
```

### **Compliance Report**
```
GET /api/Audit/export/compliance-report?startDate=2025-01-01
```

### **Excel Format**
```
GET /api/Audit/export/excel
```

---

**Status**: ? **COMPLETE**
**Build**: ? **SUCCESSFUL**
**Formats**: CSV, Excel-compatible, Compliance Report
**Columns**: 17 comprehensive columns
**Filters**: Date, User, Action, Entity, Search
**Ready**: ? **YES**

**You can now export comprehensive audit reports with all relevant columns for compliance and analysis!** ???
