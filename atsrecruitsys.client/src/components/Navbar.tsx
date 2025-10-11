import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  Tooltip,
  ListItemButton,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const drawerWidth = 240;
const drawerWidthCollapsed = 64;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
  boxShadow: '0 2px 8px rgba(46, 125, 50, 0.15)',
}));

interface StyledDrawerProps {
  collapsed?: boolean;
}

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<StyledDrawerProps>(({ theme, collapsed }) => ({
  width: collapsed ? drawerWidthCollapsed : drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: collapsed ? drawerWidthCollapsed : drawerWidth,
    boxSizing: 'border-box',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(180deg, #1a2420 0%, #0a0f0d 100%)'
      : 'linear-gradient(180deg, #f1f8f4 0%, #ffffff 100%)',
    borderRight: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(102, 187, 106, 0.1)' : 'rgba(46, 125, 50, 0.08)'}`,
  },
}));

interface NavbarProps {
  title: string;
  onDrawerToggle?: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ title, onDrawerToggle }) => {
  const { authState, logout, isAdmin, isRecruiter, isHiringManager } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = React.useState(!isMobile);
  const [drawerCollapsed, setDrawerCollapsed] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    const newState = !drawerOpen;
    setDrawerOpen(newState);
    if (onDrawerToggle) {
      onDrawerToggle(newState && !drawerCollapsed);
    }
  };

  const handleDrawerCollapse = () => {
    const newCollapsed = !drawerCollapsed;
    setDrawerCollapsed(newCollapsed);
    if (onDrawerToggle) {
      onDrawerToggle(drawerOpen && !newCollapsed);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleProfileMenuClose();
    navigate('/settings');
  };

  const navigateTo = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const items: { text: string; icon: React.ReactNode; path: string }[] = [];

    if (isAdmin() || isRecruiter() || isHiringManager()) {
      items.push(
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Jobs', icon: <WorkIcon />, path: '/jobs' },
        { text: 'Applications', icon: <AssignmentIcon />, path: '/applications' },
        { text: 'Application Funnel', icon: <ViewKanbanIcon />, path: '/applications/funnel' },
        { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' }
      );

      if (isAdmin()) {
        items.push(
          { text: 'User Management', icon: <PersonIcon />, path: '/users' },
          { text: 'Audit Logs', icon: <HistoryIcon />, path: '/audit-log' }
        );
      }
      
      items.push(
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
      );
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          {authState.isAuthenticated && (
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '-0.5px'
            }}
          >
            {title}
          </Typography>

          {authState.isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThemeToggle />

              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ 
                  ml: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    fontWeight: 700
                  }}
                >
                  {authState.user?.firstName?.charAt(0) || ''}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    borderRadius: 2,
                    minWidth: 200,
                  }
                }}
              >
                <MenuItem onClick={handleProfile}>
                  <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  Profile / Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ThemeToggle />
              
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                sx={{
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Login
              </Button>
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>

      {authState.isAuthenticated && (
        <StyledDrawer
          variant={isMobile ? 'temporary' : 'persistent'}
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          collapsed={drawerCollapsed && !isMobile}
        >
          <Toolbar />
          
          {/* Drawer Header with Collapse/Expand Button */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: drawerCollapsed ? 'center' : 'flex-end',
              p: 1,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(102, 187, 106, 0.05)'
                : 'rgba(46, 125, 50, 0.03)',
            }}
          >
            {!isMobile && (
              <Tooltip title={drawerCollapsed ? 'Expand' : 'Collapse'} placement="right">
                <IconButton 
                  onClick={handleDrawerCollapse}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(102, 187, 106, 0.1)'
                        : 'rgba(46, 125, 50, 0.08)',
                    }
                  }}
                >
                  {drawerCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </Tooltip>
            )}
            {isMobile && (
              <IconButton onClick={handleDrawerToggle}>
                <ChevronLeftIcon />
              </IconButton>
            )}
          </Box>
          
          <Divider />
          
          <Box sx={{ height: 'calc(100% - 120px)', overflowY: 'auto', pt: 1 }}>
            <List>
              {navigationItems.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <Tooltip 
                    key={item.text} 
                    title={drawerCollapsed && !isMobile ? item.text : ''} 
                    placement="right"
                  >
                    <ListItem 
                      disablePadding
                      sx={{ px: 1 }}
                    >
                      <ListItemButton
                        onClick={() => navigateTo(item.path)}
                        selected={isActive}
                        sx={{
                          justifyContent: drawerCollapsed ? 'center' : 'flex-start',
                          px: drawerCollapsed ? 1 : 2,
                          py: 1.25,
                          borderRadius: 2,
                          mb: 0.5,
                          bgcolor: isActive 
                            ? theme.palette.mode === 'dark'
                              ? 'rgba(102, 187, 106, 0.15)'
                              : 'rgba(46, 125, 50, 0.08)'
                            : 'transparent',
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark'
                              ? 'rgba(102, 187, 106, 0.1)'
                              : 'rgba(46, 125, 50, 0.05)',
                          },
                          '&.Mui-selected': {
                            bgcolor: theme.palette.mode === 'dark'
                              ? 'rgba(102, 187, 106, 0.15)'
                              : 'rgba(46, 125, 50, 0.08)',
                            borderLeft: isActive ? '3px solid' : 'none',
                            borderColor: 'primary.main',
                            '&:hover': {
                              bgcolor: theme.palette.mode === 'dark'
                                ? 'rgba(102, 187, 106, 0.2)'
                                : 'rgba(46, 125, 50, 0.12)',
                            }
                          }
                        }}
                      >
                        <ListItemIcon 
                          sx={{ 
                            minWidth: drawerCollapsed ? 'unset' : 40,
                            justifyContent: 'center',
                            color: isActive ? 'primary.main' : 'inherit'
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        {!drawerCollapsed && (
                          <ListItemText 
                            primary={item.text}
                            primaryTypographyProps={{
                              fontWeight: isActive ? 600 : 500,
                              fontSize: '0.9375rem'
                            }}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                );
              })}
            </List>
          </Box>

          {/* Footer badge */}
          {!drawerCollapsed && (
            <Box 
              sx={{ 
                p: 2, 
                borderTop: 1, 
                borderColor: 'divider',
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(102, 187, 106, 0.05)'
                  : 'rgba(46, 125, 50, 0.03)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(102, 187, 106, 0.1)'
                    : 'rgba(46, 125, 50, 0.05)',
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 700
                  }}
                >
                  {authState.user?.firstName?.charAt(0) || ''}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="body2" 
                    fontWeight={600} 
                    noWrap
                  >
                    {authState.user?.firstName} {authState.user?.lastName}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    noWrap
                  >
                    {authState.user?.roles?.[0] || 'User'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </StyledDrawer>
      )}

      <Toolbar />
    </Box>
  );
};

export default Navbar;
