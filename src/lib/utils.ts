import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * تحويل مستوى الاستعجال من API للعرض
 * يدعم: أحرف كبيرة/صغيرة + قيم رقمية (0=Normal, 1=Urgent, 2=Emergency)
 */
export function mapUrgencyLevel(level: string | number | undefined | null): 'critical' | 'urgent' | 'normal' {
  if (level === null || level === undefined) return 'normal';

  // دعم القيم الرقمية
  if (typeof level === 'number') {
    const numericMap: Record<number, 'critical' | 'urgent' | 'normal'> = {
      1: 'normal',
      2: 'urgent',
      3: 'critical',
    };
    return numericMap[level] ?? 'normal';
  }

  // دعم النصوص بأي حالة للأحرف
  const normalized = String(level).toLowerCase().trim();
  const map: Record<string, 'critical' | 'urgent' | 'normal'> = {
    '1': 'normal',
    '2': 'urgent',
    '3': 'critical',
    'emergency': 'critical',
    'urgent': 'urgent',
    'normal': 'normal',
    'critical': 'critical',
    'high': 'urgent',
    'low': 'normal',
    'medium': 'urgent',
  };
  return map[normalized] ?? 'normal';
}

/**
 * تنسيق الوقت المنقضي
 */
export function formatTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  return formatDate(date);
}

/**
 * تنسيق التاريخ بالعربي
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * تنسيق التاريخ والوقت
 */
export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * تحويل نتيجة الفحص للعرض
 * الـ API قد يُعيد رقماً (0=Pending, 1=Approved, 2=Rejected) أو نصاً
 */
export function mapTestResult(result: string | number | undefined | null): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  // تحويل الأرقام إلى نصوص
  const numericMap: Record<number, string> = {
    1: 'Pending',
    2: 'Accepted',
    3: 'Rejected'
  };

  let normalizedResult: string;

  if (result === null || result === undefined) {
    normalizedResult = 'Pending';
  } else if (typeof result === 'number') {
    normalizedResult = numericMap[result] || 'Pending';
  } else {
    let strVal = String(result);
    if (strVal === 'Approved') strVal = 'Accepted';
    normalizedResult = strVal;
  }

  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    'Pending': { label: 'قيد الفحص', variant: 'secondary' },
    'Accepted': { label: 'مقبول', variant: 'default' },
    'Rejected': { label: 'مرفوض', variant: 'destructive' }
  };

  return map[normalizedResult] || { label: String(result), variant: 'outline' };
}

/**
 * تحويل حالة الطلب للعرض
 */
export function mapRequestStatus(status: string): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    'Pending': { label: 'معلق', variant: 'secondary' },
    'Fulfilled': { label: 'تم التنفيذ', variant: 'default' },
    'PartiallyFulfilled': { label: 'تنفيذ جزئي', variant: 'outline' },
    'Cancelled': { label: 'ملغي', variant: 'destructive' }
  };
  return map[status] || { label: status, variant: 'outline' };
}

/**
 * تحويل الجنس للعرض
 */
export function mapGender(gender: string): string {
  return gender === 'Male' ? 'ذكر' : 'أنثى';
}
