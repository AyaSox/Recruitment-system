import api from './api';

export interface AuditLogEntry {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues: string;
  newValues: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: string;
}

export interface AuditLogFilters {
  entityType?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface AuditStats {
  totalLogs: number;
  logsLast24Hours: number;
  logsLastWeek: number;
}

class AuditService {
  async getAuditLogs(
    page: number = 0,
    pageSize: number = 20,
    filters?: AuditLogFilters
  ): Promise<{
    items: AuditLogEntry[];
    totalCount: number;
    pageIndex: number;
    pageSize: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (filters?.entityType) {
      params.append('entityType', filters.entityType);
    }
    if (filters?.userId) {
      params.append('userId', filters.userId);
    }
    if (filters?.fromDate) {
      params.append('fromDate', filters.fromDate);
    }
    if (filters?.toDate) {
      params.append('toDate', filters.toDate);
    }

    const response = await api.get(`/api/audit?${params}`);
    
    // Handle direct response (not wrapped in Result)
    return response.data;
  }

  async getAuditStats(): Promise<AuditStats> {
    const response = await api.get('/api/audit/stats');
    
    // Handle direct response (not wrapped in Result)
    return response.data;
  }

  formatAction(action: string): string {
    const actionMap: { [key: string]: string } = {
      'Create': 'Created',
      'Update': 'Updated',
      'Delete': 'Deleted',
      'Login': 'Login',
      'Logout': 'Logout',
      'Export': 'Export',
      'StatusChange': 'Status Change',
      'Approve': 'Approved',
      'Reject': 'Rejected',
      'Publish': 'Published',
      'Archive': 'Archived'
    };
    
    return actionMap[action] || action;
  }

  formatEntityType(entityType: string): string {
    const entityMap: { [key: string]: string } = {
      'User': 'User',
      'Job': 'Job',
      'Application': 'Application',
      'Report': 'Report'
    };
    
    return entityMap[entityType] || entityType;
  }

  parseJsonSafely(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  }
}

export default new AuditService();