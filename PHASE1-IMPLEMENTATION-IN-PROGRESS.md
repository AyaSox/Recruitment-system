# ?? **PHASE 1: ALL 3 FEATURES - IMPLEMENTATION GUIDE**

## ? **FEATURE 1: EMAIL NOTIFICATIONS** - COMPLETE!

**Status:** ? **PRODUCTION READY**

### What's Done:
- ? EmailService.cs - Fully implemented
- ? Email templates - Professional HTML
- ? Background jobs - Automated reminders
- ? Integration complete
- ? Configuration in appsettings.json

### To Activate:
Just update SMTP credentials in `appsettings.json`:
```json
"EmailSettings": {
  "SmtpUsername": "your-email@gmail.com",
  "SmtpPassword": "your-16-char-app-password",
  "EnableEmailNotifications": true
}
```

---

## ?? **FEATURE 2: ADVANCED SEARCH & FILTERS** - IN PROGRESS

### ? Step 1: Create DTOs - DONE!

**File Created:** `ATSRecruitSys.Server/DTOs/SearchDTOs.cs`

Contains:
- `AdvancedJobSearchDto` - Job search with 10+ filters
- `AdvancedApplicationSearchDto` - Application search
- `SearchFiltersDto` - Filter metadata

### ?? Step 2: Add to JobService

**File to Edit:** `ATSRecruitSys.Server/Services/JobService.cs`

**Add this method:**

```csharp
public async Task<PaginatedJobResponseDto> AdvancedSearchJobsAsync(AdvancedJobSearchDto searchDto)
{
    var query = _context.Jobs
        .Include(j => j.CreatedBy)
        .Include(j => j.JobSkills)
        .ThenInclude(js => js.Skill)
        .Where(j => j.IsPublished && j.IsApproved && j.ClosingDate > DateTime.UtcNow)
        .AsQueryable();

    // Keyword search
    if (!string.IsNullOrEmpty(searchDto.Keywords))
    {
        var keywords = searchDto.Keywords.ToLower();
        query = query.Where(j => 
            j.Title.ToLower().Contains(keywords) ||
            j.Description.ToLower().Contains(keywords) ||
            j.Department.ToLower().Contains(keywords));
    }

    // Department filter
    if (!string.IsNullOrEmpty(searchDto.Department))
    {
        query = query.Where(j => j.Department == searchDto.Department);
    }

    // Location filter
    if (!string.IsNullOrEmpty(searchDto.Location))
    {
        query = query.Where(j => j.Location.Contains(searchDto.Location) || 
            (j.CustomLocation != null && j.CustomLocation.Contains(searchDto.Location)));
    }

    // Employment type
    if (!string.IsNullOrEmpty(searchDto.EmploymentType))
    {
        query = query.Where(j => j.EmploymentType == searchDto.EmploymentType);
    }

    // Experience level
    if (!string.IsNullOrEmpty(searchDto.ExperienceLevel))
    {
        query = query.Where(j => j.ExperienceLevel == searchDto.ExperienceLevel);
    }

    // Salary range
    if (searchDto.MinSalary.HasValue)
    {
        query = query.Where(j => j.SalaryRangeMax >= searchDto.MinSalary.Value);
    }
    if (searchDto.MaxSalary.HasValue)
    {
        query = query.Where(j => j.SalaryRangeMin <= searchDto.MaxSalary.Value);
    }

    // Employment Equity
    if (searchDto.IsEmploymentEquity.HasValue)
    {
        query = query.Where(j => j.IsEmploymentEquityPosition == searchDto.IsEmploymentEquity.Value);
    }

    // Posted date
    if (searchDto.PostedAfter.HasValue)
    {
        query = query.Where(j => j.PostedDate >= searchDto.PostedAfter.Value);
    }

    // Required skills
    if (searchDto.RequiredSkills != null && searchDto.RequiredSkills.Any())
    {
        query = query.Where(j => j.JobSkills.Any(js => 
            searchDto.RequiredSkills.Contains(js.SkillId) && js.IsRequired));
    }

    // Sorting
    query = searchDto.SortBy?.ToLower() switch
    {
        "salary_high" => query.OrderByDescending(j => j.SalaryRangeMax),
        "salary_low" => query.OrderBy(j => j.SalaryRangeMin),
        "title" => searchDto.SortDescending
            ? query.OrderByDescending(j => j.Title)
            : query.OrderBy(j => j.Title),
        "closing_soon" => query.OrderBy(j => j.ClosingDate),
        _ => query.OrderByDescending(j => j.PostedDate) // Default: newest first
    };

    var totalCount = await query.CountAsync();
    
    var jobs = await query
        .Skip(searchDto.PageIndex * searchDto.PageSize)
        .Take(searchDto.PageSize)
        .Select(j => new JobSummaryDto
        {
            Id = j.Id,
            Title = j.Title,
            Department = j.Department,
            CustomDepartment = j.CustomDepartment,
            Location = j.Location,
            CustomLocation = j.CustomLocation,
            EmploymentType = j.EmploymentType,
            ExperienceLevel = j.ExperienceLevel,
            IsEmploymentEquityPosition = j.IsEmploymentEquityPosition,
            PostedDate = j.PostedDate,
            ClosingDate = j.ClosingDate,
            IsPublished = j.IsPublished,
            IsApproved = j.IsApproved,
            SalaryRangeMin = j.SalaryRangeMin,
            SalaryRangeMax = j.SalaryRangeMax,
            Currency = j.Currency,
            ApplicationCount = j.JobApplications.Count
        })
        .ToListAsync();

    return new PaginatedJobResponseDto
    {
        Items = jobs,
        TotalCount = totalCount,
        PageIndex = searchDto.PageIndex,
        PageSize = searchDto.PageSize,
        TotalPages = (int)Math.Ceiling((double)totalCount / searchDto.PageSize)
    };
}

public async Task<SearchFiltersDto> GetSearchFiltersAsync()
{
    var jobs = await _context.Jobs
        .Where(j => j.IsPublished && j.IsApproved)
        .ToListAsync();

    return new SearchFiltersDto
    {
        Departments = jobs.Select(j => j.Department).Distinct().OrderBy(d => d).ToList(),
        Locations = jobs.Select(j => j.Location).Distinct().OrderBy(l => l).ToList(),
        EmploymentTypes = jobs.Select(j => j.EmploymentType).Distinct().OrderBy(e => e).ToList(),
        ExperienceLevels = jobs.Select(j => j.ExperienceLevel).Distinct().OrderBy(e => e).ToList(),
        MinSalary = jobs.Where(j => j.SalaryRangeMin.HasValue).Min(j => j.SalaryRangeMin) ?? 0,
        MaxSalary = jobs.Where(j => j.SalaryRangeMax.HasValue).Max(j => j.SalaryRangeMax) ?? 150000,
        TotalJobs = jobs.Count
    };
}
```

