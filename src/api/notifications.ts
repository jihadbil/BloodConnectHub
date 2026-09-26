import { apiClient } from './client';
import type { ServiceResponse } from '@/types/api';
import type { Notification } from '@/types/notification';

const BASE = '/notifications';

export const notificationsApi = {
  /** جلب إشعاراتي (آخر 30 يوم) */
  getMyNotifications: (unreadOnly = false) =>
    apiClient.get<Notification[]>(
      `${BASE}${unreadOnly ? '?unreadOnly=true' : ''}`
    ),

  /** عدد الإشعارات غير المقروءة */
  getUnreadCount: () =>
    apiClient.get<number>(`${BASE}/unread-count`),

  /** تحديد إشعار واحد كمقروء */
  markAsRead: (id: number) =>
    apiClient.patch<boolean>(`${BASE}/${id}/read`),

  /** تحديد جميع الإشعارات كمقروءة */
  markAllAsRead: () =>
    apiClient.patch<boolean>(`${BASE}/mark-all-read`),

  /** حذف إشعار */
  deleteNotification: (id: number) =>
    apiClient.delete<boolean>(`${BASE}/${id}`),
};
