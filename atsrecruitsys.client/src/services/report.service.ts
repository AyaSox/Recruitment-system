import * as XLSX from 'xlsx';
import api from './api';

export interface ApplicationExportData {
  applicationId: number;
  applicantName: string;
  applicantEmail: string;
  phoneNumber: string;
  jobTitle: string;
  department: string;
  applicationStatus: string;
  appliedDate: string;
  statusUpdatedDate: string;
}

export interface ReportStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  screeningApplications: number;
  interviewApplications: number;
  pendingApprovalJobs: number;
}

class ReportService {
  /**
   * Fetch all applications for export
   */
  async getApplicationsForExport(): Promise<ApplicationExportData[]> {
    try {
      console.log('?? Fetching applications for Excel report...');
      
      const response = await api.get('/api/applications', {
        params: {
          page: 0,
          pageSize: 10000
        }
      });

      console.log('?? API Response received:', response.status);
      console.log('?? Response data structure:', {
        hasData: !!response.data,
        hasDataProperty: !!response.data?.data,
        hasItems: !!response.data?.data?.items,
        itemCount: response.data?.data?.items?.length || 0
      });

      // Handle the response structure
      let applications = [];
      
      if (response.data?.data?.items) {
        applications = response.data.data.items;
      } else if (response.data?.items) {
        applications = response.data.items;
      } else if (Array.isArray(response.data?.data)) {
        applications = response.data.data;
      } else if (Array.isArray(response.data)) {
        applications = response.data;
      }

      console.log(`? Found ${applications.length} applications to process`);

      if (applications.length === 0) {
        console.warn('?? No applications found in response');
        return [];
      }

      // Process each application
      const processedApplications = applications.map((app: any, index: number) => {
        console.log(`?? Processing application ${index + 1}:`, {
          id: app.id,
          applicantName: app.applicantName,
          jobTitle: app.jobTitle,
          status: app.status
        });

        return {
          applicationId: app.id || index + 1,
          applicantName: app.applicantName || 'Unknown Applicant',
          applicantEmail: app.applicantEmail || 'No Email',
          phoneNumber: app.phoneNumber || 'No Phone',
          jobTitle: app.jobTitle || 'Unknown Position',
          department: app.jobDepartment || 'Unknown Department',
          applicationStatus: app.status || 'Unknown Status',
          appliedDate: app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'Unknown Date',
          statusUpdatedDate: app.statusUpdatedDate ? new Date(app.statusUpdatedDate).toLocaleDateString() : 'Unknown Date'
        };
      });

      console.log(`?? Successfully processed ${processedApplications.length} applications for Excel export`);
      return processedApplications;
      
    } catch (error: any) {
      console.error('? Error fetching applications:', error);
      console.error('? Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        url: error.config?.url
      });
      throw error;
    }
  }

  /**
   * Export applications to Excel with proper columns
   */
  async exportToExcel(stats: ReportStats): Promise<void> {
    try {
      console.log('?? Starting Excel export with application data...');
      
      let applications: ApplicationExportData[] = [];
      let errorMessage = '';

      try {
        applications = await this.getApplicationsForExport();
      } catch (error: any) {
        console.error('? Failed to get applications:', error);
        errorMessage = error.message;
        
        if (error.response?.status === 403) {
          errorMessage = 'Access denied. You need Admin, Recruiter, or HiringManager role to export applications.';
        } else if (error.response?.status === 401) {
          errorMessage = 'Not authenticated. Please login and try again.';
        }
      }

      // Create workbook
      const workbook = XLSX.utils.book_new();

      if (applications.length > 0) {
        console.log(`?? Creating Excel sheet with ${applications.length} applications...`);
        
        // Create the data for Excel with proper column headers (removed Cover Letter & Skills)
        const excelData = applications.map(app => ({
          'Application ID': app.applicationId,
          'Applicant Name': app.applicantName,
          'Email Address': app.applicantEmail,
          'Phone Number': app.phoneNumber,
          'Job Title': app.jobTitle,
          'Department': app.department,
          'Status': app.applicationStatus,
          'Applied Date': app.appliedDate,
          'Status Updated': app.statusUpdatedDate
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        
        // Set column widths for better readability (removed Cover Letter & Skills columns)
        worksheet['!cols'] = [
          { wch: 12 },  // Application ID
          { wch: 25 },  // Applicant Name  
          { wch: 30 },  // Email Address
          { wch: 15 },  // Phone Number
          { wch: 30 },  // Job Title
          { wch: 20 },  // Department
          { wch: 15 },  // Status
          { wch: 15 },  // Applied Date
          { wch: 15 }   // Status Updated
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
        console.log('? Excel sheet created successfully with application data');
        
      } else {
        console.log('?? No applications found, creating info sheet...');
        
        // Create info sheet explaining the issue
        const infoData = [
          ['Applications Export Report'],
          ['Generated:', new Date().toLocaleString()],
          [''],
          ['No Application Data Available'],
          [''],
          ['Dashboard shows:', `${stats.totalApplications} applications`],
          ['But detailed data could not be retrieved'],
          [''],
          ['Possible Reason:', errorMessage || 'Unknown error occurred'],
          [''],
          ['What to do:'],
          ['1. Make sure you are logged in as Admin or Recruiter'],
          ['2. Check that applications exist in the system'],
          ['3. Try refreshing the page and exporting again'],
          ['4. Contact system administrator if problem persists']
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(infoData);
        worksheet['!cols'] = [{ wch: 30 }, { wch: 40 }];
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Export Info');
      }

      // Download the file
      const fileName = `Applications_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      console.log(`?? Downloading: ${fileName}`);
      XLSX.writeFile(workbook, fileName);
      console.log('?? Excel export completed successfully!');
      
    } catch (error: any) {
      console.error('? Excel export failed:', error);
      throw new Error(`Failed to export Excel: ${error.message}`);
    }
  }
}

export default new ReportService();
