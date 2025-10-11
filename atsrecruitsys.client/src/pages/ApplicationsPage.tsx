import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Pagination,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ApplicationCard from '../components/ApplicationCard';
import { ApplicationService, JobService } from '../services';
import { Application, ApplicationFilters, JobSummary } from '../types';
import { usePagination } from '../hooks/useCustomHooks';

// Interface to represent the application status counts
interface StatusCount {
  [key: string]: number;
}

// Application statuses
const APPLICATION_STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId')
    ? parseInt(searchParams.get('jobId') || '0', 10)
    : undefined;

  // Pagination
  const { page, pageSize, totalItems, setTotalItems, handleChangePage } = usePagination(0, 10);

  // State
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<ApplicationFilters>({
    jobId: initialJobId,
    status: '',
    searchTerm: '',
  });

  // Status tab
  const [currentStatus, setCurrentStatus] = useState('');

  // Status counts
  const [statusCounts, setStatusCounts] = useState<StatusCount>({});

  // Effect to fetch applications
  useEffect(() => {
    fetchApplications();
  }, [page, pageSize, filters, currentStatus]);

  // Effect to fetch jobs for the filter dropdown
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await JobService.getJobs(0, 100);
        setJobs(response.items);
      } catch (err: any) {
        console.error('Failed to load jobs for filter:', err);
      }
    };

    fetchJobs();
  }, []);

  // Effect to fetch status counts
  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const stats = await ApplicationService.getOverallApplicationStats();
        const counts: StatusCount = {};

        stats.forEach((stat) => {
          counts[stat.status] = stat.count;
        });

        setStatusCounts(counts);
      } catch (err: any) {
        console.error('Failed to load status counts:', err);
      }
    };

    fetchStatusCounts();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const updatedFilters: ApplicationFilters = {
        ...filters,
        status: currentStatus || undefined, // Use the tab value as the status filter
      };

      const response = await ApplicationService.getApplications(updatedFilters, page, pageSize);
      setApplications(response.items);
      setTotalItems(response.totalCount);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name) {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectFilterChange = (event: SelectChangeEvent<number | string>) => {
    const { name, value } = event.target;
    if (name) {
      // Handle jobId as number
      const filterValue =
        name === 'jobId' && value !== ''
          ? typeof value === 'string'
            ? parseInt(value, 10)
            : value
          : value;

      setFilters((prev) => ({
        ...prev,
        [name]: filterValue,
      }));
    }
  };

  const handleClearFilters = () => {
    setFilters({
      jobId: undefined,
      status: '',
      searchTerm: '',
    });
    setCurrentStatus('');
  };

  const handleStatusTabChange = (_event: React.SyntheticEvent, newStatus: string) => {
    setCurrentStatus(newStatus);
  };

  const handleViewResume = (id: number) => {
    // Create a function to open the resume in a new tab or download it
    ApplicationService.getResumeFile(id)
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      })
      .catch((err) => {
        console.error('Failed to get resume:', err);
        setError('Failed to load resume file');
      });
  };

  const handleScheduleInterview = (id: number) => {
    navigate(`/applications/${id}/schedule-interview`);
  };

  const getStatusChip = (status: string, count: number) => {
    return (
      <Chip
        label={`${status} (${count})`}
        color={status === currentStatus ? 'primary' : 'default'}
        onClick={() => setCurrentStatus(status === currentStatus ? '' : status)}
        sx={{ m: 0.5 }}
      />
    );
  };

  return (
    <Layout title="ATS Recruitment System - Applications">
      <Box mb={4}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/">
            Home
          </MuiLink>
          <Typography color="text.primary">Applications</Typography>
        </Breadcrumbs>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        Applications
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage and track job applications
      </Typography>

      {/* Status counts chips */}
      <Paper sx={{ p: 2, mb: 4, display: 'flex', flexWrap: 'wrap' }}>
        <Box width="100%" mb={1}>
          <Typography variant="subtitle2">Filter by Status:</Typography>
        </Box>
        {currentStatus && (
          <Chip
            label="All"
            color="primary"
            onClick={() => setCurrentStatus('')}
            sx={{ m: 0.5 }}
          />
        )}
        {APPLICATION_STATUSES.map((status) => getStatusChip(status, statusCounts[status] || 0))}
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              name="searchTerm"
              label="Search Applications"
              fullWidth
              variant="outlined"
              value={filters.searchTerm}
              onChange={handleTextFilterChange}
              placeholder="Search by applicant name or email"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filter by Job</InputLabel>
              <Select
                name="jobId"
                value={filters.jobId || ''}
                onChange={handleSelectFilterChange}
                label="Filter by Job"
              >
                <MenuItem value="">All Jobs</MenuItem>
                {jobs.map((job) => (
                  <MenuItem key={job.id} value={job.id}>
                    {job.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button variant="outlined" onClick={handleClearFilters} fullWidth>
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Applications list */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : applications.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          No applications found matching your criteria.
        </Alert>
      ) : (
        <Box mb={4}>
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewResume={handleViewResume}
              onScheduleInterview={handleScheduleInterview}
              // REMOVED: onChangeStatus - use Application Funnel for status changes
            />
          ))}
        </Box>
      )}

      {/* Pagination */}
      {!loading && applications.length > 0 && (
        <Box display="flex" justifyContent="center" mb={4}>
          <Pagination
            count={Math.ceil(totalItems / pageSize)}
            page={page + 1}
            onChange={(e, p) => handleChangePage(null, p - 1)}
            color="primary"
          />
        </Box>
      )}
    </Layout>
  );
};

export default ApplicationsPage;
