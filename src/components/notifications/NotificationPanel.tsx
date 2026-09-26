import type { Notification, NotificationType } from '@/types/notification';
import { NOTIFICATION_META } from '@/types/notification';

interface NotificationPanelProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkAsRead: (id: number) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onClose: () => void;
}

/** وقت نسبي بالعربية */
function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

export default function NotificationPanel({
  notifications,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClose,
}: NotificationPanelProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div
      id="notification-panel"
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        left: 0,
        width: '360px',
        maxHeight: '480px',
        background: '#ffffff',
        backdropFilter: 'blur(20px)',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        zIndex: 9999,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: 'panel-slide-in 0.2s ease-out',
        direction: 'rtl',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 18px 12px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔔</span>
          <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '15px' }}>
            الإشعارات
          </span>
          {unreadCount > 0 && (
            <span
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '1px 7px',
                borderRadius: '20px',
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {unreadCount > 0 && (
            <button
              id="mark-all-read-btn"
              onClick={onMarkAllAsRead}
              style={{
                background: 'none',
                border: '1px solid #e2e8f0',
                color: '#475569',
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#475569';
              }}
            >
              تحديد الكل كمقروء
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: 1,
              padding: '2px 4px',
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {isLoading && (
          <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
            ⏳ جاري التحميل...
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#64748b',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '36px', opacity: 0.4 }}>🔕</span>
            <p style={{ margin: 0, fontSize: '14px' }}>لا توجد إشعارات</p>
          </div>
        )}

        {!isLoading && notifications.map((n) => {
          const meta = NOTIFICATION_META[n.type as NotificationType] ?? NOTIFICATION_META.General;
          return (
            <div
              key={n.notificationID}
              id={`notification-item-${n.notificationID}`}
              style={{
                padding: '12px 18px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                background: n.isRead ? 'transparent' : 'rgba(220, 38, 38, 0.04)',
                cursor: n.isRead ? 'default' : 'pointer',
                transition: 'background 0.2s',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f8fafc';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = n.isRead
                  ? 'transparent'
                  : 'rgba(220, 38, 38, 0.04)';
              }}
              onClick={() => !n.isRead && onMarkAsRead(n.notificationID)}
            >
              {/* مؤشر غير مقروء */}
              {!n.isRead && (
                <span
                  style={{
                    position: 'absolute',
                    right: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#dc2626',
                    flexShrink: 0,
                  }}
                />
              )}

              {/* أيقونة */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                {meta.icon}
              </div>

              {/* محتوى الإشعار */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: n.isRead ? '#64748b' : '#0f172a',
                    fontWeight: n.isRead ? 400 : 600,
                    fontSize: '13px',
                    marginBottom: '3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {n.title}
                </div>
                <div
                  style={{
                    color: '#475569',
                    fontSize: '12px',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {n.message}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>
                  {relativeTime(n.createdAt)}
                </div>
              </div>

              {/* زر الحذف */}
              <button
                id={`delete-notification-${n.notificationID}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(n.notificationID);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '15px',
                  padding: '2px',
                  opacity: 0,
                  transition: 'opacity 0.2s, color 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                className="delete-notification-btn"
                aria-label="حذف الإشعار"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes panel-slide-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        #notification-panel > div > div:hover .delete-notification-btn {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
