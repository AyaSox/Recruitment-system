import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isRecruiter, isApplicant } = useAuth();

  const getRedirectPath = () => {
    if (isAdmin() || isRecruiter()) {
      return '/dashboard';
    } else if (isApplicant()) {
      return '/jobs';
    }
    return '/';
  };

  return (
    <Layout title="Unauthorized Access">
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 6,
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />

          <Typography variant="h4" component="h1" gutterBottom>
            Unauthorized Access
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            You do not have permission to access this page. This might be because:
          </Typography>

          <Box component="ul" sx={{ textAlign: 'left', mb: 4 }}>
            <Typography component="li">
              You&apos;re trying to access a recruiter feature as an applicant
            </Typography>
            <Typography component="li">
              You&apos;re trying to access an admin feature as a recruiter
            </Typography>
            <Typography component="li">
              You need additional permissions to view this content
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate(getRedirectPath())}
            sx={{ mt: 2 }}
          >
            Go to Home Page
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
};

export default UnauthorizedPage;
