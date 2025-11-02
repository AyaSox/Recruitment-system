# Employment Equity Fields - Quick Reference ??

## What Changed?

### ? Employment Equity Section Added to Job Form

When creating or editing a job, you now see a new section:

```
???????????????????????????????????????????????????
? Employment Equity (Optional)                    ?
? ? Designate this position as an Employment     ?
?   Equity position in accordance with SA law    ?
?                                                 ?
? ? This is an Employment Equity Position         ?
?                                                 ?
? [If checked:]                                   ?
? ???????????????????????????????????????????    ?
? ? Employment Equity Notes                 ?    ?
? ? [Text area for additional details]      ?    ?
? ???????????????????????????????????????????    ?
???????????????????????????????????????????????????
```

---

## How to Use

### Creating an EE Position
```
1. Fill in job details
2. Scroll to "Employment Equity" section
3. Toggle switch ON
4. Add notes (optional but recommended)
5. Create job
```

### Creating a Regular Position
```
1. Fill in job details
2. Leave "Employment Equity" toggle OFF
3. Create job
```

---

## Example Notes

### Good Examples ?
```
"Preference will be given to candidates from designated groups 
as per our Employment Equity plan."

"This position is designated for candidates from underrepresented 
groups in accordance with the Employment Equity Act."

"Priority will be given to African, Coloured, Indian, and White 
female candidates as per our EE targets."
```

### Avoid ?
```
"Only for black candidates" - Too restrictive
"No specific groups" - Unclear
[Empty] - Missing important context
```

---

## Where It Shows

### 1. Job Creation Form
- New section after "Compensation"
- Toggle switch + optional notes field

### 2. Job Edit Form
- Same location as creation form
- Can update EE status anytime

### 3. Job Details Page (Public & Internal)
- Blue info alert if EE position
- Shows EE notes if provided
- Example:
  ```
  ? Employment Equity Position: This position is designated 
  as an Employment Equity position in accordance with South 
  African Employment Equity legislation.
  
  [Your notes appear here if provided]
  ```

---

## Technical Details

### Backend Fields Added
- `IsEmploymentEquityPosition` (boolean, default: false)
- `EmploymentEquityNotes` (string, max 500 chars, optional)

### Frontend Validation
- Notes limited to 500 characters
- Notes field only shows when toggle is ON
- Both fields optional

---

## Database Migration

### Required After Deployment
```bash
# From root directory
dotnet ef migrations add AddEmploymentEquityFields

# Apply to database
dotnet ef database update
```

---

## Testing Checklist

- [ ] Create job with EE toggle ON ? Success
- [ ] Create job with EE toggle OFF ? Success
- [ ] Edit job: Add EE designation ? Success
- [ ] Edit job: Remove EE designation ? Success
- [ ] Add notes > 500 chars ? Validation error
- [ ] View EE job details ? Shows EE alert
- [ ] View regular job details ? No EE alert

---

## Quick Tips

?? **Best Practice**: Always add notes when marking as EE position  
?? **Character Limit**: 500 characters for notes  
?? **Transparency**: EE designation is visible to all candidates  
?? **Compliance**: Helps with EE Act reporting requirements

---

## Files Changed

**Backend**:
- `Job.cs` - Model
- `JobDTOs.cs` - All DTOs
- `JobService.cs` - CRUD methods

**Frontend**:
- `JobForm.tsx` - Form UI

**Database**:
- Migration pending

---

## Status

? **Code**: Complete  
? **Build**: Successful  
? **UI**: Working  
? **Migration**: Needs to be run  
? **Testing**: Ready for QA

---

**Need Help?**
- Check `EMPLOYMENT-EQUITY-FIELDS-COMPLETE.md` for full details
- Contact dev team for migration support
- Review SA Employment Equity Act guidelines
