# ?? Quick Start - Test the Fix

## Before Testing

1. **Backend Running**: Ensure ATSRecruitSys.Server is running
2. **Frontend Running**: Ensure atsrecruitsys.client is running
3. **Logged In**: Log in as an Applicant user

## Test Steps

### Test 1: Basic Application (CV Only)
1. Navigate to Jobs page
2. Click "Apply" on any open job
3. Upload a CV (PDF, DOC, or DOCX, max 5MB)
4. Fill cover letter (optional)
5. Rate skills if required
6. Click "Submit Application"
7. ? **Expected**: Success, redirected to My Applications

### Test 2: Application with Certificates
1. Navigate to Jobs page
2. Click "Apply" on any open job
3. Upload a CV
4. Click "Add Certificates" and select 1-2 PDF files
5. Verify files appear in list
6. Click "Submit Application"
7. ? **Expected**: Success with all files

### Test 3: Application with All Documents
1. Navigate to Jobs page
2. Click "Apply" on any open job
3. Upload a CV
4. Add 1-2 certificates
5. Add 1-2 qualifications
6. Add 1-2 other documents
7. Check total file size indicator
8. Click "Submit Application"
9. ? **Expected**: Success with all files saved

### Test 4: File Validation
1. Try uploading a file > 5MB
2. ? **Expected**: Error message about file size
3. Try uploading total > 25MB
4. ? **Expected**: Error message, submit button disabled
5. Try uploading .exe file
6. ? **Expected**: Error message about file type

### Test 5: Delete Files
1. Upload multiple files
2. Click delete icon on each file
3. ? **Expected**: File removed from list
4. Total size updated

## Verify Backend

Check these folders were created with files:
```
ATSRecruitSys.Server/Uploads/
??? Resumes/
?   ??? (CV files)
??? Documents/
    ??? Certificate/
    ?   ??? (certificate files)
    ??? Qualification/
    ?   ??? (qualification files)
    ??? Other/
        ??? (other document files)
```

## Common Issues & Solutions

### Issue: 500 Error on Submit
**Solution**: Check browser console and backend logs for specific error

### Issue: Files Not Saving
**Solution**: Check Uploads folder permissions

### Issue: Skills Not Saving
**Solution**: Verify skills JSON is properly formatted in browser network tab

### Issue: Total Size Wrong
**Solution**: Refresh page and try again

## Success Indicators

? No 500 errors
? Application appears in "My Applications"
? All files saved to correct folders
? Skills properly recorded
? Status history shows "Applied"
? Confirmation email sent (if configured)

## Quick Verification Query

```sql
-- Check latest application
SELECT TOP 1 * FROM JobApplications 
ORDER BY AppliedDate DESC;

-- Check application skills
SELECT * FROM ApplicantSkills 
WHERE JobApplicationId = (SELECT TOP 1 Id FROM JobApplications ORDER BY AppliedDate DESC);
```

## Done!

If all tests pass, the fix is working correctly. Users can now:
- Submit applications without 500 errors
- Upload multiple document types
- Get clear validation feedback
- Have comprehensive application packages
