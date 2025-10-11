// Dashboard types
export interface JobApplicationCount {
  jobId: number;
  jobTitle: string;
  department: string;
  applicationCount: number;
  postedDate: string;
  closingDate: string;
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  screeningApplications: number;
  interviewApplications: number;
  pendingApprovalJobs: number;
}

// New types for analytics
export interface DepartmentStats {
  department: string;
  jobCount: number;
  applicationCount: number;
  activeJobs: number;
  averageApplicationsPerJob: number;
}

export interface DepartmentAnalytics {
  departments: DepartmentStats[];
}

export interface EmploymentTypeStats {
  employmentType: string;
  count: number;
}

export interface ExperienceLevelStats {
  experienceLevel: string;
  count: number;
}

export interface ApplicationStatusCount {
  status: string;
  count: number;
}

export interface ApplicationStatusDistribution {
  statusCounts: ApplicationStatusCount[];
}
