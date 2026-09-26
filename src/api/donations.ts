// Donations API endpoints
import { apiClient } from './client';
import type {
  ServiceResponse,
  PagedResult,
  Donation,
  CreateDonationRequest,
  UpdateTestResultRequest,
  LabTestDonationDto,
} from '@/types/api';

export const donationsApi = {
  /**
   * جلب قائمة التبرعات مع التقسيم للصفحات
   */
  getAll: async (
    page = 1,
    pageSize = 10,
    searchTerm?: string,
    sortBy?: string
  ): Promise<ServiceResponse<PagedResult<Donation>>> => {
    let url = `/Donations?pageNumber=${page}&pageSize=${pageSize}`;
    if (searchTerm) url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    if (sortBy) url += `&sortBy=${encodeURIComponent(sortBy)}`;
    return apiClient.get<PagedResult<Donation>>(url);
  },

  /**
   * جلب تفاصيل تبرع محدد
   */
  getById: async (id: number): Promise<ServiceResponse<Donation>> => {
    return apiClient.get<Donation>(`/Donations/${id}`);
  },

  /**
   * جلب تبرعات متبرع
   */
  getByDonor: async (donorId: number): Promise<ServiceResponse<Donation[]>> => {
    return apiClient.get<Donation[]>(`/Donations/donor/${donorId}`);
  },

  /**
   * التبرعات الأخيرة
   */
  getRecent: async (days?: number): Promise<ServiceResponse<Donation[]>> => {
    const query = days ? `?days=${days}` : '';
    return apiClient.get<Donation[]>(`/Donations/recent${query}`);
  },

  /**
   * تسجيل تبرع جديد
   */
  create: async (data: CreateDonationRequest): Promise<ServiceResponse<Donation>> => {
    return apiClient.post<Donation>('/Donations', data);
  },

  /**
   * إجراء فحص مخبري
   */
  performLabTest: async (id: number, data: LabTestDonationDto): Promise<ServiceResponse<Donation>> => {
    return apiClient.post<Donation>(`/Donations/${id}/lab-test`, data);
  },

  /**
   * تحديث نتيجة فحص تبرع
   */
  updateTestResult: async (
    id: number,
    data: UpdateTestResultRequest
  ): Promise<ServiceResponse<Donation>> => {
    return apiClient.put<Donation>(`/Donations/${id}/test-result`, data);
  },

  /**
   * حذف تبرع
   */
  delete: async (id: number): Promise<ServiceResponse<boolean>> => {
    return apiClient.delete<boolean>(`/Donations/${id}`);
  },
};
