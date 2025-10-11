# Sample Data Creation Guide

## ?? Quick Way to See Charts with Data

If you want to quickly populate your system with test data to see the beautiful charts in action, here's what you can do:

## Option 1: Using Swagger/API (Recommended)

### Step 1: Access Swagger UI
```
1. Start backend: dotnet run
2. Open: https://localhost:7157/swagger
3. Authorize with admin credentials
```

### Step 2: Create Sample Jobs

Use the **POST /api/jobs** endpoint with these sample payloads:

#### IT Department Jobs
```json
{
  "title": "Senior Full Stack Developer",
  "description": "We are looking for an experienced full stack developer with expertise in .NET and React. The ideal candidate will have 5+ years of experience and strong problem-solving skills.",
  "department": "Information Technology",
  "location": "Johannesburg, Gauteng",
  "employmentType": "Full-time",
  "experienceLevel": "Senior",
  "closingDate": "2024-12-31",
  "salaryRangeMin": 600000,
  "salaryRangeMax": 850000,
  "currency": "ZAR"
}
```

```json
{
  "title": "Junior Frontend Developer",
  "description": "Join our growing team as a junior frontend developer. You'll work with React, TypeScript, and modern web technologies.",
  "department": "Information Technology",
  "location": "Cape Town, Western Cape",
  "employmentType": "Full-time",
  "experienceLevel": "Entry",
  "closingDate": "2024-12-31",
  "salaryRangeMin": 300000,
  "salaryRangeMax": 450000,
  "currency": "ZAR"
}
```

#### HR Department Jobs
```json
{
  "title": "HR Manager",
  "description": "Lead our HR department and manage recruitment, employee relations, and compliance. 8+ years experience required.",
  "department": "Human Resources",
  "location": "Johannesburg, Gauteng",
  "employmentType": "Full-time",
  "experienceLevel": "Senior",
  "closingDate": "2024-12-31",
  "salaryRangeMin": 550000,
  "salaryRangeMax": 750000,
  "currency": "ZAR"
}
```

```json
{
  "title": "Recruitment Coordinator",
  "description": "Support the recruitment team in candidate sourcing, screening, and interview coordination.",
  "department": "Human Resources",
  "location": "Durban, KwaZulu-Natal",
  "employmentType": "Full-time",
  "experienceLevel": "Mid",
  "closingDate": "2024-12-31",
  "salaryRangeMin": 350000,
  "salaryRangeMax": 500000,
  "currency": "ZAR"
}
```

#### Marketing Department Jobs
```json
{
  "title": "Digital Marketing Manager",
  "description": "Lead our digital marketing initiatives including SEO, SEM, social media, and content marketing.",
  "department": "Marketing",
  "location": "Cape Town, Western Cape",
  "employmentType": "Full-time",
  "experienceLevel": "Senior",
  "closingDate": "2024-12-31",
  "salaryRangeMin": 500000,
  "salaryRangeMax": 700000,
  "currency": "ZAR"
}
```

```json
{
  "title": "Social Media Specialist",
  "description": "Create engaging content and manage our social media presence across multiple platforms.",
  "department": "Marketing",
  "location": "Remote - South Africa",
  "employmentType": "Contract",
  "experienceLevel": "Entry",
  "closingDate": "2024-12-31",
  "salaryRangeMin": 250000,
  "salaryRangeMax": 400000,
  "currency": "ZAR"
}
```

#### Finance Department Jobs
```json
{
  "title": "Financial Analyst",
  "description": "Perform financial analysis, budgeting, and forecasting to support business decisions.",
  "department": "Finance",
  "location": "Johannesburg, Gauteng",
  "employmentType": "Full-time",
  "experienceLevel": "Mid",
  "closingDate": "2024-12-31",
  "salaryRangeMin": 450000,
  "salaryRangeMax": 600000,
  "currency": "ZAR"
}
```

#### Operations Department Jobs
```json
{
  "title": "Operations Manager",
  "description": "Oversee daily operations, process improvement, and team management.",
  "department": "Operations",
  "location": "Pretoria, Gauteng",
  "employmentType": "Full-time",
  "experienceLevel": "Senior",
  "closingDate": "2024-12-31",
  "salaryRangeMin": 550000,
  "salaryRangeMax": 750000,
  "currency": "ZAR"
}
```

