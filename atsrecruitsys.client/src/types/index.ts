// Re-export all types from individual type files
export * from './auth';
export * from './job';
export * from './application';
export * from './dashboard';
export * from './candidateProfile';

// Common pagination interface (can be used by multiple entities)
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

// Common API response interface
export interface ApiResponse<T> {
  data?: T;
  isSuccess: boolean;
  errorMessage?: string;
  errors?: string[];
}

// User interface for authentication context
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

// Common error interface
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// File upload interface
export interface FileUploadResponse {
  fileName: string;
  filePath: string;
  fileSize: number;
  contentType: string;
}
