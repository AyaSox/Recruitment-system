import React, { useState, ReactNode } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Fab,
  Slide,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Collapse,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Work as JobsIcon,
  Assignment as ApplicationsIcon,
  Schedule as InterviewsIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  Search as SearchIcon,
  Assessment as ReportsIcon,
  History as AuditLogIcon,
  People as UsersIcon,
  ViewKanban as FunnelIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

interface MobileLayoutProps {
  children: ReactNode;
}

interface NavigationItem {
  label: string;
  path: string;
  icon: ReactNode;
  roles?: string[];
  children?: NavigationItem[];
}

interface QuickAction {
  label: string;
  icon: ReactNode;
  path: string;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 64;

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['Jobs', 'Applications']));
  const [showQuickActions, setShowQuickActions] = useState(false);

  const drawerWidth = sidebarCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
      roles: ['Admin', 'Recruiter', 'HiringManager']
    },
    {
      label: 'Jobs',
      path: '/jobs',
      icon: <JobsIcon />,
      children: [
        { label: 'All Jobs', path: '/jobs', icon: <JobsIcon /> },
        { label: 'Create Job', path: '/jobs/create', icon: <AddIcon />, roles: ['Admin', 'Recruiter'] }
      ]
    },
    {
      label: 'Applications',
      path: '/applications',
      icon: <ApplicationsIcon />,
      roles: ['Admin', 'Recruiter'],
      children: [
        { label: 'All Applications', path: '/applications', icon: <ApplicationsIcon />, roles: ['Admin', 'Recruiter'] },
        { label: 'Application Funnel', path: '/applications/funnel', icon: <FunnelIcon />, roles: ['Admin', 'Recruiter'] }
      ]
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: <ReportsIcon />,
      roles: ['Admin', 'Recruiter']
    },
    {
      label: 'User Management',
      path: '/users',
      icon: <UsersIcon />,
      roles: ['Admin']
    },
    {
      label: 'Audit Log',
      path: '/audit-log',
      icon: <AuditLogIcon />,
      roles: ['Admin']
    }
  ];

  const quickActions: QuickAction[] = [
    {
      label: 'New Job',
      icon: <JobsIcon />,
      path: '/jobs/create',
      color: 'primary'
    },
    {
      label: 'Search',
      icon: <SearchIcon />,
      path: '/search',
      color: 'secondary'
    }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // When collapsing, close all expanded menus
    if (!sidebarCollapsed) {
      setExpandedMenus(new Set());
    } else {
      // When expanding, open default menus
      setExpandedMenus(new Set(['Jobs', 'Applications']));
    }
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
    navigate('/login');
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const toggleSubmenu = (label: string) => {
    if (sidebarCollapsed) {
      // If sidebar is collapsed, expand it first
      setSidebarCollapsed(false);
    }
    
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedMenus(newExpanded);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const hasAccess = (roles?: string[]) => {
    if (!roles) return true;
    const userRoles = user?.roles || [];
    return roles.some(r => userRoles.includes(r));
  };

  const renderNavigationItems = (items: NavigationItem[], level = 0) => {
    return items.map((item) => {
      if (!hasAccess(item.roles)) return null;

      const isActive = isActiveRoute(item.path);
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedMenus.has(item.label);

      return (
        <React.Fragment key={item.label}>
          <Tooltip title={sidebarCollapsed ? item.label : ''} placement="right">
            <ListItem
              button
              onClick={() => {
                if (hasChildren) {
                  toggleSubmenu(item.label);
                } else {
                  handleMenuItemClick(item.path);
                }
              }}
              sx={{
                pl: sidebarCollapsed ? 2 : (level > 0 ? 4 : 2),
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                bgcolor: isActive && !hasChildren ? 'action.selected' : 'transparent',
                borderLeft: isActive && !hasChildren ? '4px solid' : 'none',
                borderLeftColor: 'primary.main',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: isActive ? 'primary.main' : 'inherit', 
                  minWidth: sidebarCollapsed ? 'unset' : 40,
                  justifyContent: 'center'
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!sidebarCollapsed && (
                <>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'primary.main' : 'inherit'
                    }}
                  />
                  {hasChildren && (
                    isExpanded ? <ExpandLess /> : <ExpandMore />
                  )}
                </>
              )}
            </ListItem>
          </Tooltip>
          
          {hasChildren && !sidebarCollapsed && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderNavigationItems(item.children!, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      {!sidebarCollapsed ? (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap fontWeight={600}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user?.email}
              </Typography>
            </Box>
            {isMobile && (
              <IconButton onClick={handleDrawerToggle} size="small">
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={`${user?.firstName} ${user?.lastName}`} placement="right">
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
          </Tooltip>
        </Box>
      )}

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List>
          {renderNavigationItems(navigationItems)}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <List>
          <Tooltip title={sidebarCollapsed ? 'Settings' : ''} placement="right">
            <ListItem 
              button 
              onClick={() => navigate('/settings')}
              sx={{ 
                pl: sidebarCollapsed ? 2 : 2,
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
              }}
            >
              <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 'unset' : 40, justifyContent: 'center' }}>
                <SettingsIcon />
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Settings" />}
            </ListItem>
          </Tooltip>
          <Tooltip title={sidebarCollapsed ? 'Logout' : ''} placement="right">
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{ 
                pl: sidebarCollapsed ? 2 : 2,
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
              }}
            >
              <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 'unset' : 40, justifyContent: 'center' }}>
                <LogoutIcon />
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Logout" />}
            </ListItem>
          </Tooltip>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)` },
          ml: { md: isMobile ? 0 : `${drawerWidth}px` },
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          })
        }}
      >
        <Toolbar>
          {isMobile ? (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleSidebarToggle}
              sx={{ mr: 2 }}
            >
              {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ATS Recruit Sys
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeToggle />
            
            <IconButton
              size="large"
              onClick={handleUserMenuClick}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.firstName?.[0]}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH
              }
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: 1,
                borderColor: 'divider',
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                overflowX: 'hidden'
              }
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          })
        }}
      >
        <Toolbar />
        
        <Box sx={{ position: 'relative', minHeight: 'calc(100vh - 64px)' }}>
          {children}
          
          {isMobile && (
            <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
              <Slide direction="up" in={!showQuickActions}>
                <Fab
                  color="primary"
                  onClick={() => setShowQuickActions(true)}
                  sx={{ mb: 1 }}
                >
                  <AddIcon />
                </Fab>
              </Slide>
              
              <Slide direction="up" in={showQuickActions}>
                <Paper
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    minWidth: 200
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">Quick Actions</Typography>
                    <IconButton size="small" onClick={() => setShowQuickActions(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      variant="outlined"
                      color={action.color}
                      startIcon={action.icon}
                      fullWidth
                      onClick={() => {
                        navigate(action.path);
                        setShowQuickActions(false);
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Paper>
              </Slide>
            </Box>
          )}
        </Box>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleUserMenuClose(); }}>
          <ListItemIcon>
            <ProfileIcon />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleUserMenuClose(); }}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MobileLayout;