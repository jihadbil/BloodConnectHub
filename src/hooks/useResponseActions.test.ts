// Tests for useResponseActions hook
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useResponseActions } from './useResponseActions';
import { donorResponsesApi } from '@/api/donorResponses';
import { ResponseStatus } from '@/types/donor-response';
import type { DonorResponse } from '@/types/donor-response';
import React, { type ReactNode } from 'react';

// Mock dependencies
vi.mock('@/api/donorResponses');
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Helper to create wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  );
}

// Mock response data
const mockResponse: DonorResponse = {
  responseId: 1,
  donorId: 10,
  donorName: 'أحمد محمد',
  donorPhone: '0912345678',
  bloodTypeName: 'A+',
  requestId: 5,
  patientName: 'فاطمة علي',
  urgencyLevel: 'Urgent',
  status: ResponseStatus.Interested,
  statusDescription: 'مهتم',
  responseDate: '2024-01-15T10:00:00Z',
  createdAt: '2024-01-15T10:00:00Z',
};

describe('useResponseActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createResponse', () => {
    it('should create response successfully', async () => {
      vi.mocked(donorResponsesApi.create).mockResolvedValue({
        success: true,
        message: 'تم تسجيل استجابتك بنجاح',
        data: mockResponse,
        errors: null,
      });

      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.createResponse({
        donorId: 10,
        requestId: 5,
        notes: 'متاح للتبرع غداً',
      });

      expect(response.success).toBe(true);
      expect(response.donationId).toBe(1);
      expect(response.error).toBeUndefined();
    });

    it('should handle validation error for invalid donorId', async () => {
      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.createResponse({
        donorId: -1, // Invalid
        requestId: 5,
      });

      expect(response.success).toBe(false);
      expect(response.error).toContain('معرف المتبرع غير صحيح');
      expect(response.errorType).toBe('unknown');
    });

    it('should handle validation error for invalid requestId', async () => {
      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.createResponse({
        donorId: 10,
        requestId: 0, // Invalid
      });

      expect(response.success).toBe(false);
      expect(response.error).toContain('معرف الطلب غير صحيح');
    });

    it('should handle validation error for notes exceeding 500 characters', async () => {
      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const longNotes = 'a'.repeat(501);
      const response = await result.current.createResponse({
        donorId: 10,
        requestId: 5,
        notes: longNotes,
      });

      expect(response.success).toBe(false);
      expect(response.error).toContain('الملاحظات يجب ألا تتجاوز 500 حرف');
    });

    it('should handle API error', async () => {
      vi.mocked(donorResponsesApi.create).mockResolvedValue({
        success: false,
        message: 'طلب الدم غير موجود',
        data: null,
        errors: ['NOT_FOUND'],
      });

      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.createResponse({
        donorId: 10,
        requestId: 999,
      });

      expect(response.success).toBe(false);
      expect(response.error).toBe('طلب الدم غير موجود');
    });

    it('should set isCreating to true while creating', async () => {
      vi.mocked(donorResponsesApi.create).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          success: true,
          message: 'تم',
          data: mockResponse,
          errors: null,
        }), 100))
      );

      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isCreating).toBe(false);

      const promise = result.current.createResponse({
        donorId: 10,
        requestId: 5,
      });

      await waitFor(() => {
        expect(result.current.isCreating).toBe(true);
      });

      await promise;

      await waitFor(() => {
        expect(result.current.isCreating).toBe(false);
      });
    });
  });

  describe('updateStatus', () => {
    it('should update status successfully', async () => {
      const updatedResponse = { ...mockResponse, status: ResponseStatus.Confirmed };
      vi.mocked(donorResponsesApi.updateStatus).mockResolvedValue({
        success: true,
        message: 'تم تحديث الحالة',
        data: updatedResponse,
        errors: null,
      });

      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.updateStatus(
        1,
        { status: ResponseStatus.Confirmed },
        ResponseStatus.Interested
      );

      expect(response.success).toBe(true);
      expect(response.donationId).toBe(1);
    });

    it('should reject invalid state transition', async () => {
      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      // Interested -> NoShow is invalid (must go through Confirmed first)
      const response = await result.current.updateStatus(
        1,
        { status: ResponseStatus.NoShow },
        ResponseStatus.Interested
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('غير مسموح');
    });

    it('should reject transition from terminal state (Donated)', async () => {
      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.updateStatus(
        1,
        { status: ResponseStatus.Cancelled },
        ResponseStatus.Donated
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('لا يمكن تغيير حالة استجابة تم التبرع بها مسبقاً');
    });

    it('should reject transition from terminal state (Cancelled)', async () => {
      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.updateStatus(
        1,
        { status: ResponseStatus.Confirmed },
        ResponseStatus.Cancelled
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('لا يمكن تغيير حالة استجابة ملغاة');
    });

    it('should validate donationId is required for Donated status', async () => {
      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.updateStatus(
        1,
        { status: ResponseStatus.Donated }, // Missing donationId
        ResponseStatus.Confirmed
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('يجب تحديد معرف التبرع');
    });

    it('should set isUpdating to true while updating', async () => {
      vi.mocked(donorResponsesApi.updateStatus).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          success: true,
          message: 'تم',
          data: { ...mockResponse, status: ResponseStatus.Confirmed },
          errors: null,
        }), 100))
      );

      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isUpdating).toBe(false);

      const promise = result.current.updateStatus(
        1,
        { status: ResponseStatus.Confirmed },
        ResponseStatus.Interested
      );

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(true);
      });

      await promise;

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(false);
      });
    });
  });

  describe('cancelResponse', () => {
    it('should cancel response successfully', async () => {
      vi.mocked(donorResponsesApi.cancel).mockResolvedValue({
        success: true,
        message: 'تم إلغاء الاستجابة',
        data: true,
        errors: null,
      });

      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.cancelResponse(
        1,
        'المتبرع غير متاح',
        5,
        10
      );

      expect(response.success).toBe(true);
      expect(response.error).toBeUndefined();
    });

    it('should reject empty cancellation reason', async () => {
      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.cancelResponse(
        1,
        '', // Empty reason
        5,
        10
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('يجب ذكر سبب الإلغاء');
    });

    it('should reject cancellation reason exceeding 500 characters', async () => {
      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const longReason = 'a'.repeat(501);
      const response = await result.current.cancelResponse(
        1,
        longReason,
        5,
        10
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('سبب الإلغاء يجب ألا يتجاوز 500 حرف');
    });

    it('should handle API error', async () => {
      vi.mocked(donorResponsesApi.cancel).mockResolvedValue({
        success: false,
        message: 'لا يمكن إلغاء الاستجابة — حالتها الحالية: Donated',
        data: null,
        errors: ['INVALID_STATE'],
      });

      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.cancelResponse(
        1,
        'المتبرع غير متاح',
        5,
        10
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('لا يمكن إلغاء الاستجابة');
    });

    it('should set isCancelling to true while cancelling', async () => {
      vi.mocked(donorResponsesApi.cancel).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          success: true,
          message: 'تم',
          data: true,
          errors: null,
        }), 100))
      );

      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isCancelling).toBe(false);

      const promise = result.current.cancelResponse(
        1,
        'المتبرع غير متاح',
        5,
        10
      );

      await waitFor(() => {
        expect(result.current.isCancelling).toBe(true);
      });

      await promise;

      await waitFor(() => {
        expect(result.current.isCancelling).toBe(false);
      });
    });
  });

  describe('error type determination', () => {
    it('should identify auth errors', async () => {
      vi.mocked(donorResponsesApi.create).mockResolvedValue({
        success: false,
        message: 'يجب تسجيل الدخول للمتابعة',
        data: null,
        errors: ['UNAUTHORIZED'],
      });

      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.createResponse({
        donorId: 10,
        requestId: 5,
      });

      expect(response.success).toBe(false);
      expect(response.errorType).toBe('auth');
    });

    it('should identify compatibility errors', async () => {
      vi.mocked(donorResponsesApi.create).mockResolvedValue({
        success: false,
        message: 'فصيلة دم المتبرع لا تتوافق مع فصيلة الدم المطلوبة',
        data: null,
        errors: ['INCOMPATIBLE_BLOOD_TYPE'],
      });

      const { result } = renderHook(() => useResponseActions(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.createResponse({
        donorId: 10,
        requestId: 5,
      });

      expect(response.success).toBe(false);
      expect(response.errorType).toBe('compatibility');
    });
  });
});
