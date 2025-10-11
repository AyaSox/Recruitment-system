// Type declarations for better TypeScript support

declare module '@mui/material' {
  export * from '@mui/material/index';
}

declare module '@mui/icons-material' {
  export * from '@mui/icons-material/index';
}

declare module '@mui/x-date-pickers/DatePicker' {
  export { DatePicker } from '@mui/x-date-pickers';
}

declare module '@mui/x-date-pickers/LocalizationProvider' {
  export { LocalizationProvider } from '@mui/x-date-pickers';
}

declare module '@mui/x-date-pickers/AdapterDateFns' {
  export { AdapterDateFns } from '@mui/x-date-pickers';
}

// Global type extensions
declare global {
  interface Window {
    setInterval: typeof setInterval;
    clearInterval: typeof clearInterval;
  }
}

export {};