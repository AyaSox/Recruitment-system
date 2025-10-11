# Quick Test Guide - Charts & Analytics

## ?? How to See the New Charts

### Step 1: Start the Application
```bash
# Option 1: Use the batch file (if you have one)
start-ats-system.bat

# Option 2: Manual start
# Terminal 1 - Backend
cd ATSRecruitSys.Server
dotnet run

# Terminal 2 - Frontend  
cd atsrecruitsys.client
npm run dev
```

### Step 2: Login
1. Open browser to `http://localhost:5173`
2. Login with Admin or Recruiter credentials
   - Email: admin@ats.com (or your admin email)
   - Password: (your admin password)

### Step 3: Navigate to Reports
1. Click **"Reports"** in the sidebar navigation
2. You'll see the enhanced Reports & Analytics page with 3 tabs

### Step 4: Explore Each Tab

#### ?? Tab 1: Overview
What you'll see:
- ? Job postings overview (4 colorful cards)
- ? Applications pipeline (4 cards with statistics)
- ? Key performance metrics (3 KPI cards)

**Look for:**
- Total jobs count
- Active jobs vs closed jobs
- Application status breakdown
- Average applications per job
- Interview conversion rate

#### ?? Tab 2: Department Analytics
What you'll see:
- ? **Bar chart**: Jobs by Department (left side)
  - Shows total jobs and active jobs per department
  - Green color gradient
  - Hover for details
  
- ? **Bar chart**: Applications by Department (right side)
  - Shows total applications per department
  - Blue color gradient
  - Compare which departments get most applications

- ? **Department cards**: Detailed stats for each department
  - Total jobs, Active jobs, Applications, Average per job

**Try this:**
- Hover over bars to see exact numbers
- Click legend items to show/hide data series
- Compare which departments are busiest

#### ?? Tab 3: Distributions
What you'll see:
- ? **Pie chart**: Application Status Distribution
  - See how many applications in each status
  - Color-coded: Orange (New), Blue (Screening), Purple (Interview), etc.

- ? **Pie chart**: Jobs by Employment Type
  - Full-time, Part-time, Contract, etc.

- ? **Pie chart**: Jobs by Experience Level
  - Entry, Mid, Senior, Lead

**Try this:**
- Hover over pie slices for percentages
- Click legend to filter chart
- See which status has most applications

### Step 5: Export Data
1. Click the **"Export to Excel"** button at the top
2. Excel file will download automatically
3. Open to see detailed application report

## ?? What to Look For

### If Charts Show "No Data Available"
This means you don't have any jobs or applications yet.

**Quick Fix:**
1. Go to Jobs page
2. Create a few test jobs in different departments:
   - IT Department job
   - HR Department job  
   - Marketing Department job
3. Go to each job and create some test applications
4. Return to Reports page - charts will now show data!

### Expected Behavior

#### Department Jobs Chart
```
You should see bars for each department:
- Bar 1 (IT): Shows total jobs and active jobs
- Bar 2 (HR): Shows total jobs and active jobs
- Bar 3 (Marketing): Shows total jobs and active jobs
```

#### Department Applications Chart
```
You should see bars showing application counts:
- Higher bars = More applications
- Different colored bars for visual appeal
```

#### Status Distribution Pie
```
Should show slices for:
- New (Orange)
- Screening (Blue)
- Interview (Purple)
- Other statuses...
```

## ?? Troubleshooting

### Problem: Charts not loading
**Solution:**
1. Open browser console (F12)
2. Check for API errors
3. Make sure backend is running
4. Check you're logged in as Admin/Recruiter

### Problem: "No data available" message
**Solution:**
1. Create some test jobs first
2. Add applications to those jobs
3. Refresh the page

### Problem: Charts look weird/small
**Solution:**
1. Try resizing browser window
2. Charts are responsive and will adjust
3. Zoom out if needed (Ctrl + Mouse Wheel)

### Problem: Export not working
**Solution:**
1. Check browser console for errors
2. Make sure you have data to export
3. Check if browser blocked the download

## ?? Screenshot Checklist

Take screenshots to share with team:
- [ ] Overview tab with all cards
- [ ] Department Jobs chart
- [ ] Department Applications chart
- [ ] Department performance cards
- [ ] Application status pie chart
- [ ] Employment type pie chart
- [ ] Experience level pie chart

## ?? Visual Features to Notice

### Beautiful Design Elements
- ? Smooth tab transitions
- ?? Color-coordinated charts
- ?? Professional spacing
- ??? Interactive tooltips
- ?? Responsive on mobile
- ?? Clean, modern UI

### Chart Interactions
- **Hover**: See detailed numbers
- **Click Legend**: Hide/show data series
- **Resize Window**: Charts adapt automatically
- **Touch**: Works on tablets/phones

## ?? Pro Tips

1. **Best View**: Desktop/laptop with 1920x1080 resolution
2. **Data Entry**: Create 5-10 jobs across different departments for best visualization
3. **Applications**: Add 3-5 applications per job to see meaningful charts
4. **Export**: Use Excel export for deeper analysis
5. **Presentation**: Screenshots work great in reports!

## ? Success Checklist

After testing, you should have seen:
- [x] All 3 tabs working
- [x] Charts rendering properly
- [x] Data displaying correctly
- [x] Tooltips showing on hover
- [x] Export to Excel working
- [x] Responsive design on different screen sizes
- [x] No console errors
- [x] Smooth performance

## ?? Next Steps

Once charts are working:
1. ? Create meaningful test data
2. ? Show team members the new features
3. ? Use for real recruitment tracking
4. ? Export reports for meetings
5. ? Monitor department performance
6. ? Track application trends

---

**Enjoy your new analytics dashboard!** ????

Need help? Check the console (F12) for any error messages.
