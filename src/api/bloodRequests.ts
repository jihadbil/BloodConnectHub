// Blood Requests API endpoints
import { apiClient } from './client';
import type {
  ServiceResponse,
  PagedResult,
  BloodRequest,
  BloodRequestDetails,
  CreateBloodRequestRequest,
  RequestStatus,
  FulfillRequestPayload,
  UrgencyLevel,
} from '@/types/api';

// API Response type (what the backend actually sends)
interface ApiBloodRequest {
  requestID: number;
  patientName?: string;
  bloodTypeName?: string;
  quantityNeeded: number;
  urgencyLevel: number; // 0=Normal, 1=Urgent, 2=Emergency
  status: number; // 0=Pending, 1=Fulfilled, 2=PartiallyFulfilled, 3=Cancelled
  requiredDate: string;
  requestDate?: string;
  notes?: string;
  createdAt?: string;
  patientID?: number;
  bloodTypeID?: number;
  quantityFulfilled?: number;
  quantityRemaining?: number;
}

/**
 * تحويل مستوى الاستعجال من رقم إلى نص
 */
function mapUrgencyLevelFromApi(level: number): UrgencyLevel {
  switch (level) {
    case 1:
      return 'Normal';
    case 2:
      return 'Urgent';
    case 3:
      return 'Emergency';
    default:
      return 'Normal';
  }
}

/**
 * تحويل حالة الطلب من رقم إلى نص
 */
function mapRequestStatusFromApi(status: number): RequestStatus {
  switch (status) {
    case 1:
      return 'Pending';
    case 2:
      return 'Fulfilled';
    case 3:
      return 'PartiallyFulfilled';
    case 4:
      return 'Cancelled';
    default:
      return 'Pending';
  }
}

/**
 * تحويل البيانات من تنسيق API إلى تنسيق التطبيق
 */
function transformApiBloodRequest(apiRequest: ApiBloodRequest): BloodRequest {
  return {
    requestId: apiRequest.requestID,
    patientId: apiRequest.patientID || 0,
    bloodTypeId: apiRequest.bloodTypeID || 0,
    bloodType: apiRequest.bloodTypeName ? {
      bloodTypeId: apiRequest.bloodTypeID || 0,
      typeName: apiRequest.bloodTypeName,
      description: ''
    } : undefined,
    quantityNeeded: apiRequest.quantityNeeded,
    quantityFulfilled: apiRequest.quantityFulfilled,
    quantityRemaining: apiRequest.quantityRemaining,
    urgencyLevel: mapUrgencyLevelFromApi(apiRequest.urgencyLevel),
    requestDate: apiRequest.requestDate || apiRequest.createdAt || new Date().toISOString(),
    requiredDate: apiRequest.requiredDate,
    status: mapRequestStatusFromApi(apiRequest.status),
    notes: apiRequest.notes,
    createdAt: apiRequest.createdAt || new Date().toISOString(),
    patient: apiRequest.patientName ? {
      patientId: apiRequest.patientID || 0,
      fullName: apiRequest.patientName,
      nationalId: '',
      gender: 'Male',
      dateOfBirth: '',
      phone: '',
      city: '',
      bloodTypeId: apiRequest.bloodTypeID || 0,
      createdAt: ''
    } : undefined
  };
}

export const bloodRequestsApi = {
  /**
   * جلب قائمة طلبات الدم مع التقسيم للصفحات
   */
  getAll: async (page = 1, pageSize = 10): Promise<ServiceResponse<PagedResult<BloodRequest>>> => {
    const response = await apiClient.get<PagedResult<ApiBloodRequest>>(`/bloodrequests?pageNumber=${page}&pageSize=${pageSize}`);
    
    if (response.isSuccess && response.data) {
      return {
        ...response,
        data: {
          ...response.data,
          items: response.data.items.map(transformApiBloodRequest)
        }
      };
    }
    
    return response as ServiceResponse<PagedResult<BloodRequest>>;
  },

  /**
   * جلب تفاصيل طلب محدد
   */
  getById: async (id: number): Promise<ServiceResponse<BloodRequest>> => {
    const response = await apiClient.get<ApiBloodRequest>(`/bloodrequests/${id}`);
    
    if (response.isSuccess && response.data) {
      return {
        ...response,
        data: transformApiBloodRequest(response.data)
      };
    }
    
    return response as ServiceResponse<BloodRequest>;
  },

  /**
   * جلب تفاصيل كاملة لطلب محدد (مع المريض وفصيلة الدم)
   */
  getDetails: async (id: number): Promise<ServiceResponse<BloodRequestDetails>> => {
    return apiClient.get<BloodRequestDetails>(`/bloodrequests/${id}/details`);
  },

  /**
   * جلب الطلبات المعلقة
   */
  getPending: async (): Promise<ServiceResponse<BloodRequest[]>> => {
    const response = await apiClient.get<ApiBloodRequest[]>('/bloodrequests/pending');
    
    if (response.isSuccess && response.data) {
      return {
        ...response,
        data: response.data.map(transformApiBloodRequest)
      };
    }
    
    return response as ServiceResponse<BloodRequest[]>;
  },

  /**
   * جلب الطلبات العاجلة
   */
  getUrgent: async (): Promise<ServiceResponse<BloodRequest[]>> => {
    const response = await apiClient.get<ApiBloodRequest[]>('/bloodrequests/urgent');
    
    if (response.isSuccess && response.data) {
      return {
        ...response,
        data: response.data.map(transformApiBloodRequest)
      };
    }
    
    return response as ServiceResponse<BloodRequest[]>;
  },

  /**
   * إنشاء طلب دم جديد
   */
  create: async (data: CreateBloodRequestRequest): Promise<ServiceResponse<BloodRequest>> => {
    return apiClient.post<BloodRequest>('/bloodrequests', data);
  },

  /**
   * تحديث حالة طلب
   */
  updateStatus: async (
    id: number,
    status: RequestStatus,
    notes?: string
  ): Promise<ServiceResponse<BloodRequest>> => {
    const query = `?status=${status}${notes ? `&notes=${encodeURIComponent(notes)}` : ''}`;
    return apiClient.put<BloodRequest>(`/bloodrequests/${id}/status${query}`, {});
  },

  /**
   * تنفيذ طلب (ربطه بتبرع)
   */
  fulfill: async (id: number, payload: FulfillRequestPayload): Promise<ServiceResponse<boolean>> => {
    return apiClient.post<boolean>(`/bloodrequests/${id}/fulfill`, payload);
  },

  /**
   * إلغاء طلب
   */
  cancel: async (id: number, reason: string): Promise<ServiceResponse<boolean>> => {
    return apiClient.post<boolean>(`/bloodrequests/${id}/cancel`, { reason });
  },

  /**
   * حذف طلب
   */
  delete: async (id: number): Promise<ServiceResponse<boolean>> => {
    return apiClient.delete<boolean>(`/bloodrequests/${id}`);
  },
};
