import api from './api';
import type { 
  DashboardStats, 
  JobApplicationCount,
  DepartmentAnalytics,
  EmploymentTypeStats,
  ExperienceLevelStats,
  ApplicationStatusDistribution
} from '../types/dashboard';

const DashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/dashboard/stats');
    return response.data;
  },

  getJobApplicationStats: async (): Promise<JobApplicationCount[]> => {
    const response = await api.get('/api/dashboard/jobs');
    return response.data;
  },

  getDepartmentAnalytics: async (): Promise<DepartmentAnalytics> => {
    const response = await api.get('/api/dashboard/department-analytics');
    return response.data;
  },

  getEmploymentTypeStats: async (): Promise<EmploymentTypeStats[]> => {
    const response = await api.get('/api/dashboard/employment-type-stats');
    return response.data;
  },

  getExperienceLevelStats: async (): Promise<ExperienceLevelStats[]> => {
    const response = await api.get('/api/dashboard/experience-level-stats');
    return response.data;
  },

  getApplicationStatusDistribution: async (): Promise<ApplicationStatusDistribution> => {
    const response = await api.get('/api/dashboard/application-distribution');
    return response.data;
  },
};

export default DashboardService;
export { DashboardService };
