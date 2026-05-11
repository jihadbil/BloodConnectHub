// Donors API endpoints
import { apiClient } from './client';
import type {
  ServiceResponse,
  PagedResult,
  Donor,
  DonorWithDonations,
  CreateDonorRequest,
  UpdateDonorRequest,
} from '@/types/api';

export const donorsApi = {
  /**
   * جلب قائمة المتبرعين مع التقسيم للصفحات
   */
  getAll: async (page = 1, pageSize = 10): Promise<ServiceResponse<PagedResult<Donor>>> => {
    return apiClient.get<PagedResult<Donor>>(`/donors?pageNumber=${page}&pageSize=${pageSize}`);
  },

  /**
   * جلب تفاصيل متبرع محدد
   */
  getById: async (id: number): Promise<ServiceResponse<Donor>> => {
    return apiClient.get<Donor>(`/donors/${id}`);
  },

  /**
   * جلب معلومات المتبرع بناءً على معرف المستخدم
   */
  getDonorByUserId: async (userId: number): Promise<ServiceResponse<Donor>> => {
    return apiClient.get<Donor>(`/donors/user/${userId}`);
  },

  /**
   * البحث عن متبرع بالرقم الوطني
   */
  getByNationalId: async (nationalId: string): Promise<ServiceResponse<Donor>> => {
    return apiClient.get<Donor>(`/donors/national/${nationalId}`);
  },

  /**
   * جلب المتبرعين المؤهلين للتبرع
   */
  getEligible: async (bloodTypeId?: number): Promise<ServiceResponse<Donor[]>> => {
    const query = bloodTypeId ? `?bloodTypeId=${bloodTypeId}` : '';
    return apiClient.get<Donor[]>(`/donors/eligible${query}`);
  },

  /**
   * فحص أهلية متبرع للتبرع
   */
  checkEligibility: async (id: number): Promise<ServiceResponse<boolean>> => {
    return apiClient.get<boolean>(`/donors/${id}/check-eligibility`);
  },

  /**
   * جلب تبرعات متبرع محدد
   */
  getDonations: async (id: number): Promise<ServiceResponse<DonorWithDonations>> => {
    return apiClient.get<DonorWithDonations>(`/donors/${id}/donations`);
  },

  /**
   * إضافة متبرع جديد
   */
  create: async (data: CreateDonorRequest): Promise<ServiceResponse<Donor>> => {
    return apiClient.post<Donor>('/donors', data);
  },

  /**
   * تحديث بيانات متبرع
   */
  update: async (id: number, data: UpdateDonorRequest): Promise<ServiceResponse<Donor>> => {
    return apiClient.put<Donor>(`/donors/${id}`, data);
  },

  /**
   * حذف متبرع
   */
  delete: async (id: number): Promise<ServiceResponse<boolean>> => {
    return apiClient.delete<boolean>(`/donors/${id}`);
  },
};
