import React from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage: React.FC = () => {
  const { login, authState } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        await login(values);
        navigate('/');
      } catch (error) {
        console.error('Login failed:', error);
        // Error is handled in auth context
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Additional form submit handler to ensure proper behavior
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Explicitly prevent default form submission
    formik.handleSubmit(event);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          ATS Recruitment System
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h2" variant="h5">
            Log in
          </Typography>

          {authState.error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {authState.error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleFormSubmit}
            sx={{ mt: 1, width: '100%' }}
            noValidate
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={authState.loading || formik.isSubmitting}
            >
              {authState.loading || formik.isSubmitting ? 'Logging in...' : 'Log In'}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          Test Accounts:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Admin: admin@atsrecruitsys.com / Admin123!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Recruiter: recruiter@test.com / Test123!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Hiring Manager: hiringmanager@test.com / Test123!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Applicant: applicant@test.com / Test123!
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
