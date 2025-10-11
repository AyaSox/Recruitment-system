import api from './api';
import {
  Job,
  JobSummary,
  CreateJobRequest,
  UpdateJobRequest,
  JobApprovalRequest,
  PaginatedJobResponse,
  JobFilters,
} from '../types/job';

// Advanced search request interface
interface AdvancedJobSearchRequest {
  keywords?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  minSalary?: number;
  maxSalary?: number;
  requiredSkills?: number[];
  isEmploymentEquity?: boolean;
  postedAfter?: string;
  sortBy?: string;
  sortDescending?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

// Search filters response interface
interface SearchFiltersResponse {
  departments: string[];
  locations: string[];
  employmentTypes: string[];
  experienceLevels: string[];
  minSalary: number;
  maxSalary: number;
  totalJobs: number;
}

const JobService = {
  // Get all jobs with pagination and filters
  getJobs: async (
    page: number = 0,
    pageSize: number = 10,
    filters: JobFilters = {}
  ): Promise<PaginatedJobResponse> => {
    const params: Record<string, string | number | boolean | undefined> = {
      page,
      pageSize,
      ...filters,
    };

    // Remove undefined values
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });

    const response = await api.get<PaginatedJobResponse>('/jobs', { params });
    return response.data;
  },

  // Get a public job (available to non-authenticated users)
  getPublicJob: async (id: number): Promise<Job> => {
    const response = await api.get<Job>(`/jobs/${id}`);
    return response.data;
  },

  // Advanced job search
  advancedSearch: async (
    searchCriteria: AdvancedJobSearchRequest
  ): Promise<PaginatedJobResponse> => {
    const response = await api.post<PaginatedJobResponse>(
      '/jobs/search/advanced',
      searchCriteria
    );
    return response.data;
  },

  // Get available search filters
  getSearchFilters: async (): Promise<SearchFiltersResponse> => {
    const response = await api.get<SearchFiltersResponse>('/jobs/search/filters');
    return response.data;
  },

  // Get jobs pending approval (Admin only)
  getPendingApprovalJobs: async (
    page: number = 0,
    pageSize: number = 10
  ): Promise<PaginatedJobResponse> => {
    const response = await api.get<PaginatedJobResponse>('/jobs/pending-approval', {
      params: { page, pageSize },
    });
    return response.data;
  },

  // Get available locations
  getAvailableLocations: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/jobs/locations');
    return response.data;
  },

  // Get available departments
  getAvailableDepartments: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/jobs/departments');
    return response.data;
  },

  // Get a specific job by ID (authenticated)
  getJob: async (id: number): Promise<Job> => {
    const response = await api.get<Job>(`/jobs/${id}`);
    return response.data;
  },

  // Create a new job
  createJob: async (data: CreateJobRequest): Promise<Job> => {
    const response = await api.post<Job>('/jobs', data);
    return response.data;
  },

  // Update an existing job
  updateJob: async (data: UpdateJobRequest): Promise<Job> => {
    const response = await api.put<Job>(`/jobs/${data.id}`, data);
    return response.data;
  },

  // Publish a job (set isPublished to true)
  publishJob: async (id: number): Promise<Job> => {
    const response = await api.put<{ success: boolean; message: string; data: Job }>(`/jobs/${id}/publish`);
    return response.data.data;
  },

  // Unpublish a job (set isPublished to false)
  unpublishJob: async (id: number): Promise<Job> => {
    const response = await api.put<{ success: boolean; message: string; data: Job }>(`/jobs/${id}/unpublish`);
    return response.data.data;
  },

  // Delete a job
  deleteJob: async (id: number): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },

  // Set job publish status (toggle publish/unpublish) - Fixed method
  setJobPublishStatus: async (id: number, isPublished: boolean): Promise<Job> => {
    try {
      // This method updates a job's publish status by getting the current job
      // and updating it with the new publish status
      const currentJob = await JobService.getJob(id);
      const updateData: UpdateJobRequest = {
        id: currentJob.id,
        title: currentJob.title,
        description: currentJob.description,
        location: currentJob.location,
        customLocation: currentJob.customLocation,
        department: currentJob.department,
        customDepartment: currentJob.customDepartment,
        closingDate: currentJob.closingDate,
        isPublished: isPublished,
        employmentType: currentJob.employmentType,
        experienceLevel: currentJob.experienceLevel,
        isEmploymentEquityPosition: currentJob.isEmploymentEquityPosition,
        employmentEquityNotes: currentJob.employmentEquityNotes,
        salaryRangeMin: currentJob.salaryRangeMin,
        salaryRangeMax: currentJob.salaryRangeMax,
        currency: currentJob.currency,
        skills: currentJob.skills,
      };

      const response = await api.put<Job>(`/jobs/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating job publish status:', error);
      throw error;
    }
  },

  // Approve or reject a job (Admin only)
  approveJob: async (data: JobApprovalRequest): Promise<Job> => {
    const response = await api.put<Job>(`/jobs/${data.jobId}/approve`, data);
    return response.data;
  },

  // Helper method to get formatted salary range
  getFormattedSalaryRange: (job: Job | JobSummary): string => {
    if (!job.salaryRangeMin && !job.salaryRangeMax) {
      return 'Salary not disclosed';
    }

    const min = job.salaryRangeMin;
    const max = job.salaryRangeMax;

    if (min && max) {
      return `R ${min.toLocaleString()} - R ${max.toLocaleString()}`;
    } else if (min) {
      return `From R ${min.toLocaleString()}`;
    } else if (max) {
      return `Up to R ${max.toLocaleString()}`;
    }

    return 'Salary not disclosed';
  },

  // Helper method to check if job is closing soon
  isClosingSoon: (job: Job | JobSummary, daysThreshold: number = 7): boolean => {
    const closingDate = new Date(job.closingDate);
    const now = new Date();
    const diffTime = closingDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= daysThreshold && diffDays > 0;
  },

  // Helper method to check if job has expired
  hasExpired: (job: Job | JobSummary): boolean => {
    const closingDate = new Date(job.closingDate);
    const now = new Date();
    return closingDate < now;
  },
};

export default JobService;
