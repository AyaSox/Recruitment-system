import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Alert,
  useMediaQuery,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import DashboardStatsDisplay from '../components/DashboardStatsDisplay';
import MobileDashboard from '../components/MobileDashboard';
import { DashboardService } from '../services';
import { DashboardStats } from '../types';

const DashboardPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 900px)');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await DashboardService.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use mobile dashboard for mobile devices
  if (isMobile) {
    return (
      <Layout title="ATS Recruitment System - Dashboard" maxWidth="xl">
        <MobileDashboard />
      </Layout>
    );
  }

  // Desktop dashboard
  return (
    <Layout title="ATS Recruitment System - Dashboard">
      <Box mb={4}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/">
            Home
          </MuiLink>
          <Typography color="text.primary">Dashboard</Typography>
        </Breadcrumbs>
      </Box>

      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Overview of recruitment activities and statistics
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : stats ? (
        <DashboardStatsDisplay stats={stats} />
      ) : (
        <Alert severity="info">No data available</Alert>
      )}
    </Layout>
  );
};

export default DashboardPage;
