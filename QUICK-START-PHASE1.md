# ?? **QUICK START GUIDE - PHASE 1 FEATURES**

## ? **EVERYTHING IS READY!**

All Phase 1 features are implemented and ready to test!

---

## ?? **WHAT TO DO NOW**

### **Step 1: Start the Application (2 minutes)**

```powershell
# Option A: Use the PowerShell script
.\start-servers.ps1

# Option B: Manual start
# Terminal 1 - Backend:
cd ATSRecruitSys.Server
dotnet run

# Terminal 2 - Frontend:
cd atsrecruitsys.client
npm run dev
```

### **Step 2: Test Advanced Search (5 minutes)**

1. **Open browser:** http://localhost:5173/jobs
2. **Find the blue "Advanced Job Search" accordion**
3. **Try these tests:**
   - Enter "developer" in keywords ? Click Search
   - Select "IT" department ? Click Search
   - Select "Cape Town" location ? Click Search
   - Adjust salary slider ? Click Search
   - Check "Employment Equity" ? Click Search
   - Click "Reset Filters"
   - Try multiple filters at once

**? Expected:** Jobs filter based on criteria, results update instantly

---

### **Step 3: Test Internal Notes (5 minutes)**

1. **Login as Recruiter:**
   - Email: `thabo.nkosi@atsrecruit.com`
   - Password: `Recruit@123`

2. **Go to Applications page**

3. **Click on any application**

4. **Scroll to "Team Notes & Comments" section**

5. **Try these tests:**
   - Write a note: "Great candidate, let's interview"
   - Keep "Internal Note" checked ? Click "Add Note"
   - See note appear instantly
   - Click Edit icon ? Modify note ? Save
   - Create another note, uncheck "Internal" ? Click "Add Note"
   - Click Delete icon ? Confirm deletion

6. **Test visibility:**
   - Logout
   - Login as Applicant: `sipho.ndlovu@example.com` / `Applicant@123`
   - Go to "My Applications"
   - Open an application
   - **? Expected:** See only PUBLIC notes, not internal ones

---

### **Step 4: Email Notifications (Optional - 5 minutes)**

1. **Edit `ATSRecruitSys.Server/appsettings.json`:**

```json
"EmailSettings": {
  "SmtpUsername": "your-email@gmail.com",
  "SmtpPassword": "your-16-char-app-password",
  "EnableEmailNotifications": true
}
```

2. **Get Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Generate new app password
   - Copy to config

3. **Restart backend server**

4. **Test:**
   - Submit a new job application
   - Check email for confirmation
   - **? Expected:** Receive professional email

---

## ?? **QUICK TEST CHECKLIST**

### **Advanced Search:**
- [ ] Search component visible on Jobs page
- [ ] Keyword search works
- [ ] Department filter works
- [ ] Location filter works
- [ ] Salary slider works
- [ ] Employment Equity filter works
- [ ] Sort options work
- [ ] Reset button clears all filters
- [ ] Active filter count badge shows
- [ ] Results paginate correctly

### **Internal Notes:**
- [ ] Notes section visible on Application Details
- [ ] Can create internal note (recruiter)
- [ ] Can create public note (recruiter)
- [ ] Notes appear instantly
- [ ] Can edit own notes
- [ ] Can delete own notes
- [ ] Cannot edit others' notes (non-admin)
- [ ] Applicants see only public notes
- [ ] Timestamps display correctly
- [ ] Edit dialog works
- [ ] Delete confirmation works

### **Email Notifications:**
- [ ] Application confirmation email sent
- [ ] Status change email sent
- [ ] Interview scheduled email sent
- [ ] Email templates look professional
- [ ] Links in emails work

---

## ?? **VISUAL GUIDE**

### **Where to Find Features:**

```
?? Home (http://localhost:5173)
   ?? Login
      ?? ?? Jobs Page
      ?  ?? ?? Advanced Search (Blue accordion at top)
      ?     ?? Keywords input
      ?     ?? Department dropdown
      ?     ?? Location dropdown  
      ?     ?? Employment type
      ?     ?? Experience level
      ?     ?? Salary slider
      ?     ?? Employment Equity checkbox
      ?     ?? [Search] [Reset] buttons
      ?
      ?? ?? Applications Page (Recruiter/Admin)
         ?? Click any application
            ?? ?? Team Notes & Comments section
               ?? Add Note form
               ?  ?? Text area
               ?  ?? Internal/Public toggle
               ?  ?? [Add Note] button
               ?? Notes list
                  ?? Each note has:
                     ?? Author avatar
                     ?? Timestamp
                     ?? Content
                     ?? Internal/Public badge
                     ?? [Edit] [Delete] actions
```

