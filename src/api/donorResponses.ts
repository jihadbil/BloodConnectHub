// Donor Responses API endpoints
import { apiClient } from './client';
import type { ServiceResponse, UrgencyLevel } from '@/types/api';
import type {
  DonorResponse,
  ApiDonorResponse,
  CreateDonorResponseRequest,
  UpdateResponseStatusRequest,
  ResponseStatus
} from '@/types/donor-response';

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
 * تحويل البيانات من تنسيق API إلى تنسيق التطبيق
 * Transforms API response (PascalCase, numbers) to application format (camelCase, enums)
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 10.5
 */
function transformApiDonorResponse(api: ApiDonorResponse): DonorResponse {
  return {
    responseId: api.responseID,
    donorId: api.donorID,
    donorName: api.donorName,
    donorPhone: api.donorPhone,
    bloodTypeName: api.bloodTypeName,
    requestId: api.requestID,
    patientName: api.patientName,
    urgencyLevel: mapUrgencyLevelFromApi(api.urgencyLevel),
    status: api.status as ResponseStatus,
    statusDescription: api.statusDescription,
    notes: api.notes,
    rejectionReason: api.rejectionReason,
    responseDate: api.responseDate,
    confirmedAt: api.confirmedAt,
    donationId: api.donationID,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt
  };
}

export const donorResponsesApi = {
  /**
   * إنشاء استجابة جديدة من متبرع
   * Create a new donor response to a blood request
   * 
   * Requirements: 1.1, 1.10, 9.1, 9.2, 9.3, 9.4, 9.6
   * 
   * @param data - Create request data (donorId, requestId, optional notes)
   * @returns ServiceResponse with created DonorResponse or error
   * 
   * @example
   * const result = await donorResponsesApi.create({
   *   donorId: 1,
   *   requestId: 5,
   *   notes: 'متاح للتبرع غداً'
   * });
   */
  create: async (data: CreateDonorResponseRequest): Promise<ServiceResponse<DonorResponse>> => {
    const response = await apiClient.post<ApiDonorResponse>('/donorresponses', data);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformApiDonorResponse(response.data)
      };
    }
    
    return {
      success: response.success,
      message: response.message,
      data: null,
      errors: response.errors
    };
  },

  /**
   * جلب تفاصيل استجابة واحدة
   * Get details of a specific donor response
   * 
   * Requirements: 2.1, 2.2, 2.3, 2.4, 9.1, 9.2, 9.3, 9.4, 9.6
   * 
   * @param id - Response ID
   * @returns ServiceResponse with DonorResponse or error
   * 
   * @example
   * const result = await donorResponsesApi.getById(123);
   */
  getById: async (id: number): Promise<ServiceResponse<DonorResponse>> => {
    const response = await apiClient.get<ApiDonorResponse>(`/donorresponses/${id}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformApiDonorResponse(response.data)
      };
    }
    
    return {
      success: response.success,
      message: response.message,
      data: null,
      errors: response.errors
    };
  },

  /**
   * جلب جميع الاستجابات لطلب دم معين
   * Get all responses for a specific blood request
   * 
   * Requirements: 3.1, 3.2, 9.1, 9.2, 9.3, 9.4, 9.6
   * 
   * @param requestId - Blood request ID
   * @returns ServiceResponse with array of DonorResponse (sorted by responseDate desc)
   * 
   * @example
   * const result = await donorResponsesApi.getByRequestId(5);
   */
  getByRequestId: async (requestId: number): Promise<ServiceResponse<DonorResponse[]>> => {
    const response = await apiClient.get<ApiDonorResponse[]>(`/donorresponses/request/${requestId}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformApiDonorResponse)
      };
    }
    
    return {
      success: response.success,
      message: response.message,
      data: null,
      errors: response.errors
    };
  },

  /**
   * جلب جميع استجابات متبرع معين
   * Get all responses submitted by a specific donor
   * 
   * Requirements: 4.1, 4.2, 9.1, 9.2, 9.3, 9.4, 9.6
   * 
   * @param donorId - Donor ID
   * @returns ServiceResponse with array of DonorResponse (sorted by responseDate desc)
   * 
   * @example
   * const result = await donorResponsesApi.getByDonorId(10);
   */
  getByDonorId: async (donorId: number): Promise<ServiceResponse<DonorResponse[]>> => {
    const response = await apiClient.get<ApiDonorResponse[]>(`/donorresponses/donor/${donorId}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformApiDonorResponse)
      };
    }
    
    return {
      success: response.success,
      message: response.message,
      data: null,
      errors: response.errors
    };
  },

  /**
   * تحديث حالة الاستجابة
   * Update response status with state machine validation
   * 
   * Requirements: 5.1, 5.14, 9.1, 9.2, 9.3, 9.4, 9.6
   * 
   * @param id - Response ID
   * @param data - Update request data (status, optional notes, optional donationId)
   * @returns ServiceResponse with updated DonorResponse or error
   * 
   * @example
   * const result = await donorResponsesApi.updateStatus(123, {
   *   status: ResponseStatus.Confirmed,
   *   notes: 'تم التأكيد هاتفياً'
   * });
   */
  updateStatus: async (
    id: number,
    data: UpdateResponseStatusRequest
  ): Promise<ServiceResponse<DonorResponse>> => {
    const response = await apiClient.put<ApiDonorResponse>(`/donorresponses/${id}/status`, data);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformApiDonorResponse(response.data)
      };
    }
    
    return {
      success: response.success,
      message: response.message,
      data: null,
      errors: response.errors
    };
  },

  /**
   * إلغاء استجابة
   * Cancel a donor response with reason
   * 
   * Requirements: 6.1, 6.7, 9.1, 9.2, 9.3, 9.4, 9.6
   * 
   * @param id - Response ID
   * @param reason - Cancellation reason (required, max 500 characters)
   * @returns ServiceResponse with success boolean or error
   * 
   * @example
   * const result = await donorResponsesApi.cancel(123, 'المتبرع غير متاح');
   */
  cancel: async (id: number, reason: string): Promise<ServiceResponse<boolean>> => {
    return apiClient.post<boolean>(`/donorresponses/${id}/cancel`, { reason });
  }
};
