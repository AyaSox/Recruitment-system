import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingsPage: React.FC = () => {
  const { authState, isAdmin } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/auth/profile');
      if (response.data.isSuccess) {
        setProfile(response.data.data);
        setProfileForm({
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    try {
      const response = await api.put('/api/auth/profile', profileForm);

      if (response.data.isSuccess) {
        setSuccess('Profile updated successfully');
        setIsEditingProfile(false);
        await fetchProfile();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await api.post('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.data.isSuccess) {
        setSuccess('Password changed successfully');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'error';
      case 'Recruiter':
        return 'primary';
      case 'HiringManager':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Typography>Loading...</Typography>
        </Container>
      </Layout>
    );
  }

  const canEditProfile = isAdmin();

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Profile Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Profile Information
              </Typography>
              {canEditProfile && !isEditingProfile && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditingProfile(true)}
                >
                  Edit
                </Button>
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box component="form" onSubmit={handleUpdateProfile}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={isEditingProfile ? profileForm.firstName : profile?.firstName || ''}
                    onChange={handleProfileChange}
                    fullWidth
                    disabled={!isEditingProfile}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={isEditingProfile ? profileForm.lastName : profile?.lastName || ''}
                    onChange={handleProfileChange}
                    fullWidth
                    disabled={!isEditingProfile}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    value={profile?.email || ''}
                    fullWidth
                    disabled
                    helperText="Email cannot be changed for security reasons"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Roles
                    </Typography>
                    <Box display="flex" gap={1}>
                      {profile?.roles.map((role) => (
                        <Chip
                          key={role}
                          label={role}
                          color={getRoleColor(role)}
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {isEditingProfile && (
                <Box display="flex" gap={2} mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setProfileForm({
                        firstName: profile?.firstName || '',
                        lastName: profile?.lastName || '',
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}

              {!canEditProfile && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Contact your administrator to update your profile information.
                </Alert>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box component="form" onSubmit={handleChangePassword}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                    helperText="Minimum 6 characters, include uppercase, lowercase, number, and special character"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<LockIcon />}
                  >
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default SettingsPage;