### ?? Step 3: Add Controller Endpoint

**File to Edit:** `ATSRecruitSys.Server/Controllers/JobsController.cs`

**Add this endpoint:**

```csharp
/// <summary>
/// Advanced job search with multiple filters
/// </summary>
[HttpPost("search/advanced")]
[AllowAnonymous]
public async Task<ActionResult<PaginatedJobResponseDto>> AdvancedSearch([FromBody] AdvancedJobSearchDto searchDto)
{
    try
    {
        var result = await _jobService.AdvancedSearchJobsAsync(searchDto);
        return Ok(result);
    }
    catch (Exception ex)
    {
        return HandleException(ex, "Error performing advanced search");
    }
}

/// <summary>
/// Get available search filters with current values
/// </summary>
[HttpGet("search/filters")]
[AllowAnonymous]
public async Task<ActionResult<SearchFiltersDto>> GetSearchFilters()
{
    try
    {
        var filters = await _jobService.GetSearchFiltersAsync();
        return Ok(filters);
    }
    catch (Exception ex)
    {
        return HandleException(ex, "Error retrieving search filters");
    }
}
```

### ?? Step 4: Frontend Component

**File to Create:** `atsrecruitsys.client/src/components/AdvancedJobSearch.tsx`

```typescript
import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Slider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { jobService } from '../services';

interface AdvancedJobSearchProps {
  onSearch: (filters: any) => void;
}

export const AdvancedJobSearch: React.FC<AdvancedJobSearchProps> = ({ onSearch }) => {
  const [keywords, setKeywords] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [salaryRange, setSalaryRange] = useState<number[]>([0, 100000]);
  const [isEE, setIsEE] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Load filter options
  const [filters, setFilters] = useState<any>(null);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await jobService.getSearchFilters();
        setFilters(data);
        setSalaryRange([data.minSalary, data.maxSalary]);
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };
    loadFilters();
  }, []);

  const handleSearch = () => {
    onSearch({
      keywords: keywords || undefined,
      department: department || undefined,
      location: location || undefined,
      employmentType: employmentType || undefined,
      experienceLevel: experienceLevel || undefined,
      minSalary: salaryRange[0],
      maxSalary: salaryRange[1],
      isEmploymentEquity: isEE || undefined,
      sortBy: sortBy,
    });
  };

  const handleReset = () => {
    setKeywords('');
    setDepartment('');
    setLocation('');
    setEmploymentType('');
    setExperienceLevel('');
    if (filters) {
      setSalaryRange([filters.minSalary, filters.maxSalary]);
    }
    setIsEE(false);
    setSortBy('newest');
    onSearch({});
  };

  if (!filters) return <Typography>Loading filters...</Typography>;

  return (
    <Box sx={{ mb: 3 }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">?? Advanced Search</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {/* Keywords */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Job title, skills, description..."
              />
            </Grid>

            {/* Sort By */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="salary_high">Highest Salary</MenuItem>
                  <MenuItem value="salary_low">Lowest Salary</MenuItem>
                  <MenuItem value="title">Title (A-Z)</MenuItem>
                  <MenuItem value="closing_soon">Closing Soon</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Department */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  label="Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {filters.departments.map((dept: string) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Location */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  label="Location"
                >
                  <MenuItem value="">All Locations</MenuItem>
                  {filters.locations.map((loc: string) => (
                    <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Employment Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  label="Employment Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {filters.employmentTypes.map((type: string) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Experience Level */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  label="Experience Level"
                >
                  <MenuItem value="">All Levels</MenuItem>
                  {filters.experienceLevels.map((level: string) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Employment Equity */}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isEE}
                    onChange={(e) => setIsEE(e.target.checked)}
                  />
                }
                label="Employment Equity Positions Only"
              />
            </Grid>

            {/* Salary Range */}
            <Grid item xs={12}>
              <Typography gutterBottom>
                Salary Range: R{salaryRange[0].toLocaleString()} - R{salaryRange[1].toLocaleString()}
              </Typography>
              <Slider
                value={salaryRange}
                onChange={(_, newValue) => setSalaryRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={filters.minSalary}
                max={filters.maxSalary}
                step={5000}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
```

