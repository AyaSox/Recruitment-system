import React, { memo } from 'react';
import { Paper, Typography, Box, Button, Grid, Chip, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Job, JobSummary } from '../types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

interface JobCardProps {
  job: Job | JobSummary;
  isPublicView?: boolean;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onTogglePublish?: (id: number, isPublished: boolean) => void;
  onDelete?: (id: number) => void;
}

// Type guard to check if job is a full Job (has description and other Job-specific properties)
function isFullJob(job: Job | JobSummary): job is Job {
  return 'description' in job && 'skills' in job;
}

const JobCard: React.FC<JobCardProps> = memo(
  ({
    job,
    isPublicView = false,
    onView,
    onEdit,
    onTogglePublish,
    onDelete,
  }) => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const handleView = () => {
      if (onView) {
        onView(job.id);
      } else {
        navigate(isPublicView ? `/jobs/public/${job.id}` : `/jobs/${job.id}`);
      }
    };

    const getSalaryDisplayText = () => {
      if (job.salaryRangeMin && job.salaryRangeMax) {
        return `R ${job.salaryRangeMin.toLocaleString()} - R ${job.salaryRangeMax.toLocaleString()}`;
      } else if (job.salaryRangeMin) {
        return `From R ${job.salaryRangeMin.toLocaleString()}`;
      } else if (job.salaryRangeMax) {
        return `Up to R ${job.salaryRangeMax.toLocaleString()}`;
      }
      return 'Salary not disclosed';
    };

    const getDescriptionText = () => {
      if (isFullJob(job) && job.description) {
        return job.description.length > 150
          ? `${job.description.substring(0, 150)}...`
          : job.description;
      }
      return '';
    };

    const getStatusChips = () => {
      if (isPublicView) return null;

      return (
        <Box display="flex" gap={1}>
          {/* Show "Awaiting Approval" only if explicitly not approved AND not published */}
          {job.isApproved === false && !job.isPublished ? (
            <Chip
              label="Awaiting Approval"
              color="warning"
              size="small"
              sx={{ backgroundColor: '#ff9800', color: 'white' }}
            />
          ) : (
            <Chip
              label={job.isPublished ? 'Published' : 'Draft'}
              color={job.isPublished ? 'success' : 'default'}
              size="small"
            />
          )}
          {job.isEmploymentEquityPosition && (
            <Chip label="EE Position" color="info" size="small" />
          )}
        </Box>
      );
    };

    return (
      <StyledPaper elevation={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" component="h2" gutterBottom>
                {job.title}
              </Typography>
              {getStatusChips()}
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              {job.displayDepartment} • {job.displayLocation}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {getDescriptionText() && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" paragraph>
                {getDescriptionText()}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box>
              <Typography variant="body2" component="span" color="text.secondary">
                Employment Type:
              </Typography>{' '}
              <Typography variant="body2" component="span" fontWeight="bold">
                {job.employmentType}
              </Typography>
              {' • '}
              <Typography variant="body2" component="span" color="text.secondary">
                Experience Level:
              </Typography>{' '}
              <Typography variant="body2" component="span" fontWeight="bold">
                {job.experienceLevel}
              </Typography>
            </Box>

            <Box mt={1}>
              <Typography variant="body2" component="span" color="text.secondary">
                Salary Range:
              </Typography>{' '}
              <Typography variant="body2" component="span" fontWeight="bold">
                {getSalaryDisplayText()}
              </Typography>
            </Box>
          </Grid>

          {/* Display skills only for full Job objects */}
          {isFullJob(job) && job.skills && job.skills.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Required Skills:
              </Typography>
              <Box>
                {job.skills.map((skill) => (
                  <StyledChip
                    key={skill.skillId}
                    label={skill.skillName}
                    variant={skill.isRequired ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
              <Typography variant="body2" color="text.secondary">
                Closing Date: {format(new Date(job.closingDate), 'MMM dd, yyyy')}
              </Typography>

              {!isPublicView && (
                <Typography variant="body2" color="text.secondary">
                  Applications: {job.applicationCount}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button variant="outlined" color="primary" onClick={handleView}>
                View Details
              </Button>

              {!isPublicView && onEdit && (
                <Button variant="outlined" color="primary" onClick={() => onEdit(job.id)}>
                  Edit
                </Button>
              )}

              {!isPublicView && onTogglePublish && (
                <Button
                  variant="outlined"
                  color={job.isPublished ? 'warning' : 'success'}
                  onClick={() => onTogglePublish(job.id, !job.isPublished)}
                  disabled={!isAdmin() && !job.isPublished} // Only admin can publish, anyone can unpublish their own
                >
                  {job.isPublished ? 'Unpublish' : 'Publish'}
                </Button>
              )}

              {!isPublicView && onDelete && (
                <Button variant="outlined" color="error" onClick={() => onDelete(job.id)}>
                  Delete
                </Button>
              )}

              {isPublicView && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/jobs/apply/${job.id}`)}
                >
                  Apply Now
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>
    );
  },
);

JobCard.displayName = 'JobCard';

export default JobCard;
