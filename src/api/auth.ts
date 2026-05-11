// Authentication API endpoints
import { apiClient } from './client';
import type {
  ServiceResponse,
  ApiUser,
  LoginRequest,
  RegisterRequest,
  RegisterDonorRequest,
  RegisterDonorResponse,
  ChangePasswordRequest,
} from '@/types/api';

export const authApi = {
  /**
   * تسجيل الدخول
   */
  login: async (credentials: LoginRequest): Promise<ServiceResponse<ApiUser>> => {
    return apiClient.post<ApiUser>('/auth/login', credentials);
  },

  /**
   * إنشاء حساب جديد
   */
  register: async (data: RegisterRequest): Promise<ServiceResponse<ApiUser>> => {
    return apiClient.post<ApiUser>('/auth/register', data);
  },

  /**
   * التحقق من توفر اسم المستخدم
   * Check if username already exists
   */
  checkUsernameExists: async (username: string): Promise<ServiceResponse<boolean>> => {
    return apiClient.get<boolean>(`/auth/check-username/${encodeURIComponent(username)}`);
  },

  /**
   * التحقق من توفر الرقم الوطني
   * Check if national ID already exists
   */
  checkNationalIDExists: async (nationalID: string): Promise<ServiceResponse<boolean>> => {
    return apiClient.get<boolean>(`/auth/check-nationalid/${encodeURIComponent(nationalID)}`);
  },

  /**
   * التحقق من وجود الدور
   * Check if role ID exists in the system
   */
  checkRoleExists: async (roleId: number): Promise<ServiceResponse<boolean>> => {
    return apiClient.get<boolean>(`/auth/check-role/${roleId}`);
  },

  /**
   * التحقق من وجود فصيلة الدم
   * Check if blood type ID exists in the system
   */
  checkBloodTypeExists: async (bloodTypeId: number): Promise<ServiceResponse<boolean>> => {
    return apiClient.get<boolean>(`/auth/check-bloodtype/${bloodTypeId}`);
  },

  /**
   * تسجيل متبرع جديد مع حساب مستخدم
   * Register a new donor with linked user account in a single transaction
   */
  registerDonor: async (data: RegisterDonorRequest): Promise<ServiceResponse<RegisterDonorResponse>> => {
    return apiClient.post<RegisterDonorResponse>('/auth/register-donor', data);
  },

  /**
   * تغيير كلمة المرور
   */
  changePassword: async (data: ChangePasswordRequest): Promise<ServiceResponse<boolean>> => {
    return apiClient.post<boolean>('/auth/change-password', data);
  },
};
