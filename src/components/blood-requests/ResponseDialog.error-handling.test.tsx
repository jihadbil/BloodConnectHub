import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResponseDialog } from './ResponseDialog';
import { BloodRequest } from '@/types/api';
import * as useBloodRequestResponseModule from '@/hooks/useBloodRequestResponse';

// Mock the hook
vi.mock('@/hooks/useBloodRequestResponse');

describe('ResponseDialog Error Handling', () => {
  const mockRequest: BloodRequest = {
    requestId: 1,
    patientId: 1,
    bloodTypeId: 1,
    bloodType: {
      bloodTypeId: 1,
      typeName: 'A+',
      description: 'A Positive'
    },
    quantityNeeded: 2,
    urgencyLevel: 'Urgent',
    requestDate: '2024-01-15T10:00:00Z',
    requiredDate: '2024-01-20T10:00:00Z',
    status: 'Pending',
    notes: 'قسم الطوارئ - حالة عاجلة',
    createdAt: '2024-01-15T10:00:00Z'
  };

  const mockOnOpenChange = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display auth error with dismiss action', async () => {
    // Mock respondToRequest to return auth error
    const mockRespondToRequest = vi.fn().mockResolvedValue({
      success: false,
      error: 'يجب تسجيل الدخول للاستجابة لطلبات الدم',
      errorType: 'auth'
    });

    vi.mocked(useBloodRequestResponseModule.useBloodRequestResponse).mockReturnValue({
      respondToRequest: mockRespondToRequest,
      isLoading: false,
      error: null
    });

    render(
      <ResponseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
        onSuccess={mockOnSuccess}
      />
    );

    // Click confirm button
    const confirmButton = screen.getByText('تأكيد الاستجابة');
    fireEvent.click(confirmButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('يجب تسجيل الدخول للاستجابة لطلبات الدم')).toBeInTheDocument();
    });

    // Check that dismiss action button is shown
    expect(screen.getByText('حسناً')).toBeInTheDocument();
  });

  it('should display compatibility error with dismiss action', async () => {
    // Mock respondToRequest to return compatibility error
    const mockRespondToRequest = vi.fn().mockResolvedValue({
      success: false,
      error: 'عذراً، فصيلة دمك (O+) غير متوافقة مع الفصيلة المطلوبة (A+)',
      errorType: 'compatibility'
    });

    vi.mocked(useBloodRequestResponseModule.useBloodRequestResponse).mockReturnValue({
      respondToRequest: mockRespondToRequest,
      isLoading: false,
      error: null
    });

    render(
      <ResponseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
        onSuccess={mockOnSuccess}
      />
    );

    // Click confirm button
    const confirmButton = screen.getByText('تأكيد الاستجابة');
    fireEvent.click(confirmButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/عذراً، فصيلة دمك/)).toBeInTheDocument();
    });

    // Check that dismiss action button is shown
    expect(screen.getByText('فهمت')).toBeInTheDocument();
  });

  it('should display eligibility error with dismiss action', async () => {
    // Mock respondToRequest to return eligibility error
    const mockRespondToRequest = vi.fn().mockResolvedValue({
      success: false,
      error: 'عذراً، آخر تبرع لك كان في 2024-01-01. يمكنك التبرع مرة أخرى في 2024-04-01 (بعد 45 يوم)',
      errorType: 'eligibility'
    });

    vi.mocked(useBloodRequestResponseModule.useBloodRequestResponse).mockReturnValue({
      respondToRequest: mockRespondToRequest,
      isLoading: false,
      error: null
    });

    render(
      <ResponseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
        onSuccess={mockOnSuccess}
      />
    );

    // Click confirm button
    const confirmButton = screen.getByText('تأكيد الاستجابة');
    fireEvent.click(confirmButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/عذراً، آخر تبرع لك/)).toBeInTheDocument();
    });

    // Check that dismiss action button is shown
    expect(screen.getByText('فهمت')).toBeInTheDocument();
  });

  it('should display API error with retry action', async () => {
    // Mock respondToRequest to return API error
    const mockRespondToRequest = vi.fn().mockResolvedValue({
      success: false,
      error: 'فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى',
      errorType: 'api'
    });

    vi.mocked(useBloodRequestResponseModule.useBloodRequestResponse).mockReturnValue({
      respondToRequest: mockRespondToRequest,
      isLoading: false,
      error: null
    });

    render(
      <ResponseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
        onSuccess={mockOnSuccess}
      />
    );

    // Click confirm button
    const confirmButton = screen.getByText('تأكيد الاستجابة');
    fireEvent.click(confirmButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/فشل الاتصال بالخادم/)).toBeInTheDocument();
    });

    // Check that retry action button is shown
    expect(screen.getByText('إعادة المحاولة')).toBeInTheDocument();
    // There are two "إلغاء" buttons - one in error alert and one in dialog footer
    expect(screen.getAllByText('إلغاء').length).toBeGreaterThanOrEqual(1);
  });

  it('should display unknown error with contact action', async () => {
    // Mock respondToRequest to return unknown error
    const mockRespondToRequest = vi.fn().mockResolvedValue({
      success: false,
      error: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى',
      errorType: 'unknown'
    });

    vi.mocked(useBloodRequestResponseModule.useBloodRequestResponse).mockReturnValue({
      respondToRequest: mockRespondToRequest,
      isLoading: false,
      error: null
    });

    render(
      <ResponseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
        onSuccess={mockOnSuccess}
      />
    );

    // Click confirm button
    const confirmButton = screen.getByText('تأكيد الاستجابة');
    fireEvent.click(confirmButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/حدث خطأ غير متوقع/)).toBeInTheDocument();
    });

    // Check that contact action is shown
    expect(screen.getByText('حسناً')).toBeInTheDocument();
    expect(screen.getByText(/إذا استمرت المشكلة، يرجى التواصل مع مستشفى غريان المركزي/)).toBeInTheDocument();
  });

  it('should allow retry when API error occurs', async () => {
    // Mock respondToRequest to return API error first, then success
    const mockRespondToRequest = vi.fn()
      .mockResolvedValueOnce({
        success: false,
        error: 'فشل الاتصال بالخادم',
        errorType: 'api'
      })
      .mockResolvedValueOnce({
        success: true,
        donationId: 123
      });

    vi.mocked(useBloodRequestResponseModule.useBloodRequestResponse).mockReturnValue({
      respondToRequest: mockRespondToRequest,
      isLoading: false,
      error: null
    });

    render(
      <ResponseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
        onSuccess={mockOnSuccess}
      />
    );

    // Click confirm button
    const confirmButton = screen.getByText('تأكيد الاستجابة');
    fireEvent.click(confirmButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/فشل الاتصال بالخادم/)).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByText('إعادة المحاولة');
    fireEvent.click(retryButton);

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/تم تسجيل استجابتك بنجاح/)).toBeInTheDocument();
    });

    // Verify respondToRequest was called twice
    expect(mockRespondToRequest).toHaveBeenCalledTimes(2);
  });

  it('should clear error when dismiss button is clicked', async () => {
    // Mock respondToRequest to return auth error
    const mockRespondToRequest = vi.fn().mockResolvedValue({
      success: false,
      error: 'يجب تسجيل الدخول للاستجابة لطلبات الدم',
      errorType: 'auth'
    });

    vi.mocked(useBloodRequestResponseModule.useBloodRequestResponse).mockReturnValue({
      respondToRequest: mockRespondToRequest,
      isLoading: false,
      error: null
    });

    render(
      <ResponseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
        onSuccess={mockOnSuccess}
      />
    );

    // Click confirm button
    const confirmButton = screen.getByText('تأكيد الاستجابة');
    fireEvent.click(confirmButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('يجب تسجيل الدخول للاستجابة لطلبات الدم')).toBeInTheDocument();
    });

    // Click dismiss button
    const dismissButton = screen.getByText('حسناً');
    fireEvent.click(dismissButton);

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText('يجب تسجيل الدخول للاستجابة لطلبات الدم')).not.toBeInTheDocument();
    });
  });
});
