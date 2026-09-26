import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationPanel from './NotificationPanel';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount, notifications, markAsRead, markAllAsRead, deleteNotification, isLoading } =
    useNotifications();
  const containerRef = useRef<HTMLDivElement>(null);

  // إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="notification-bell-container" style={{ position: 'relative' }}>
      {/* زر الجرس */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(prev => !prev)}
        className="notification-bell-btn"
        aria-label={`الإشعارات${unreadCount > 0 ? ` — ${unreadCount} غير مقروء` : ''}`}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
          color: 'inherit',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
      >
        {/* أيقونة الجرس */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            animation: unreadCount > 0 ? 'bell-ring 1s ease-in-out' : 'none',
          }}
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Badge عدد الإشعارات */}
        {unreadCount > 0 && (
          <span
            id="notification-badge"
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              background: '#ef4444',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              minWidth: '17px',
              height: '17px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 3px',
              lineHeight: 1,
              boxShadow: '0 0 0 2px rgba(0,0,0,0.3)',
              animation: 'badge-pulse 2s ease-in-out infinite',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel الإشعارات */}
      {isOpen && (
        <NotificationPanel
          notifications={notifications}
          isLoading={isLoading}
          onMarkAsRead={async (id) => {
            await markAsRead(id);
          }}
          onMarkAllAsRead={async () => {
            await markAllAsRead();
          }}
          onDelete={async (id) => {
            await deleteNotification(id);
          }}
          onClose={() => setIsOpen(false)}
        />
      )}

      <style>{`
        @keyframes bell-ring {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-8deg); }
          20%, 40%, 60%, 80% { transform: rotate(8deg); }
        }
        @keyframes badge-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
