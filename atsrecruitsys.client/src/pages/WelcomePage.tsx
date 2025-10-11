import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Stack,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const HeroBanner = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(10, 0),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(6),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const QuickActionCard = styled(Card)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '2px solid transparent',
  '&:hover': {
    transform: 'translateY(-8px)',
    borderColor: theme.palette.primary.main,
    boxShadow: '0 12px 24px rgba(46, 125, 50, 0.2)',
    '& .action-icon': {
      transform: 'scale(1.1)',
      color: theme.palette.primary.main,
    },
    '& .action-arrow': {
      transform: 'translateX(5px)',
    }
  },
}));

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { authState, isApplicant, isRecruiter, isAdmin } = useAuth();

  const handleNavigate = () => {
    if (!authState.isAuthenticated) {
      navigate('/login');
    } else if (isApplicant()) {
      navigate('/jobs');
    } else if (isRecruiter() || isAdmin()) {
      navigate('/dashboard');
    }
  };

  const features = [
    {
      icon: <SearchIcon fontSize="large" color="primary" />,
      title: 'Browse Jobs',
      description: 'Explore job opportunities without registration. View all published positions instantly.',
    },
    {
      icon: <AssignmentIcon fontSize="large" color="primary" />,
      title: 'Quick Apply',
      description: 'Apply in minutes! Just upload your CV and submit - no account needed.',
    },
    {
      icon: <PeopleIcon fontSize="large" color="primary" />,
      title: 'Email Updates',
      description: 'Receive status updates directly to your inbox. Stay informed throughout the process.',
    },
  ];

  // Quick Actions for authenticated users
  const getQuickActions = () => {
    if (!authState.isAuthenticated) {
      return [
        {
          icon: <WorkIcon fontSize="large" />,
          title: 'Browse Jobs',
          description: 'View all available positions',
          path: '/jobs',
          color: '#2e7d32',
        },
        {
          icon: <AssignmentIcon fontSize="large" />,
          title: 'Apply Now',
          description: 'Start your application',
          path: '/jobs',
          color: '#00897b',
        },
      ];
    }

    if (isAdmin() || isRecruiter()) {
      return [
        {
          icon: <DashboardIcon fontSize="large" />,
          title: 'Dashboard',
          description: 'View recruitment overview',
          path: '/dashboard',
          color: '#2e7d32',
        },
        {
          icon: <AddCircleOutlineIcon fontSize="large" />,
          title: 'Post New Job',
          description: 'Create job posting',
          path: '/jobs/create',
          color: '#00897b',
        },
        {
          icon: <AssignmentIcon fontSize="large" />,
          title: 'Applications',
          description: 'Review applications',
          path: '/applications',
          color: '#66bb6a',
        },
        {
          icon: <ViewKanbanIcon fontSize="large" />,
          title: 'Funnel View',
          description: 'Track candidates',
          path: '/applications/funnel',
          color: '#4caf50',
        },
        {
          icon: <AssessmentIcon fontSize="large" />,
          title: 'Reports',
          description: 'View analytics',
          path: '/reports',
          color: '#388e3c',
        },
        {
          icon: <PeopleIcon fontSize="large" />,
          title: isAdmin() ? 'User Management' : 'Team',
          description: isAdmin() ? 'Manage users' : 'View team',
          path: isAdmin() ? '/users' : '/dashboard',
          color: '#1b5e20',
        },
      ];
    }

    return [
      {
        icon: <WorkIcon fontSize="large" />,
        title: 'Browse Jobs',
        description: 'Find opportunities',
        path: '/jobs',
        color: '#2e7d32',
      },
    ];
  };

  const quickActions = getQuickActions();

  return (
    <Layout title="ATS Recruitment System" maxWidth={false}>
      <HeroBanner>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                Find Your Dream Job
              </Typography>
              <Typography variant="h6" paragraph>
                Browse jobs and apply instantly - no registration required! 
                Upload your CV, fill a simple form, and get email updates on your application status.
              </Typography>
              <Box mt={4} display="flex" gap={2} flexWrap="wrap">
                {!authState.isAuthenticated ? (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ 
                        px: 4, 
                        py: 1.5, 
                        fontWeight: 'bold',
                        bgcolor: 'white',
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.9)',
                        }
                      }}
                      onClick={() => navigate('/jobs')}
                    >
                      Browse Jobs Now
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ 
                        px: 4, 
                        py: 1.5, 
                        fontWeight: 'bold',
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                      onClick={handleNavigate}
                    >
                      Staff Login
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ 
                      px: 4, 
                      py: 1.5, 
                      fontWeight: 'bold',
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                      }
                    }}
                    onClick={handleNavigate}
                  >
                    {isApplicant() ? 'Browse Jobs' : 'Dashboard'}
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={6}
                sx={{
                  height: 350,
                  borderRadius: 4,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                  image="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop"
                  alt="Recruitment hero image"
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </HeroBanner>

      <Container maxWidth="lg">
        {/* Quick Actions Section */}
        {authState.isAuthenticated && (
          <Box mb={8}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
              <Box>
                <Typography variant="h4" component="h2" gutterBottom fontWeight={700}>
                  Quick Actions
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Fast access to common tasks
                </Typography>
              </Box>
            </Stack>
            
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <QuickActionCard 
                    elevation={2}
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={2}>
                        <Box
                          className="action-icon"
                          sx={{
                            bgcolor: `${action.color}15`,
                            borderRadius: 2,
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: action.color,
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {action.icon}
                        </Box>
                        <IconButton 
                          size="small" 
                          className="action-arrow"
                          sx={{ 
                            color: 'text.secondary',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                      </Stack>
                      
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </CardContent>
                  </QuickActionCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Features Section */}
        <Box mb={8}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 700 }}>
            {authState.isAuthenticated ? 'System Features' : 'Key Features'}
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard elevation={3}>
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Box display="flex" justifyContent="center" mb={2}>
                      {feature.icon}
                    </Box>
                    <Typography gutterBottom variant="h5" component="h3" align="center" fontWeight={600}>
                      {feature.title}
                    </Typography>
                    <Typography align="center" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Why Choose Us Section */}
        <Box mb={8}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom fontWeight={700}>
                Why Choose Our ATS
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                Our simplified recruitment system makes applying for jobs fast and easy:
              </Typography>
              <List>
                {[
                  'No registration required - apply immediately',
                  'Simple 6-field application form',
                  'Email notifications for status updates',
                  'Professional CV upload (PDF, DOC, DOCX)',
                  'Fast application process - under 2 minutes',
                ].map((item, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
              <Box mt={2}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  onClick={() => navigate('/jobs')}
                  startIcon={<WorkIcon />}
                >
                  Browse Jobs Now
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={5} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  sx={{
                    height: 400,
                    backgroundColor: 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    objectFit: 'cover',
                  }}
                  image="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop"
                  alt="Feature image"
                />
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box 
          mb={8} 
          p={6} 
          textAlign="center" 
          sx={{
            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
            borderRadius: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={700}>
            Ready to Take the Next Step in Your Career?
          </Typography>
          <Typography variant="subtitle1" paragraph sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
            Start browsing jobs now - no account needed! Simply find a position you like, 
            upload your CV, and submit your application. We'll keep you updated via email.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            {!authState.isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/jobs')}
                  sx={{ px: 4 }}
                  startIcon={<WorkIcon />}
                >
                  Browse Jobs Now
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ px: 4 }}
                >
                  Staff Login
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleNavigate}
                sx={{ px: 4 }}
              >
                {isApplicant() ? 'Browse Jobs' : 'Go to Dashboard'}
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default WelcomePage;
