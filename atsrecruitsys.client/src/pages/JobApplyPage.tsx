import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  FormHelperText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Description as DescriptionIcon,
  Upload as UploadIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Layout from '../components/Layout';
import { JobService, ApplicationService } from '../services';
import { Job } from '../types';

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9+\-\s()]+$/, 'Enter a valid phone number')
    .required('Phone number is required'),
  race: yup.string(),
  gender: yup.string(),
  noticePeriod: yup.string(),
  message: yup.string(),
  resumeFile: yup
    .mixed()
    .required('CV/Resume is required')
    .test('fileSize', 'File size is too large. Maximum size is 5MB.', (value: any) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test('fileType', 'Only PDF, DOC, and DOCX files are allowed', (value: any) => {
      if (!value) return true;
      return [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ].includes(value.type);
    }),
});

const JobApplyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id || '0');
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countryCode, setCountryCode] = useState('+27'); // Default to South Africa

  useEffect(() => {
    const fetchJob = async () => {
      if (jobId <= 0) {
        setError('Invalid job ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const jobData = await JobService.getPublicJob(jobId);
        setJob(jobData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching job:', err);
        setError(err.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      race: '',
      gender: '',
      noticePeriod: '',
      message: '',
      resumeFile: null as File | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!job || !values.resumeFile) return;

      try {
        setSubmitting(true);
        setError(null);

        const fullPhoneNumber = `${countryCode}${values.phoneNumber}`;

        // Build EE information string only if values are provided
        let eeInfo = '';
        const eeFields = [];
        
        if (values.race) eeFields.push(`Race: ${values.race}`);
        if (values.gender) eeFields.push(`Gender: ${values.gender}`);
        if (values.noticePeriod) eeFields.push(`Notice Period: ${values.noticePeriod}`);
        
        if (eeFields.length > 0) {
          eeInfo = `\n\n--- Employment Equity Information ---\n${eeFields.join('\n')}`;
        }

        const fullMessage = (values.message || '').trim() + eeInfo;

        const result = await ApplicationService.submitSimpleApplication(
          {
            jobId: job.id,
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim().toLowerCase(),
            phoneNumber: fullPhoneNumber,
            message: fullMessage,
          },
          values.resumeFile
        );

        if (result.success) {
          setSuccess(true);
          // Optionally redirect after a delay
          setTimeout(() => {
            navigate('/jobs', { state: { message: 'Application submitted successfully!' } });
          }, 3000);
        }
      } catch (err: any) {
        console.error('Error submitting application:', err);
        setError(err.message || 'Failed to submit application. Please try again.');
        setSubmitting(false);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      formik.setFieldValue('resumeFile', event.target.files[0]);
    }
  };

  const isJobClosed = () => {
    if (!job) return true;
    return new Date(job.closingDate) < new Date();
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2);
  };

  if (loading) {
    return (
      <Layout title="Apply for Job">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error && !job) {
    return (
      <Layout title="Apply for Job">
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Job not found'}
        </Alert>
        <Button component={Link} to="/jobs" variant="contained">
          Back to Jobs
        </Button>
      </Layout>
    );
  }

  if (isJobClosed()) {
    return (
      <Layout title="Apply for Job">
        <Alert severity="warning" sx={{ mb: 4 }}>
          This job posting has expired and is no longer accepting applications.
        </Alert>
        <Button component={Link} to="/jobs" variant="contained">
          Browse Other Jobs
        </Button>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout title="Application Submitted">
        <Box textAlign="center" py={8}>
          <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 3 }} />
          <Typography variant="h4" gutterBottom>
            Application Submitted Successfully!
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Thank you for your interest in {job?.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We have received your application and will review it carefully. 
            If you do not hear from us within one month of the closing date, 
            you may consider your application unsuccessful for this position.
          </Typography>
          <Box mt={4}>
            <Button component={Link} to="/jobs" variant="contained" size="large">
              Browse More Jobs
            </Button>
          </Box>
        </Box>
      </Layout>
    );
  }

  if (!job) return null;

  return (
    <Layout title={`Apply for ${job.title}`}>
      <Box mb={4}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/">
            Home
          </MuiLink>
          <MuiLink component={Link} to="/jobs">
            Jobs
          </MuiLink>
          <MuiLink component={Link} to={`/jobs/${jobId}`}>
            {job.title}
          </MuiLink>
          <Typography color="text.primary">Apply</Typography>
        </Breadcrumbs>
      </Box>

      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#ff9800', fontWeight: 'bold' }}>
          Send us your CV
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Apply for {job.title} - {job.displayDepartment}
        </Typography>
      </Box>

      {/* Job summary card */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          Position Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Department:</strong> {job.displayDepartment}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Location:</strong> {job.displayLocation}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Employment Type:</strong> {job.employmentType}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Experience Level:</strong> {job.experienceLevel}
            </Typography>
          </Grid>
          {job.salaryRangeMin && job.salaryRangeMax && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                <strong>Salary Range:</strong> {job.currency || 'ZAR'} {job.salaryRangeMin.toLocaleString()} -{' '}
                {job.salaryRangeMax.toLocaleString()}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Application form */}
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#fff' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#333' }}>
          Application Form
        </Typography>
        
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First name"
                required
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Last name"
                required
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                type="email"
                label="Email"
                required
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={3} sm={2}>
                  <FormControl fullWidth>
                    <Select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <MenuItem value="+27">+27</MenuItem>
                      <MenuItem value="+1">+1</MenuItem>
                      <MenuItem value="+44">+44</MenuItem>
                      <MenuItem value="+91">+91</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={9} sm={10}>
                  <TextField
                    fullWidth
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone"
                    required
                    placeholder="123456789"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Employment Equity Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: '#333' }}>
                Employment Equity Information (Optional)
              </Typography>
              <Typography variant="caption" color="text.secondary" paragraph>
                This information helps us with Employment Equity reporting in accordance with South African legislation.
              </Typography>
            </Grid>

            {/* Race */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Race (Optional)</InputLabel>
                <Select
                  id="race"
                  name="race"
                  value={formik.values.race}
                  onChange={formik.handleChange}
                  label="Race (Optional)"
                >
                  <MenuItem value="">Prefer not to say</MenuItem>
                  <MenuItem value="White">White</MenuItem>
                  <MenuItem value="Black">Black</MenuItem>
                  <MenuItem value="Coloured">Coloured</MenuItem>
                  <MenuItem value="Indian">Indian</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Gender (Optional)</InputLabel>
                <Select
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  label="Gender (Optional)"
                >
                  <MenuItem value="">Prefer not to say</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Notice Period */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Notice Period (Optional)</InputLabel>
                <Select
                  id="noticePeriod"
                  name="noticePeriod"
                  value={formik.values.noticePeriod}
                  onChange={formik.handleChange}
                  label="Notice Period (Optional)"
                >
                  <MenuItem value="">Not specified</MenuItem>
                  <MenuItem value="Immediately">Immediately Available</MenuItem>
                  <MenuItem value="1 Week">1 Week</MenuItem>
                  <MenuItem value="2 Weeks">2 Weeks</MenuItem>
                  <MenuItem value="1 Month">1 Month</MenuItem>
                  <MenuItem value="2 Months">2 Months</MenuItem>
                  <MenuItem value="3 Months">3 Months</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Message */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="message"
                name="message"
                label="Write a message"
                multiline
                rows={6}
                value={formik.values.message}
                onChange={formik.handleChange}
                error={formik.touched.message && Boolean(formik.errors.message)}
                helperText={formik.touched.message && formik.errors.message}
                placeholder="Tell us why you're interested in this position and what makes you a good fit..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <MessageIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* CV Upload */}
            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                  <AttachFileIcon color="primary" />
                  Upload CV *
                </Typography>
              </Box>
              
              <input
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="resume-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="resume-file">
                <Button 
                  variant="outlined" 
                  component="span" 
                  startIcon={<UploadIcon />}
                  sx={{ mr: 2 }}
                >
                  Upload File
                </Button>
                {formik.values.resumeFile ? (
                  <Chip
                    icon={<DescriptionIcon />}
                    label={`${formik.values.resumeFile.name} (${formatFileSize(formik.values.resumeFile.size)} MB)`}
                    onDelete={() => formik.setFieldValue('resumeFile', null)}
                    color="primary"
                  />
                ) : (
                  <Typography variant="body2" component="span" color="text.secondary">
                    No file selected
                  </Typography>
                )}
              </label>
              {formik.touched.resumeFile && formik.errors.resumeFile && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {formik.errors.resumeFile as string}
                </FormHelperText>
              )}
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                Accepted formats: PDF, DOC, DOCX. Maximum size: 5MB
              </Typography>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" mt={4}>
                <Button 
                  component={Link} 
                  to={`/jobs/${jobId}`} 
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : <AttachFileIcon />}
                  sx={{
                    backgroundColor: '#ff9800',
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#f57c00',
                    },
                  }}
                >
                  {submitting ? 'Submitting...' : 'Send Application'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Layout>
  );
};

export default JobApplyPage;