```json
{
  "title": "Operations Coordinator",
  "description": "Support operations team with logistics, scheduling, and vendor management.",
  "department": "Operations",
  "location": "Durban, KwaZulu-Natal",
  "employmentType": "Part-time",
  "experienceLevel": "Entry",
  "closingDate": "2024-12-31",
  "salaryRangeMin": 200000,
  "salaryRangeMax": 300000,
  "currency": "ZAR"
}
```

### Step 3: Approve Jobs (Admin Only)

For each created job:
```
1. Get job ID from response
2. Use PUT /api/jobs/{id}/approve endpoint
3. Set isApproved: true
```

### Step 4: Publish Jobs

For each approved job:
```
1. Use PUT /api/jobs/{id} endpoint
2. Set isPublished: true
```

### Step 5: Create Applications

Use **POST /api/applications** endpoint:

```json
{
  "jobId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+27 82 123 4567",
  "coverLetter": "I am very interested in this position...",
  "cvFile": "(upload a PDF file)"
}
```

Create 3-5 applications per job with different statuses:
- Some in "New"
- Some in "Screening"
- Some in "Interview"

## Option 2: Using Frontend UI

### Create Jobs
1. Login as Admin/Recruiter
2. Go to Jobs ? Create Job
3. Fill in the form with sample data above
4. Submit and approve each job

### Create Applications
1. Logout
2. Go to Jobs (public view)
3. Apply to each job
4. Fill in application form
5. Upload CV
6. Submit

### Update Application Status
1. Login as Admin/Recruiter
2. Go to Applications
3. Click on each application
4. Change status to Screening, Interview, etc.

## ?? Expected Results After Data Creation

Once you have this sample data:

### Department Analytics Tab Will Show:
```
Information Technology:
- 2 jobs total
- 2 active jobs
- ~8-10 applications
- Avg 4-5 per job

Human Resources:
- 2 jobs total
- 2 active jobs
- ~6-8 applications
- Avg 3-4 per job

Marketing:
- 2 jobs total
- 2 active jobs
- ~6-8 applications
- Avg 3-4 per job

Finance:
- 1 job total
- 1 active job
- ~3-4 applications
- Avg 3-4 per job

Operations:
- 2 jobs total
- 2 active jobs
- ~6-8 applications
- Avg 3-4 per job
```

### Distribution Charts Will Show:
```
Employment Type:
- Full-time: 7 jobs (77%)
- Contract: 1 job (11%)
- Part-time: 1 job (11%)

Experience Level:
- Entry: 3 jobs (33%)
- Mid: 2 jobs (22%)
- Senior: 4 jobs (44%)

Application Status:
- New: ~30-40%
- Screening: ~30-40%
- Interview: ~20-30%
```

## ?? Pro Tips

### For Best Chart Visualization:
1. Create at least 8-10 jobs across 4-5 departments
2. Add 3-5 applications per job
3. Vary the statuses (New, Screening, Interview)
4. Mix employment types and experience levels

### Quick Bulk Creation:
If you're comfortable with SQL:
```sql
-- Run these in your database after creating jobs via API
-- This sets various statuses quickly

UPDATE JobApplications SET Status = 'Screening' WHERE Id % 3 = 0;
UPDATE JobApplications SET Status = 'Interview' WHERE Id % 5 = 0;
UPDATE JobApplications SET Status = 'New' WHERE Status IS NULL;
```

## ? Verification Checklist

After creating sample data:
- [ ] At least 8 jobs created
- [ ] At least 4 different departments
- [ ] All jobs approved and published
- [ ] At least 25-30 applications created
- [ ] Applications have varied statuses
- [ ] Mix of employment types (Full-time, Part-time, Contract)
- [ ] Mix of experience levels (Entry, Mid, Senior)

## ?? Ready to View!

Once data is created:
1. Go to Reports page
2. Click "Department Analytics" tab
3. See beautiful charts with real data
4. Click "Distributions" tab
5. See pie charts with distributions
6. Try exporting to Excel

---

**Your charts will now be filled with meaningful data!** ???
