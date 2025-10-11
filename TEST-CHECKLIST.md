# ? Blazor Application Test Checklist

## Pre-Testing Setup
- [ ] API Server is running (https://localhost:7214)
- [ ] Blazor App is running (https://localhost:5001)
- [ ] Database is up to date (`dotnet ef database update`)
- [ ] No build errors (`dotnet build`)

---

## Core Functionality Tests

### Authentication & Authorization
- [ ] Home page loads successfully
- [ ] Can register as Candidate
- [ ] Can register as Recruiter
- [ ] Can login with valid credentials
- [ ] Cannot login with invalid credentials
- [ ] Form validation works (empty fields, invalid email)
- [ ] Password confirmation validation works
- [ ] Logout clears session
- [ ] Unauthorized access redirects to login

### Dashboard
- [ ] Dashboard displays for logged-in users
- [ ] Statistics cards show correct data
- [ ] Recent jobs table displays
- [ ] Can click "View" on jobs
- [ ] Responsive layout works

### Jobs (All Users)
- [ ] Jobs listing page displays
- [ ] Job cards show correct information
- [ ] Search functionality works
- [ ] Status filter works
- [ ] Clear filters button works
- [ ] Can navigate to job details
- [ ] Job details show all information
- [ ] Required skills display as chips
- [ ] Salary range displays (if available)

### Jobs (Recruiter/Admin Only)
- [ ] "Create Job" button visible
- [ ] Can access create job page
- [ ] Form validation works
- [ ] Can add multiple skills
- [ ] Can remove skills
- [ ] Can set salary range
- [ ] Can set closing date
- [ ] Job creation succeeds
- [ ] Redirects to job details after creation
- [ ] Can access edit job page
- [ ] Edit form pre-populates with data
- [ ] Can update job successfully
- [ ] Can delete job
- [ ] Status can be changed

### Applications (Candidate)
- [ ] "Apply Now" button visible on jobs
- [ ] Can access job application form
- [ ] Form validation works
- [ ] Can upload resume (PDF)
- [ ] File type validation works (.txt rejected)
- [ ] File size validation works (>5MB rejected)
- [ ] Can submit application
- [ ] Redirects to "My Applications"
- [ ] "My Applications" page displays
- [ ] Application cards show correct status
- [ ] Can view application details
- [ ] Can withdraw pending applications
- [ ] Empty state shows if no applications

### Applications (Recruiter/Admin)
- [ ] Can access "All Applications" page
- [ ] Applications table displays
- [ ] Search functionality works
- [ ] Status filter works
- [ ] Can view application details
- [ ] Can update application status to "Reviewing"
- [ ] Can update status to "Shortlisted"
- [ ] Can update status to "Accepted"
- [ ] Can update status to "Rejected"
- [ ] Status updates immediately
- [ ] Success notifications appear
- [ ] More actions menu works

---

## UI/UX Tests

### Navigation
- [ ] All menu items work
- [ ] Drawer toggles correctly
- [ ] Active menu item highlighted
- [ ] Role-based menu items show/hide correctly
- [ ] Back buttons work
- [ ] Breadcrumbs work (if implemented)

### Responsive Design
- [ ] Desktop view (1920x1080) works
- [ ] Tablet view (768x1024) works
- [ ] Mobile view (375x667) works
- [ ] Navigation drawer responsive
- [ ] Job cards stack correctly
- [ ] Tables adapt to screen size
- [ ] Forms are mobile-friendly
- [ ] Buttons are touch-friendly

### Loading States
- [ ] Loading spinner shows during API calls
- [ ] Button shows loading state during submit
- [ ] Dashboard shows loading for stats
- [ ] Jobs page shows loading
- [ ] Applications page shows loading

### Error Handling
- [ ] Network errors show error messages
- [ ] 404 pages show "Not Found"
- [ ] Form validation errors display inline
- [ ] API errors show user-friendly messages
- [ ] Errors don't crash the app

### Notifications
- [ ] Success notifications appear
- [ ] Error notifications appear
- [ ] Warning notifications appear
- [ ] Notifications auto-dismiss
- [ ] Notifications are readable
- [ ] Multiple notifications stack correctly

---

## Performance Tests

### Page Load Times
- [ ] Home page loads < 2 seconds
- [ ] Dashboard loads < 3 seconds
- [ ] Jobs listing loads < 2 seconds
- [ ] Job details loads < 1 second
- [ ] Applications page loads < 3 seconds

### API Response Times
- [ ] Login API < 1 second
- [ ] Get jobs API < 1 second
- [ ] Create job API < 2 seconds
- [ ] Submit application API < 2 seconds
- [ ] Update status API < 1 second

### Browser Performance
- [ ] No memory leaks (DevTools check)
- [ ] Smooth scrolling
- [ ] No layout shifts
- [ ] Images load properly
- [ ] No console errors

---

## Security Tests

### Authentication
- [ ] JWT token stored in LocalStorage
- [ ] Token included in API requests
- [ ] Token expires correctly
- [ ] Cannot access protected routes when logged out
- [ ] Session persists on page refresh

### Authorization
- [ ] Candidate cannot create jobs
- [ ] Candidate cannot edit jobs
- [ ] Candidate cannot access all applications
- [ ] Recruiter cannot access candidate-only pages
- [ ] Admin has full access
- [ ] Unauthorized access redirects

### Data Validation
- [ ] SQL injection prevented (backend)
- [ ] XSS attacks prevented
- [ ] File upload restrictions enforced
- [ ] Form inputs sanitized
- [ ] No sensitive data in console logs

---

## Browser Compatibility

### Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Proper rendering

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Proper rendering

### Edge
- [ ] All features work
- [ ] No console errors
- [ ] Proper rendering

### Safari (if available)
- [ ] All features work
- [ ] No console errors
- [ ] Proper rendering

---

## Accessibility Tests

### Keyboard Navigation
- [ ] Can tab through forms
- [ ] Can activate buttons with Enter/Space
- [ ] Focus visible on all interactive elements
- [ ] Modal/dialogs trap focus

### Screen Reader
- [ ] Form labels are read correctly
- [ ] Buttons have descriptive text
- [ ] Error messages announced
- [ ] Success messages announced

### Visual
- [ ] Color contrast meets WCAG standards
- [ ] Text is readable at various sizes
- [ ] Icons have alt text/aria-labels
- [ ] Focus indicators visible

---

## Edge Cases

### Data Edge Cases
- [ ] Empty states display correctly
- [ ] Very long job titles handle gracefully
- [ ] Special characters in fields work
- [ ] Large datasets paginate properly
- [ ] Concurrent users don't conflict

### Network Edge Cases
- [ ] Slow connection shows loading
- [ ] Network error shows message
- [ ] API timeout handles gracefully
- [ ] Retry mechanism works (if implemented)

### User Edge Cases
- [ ] Multiple browser tabs work
- [ ] Browser back/forward work
- [ ] Page refresh doesn't lose state
- [ ] Deep linking works
- [ ] Bookmarked pages work

---

## Regression Tests

After any code changes, verify:
- [ ] Existing features still work
- [ ] No new console errors
- [ ] Performance hasn't degraded
- [ ] Styles haven't broken
- [ ] Tests still pass

---

## Test Results

**Date:** _________________
**Tester:** _________________
**Build Version:** _________________

**Total Tests:** _____ / _____  
**Passed:** _____  
**Failed:** _____  
**Skipped:** _____

### Critical Issues Found:
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Minor Issues Found:
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Recommendations:
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

---

## Sign-Off

- [ ] All critical tests passed
- [ ] No blocking issues
- [ ] Performance acceptable
- [ ] Ready for deployment

**Approved By:** _________________  
**Date:** _________________  
**Signature:** _________________

---

## Notes

Use this space for additional observations:

________________________________________________________________
________________________________________________________________
________________________________________________________________
________________________________________________________________
________________________________________________________________

---

**Testing Complete! ??**
