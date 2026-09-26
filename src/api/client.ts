// BloodConnect API Client
// Base URL can be configured via environment variable

import type { ServiceResponse } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7142/api';

/**
 * Get stored authentication token
 */
function getAuthToken(): string | null {
  return localStorage.getItem('api_token');
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ServiceResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = getAuthToken();

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options?.headers as Record<string, string>) || {}),
      };

      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - clear auth and redirect to login
      if (response.status === 401) {
        localStorage.removeItem('api_user');
        localStorage.removeItem('api_token');
        // Don't redirect here, let the ProtectedRoute handle it
        return {
          isSuccess: false,
          success: false,
          message: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً',
          data: null as any,
          errors: ['Unauthorized'],
        };
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (data && typeof data === 'object') {
        const isSuccessVal = data.isSuccess !== undefined ? data.isSuccess : data.success;
        data.success = isSuccessVal;
        data.isSuccess = isSuccessVal;
      }

      if (!response.ok) {
        return {
          isSuccess: false,
          success: false,
          message: data.message || 'حدث خطأ غير متوقع',
          data: null as any,
          errors: data.errors || [data.message || 'خطأ في الاتصال بالخادم'],
        };
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        isSuccess: false,
        success: false,
        message: 'فشل الاتصال بالخادم',
        data: null as any,
        errors: [error instanceof Error ? error.message : 'خطأ غير معروف'],
      };
    }
  }

  async get<T>(endpoint: string): Promise<ServiceResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ServiceResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ServiceResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ServiceResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ServiceResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<ServiceResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = getAuthToken();

    try {
      const headers: Record<string, string> = {};

      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      // Handle 401 Unauthorized - clear auth and redirect to login
      if (response.status === 401) {
        localStorage.removeItem('api_user');
        localStorage.removeItem('api_token');
        return {
          isSuccess: false,
          success: false,
          message: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً',
          data: null as any,
          errors: ['Unauthorized'],
        };
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (data && typeof data === 'object') {
        const isSuccessVal = data.isSuccess !== undefined ? data.isSuccess : data.success;
        data.success = isSuccessVal;
        data.isSuccess = isSuccessVal;
      }

      if (!response.ok) {
        return {
          isSuccess: false,
          success: false,
          message: data.message || 'حدث خطأ غير متوقع',
          data: null as any,
          errors: data.errors || [data.message || 'خطأ في الاتصال بالخادم'],
        };
      }

      return data;
    } catch (error) {
      console.error('API FormData Error:', error);
      return {
        isSuccess: false,
        success: false,
        message: 'فشل الاتصال بالخادم',
        data: null as any,
        errors: [error instanceof Error ? error.message : 'خطأ غير معروف'],
      };
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export base URL for debugging
export const getApiBaseUrl = () => API_BASE_URL;
