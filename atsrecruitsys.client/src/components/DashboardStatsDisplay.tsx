import React from 'react';
import { Grid, Paper, Typography, Box, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DashboardStats } from '../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
}));

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
// Prepare data for jobs overview chart
const jobsOverviewData = {
  labels: ['Total Jobs', 'Active Jobs'],
  datasets: [
    {
      label: 'Jobs',
      data: [stats.totalJobs, stats.activeJobs],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(75, 192, 192, 0.6)',
      ],
      borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
      borderWidth: 1,
    },
  ],
};

// Prepare data for applications by status chart
const applicationsOverviewData = {
  labels: ['New', 'Screening', 'Interview'],
  datasets: [
    {
      label: 'Applications by Status',
      data: [stats.newApplications, stats.screeningApplications, stats.interviewApplications],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(75, 192, 192, 0.6)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

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

      {/* Jobs overview chart */}
      <Grid item xs={12} md={6}>
        <StyledPaper elevation={3}>
          <Typography variant="h6" gutterBottom>
            Jobs Overview
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box height={300}>
            <Bar
              data={jobsOverviewData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />
          </Box>
        </StyledPaper>
      </Grid>

      {/* Applications by status chart */}
      <Grid item xs={12} md={6}>
        <StyledPaper elevation={3}>
          <Typography variant="h6" gutterBottom>
            Applications by Status
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box height={300}>
            <Bar
              data={applicationsOverviewData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />
          </Box>
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default DashboardStatsDisplay;
