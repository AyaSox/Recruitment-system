import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  useTheme,
  useMediaQuery,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Alert,
  Fade,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  CheckCircle as ApplyIcon,
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import JobService from '../services/job.service';
import { useAuth } from '../context/AuthContext';

// ...existing interfaces...

// Modern Loading Skeleton Component
const JobCardSkeleton: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width="80%" height={32} sx={{ mb: 0.5 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width="50%" height={20} />
          </Box>
        </Box>

        {/* Description Skeleton */}
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />

        {/* Chips Skeleton */}
        <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
          <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 3 }} />
          <Skeleton variant="rounded" width={100} height={24} sx={{ borderRadius: 3 }} />
          <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 3 }} />
        </Box>

        {/* Skills Skeleton */}
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width={60} height={16} sx={{ mb: 0.5 }} />
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Skeleton variant="rounded" width={60} height={20} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" width={75} height={20} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" width={55} height={20} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>

        {/* Salary Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton variant="text" width={150} height={20} />
        </Box>

        {/* Dates Skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Skeleton variant="text" width={120} height={16} />
            <Skeleton variant="text" width={120} height={16} />
          </Box>
        </Box>

        {/* Buttons Skeleton */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rounded" width="50%" height={36} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rounded" width="50%" height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

const MobileJobList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, isAdmin, isRecruiter, isHiringManager } = useAuth();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<number>>(new Set());
  
  // Determine if this is a public view (external applicants or non-authenticated users)
  const isPublicView = !user || (!isAdmin() && !isRecruiter() && !isHiringManager());

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await JobService.getJobs(
        0,
        10,
        {
          searchTerm: filters.searchTerm,
          location: filters.location,
          department: filters.department,
          employmentType: filters.employmentType,
          experienceLevel: filters.experienceLevel,
          isEmploymentEquity: undefined,
          isPublished: true,
          showPendingApproval: false
        }
      );
      
      // Map JobSummary[] to local Job[] shape
      const items = (response.items || []).map((j: any) => ({
        id: j.id,
        title: j.title,
        description: j.description ?? '',
        location: j.location,
        customLocation: j.customLocation,
        department: j.displayDepartment || j.department,
        employmentType: j.employmentType,
        experienceLevel: j.experienceLevel,
        salaryRangeMin: j.salaryRangeMin,
        salaryRangeMax: j.salaryRangeMax,
        currency: j.currency,
        postedDate: j.postedDate,
        closingDate: j.closingDate,
        isPublished: j.isPublished,
        isApproved: j.isApproved,
        applicationCount: j.applicationCount,
        skills: j.skills?.map((s: any) => s.skillName) ?? []
      })) as Job[];
      
      setJobs(items);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const handleFilterChange = (field: keyof JobFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const toggleBookmark = async (jobId: number) => {
    try {
      // Placeholder for bookmark API integration
      if (bookmarkedJobs.has(jobId)) {
        setBookmarkedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        setBookmarkedJobs(prev => new Set([...prev, jobId]));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const getLocationDisplay = (job: Job) => {
    return (job.customLocation as string) || job.location;
  };

  const getSalaryDisplay = (job: Job) => {
    if (!job.salaryRangeMin && !job.salaryRangeMax) return null;
    
    const currency = job.currency === 'ZAR' ? 'R' : job.currency;
    if (job.salaryRangeMin && job.salaryRangeMax) {
      return `${currency}${Number(job.salaryRangeMin).toLocaleString()} - ${currency}${Number(job.salaryRangeMax).toLocaleString()}`;
    }
    const val = job.salaryRangeMin ?? job.salaryRangeMax ?? 0;
    return `${currency}${Number(val).toLocaleString()}+`;
  };

  const getExperienceLevelColor = (level: string) => {
    switch ((level || '').toLowerCase()) {
      case 'entry':
        return 'success';
      case 'mid':
        return 'primary';
      case 'senior':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      'IT': 'primary',
      'HR': 'secondary',
      'Finance': 'success',
      'Sales': 'warning',
      'Sales & Marketing': 'warning',
      'Marketing': 'info',
      'Operations': 'error'
    } as const;
    return (colors as any)[department] || 'default';
  };

  const handleApply = (jobId: number) => {
    navigate(`/jobs/${jobId}/apply`);
  };

  const handleViewDetails = (jobId: number) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleEditJob = (jobId: number) => {
    navigate(`/jobs/${jobId}/edit`);
  };

  // Modern Loading State
  if (loading) {
    return (
      <Box sx={{ p: { xs: 1, md: 2 }, pb: { xs: 10, md: 2 } }}>
        {/* Loading Progress Bar */}
        <LinearProgress 
          sx={{ 
            mb: 3,
            height: 2,
            borderRadius: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 1,
              backgroundColor: theme.palette.primary.main,
            }
          }} 
        />

        {/* Header Skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="text" width={150} height={40} />
          <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 1 }} />
        </Box>

        {/* Search Bar Skeleton */}
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rounded" width="100%" height={56} sx={{ borderRadius: 1 }} />
        </Box>

        {/* Job Cards Skeleton */}
        <Fade in={loading} timeout={300}>
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} lg={4} key={i}>
                <JobCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Fade>

        {/* Loading Text */}
        <Box sx={{ 
          textAlign: 'center', 
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1
        }}>
          <WorkIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.6 }} />
          <Typography variant="body1" color="text.secondary">
            Loading job opportunities...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={fetchJobs}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, pb: { xs: 10, md: 2 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant={isMobile ? "h5" : "h4"} component="h1">
          Jobs ({jobs.length})
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => setShowFilters(true)}
            color={Object.keys(filters).length > 0 ? 'primary' : 'default'}
          >
            <Badge badgeContent={Object.keys(filters).length} color="error">
              <FilterIcon />
            </Badge>
          </IconButton>
          
          {(user?.roles?.includes('Admin') || user?.roles?.includes('Recruiter')) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/jobs/create')}
              size={isMobile ? 'small' : 'medium'}
            >
              {isMobile ? 'Add' : 'Add Job'}
            </Button>
          )}
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search jobs by title, skills, or description..."
          value={filters.searchTerm || ''}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ bgcolor: 'background.paper' }}
        />
      </Box>

      {/* Job Cards */}
      <Grid container spacing={2}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} lg={4} key={job.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: theme.shadows[4]
                }
              }}
              onClick={() => handleViewDetails(job.id)}
            >
              <CardContent sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" component="h3" noWrap>
                      {job.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {getLocationDisplay(job)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {user?.roles?.includes('Applicant') && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(job.id);
                      }}
                      color={bookmarkedJobs.has(job.id) ? 'primary' : 'default'}
                    >
                      {bookmarkedJobs.has(job.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                  )}
                </Box>

                {/* Job Details */}
                <Box sx={{ mb: 2 }}>
                  {job.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {job.description.substring(0, 120)}...
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    <Chip
                      label={job.department}
                      size="small"
                      color={getDepartmentColor(job.department) as any}
                      variant="outlined"
                    />
                    <Chip
                      label={job.employmentType}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={job.experienceLevel}
                      size="small"
                      color={getExperienceLevelColor(job.experienceLevel) as any}
                      variant="outlined"
                    />
                  </Box>

                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {job.skills.slice(0, 3).map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        ))}
                        {job.skills.length > 3 && (
                          <Chip
                            label={`+${job.skills.length - 3} more`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Salary */}
                  {getSalaryDisplay(job) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <MoneyIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="body2" color="success.main" fontWeight="medium">
                        {getSalaryDisplay(job)}
                      </Typography>
                    </Box>
                  )}

                  {/* Dates and Stats */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Posted: {new Date(job.postedDate).toLocaleDateString()}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Closes: {new Date(job.closingDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    {!isPublicView && (
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">
                          {job.applicationCount} applications
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  {user?.roles?.includes('Applicant') ? (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(job.id);
                        }}
                        startIcon={<ViewIcon />}
                        sx={{ flex: 1 }}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(job.id);
                        }}
                        startIcon={<ApplyIcon />}
                        sx={{ flex: 1 }}
                        disabled={job.hasApplied}
                      >
                        {job.hasApplied ? 'Applied' : 'Apply'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(job.id);
                        }}
                        startIcon={<ViewIcon />}
                        sx={{ flex: 1 }}
                      >
                        View
                      </Button>
                      {(user?.roles?.includes('Admin') || user?.roles?.includes('Recruiter')) && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditJob(job.id);
                          }}
                          startIcon={<EditIcon />}
                          sx={{ flex: 1 }}
                        >
                          Edit
                        </Button>
                      )}
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Jobs Message */}
      {jobs.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No jobs found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {Object.keys(filters).length > 0
              ? 'Try adjusting your search filters'
              : 'Be the first to create a job posting!'
            }
          </Typography>
          {Object.keys(filters).length > 0 && (
            <Button variant="outlined" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </Box>
      )}

      {/* Filter Dialog */}
      <Dialog
        open={showFilters}
        onClose={() => setShowFilters(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          Filter Jobs
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                label="Location"
              >
                <MenuItem value="">All Locations</MenuItem>
                <MenuItem value="Cape Town">Cape Town</MenuItem>
                <MenuItem value="Johannesburg">Johannesburg</MenuItem>
                <MenuItem value="Durban">Durban</MenuItem>
                <MenuItem value="Pretoria">Pretoria</MenuItem>
                <MenuItem value="Remote">Remote</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={filters.department || ''}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                label="Department"
              >
                <MenuItem value="">All Departments</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Human Capital">Human Capital</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Sales & Marketing">Sales & Marketing</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
                <MenuItem value="Legal">Legal</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Employment Type</InputLabel>
              <Select
                value={filters.employmentType || ''}
                onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                label="Employment Type"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Part-time">Part-time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Experience Level</InputLabel>
              <Select
                value={filters.experienceLevel || ''}
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                label="Experience Level"
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="Entry">Entry Level</MenuItem>
                <MenuItem value="Mid">Mid Level</MenuItem>
                <MenuItem value="Senior">Senior Level</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Min Salary (ZAR)"
                type="number"
                value={filters.salaryMin || ''}
                onChange={(e) => handleFilterChange('salaryMin', e.target.value ? parseInt(e.target.value) : undefined)}
                fullWidth
              />
              <TextField
                label="Max Salary (ZAR)"
                type="number"
                value={filters.salaryMax || ''}
                onChange={(e) => handleFilterChange('salaryMax', e.target.value ? parseInt(e.target.value) : undefined)}
                fullWidth
              />
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={clearFilters}>Clear All</Button>
          <Button onClick={() => setShowFilters(false)}>Cancel</Button>
          <Button
            onClick={() => setShowFilters(false)}
            variant="contained"
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      {isMobile && (user?.roles?.includes('Admin') || user?.roles?.includes('Recruiter')) && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => navigate('/jobs/create')}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default MobileJobList;