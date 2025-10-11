# ?? ATS System Testing & Screenshots Guide

## ?? Screenshot Organization

All screenshots should be saved in the `/screenshots` folder with descriptive names.

### Folder Structure:
```
screenshots/
??? 01-homepage/
?   ??? welcome-page-logged-out.png
?   ??? welcome-page-quick-actions.png
?   ??? welcome-page-features.png
??? 02-authentication/
?   ??? login-page.png
?   ??? staff-login-success.png
?   ??? unauthorized-access.png
??? 03-navigation/
?   ??? green-sidebar-expanded.png
?   ??? green-sidebar-collapsed.png
?   ??? green-top-menu.png
?   ??? mobile-navigation.png
??? 04-dashboard/
?   ??? admin-dashboard.png
?   ??? recruiter-dashboard.png
?   ??? dashboard-stats.png
??? 05-jobs/
?   ??? jobs-listing.png
?   ??? job-details.png
?   ??? create-job.png
?   ??? edit-job.png
??? 06-applications/
?   ??? job-apply-form.png
?   ??? applications-list.png
?   ??? application-details.png
?   ??? application-funnel.png
??? 07-reports/
?   ??? reports-page-overview.png
?   ??? jobs-overview-cards.png
?   ??? applications-pipeline.png
?   ??? key-metrics.png
??? 08-user-management/
?   ??? user-list.png
?   ??? add-user-dialog.png
?   ??? edit-user-dialog.png
?   ??? delete-confirmation.png
??? 09-features/
?   ??? audit-logs.png
?   ??? settings-page.png
?   ??? theme-toggle.png
??? 10-mobile/
    ??? mobile-homepage.png
    ??? mobile-jobs.png
    ??? mobile-dashboard.png
```

---

## ?? Testing Checklist

### **Phase 1: Homepage & Quick Actions** ??

#### Test 1.1: Welcome Page (Logged Out)
**Steps:**
1. Open browser to `http://localhost:5173`
2. Verify green hero banner displays
3. Check "Browse Jobs Now" and "Staff Login" buttons
4. Scroll to view features section

**Screenshots to Take:**
- [ ] `01-homepage/welcome-page-logged-out.png` - Full page
- [ ] `01-homepage/hero-section.png` - Hero banner with buttons
- [ ] `01-homepage/features-section.png` - Three feature cards

**Expected Results:**
- ? Green gradient hero banner
- ? Professional handshake image
- ? Clear call-to-action buttons
- ? Three feature cards (Browse, Apply, Updates)

---

#### Test 1.2: Quick Actions (Admin Logged In)
**Steps:**
1. Login as admin (`admin@atsrecruitsys.com` / `Admin@123`)
2. Navigate to homepage
3. View Quick Actions section
4. Hover over each action card

**Screenshots to Take:**
- [ ] `01-homepage/quick-actions-admin.png` - All 6 quick action cards
- [ ] `01-homepage/quick-action-hover.png` - Hover effect on card

**Expected Results:**
- ? 6 Quick Action cards displayed (Dashboard, Post Job, Applications, Funnel, Reports, User Management)
- ? Green icon backgrounds
- ? Hover effects work (card lifts, border changes)
- ? Arrow icon animates on hover

---

#### Test 1.3: Quick Actions (Recruiter Logged In)
**Steps:**
1. Login as recruiter (`recruiter@atsrecruitsys.com` / `Recruiter@123`)
2. Navigate to homepage
3. View Quick Actions section

**Screenshots to Take:**
- [ ] `01-homepage/quick-actions-recruiter.png` - Quick actions for recruiter

**Expected Results:**
- ? 6 Quick Action cards displayed (without User Management)
- ? "Team" card instead of "User Management"

---

### **Phase 2: Navigation & Theme** ??

#### Test 2.1: Green Top Menu Bar
**Steps:**
1. Login as any user
2. Check top navigation bar
3. Test theme toggle
4. Click user avatar menu

**Screenshots to Take:**
- [ ] `03-navigation/green-top-menu.png` - Full top bar
- [ ] `03-navigation/user-menu-open.png` - Avatar menu expanded
- [ ] `03-navigation/theme-toggle.png` - Theme toggle button

