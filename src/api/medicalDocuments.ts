// Medical Documents API endpoints
import { apiClient, getApiBaseUrl } from './client';
import type {
  ServiceResponse,
  MedicalDocument,
  VerifyMedicalDocumentDto,
} from '@/types/api';

export const medicalDocumentsApi = {
  /**
   * رفع وثيقة طبية جديدة
   */
  upload: async (
    donorId: number,
    documentType: string,
    file: File
  ): Promise<ServiceResponse<MedicalDocument>> => {
    const formData = new FormData();
    // API يتوقع donorID بالـ PascalCase
    formData.append('donorID', donorId.toString());
    formData.append('documentType', documentType);
    formData.append('file', file);

    return apiClient.postFormData<MedicalDocument>('/medical-documents', formData);
  },

  /**
   * جلب وثائق متبرع محدد — المسار الموثق في newapi.json
   */
  getByDonor: async (donorId: number): Promise<ServiceResponse<MedicalDocument[]>> => {
    return apiClient.get<MedicalDocument[]>(`/Donors/${donorId}/medical-documents`);
  },

  /**
   * جلب تفاصيل وثيقة محددة
   */
  getById: async (id: number): Promise<ServiceResponse<MedicalDocument>> => {
    return apiClient.get<MedicalDocument>(`/medical-documents/${id}`);
  },

  /**
   * حذف وثيقة طبية
   */
  delete: async (id: number): Promise<ServiceResponse<boolean>> => {
    return apiClient.delete<boolean>(`/medical-documents/${id}`);
  },

  /**
   * التحقق من وثيقة طبية
   */
  verify: async (
    id: number,
    data: VerifyMedicalDocumentDto
  ): Promise<ServiceResponse<boolean>> => {
    return apiClient.patch<boolean>(`/medical-documents/${id}/verify`, data);
  },

  /**
   * فتح ملف الوثيقة بشكل آمن عبر JWT كـ Blob
   * يستخدم filePath المحفوظ في قاعدة البيانات لبناء URL مباشر للملف
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
      a.download = filePath.split('/').pop() || 'document';
      a.click();
    }
  },
};
