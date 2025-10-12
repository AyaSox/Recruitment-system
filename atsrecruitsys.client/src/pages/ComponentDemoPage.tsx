import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import Layout from '../components/Layout';
import { LocationSelect, DepartmentSelect } from '../components/LocationDepartmentSelect';
import SearchableSelect from '../components/SearchableSelect';

const ComponentDemoPage: React.FC = () => {
  const [singleLocation, setSingleLocation] = useState('');
  const [multipleLocations, setMultipleLocations] = useState<string[]>([]);
  const [singleDepartment, setSingleDepartment] = useState('');
  const [multipleDepartments, setMultipleDepartments] = useState<string[]>([]);

  const handleReset = () => {
    setSingleLocation('');
    setMultipleLocations([]);
    setSingleDepartment('');
    setMultipleDepartments([]);
  };

  return (
    <Layout title="Enhanced Dropdowns Demo">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ?? Enhanced Searchable Dropdowns
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            <strong>New Feature:</strong> Enhanced location and department selection with South African context
          </Typography>
          <Typography variant="body2">
            Features searchable options, categorized listings, "Other" option with custom input, 
            and support for both single and multiple selections.
          </Typography>
        </Alert>

        {/* Location Selectors */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom color="primary">
            ?? Location Selectors
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Featuring South Africa's 4 biggest cities plus other major locations
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <LocationSelect
                value={singleLocation}
                onChange={setSingleLocation}
                label="Single Location Selection"
              />
              {singleLocation && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Selected: <strong>{singleLocation}</strong>
                </Alert>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <LocationSelect
                value={multipleLocations}
                onChange={setMultipleLocations}
                label="Multiple Location Selection"
                multiple
              />
              {multipleLocations.length > 0 && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Selected {multipleLocations.length} location(s): <br />
                  <strong>{multipleLocations.join(', ')}</strong>
                </Alert>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Department Selectors */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom color="primary">
            ?? Department Selectors
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Comprehensive list of common South African business departments and industries
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DepartmentSelect
                value={singleDepartment}
                onChange={setSingleDepartment}
                label="Single Department Selection"
              />
              {singleDepartment && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Selected: <strong>{singleDepartment}</strong>
                </Alert>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <DepartmentSelect
                value={multipleDepartments}
                onChange={setMultipleDepartments}
                label="Multiple Department Selection"
                multiple
              />
              {multipleDepartments.length > 0 && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Selected {multipleDepartments.length} department(s): <br />
                  <strong>{multipleDepartments.join(', ')}</strong>
                </Alert>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Features List */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom color="primary">
            ? Key Features
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                ?? Search & Filter
              </Typography>
              <ul>
                <li>Type to search locations/departments</li>
                <li>Categorized options (Major Cities, Other Cities, etc.)</li>
                <li>Auto-complete functionality</li>
              </ul>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                ???? South African Context
              </Typography>
              <ul>
                <li>Johannesburg, Cape Town, Durban, Pretoria (Big 4)</li>
                <li>Other major SA cities and provinces</li>
                <li>Local industry-specific departments</li>
              </ul>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                ?? Flexible Options
              </Typography>
              <ul>
                <li>Single or multiple selection</li>
                <li>"Other" option with custom text input</li>
                <li>Remote work and hybrid options</li>
              </ul>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom">
                ?? Business-Ready
              </Typography>
              <ul>
                <li>Form validation support</li>
                <li>Error handling and display</li>
                <li>Consistent with Material-UI design</li>
              </ul>
            </Grid>
          </Grid>
        </Paper>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" onClick={handleReset} size="large">
            Reset All Selections
          </Button>
          <Button 
            variant="contained" 
            onClick={() => window.alert('Selections would be saved in a real form!')}
            size="large"
          >
            Save Selections
          </Button>
        </Box>

        {/* Implementation Info */}
        <Paper elevation={1} sx={{ p: 3, mt: 3, backgroundColor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            ??? Implementation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            These components are now available in:
          </Typography>
          <ul>
            <li><strong>Job Creation Form</strong> - Enhanced location and department selection</li>
            <li><strong>Job Search Filters</strong> - Better filtering experience</li>
            <li><strong>User Profile Forms</strong> - Location preferences</li>
            <li><strong>Reports & Analytics</strong> - Department-specific filtering</li>
          </ul>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ComponentDemoPage;