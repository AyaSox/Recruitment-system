import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  Alert,
  Pagination,
  Chip,
  useTheme,
  useMediaQuery,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
  LinearProgress,
  Fade,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../context/AuthContext';
import JobService from '../services/job.service';
import { JobSummary, PaginatedJobResponse } from '../types/job';
import JobCard from '../components/JobCard';
import MobileJobList from '../components/MobileJobList';
import Layout from '../components/Layout';
import { LocationSelect, DepartmentSelect } from '../components/LocationDepartmentSelect';

// Modern Job Card Skeleton
const JobCardSkeleton: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: 3 }} />
          </Box>
          <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
        </Grid>

        <Grid item xs={12}>
          <Skeleton variant="rectangular" width="100%" height={1} sx={{ my: 2 }} />
        </Grid>

        <Grid item xs={12}>
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Skeleton variant="rounded" width={120} height={24} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rounded" width={100} height={24} sx={{ borderRadius: 3 }} />
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rounded" width={80} height={24} sx={{ borderRadius: 3 }} />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <Skeleton variant="text" width={200} height={20} />
            <Skeleton variant="text" width={150} height={20} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Skeleton variant="rectangular" width="100%" height={1} sx={{ my: 2 }} />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Skeleton variant="rounded" width={120} height={36} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 1 }} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

const JobsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, isAdmin, isRecruiter, isHiringManager } = useAuth();
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  // Simple search filters
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Dialog state
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [jobToToggle, setJobToToggle] = useState<{ id: number; isPublished: boolean } | null>(null);

  // Fix: Use roles array instead of role property
  const isRecruiterOrAdmin = user?.roles?.includes('Recruiter') || user?.roles?.includes('Admin');
  
  // Determine if this is a public view (external applicants)
  const isPublicView = !user || (!isAdmin() && !isRecruiter() && !isHiringManager());

  useEffect(() => {
    loadJobs();
  }, [page, searchTerm, locationFilter, departmentFilter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: PaginatedJobResponse = await JobService.getJobs(page, pageSize, {
        searchTerm: searchTerm || undefined,
        location: locationFilter || undefined,
        department: departmentFilter || undefined,
      });
      
      setJobs(response.items);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    setLocationFilter('');
    setDepartmentFilter('');
    setPage(0);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1); // MUI Pagination is 1-indexed, but API is 0-indexed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateJob = () => {
    navigate('/jobs/create');
  };

  const handleViewJob = (id: number) => {
    navigate(`/jobs/${id}`);
  };

  const handleEditJob = (id: number) => {
    navigate(`/jobs/${id}/edit`);
  };

  const handleTogglePublish = (id: number, newPublishState: boolean) => {
    // Check if user has permission
    if (!isAdmin() && newPublishState) {
      setError('Only administrators can publish jobs.');
      return;
    }
    
    setJobToToggle({ id, isPublished: newPublishState });
    setPublishDialogOpen(true);
  };

  const handleConfirmTogglePublish = async () => {
    if (!jobToToggle) return;

    try {
      const { id, isPublished } = jobToToggle;
      
      if (isPublished) {
        await JobService.publishJob(id);
      } else {
        await JobService.unpublishJob(id);
      }

      // Update the job in the local state
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === id 
            ? { ...job, isPublished } 
            : job
        )
      );

      setError(null);
    } catch (err: any) {
      console.error('Error toggling job publish status:', err);
      setError(err.message || 'Failed to update job status');
    } finally {
      setPublishDialogOpen(false);
      setJobToToggle(null);
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      await JobService.deleteJob(id);
      
      // Remove the job from local state
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
      setTotalCount(prev => prev - 1);
      
      setError(null);
    } catch (err: any) {
      console.error('Error deleting job:', err);
      setError(err.message || 'Failed to delete job');
    }
  };

  const hasActiveFilters = searchTerm || locationFilter || departmentFilter;

  // Use mobile job list for mobile devices
  if (isMobile) {
    return (
      <Layout title="Job Opportunities" maxWidth="xl">
        <MobileJobList />
      </Layout>
    );
  }

  // Desktop view
  if (error) {
    return (
      <Layout title="Job Opportunities">
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button onClick={loadJobs} variant="contained">
            Retry
          </Button>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout title="Job Opportunities">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Loading Progress Bar */}
        {loading && (
          <LinearProgress 
            sx={{ 
              position: 'fixed',
              top: 64,
              left: 0,
              right: 0,
              zIndex: 1100,
              height: 3,
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.primary.main,
              }
            }} 
          />
        )}

        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <WorkIcon color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Job Opportunities
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={300} height={24} />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  {totalCount > 0 ? (
                    <>
                      Showing {jobs.length} of {totalCount} available positions
                      {hasActiveFilters && (
                        <Chip 
                          label="Filters Active" 
                          size="small" 
                          color="primary" 
                          sx={{ ml: 2 }}
                          onDelete={handleResetSearch}
                        />
                      )}
                    </>
                  ) : (
                    'No jobs available at the moment'
                  )}
                </Typography>
              )}
            </Box>
          </Box>

          {isRecruiterOrAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateJob}
              size="large"
              disabled={loading}
            >
              Post New Job
            </Button>
          )}
        </Box>

        {/* Role-based notice */}
        {isRecruiterOrAdmin && !isAdmin() && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Recruiter Note:</strong> You can create and edit jobs, but only Administrators can publish them to make them visible to applicants.
            </Typography>
          </Alert>
        )}

        {/* Enhanced Search Filters with Searchable Dropdowns */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Search & Filter Jobs
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Keywords"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Job title, skills, company..."
                disabled={loading}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                helperText="Search by job title, skills, or keywords"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <LocationSelect
                value={locationFilter}
                onChange={(value) => setLocationFilter(Array.isArray(value) ? value[0] || '' : value)}
                label="Filter by Location"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DepartmentSelect
                value={departmentFilter}
                onChange={(value) => setDepartmentFilter(Array.isArray(value) ? value[0] || '' : value)}
                label="Filter by Department"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleResetSearch}
                sx={{ height: '56px' }}
                disabled={loading}
              >
                Clear All
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Loading State with Skeleton */}
        {loading ? (
          <Fade in={loading} timeout={300}>
            <Box>
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Grid item xs={12} key={i}>
                    <JobCardSkeleton />
                  </Grid>
                ))}
              </Grid>

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
          </Fade>
        ) : (
          <>
            {/* Job List */}
            {jobs.length === 0 ? (
              <Box textAlign="center" py={8}>
                <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No jobs found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hasActiveFilters 
                    ? 'Try adjusting your search filters'
                    : 'Check back later for new opportunities'
                  }
                </Typography>
                {hasActiveFilters && (
                  <Button 
                    variant="outlined" 
                    onClick={handleResetSearch}
                    sx={{ mt: 2 }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>
            ) : (
              <Fade in={!loading} timeout={500}>
                <Grid container spacing={3}>
                  {jobs.map((job) => (
                    <Grid item xs={12} key={job.id}>
                      <JobCard 
                        job={job}
                        isPublicView={isPublicView}
                        onView={handleViewJob}
                        onEdit={isRecruiterOrAdmin ? handleEditJob : undefined}
                        onTogglePublish={isRecruiterOrAdmin ? handleTogglePublish : undefined}
                        onDelete={isRecruiterOrAdmin ? handleDeleteJob : undefined}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Fade>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}

        {/* Publish/Unpublish Confirmation Dialog */}
        <Dialog open={publishDialogOpen} onClose={() => setPublishDialogOpen(false)}>
          <DialogTitle>
            {jobToToggle?.isPublished ? 'Publish Job' : 'Unpublish Job'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {jobToToggle?.isPublished
                ? 'Are you sure you want to publish this job? It will become visible to all applicants.'
                : 'Are you sure you want to unpublish this job? It will no longer be visible to applicants.'
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleConfirmTogglePublish} 
              color={jobToToggle?.isPublished ? 'success' : 'warning'}
              variant="contained"
            >
              {jobToToggle?.isPublished ? 'Publish' : 'Unpublish'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default JobsPage;
