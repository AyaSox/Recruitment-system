import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Skeleton,
  useTheme,
  useMediaQuery,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Alert,
  Divider,
  LinearProgress,
  Badge,
  Paper
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../services/dashboard.service';
import { useAuth } from '../context/AuthContext';
import { DashboardStats } from '../types/dashboard';

interface RecentActivity {
  id: string;
  type: 'application' | 'interview' | 'job' | 'status_change';
  title: string;
  description: string;
  timestamp: Date;
  status?: string;
  priority?: 'high' | 'medium' | 'low';
}

const MobileDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const statsData = await dashboardService.getDashboardStats();
      setStats(statsData);
      setRecentActivity([]); // no endpoint implemented yet
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <AssignmentIcon />;
      case 'job':
        return <WorkIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getActivityColor = (type: string, priority?: string) => {
    if (priority === 'high') return 'error';
    if (priority === 'medium') return 'warning';
    switch (type) {
      case 'application':
        return 'primary';
      case 'job':
        return 'info';
      default:
        return 'default';
    }
  };

  const speedDialActions = [
    {
      icon: <WorkIcon />,
      name: 'New Job',
      action: () => navigate('/jobs/create')
    },
    {
      icon: <AssignmentIcon />,
      name: 'Review Applications',
      action: () => navigate('/applications')
    }
  ];

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={6} md={3} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={24} width="60%" />
                  <Skeleton variant="text" height={32} width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={fetchDashboardData}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, pb: { xs: 10, md: 2 } }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here's what's happening with your recruitment activities
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, md: 2 } }}>
              <WorkIcon color="primary" sx={{ fontSize: { xs: 24, md: 32 }, mb: 1 }} />
              <Typography variant={isMobile ? "h6" : "h5"} component="h2">
                {stats?.totalJobs || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Jobs
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats ? (stats.activeJobs / Math.max(stats.totalJobs, 1)) * 100 : 0}
                sx={{ mt: 1, height: 4, borderRadius: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                {stats?.activeJobs || 0} active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, md: 2 } }}>
              <AssignmentIcon color="success" sx={{ fontSize: { xs: 24, md: 32 }, mb: 1 }} />
              <Typography variant={isMobile ? "h6" : "h5"} component="h2">
                {stats?.totalApplications || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Applications
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats ? (stats.newApplications / Math.max(stats.totalApplications, 1)) * 100 : 0}
                color="warning"
                sx={{ mt: 1, height: 4, borderRadius: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                {stats?.newApplications || 0} new
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, md: 2 } }}>
              <CheckCircleIcon color="info" sx={{ fontSize: { xs: 24, md: 32 }, mb: 1 }} />
              <Typography variant={isMobile ? "h6" : "h5"} component="h2">
                {stats?.screeningApplications || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Screening
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                <Chip size="small" label="Review" color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, md: 2 } }}>
              <WorkIcon color="warning" sx={{ fontSize: { xs: 24, md: 32 }, mb: 1 }} />
              <Typography variant={isMobile ? "h6" : "h5"} component="h2">
                {stats?.pendingApprovalJobs || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Approval
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                <Chip size="small" label="Action Needed" color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Recent Activity */}
        <Grid item xs={12} md={12}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h3">
                  Recent Activity
                </Typography>
                <TrendingUpIcon color="action" />
              </Box>
              
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No recent activity
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Activity tracking will appear here as you use the system
                </Typography>
              </Box>
              
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => navigate('/applications')}
              >
                View Applications
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions - Mobile Speed Dial */}
      {isMobile && !(user?.roles?.includes('Applicant')) && (
        <SpeedDial
          ariaLabel="Quick actions"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          open={speedDialOpen}
          onClose={() => setSpeedDialOpen(false)}
          onOpen={() => setSpeedDialOpen(true)}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => {
                action.action();
                setSpeedDialOpen(false);
              }}
            />
          ))}
        </SpeedDial>
      )}

      {/* Quick Actions - Desktop */}
      {!isMobile && !(user?.roles?.includes('Applicant')) && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            p: 2,
            display: 'flex',
            gap: 1,
            flexDirection: 'column',
            minWidth: 200
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Quick Actions
          </Typography>
          {speedDialActions.map((action) => (
            <Button
              key={action.name}
              variant="outlined"
              startIcon={action.icon}
              onClick={action.action}
              size="small"
            >
              {action.name}
            </Button>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default MobileDashboard;