import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardStats } from '../types';

const StyledMetricPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
}));

interface DashboardStatsDisplayProps {
  stats: DashboardStats;
}

const DashboardStatsDisplay: React.FC<DashboardStatsDisplayProps> = ({ stats }) => {

  return (
    <Grid container spacing={3}>
      {/* Key metrics */}
      <Grid item xs={12} sm={6} md={3}>
        <StyledMetricPaper elevation={3}>
          <Typography variant="h4" color="primary">
            {stats.totalJobs}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Jobs
          </Typography>
        </StyledMetricPaper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StyledMetricPaper elevation={3}>
          <Typography variant="h4" color="primary">
            {stats.activeJobs}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active Jobs
          </Typography>
        </StyledMetricPaper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StyledMetricPaper elevation={3}>
          <Typography variant="h4" color="primary">
            {stats.totalApplications}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Applications
          </Typography>
        </StyledMetricPaper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StyledMetricPaper elevation={3}>
          <Typography variant="h4" color="primary">
            {stats.newApplications}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            New Applications
          </Typography>
        </StyledMetricPaper>
      </Grid>
    </Grid>
  );
};

export default DashboardStatsDisplay;
