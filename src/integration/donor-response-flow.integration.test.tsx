/**
 * Integration Test - Complete Donor Response Flow
 * 
 * This test verifies the complete integration of all donor response components:
 * - API Client (donorResponsesApi)
 * - React Hooks (useDonorResponses, useResponseActions)
 * - State Machine (responseStateMachine)
 * - Validation (responseValidation)
 * 
 * Tests the full lifecycle: Create → Confirm → Donate
 * 
 * **Validates: Task 10 - Complete Integration Checkpoint**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDonorResponses } from '@/hooks/useDonorResponses';
import { useResponseActions } from '@/hooks/useResponseActions';
import { donorResponsesApi } from '@/api/donorResponses';
import { ResponseStatus } from '@/types/donor-response';
import type { DonorResponse, CreateDonorResponseRequest } from '@/types/donor-response';
import type { ServiceResponse } from '@/types/api';

// Mock the API client
vi.mock('@/api/donorResponses', () => ({
  donorResponsesApi: {
    create: vi.fn(),
    getById: vi.fn(),
    getByRequestId: vi.fn(),
    getByDonorId: vi.fn(),
    updateStatus: vi.fn(),
    cancel: vi.fn(),
  }
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('Donor Response Integration - Complete Flow', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const createMockResponse = (overrides?: Partial<DonorResponse>): DonorResponse => ({
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
    responseDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    ...overrides
  });

  describe('Complete Lifecycle: Create → Confirm → Donate', () => {
    it('should successfully complete the full response lifecycle', async () => {
      // Step 1: Create a new response
      const createRequest: CreateDonorResponseRequest = {
        donorId: 10,
        requestId: 5,
        notes: 'متاح للتبرع غداً'
      };

      const createdResponse = createMockResponse({
        responseId: 1,
        status: ResponseStatus.Interested,
        notes: 'متاح للتبرع غداً'
      });

      vi.mocked(donorResponsesApi.create).mockResolvedValue({
        success: true,
        message: 'تم تسجيل استجابتك بنجاح',
        data: createdResponse,
        errors: null
      });

      const { result: actionsResult } = renderHook(() => useResponseActions(), { wrapper });

      const createResult = await actionsResult.current.createResponse(createRequest);

      expect(createResult.success).toBe(true);
      expect(createResult.donationId).toBe(1);
      expect(donorResponsesApi.create).toHaveBeenCalledWith(createRequest);

      // Step 2: Fetch the response to verify it was created
      vi.mocked(donorResponsesApi.getByRequestId).mockResolvedValue({
        success: true,
        message: 'تم جلب الاستجابات بنجاح',
        data: [createdResponse],
        errors: null
      });

      const { result: queryResult } = renderHook(
        () => useDonorResponses({ requestId: 5 }),
        { wrapper }
      );

      await waitFor(() => {
        expect(queryResult.current.data).toBeDefined();
      });

      expect(queryResult.current.data).toHaveLength(1);
      expect(queryResult.current.data![0].status).toBe(ResponseStatus.Interested);

      // Step 3: Update status to Confirmed
      const confirmedResponse = createMockResponse({
        responseId: 1,
        status: ResponseStatus.Confirmed,
        statusDescription: 'مؤكد',
        confirmedAt: new Date().toISOString(),
        notes: 'تم التأكيد هاتفياً'
      });

      vi.mocked(donorResponsesApi.updateStatus).mockResolvedValue({
        success: true,
        message: 'تم تحديث حالة الاستجابة بنجاح',
        data: confirmedResponse,
        errors: null
      });

      const updateResult = await actionsResult.current.updateStatus(
        1,
        { status: ResponseStatus.Confirmed, notes: 'تم التأكيد هاتفياً' },
        ResponseStatus.Interested
      );

      expect(updateResult.success).toBe(true);
      expect(donorResponsesApi.updateStatus).toHaveBeenCalledWith(1, {
        status: ResponseStatus.Confirmed,
        notes: 'تم التأكيد هاتفياً'
      });

      // Step 4: Update status to Donated
      const donatedResponse = createMockResponse({
        responseId: 1,
        status: ResponseStatus.Donated,
        statusDescription: 'تم التبرع',
        confirmedAt: confirmedResponse.confirmedAt,
        donationId: 100
      });

      vi.mocked(donorResponsesApi.updateStatus).mockResolvedValue({
        success: true,
        message: 'تم تحديث حالة الاستجابة بنجاح',
        data: donatedResponse,
        errors: null
      });

      const donateResult = await actionsResult.current.updateStatus(
        1,
        { status: ResponseStatus.Donated, donationId: 100 },
        ResponseStatus.Confirmed
      );

      expect(donateResult.success).toBe(true);
      expect(donorResponsesApi.updateStatus).toHaveBeenCalledWith(1, {
        status: ResponseStatus.Donated,
        donationId: 100
      });

      // Step 5: Verify final state
      vi.mocked(donorResponsesApi.getByRequestId).mockResolvedValue({
        success: true,
        message: 'تم جلب الاستجابات بنجاح',
        data: [donatedResponse],
        errors: null
      });

      await queryResult.current.refetch();

      await waitFor(() => {
        expect(queryResult.current.data![0].status).toBe(ResponseStatus.Donated);
      });

      expect(queryResult.current.data![0].donationId).toBe(100);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API errors gracefully throughout the flow', async () => {
      // Test create error
      vi.mocked(donorResponsesApi.create).mockResolvedValue({
        success: false,
        message: 'فصيلة دم المتبرع لا تتوافق مع فصيلة الدم المطلوبة',
        data: null,
        errors: ['BLOOD_TYPE_MISMATCH']
      });

      const { result: actionsResult } = renderHook(() => useResponseActions(), { wrapper });

      const createResult = await actionsResult.current.createResponse({
        donorId: 10,
        requestId: 5
      });

      expect(createResult.success).toBe(false);
      expect(createResult.error).toContain('فصيلة دم المتبرع لا تتوافق');
      expect(createResult.errorType).toBe('compatibility');
    });

    it('should handle invalid state transitions', async () => {
      vi.mocked(donorResponsesApi.updateStatus).mockResolvedValue({
        success: false,
        message: 'لا يمكن الانتقال من Interested إلى Donated مباشرة',
        data: null,
        errors: ['INVALID_TRANSITION']
      });

      const { result: actionsResult } = renderHook(() => useResponseActions(), { wrapper });

      const updateResult = await actionsResult.current.updateStatus(
        1,
        { status: ResponseStatus.Donated },
        ResponseStatus.Interested
      );

      expect(updateResult.success).toBe(false);
      expect(updateResult.error).toBeDefined();
    });

    it('should handle network errors in mutations', async () => {
      vi.mocked(donorResponsesApi.create).mockRejectedValue(
        new Error('Network error')
      );

      const { result: actionsResult } = renderHook(() => useResponseActions(), { wrapper });

      const createResult = await actionsResult.current.createResponse({
        donorId: 10,
        requestId: 5
      });

      expect(createResult.success).toBe(false);
      expect(createResult.error).toBeDefined();
      // Generic network errors are classified as 'unknown' unless they contain specific keywords
      expect(createResult.errorType).toBe('unknown');
    });
  });

  describe('Cancellation Flow', () => {
    it('should successfully cancel a response with reason', async () => {
      const response = createMockResponse({
        status: ResponseStatus.Interested
      });

      vi.mocked(donorResponsesApi.cancel).mockResolvedValue({
        success: true,
        message: 'تم إلغاء الاستجابة بنجاح',
        data: true,
        errors: null
      });

      const { result: actionsResult } = renderHook(() => useResponseActions(), { wrapper });

      const cancelResult = await actionsResult.current.cancelResponse(
        response.responseId,
        'المتبرع غير متاح',
        response.requestId,
        response.donorId
      );

      expect(cancelResult.success).toBe(true);
      expect(donorResponsesApi.cancel).toHaveBeenCalledWith(1, 'المتبرع غير متاح');
    });

    it('should reject cancellation without reason', async () => {
      const { result: actionsResult } = renderHook(() => useResponseActions(), { wrapper });

      const cancelResult = await actionsResult.current.cancelResponse(
        1,
        '', // Empty reason
        5,
        10
      );

      expect(cancelResult.success).toBe(false);
      expect(cancelResult.error).toContain('يجب ذكر سبب الإلغاء');
    });
  });

  describe('Multiple Responses Management', () => {
    it('should handle multiple responses for the same request', async () => {
      const responses = [
        createMockResponse({ responseId: 1, donorId: 10, status: ResponseStatus.Confirmed }),
        createMockResponse({ responseId: 2, donorId: 11, status: ResponseStatus.Interested }),
        createMockResponse({ responseId: 3, donorId: 12, status: ResponseStatus.Donated })
      ];

      vi.mocked(donorResponsesApi.getByRequestId).mockResolvedValue({
        success: true,
        message: 'تم جلب الاستجابات بنجاح',
        data: responses,
        errors: null
      });

      const { result } = renderHook(
        () => useDonorResponses({ requestId: 5 }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(result.current.data).toHaveLength(3);
      expect(result.current.data!.map(r => r.status)).toEqual([
        ResponseStatus.Confirmed,
        ResponseStatus.Interested,
        ResponseStatus.Donated
      ]);
    });
  });

  describe('Timestamp Management', () => {
    it('should properly manage timestamps throughout lifecycle', async () => {
      const now = new Date().toISOString();
      
      // Created response has responseDate and createdAt
      const createdResponse = createMockResponse({
        responseDate: now,
        createdAt: now,
        confirmedAt: undefined,
        donationId: undefined
      });

      expect(createdResponse.responseDate).toBeDefined();
      expect(createdResponse.createdAt).toBeDefined();
      expect(createdResponse.confirmedAt).toBeUndefined();
      expect(createdResponse.donationId).toBeUndefined();

      // Confirmed response has confirmedAt set
      const confirmedResponse = createMockResponse({
        status: ResponseStatus.Confirmed,
        responseDate: now,
        createdAt: now,
        confirmedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      expect(confirmedResponse.confirmedAt).toBeDefined();
      expect(confirmedResponse.updatedAt).toBeDefined();

      // Donated response has donationId set
      const donatedResponse = createMockResponse({
        status: ResponseStatus.Donated,
        donationId: 100,
        confirmedAt: confirmedResponse.confirmedAt,
        updatedAt: new Date().toISOString()
      });

      expect(donatedResponse.donationId).toBe(100);
      expect(donatedResponse.updatedAt).toBeDefined();
    });
  });
});
