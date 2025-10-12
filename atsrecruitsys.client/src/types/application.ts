// Application types - Simplified for external candidate applications

export interface ApplicantSkill {
  skillId: number;
  skillName: string;
  level: string;
  yearsOfExperience: number;
}

export interface ApplicationStatusHistory {
  id: number;
  status: string;
  changedDate: string;
  changedByName: string;
  notes?: string;
}

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  jobDepartment: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  appliedDate: string;
  applicationDate?: string; // Alias for appliedDate for compatibility
  status: string;
  coverLetter?: string;
  applicantNotes?: string;
  recruiterNotes?: string;
  statusHistory?: ApplicationStatusHistory[]; // Optional as backend may not return it
  // Additional fields for funnel
  email?: string; // Alias for applicantEmail
  location?: string;
  phoneNumber?: string;
  department?: string; // Alias for jobDepartment
}

// Type alias for compatibility
export type JobApplication = Application;

export interface MyApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  companyDepartment: string;
  appliedDate: string;
  status: string;
  statusHistory: ApplicationStatusHistory[];
}

// Simplified application request for external candidates
export interface SimpleApplicationRequest {
  jobId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message?: string; // Cover letter or message
}

// Keep original for backward compatibility
export interface CreateApplicationRequest {
  jobId: number;
  coverLetter?: string;
  applicantNotes?: string;
  skills?: ApplicantSkill[];
}

export interface UpdateApplicationRequest {
  id: number;
  status: string;
  recruiterNotes?: string;
  notes?: string; // Alias for recruiterNotes
}

export interface ApplicationFilters {
  jobId?: number;
  status?: string;
  searchTerm?: string;
}

export interface ApplicationsResponse {
  items: Application[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface ApplicationStat {
  status: string;
  count: number;
}
