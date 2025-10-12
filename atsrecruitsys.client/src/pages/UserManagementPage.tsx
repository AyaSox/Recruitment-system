import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdAt: string;
}

interface NewUserForm {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

interface EditUserForm {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

const UserManagementPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [newUser, setNewUser] = useState<NewUserForm>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'Recruiter',
  });

  const [editUser, setEditUser] = useState<EditUserForm>({
    id: '',
    firstName: '',
    lastName: '',
    role: 'Recruiter',
  });

  const roles = ['Admin', 'Recruiter', 'HiringManager'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/auth/users');
      if (response.data.isSuccess) {
        // Filter out Applicant role users - only show internal staff
        const internalUsers = response.data.data.filter((user: User) =>
          user.roles.some((role: string) => ['Admin', 'Recruiter', 'HiringManager'].includes(role))
        );
        setUsers(internalUsers);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setError(null);
    setSuccess(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewUser({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'Recruiter',
    });
  };

  const handleOpenEditDialog = (user: User) => {
    setEditUser({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.roles[0] || 'Recruiter',
    });
    setOpenEditDialog(true);
    setError(null);
    setSuccess(null);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditUser({
      id: '',
      firstName: '',
      lastName: '',
      role: 'Recruiter',
    });
  };

  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setUserToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (e: any) => {
    setNewUser({
      ...newUser,
      role: e.target.value,
    });
  };

  const handleEditRoleChange = (e: any) => {
    setEditUser({
      ...editUser,
      role: e.target.value,
    });
  };

  const handleCreateUser = async () => {
    try {
      setError(null);
      
      // Validate form
      if (!newUser.email || !newUser.firstName || !newUser.lastName || !newUser.password) {
        setError('All fields are required');
        return;
      }

      // Create user using admin endpoint
      const response = await api.post('/api/auth/create-user', {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        password: newUser.password,
        role: newUser.role,
      });

      if (response.data.isSuccess) {
        setSuccess(`User ${newUser.email} created successfully with ${newUser.role} role!`);
        handleCloseDialog();
        fetchUsers();
      } else {
        setError(response.data.message || 'Failed to create user');
      }
    } catch (err: any) {
      console.error('User creation error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    try {
      setError(null);
      
      if (!editUser.firstName || !editUser.lastName) {
        setError('First name and last name are required');
        return;
      }

      // Get the user's current data
      const currentUser = users.find(u => u.id === editUser.id);
      if (!currentUser) {
        setError('User not found');
        return;
      }

      // Update user via API (you may need to implement this endpoint in backend)
      // For now, we'll update via removing and re-adding role if role changed
      const currentRole = currentUser.roles[0];
      
      if (currentRole !== editUser.role) {
        // Remove old role
        await api.post('/api/auth/remove-role', {
          userId: editUser.id,
          role: currentRole,
        });
        
        // Add new role
        await api.post('/api/auth/assign-role', {
          userId: editUser.id,
          role: editUser.role,
        });
      }

      setSuccess('User updated successfully!');
      handleCloseEditDialog();
      fetchUsers();
    } catch (err: any) {
      console.error('User update error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setError(null);
      
      const response = await api.delete(`/api/auth/users/${userToDelete.id}`);
      
      if (response.data.isSuccess) {
        setSuccess(`User ${userToDelete.email} deleted successfully!`);
        handleCloseDeleteDialog();
        fetchUsers();
      } else {
        setError(response.data.message || 'Failed to delete user');
      }
    } catch (err: any) {
      console.error('User deletion error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete user');
      handleCloseDeleteDialog();
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

  if (!isAdmin()) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error">You do not have permission to access this page.</Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            User Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenDialog}
          >
            Add New User
          </Button>
        </Box>

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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        {user.roles.map((role) => (
                          <Chip
                            key={role}
                            label={role}
                            size="small"
                            color={getRoleColor(role)}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit User">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenEditDialog(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleOpenDeleteDialog(user)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Create User Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Create New User</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="First Name"
                name="firstName"
                value={newUser.firstName}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={newUser.lastName}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={newUser.password}
                onChange={handleInputChange}
                fullWidth
                required
                helperText="Minimum 6 characters, must include uppercase, lowercase, number, and special character"
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select value={newUser.role} onChange={handleRoleChange} label="Role">
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleCreateUser} variant="contained" color="primary">
              Create User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="First Name"
                name="firstName"
                value={editUser.firstName}
                onChange={handleEditInputChange}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={editUser.lastName}
                onChange={handleEditInputChange}
                fullWidth
                required
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select value={editUser.role} onChange={handleEditRoleChange} label="Role">
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button onClick={handleUpdateUser} variant="contained" color="primary">
              Update User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete user{' '}
              <strong>
                {userToDelete?.firstName} {userToDelete?.lastName}
              </strong>{' '}
              ({userToDelete?.email})?
            </Typography>
            <Typography color="error" sx={{ mt: 2 }}>
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleDeleteUser} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default UserManagementPage;
