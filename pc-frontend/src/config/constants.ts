import type { TagProps } from 'antd';

// 酒店状态映射 (对应后端 Hotel Model Status)
export const HOTEL_STATUS_MAP: Record<string, { text: string; color: TagProps['color'] }> = {
  draft: { text: '草稿', color: 'default' },
  pending: { text: '待审核', color: 'processing' }, // Blue
  approved: { text: '已发布', color: 'success' },   // Green
  rejected: { text: '已驳回', color: 'error' },     // Red
  offline: { text: '已下架', color: 'warning' },    // Orange
};

// 审核动作映射
export const AUDIT_ACTIONS = {
  APPROVE: 'approve',
  REJECT: 'reject',
  OFFLINE: 'offline',
};