// Unit tests for donorResponsesApi
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { donorResponsesApi } from './donorResponses';
import { apiClient } from './client';
import { ResponseStatus } from '@/types/donor-response';
import type { ApiDonorResponse } from '@/types/donor-response';

// Mock the apiClient
vi.mock('./client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn()
  }
}));

describe('donorResponsesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new donor response and transform the data', async () => {
      const mockApiResponse: ApiDonorResponse = {
        responseID: 1,
        donorID: 10,
        donorName: 'أحمد محمد',
        donorPhone: '0912345678',
        bloodTypeName: 'A+',
        requestID: 5,
        patientName: 'فاطمة علي',
        urgencyLevel: 2, // Urgent
        status: 1, // Interested
        statusDescription: 'مهتم',
        responseDate: '2024-01-15T10:00:00Z',
        createdAt: '2024-01-15T10:00:00Z'
      };

      vi.mocked(apiClient.post).mockResolvedValue({
        success: true,
        message: 'تم تسجيل استجابتك بنجاح',
        data: mockApiResponse,
        errors: null
      });

      const result = await donorResponsesApi.create({
        donorId: 10,
        requestId: 5,
        notes: 'متاح للتبرع'
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.responseId).toBe(1);
      expect(result.data?.donorId).toBe(10);
      expect(result.data?.requestId).toBe(5);
      expect(result.data?.urgencyLevel).toBe('Urgent');
      expect(result.data?.status).toBe(ResponseStatus.Interested);
    });

    it('should handle API errors', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        success: false,
        message: 'المتبرع غير موجود',
        data: null,
        errors: ['DONOR_NOT_FOUND']
      });

      const result = await donorResponsesApi.create({
        donorId: 999,
        requestId: 5
      });

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.message).toBe('المتبرع غير موجود');
    });
  });

  describe('getById', () => {
    it('should fetch and transform a single response', async () => {
      const mockApiResponse: ApiDonorResponse = {
        responseID: 1,
        donorID: 10,
        donorName: 'أحمد محمد',
        donorPhone: '0912345678',
        bloodTypeName: 'A+',
        requestID: 5,
        patientName: 'فاطمة علي',
        urgencyLevel: 3, // Emergency
        status: 2, // Confirmed
        statusDescription: 'مؤكد',
        responseDate: '2024-01-15T10:00:00Z',
        confirmedAt: '2024-01-15T11:00:00Z',
        createdAt: '2024-01-15T10:00:00Z'
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        success: true,
        data: mockApiResponse,
        errors: null
      });

      const result = await donorResponsesApi.getById(1);

      expect(result.success).toBe(true);
      expect(result.data?.responseId).toBe(1);
      expect(result.data?.urgencyLevel).toBe('Emergency');
      expect(result.data?.status).toBe(ResponseStatus.Confirmed);
      expect(result.data?.confirmedAt).toBe('2024-01-15T11:00:00Z');
    });
  });

  describe('getByRequestId', () => {
    it('should fetch and transform multiple responses', async () => {
      const mockApiResponses: ApiDonorResponse[] = [
        {
          responseID: 1,
          donorID: 10,
          donorName: 'أحمد محمد',
          donorPhone: '0912345678',
          bloodTypeName: 'A+',
          requestID: 5,
          patientName: 'فاطمة علي',
          urgencyLevel: 1,
          status: 1,
          statusDescription: 'مهتم',
          responseDate: '2024-01-15T10:00:00Z',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          responseID: 2,
          donorID: 11,
          donorName: 'محمد علي',
          donorPhone: '0912345679',
          bloodTypeName: 'A+',
          requestID: 5,
          patientName: 'فاطمة علي',
          urgencyLevel: 1,
          status: 2,
          statusDescription: 'مؤكد',
          responseDate: '2024-01-15T11:00:00Z',
          createdAt: '2024-01-15T11:00:00Z'
        }
      ];

      vi.mocked(apiClient.get).mockResolvedValue({
        success: true,
        data: mockApiResponses,
        errors: null
      });

      const result = await donorResponsesApi.getByRequestId(5);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data?.[0].responseId).toBe(1);
      expect(result.data?.[1].responseId).toBe(2);
    });

    it('should return empty array when no responses exist', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        success: true,
        data: [],
        errors: null
      });

      const result = await donorResponsesApi.getByRequestId(999);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });

  describe('updateStatus', () => {
    it('should update response status and transform the data', async () => {
      const mockApiResponse: ApiDonorResponse = {
        responseID: 1,
        donorID: 10,
        donorName: 'أحمد محمد',
        donorPhone: '0912345678',
        bloodTypeName: 'A+',
        requestID: 5,
        patientName: 'فاطمة علي',
        urgencyLevel: 1,
        status: 2, // Confirmed
        statusDescription: 'مؤكد',
        responseDate: '2024-01-15T10:00:00Z',
        confirmedAt: '2024-01-15T12:00:00Z',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z'
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        success: true,
        data: mockApiResponse,
        errors: null
      });

      const result = await donorResponsesApi.updateStatus(1, {
        status: ResponseStatus.Confirmed,
        notes: 'تم التأكيد هاتفياً'
      });

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe(ResponseStatus.Confirmed);
      expect(result.data?.confirmedAt).toBe('2024-01-15T12:00:00Z');
      expect(result.data?.updatedAt).toBe('2024-01-15T12:00:00Z');
    });
  });

  describe('cancel', () => {
    it('should cancel a response with reason', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        success: true,
        message: 'تم إلغاء الاستجابة بنجاح',
        data: true,
        errors: null
      });

      const result = await donorResponsesApi.cancel(1, 'المتبرع غير متاح');

      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
      expect(apiClient.post).toHaveBeenCalledWith(
        '/donorresponses/1/cancel',
        { reason: 'المتبرع غير متاح' }
      );
    });
  });
});
