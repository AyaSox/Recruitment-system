import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { ApplicationService } from '../services';
import { Application } from '../types';
import { format } from 'date-fns';

// Application stages/columns for the funnel - matching actual database statuses
const APPLICATION_STAGES = [
  { id: 'applied', title: 'Applied', color: '#2196f3', status: 'Applied' },
  { id: 'screening', title: 'Screening', color: '#ff9800', status: 'Screening' },
  { id: 'interview', title: 'Interview', color: '#9c27b0', status: 'Interview' },
  { id: 'offer', title: 'Offer', color: '#4caf50', status: 'Offer' },
  { id: 'hired', title: 'Hired', color: '#8bc34a', status: 'Hired' },
  { id: 'rejected', title: 'Rejected', color: '#f44336', status: 'Rejected' },
];

// Application Card Component
const ApplicationCard: React.FC<{
  application: Application;
  onViewDetails: (id: number) => void;
  onScheduleInterview: (id: number) => void;
  onUpdateStatus: (id: number, status: string, notes?: string) => void;
  onDragStart: (e: React.DragEvent, application: Application) => void;
}> = ({ application, onViewDetails, onScheduleInterview, onUpdateStatus, onDragStart }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusUpdate = () => {
    if (newStatus) {
      onUpdateStatus(application.id, newStatus, statusNotes);
      setStatusDialog(false);
      setNewStatus('');
      setStatusNotes('');
    }
  };

  const getStatusColor = (status: string) => {
    const stage = APPLICATION_STAGES.find((s) => s.status === status);
    return stage?.color || '#757575';
  };

  // Safe property access with fallbacks
  const applicationLocation =
    application.location || application.jobDepartment || 'Location not specified';
  const applicationEmail = application.applicantEmail || application.email || '';

  return (
    <>
      <Card
        draggable
        onDragStart={(e) => onDragStart(e, application)}
        sx={{
          mb: 0.75,
          cursor: 'grab',
          '&:hover': { boxShadow: 2 },
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <Avatar sx={{ width: 28, height: 28, mr: 0.75 }}>
                  <PersonIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" fontWeight="bold" fontSize="0.75rem" lineHeight={1.2}>
                    {application.applicantName || 'Unknown Applicant'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontSize="0.65rem" display="block" lineHeight={1.2}>
                    {application.jobTitle || 'Unknown Position'}
                  </Typography>
                </Box>
              </Box>

              <Box mb={0.5}>
                <Chip
                  label={application.status || 'Unknown Status'}
                  size="small"
                  sx={{
                    backgroundColor: getStatusColor(application.status),
                    color: 'white',
                    fontSize: '0.65rem',
                    height: '18px',
                  }}
                />
              </Box>

              <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <CalendarIcon sx={{ fontSize: '0.75rem' }} color="action" />
                <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                  {application.appliedDate
                    ? format(new Date(application.appliedDate), 'MMM dd, yyyy')
                    : 'Date unknown'}
                </Typography>
              </Box>

              {applicationEmail && (
                <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                  <EmailIcon sx={{ fontSize: '0.75rem' }} color="action" />
                  <Typography variant="caption" color="text.secondary" noWrap fontSize="0.65rem">
                    {applicationEmail}
                  </Typography>
                </Box>
              )}

              {applicationLocation && applicationLocation !== 'Location not specified' && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <LocationIcon sx={{ fontSize: '0.75rem' }} color="action" />
                  <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                    {applicationLocation}
                  </Typography>
                </Box>
              )}
            </Box>

            <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0.5 }}>
              <MoreVertIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Box>
        </CardContent>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              onViewDetails(application.id);
              handleMenuClose();
            }}
          >
            View Details
          </MenuItem>
          <MenuItem
            onClick={() => {
              onScheduleInterview(application.id);
              handleMenuClose();
            }}
          >
            Schedule Interview
          </MenuItem>
          <MenuItem
            onClick={() => {
              setStatusDialog(true);
              handleMenuClose();
            }}
          >
            Update Status
          </MenuItem>
        </Menu>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="New Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            margin="normal"
          >
            {APPLICATION_STAGES.map((stage) => (
              <MenuItem key={stage.id} value={stage.status}>
                {stage.title} - {stage.status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes (Optional)"
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            margin="normal"
            placeholder="Add any notes about this status change..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Main Application Funnel Component
const ApplicationFunnelPage: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedApplication, setDraggedApplication] = useState<Application | null>(null);
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // Pass proper ApplicationFilters object instead of empty object
      const data = await ApplicationService.getApplications({
        searchTerm: '',
        status: undefined,
        jobId: undefined,
      });
      setApplications(data.items || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to load applications');
      setApplications([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, application: Application) => {
    setDraggedApplication(application);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', application.id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();

    if (!draggedApplication) return;

    const targetStage = APPLICATION_STAGES.find((stage) => stage.id === targetStageId);
    if (!targetStage || targetStage.status === draggedApplication.status) {
      setDraggedApplication(null);
      return;
    }

    try {
      // Update application status
      await ApplicationService.updateApplicationStatus(
        draggedApplication.id,
        targetStage.status,
        `Moved to ${targetStage.title} via drag and drop`
      );

      // Show success message
      setSuccessMessage(
        `${draggedApplication.applicantName} moved to ${targetStage.title} successfully!`
      );

      // Refresh applications
      await fetchApplications();
    } catch (err: any) {
      console.error('Error updating application status:', err);
      setError(err.message || 'Failed to update application status');
    } finally {
      setDraggedApplication(null);
    }
  };

  const handleViewDetails = (applicationId: number) => {
    navigate(`/applications/${applicationId}`);
  };

  const handleScheduleInterview = (applicationId: number) => {
    navigate(`/applications/${applicationId}/schedule-interview`);
  };

  const handleUpdateStatus = async (applicationId: number, status: string, notes?: string) => {
    try {
      await ApplicationService.updateApplicationStatus(applicationId, status, notes);
      
      // Find the application and stage for success message
      const application = applications.find(app => app.id === applicationId);
      const targetStage = APPLICATION_STAGES.find(stage => stage.status === status);
      
      if (application && targetStage) {
        setSuccessMessage(
          `${application.applicantName} status updated to ${targetStage.title} successfully!`
        );
      } else {
        setSuccessMessage('Application status updated successfully!');
      }
      
      await fetchApplications();
    } catch (err: any) {
      console.error('Error updating application status:', err);
      setError(err.message || 'Failed to update application status');
    }
  };

  // Group applications by stage with safe array handling
  const groupedApplications = APPLICATION_STAGES.reduce(
    (acc, stage) => {
      acc[stage.id] = applications.filter((app) => app && app.status === stage.status) || [];
      return acc;
    },
    {} as Record<string, Application[]>
  );

  if (loading) {
    return (
      <Layout title="Application Funnel">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Application Funnel">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      <Box mb={2}>
        <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
          Application Funnel
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Drag and drop applications between stages to update their status
        </Typography>
      </Box>

      <Box display="flex" gap={1.5} overflow="auto" minHeight="500px">
        {APPLICATION_STAGES.map((stage) => (
          <Paper
            key={stage.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
            sx={{
              minWidth: 220,
              maxWidth: 220,
              p: 1.5,
              bgcolor: '#fafafa',
              border: draggedApplication ? '2px dashed #ccc' : 'none',
            }}
          >
            {/* Stage Header */}
            <Box mb={1.5}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                <Typography variant="subtitle2" fontWeight="bold" fontSize="0.9rem">
                  {stage.title}
                </Typography>
                <Chip
                  label={groupedApplications[stage.id]?.length || 0}
                  size="small"
                  sx={{ 
                    bgcolor: stage.color, 
                    color: 'white',
                    height: '20px',
                    fontSize: '0.7rem'
                  }}
                />
              </Box>
              <Box height="3px" bgcolor={stage.color} borderRadius="2px" />
            </Box>

            {/* Applications Area */}
            <Box
              sx={{
                minHeight: 350,
                p: 0.5,
                borderRadius: 1,
              }}
            >
              {groupedApplications[stage.id]?.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onViewDetails={handleViewDetails}
                  onScheduleInterview={handleScheduleInterview}
                  onUpdateStatus={handleUpdateStatus}
                  onDragStart={handleDragStart}
                />
              ))}

              {/* Empty state */}
              {(!groupedApplications[stage.id] || groupedApplications[stage.id].length === 0) && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="150px"
                  color="text.secondary"
                >
                  <Typography variant="caption" textAlign="center">
                    No applications
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Summary Statistics */}
      <Paper sx={{ mt: 2, p: 1.5 }}>
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          Funnel Statistics
        </Typography>
        <Box display="flex" gap={3} flexWrap="wrap">
          <Box textAlign="center">
            <Typography variant="h5" color="primary" fontWeight="bold">
              {applications.length}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
              Total
            </Typography>
          </Box>
          {APPLICATION_STAGES.map((stage) => (
            <Box key={stage.id} textAlign="center">
              <Typography variant="h5" sx={{ color: stage.color, fontWeight: 'bold' }}>
                {groupedApplications[stage.id]?.length || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                {stage.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

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

export default ApplicationFunnelPage;
