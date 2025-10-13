import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Paper,
  Alert,
  AlertTitle,
  CircularProgress,
  Button,
  Snackbar,
  Alert as MuiAlert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
} from '@mui/material';
import { 
  Warning as WarningIcon, 
  Delete as DeleteIcon,
  Info as InfoIcon 
} from '@mui/icons-material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import JobForm from '../components/JobForm';
import { JobService } from '../services';
import { Job, UpdateJobRequest, CreateJobRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../hooks/useProtectedRoute';

const EditJobPage: React.FC = () => {
  const { id } = useParams();
  const jobId = parseInt(id || '0');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  useEffect(() => {
    const fetchJob = async () => {
      if (jobId <= 0) {
        setError('Invalid job ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await JobService.getJob(jobId);
        setJob(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleSubmit = async (values: CreateJobRequest | UpdateJobRequest) => {
    try {
      setSubmitting(true);
      setError(null);
      await JobService.updateJob(jobId, values as UpdateJobRequest);
      
      showSuccessMessage('Job updated successfully!');
      
      setTimeout(() => {
        navigate(`/jobs/${jobId}`);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update job');
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError(null);
      await JobService.deleteJob(jobId);
      
      showSuccessMessage('Job deleted successfully!');
      
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete job. Jobs with applications cannot be deleted.');
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute roles={['Admin', 'Recruiter', 'HiringManager']}>
        <Layout title="ATS Recruitment System - Edit Job">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error || !job) {
    return (
      <ProtectedRoute roles={['Admin', 'Recruiter', 'HiringManager']}>
        <Layout title="ATS Recruitment System - Edit Job">
          <Alert severity="error" sx={{ mb: 4 }}>
            {error || 'Job not found'}
          </Alert>
          <Button component={Link} to="/jobs" variant="contained">
            Back to Jobs
          </Button>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute roles={['Admin', 'Recruiter', 'HiringManager']}>
      <Layout title={`ATS Recruitment System - Edit ${job.title}`}>
        <Box mb={4}>
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} to="/">
              Home
            </MuiLink>
            <MuiLink component={Link} to="/jobs">
              Jobs
            </MuiLink>
            <MuiLink component={Link} to={`/jobs/${jobId}`}>
              {job.title}
            </MuiLink>
            <Typography color="text.primary">Edit</Typography>
          </Breadcrumbs>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Edit Job
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              <Typography variant="subtitle1" color="text.secondary">
                Update the job details below
              </Typography>
              {job.isPublished && (
                <Chip 
                  label="Published" 
                  color="success" 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              )}
              {!job.isPublished && (
                <Chip 
                  label="Draft" 
                  color="default" 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
          </Box>
          
          
          
          {/* Delete Button - Admin, Recruiter, HiringManager (own jobs only) */}
          {(user?.roles.includes('Admin') || user?.roles.includes('Recruiter') || user?.roles.includes('HiringManager')) && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              disabled={deleting || submitting}
            >
              Delete Job
            </Button>
          )}
        </Box>

        {/* Warning for Published Jobs with Applications */}
        {job.isPublished && job.applicationCount > 0 && (
          <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
            <AlertTitle>Editing Published Job with {job.applicationCount} Application{job.applicationCount !== 1 ? 's' : ''}</AlertTitle>
            <Typography variant="body2">
              This job is currently published and has received applications. Consider the following before making changes:
            </Typography>
            <ul style={{ marginTop: '8px', marginBottom: '0' }}>
              <li><strong>Minor edits</strong> (typos, clarifications) - Safe to proceed</li>
              <li><strong>Major changes</strong> (requirements, salary) - May affect existing applicants</li>
              <li><strong>Significant rewrites</strong> - Consider unpublishing or creating a new job posting</li>
            </ul>
            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
              All changes are logged in the audit trail for transparency.
            </Typography>
          </Alert>
        )}

        {/* Warning for Published Jobs */}
        {job.isPublished && job.applicationCount === 0 && (
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
            <AlertTitle>Editing Published Job</AlertTitle>
            <Typography variant="body2">
              This job is currently published but hasn't received applications yet. 
              You can safely make changes without affecting candidates.
            </Typography>
          </Alert>
        )}

        {/* General Info for Draft Jobs */}
        {!job.isPublished && (
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
            <AlertTitle>Editing Draft Job</AlertTitle>
            <Typography variant="body2">
              This job is currently in draft status. Make your changes and publish when ready.
            </Typography>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <JobForm
          job={job}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/jobs/${jobId}`)}
          loading={submitting}
        />

        {/* Success Message Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Delete Job: {job?.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this job posting? This action cannot be undone.
            </DialogContentText>
            {job?.applicationCount > 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <AlertTitle>Warning</AlertTitle>
                This job has <strong>{job.applicationCount}</strong> application{job.applicationCount !== 1 ? 's' : ''}. 
                Deleting it may affect applicant records.
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              color="error"
              variant="contained"
              disabled={deleting}
              startIcon={deleting ? <CircularProgress size={16} /> : <DeleteIcon />}
            >
              {deleting ? 'Deleting...' : 'Delete Job'}
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </ProtectedRoute>
  );
};

export default EditJobPage;
