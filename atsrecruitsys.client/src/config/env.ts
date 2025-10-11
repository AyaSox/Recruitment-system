/**
 * Environment configuration module
 * Provides type-safe access to environment variables
 */

interface EnvironmentConfig {
  apiUrl: string;
  appName: string;
  appVersion: string;
  enableAnalytics: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  isDevelopment: boolean;
  isProduction: boolean;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value || defaultValue || '';
}

function getBooleanEnv(key: string, defaultValue = false): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

export const env: EnvironmentConfig = {
  apiUrl: getEnvVar('VITE_API_URL', '/api'),
  appName: getEnvVar('VITE_APP_NAME', 'ATS Recruitment System'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  enableAnalytics: getBooleanEnv('VITE_ENABLE_ANALYTICS', false),
  logLevel: getEnvVar('VITE_LOG_LEVEL', 'info') as any,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate configuration on load
if (env.isDevelopment) {
  console.log('?? Environment Configuration:', env);
}

export default env;
