import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Container,
  Button,
  Stack,
  Chip,
  Divider,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Work as WorkIcon,
  Assignment as ApplicationIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  ShowChart as BarChartIcon,
  PieChart as PieChartIcon,
  Download as DownloadIcon,
  TableChart as ExcelIcon,
  CheckCircle as CheckIcon,
  HourglassEmpty as PendingIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import ProtectedRoute from '../hooks/useProtectedRoute';
import { DashboardService, ReportService } from '../services';
import DepartmentJobsChart from '../components/charts/DepartmentJobsChart';
import DepartmentApplicationsChart from '../components/charts/DepartmentApplicationsChart';
import EmploymentTypeChart from '../components/charts/EmploymentTypeChart';
import ExperienceLevelChart from '../components/charts/ExperienceLevelChart';
import ApplicationStatusChart from '../components/charts/ApplicationStatusChart';
import type {
  DashboardStats,
  DepartmentAnalytics,
  EmploymentTypeStats,
  ExperienceLevelStats,
  ApplicationStatusDistribution,
} from '../types/dashboard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ReportsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [departmentAnalytics, setDepartmentAnalytics] = useState<DepartmentAnalytics | null>(null);
  const [employmentTypeStats, setEmploymentTypeStats] = useState<EmploymentTypeStats[]>([]);
  const [experienceLevelStats, setExperienceLevelStats] = useState<ExperienceLevelStats[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<ApplicationStatusDistribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [
        statsData,
        deptData,
        empTypeData,
        expLevelData,
        statusData,
      ] = await Promise.all([
        DashboardService.getDashboardStats(),
        DashboardService.getDepartmentAnalytics(),
        DashboardService.getEmploymentTypeStats(),
        DashboardService.getExperienceLevelStats(),
        DashboardService.getApplicationStatusDistribution(),
      ]);

      setStats(statsData);
      setDepartmentAnalytics(deptData);
      setEmploymentTypeStats(empTypeData);
      setExperienceLevelStats(expLevelData);
      setStatusDistribution(statusData);
      setError(null);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    if (!stats) return;
    
    try {
      setExporting(true);
      await ReportService.exportToExcel(stats);
    } catch (err: any) {
      console.error('Export error:', err);
      setError('Failed to export to Excel. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <ProtectedRoute roles={['Admin', 'Recruiter']}>
        <Layout title="ATS Recruitment System - Reports">
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <CircularProgress size={60} sx={{ color: 'primary.main' }} />
            </Box>
          </Container>
        </Layout>
      </ProtectedRoute>
    );
  }

  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <ProtectedRoute roles={['Admin', 'Recruiter']}>
      <Layout title="ATS Recruitment System - Reports">
        <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
          {/* Modern Header Section */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    borderRadius: '12px',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AssessmentIcon sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Typography variant="h4" component="h1" fontWeight={700} color="text.primary">
                  Reports & Analytics
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ ml: 7 }}>
                Track recruitment performance and key metrics
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={exporting ? <CircularProgress size={20} color="inherit" /> : <ExcelIcon />}
              onClick={handleExportExcel}
              disabled={exporting || !stats}
              sx={{
                px: 3,
                py: 1.5,
                boxShadow: '0 4px 14px rgba(46, 125, 50, 0.25)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(46, 125, 50, 0.35)',
                },
              }}
            >
              {exporting ? 'Exporting...' : 'Export to Excel'}
            </Button>
          </Stack>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }} 
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Tabs for different views */}
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                px: 2,
              }}
            >
              <Tab 
                icon={<AssessmentIcon />} 
                iconPosition="start" 
                label="Overview" 
                sx={{ fontWeight: 600 }}
              />
              <Tab 
                icon={<InsightsIcon />} 
                iconPosition="start" 
                label="Department Analytics" 
                sx={{ fontWeight: 600 }}
              />
              <Tab 
                icon={<PieChartIcon />} 
                iconPosition="start" 
                label="Distributions" 
                sx={{ fontWeight: 600 }}
              />
            </Tabs>

            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              {stats && (
                <Grid container spacing={3}>
                  {/* Jobs Overview Section */}
                  <Grid item xs={12}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        background: 'linear-gradient(135deg, #f1f8f4 0%, #ffffff 100%)'
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                        <WorkIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight={600} color="text.primary">
                          Job Postings Overview
                        </Typography>
                      </Stack>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card 
                            sx={{ 
                              height: '100%',
                              background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                              border: 'none',
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '100px',
                                height: '100px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '50%',
                                transform: 'translate(30%, -30%)',
                              }
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Typography variant="h3" component="div" fontWeight={700} color="white" sx={{ mb: 0.5 }}>
                                {stats.totalJobs}
                              </Typography>
                              <Typography variant="body1" color="rgba(255,255,255,0.9)" fontWeight={500}>
                                Total Jobs
                              </Typography>
                              <BarChartIcon sx={{ position: 'absolute', bottom: 12, right: 12, fontSize: 40, color: 'rgba(255,255,255,0.2)' }} />
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Card 
                            sx={{ 
                              height: '100%',
                              background: 'linear-gradient(135deg, #66bb6a 0%, #81c784 100%)',
                              border: 'none',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                                <Typography variant="h3" component="div" fontWeight={700} color="white">
                                  {stats.activeJobs}
                                </Typography>
                                <Chip 
                                  icon={<CheckIcon sx={{ fontSize: 16 }} />}
                                  label={`${calculatePercentage(stats.activeJobs, stats.totalJobs)}%`} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.25)',
                                    color: 'white',
                                    fontWeight: 700,
                                    backdropFilter: 'blur(10px)'
                                  }} 
                                />
                              </Stack>
                              <Typography variant="body1" color="rgba(255,255,255,0.9)" fontWeight={500}>
                                Active Jobs
                              </Typography>
                              <PieChartIcon sx={{ position: 'absolute', bottom: 12, right: 12, fontSize: 40, color: 'rgba(255,255,255,0.2)' }} />
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Card 
                            sx={{ 
                              height: '100%',
                              background: 'linear-gradient(135deg, #546e7a 0%, #78909c 100%)',
                              border: 'none',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Typography variant="h3" component="div" fontWeight={700} color="white" sx={{ mb: 0.5 }}>
                                {stats.totalJobs - stats.activeJobs}
                              </Typography>
                              <Typography variant="body1" color="rgba(255,255,255,0.9)" fontWeight={500}>
                                Closed Jobs
                              </Typography>
                              <Typography variant="caption" color="rgba(255,255,255,0.7)" fontWeight={500}>
                                {calculatePercentage(stats.totalJobs - stats.activeJobs, stats.totalJobs)}% of total
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Card 
                            sx={{ 
                              height: '100%',
                              background: 'linear-gradient(135deg, #ffa726 0%, #ffb74d 100%)',
                              border: 'none',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                <Typography variant="h3" component="div" fontWeight={700} color="white">
                                  {stats.pendingApprovalJobs}
                                </Typography>
                                <PendingIcon sx={{ fontSize: 24, color: 'rgba(255,255,255,0.8)' }} />
                              </Stack>
                              <Typography variant="body1" color="rgba(255,255,255,0.9)" fontWeight={500}>
                                Pending Review
                              </Typography>
                              <Typography variant="caption" color="rgba(255,255,255,0.7)" fontWeight={500}>
                                Awaiting approval
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Applications Overview Section */}
                  <Grid item xs={12}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        background: 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)'
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                        <ApplicationIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight={600} color="text.primary">
                          Applications Pipeline
                        </Typography>
                      </Stack>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card 
                            elevation={0}
                            sx={{ 
                              height: '100%',
                              background: '#ffffff',
                              border: '2px solid',
                              borderColor: 'primary.main',
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Typography variant="h3" component="div" fontWeight={700} color="primary.main" sx={{ mb: 0.5 }}>
                                {stats.totalApplications}
                              </Typography>
                              <Typography variant="body1" color="text.primary" fontWeight={600}>
                                Total Applications
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Card 
                            elevation={0}
                            sx={{ 
                              height: '100%',
                              bgcolor: '#fff3e0',
                              border: '2px solid #ffa726',
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Typography variant="h3" component="div" fontWeight={700} color="#f57c00">
                                  {stats.newApplications}
                                </Typography>
                                <Chip 
                                  label="New" 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: '#ffa726',
                                    color: 'white',
                                    fontWeight: 700
                                  }} 
                                />
                              </Stack>
                              <Typography variant="body1" color="text.primary" fontWeight={600} sx={{ mt: 0.5 }}>
                                New Applications
                              </Typography>
                              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                {calculatePercentage(stats.newApplications, stats.totalApplications)}% of total
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Card 
                            elevation={0}
                            sx={{ 
                              height: '100%',
                              bgcolor: '#e3f2fd',
                              border: '2px solid #42a5f5',
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Typography variant="h3" component="div" fontWeight={700} color="#1976d2" sx={{ mb: 0.5 }}>
                                {stats.screeningApplications}
                              </Typography>
                              <Typography variant="body1" color="text.primary" fontWeight={600}>
                                In Screening
                              </Typography>
                              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                {calculatePercentage(stats.screeningApplications, stats.totalApplications)}% of total
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Card 
                            elevation={0}
                            sx={{ 
                              height: '100%',
                              bgcolor: '#f3e5f5',
                              border: '2px solid #ab47bc',
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Typography variant="h3" component="div" fontWeight={700} color="#8e24aa" sx={{ mb: 0.5 }}>
                                {stats.interviewApplications}
                              </Typography>
                              <Typography variant="body1" color="text.primary" fontWeight={600}>
                                Interview Stage
                              </Typography>
                              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                {calculatePercentage(stats.interviewApplications, stats.totalApplications)}% of total
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Key Metrics Section */}
                  <Grid item xs={12}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                        <TrendingUpIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight={600} color="text.primary">
                          Key Performance Metrics
                        </Typography>
                      </Stack>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Card 
                            elevation={0}
                            sx={{ 
                              height: '100%',
                              bgcolor: 'background.paper',
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                Applications per Job
                              </Typography>
                              <Typography variant="h3" color="primary.main" fontWeight={700} sx={{ my: 1 }}>
                                {stats.activeJobs > 0 
                                  ? (stats.totalApplications / stats.activeJobs).toFixed(1)
                                  : '0'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Average applications received per active job posting
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Card 
                            elevation={0}
                            sx={{ 
                              height: '100%',
                              bgcolor: 'background.paper',
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                Interview Conversion
                              </Typography>
                              <Stack direction="row" alignItems="baseline" spacing={1} sx={{ my: 1 }}>
                                <Typography variant="h3" color="success.main" fontWeight={700}>
                                  {calculatePercentage(stats.interviewApplications, stats.totalApplications)}
                                </Typography>
                                <Typography variant="h4" color="success.main" fontWeight={700}>
                                  %
                                </Typography>
                              </Stack>
                              <Typography variant="body2" color="text.secondary">
                                Applications progressing to interview stage
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Card 
                            elevation={0}
                            sx={{ 
                              height: '100%',
                              bgcolor: 'background.paper',
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                Active Pipeline
                              </Typography>
                              <Typography variant="h3" color="info.main" fontWeight={700} sx={{ my: 1 }}>
                                {stats.newApplications + stats.screeningApplications + stats.interviewApplications}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Total applications currently in process
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </TabPanel>

            {/* Department Analytics Tab */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                {departmentAnalytics && (
                  <>
                    <Grid item xs={12} lg={6}>
                      <DepartmentJobsChart data={departmentAnalytics.departments} />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <DepartmentApplicationsChart data={departmentAnalytics.departments} />
                    </Grid>
                    
                    {/* Department Stats Table */}
                    <Grid item xs={12}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                          Department Performance Details
                        </Typography>
                        <Grid container spacing={2}>
                          {departmentAnalytics.departments.map((dept, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Card 
                                elevation={0}
                                sx={{ 
                                  height: '100%',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  '&:hover': {
                                    borderColor: 'primary.main',
                                    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.15)',
                                  }
                                }}
                              >
                                <CardContent>
                                  <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mb: 2 }}>
                                    {dept.department}
                                  </Typography>
                                  <Stack spacing={1}>
                                    <Stack direction="row" justifyContent="space-between">
                                      <Typography variant="body2" color="text.secondary">Total Jobs:</Typography>
                                      <Typography variant="body2" fontWeight={600}>{dept.jobCount}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                      <Typography variant="body2" color="text.secondary">Active Jobs:</Typography>
                                      <Chip 
                                        label={dept.activeJobs} 
                                        size="small" 
                                        color="success"
                                        sx={{ height: 20, fontSize: '0.75rem' }}
                                      />
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                      <Typography variant="body2" color="text.secondary">Applications:</Typography>
                                      <Typography variant="body2" fontWeight={600}>{dept.applicationCount}</Typography>
                                    </Stack>
                                    <Divider sx={{ my: 1 }} />
                                    <Stack direction="row" justifyContent="space-between">
                                      <Typography variant="body2" color="text.secondary">Avg per Job:</Typography>
                                      <Typography variant="body2" fontWeight={700} color="primary.main">
                                        {dept.averageApplicationsPerJob.toFixed(1)}
                                      </Typography>
                                    </Stack>
                                  </Stack>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
                    </Grid>
                  </>
                )}
              </Grid>
            </TabPanel>

            {/* Distributions Tab */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                {statusDistribution && (
                  <Grid item xs={12} md={6}>
                    <ApplicationStatusChart data={statusDistribution} />
                  </Grid>
                )}
                {employmentTypeStats.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <EmploymentTypeChart data={employmentTypeStats} />
                  </Grid>
                )}
                {experienceLevelStats.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <ExperienceLevelChart data={experienceLevelStats} />
                  </Grid>
                )}
              </Grid>
            </TabPanel>
          </Paper>

          {/* Export Info Box */}
          {stats && (
            <Box 
              sx={{ 
                p: 2.5, 
                bgcolor: '#e8f5e9', 
                borderRadius: 2,
                border: '1px solid #c8e6c9'
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <DownloadIcon sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
                    Need detailed application data?
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Click the <strong>Export to Excel</strong> button above to download a comprehensive report 
                    with all application details, candidate information, and status tracking.
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </Container>
      </Layout>
    </ProtectedRoute>
  );
};

export default ReportsPage;