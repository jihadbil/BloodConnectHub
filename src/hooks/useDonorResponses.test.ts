// Unit tests for useDonorResponses hook
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDonorResponses, useDonorResponse } from './useDonorResponses';
import { donorResponsesApi } from '@/api/donorResponses';
import type { DonorResponse } from '@/types/donor-response';
import { ResponseStatus } from '@/types/donor-response';
import React, { type ReactNode } from 'react';

// Mock the API
vi.mock('@/api/donorResponses', () => ({
  donorResponsesApi: {
    getByRequestId: vi.fn(),
    getByDonorId: vi.fn(),
    getById: vi.fn(),
  }
}));

// Helper to create a wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
      },
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

describe('useDonorResponses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch responses by requestId successfully', async () => {
    const mockResponses = [mockResponse];
    vi.mocked(donorResponsesApi.getByRequestId).mockResolvedValue({
      success: true,
      message: 'تم جلب الاستجابات بنجاح',
      data: mockResponses,
      errors: null,
    });

    const { result } = renderHook(
      () => useDonorResponses({ requestId: 5 }),
      { wrapper: createWrapper() }
    );

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockResponses);
    expect(result.current.error).toBeNull();
    expect(donorResponsesApi.getByRequestId).toHaveBeenCalledWith(5);
  });

  it('should fetch responses by donorId successfully', async () => {
    const mockResponses = [mockResponse];
    vi.mocked(donorResponsesApi.getByDonorId).mockResolvedValue({
      success: true,
      message: 'تم جلب الاستجابات بنجاح',
      data: mockResponses,
      errors: null,
    });

    const { result } = renderHook(
      () => useDonorResponses({ donorId: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockResponses);
    expect(result.current.error).toBeNull();
    expect(donorResponsesApi.getByDonorId).toHaveBeenCalledWith(10);
  });

  it('should handle API error for requestId', async () => {
    vi.mocked(donorResponsesApi.getByRequestId).mockResolvedValue({
      success: false,
      message: 'طلب الدم غير موجود',
      data: null,
      errors: ['NOT_FOUND'],
    });

    const { result } = renderHook(
      () => useDonorResponses({ requestId: 999 }),
      { wrapper: createWrapper() }
    );

    // Wait for query to finish (including retries)
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    }, { timeout: 5000 });

    // After retries complete, should have error
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });

  it('should handle API error for donorId', async () => {
    vi.mocked(donorResponsesApi.getByDonorId).mockResolvedValue({
      success: false,
      message: 'المتبرع غير موجود',
      data: null,
      errors: ['NOT_FOUND'],
    });

    const { result } = renderHook(
      () => useDonorResponses({ donorId: 999 }),
      { wrapper: createWrapper() }
    );

    // Wait for query to finish (including retries)
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    }, { timeout: 5000 });

    // After retries complete, should have error
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });

  it('should not fetch when no filter is provided', async () => {
    const { result } = renderHook(
      () => useDonorResponses({}),
      { wrapper: createWrapper() }
    );

    // Should not be loading since query is disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(donorResponsesApi.getByRequestId).not.toHaveBeenCalled();
    expect(donorResponsesApi.getByDonorId).not.toHaveBeenCalled();
  });

  it('should return empty array when API returns empty data', async () => {
    vi.mocked(donorResponsesApi.getByRequestId).mockResolvedValue({
      success: true,
      message: 'لا توجد استجابات',
      data: [],
      errors: null,
    });

    const { result } = renderHook(
      () => useDonorResponses({ requestId: 5 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should support refetch functionality', async () => {
    const mockResponses = [mockResponse];
    vi.mocked(donorResponsesApi.getByRequestId).mockResolvedValue({
      success: true,
      message: 'تم جلب الاستجابات بنجاح',
      data: mockResponses,
      errors: null,
    });

    const { result } = renderHook(
      () => useDonorResponses({ requestId: 5 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Refetch
    await result.current.refetch();

    expect(donorResponsesApi.getByRequestId).toHaveBeenCalledTimes(2);
  });
});

describe('useDonorResponse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch single response successfully', async () => {
    vi.mocked(donorResponsesApi.getById).mockResolvedValue({
      success: true,
      message: 'تم جلب الاستجابة بنجاح',
      data: mockResponse,
      errors: null,
    });

    const { result } = renderHook(
      () => useDonorResponse(1),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
    expect(donorResponsesApi.getById).toHaveBeenCalledWith(1);
  });

  it('should handle not found error', async () => {
    vi.mocked(donorResponsesApi.getById).mockResolvedValue({
      success: false,
      message: 'الاستجابة غير موجودة',
      data: null,
      errors: ['NOT_FOUND'],
    });

    const { result } = renderHook(
      () => useDonorResponse(999),
      { wrapper: createWrapper() }
    );

    // Wait for query to finish (including retries)
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    }, { timeout: 5000 });

    // After retries complete, should have error
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });

  it('should not fetch when invalid ID is provided', async () => {
    const { result } = renderHook(
      () => useDonorResponse(0),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(donorResponsesApi.getById).not.toHaveBeenCalled();
  });

  it('should not fetch when negative ID is provided', async () => {
    const { result } = renderHook(
      () => useDonorResponse(-1),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(donorResponsesApi.getById).not.toHaveBeenCalled();
  });
});
