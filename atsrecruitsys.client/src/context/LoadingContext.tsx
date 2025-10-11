import React, { createContext, useContext, useState, useCallback } from 'react';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string | null;
  setLoading: (loading: boolean, message?: string) => void;
  withLoading: <T>(promise: Promise<T>, message?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}

interface LoadingProviderProps {
  children: React.ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingCount, setLoadingCount] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const isLoading = loadingCount > 0;

  const setLoading = useCallback((loading: boolean, message?: string) => {
    setLoadingCount((prev) => {
      const newCount = loading ? prev + 1 : Math.max(0, prev - 1);

      // Update message when starting to load
      if (loading && message) {
        setLoadingMessage(message);
      }

      // Clear message when all loading is complete
      if (newCount === 0) {
        setLoadingMessage(null);
      }

      return newCount;
    });
  }, []);

  const withLoading = useCallback(
    async <T,>(promise: Promise<T>, message?: string): Promise<T> => {
      setLoading(true, message);
      try {
        const result = await promise;
        return result;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingMessage,
        setLoading,
        withLoading,
      }}
    >
      {children}

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
        open={isLoading}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress color="inherit" size={60} />
          {loadingMessage && (
            <Typography variant="h6" color="inherit">
              {loadingMessage}
            </Typography>
          )}
        </Box>
      </Backdrop>
    </LoadingContext.Provider>
  );
}

export default LoadingContext;
