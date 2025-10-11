import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './hooks/useProtectedRoute';

// Loading Component
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress size={60} />
  </Box>
);

// Lazy load all pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const JobsPage = lazy(() => import('./pages/JobsPage'));
const JobDetailsPage = lazy(() => import('./pages/JobDetailsPage'));
const CreateJobPage = lazy(() => import('./pages/CreateJobPage'));
const EditJobPage = lazy(() => import('./pages/EditJobPage'));
const JobApplyPage = lazy(() => import('./pages/JobApplyPage'));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage'));
const ApplicationDetailsPage = lazy(() => import('./pages/ApplicationDetailsPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));

// Application Funnel Page
const ApplicationFunnelPage = lazy(() => import('./pages/ApplicationFunnelPage'));

// New Feature Pages
const AuditLogPage = lazy(() => import('./pages/AuditLogPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const UserManagementPage = lazy(() => import('./pages/UserManagementPage'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <LoadingProvider>
            <AuthProvider>
              <Router>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* Home Page */}
                    <Route path="/" element={<WelcomePage />} />

                    {/* Job Routes - Public access for external candidates */}
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/jobs/:id" element={<JobDetailsPage />} />
                    <Route path="/jobs/:id/edit" element={<EditJobPage />} />
                    <Route path="/jobs/create" element={<CreateJobPage />} />
                    <Route path="/jobs/apply/:id" element={<JobApplyPage />} />

                    {/* Protected Routes - Recruiter & Admin */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute roles={['Admin', 'Recruiter']}>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/applications"
                      element={
                        <ProtectedRoute roles={['Admin', 'Recruiter']}>
                          <ApplicationsPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/applications/funnel"
                      element={
                        <ProtectedRoute roles={['Admin', 'Recruiter']}>
                          <ApplicationFunnelPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/applications/:id"
                      element={
                        <ProtectedRoute roles={['Admin', 'Recruiter']}>
                          <ApplicationDetailsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Reports & Analytics */}
                    <Route
                      path="/reports"
                      element={
                        <ProtectedRoute roles={['Admin', 'Recruiter']}>
                          <ReportsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Settings - All authenticated internal staff */}
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute roles={['Admin', 'Recruiter', 'HiringManager']}>
                          <SettingsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin-only Routes */}
                    <Route
                      path="/audit-log"
                      element={
                        <ProtectedRoute roles={['Admin']}>
                          <AuditLogPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/users"
                      element={
                        <ProtectedRoute roles={['Admin']}>
                          <UserManagementPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch-all redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </Router>
            </AuthProvider>
          </LoadingProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
