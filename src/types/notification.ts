// Notification Types for BloodConnect

export type NotificationType =
  | 'NewBloodRequest'
  | 'NewDonorResponse'
  | 'ResponseStatusUpdated'
  | 'BloodRequestStatusChanged'
  | 'NewMedicalDocument'
  | 'LowBloodInventory'
  | 'General';

export interface Notification {
  notificationID: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedEntityType?: string | null;
  relatedEntityId?: number | null;
  createdAt: string;
  readAt?: string | null;
}

/** أيقونة وألوان لكل نوع إشعار */
export const NOTIFICATION_META: Record<
  NotificationType,
  { icon: string; colorClass: string; label: string }
> = {
  NewBloodRequest:          { icon: '🩸', colorClass: 'text-red-400',    label: 'طلب دم جديد' },
  NewDonorResponse:         { icon: '✋', colorClass: 'text-blue-400',   label: 'استجابة متبرع' },
  ResponseStatusUpdated:    { icon: '🔄', colorClass: 'text-amber-400',  label: 'تحديث حالة' },
  BloodRequestStatusChanged:{ icon: '📋', colorClass: 'text-purple-400', label: 'تغيُّر حالة طلب' },
  NewMedicalDocument:       { icon: '📄', colorClass: 'text-green-400',  label: 'وثيقة طبية' },
  LowBloodInventory:        { icon: '⚠️', colorClass: 'text-orange-400', label: 'مخزون منخفض' },
  General:                  { icon: '🔔', colorClass: 'text-gray-400',   label: 'إشعار عام' },
};
