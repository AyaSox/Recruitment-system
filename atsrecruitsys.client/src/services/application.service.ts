import api from './api';
import {
  Application,
  ApplicationsResponse,
  MyApplication,
  CreateApplicationRequest,
  SimpleApplicationRequest,
  UpdateApplicationRequest,
  ApplicationFilters,
  ApplicationStat,
} from '../types';

const ApplicationService = {
  // Get all applications with pagination and filters (Admin/Recruiter)
  getApplications: async (
    filters: ApplicationFilters = {},
    pageIndex: number = 0,
    pageSize: number = 100
  ): Promise<ApplicationsResponse> => {
    const params: Record<string, string | number> = {
      pageIndex,
      pageSize,
    };

    // Add filters if they have values
    if (filters.jobId !== undefined && filters.jobId !== null) {
      params.jobId = filters.jobId;
    }

    if (filters.status && filters.status.trim() !== '') {
      params.status = filters.status;
    }

    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      params.searchTerm = filters.searchTerm;
    }

    const response = await api.get<ApplicationsResponse>('/api/applications', { params });
    return response.data;
  },

  // Get a specific application by ID (Admin/Recruiter/Applicant if owns)
  getApplication: async (id: number): Promise<Application> => {
    const response = await api.get<Application>(`/api/applications/${id}`);
    return response.data;
  },

  // Get all applications for the current user (Applicant)
  getMyApplications: async (): Promise<MyApplication[]> => {
    const response = await api.get<MyApplication[]>('/api/applications/my');
    return response.data;
  },

  // Simplified application submission for external candidates (no login required)
  submitSimpleApplication: async (
    data: SimpleApplicationRequest,
    resumeFile: File
  ): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData();

    // Add basic candidate data
    formData.append('jobId', data.jobId.toString());
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('phoneNumber', data.phoneNumber);
    
    if (data.message) {
      formData.append('message', data.message);
    }

    // Add resume file (required)
    formData.append('resume', resumeFile);

    try {
      const response = await api.post<{ success: boolean; message: string }>('/api/applications/simple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      // Enhanced error handling
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data || 'Failed to submit application';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Submit a new application with resume only (Applicant) - Keep for backward compatibility
  submitApplication: async (
    data: CreateApplicationRequest,
    resumeFile: File
  ): Promise<Application> => {
    const formData = new FormData();

    // Add form data
    formData.append('jobId', data.jobId.toString());
    if (data.coverLetter) {
      formData.append('coverLetter', data.coverLetter);
    }
    if (data.applicantNotes) {
      formData.append('applicantNotes', data.applicantNotes);
    }

    // Add skills as JSON string for FormData compatibility
    if (data.skills && data.skills.length > 0) {
      formData.append('skills', JSON.stringify(data.skills));
    }

    // Add resume file (required)
    formData.append('resume', resumeFile);

    try {
      const response = await api.post<Application>('/api/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      // Enhanced error handling
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data || 'Failed to submit application';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Update application status - supports both old and new signatures
  updateApplicationStatus: async (
    idOrData: number | UpdateApplicationRequest,
    status?: string,
    notes?: string
  ): Promise<Application> => {
    let requestData: UpdateApplicationRequest;

    if (typeof idOrData === 'number') {
      // New signature for drag and drop funnel
      requestData = {
        id: idOrData,
        status: status!,
        notes: notes || `Status updated to ${status} via application funnel`,
        recruiterNotes: notes,
      };
    } else {
      // Original signature
      requestData = idOrData;
    }

    const response = await api.put<Application>(
      `/api/applications/${requestData.id}/status`,
      requestData
    );
    return response.data;
  },

  // Get resume file for an application (Admin/Recruiter/Applicant if owns)
  getResumeFile: async (applicationId: number): Promise<Blob> => {
    const response = await api.get<Blob>(`/api/applications/${applicationId}/resume`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get application statistics for a specific job (Admin/Recruiter)
  getJobApplicationStats: async (jobId: number): Promise<ApplicationStat[]> => {
    const response = await api.get<ApplicationStat[]>(`/api/applications/stats/${jobId}`);
    return response.data;
  },

  // Get overall application statistics (Admin/Recruiter)
  getOverallApplicationStats: async (): Promise<ApplicationStat[]> => {
    const response = await api.get<ApplicationStat[]>('/api/applications/stats');
    return response.data;
  },
};

export default ApplicationService;
export { ApplicationService };
