import React from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays } from 'date-fns';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Job, CreateJobRequest, UpdateJobRequest } from '../types';
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
} from '../types/job';
import { LocationSelect, DepartmentSelect } from './LocationDepartmentSelect';

interface JobFormProps {
  job?: Job;
  onSubmit: (data: CreateJobRequest | UpdateJobRequest) => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
}

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Job title is required')
    .max(200, 'Title must be 200 characters or less'),
  description: yup
    .string()
    .required('Job description is required')
    .min(50, 'Description must be at least 50 characters'),
  location: yup.string().required('Location is required'),
  department: yup.string().required('Department is required'),
  closingDate: yup
    .date()
    .min(new Date(), 'Closing date must be in the future')
    .required('Closing date is required'),
  employmentType: yup.string().required('Employment type is required'),
  experienceLevel: yup.string().required('Experience level is required'),
  salaryRangeMin: yup.number().positive('Minimum salary must be positive').nullable(),
  salaryRangeMax: yup
    .number()
    .positive('Maximum salary must be positive')
    .min(yup.ref('salaryRangeMin'), 'Maximum salary must be greater than minimum salary')
    .nullable(),
  isEmploymentEquityPosition: yup.boolean(),
  employmentEquityNotes: yup.string().max(500, 'Notes must be 500 characters or less').nullable(),
});

const JobForm: React.FC<JobFormProps> = ({ job, onSubmit, onCancel, loading = false }) => {
  const formik = useFormik({
    initialValues: {
      title: job?.title || '',
      description: job?.description || '',
      location: job?.location || '',
      department: job?.department || '',
      closingDate: job ? new Date(job.closingDate) : addDays(new Date(), 30),
      isPublished: job?.isPublished || false,
      employmentType: job?.employmentType || '',
      experienceLevel: job?.experienceLevel || '',
      salaryRangeMin: job?.salaryRangeMin || null,
      salaryRangeMax: job?.salaryRangeMax || null,
      currency: job?.currency || 'ZAR',
      isEmploymentEquityPosition: job?.isEmploymentEquityPosition || false,
      employmentEquityNotes: job?.employmentEquityNotes || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const baseData = {
        title: values.title,
        description: values.description,
        location: values.location,
        department: values.department,
        closingDate: values.closingDate.toISOString(),
        employmentType: values.employmentType,
        experienceLevel: values.experienceLevel,
        salaryRangeMin: values.salaryRangeMin || undefined,
        salaryRangeMax: values.salaryRangeMax || undefined,
        currency: values.currency,
        isEmploymentEquityPosition: values.isEmploymentEquityPosition,
        employmentEquityNotes: values.employmentEquityNotes || undefined,
      };

      const jobData: CreateJobRequest | UpdateJobRequest = job
        ? { ...baseData, id: job.id, isPublished: values.isPublished }
        : baseData;

      await onSubmit(jobData);
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {job ? 'Edit Job' : 'Create New Job'}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Job Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                placeholder="e.g., Senior Software Engineer, HR Manager"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={10}
                id="description"
                name="description"
                label="Job Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                placeholder="Provide a detailed job description including responsibilities, requirements, and benefits..."
              />
            </Grid>

            {/* Location and Department */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Location & Department
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocationSelect
                value={formik.values.location}
                onChange={(value) => formik.setFieldValue('location', value)}
                required
                error={formik.touched.location && Boolean(formik.errors.location)}
                errorMessage={formik.touched.location && formik.errors.location ? String(formik.errors.location) : undefined}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DepartmentSelect
                value={formik.values.department}
                onChange={(value) => formik.setFieldValue('department', value)}
                required
                error={formik.touched.department && Boolean(formik.errors.department)}
                errorMessage={formik.touched.department && formik.errors.department ? String(formik.errors.department) : undefined}
              />
            </Grid>

            {/* Employment Details */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Employment Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  name="employmentType"
                  value={formik.values.employmentType}
                  onChange={formik.handleChange}
                  label="Employment Type"
                  error={formik.touched.employmentType && Boolean(formik.errors.employmentType)}
                >
                  {EMPLOYMENT_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  name="experienceLevel"
                  value={formik.values.experienceLevel}
                  onChange={formik.handleChange}
                  label="Experience Level"
                  error={formik.touched.experienceLevel && Boolean(formik.errors.experienceLevel)}
                >
                  {EXPERIENCE_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <DatePicker
                label="Closing Date"
                value={formik.values.closingDate}
                onChange={(newValue) => {
                  formik.setFieldValue('closingDate', newValue);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.closingDate && Boolean(formik.errors.closingDate),
                    helperText: formik.touched.closingDate && (formik.errors.closingDate as string),
                  },
                }}
              />
            </Grid>

            {/* Salary Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Compensation (Optional)
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                id="salaryRangeMin"
                name="salaryRangeMin"
                label="Minimum Salary (R)"
                value={formik.values.salaryRangeMin || ''}
                onChange={formik.handleChange}
                error={formik.touched.salaryRangeMin && Boolean(formik.errors.salaryRangeMin)}
                helperText={formik.touched.salaryRangeMin && formik.errors.salaryRangeMin}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                id="salaryRangeMax"
                name="salaryRangeMax"
                label="Maximum Salary (R)"
                value={formik.values.salaryRangeMax || ''}
                onChange={formik.handleChange}
                error={formik.touched.salaryRangeMax && Boolean(formik.errors.salaryRangeMax)}
                helperText={formik.touched.salaryRangeMax && formik.errors.salaryRangeMax}
              />
            </Grid>

            {job && (
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.isPublished}
                      onChange={(e) => formik.setFieldValue('isPublished', e.target.checked)}
                      name="isPublished"
                    />
                  }
                  label="Published"
                />
              </Grid>
            )}

            {/* Employment Equity Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Employment Equity (Optional)
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Designate this position as an Employment Equity position in accordance with South African Employment Equity legislation.
                </Typography>
              </Alert>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.isEmploymentEquityPosition}
                    onChange={(e) => formik.setFieldValue('isEmploymentEquityPosition', e.target.checked)}
                    name="isEmploymentEquityPosition"
                  />
                }
                label="This is an Employment Equity Position"
              />
            </Grid>

            {formik.values.isEmploymentEquityPosition && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  id="employmentEquityNotes"
                  name="employmentEquityNotes"
                  label="Employment Equity Notes (Optional)"
                  value={formik.values.employmentEquityNotes}
                  onChange={formik.handleChange}
                  error={formik.touched.employmentEquityNotes && Boolean(formik.errors.employmentEquityNotes)}
                  helperText={
                    formik.touched.employmentEquityNotes && formik.errors.employmentEquityNotes
                      ? formik.errors.employmentEquityNotes
                      : 'Provide additional details about the Employment Equity designation for this position'
                  }
                  placeholder="e.g., Preference will be given to candidates from designated groups as per our Employment Equity plan"
                />
              </Grid>
            )}

            {/* Form Actions */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};

export default JobForm;
