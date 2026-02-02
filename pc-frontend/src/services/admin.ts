import request from './request';

export const adminApi = {
  // Admin: Audit Action
  auditHotel: (id: string, action: 'approve' | 'reject' | 'offline', reason?: string) =>
    request.post(`/admin/audit/hotel/${id}`, { action, reason }),

  // Admin: Get Audit Logs
  getAuditLogs: (params: any) => request.get('/admin/audit-logs', { params }),
};
