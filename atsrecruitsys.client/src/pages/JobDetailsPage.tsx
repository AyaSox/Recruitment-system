import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  Grid,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Work as WorkIcon,
  VerifiedUser as VerifiedIcon,
  Info as InfoIcon,
  Speed as SpeedIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import { JobService } from '../services';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id || '0');
  const navigate = useNavigate();
  const { user, isAdmin, isRecruiter } = useAuth();
  
  // Check if user is authenticated and has recruiter/admin privileges
  const isRecruiterOrAdmin = user && (isAdmin() || isRecruiter());

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Toggle publish dialog
  const [openPublishDialog, setOpenPublishDialog] = useState(false);
  const [publishStatus, setPublishStatus] = useState(false);

  // Success message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  useEffect(() => {
    const fetchJob = async () => {
      console.log('JobDetailsPage: Fetching job with ID:', jobId);
      
      if (jobId <= 0 || isNaN(jobId)) {
        console.error('JobDetailsPage: Invalid job ID:', jobId);
        setError('Invalid job ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('JobDetailsPage: Calling JobService.getPublicJob...');
        
        // Use public job endpoint for both authenticated and non-authenticated users
        const data = await JobService.getPublicJob(jobId);
        
        console.log('JobDetailsPage: Job data received:', data);
        setJob(data);
        setPublishStatus(data.isPublished);
      } catch (err: any) {
        console.error('JobDetailsPage: Error fetching job:', err);
        const errorMsg = err.statusCode === 404 
          ? 'Job not found or no longer available'
          : err.message || 'Failed to load job details';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleEdit = () => {
    navigate(`/jobs/edit/${jobId}`);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    try {
      await JobService.deleteJob(jobId);
      showSuccessMessage('? Job deleted successfully!');
      setTimeout(() => navigate('/jobs'), 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete job');
    }
    handleCloseDeleteDialog();
  };

  const handleOpenPublishDialog = (status: boolean) => {
    setPublishStatus(status);
    setOpenPublishDialog(true);
  };

  const handleClosePublishDialog = () => {
    setOpenPublishDialog(false);
  };

  const handleTogglePublish = async () => {
    try {
      // Use the dedicated publish/unpublish endpoints instead of setJobPublishStatus
      if (publishStatus) {
        await JobService.publishJob(jobId);
      } else {
        await JobService.unpublishJob(jobId);
      }

      // Update local state
      if (job) {
        setJob({
          ...job,
          isPublished: publishStatus,
          isApproved: publishStatus, // Publishing also approves the job
        });
      }

      // Show success message
      const action = publishStatus ? 'published' : 'unpublished';
      showSuccessMessage(`? Job ${action} successfully!`);
      
    } catch (err: any) {
      setError(err.message || `Failed to ${publishStatus ? 'publish' : 'unpublish'} job`);
    }
    handleClosePublishDialog();
  };

  const handleApply = () => {
    navigate(`/jobs/apply/${jobId}`);
  };

  const handleViewApplications = () => {
    navigate(`/applications?jobId=${jobId}`);
  };

  const isJobClosed = () => {
    if (!job) return false;
    return new Date(job.closingDate) < new Date();
  };

  if (loading) {
    return (
      <Layout title="Job Details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error || !job) {
    return (
      <Layout title="Job Details">
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Job not found'}
        </Alert>
        <Button component={Link} to="/jobs" variant="contained">
          Back to Jobs
        </Button>
      </Layout>
    );
  }

  // Show job closed message if expired
  if (isJobClosed()) {
    return (
      <Layout title={job.title}>
        <Box mb={4}>
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} to="/">
              Home
            </MuiLink>
            <MuiLink component={Link} to="/jobs">
              Jobs
            </MuiLink>
            <Typography color="text.primary">{job.title}</Typography>
          </Breadcrumbs>
        </Box>

        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            This position has closed
          </Typography>
          <Typography>
            The application deadline for this position has passed. 
            Please browse our other current opportunities.
          </Typography>
        </Alert>

        <Button component={Link} to="/jobs" variant="contained" size="large">
          View Open Positions
        </Button>
      </Layout>
    );
  }

  return (
    <Layout title={job.title}>
      <Box mb={4}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/">
            Home
          </MuiLink>
          <MuiLink component={Link} to="/jobs">
            Jobs
          </MuiLink>
          <Typography color="text.primary">{job.title}</Typography>
        </Breadcrumbs>
      </Box>

      {/* Application Timeline Notice */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Application Timeline:</strong> Please note that if you do not hear from us within one month of the closing date, 
          you may consider your application unsuccessful for this position. We appreciate your interest in joining our team.
        </Typography>
      </Alert>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {job.title}
                </Typography>
                <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} mb={2}>
                  <Chip icon={<BusinessIcon />} label={job.displayDepartment} variant="outlined" color="primary" />
                  <Chip icon={<LocationIcon />} label={job.displayLocation} variant="outlined" color="primary" />
                  <Chip icon={<WorkIcon />} label={job.employmentType} variant="outlined" />
                  {job.experienceLevel && (
                    <Chip icon={<SpeedIcon />} label={job.experienceLevel} variant="outlined" />
                  )}
                </Box>
              </Box>

              {isRecruiterOrAdmin && (
                <Chip
                  label={job.isPublished ? 'Published' : 'Draft'}
                  color={job.isPublished ? 'success' : 'default'}
                />
              )}
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              About this role
            </Typography>
            <Typography paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7, mb: 4 }} style={{ whiteSpace: 'pre-line' }}>
              {job.description}
            </Typography>

            {/* Skills Section - No subheading */}
            {/* Required Skills */}
            {Array.isArray(job.skills || job.requiredSkills) && (job.skills || job.requiredSkills || []).filter((skill) => skill.isRequired).length > 0 && (
              <Box mb={3}>
                <Typography variant="h6" gutterBottom color="primary">
                  Required Skills
                </Typography>
                <Grid container spacing={1} mb={2}>
                  {(job.skills || job.requiredSkills || [])
                    .filter((skill) => skill.isRequired)
                    .map((skill) => (
                      <Grid item key={skill.skillId}>
                        <Chip 
                          label={skill.skillName} 
                          color="primary" 
                          variant="filled" 
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Grid>
                    ))}
                </Grid>
              </Box>
            )}

            {/* Preferred Skills */}
            {Array.isArray(job.skills || job.requiredSkills) && (job.skills || job.requiredSkills || []).filter((skill) => !skill.isRequired).length > 0 && (
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Preferred Skills
                </Typography>
                <Grid container spacing={1}>
                  {(job.skills || job.requiredSkills || [])
                    .filter((skill) => !skill.isRequired)
                    .map((skill) => (
                      <Grid item key={skill.skillId}>
                        <Chip label={skill.skillName} variant="outlined" />
                      </Grid>
                    ))}
                </Grid>
              </Box>
            )}

            {/* Employment Equity */}
            {job.isEmploymentEquityPosition && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Employment Equity Position:</strong> This position is designated as an Employment Equity position 
                  in accordance with our company's Employment Equity plan.
                  {job.employmentEquityNotes && (
                    <Box component="span" display="block" mt={1}>
                      {job.employmentEquityNotes}
                    </Box>
                  )}
                </Typography>
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Job Details Card */}
          <Card sx={{ mb: 3, position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Position Details
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Posted"
                    secondary={format(new Date(job.postedDate), 'MMM dd, yyyy')}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <ScheduleIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Application Deadline"
                    secondary={format(new Date(job.closingDate), 'MMM dd, yyyy')}
                  />
                </ListItem>
                {job.salaryRangeMin && job.salaryRangeMax && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <MoneyIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Salary Range"
                      secondary={`R ${job.salaryRangeMin.toLocaleString()} - R ${job.salaryRangeMax.toLocaleString()}`}
                    />
                  </ListItem>
                )}
                {isRecruiterOrAdmin && (
                  <>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <GroupIcon color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Applications"
                        secondary={`${job.applicationCount} received`}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <VerifiedIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Created By"
                        secondary={job.createdBy ? `${job.createdBy.firstName} ${job.createdBy.lastName}` : (job.createdByName || 'Unknown')}
                      />
                    </ListItem>
                  </>
                )}
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Action buttons */}
              <Box display="flex" flexDirection="column" gap={2}>
                {isRecruiterOrAdmin ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleViewApplications}
                    >
                      View Applications ({job.applicationCount})
                    </Button>
                    <Button variant="outlined" color="primary" fullWidth onClick={handleEdit}>
                      Edit Job
                    </Button>
                    <Button
                      variant="outlined"
                      color={job.isPublished ? 'warning' : 'success'}
                      fullWidth
                      onClick={() => handleOpenPublishDialog(!job.isPublished)}
                    >
                      {job.isPublished ? 'Unpublish Job' : 'Publish Job'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={handleOpenDeleteDialog}
                    >
                      Delete Job
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleApply}
                    sx={{
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      backgroundColor: '#ff9800',
                      '&:hover': {
                        backgroundColor: '#f57c00',
                      },
                    }}
                  >
                    Apply Now
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Job</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this job? This action cannot be undone.
            {job.applicationCount > 0 && (
              <Typography color="error" sx={{ mt: 2 }}>
                Warning: This job has {job.applicationCount} applications. Deleting it will affect
                these applications.
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Publish/Unpublish Dialog */}
      <Dialog open={openPublishDialog} onClose={handleClosePublishDialog}>
        <DialogTitle>{publishStatus ? 'Publish Job' : 'Unpublish Job'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {publishStatus
              ? 'Publishing this job will make it visible to applicants. Do you want to continue?'
              : 'Unpublishing this job will hide it from applicants. Do you want to continue?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePublishDialog}>Cancel</Button>
          <Button onClick={handleTogglePublish} color={publishStatus ? 'success' : 'warning'}>
            {publishStatus ? 'Publish' : 'Unpublish'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Message Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={() => setSuccessMessage(null)}
          sx={{ 
            minWidth: '300px',
            fontSize: '1rem',
            '& .MuiAlert-message': {
              fontSize: '0.95rem'
            }
          }}
        >
          {successMessage}
        </MuiAlert>
      </Snackbar>
    </Layout>
  );
};

export default JobDetailsPage;
