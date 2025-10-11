# ?? AUDIT LOGS & APPLICATION FUNNEL FIXES

## ?? **Issues Identified from Screenshots**

### **Issue 1: Audit Logs Page - 404 Not Found** ?
**Error**: `GET /audit/logs?page=1&pageSize=25` returns **404 (Not Found)**

**Root Cause**: Missing `AuditController.cs` in the backend

**Status**: ? **FIXED** - Controller created

---

### **Issue 2: Application Funnel - 500 Internal Server Error** ?
**Error**: `PUT /applications/13/status` returns **500 (Internal Server Error)**

**Root Cause**: Possible issue with `UpdateApplicationDto` or database constraint

**Status**: ?? **NEEDS INVESTIGATION**

---

### **Issue 3: SignalR/Notification Errors** ?
**Error**: Multiple errors about failing to connect to SignalR Hub
- `Error connecting to SignalR: FailedToNegotiateWithServerError`
- `POST /notificationHub/negotiate?negotiateVersion=1` returns **405 (Method Not Allowed)**

**Root Cause**: SignalR endpoint routing issue

**Status**: ?? **NEEDS FIX**

---

## ? **FIX #1: Audit Controller Created**

I've created the missing `AuditController.cs` with all required endpoints:

### **New File**: `ATSRecruitSys.Server/Controllers/AuditController.cs`

**Endpoints**:
```
GET  /api/audit/logs                    - Get paginated audit logs ?
GET  /api/audit/user/{userId}           - Get user's audit trail ?
GET  /api/audit/entity/{type}/{id}      - Get entity's audit trail ?
GET  /api/audit/export                  - Export to CSV ?
GET  /api/audit/statistics              - Get statistics ?
GET  /api/audit/activity                - Get system activity ?
```

**Features**:
- ? Pagination support
- ? Filtering by date, user, action, entity type
- ? Search functionality
- ? CSV export
- ? Statistics dashboard
- ? Admin-only access

---

## ?? **FIX #2: Application Funnel Status Update**

The error screenshot shows:
```
PUT /applications/13/status
Request failed with status code 500
```

### **Possible Causes**:

1. **Missing or Invalid Status Value**
2. **Database Constraint Violation**
3. **Missing User ID**
4. **Application Not Found**

### **Debug Steps**:

1. **Check Backend Logs**:
```powershell
# In Visual Studio Output window
# Or check: C:\Users\cash\source\repos\ATSRecruitSys\logs\
```

2. **Test Endpoint Directly**:
```powershell
# Test with Postman or curl
curl -X PUT https://localhost:7129/api/applications/13/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 13,
    "status": "Screening",
    "recruiterNotes": "Moving to screening stage"
  }'
```

3. **Check Application Exists**:
```sql
SELECT * FROM JobApplications WHERE Id = 13;
```

4. **Check Status History**:
```sql
SELECT * FROM ApplicationStatusHistory WHERE JobApplicationId = 13;
```

### **Potential Fix**:

The issue might be in the `ApplicationService.UpdateApplicationStatusAsync()` method. Let me check if there's a validation issue:

**Possible Solution**: Ensure the `StatusHistory` collection is initialized before adding:

```csharp
// In ApplicationService.UpdateApplicationStatusAsync
if (application.StatusHistory == null)
{
    application.StatusHistory = new List<ApplicationStatusHistory>();
}

application.StatusHistory.Add(new ApplicationStatusHistory
{
    Status = dto.Status,
    ChangedById = userId,
    Notes = dto.RecruiterNotes
});
```

---

## ?? **FIX #3: SignalR Connection Issues**

### **Error Messages**:
```
POST /notificationHub/negotiate?negotiateVersion=1 - 405 (Method Not Allowed)
Error connecting to SignalR: FailedToNegotiateWithServerError
Failed to complete negotiation with the server: Error: : Status code '405'
```

### **Root Cause**:
SignalR is trying to negotiate a connection but getting a **405 Method Not Allowed** error.

### **Solution**:

#### **Step 1: Verify SignalR Hub is Mapped**

Check `Program.cs` - I can see it's already there:
```csharp
app.MapHub<ATSRecruitSys.Server.Hubs.NotificationHub>("/notificationHub");
```
? This is correct!

#### **Step 2: Check CORS Configuration**

The CORS policy must allow SignalR connections. Update `Program.cs`:

```csharp
// In Program.cs, CORS configuration section
builder.Services.AddCors(options =>
{
    options.AddPolicy("Development", 
        policy => policy
            .WithOrigins("https://localhost:5173", "http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()  // ? THIS IS REQUIRED FOR SIGNALR
            .SetIsOriginAllowed((host) => true)); // ? ADD THIS
});
```

#### **Step 3: Check Frontend SignalR Connection**

Update `notification.service.ts` to handle connection properly:

```typescript
// In notification.service.ts
private async startConnection() {
  try {
    // Make sure to use the correct URL
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7129/notificationHub', {
        accessTokenFactory: () => localStorage.getItem('token') || '',
        transport: signalR.HttpTransportType.WebSockets |
                   signalR.HttpTransportType.ServerSentEvents |
                   signalR.HttpTransportType.LongPolling,
        skipNegotiation: false, // ? DON'T SKIP NEGOTIATION
        withCredentials: true // ? ADD THIS
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    await this.hubConnection.start();
    console.log('SignalR Connected');
  } catch (err) {
    console.error('SignalR Connection Error:', err);
    // Retry after 5 seconds
    setTimeout(() => this.startConnection(), 5000);
  }
}
```

