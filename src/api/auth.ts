// Authentication API endpoints
import { apiClient } from './client';
import type {
  ServiceResponse,
  ApiUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ChangePasswordRequest,
} from '@/types/api';

export const authApi = {
  /**
   * تسجيل الدخول
   */
  login: async (credentials: LoginRequest): Promise<ServiceResponse<ApiUser>> => {
    const response = await apiClient.post<LoginResponse>('/Auth/login', credentials);
    
    if (response.isSuccess && response.data) {
      localStorage.setItem('api_token', response.data.token);
      localStorage.setItem('api_user', JSON.stringify(response.data.user));
      
      return {
        ...response,
        data: response.data.user
      };
    }
    
    return {
      ...response,
      data: null
    };
  },

  /**
   * إنشاء حساب جديد
   */
  register: async (data: RegisterRequest): Promise<ServiceResponse<ApiUser>> => {
    const response = await apiClient.post<LoginResponse>('/Auth/register', data);
    
    if (response.isSuccess && response.data) {
      localStorage.setItem('api_token', response.data.token);
      localStorage.setItem('api_user', JSON.stringify(response.data.user));
      
      return {
        ...response,
        data: response.data.user
      };
    }
    
    return {
      ...response,
      data: null as any
    };
  },

  /**
   * تغيير كلمة المرور
   */
  changePassword: async (data: ChangePasswordRequest): Promise<ServiceResponse<boolean>> => {
    return apiClient.post<boolean>('/Auth/change-password', data);
  },
};
