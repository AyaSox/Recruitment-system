// Job types

// Base interface for common job properties
interface BaseJob {
  id: number;
  title: string;
  location: string;
  department: string;
  postedDate: string;
  closingDate: string;
  isPublished: boolean;
  isApproved: boolean; // Admin approval status
  employmentType: string;
  experienceLevel: string;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  currency: string;
  applicationCount: number;
  displayLocation: string;
  displayDepartment: string;
}

// User info for createdBy
export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Full Job interface with all properties
export interface Job extends BaseJob {
  description: string;
  createdByName: string;
  timelineNote: string;
  isEmploymentEquityPosition?: boolean;
  employmentEquityNotes?: string;
}

// JobSummary is the same as BaseJob - no extension needed
export interface JobSummary extends BaseJob {
  timelineNote: string;
  isEmploymentEquityPosition?: boolean;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  location: string;
  department: string;
  closingDate: string;
  employmentType: string;
  experienceLevel: string;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  currency: string;
  isEmploymentEquityPosition?: boolean;
  employmentEquityNotes?: string;
}

export interface UpdateJobRequest {
  id: number;
  title: string;
  description: string;
  location: string;
  department: string;
  closingDate: string;
  isPublished: boolean;
  employmentType: string;
  experienceLevel: string;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  currency: string;
  isEmploymentEquityPosition?: boolean;
  employmentEquityNotes?: string;
}

export interface JobFilters {
  searchTerm?: string;
  location?: string;
  department?: string;
  employmentType?: string;
  experienceLevel?: string;
  isPublished?: boolean;
}

export interface PaginatedJobResponse {
  items: JobSummary[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

// Constants for dropdowns
export const SOUTH_AFRICAN_LOCATIONS = [
  'Johannesburg, Gauteng',
  'Durban, KwaZulu-Natal',
  'Pretoria, Gauteng',
  'Cape Town, Western Cape',
  'Other',
] as const;

export const JOB_DEPARTMENTS = [
  'Human Capital',
  'IT',
  'Operations',
  'Sales & Marketing',
  'Finance',
  'Legal',
  'Other',
] as const;

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
] as const;

export const EXPERIENCE_LEVELS = ['Entry', 'Mid', 'Senior', 'Executive'] as const;
