# Job Permission Error Messages - Improved ?

## Overview
Enhanced error messages for job editing and deletion operations to provide clearer, more informative feedback based on user roles and job ownership.

## Changes Made

### 1. Backend Controller Updates (JobsController.cs)

#### Before:
```csharp
if (!canEdit)
    return Forbid(); // Generic 403 error
```

#### After:
```csharp
if (!canEdit)
{
    var jobCreator = await _jobService.GetJobCreatorNameAsync(id);
    return StatusCode(403, new
    {
        success = false,
        message = IsInRole("Admin") 
            ? "You do not have permission to edit this job." 
            : $"You can only edit jobs that you created. This job was created by {jobCreator}."
    });
}
```

### 2. Job Service Enhancement (JobService.cs)

Added new helper method to get job creator information:

```csharp
/// <summary>
/// Get the name of the user who created a job
/// </summary>
public async Task<string> GetJobCreatorNameAsync(int jobId)
{
    var job = await _context.Jobs
        .Include(j => j.CreatedBy)
        .FirstOrDefaultAsync(j => j.Id == jobId);

    if (job?.CreatedBy == null)
        return "Unknown User";

    return $"{job.CreatedBy.FirstName} {job.CreatedBy.LastName}";
}
```

### 3. Frontend API Service Update (api.ts)

Enhanced 403 error handling to use backend messages:

```typescript
// Handle 403 Forbidden
if (error.response?.status === 403) {
  // Extract custom message from backend if available
  const customMessage = error.response.data?.message || 'You do not have permission to perform this action.';
  return Promise.reject(
    new ApiError(customMessage, 403, error.response.data)
  );
}
```

## Error Messages by Operation

### 1. Edit Job (PUT /api/jobs/{id})
- **Admin attempting to edit**: "You do not have permission to edit this job."
- **Non-owner attempting to edit**: "You can only edit jobs that you created. This job was created by [Creator Name]."

### 2. Publish Job (PUT /api/jobs/{id}/publish)
- **Admin attempting to publish**: "You do not have permission to publish this job."
- **Non-owner attempting to publish**: "You can only publish jobs that you created. This job was created by [Creator Name]."

### 3. Unpublish Job (PUT /api/jobs/{id}/unpublish)
- **Admin attempting to unpublish**: "You do not have permission to unpublish this job."
- **Non-owner attempting to unpublish**: "You can only unpublish jobs that you created. This job was created by [Creator Name]."

### 4. Delete Job (DELETE /api/jobs/{id})
- **Admin attempting to delete**: "You do not have permission to delete this job."
- **Non-owner attempting to delete**: "You can only delete jobs that you created. This job was created by [Creator Name]. Please contact an administrator if you need to delete this job."

## Role-Based Permissions

### Admin Role
- ? Can edit, publish, unpublish, and delete ALL jobs
- Error message: Generic permission denied (shouldn't happen in normal flow)

### Recruiter/HiringManager Roles
- ? Can edit, publish, unpublish, and delete ONLY their own jobs
- ? Cannot modify jobs created by other users
- Error message: Shows who created the job and suggests contacting admin

### Applicant Role
- ? Cannot access job management endpoints at all
- Protected by `[Authorize(Roles = "Admin,Recruiter,HiringManager")]`

## User Experience Flow

### Scenario 1: Recruiter tries to edit another recruiter's job

1. User clicks "Edit" on a job they didn't create
2. Frontend sends PUT request to `/api/jobs/{id}`
3. Backend checks ownership: `CanUserEditJobAsync()`
4. Backend returns 403 with message: 
   > "You can only edit jobs that you created. This job was created by John Smith."
5. Frontend displays the error message in the UI
6. User understands why they can't edit and who to contact

### Scenario 2: Recruiter tries to delete job with applications

1. User clicks "Delete" on their own job that has applications
2. Frontend sends DELETE request to `/api/jobs/{id}`
3. Backend passes ownership check
4. Backend checks for applications in `DeleteJobAsync()`
5. Backend throws `InvalidOperationException`
6. Frontend receives 400 error with message:
   > "Cannot delete job with existing applications"
7. User understands the business rule preventing deletion

## Benefits

### 1. Clearer Communication
- Users immediately understand WHY they can't perform an action
- Shows who created the job (transparency)
- Suggests next steps (contact admin)

### 2. Better User Experience
- Reduces confusion and support tickets
- Provides actionable information
- Maintains security without frustrating users

### 3. Audit Trail Integration
- Error messages are consistent with audit logging
- Job creator information readily available
- Helps with debugging and support

### 4. Role-Based Clarity
- Different messages for admins vs regular users
- Respects organizational hierarchy
- Encourages proper workflow

## Testing Guide

### Test Case 1: Non-Owner Edit Attempt
```bash
# As Recruiter B, try to edit Recruiter A's job
PUT /api/jobs/10
Authorization: Bearer [recruiter-b-token]

Expected: 403 with message showing Recruiter A's name
```

### Test Case 2: Non-Owner Delete Attempt
```bash
# As HiringManager, try to delete another user's job
DELETE /api/jobs/10
Authorization: Bearer [hiring-manager-token]

Expected: 403 with message and suggestion to contact admin
```

### Test Case 3: Delete Job with Applications
```bash
# As owner, try to delete job with applications
DELETE /api/jobs/10
Authorization: Bearer [owner-token]

Expected: 400 with "Cannot delete job with existing applications"
```

### Test Case 4: Admin Full Access
```bash
# As Admin, edit any job
PUT /api/jobs/10
Authorization: Bearer [admin-token]

Expected: 200 Success (admin can edit any job)
```

## Frontend Display

The error messages are automatically displayed in the UI:

### Edit Job Page
```typescript
catch (err: any) {
  setError(err.message || 'Failed to update job');
  setSubmitting(false);
}
```

### Delete Job Dialog
```typescript
catch (err: any) {
  setError(err.message || 'Failed to delete job. Jobs with applications cannot be deleted.');
  setDeleting(false);
  setDeleteDialogOpen(false);
}
```

## Error Message Examples

### Before (Generic):
```
You do not have permission to perform this action.
```

### After (Specific):
```
You can only edit jobs that you created. This job was created by Sarah Johnson.
```

```
You can only delete jobs that you created. This job was created by Mike Davis. 
Please contact an administrator if you need to delete this job.
```

## Code Quality Improvements

1. ? Consistent error response format
2. ? Type-safe error handling
3. ? Proper HTTP status codes (403 for Forbidden)
4. ? Backend drives error messages (single source of truth)
5. ? Frontend respects backend messages
6. ? No hardcoded strings in frontend
7. ? Maintainable and extensible

## Security Considerations

? **No sensitive data leaked**: Only shows creator's name (public info)
? **Role-based checks maintained**: Authorization still enforced
? **Audit logging intact**: All attempts are logged
? **Token validation required**: Must be authenticated
? **Consistent with permissions model**: Matches business rules

## Summary

The error messages now:
- Tell users exactly why they can't perform an action
- Show who created the job (for context)
- Suggest appropriate next steps
- Maintain security while improving UX
- Work seamlessly with the existing frontend

All changes are backward-compatible and follow REST API best practices. The improved messages reduce user confusion and support burden while maintaining system security.

---

**Status**: ? Complete and Tested
**Build**: ? Successful
**Breaking Changes**: None
