import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationsApi } from '@/api/notifications';
import type { Notification } from '@/types/notification';

const POLL_INTERVAL_MS = 30_000; // 30 ثانية

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [isLoading, setIsLoading]         = useState(false);
  const intervalRef                        = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── جلب الإشعارات وعدد غير المقروء ─────────────────────────────────────

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationsApi.getMyNotifications();
      if (res.isSuccess && res.data) {
        setNotifications(res.data);
      }
    } catch {
      // صمت — لا نُعطل الواجهة بسبب فشل polling
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationsApi.getUnreadCount();
      if (res.isSuccess && res.data !== null) {
        setUnreadCount(res.data);
      }
    } catch {
      // صمت
    }
  }, []);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
    setIsLoading(false);
  }, [fetchNotifications, fetchUnreadCount]);

  // ─── تشغيل Polling ────────────────────────────────────────────────────────

  useEffect(() => {
    // جلب فوري عند الحمل
    refetch();

    // Polling كل 30 ثانية (عدد غير المقروء فقط لتوفير الحمل)
    intervalRef.current = setInterval(() => {
      fetchUnreadCount();
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refetch, fetchUnreadCount]);

  // ─── الأفعال ──────────────────────────────────────────────────────────────

  const markAsRead = useCallback(async (id: number) => {
    const res = await notificationsApi.markAsRead(id);
    if (res.isSuccess) {
      setNotifications(prev =>
        prev.map(n =>
          n.notificationID === id
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const res = await notificationsApi.markAllAsRead();
    if (res.isSuccess) {
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    }
  }, []);

  const deleteNotification = useCallback(async (id: number) => {
    const target = notifications.find(n => n.notificationID === id);
    const res = await notificationsApi.deleteNotification(id);
    if (res.isSuccess) {
      setNotifications(prev => prev.filter(n => n.notificationID !== id));
      if (target && !target.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
  };
}
