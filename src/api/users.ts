// Users API endpoints
import { apiClient } from './client';
import type {
  ServiceResponse,
  PagedResult,
  ApiUser,
  UpdateApplicationUserDto,
} from '@/types/api';

export const usersApi = {
  /**
   * جلب قائمة المستخدمين
   */
  getAll: async (
    page = 1,
    pageSize = 10,
    searchTerm?: string
  ): Promise<ServiceResponse<PagedResult<ApiUser>>> => {
    let url = `/Users?pageNumber=${page}&pageSize=${pageSize}`;
    if (searchTerm) url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    return apiClient.get<PagedResult<ApiUser>>(url);
  },

  /**
   * جلب تفاصيل مستخدم محدد
   */
  getById: async (id: string): Promise<ServiceResponse<ApiUser>> => {
    return apiClient.get<ApiUser>(`/Users/${id}`);
  },

  /**
   * تحديث بيانات مستخدم
   */
  update: async (id: string, data: UpdateApplicationUserDto): Promise<ServiceResponse<ApiUser>> => {
    return apiClient.put<ApiUser>(`/Users/${id}`, data);
  },

  /**
   * حذف مستخدم
   */
  delete: async (id: string): Promise<ServiceResponse<boolean>> => {
    return apiClient.delete<boolean>(`/Users/${id}`);
  },

  /**
   * جلب أدوار مستخدم محدد
   */
  getRoles: async (id: string): Promise<ServiceResponse<string[]>> => {
    return apiClient.get<string[]>(`/Users/${id}/roles`);
  },

  /**
   * تفعيل/تعطيل حساب مستخدم
   */
  toggleActive: async (id: string): Promise<ServiceResponse<boolean>> => {
    return apiClient.patch<boolean>(`/Users/${id}/toggle-active`);
  },

  /**
   * تعيين دور لمستخدم
   */
  assignRole: async (userId: string, roleName: string): Promise<ServiceResponse<boolean>> => {
    return apiClient.post<boolean>(`/Users/${userId}/assign-role`, { roleName });
  },

  /**
   * إزالة دور من مستخدم
   */
  removeRole: async (userId: string, roleName: string): Promise<ServiceResponse<boolean>> => {
    return apiClient.delete<boolean>(`/Users/${userId}/roles/${encodeURIComponent(roleName)}`);
  },

  /**
   * جلب معلومات المستخدم مع بيانات متبرعه
   */
  getWithDonor: async (id: string): Promise<ServiceResponse<ApiUser>> => {
    return apiClient.get<ApiUser>(`/Users/${id}/with-donor`);
  },
};
