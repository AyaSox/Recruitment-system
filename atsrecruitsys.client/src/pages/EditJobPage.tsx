import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Paper,
  Alert,
  CircularProgress,
  Button,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import JobForm from '../components/JobForm';
import { JobService } from '../services';
import { Job, UpdateJobRequest, CreateJobRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../hooks/useProtectedRoute';

const EditJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id || '0');
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      
      showSuccessMessage('Job updated successfully! Changes will be visible once approved by admin.');
      
      setTimeout(() => {
        navigate(`/jobs/${jobId}`);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update job');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute roles={['Admin', 'Recruiter']}>
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
      <ProtectedRoute roles={['Admin', 'Recruiter']}>
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
    <ProtectedRoute roles={['Admin', 'Recruiter']}>
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

        <Typography variant="h4" component="h1" gutterBottom>
          Edit Job
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Update the job details below
        </Typography>

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
      </Layout>
    </ProtectedRoute>
  );
};

export default EditJobPage;
