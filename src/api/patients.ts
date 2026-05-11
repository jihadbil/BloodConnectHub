// Patients API endpoints
import { apiClient } from './client';
import type {
  ServiceResponse,
  PagedResult,
  Patient,
  PatientWithRequests,
  CreatePatientRequest,
  UpdatePatientRequest,
} from '@/types/api';

export const patientsApi = {
  /**
   * جلب قائمة المرضى مع التقسيم للصفحات
   */
  getAll: async (page = 1, pageSize = 10): Promise<ServiceResponse<PagedResult<Patient>>> => {
    return apiClient.get<PagedResult<Patient>>(`/patients?pageNumber=${page}&pageSize=${pageSize}`);
  },

  /**
   * جلب تفاصيل مريض محدد
   */
  getById: async (id: number): Promise<ServiceResponse<Patient>> => {
    return apiClient.get<Patient>(`/patients/${id}`);
  },

  /**
   * البحث عن مريض بالرقم الوطني
   */
  getByNationalId: async (nationalId: string): Promise<ServiceResponse<Patient>> => {
    return apiClient.get<Patient>(`/patients/national/${nationalId}`);
  },

  /**
   * جلب طلبات الدم لمريض محدد
   */
  getRequests: async (id: number): Promise<ServiceResponse<PatientWithRequests>> => {
    return apiClient.get<PatientWithRequests>(`/patients/${id}/requests`);
  },

  /**
   * إضافة مريض جديد
   */
  create: async (data: CreatePatientRequest): Promise<ServiceResponse<Patient>> => {
    return apiClient.post<Patient>('/patients', data);
  },

  /**
   * تحديث بيانات مريض
   */
  update: async (id: number, data: UpdatePatientRequest): Promise<ServiceResponse<Patient>> => {
    return apiClient.put<Patient>(`/patients/${id}`, data);
  },

  /**
   * حذف مريض
   */
  delete: async (id: number): Promise<ServiceResponse<boolean>> => {
    return apiClient.delete<boolean>(`/patients/${id}`);
  },
};