---

## ?? **FEATURE 3: INTERNAL NOTES SYSTEM**

### Step 1: Create Database Model

**File to Create:** `ATSRecruitSys.Server/Models/ApplicationNote.cs`

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ATSRecruitSys.Server.Models
{
    public class ApplicationNote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int JobApplicationId { get; set; }

        [ForeignKey("JobApplicationId")]
        public JobApplication? JobApplication { get; set; }

        [Required]
        public string AuthorId { get; set; } = string.Empty;

        [ForeignKey("AuthorId")]
        public ApplicationUser? Author { get; set; }

        [Required]
        [StringLength(2000)]
        public string Content { get; set; } = string.Empty;

        /// <summary>
        /// Internal notes are only visible to recruiters and admins
        /// </summary>
        public bool IsInternal { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public bool IsEdited => UpdatedAt.HasValue;

        /// <summary>
        /// Comma-separated user IDs for @mentions
        /// </summary>
        public string? MentionedUserIds { get; set; }

        /// <summary>
        /// Optional attachment path
        /// </summary>
        public string? AttachmentPath { get; set; }

        public string? AttachmentFileName { get; set; }
    }
}
```

### Step 2: Add to DbContext

**File to Edit:** `ATSRecruitSys.Server/Data/ApplicationDbContext.cs`

Add this property:
```csharp
public DbSet<ApplicationNote> ApplicationNotes { get; set; }
```

### Step 3: Create Migration

Run these commands:
```bash
dotnet ef migrations add AddApplicationNotes --project ATSRecruitSys.Server
dotnet ef database update --project ATSRecruitSys.Server
```

### Step 4: Create DTOs

**File to Create:** `ATSRecruitSys.Server/DTOs/ApplicationNoteDTOs.cs`

```csharp
using System.ComponentModel.DataAnnotations;

namespace ATSRecruitSys.Server.DTOs
{
    public class ApplicationNoteDto
    {
        public int Id { get; set; }
        public int JobApplicationId { get; set; }
        public string AuthorId { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsInternal { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsEdited { get; set; }
        public List<string> MentionedUsers { get; set; } = new();
        public string? AttachmentFileName { get; set; }
    }

    public class CreateApplicationNoteDto
    {
        [Required]
        public int JobApplicationId { get; set; }

        [Required]
        [StringLength(2000)]
        public string Content { get; set; } = string.Empty;

        public bool IsInternal { get; set; } = true;
        
        public List<string>? MentionedUserIds { get; set; }
    }

    public class UpdateApplicationNoteDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(2000)]
        public string Content { get; set; } = string.Empty;
    }
}
```

---

## ?? **IMPLEMENTATION STATUS**

| Feature | Status | Files Created | Next Step |
|---------|--------|---------------|-----------|
| **Email Notifications** | ? COMPLETE | All done | Just configure SMTP |
| **Advanced Search** | ?? 50% | DTOs created | Add to Service & Controller |
| **Internal Notes** | ?? 20% | Model created | Create Service & Controller |

---

## ?? **WHAT TO DO NEXT?**

Would you like me to:

**A)** Continue implementing Advanced Search (Service + Controller + Frontend)  
**B)** Complete Internal Notes (Service + Controller + Frontend)  
**C)** Do both Advanced Search AND Internal Notes  
**D)** Just show me the final integration steps  

Let me know and I'll continue!
