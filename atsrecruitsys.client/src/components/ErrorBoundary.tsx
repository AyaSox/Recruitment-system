import { Component, ReactNode, ErrorInfo } from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Always log errors in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
    } else {
      // In production, log minimal info
      console.error('An error occurred:', error.message);
      // TODO: Send error to logging service in production
      // logErrorToService(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const handleGoHome = () => {
    onReset();
    window.location.href = '/';
  };

  const handleReload = () => {
    onReset();
    window.location.reload();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />

        <Typography variant="h3" color="error" gutterBottom>
          Oops! Something went wrong
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          {import.meta.env.DEV 
            ? 'An unexpected error has occurred. Please see details below.'
            : 'We\'re sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.'
          }
        </Typography>

        {import.meta.env.DEV && error && (
          <Box
            sx={{
              textAlign: 'left',
              bgcolor: 'grey.100',
              p: 2,
              borderRadius: 1,
              mb: 3,
              maxHeight: 300,
              overflow: 'auto',
            }}
          >
            <Typography variant="subtitle2" color="error" gutterBottom>
              Error Details (Development Only):
            </Typography>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {error.message}
            </Typography>
            {error.stack && (
              <Typography
                variant="caption"
                component="pre"
                sx={{ mt: 1, whiteSpace: 'pre-wrap', fontSize: '0.7rem' }}
              >
                {error.stack}
              </Typography>
            )}
          </Box>
        )}

        {!import.meta.env.DEV && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
            Error ID: {Date.now().toString(36).toUpperCase()}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            size="large"
          >
            Go to Home
          </Button>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleReload}
            size="large"
          >
            Reload Page
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          If this problem persists, please contact support.
        </Typography>
      </Paper>
    </Container>
  );
}

export default ErrorBoundary;