**Expected Results:**
- ? Green gradient top bar (#2e7d32 ? #388e3c)
- ? White text and icons
- ? Theme toggle button visible
- ? User avatar with initials

---

#### Test 2.2: Green Sidebar (Expanded)
**Steps:**
1. Login as admin
2. View left sidebar fully expanded
3. Check active page highlight
4. Hover over menu items

**Screenshots to Take:**
- [ ] `03-navigation/sidebar-expanded-light.png` - Expanded sidebar (light mode)
- [ ] `03-navigation/sidebar-active-item.png` - Active menu item highlighted

**Expected Results:**
- ? Subtle green gradient background (#f1f8f4 ? #ffffff)
- ? Active item has green background + left border
- ? Smooth hover effects
- ? User profile card at bottom

---

#### Test 2.3: Green Sidebar (Collapsed)
**Steps:**
1. Click collapse button (< icon)
2. View collapsed sidebar
3. Hover over icons to see tooltips

**Screenshots to Take:**
- [ ] `03-navigation/sidebar-collapsed.png` - Collapsed sidebar
- [ ] `03-navigation/sidebar-tooltip.png` - Tooltip on hover

**Expected Results:**
- ? Sidebar narrows to icons only
- ? Tooltips appear on hover
- ? Smooth transition animation

---

### **Phase 3: Dashboard** ??

#### Test 3.1: Admin Dashboard
**Steps:**
1. Login as admin
2. Navigate to Dashboard
3. View all statistics

**Screenshots to Take:**
- [ ] `04-dashboard/admin-dashboard-full.png` - Full dashboard view
- [ ] `04-dashboard/dashboard-stats-cards.png` - Statistics cards

**Expected Results:**
- ? Job statistics displayed
- ? Application statistics displayed
- ? Recent activities shown
- ? Green theme applied

---

### **Phase 4: Reports Page** ??

#### Test 4.1: Reports Overview
**Steps:**
1. Login as admin or recruiter
2. Navigate to Reports page
3. Scroll through all sections

**Screenshots to Take:**
- [ ] `07-reports/reports-page-full.png` - Full page (scrolling screenshot)
- [ ] `07-reports/reports-header.png` - Header with Export button
- [ ] `07-reports/jobs-overview.png` - Job statistics cards
- [ ] `07-reports/applications-pipeline.png` - Application statistics
- [ ] `07-reports/key-metrics.png` - Key metrics section

**Expected Results:**
- ? Green icon box in header
- ? Export to Excel button (green)
- ? Jobs Overview: 4 gradient cards
- ? Applications Overview: 4 colored border cards
- ? Key Metrics: 3 outlined cards
- ? Info box at bottom

---

#### Test 4.2: Export to Excel
**Steps:**
1. On Reports page
2. Click "Export to Excel" button
3. Wait for download

**Screenshots to Take:**
- [ ] `07-reports/export-loading.png` - Loading state
- [ ] `07-reports/excel-downloaded.png` - Downloaded file in browser

**Expected Results:**
- ? Button shows loading spinner
- ? Excel file downloads
- ? File contains all application data

---

### **Phase 5: Jobs Management** ??

#### Test 5.1: Browse Jobs (Public)
**Steps:**
1. Logout (or use incognito)
2. Navigate to /jobs
3. View job listings

**Screenshots to Take:**
- [ ] `05-jobs/jobs-listing-public.png` - Job list for external candidates
- [ ] `05-jobs/job-card.png` - Single job card

**Expected Results:**
- ? All published jobs visible
- ? No login required
- ? "Apply Now" buttons visible

---

#### Test 5.2: Job Details & Apply
**Steps:**
1. Click on a job
2. View job details
3. Click "Apply Now"

**Screenshots to Take:**
- [ ] `05-jobs/job-details-public.png` - Full job details page
- [ ] `06-applications/apply-form.png` - Application form

**Expected Results:**
- ? Job description fully displayed
- ? Requirements and qualifications shown
- ? Apply button prominent

---

#### Test 5.3: Create Job (Admin/Recruiter)
**Steps:**
1. Login as admin or recruiter
2. Navigate to Jobs ? Create Job
3. Fill out form

**Screenshots to Take:**
- [ ] `05-jobs/create-job-form.png` - Empty create job form
- [ ] `05-jobs/create-job-filled.png` - Filled form

**Expected Results:**
- ? All required fields present
- ? Date picker for closing date
- ? Rich text editor for description
- ? Submit button active

---

### **Phase 6: Applications** ??

#### Test 6.1: Application Submission
**Steps:**
1. As external candidate
2. Fill application form
3. Upload CV
4. Submit

**Screenshots to Take:**
- [ ] `06-applications/application-form-filled.png` - Filled application
- [ ] `06-applications/cv-uploaded.png` - CV upload section
- [ ] `06-applications/success-message.png` - Success confirmation

**Expected Results:**
- ? Form validation works
- ? CV upload successful
- ? Employment Equity fields present
- ? Success message displayed

---

#### Test 6.2: Application List (Recruiter)
**Steps:**
1. Login as recruiter
2. Navigate to Applications
3. View all applications

**Screenshots to Take:**
- [ ] `06-applications/applications-list.png` - Full application list
- [ ] `06-applications/application-filters.png` - Filter options

**Expected Results:**
- ? All applications listed
- ? Status badges visible
- ? Applicant names shown
- ? Job titles displayed

---

#### Test 6.3: Application Details
**Steps:**
1. Click on an application
2. View full details
3. Change status
4. Add recruiter notes

**Screenshots to Take:**
- [ ] `06-applications/application-details-full.png` - Full details page
- [ ] `06-applications/status-dropdown.png` - Status change dropdown
- [ ] `06-applications/recruiter-notes.png` - Notes section

**Expected Results:**
- ? All applicant info displayed
- ? CV download button works
- ? Status can be changed
- ? Notes can be added/edited

---

#### Test 6.4: Application Funnel
**Steps:**
1. Navigate to Application Funnel
2. View Kanban board
3. Drag and drop application

**Screenshots to Take:**
- [ ] `06-applications/funnel-full.png` - Full funnel view
- [ ] `06-applications/funnel-drag-drop.png` - Dragging a card

**Expected Results:**
- ? Columns: New, Screening, Interview, Offer, Hired, Rejected
- ? Drag and drop works
- ? Status updates automatically
- ? Real-time updates (if applicable)

---

### **Phase 7: User Management** ??

#### Test 7.1: User List
**Steps:**
1. Login as admin
2. Navigate to User Management
3. View user list

**Screenshots to Take:**
- [ ] `08-user-management/user-list.png` - Full user list
- [ ] `08-user-management/user-table.png` - Table with actions

**Expected Results:**
- ? All users listed
- ? Roles displayed as chips
- ? Edit and Delete buttons visible

---

#### Test 7.2: Add User
**Steps:**
1. Click "Add New User"
2. Fill form
3. Submit

**Screenshots to Take:**
- [ ] `08-user-management/add-user-dialog.png` - Add user form
- [ ] `08-user-management/role-dropdown.png` - Role selection

**Expected Results:**
- ? Dialog opens
- ? All fields required
- ? Role dropdown works
- ? Success message on creation

---

#### Test 7.3: Edit User
**Steps:**
1. Click edit icon on a user
2. Modify details
3. Save changes

**Screenshots to Take:**
- [ ] `08-user-management/edit-user-dialog.png` - Edit user form

**Expected Results:**
- ? Form pre-filled with user data
- ? Can change name and role
- ? Success message on update

---

#### Test 7.4: Delete User
**Steps:**
1. Click delete icon
2. View confirmation
3. Confirm deletion

**Screenshots to Take:**
- [ ] `08-user-management/delete-confirmation.png` - Delete dialog

**Expected Results:**
- ? Confirmation dialog appears
- ? User details shown
- ? Warning message displayed
- ? User removed after confirmation

---

### **Phase 8: Additional Features** ??

#### Test 8.1: Audit Logs
**Steps:**
1. Login as admin
2. Navigate to Audit Logs
3. View activity history

**Screenshots to Take:**
- [ ] `09-features/audit-logs-full.png` - Full audit log page
- [ ] `09-features/audit-export.png` - Export button

**Expected Results:**
- ? All activities logged
- ? User, action, and timestamp shown
- ? Export to Excel works

---

#### Test 8.2: Settings
**Steps:**
1. Navigate to Settings
2. View profile information
3. Change password option

**Screenshots to Take:**
- [ ] `09-features/settings-page.png` - Settings page

**Expected Results:**
- ? User profile displayed
- ? Change password option available

---

#### Test 8.3: Dark Mode
**Steps:**
1. Click theme toggle (sun/moon icon)
2. View page in dark mode
3. Navigate through pages

**Screenshots to Take:**
- [ ] `09-features/dark-mode-dashboard.png` - Dashboard in dark mode
- [ ] `09-features/dark-mode-reports.png` - Reports in dark mode
- [ ] `09-features/dark-mode-sidebar.png` - Sidebar in dark mode

**Expected Results:**
- ? Dark green theme applied
- ? All pages adapt to dark mode
- ? Sidebar has dark green gradient
- ? Text remains readable

---

### **Phase 9: Mobile Responsiveness** ??

#### Test 9.1: Mobile Homepage
**Steps:**
1. Resize browser to mobile (375px width)
2. OR use Chrome DevTools mobile view
3. Navigate homepage

**Screenshots to Take:**
- [ ] `10-mobile/mobile-homepage.png`
- [ ] `10-mobile/mobile-menu.png`

**Expected Results:**
- ? Mobile navigation drawer
- ? Stacked layout
- ? Buttons full-width

---

#### Test 9.2: Mobile Jobs & Apply
**Steps:**
1. Browse jobs on mobile
2. View job details
3. Apply via mobile

**Screenshots to Take:**
- [ ] `10-mobile/mobile-jobs-list.png`
- [ ] `10-mobile/mobile-job-details.png`
- [ ] `10-mobile/mobile-apply-form.png`

**Expected Results:**
- ? Touch-friendly buttons
- ? Easy scrolling
- ? Form fields stack properly

---

## ?? Screenshot Naming Convention

Use this format for all screenshots:
```
[folder]/[page]-[feature]-[state].png

Examples:
- 01-homepage/welcome-page-logged-out.png
- 03-navigation/sidebar-expanded-light.png
- 07-reports/jobs-overview-cards.png
- 08-user-management/add-user-dialog.png
```

---

## ?? Priority Testing Order

### **High Priority (Must Test First):**
1. ? Homepage with Quick Actions
2. ? Green Navigation (top bar + sidebar)
3. ? Reports Page
4. ? User Management (add/edit/delete)
5. ? Job Application Flow

### **Medium Priority:**
6. ? Dashboard
7. ? Jobs Management
8. ? Application Funnel
9. ? Dark Mode

### **Low Priority:**
10. ? Mobile Responsiveness
11. ? Audit Logs
12. ? Settings

---

## ?? Testing Tools

### **Recommended Screenshot Tools:**

**Windows:**
- Windows Snipping Tool (Win + Shift + S)
- ShareX (free, advanced)
- Greenshot (free)

**Browser Extensions:**
- Awesome Screenshot
- Fireshot (full page scrolling)

**Tips:**
- Use full-page scrolling screenshots for long pages
- Capture hover states with quick screenshots
- Include browser chrome (address bar) for context
- Use consistent browser zoom level (100%)

---

## ? Sign-Off Checklist

After completing all tests:

- [ ] All screenshots saved in `/screenshots` folder
- [ ] Screenshots named according to convention
- [ ] All expected features working
- [ ] No console errors during testing
- [ ] All green theme elements visible
- [ ] Mobile responsiveness tested
- [ ] Dark mode tested
- [ ] User flows completed end-to-end

---

## ?? Test Results Summary

### Overall System Status:
- **Frontend Build:** ? Success
- **Backend Build:** ? Success
- **Database:** ? Connected
- **Authentication:** ? Working
- **Green Theme:** ? Applied
- **Navigation:** ? Functional
- **Quick Actions:** ? Implemented

### Known Issues:
- None currently

### Recommendations:
- Test on multiple browsers (Chrome, Edge, Firefox)
- Test with real data
- Get feedback from actual users

---

**Ready for Testing!** ??

Start with Phase 1 (Homepage & Quick Actions) and work your way through. Take screenshots as you go!

**Testing Time Estimate:** 2-3 hours for complete testing with screenshots.
