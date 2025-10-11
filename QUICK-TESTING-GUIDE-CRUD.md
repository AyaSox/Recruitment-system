# ?? Quick Testing Guide - CRUD Operations & Success Messages

## ? Fixed & Ready to Test

### 1. **Job Deletion Fix** ?
**What was fixed**: 500 error when deleting jobs with applications
**Now returns**: Clear 400 Bad Request with message

### Test Steps:
```bash
# 1. Create a test job (as Admin/Recruiter)
POST http://localhost:5173/api/jobs
{
  "title": "Test Job - Do Not Apply",
  "description": "Testing job deletion",
  "department": "IT",
  "location": "Cape Town",
  "closingDate": "2025-12-31"
}

# 2. Try to delete it WITHOUT applications
DELETE http://localhost:5173/api/jobs/{id}
? Expected: 200 OK with message "Job deleted successfully."

# 3. Create another job and submit an application to it
POST http://localhost:5173/api/applications
{
  "jobId": {id},
  "coverLetter": "Test application"
}

# 4. Try to delete job WITH applications
DELETE http://localhost:5173/api/jobs/{id}
? Expected: 400 Bad Request with message "Cannot delete job with ID X because it has Y application(s)."
```

## ?? Test All Success Messages

### Jobs

#### Create Job
```http
POST /api/jobs
Content-Type: application/json

{
  "title": "Software Engineer",
  "description": "Join our team",
  "department": "IT",
  "location": "Cape Town",
  "closingDate": "2025-12-31",
  "skills": []
}

? Expected Response:
{
  "success": true,
  "message": "Job created successfully. It is now pending approval.",
  "data": { /* job data */ }
}
```

#### Update Job
```http
PUT /api/jobs/6
Content-Type: application/json

{
  "id": 6,
  "title": "Senior Software Engineer",
  "description": "Updated description",
  "isPublished": true,
  ...
}

? Expected Response:
{
  "success": true,
  "message": "Job updated and published successfully.",
  "data": { /* job data */ }
}
```

#### Approve Job (Admin only)
```http
PUT /api/jobs/6/approve
Content-Type: application/json

{
  "jobId": 6,
  "isApproved": true,
  "approvalNotes": "Looks good!"
}

? Expected Response:
{
  "success": true,
  "message": "Job approved successfully. The recruiter can now publish it.",
  "data": { /* job data */ }
}
```

#### Delete Job
```http
DELETE /api/jobs/6

? Expected Response (no applications):
{
  "success": true,
  "message": "Job deleted successfully."
}

? Expected Response (has applications):
{
  "error": "Cannot delete job with ID 6 because it has 3 application(s)."
}
```

### Applications

#### Submit Application
```http
POST /api/applications
Content-Type: multipart/form-data

jobId: 1
coverLetter: "I'm interested in this position"
resume: [file]
certificates: [file1, file2]
qualifications: [file]

? Expected Response:
{
  "success": true,
  "message": "Application submitted successfully! You will receive a confirmation email shortly.",
  "data": { /* application data */ }
}
```

#### Update Application Status
```http
PUT /api/applications/5/status
Content-Type: application/json

{
  "id": 5,
  "status": "Interviewing",
  "recruiterNotes": "Moving forward with interview"
}

? Expected Response:
{
  "success": true,
  "message": "Application status updated to 'Interviewing' successfully. The applicant has been notified.",
  "data": { /* application data */ }
}
```

### Interviews

#### Schedule Interview
```http
POST /api/interviews
Content-Type: application/json

{
  "jobApplicationId": 5,
  "scheduledDate": "2025-11-15T14:00:00Z",
  "durationMinutes": 60,
  "interviewType": "Technical",
  "location": "https://zoom.us/j/123456"
}

? Expected Response:
{
  "success": true,
  "message": "Interview scheduled successfully. The candidate has been notified via email.",
  "data": { /* interview data */ }
}
```

#### Update Interview
```http
PUT /api/interviews/3
Content-Type: application/json

{
  "id": 3,
  "scheduledDate": "2025-11-16T10:00:00Z",
  ...
}

? Expected Response:
{
  "success": true,
  "message": "Interview updated successfully. The candidate has been notified of any changes.",
  "data": { /* interview data */ }
}
```

#### Complete Interview
```http
PUT /api/interviews/3/complete
Content-Type: application/json

{
  "interviewId": 3,
  "feedback": "Excellent candidate",
  "rating": 5
}

? Expected Response:
{
  "success": true,
  "message": "Interview marked as completed successfully.",
  "data": { /* interview data */ }
}
```

#### Cancel Interview
```http
PUT /api/interviews/3/cancel

? Expected Response:
{
  "success": true,
  "message": "Interview cancelled successfully. The candidate has been notified."
}
```

#### Delete Interview
```http
DELETE /api/interviews/3

? Expected Response:
{
  "success": true,
  "message": "Interview deleted successfully."
}
```

