import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  History as AuditLogIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import ProtectedRoute from '../hooks/useProtectedRoute';
import { AuditService, type AuditLogEntry, type AuditLogFilters, type AuditStats } from '../services';

const AuditLogPage: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<AuditLogFilters>({});

  useEffect(() => {
    loadAuditLogs();
    loadStats();
  }, [page, rowsPerPage, filters]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const data = await AuditService.getAuditLogs(page, rowsPerPage, filters);
      setAuditLogs(data.items);
      setTotalCount(data.totalCount);
      setError(null);
    } catch (err: any) {
      console.error('Error loading audit logs:', err);
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await AuditService.getAuditStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Error loading audit stats:', err);
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: keyof AuditLogFilters, value: string) => {
    const newFilters = {
      ...filters,
      [field]: value || undefined
    };
    setFilters(newFilters);
    setPage(0);
  };

  const handleRefresh = () => {
    loadAuditLogs();
    loadStats();
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderJsonDiff = (oldValues: string, newValues: string) => {
    const oldData = AuditService.parseJsonSafely(oldValues);
    const newData = AuditService.parseJsonSafely(newValues);

    if (!oldData && !newData) return null;

    return (
      <Box sx={{ mt: 1 }}>
        {oldData && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="error">Previous:</Typography>
            <pre style={{ fontSize: '0.75rem', margin: '4px 0', background: '#ffebee', padding: '4px', borderRadius: '4px' }}>
              {JSON.stringify(oldData, null, 2)}
            </pre>
          </Box>
        )}
        {newData && (
          <Box>
            <Typography variant="caption" color="success.main">New:</Typography>
            <pre style={{ fontSize: '0.75rem', margin: '4px 0', background: '#e8f5e8', padding: '4px', borderRadius: '4px' }}>
              {JSON.stringify(newData, null, 2)}
            </pre>
          </Box>
        )}
      </Box>
    );
  };

  if (loading && auditLogs.length === 0) {
    return (
      <ProtectedRoute roles={['Admin']}>
        <Layout title="ATS Recruitment System - Audit Log">
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <CircularProgress />
            </Box>
          </Container>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute roles={['Admin']}>
      <Layout title="ATS Recruitment System - Audit Log">
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AuditLogIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="h1">
                    Audit Log
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    System activity and change tracking
                  </Typography>
                </Box>
              </Box>
              
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Statistics Cards */}
          {stats && (
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Audit Logs
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {stats.totalLogs.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Last 24 Hours
                    </Typography>
                    <Typography variant="h4" color="info.main">
                      {stats.logsLast24Hours.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Last Week
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {stats.logsLastWeek.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Filters */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Filters</Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Entity Type</InputLabel>
                  <Select
                    value={filters.entityType || ''}
                    label="Entity Type"
                    onChange={(e) => handleFilterChange('entityType', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="User">User</MenuItem>
                    <MenuItem value="Job">Job</MenuItem>
                    <MenuItem value="Application">Application</MenuItem>
                    <MenuItem value="Report">Report</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="User ID"
                  value={filters.userId || ''}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="From Date"
                  type="date"
                  value={filters.fromDate || ''}
                  onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="To Date"
                  type="date"
                  value={filters.toDate || ''}
                  onChange={(e) => handleFilterChange('toDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Audit Log Table */}
          <Paper elevation={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Entity</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>IP Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && auditLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : auditLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">No audit logs found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    auditLogs.map((log) => {
                      // Debug: Log the actual data to console
                      console.log('Audit log entry:', log);
                      
                      return (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {formatTimestamp(log.timestamp)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {log.userName || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {log.userEmail || 'Unknown'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={log.action ? AuditService.formatAction(log.action) : 'Unknown'} 
                            size="small"
                            color={
                              log.action === 'Create' ? 'success' :
                              log.action === 'Update' ? 'warning' :
                              log.action === 'Delete' ? 'error' :
                              log.action === 'StatusChange' ? 'info' :
                              'default'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {log.entityType ? AuditService.formatEntityType(log.entityType) : 'Unknown'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {log.entityId || 'N/A'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {(log.oldValues || log.newValues || log.details) ? (
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="caption">
                                  {log.details ? log.details : 'View Changes'}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {log.details && (
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Details:</strong> {log.details}
                                  </Typography>
                                )}
                                {renderJsonDiff(log.oldValues, log.newValues)}
                              </AccordionDetails>
                            </Accordion>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No details
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {log.ipAddress || 'Not recorded'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Paper>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
};

export default AuditLogPage;