import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { Snackbar, Alert as MuiAlert, AlertColor } from '@mui/material';

interface NotificationContextValue {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  notifyInfo: (message: string) => void;
  notifyWarning: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NotificationState>({ open: false, message: '', severity: 'info' });

  const value = useMemo<NotificationContextValue>(() => ({
    notifySuccess: (message: string) => setState({ open: true, message, severity: 'success' }),
    notifyError: (message: string) => setState({ open: true, message, severity: 'error' }),
    notifyInfo: (message: string) => setState({ open: true, message, severity: 'info' }),
    notifyWarning: (message: string) => setState({ open: true, message, severity: 'warning' }),
  }), []);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={() => setState((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={state.severity}
          onClose={() => setState((s) => ({ ...s, open: false }))}
          sx={{ minWidth: '300px', fontSize: '1rem', '& .MuiAlert-message': { fontSize: '0.95rem' } }}
        >
          {state.message}
        </MuiAlert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return ctx;
};
