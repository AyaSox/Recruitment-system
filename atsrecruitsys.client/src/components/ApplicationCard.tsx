import React from 'react';
import { Paper, Typography, Box, Button, Grid, Chip, Avatar, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Application } from '../types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

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

interface ApplicationCardProps {
  application: Application;
  onViewResume?: (id: number) => void;
  onScheduleInterview?: (id: number) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = React.memo(
  ({ application, onViewResume, onScheduleInterview }) => {
    const navigate = useNavigate();

    const handleView = () => {
      navigate(`/applications/${application.id}`);
    };

    // Safely get the most recent status change date and who changed it
    const latestStatusChange = application.statusHistory && Array.isArray(application.statusHistory) && application.statusHistory.length > 0 
      ? application.statusHistory[0] 
      : null;

    // Get applicant initials safely
    const getInitials = (name: string) => {
      return name ? name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() : '?';
    };

    return (
      <StyledPaper elevation={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 50, height: 50 }}>
                {getInitials(application.applicantName || 'Unknown')}
              </Avatar>
              <Box>
                <Typography variant="h6" component="h2">
                  {application.applicantName || 'Unknown Applicant'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {application.applicantEmail || application.email || 'No email provided'}
                </Typography>
                {application.phoneNumber && (
                  <Typography variant="body2" color="text.secondary">
                    {application.phoneNumber}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <Chip
                label={application.status || 'Unknown'}
                color={getStatusColor(application.status || '') as any}
                size="medium"
              />
              <Typography variant="body2" color="text.secondary" mt={1}>
                Applied on {application.appliedDate 
                  ? format(new Date(application.appliedDate), 'MMM dd, yyyy')
                  : 'Unknown date'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Job: {application.jobTitle || 'Unknown Position'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Department: {application.jobDepartment || application.department || 'Unknown Department'}
            </Typography>
          </Grid>



          {application.coverLetter && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Cover Letter:</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {application.coverLetter}
              </Typography>
            </Grid>
          )}

          {application.applicantNotes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Additional Notes:</Typography>
              <Typography variant="body2" color="text.secondary">
                {application.applicantNotes}
              </Typography>
            </Grid>
          )}

          {latestStatusChange && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Status changed to {latestStatusChange.status} by {latestStatusChange.changedByName} on{' '}
                {format(new Date(latestStatusChange.changedDate), 'MMM dd, yyyy')}
                {latestStatusChange.notes && (
                  <Box component="span" display="block" mt={0.5} fontStyle="italic">
                    Note: {latestStatusChange.notes}
                  </Box>  
                )}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={1} flexWrap="wrap">
              <Button variant="outlined" color="primary" onClick={handleView}>
                View Details
              </Button>

              {onViewResume && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => onViewResume(application.id)}
                >
                  View Resume
                </Button>
              )}

              {onScheduleInterview && (application.status === 'Interview' || application.status === 'Screening') && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onScheduleInterview(application.id)}
                >
                  Schedule Interview
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>
    );
  }
);

ApplicationCard.displayName = 'ApplicationCard';

export default ApplicationCard;
