# ?? QUICK START - Hangfire Recurring Jobs

## ? What's Done

1. **Deleted** `ATSRecruitSys_Hangfire` database
2. **Switched** to in-memory storage
3. **Created** 5 recurring jobs
4. **Build** successful ?

---

## ?? Recurring Jobs Summary

| Job | Schedule | What It Does |
|-----|----------|--------------|
| **?? Interview Reminders** | Daily 9AM | Emails reminders for tomorrow's interviews |
| **? Job Closing Alerts** | Daily 8AM | Warns recruiters about jobs closing in 3 days |
| **?? Weekly Reports** | Monday 9AM | Sends recruitment summary to all recruiters |
| **??? Expire Old Jobs** | Every hour | Unpublishes jobs past closing date |
| **??? Data Cleanup** | Sunday 2AM | Removes old records (2-3 years old) |

---

## ?? How to Test

### **1. View Dashboard**
```
https://localhost:7148/hangfire
```

### **2. Manually Trigger a Job**
1. Go to dashboard
2. Click "Recurring jobs" tab
3. Find job and click "Trigger now"

### **3. Check Logs**
Look for these messages:
```
? Hangfire recurring jobs configured successfully
   - send-interview-reminders: Daily at 9:00 AM
   - send-job-closing-notifications: Daily at 8:00 AM
   - send-weekly-recruitment-reports: Every Monday at 9:00 AM
   - update-expired-jobs: Every hour
   - cleanup-old-data: Every Sunday at 2:00 AM
```

---

## ?? Important Files

| File | Purpose |
|------|---------|
| `Services/HangfireJobsService.cs` | Contains all job logic |
| `Program.cs` (line ~440) | Job registration |
| `ATSRecruitSys.Server.csproj` | Package: `Hangfire.MemoryStorage` |

---

## ?? Optional: Remove Old BackgroundJobService

**Not needed anymore!** Delete:
```csharp
// In Program.cs, remove this line:
builder.Services.AddScoped<BackgroundJobService>();

// Delete file:
ATSRecruitSys.Server/Services/BackgroundJobService.cs
```

---

## ?? Email Configuration

Make sure emails are enabled in `appsettings.json`:
```json
{
  "EmailSettings": {
    "EnableEmailNotifications": true
  }
}
```

If disabled, jobs will still run but skip sending emails (check logs).

---

## ?? You're Done!

Start your app and check `/hangfire` to see your jobs!

---

**Quick Commands:**
```bash
# Start app
dotnet run --project ATSRecruitSys.Server

# View jobs
Open: https://localhost:7148/hangfire
```

---

*Need help? Check `HANGFIRE-RECURRING-JOBS-COMPLETE.md` for full details.*
