// Donors API endpoints
import { apiClient } from './client';
import type {
  ServiceResponse,
  PagedResult,
  Donor,
  DonorWithDonations,
  CreateDonorRequest,
  UpdateDonorRequest,
  ApproveDonorDto,
  DonorApprovalStatus,
  MedicalDocument,
} from '@/types/api';

export const donorsApi = {
  /**
   * جلب قائمة المتبرعين مع التقسيم للصفحات
   */
  getAll: async (
    page = 1,
    pageSize = 10,
    searchTerm?: string,
    sortBy?: string,
    sortDescending?: boolean
  ): Promise<ServiceResponse<PagedResult<Donor>>> => {
    let url = `/Donors?pageNumber=${page}&pageSize=${pageSize}`;
    if (searchTerm) url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    if (sortBy) url += `&sortBy=${encodeURIComponent(sortBy)}`;
    if (sortDescending !== undefined) url += `&sortDescending=${sortDescending}`;
    return apiClient.get<PagedResult<Donor>>(url);
  },

  /**
   * جلب تفاصيل متبرع محدد
   */
  getById: async (id: number): Promise<ServiceResponse<Donor>> => {
    return apiClient.get<Donor>(`/Donors/${id}`);
  },

  /**
   * البحث عن متبرع بالرقم الوطني
   */
  getByNationalId: async (nationalId: string): Promise<ServiceResponse<Donor>> => {
    return apiClient.get<Donor>(`/Donors/national/${encodeURIComponent(nationalId)}`);
  },

  /**
   * جلب المتبرعين المؤهلين للتبرع
   */
  getEligible: async (bloodTypeId?: number): Promise<ServiceResponse<Donor[]>> => {
    const query = bloodTypeId ? `?bloodTypeId=${bloodTypeId}` : '';
    return apiClient.get<Donor[]>(`/Donors/eligible${query}`);
  },

  /**
   * فحص أهلية متبرع للتبرع
   */
  checkEligibility: async (id: number): Promise<ServiceResponse<boolean>> => {
    return apiClient.get<boolean>(`/Donors/${id}/check-eligibility`);
  },

  /**
   * جلب تبرعات متبرع محدد
   */
  getDonations: async (id: number): Promise<ServiceResponse<DonorWithDonations>> => {
    return apiClient.get<DonorWithDonations>(`/Donors/${id}/donations`);
  },

  /**
   * إضافة متبرع جديد
   */
  create: async (data: CreateDonorRequest): Promise<ServiceResponse<Donor>> => {
    return apiClient.post<Donor>('/Donors', data);
  },

  /**
   * تحديث بيانات متبرع
   */
  update: async (id: number, data: UpdateDonorRequest): Promise<ServiceResponse<Donor>> => {
    return apiClient.put<Donor>(`/Donors/${id}`, data);
  },

  /**
   * حذف متبرع
   */
  delete: async (id: number): Promise<ServiceResponse<boolean>> => {
    return apiClient.delete<boolean>(`/Donors/${id}`);
  },

  /**
   * موافقة/رفض متبرع
   */
  approve: async (id: number, data: ApproveDonorDto): Promise<ServiceResponse<boolean>> => {
    return apiClient.post<boolean>(`/Donors/${id}/approve`, data);
  },

  /**
   * تصفية بحالة الموافقة
   */
  getByStatus: async (status: DonorApprovalStatus, page = 1, pageSize = 10): Promise<ServiceResponse<PagedResult<Donor>>> => {
    return apiClient.get<PagedResult<Donor>>(`/Donors/by-status/${status}?pageNumber=${page}&pageSize=${pageSize}`);
  },

  /**
   * ربط متبرع بمستخدم
   */
  linkUser: async (donorId: number, userId: string): Promise<ServiceResponse<boolean>> => {
    return apiClient.post<boolean>(`/Donors/${donorId}/link-user/${userId}`);
  },

  /**
   * جلب المتبرع عبر معرف المستخدم
   */
  getByUserId: async (userId: string): Promise<ServiceResponse<Donor>> => {
    return apiClient.get<Donor>(`/Donors/by-user/${userId}`);
  },

  /**
   * فك ربط المتبرع بالمستخدم
   */
  unlinkUser: async (donorId: number): Promise<ServiceResponse<boolean>> => {
    return apiClient.delete<boolean>(`/Donors/${donorId}/unlink-user`);
  },

  /**
   * جلب المتبرع مع بيانات المستخدم
   */
  getWithUser: async (id: number): Promise<ServiceResponse<Donor>> => {
    return apiClient.get<Donor>(`/Donors/${id}/with-user`);
  },

  /**
   * جلب الوثائق الطبية للمتبرع
   */
  getMedicalDocuments: async (id: number): Promise<ServiceResponse<MedicalDocument[]>> => {
    return apiClient.get<MedicalDocument[]>(`/Donors/${id}/medical-documents`);
  },
};