## ?? Frontend Implementation

### Update Services to Show Messages

#### job.service.ts
```typescript
async deleteJob(id: number): Promise<{ success: boolean; message: string }> {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
}

// Usage in component:
try {
  const result = await JobService.deleteJob(id);
  if (result.success) {
    toast.success(result.message);
    navigate('/jobs');
  }
} catch (error: any) {
  // Error already shown by api interceptor
}
```

#### application.service.ts
```typescript
async submitApplication(
  data: CreateApplicationRequest,
  resumeFile: File,
  certificates?: File[],
  qualifications?: File[],
  otherDocuments?: File[]
): Promise<{ success: boolean; message: string; data: Application }> {
  const formData = new FormData();
  // ... add all data ...
  
  const response = await api.post('/applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

// Usage in component:
try {
  const result = await ApplicationService.submitApplication(...);
  if (result.success) {
    toast.success(result.message);
    navigate('/my-applications');
  }
} catch (error: any) {
  // Error already shown by api interceptor
}
```

#### interview.service.ts
```typescript
async scheduleInterview(data: CreateInterviewDto): Promise<{ success: boolean; message: string; data: Interview }> {
  const response = await api.post('/interviews', data);
  return response.data;
}

// Usage in component:
try {
  const result = await InterviewService.scheduleInterview(data);
  if (result.success) {
    toast.success(result.message);
    navigate('/interviews');
  }
} catch (error: any) {
  // Error already shown by api interceptor
}
```

## ?? Error Testing

### Test Error Scenarios

#### 1. Duplicate Application
```http
POST /api/applications (apply to same job twice)

? Expected: 400 Bad Request
{
  "error": "You have already applied to this job"
}
```

#### 2. Closed Job
```http
POST /api/applications (apply to expired job)

? Expected: 400 Bad Request
{
  "error": "The job 'Software Engineer' is no longer accepting applications as the closing date has passed."
}
```

#### 3. Job Not Found
```http
GET /api/jobs/99999

? Expected: 404 Not Found
{
  "error": "Job with ID '99999' was not found."
}
```

#### 4. Interview Already Completed
```http
PUT /api/interviews/3 (update completed interview)

? Expected: 400 Bad Request
{
  "error": "Interview 3 has already been completed and cannot be modified."
}
```

#### 5. File Too Large
```http
POST /api/applications (with file > 5MB)

? Expected: 400 Bad Request
{
  "error": "File size exceeds the limit (5MB) for certificate.pdf"
}
```

## ? Verification Checklist

### Jobs
- [ ] Create job shows success message
- [ ] Update job shows success message
- [ ] Publish job shows appropriate message
- [ ] Approve job shows success message
- [ ] Reject job shows success message
- [ ] Delete job (no apps) shows success message
- [ ] Delete job (has apps) shows error message

### Applications
- [ ] Submit application shows success message
- [ ] Duplicate application shows error message
- [ ] Update status shows success message
- [ ] File validation errors are clear

### Interviews
- [ ] Schedule interview shows success message
- [ ] Update interview shows success message
- [ ] Complete interview shows success message
- [ ] Cancel interview shows success message
- [ ] Delete interview shows success message
- [ ] Update completed interview shows error

## ?? Quick Test Commands

### Using curl
```bash
# Test job deletion (replace TOKEN and ID)
curl -X DELETE http://localhost:5000/api/jobs/6 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -v

# Test application submission
curl -X POST http://localhost:5000/api/applications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "jobId=1" \
  -F "coverLetter=Test application" \
  -F "resume=@resume.pdf" \
  -v

# Test interview scheduling
curl -X POST http://localhost:5000/api/interviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobApplicationId": 5,
    "scheduledDate": "2025-11-15T14:00:00Z",
    "durationMinutes": 60,
    "interviewType": "Technical",
    "location": "Zoom"
  }' \
  -v
```

### Using Postman
1. Import the endpoints from the OpenAPI spec
2. Set Authorization header with JWT token
3. Test each endpoint
4. Verify response structure matches expectations

## ?? Success Criteria

All CRUD operations should:
1. ? Return proper HTTP status codes
2. ? Include success/error messages
3. ? Provide clear, actionable feedback
4. ? Handle edge cases gracefully
5. ? Log errors appropriately
6. ? Not expose sensitive information in errors

## ?? Response Time Goals

- GET operations: < 200ms
- POST/PUT operations: < 500ms
- DELETE operations: < 300ms
- File uploads: < 2s (depending on size)

## ?? Security Checks

- [ ] Authorization headers required
- [ ] Role-based access enforced
- [ ] File size limits enforced
- [ ] File type validation working
- [ ] SQL injection prevention
- [ ] XSS protection enabled

## ?? Ready to Deploy!

Once all tests pass, the application is ready for production deployment with:
- ? Proper error handling
- ? Consistent success messages
- ? Good user experience
- ? Clear feedback on all actions
