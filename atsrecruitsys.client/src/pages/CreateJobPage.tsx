import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link as MuiLink, 
  Paper, 
  Alert, 
  Snackbar, 
  Alert as MuiAlert,
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
import ProtectedRoute from '../hooks/useProtectedRoute';

const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<number | null>(null);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

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

  const handleApprovalDialogClose = () => {
    setApprovalDialogOpen(false);
    if (createdJobId) {
      navigate(`/jobs/${createdJobId}`);
    }
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

        {/* Admin Approval Confirmation Dialog */}
        <Dialog 
          open={approvalDialogOpen} 
          onClose={handleApprovalDialogClose}
          maxWidth="sm" 
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Job Submitted Successfully!
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box textAlign="center" px={2}>
              <Typography variant="h6" gutterBottom color="primary">
                {'\u23F3'} Awaiting Admin Approval
              </Typography>
              <Typography variant="body1" paragraph>
                Your job posting has been created and submitted to administrators for review.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Next Steps:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ textAlign: 'left', ml: 2 }}>
                {'\u2705'} Admin will review your job posting<br/>
                {'\u2705'} Once approved, it will be available for publishing<br/>
                {'\u2705'} You will be notified when approval is complete<br/>
                {'\u2705'} Only admins can publish/unpublish jobs
              </Typography>
              <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>
                <Typography variant="body2">
                  <strong>Note:</strong> Until approved and published, this job will not be visible to external candidates.
                </Typography>
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button 
              variant="contained" 
              onClick={handleApprovalDialogClose}
              size="large"
            >
              View Job Details
            </Button>
          </DialogActions>
        </Dialog>

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

export default CreateJobPage;
