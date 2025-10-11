import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import { ApplicationService } from '../services';
import { Application } from '../types';
import ProtectedRoute from '../hooks/useProtectedRoute';
import { ApiError } from '../services/api';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'applied':
    case 'new':
      return 'info';
    case 'screening':
    case 'under review':
      return 'secondary';
    case 'interview':
    case 'interview scheduled':
      return 'primary';
    case 'offer':
      return 'warning';
    case 'hired':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const ApplicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const applicationId = parseInt(id || '0');
  const navigate = useNavigate();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      if (applicationId <= 0) {
        setErrorMessage('Invalid application ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await ApplicationService.getApplication(applicationId);
        setApplication(data);
        setErrorMessage(null);
      } catch (err) {
        const apiError = err as ApiError;
        setErrorMessage(apiError.message || 'Failed to load application details');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  const handleViewResume = () => {
    ApplicationService.getResumeFile(applicationId)
      .then((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      })
      .catch((err: unknown) => {
        const apiError = err as ApiError;
        setErrorMessage(apiError.message || 'Failed to load resume file');
      });
  };

  if (loading) {
    return (
      <ProtectedRoute roles={['Admin', 'Recruiter']}>
        <Layout title="ATS Recruitment System - Application Details">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (errorMessage || !application) {
    return (
      <ProtectedRoute roles={['Admin', 'Recruiter']}>
        <Layout title="ATS Recruitment System - Application Details">
          <Alert severity="error" sx={{ mb: 4 }}>
            {errorMessage || 'Application not found'}
          </Alert>
          <Button component={Link} to="/applications" variant="contained">
            Back to Applications
          </Button>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute roles={['Admin', 'Recruiter']}>
      <Layout title={`ATS Recruitment System - ${application.applicantName}'s Application`}>
        <Box mb={4}>
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} to="/">
              Home
            </MuiLink>
            <MuiLink component={Link} to="/applications">
              Applications
            </MuiLink>
            <Typography color="text.primary">{application.applicantName}'s Application</Typography>
          </Breadcrumbs>
        </Box>

        {/* Header with applicant info */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                {application.applicantName.charAt(0)}
              </Avatar>
            </Grid>

            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                {application.applicantName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Application for {application.jobTitle}
              </Typography>
              <Box mt={1} display="flex" alignItems="center" gap={1}>
                <Chip
                  label={application.status}
                  color={getStatusColor(application.status) as any}
                />
                <Typography variant="body2" color="text.secondary">
                  Applied on {format(new Date(application.appliedDate), 'PPP')}
                </Typography>
              </Box>
            </Grid>

            <Grid item>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button variant="outlined" color="primary" onClick={handleViewResume}>
                  View Resume
                </Button>
                {/* STATUS NOTICE - Removed Change Status button per user request */}
                <Alert severity="info" sx={{ maxWidth: 200 }}>
                  Use the Application Funnel to change status via drag & drop
                </Alert>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          {/* Left column: Applicant details */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Applicant Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Name" secondary={application.applicantName} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={application.applicantEmail} />
                </ListItem>
                {/* Show phone number if available (from simple applications) */}
                {application.phoneNumber && (
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Phone" secondary={application.phoneNumber} />
                  </ListItem>
                )}
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Applied Date"
                    secondary={format(new Date(application.appliedDate), 'PPP')}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Job Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Position" secondary={application.jobTitle} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Department" secondary={application.jobDepartment} />
                </ListItem>
              </List>

              <Box mt={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  component={Link}
                  to={`/jobs/${application.jobId}`}
                >
                  View Job Details
                </Button>
              </Box>

              <Box mt={2}>
                <Button
                  variant="contained"
                  fullWidth
                  component={Link}
                  to="/applications/funnel"
                  color="primary"
                >
                  Go to Application Funnel
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Right column: Application details & timeline */}
          <Grid item xs={12} md={8}>
            {/* Message/Cover Letter */}
            {(application.coverLetter || application.applicantNotes) && (
              <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {application.coverLetter ? 'Cover Letter' : 'Message'}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {application.coverLetter || application.applicantNotes}
                </Typography>
              </Paper>
            )}

            {/* Status history timeline */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Status History
              </Typography>

              {application.statusHistory && application.statusHistory.length > 0 ? (
                <Timeline>
                  {application.statusHistory.map((status, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="text.secondary">
                        {format(new Date(status.changedDate), 'PPP p')}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color={getStatusColor(status.status) as any} />
                        {index < application.statusHistory.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="body1">
                          Status changed to <strong>{status.status}</strong>
                        </Typography>
                        <Typography variant="body2">by {status.changedByName}</Typography>
                        {status.notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            "{status.notes}"
                          </Typography>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <Alert severity="info">
                  No status history available yet.
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Success Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={5000}
          onClose={() => setSuccessMessage(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="success"
            onClose={() => setSuccessMessage(null)}
          >
            {successMessage}
          </MuiAlert>
        </Snackbar>
      </Layout>
    </ProtectedRoute>
  );
};

export default ApplicationDetailsPage;