---

## ?? **TROUBLESHOOTING**

### **Problem: Advanced Search not showing**
**Solution:**
1. Check browser console for errors
2. Verify frontend is running: http://localhost:5173
3. Check backend is running: http://localhost:5000/swagger
4. Try refreshing page (Ctrl+R)

### **Problem: Notes not loading**
**Solution:**
1. Check if logged in as Recruiter/Admin
2. Verify backend API is running
3. Check browser console for 401/403 errors
4. Try logging out and back in

### **Problem: Search returns no results**
**Solution:**
1. Click "Reset Filters" first
2. Verify there are jobs in database
3. Check if jobs are published and approved
4. Try simpler search (keywords only)

### **Problem: Cannot create notes**
**Solution:**
1. Verify logged in as Recruiter or Admin (not Applicant)
2. Check network tab for API errors
3. Verify applicationId is valid
4. Check backend logs

---

## ?? **PRO TIPS**

### **Advanced Search:**
1. Use keywords first for broad search
2. Add filters to narrow results
3. Save time with "Closing Soon" sort
4. Reset filters between searches
5. Salary slider works in R5k increments

### **Internal Notes:**
1. Use Internal notes for team discussion
2. Use Public notes for applicant communication
3. @mentions coming soon (already in backend)
4. Admins can delete any note
5. Notes show edited timestamp

### **Email Notifications:**
1. Test with your own email first
2. Check spam folder if not receiving
3. Use App Password, not regular password
4. Disable for development if needed
5. Templates are customizable

---

## ?? **DEFAULT TEST ACCOUNTS**

```
?? Admin:
   Email: admin@atsrecruit.com
   Password: Admin@123
   Access: Everything

?? Recruiter:
   Email: thabo.nkosi@atsrecruit.com
   Password: Recruit@123
   Access: Jobs, Applications, Notes

?? Applicant:
   Email: sipho.ndlovu@example.com
   Password: Applicant@123
   Access: Jobs, My Applications, Public Notes
```

---

## ?? **EXPECTED BEHAVIOR**

### **Advanced Search:**
```
1. User opens Jobs page
2. Sees accordion with "Advanced Job Search"
3. Enters criteria
4. Clicks "Search Jobs"
5. Results filter instantly
6. Active filters badge updates
7. Can refine or reset
8. Pagination works
```

### **Internal Notes:**
```
1. Recruiter opens application
2. Sees "Team Notes & Comments"
3. Writes note
4. Toggles Internal/Public
5. Clicks "Add Note"
6. Note appears with avatar
7. Can edit/delete own notes
8. Applicant sees only public notes
```

---

## ?? **PERFORMANCE EXPECTATIONS**

- **Search execution:** < 500ms
- **Notes load:** < 300ms
- **Create note:** < 200ms
- **Page transitions:** < 100ms
- **No lag or freezing**

---

## ?? **MOBILE TESTING**

1. **Open DevTools** (F12)
2. **Click device toolbar** (Ctrl+Shift+M)
3. **Select mobile device** (iPhone, Android)
4. **Test both features:**
   - Search should stack vertically
   - Notes should be touch-friendly
   - No horizontal scrolling
   - Buttons easy to tap

---

## ?? **SUCCESS INDICATORS**

### **You'll know it's working when:**
? Search filters update results instantly  
? Active filters badge shows count  
? Notes appear immediately after creation  
? Edit/delete actions work smoothly  
? Role-based visibility works correctly  
? No console errors  
? UI is responsive and smooth  
? Everything looks professional  

---

## ?? **NEED HELP?**

### **Check These Files:**
- **PHASE1-FRONTEND-COMPLETE.md** - Full implementation details
- **PHASE1-COMPLETE-FINAL.md** - Backend implementation
- **troubleshooting-guide.md** - Common issues

### **Check API Endpoints:**
- **Swagger UI:** http://localhost:5000/swagger
- Test endpoints directly
- Verify responses

### **Check Browser Console:**
- Press F12
- Look for red errors
- Check Network tab for failed requests

---

## ?? **CONGRATULATIONS!**

**You now have:**
- ? Professional job search with 10+ filters
- ? Team collaboration with internal notes
- ? Email notification system (ready to activate)
- ? Modern, responsive UI
- ? Secure, role-based access
- ? Production-ready features

**Time to test:** ~15 minutes  
**Features ready:** 3/3  
**Build status:** ? Successful  

**Enjoy testing your new features!** ??