---

## ?? **TESTING CHECKLIST**

### **Test 1: Audit Logs** ?
```
1. Login as Admin
2. Go to: http://localhost:5173/audit-logs
3. Expected: Page loads with audit log data (or "No logs" message)
4. Should NOT see: 404 error
```

### **Test 2: Application Funnel** ??
```
1. Login as Admin/Recruiter
2. Go to: http://localhost:5173/applications/funnel
3. Try dragging an application card
4. Expected: Status updates successfully
5. Should NOT see: 500 error
```

### **Test 3: Notifications** ??
```
1. Login as any user
2. Look for notification bell icon in navbar
3. Check browser console (F12)
4. Expected: "SignalR Connected" message
5. Should NOT see: 405 errors or connection failures
```

---

## ?? **IMPLEMENTATION STEPS**

### **Step 1: Rebuild Backend** (Required for Audit Controller)
```powershell
cd ATSRecruitSys.Server
dotnet build
```

### **Step 2: Restart Backend**
```powershell
# Stop current backend (Ctrl+C)
# Then restart:
dotnet run
```

### **Step 3: Test Audit Logs**
```
Go to: https://localhost:5173/audit-logs
Should work now! ?
```

### **Step 4: Check Application Funnel Logs**
```powershell
# In Visual Studio Output window, look for errors when you try to update status
# The error should tell us what's wrong
```

### **Step 5: Fix SignalR (if needed)**
```
1. Update Program.cs CORS settings
2. Update notification.service.ts connection settings
3. Restart backend
4. Hard refresh frontend (Ctrl+Shift+R)
```

---

## ?? **DEBUGGING COMMANDS**

### **Check if Audit Controller is Registered**:
```csharp
// In Program.cs after app.MapControllers();
var routes = app.Services.GetService<Microsoft.AspNetCore.Routing.EndpointDataSource>();
foreach (var endpoint in routes.Endpoints)
{
    Console.WriteLine(endpoint.DisplayName);
}
```

### **Check SignalR Hub Registration**:
```csharp
// Should see in startup logs:
// Now listening on: https://localhost:7129
// Application started. Press Ctrl+C to shut down.
// SignalR hub mapped: /notificationHub
```

### **Test Audit Endpoint Directly**:
```powershell
# Open browser and go to:
https://localhost:7129/swagger

# Find: GET /api/audit/logs
# Click "Try it out"
# Click "Execute"
# Should see: 200 OK with audit log data
```

---

## ?? **STATUS SUMMARY**

| Issue | Status | Fix Applied | Testing Required |
|-------|--------|-------------|------------------|
| **Audit Logs 404** | ? FIXED | AuditController created | Yes - Test audit logs page |
| **Funnel 500 Error** | ?? INVESTIGATING | Need backend logs | Yes - Check error details |
| **SignalR 405 Error** | ?? NEEDS FIX | CORS update needed | Yes - Test notifications |

---

## ?? **NEXT STEPS**

1. **? DONE**: Created `AuditController.cs`
   
2. **?? TODO**: Investigate Application Funnel 500 error
   - Check backend logs
   - Test endpoint directly
   - Check database constraints

3. **?? TODO**: Fix SignalR connection
   - Update CORS policy
   - Update frontend connection settings
   - Test notification system

4. **? TEST**: After fixes, test all three features

---

## ?? **QUICK FIXES TO TRY NOW**

### **For Application Funnel 500 Error**:

**Option 1**: Check if application exists
```sql
USE ATSRecruitSys;
SELECT * FROM JobApplications WHERE Id = 13;
```

**Option 2**: Try different application
```
Instead of dragging application #13, try a different one
```

**Option 3**: Check browser console
```javascript
// In browser console (F12):
localStorage.getItem('token')  // Should show your JWT token
```

### **For SignalR Errors**:

**Quick Fix**: Disable SignalR temporarily in `notification.service.ts`:
```typescript
// Comment out the connection start:
// this.startConnection();

// Add a mock implementation:
start() {
  console.log('SignalR disabled for testing');
  return Promise.resolve();
}
```

---

## ? **FINAL CHECKLIST**

- [x] AuditController created
- [x] Endpoints defined and documented
- [x] DTOs created for responses
- [ ] Application Funnel error investigated
- [ ] SignalR CORS updated
- [ ] Backend restarted
- [ ] Audit logs tested
- [ ] Application funnel tested
- [ ] Notifications tested

---

**Status**: ?? **PARTIALLY FIXED**

**Next Action**: 
1. Restart backend to load new AuditController
2. Test audit logs page
3. Investigate funnel 500 error with backend logs
4. Fix SignalR if notifications are critical

**Priority**: 
1. ? Audit Logs (Fixed)
2. ?? Application Funnel (High - core feature)
3. ?? SignalR Notifications (Medium - nice-to-have)
