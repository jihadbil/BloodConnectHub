// Donation Lab Reports API endpoints
import { apiClient, getApiBaseUrl } from './client';
import type { ServiceResponse, DonationLabReportDto } from '@/types/api';

export const donationLabReportsApi = {
  /**
   * رفع تقرير تحليل مخبري جديد لتبرع معين
   */
  upload: async (
    donationId: number,
    reportType: string,
    file: File,
    notes?: string
  ): Promise<ServiceResponse<DonationLabReportDto>> => {
    const formData = new FormData();
    formData.append('reportType', reportType);
    if (notes) {
      formData.append('notes', notes);
    }
    formData.append('file', file);

    return apiClient.postFormData<DonationLabReportDto>(
      `/donations/${donationId}/lab-reports`,
      formData
    );
  },

  /**
   * جلب جميع تقارير التحاليل المخبرية لتبرع معين
   */
  getByDonationId: async (
    donationId: number
  ): Promise<ServiceResponse<DonationLabReportDto[]>> => {
    return apiClient.get<DonationLabReportDto[]>(`/donations/${donationId}/lab-reports`);
  },

  /**
   * جلب تفاصيل تقرير تحليل مخبري محدد بـ ID
   */
  getById: async (
    reportId: number
  ): Promise<ServiceResponse<DonationLabReportDto>> => {
    return apiClient.get<DonationLabReportDto>(`/lab-reports/${reportId}`);
  },

  /**
   * حذف تقرير تحليل مخبري وملفه من السيرفر
   */
  delete: async (reportId: number): Promise<ServiceResponse<boolean>> => {
    return apiClient.delete<boolean>(`/lab-reports/${reportId}`);
  },

  /**
   * فتح ملف تقرير التحليل بشكل آمن عبر JWT كـ Blob
   * يمنع الوصول غير المصرح به ويعرض الملف مباشرة في المتصفح أو يبدأ التحميل
   */
  openFileSecurely: async (filePath: string, token: string | null): Promise<void> => {
    // بناء URL كامل من filePath (المسار النسبي من wwwroot)
    const base = getApiBaseUrl().replace(/\/api\/?$/, '');
    const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    // تحويل مسار Windows إلى URL (استبدال \ بـ /)
    const urlPath = cleanPath.replace(/\\/g, '/');
    const fileUrl = `${base}${urlPath}`;

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fileUrl, { headers });
    if (!response.ok) {
      throw new Error(`فشل تحميل الملف: ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, '_blank');
    
    // تنظيف الـ blob URL بعد فتح الملف
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    
    if (!win) {
      // إذا حجب المتصفح الـ popup، نزل الملف مباشرة
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filePath.split('/').pop() || 'lab_report';
      a.click();
    }
  },
};
