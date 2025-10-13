import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link as MuiLink, 
  Paper, 
  Alert, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import JobForm from '../components/JobForm';
import { JobService } from '../services';
import { CreateJobRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import ProtectedRoute from '../hooks/useProtectedRoute';

const CreateJobPage: React.FC = () => {
const navigate = useNavigate();
const { notifySuccess } = useNotification();
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);
const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
const [createdJobId, setCreatedJobId] = useState<number | null>(null);

  const handleSubmit = async (values: CreateJobRequest) => {
    try {
      setSubmitting(true);
      setError(null);
      const job = await JobService.createJob(values);
      
      setCreatedJobId(job.id);
      setApprovalDialogOpen(true);
      setSubmitting(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create job');
      setSubmitting(false);
    }
  };

  const handleViewJobDetails = () => {
    setApprovalDialogOpen(false);
    if (createdJobId) {
      navigate(`/jobs/${createdJobId}`);
    }
  };

  const handleGoToJobs = () => {
    setApprovalDialogOpen(false);
    notifySuccess('Job created and published successfully!');
    navigate('/jobs');
  };

  const handleCloseDialog = () => {
    setApprovalDialogOpen(false);
    notifySuccess('Job created and published successfully!');
  };

  return (
    <ProtectedRoute roles={['Admin', 'Recruiter']}>
      <Layout title="ATS Recruitment System - Create Job">
        <Box mb={4}>
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} to="/">
              Home
            </MuiLink>
            <MuiLink component={Link} to="/jobs">
              Jobs
            </MuiLink>
            <Typography color="text.primary">Create Job</Typography>
          </Breadcrumbs>
        </Box>

        <Typography variant="h4" component="h1" gutterBottom>
          Create New Job
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Fill in the details to create a new job posting
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <JobForm 
            onSubmit={handleSubmit} 
            onCancel={() => navigate('/jobs')}
            loading={submitting} 
          />
        </Paper>

        {/* Job Created Confirmation Dialog */}
        <Dialog 
          open={approvalDialogOpen} 
          onClose={handleCloseDialog}
          maxWidth="sm" 
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Job Published Successfully!
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box textAlign="center" px={2}>
              <Typography variant="body1" paragraph>
                Your job posting has been created and is now live and visible to candidates.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                You can view the job details, edit it, or monitor applications from your dashboard.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
            <Button 
              onClick={handleCloseDialog}
              size="large"
            >
              Close
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined"
                onClick={handleGoToJobs}
                size="large"
              >
                Go to Jobs
              </Button>
              <Button 
                variant="contained" 
                onClick={handleViewJobDetails}
                size="large"
              >
                View Details
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Layout>
    </ProtectedRoute>
  );
};

export default CreateJobPage;
