import React, { ReactNode, useState } from 'react';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Typography,
  Divider,
  Stack
} from '@mui/material';
import Navbar from './Navbar';
import MobileLayout from './MobileLayout';
import ChatWidget from './ChatWidget';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableMobileLayout?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'ATS Recruitment System',
  maxWidth = 'lg',
  disableMobileLayout = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const [drawerExpanded, setDrawerExpanded] = useState(true);

  // Calculate margin based on drawer state
  const getMarginLeft = () => {
    if (!user || isMobile) return '0px';
    return drawerExpanded ? '240px' : '64px';
  };

  const handleDrawerToggle = (isExpanded: boolean) => {
    setDrawerExpanded(isExpanded);
  };

  // Footer component
  const Footer = () => (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth={maxWidth}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Typography variant="body2" color="text.secondary">
            {'\u00A9'} 2025 ATS Recruitment System. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Professional Recruitment Management
          </Typography>
        </Stack>
      </Container>
    </Box>
  );

  // Use mobile layout only if user is authenticated and we're on mobile devices
  if (!disableMobileLayout && user && isMobile) {
    return (
      <>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <MobileLayout>
            <Container maxWidth={maxWidth} sx={{ py: 2, flexGrow: 1 }}>
              {children}
            </Container>
          </MobileLayout>
          <Footer />
        </Box>
        <ChatWidget />
      </>
    );
  }

  // Use Navbar layout for desktop authenticated users
  if (!disableMobileLayout && user && !isMobile) {
    return (
      <>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar title={title} onDrawerToggle={handleDrawerToggle} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 3,
              marginLeft: getMarginLeft(),
              transition: theme.transitions.create(['margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }}
          >
            <Container maxWidth={maxWidth}>{children}</Container>
          </Box>
          <Box
            sx={{
              marginLeft: getMarginLeft(),
              transition: theme.transitions.create(['margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }}
          >
            <Footer />
          </Box>
        </Box>
        <ChatWidget />
      </>
    );
  }

  // Fallback to basic layout for non-authenticated pages
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar title={title} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 3,
            px: 2,
          }}
        >
          <Container maxWidth={maxWidth}>{children}</Container>
        </Box>
        <Footer />
      </Box>
      <ChatWidget />
    </>
  );
};

export default Layout;
