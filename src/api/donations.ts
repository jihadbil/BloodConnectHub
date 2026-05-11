// Donations API endpoints
import { apiClient } from './client';
import type {
  ServiceResponse,
  PagedResult,
  Donation,
  CreateDonationRequest,
  UpdateTestResultRequest,
} from '@/types/api';

export const donationsApi = {
  /**
   * جلب قائمة التبرعات مع التقسيم للصفحات
   */
  getAll: async (page = 1, pageSize = 10): Promise<ServiceResponse<PagedResult<Donation>>> => {
    return apiClient.get<PagedResult<Donation>>(`/donations?pageNumber=${page}&pageSize=${pageSize}`);
  },

  /**
   * جلب تفاصيل تبرع محدد
   */
  getById: async (id: number): Promise<ServiceResponse<Donation>> => {
    return apiClient.get<Donation>(`/donations/${id}`);
  },

  /**
   * جلب التبرعات المقبولة (معتمدة للاستخدام)
   */
  getApproved: async (): Promise<ServiceResponse<Donation[]>> => {
    return apiClient.get<Donation[]>('/donations/approved');
  },

  /**
   * تسجيل تبرع جديد
   */
  create: async (data: CreateDonationRequest): Promise<ServiceResponse<Donation>> => {
    return apiClient.post<Donation>('/donations', data);
  },

  /**
   * تحديث نتيجة فحص تبرع
   */
  updateTestResult: async (
    id: number,
    data: UpdateTestResultRequest
  ): Promise<ServiceResponse<Donation>> => {
    return apiClient.put<Donation>(`/donations/${id}/test-result`, data);
  },

  /**
   * حذف تبرع
   */
  delete: async (id: number): Promise<ServiceResponse<boolean>> => {
    return apiClient.delete<boolean>(`/donations/${id}`);
  },
};
