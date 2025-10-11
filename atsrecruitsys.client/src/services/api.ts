import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { env } from '../config/env';

// Extend AxiosRequestConfig to include retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

// Define error response structure
interface ErrorResponseData {
  message?: string;
  error?: string;
  [key: string]: any;
}

// API Error class for better error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: ErrorResponseData
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Create axios instance with configuration
const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request ID generator for tracking
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Retry delay calculator (exponential backoff)
function getRetryDelay(retryCount: number): number {
  return Math.min(1000 * Math.pow(2, retryCount), 10000);
}

// Check if request should be retried
function shouldRetry(error: AxiosError): boolean {
  const config = error.config as ExtendedAxiosRequestConfig | undefined;
  const retryCount = config?._retryCount || 0;
  const maxRetries = 3;

  // Don't retry if max retries reached
  if (retryCount >= maxRetries) return false;

  // Retry on network errors
  if (!error.response) return true;

  // Retry on specific status codes
  const retryStatusCodes = [408, 429, 500, 502, 503, 504];
  return retryStatusCodes.includes(error.response.status);
}

// Development logger
const logger = {
  request: (method: string, url: string) => {
    if (env.isDevelopment) {
      console.log(`?? API Request: ${method} ${url}`);
    }
  },
  response: (method: string, url: string, status: number) => {
    if (env.isDevelopment) {
      console.log(`? API Response: ${method} ${url}`, status);
    }
  },
  error: (status: string, message: string) => {
    if (env.isDevelopment) {
      console.error(`? API Error: ${status}`, message);
    }
  },
  retry: (attempt: number, delay: number) => {
    if (env.isDevelopment) {
      console.log(`?? Retrying request (attempt ${attempt}) after ${delay}ms`);
    }
  },
};

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Add authentication token
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    if (config.headers) {
      config.headers['X-Request-ID'] = generateRequestId();
    }

    // Log request in development
    logger.request(config.method?.toUpperCase() || 'GET', config.url || '');

    return config;
  },
  (error: AxiosError) => {
    logger.error('Request Interceptor', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Log response in development
    logger.response(
      response.config.method?.toUpperCase() || 'GET',
      response.config.url || '',
      response.status
    );
    return response;
  },
  async (error: AxiosError<ErrorResponseData>) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Log error in development
    logger.error(
      error.response?.status?.toString() || 'Network Error',
      error.message
    );

    // Handle network errors with retry
    if (!error.response && shouldRetry(error)) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      const delay = getRetryDelay(originalRequest._retryCount);

      logger.retry(originalRequest._retryCount, delay);
      await new Promise((resolve) => setTimeout(resolve, delay));

      return api(originalRequest);
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // DON'T do hard redirect here - let the components/AuthContext handle it
      // This prevents unwanted redirects during operations like status updates
      
      return Promise.reject(
        new ApiError('Session expired. Please login again.', 401, error.response.data)
      );
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      return Promise.reject(
        new ApiError('You do not have permission to perform this action.', 403, error.response.data)
      );
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      return Promise.reject(
        new ApiError('The requested resource was not found.', 404, error.response.data)
      );
    }

    // Handle 429 Rate Limit with retry
    if (error.response?.status === 429 && shouldRetry(error)) {
      const retryAfter = error.response.headers['retry-after'];
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;

      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      logger.retry(originalRequest._retryCount, delay);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(originalRequest);
    }

    // Handle 500 Internal Server Error with retry
    if (error.response?.status && error.response.status >= 500 && shouldRetry(error)) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      const delay = getRetryDelay(originalRequest._retryCount);

      logger.retry(originalRequest._retryCount, delay);
      await new Promise((resolve) => setTimeout(resolve, delay));

      return api(originalRequest);
    }

    // Generic error handling with proper type safety
    const errorData = error.response?.data;
    const errorMessage =
      errorData?.message ||
      errorData?.error ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(
      new ApiError(
        errorMessage,
        error.response?.status,
        errorData
      )
    );
  }
);

// Helper function to handle file uploads
export async function uploadFile(
  url: string,
  formData: FormData,
  onProgress?: (progress: number) => void
): Promise<AxiosResponse> {
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
}

// Helper function to download files
export async function downloadFile(url: string, filename: string): Promise<void> {
  const response = await api.get(url, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data]);
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(link.href);
}

export default api;
export { api };
