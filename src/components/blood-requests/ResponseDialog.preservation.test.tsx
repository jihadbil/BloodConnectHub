import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResponseDialog } from './ResponseDialog';
import { BloodRequest } from '@/types/api';
import * as useBloodRequestResponseModule from '@/hooks/useBloodRequestResponse';
import * as fc from 'fast-check';
import { BLOOD_TYPE_MAP } from '@/types/api';

// Mock the hook
vi.mock('@/hooks/useBloodRequestResponse');

/**
 * Preservation Property Tests for ResponseDialog
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
 * 
 * **Property 2: Preservation** - Non-Display Functionality Unchanged
 * 
 * IMPORTANT: Follow observation-first methodology
 * These tests observe behavior on UNFIXED code for non-buggy inputs
 * (dialog interactions that don't involve date display)
 * 
 * EXPECTED OUTCOME: Tests PASS on unfixed code (confirms baseline behavior to preserve)
 */
describe('ResponseDialog Preservation Property Tests', () => {
  let mockRespondToRequest: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRespondToRequest = vi.fn();
    
    // Default mock implementation
    vi.mocked(useBloodRequestResponseModule.useBloodRequestResponse).mockReturnValue({
      respondToRequest: mockRespondToRequest,
      isLoading: false,
      error: null
    });
  });

  /**
   * Helper: Create a valid BloodRequest for testing
   */
  function createTestRequest(overrides?: Partial<BloodRequest>): BloodRequest {
    return {
      requestId: 1,
      patientId: 1,
      bloodTypeId: 1,
      bloodType: undefined,
      quantityNeeded: 2,
      urgencyLevel: 'Urgent',
      requestDate: '2024-01-15T10:00:00Z',
      requiredDate: '2024-01-20T10:00:00Z',
      status: 'Pending',
      notes: 'قسم الطوارئ',
      createdAt: '2024-01-15T10:00:00Z',
      ...overrides
    };
  }

  /**
   * Test Case 1: Dialog submission calls API correctly
   * Requirement 3.2: Dialog submission functionality must remain unchanged
   */
  it('should call respondToRequest API with correct parameters when confirming', async () => {
    const user = userEvent.setup();
    const request = createTestRequest({
      requestId: 123,
      bloodTypeId: 2,
      quantityNeeded: 3
    });

    mockRespondToRequest.mockResolvedValue({
      success: true,
      donationId: 456
    });

    render(
      <ResponseDialog
        open={true}
        onOpenChange={vi.fn()}
        request={request}
        onSuccess={vi.fn()}
      />
    );

    // Click confirm button
    const confirmButton = screen.getByRole('button', { name: /تأكيد الاستجابة/ });
    await user.click(confirmButton);

    // Verify API was called with correct parameters
    expect(mockRespondToRequest).toHaveBeenCalledWith(123, 2, 3);
    expect(mockRespondToRequest).toHaveBeenCalledTimes(1);
  });

  /**
   * Test Case 2: Error handling displays errors with appropriate actions
   * Requirement 3.5: Error messages must continue to display correctly
   */
  it('should display error message with retry action for API errors', async () => {
    const user = userEvent.setup();
    const request = createTestRequest();

    mockRespondToRequest.mockResolvedValue({
      success: false,
      error: 'فشل الاتصال بالخادم',
      errorType: 'api'
    });

    render(
      <ResponseDialog
        open={true}
        onOpenChange={vi.fn()}
        request={request}
        onSuccess={vi.fn()}
      />
    );

    // Click confirm button
    const confirmButton = screen.getByRole('button', { name: /تأكيد الاستجابة/ });
    await user.click(confirmButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('فشل الاتصال بالخادم')).toBeInTheDocument();
    });

    // Verify retry button is present for API errors
    const retryButton = screen.getByRole('button', { name: /إعادة المحاولة/ });
    expect(retryButton).toBeInTheDocument();
  });

  /**
   * Test Case 3: Success message displays with donation ID
   * Requirement 3.6: Success messages must continue to display correctly
   */
  it('should display success message with donation ID after successful submission', async () => {
    const user = userEvent.setup();
    const request = createTestRequest();

    mockRespondToRequest.mockResolvedValue({
      success: true,
      donationId: 789
    });

    render(
      <ResponseDialog
        open={true}
        onOpenChange={vi.fn()}
        request={request}
        onSuccess={vi.fn()}
      />
    );

    // Click confirm button
    const confirmButton = screen.getByRole('button', { name: /تأكيد الاستجابة/ });
    await user.click(confirmButton);

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/تم تسجيل استجابتك بنجاح!/)).toBeInTheDocument();
    });

    // Verify donation ID is displayed
    expect(screen.getByText(/#789/)).toBeInTheDocument();
  });

  /**
   * Test Case 4: Other fields display correctly
   * Requirement 3.3: Other data fields must continue to display correctly
   */
  it('should display quantityNeeded, notes, and hospital info correctly', () => {
    const request = createTestRequest({
      quantityNeeded: 5,
      notes: 'حالة طارئة - قسم العناية المركزة'
    });

    render(
      <ResponseDialog
        open={true}
        onOpenChange={vi.fn()}
        request={request}
        onSuccess={vi.fn()}
      />
    );

    // Verify quantity is displayed
    expect(screen.getByText(/الكمية المطلوبة: 5 وحدة/)).toBeInTheDocument();

    // Verify notes are displayed
    expect(screen.getByText('حالة طارئة - قسم العناية المركزة')).toBeInTheDocument();

    // Verify hospital info is displayed
    expect(screen.getByText('مستشفى غريان المركزي')).toBeInTheDocument();
  });

  /**
   * Test Case 5: Dialog open/close behavior works correctly
   * Requirement 3.4: Dialog interactions must remain unchanged
   */
  it('should call onOpenChange when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const request = createTestRequest();
    const onOpenChange = vi.fn();

    render(
      <ResponseDialog
        open={true}
        onOpenChange={onOpenChange}
        request={request}
        onSuccess={vi.fn()}
      />
    );

    // Click cancel button
    const cancelButton = screen.getByRole('button', { name: /إلغاء/ });
    await user.click(cancelButton);

    // Verify onOpenChange was called with false
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  /**
   * Property-Based Test: Dialog submission with various valid inputs
   * Tests that submission works correctly across many different request configurations
   */
  it('property: should handle submission correctly for various blood request configurations', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 1000 }), // requestId
        fc.integer({ min: 1, max: 8 }), // bloodTypeId
        fc.integer({ min: 1, max: 10 }), // quantityNeeded
        fc.constantFrom('Normal', 'Urgent', 'Emergency'), // urgencyLevel
        async (requestId, bloodTypeId, quantityNeeded, urgencyLevel) => {
          const user = userEvent.setup();
          const mockFn = vi.fn().mockResolvedValue({
            success: true,
            donationId: requestId + 1000
          });

          vi.mocked(useBloodRequestResponseModule.useBloodRequestResponse).mockReturnValue({
            respondToRequest: mockFn,
            isLoading: false,
            error: null
          });

          const request = createTestRequest({
            requestId,
            bloodTypeId,
            quantityNeeded,
            urgencyLevel: urgencyLevel as 'Normal' | 'Urgent' | 'Emergency'
          });

          const { unmount } = render(
            <ResponseDialog
              open={true}
              onOpenChange={vi.fn()}
              request={request}
              onSuccess={vi.fn()}
            />
          );

          // Click confirm button
          const confirmButton = screen.getByRole('button', { name: /تأكيد الاستجابة/ });
          await user.click(confirmButton);

          // Verify API was called with correct parameters
          await waitFor(() => {
            expect(mockFn).toHaveBeenCalledWith(requestId, bloodTypeId, quantityNeeded);
          });

          unmount();
        }
      ),
      { numRuns: 20 } // Test with 20 different configurations
    );
  });

  /**
   * Property-Based Test: Error handling for different error types
   * Tests that all error types display appropriate actions
   */
  it('property: should display appropriate error actions for all error types', async () => {
    const errorTypes: Array<{
      type: 'auth' | 'compatibility' | 'eligibility' | 'api' | 'unknown';
      expectedAction: string;
    }> = [
      { type: 'auth', expectedAction: 'حسناً' },
      { type: 'compatibility', expectedAction: 'فهمت' },
      { type: 'eligibility', expectedAction: 'فهمت' },
      { type: 'api', expectedAction: 'إعادة المحاولة' },
      { type: 'unknown', expectedAction: 'حسناً' }
    ];

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...errorTypes),
        async (errorConfig) => {
          const user = userEvent.setup();
          const mockFn = vi.fn().mockResolvedValue({
            success: false,
            error: `خطأ من نوع ${errorConfig.type}`,
            errorType: errorConfig.type
          });

          vi.mocked(useBloodRequestResponseModule.useBloodRequestResponse).mockReturnValue({
            respondToRequest: mockFn,
            isLoading: false,
            error: null
          });

          const request = createTestRequest();

          const { unmount } = render(
            <ResponseDialog
              open={true}
              onOpenChange={vi.fn()}
              request={request}
              onSuccess={vi.fn()}
            />
          );

          // Click confirm button
          const confirmButton = screen.getByRole('button', { name: /تأكيد الاستجابة/ });
          await user.click(confirmButton);

          // Wait for error to appear
          await waitFor(() => {
            expect(screen.getByText(`خطأ من نوع ${errorConfig.type}`)).toBeInTheDocument();
          });

          // Verify appropriate action button is present
          const actionButton = screen.getByRole('button', { name: errorConfig.expectedAction });
          expect(actionButton).toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 5 } // Test all 5 error types
    );
  });

  /**
   * Property-Based Test: Blood type and quantity display preservation
   * Tests that blood type names and quantities display correctly for all valid combinations
   */
  it('property: should display blood type and quantity correctly for all valid combinations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 8 }), // bloodTypeId
        fc.integer({ min: 1, max: 10 }), // quantityNeeded
        (bloodTypeId, quantityNeeded) => {
          const request = createTestRequest({
            bloodTypeId,
            quantityNeeded
          });

          const { unmount } = render(
            <ResponseDialog
              open={true}
              onOpenChange={vi.fn()}
              request={request}
              onSuccess={vi.fn()}
            />
          );

          // Verify blood type is displayed correctly
          const expectedBloodType = BLOOD_TYPE_MAP[bloodTypeId];
          const bloodTypeRegex = new RegExp(`فصيلة الدم: ${expectedBloodType.replace('+', '\\+')}`);
          expect(screen.getByText(bloodTypeRegex)).toBeInTheDocument();

          // Verify quantity is displayed correctly
          expect(screen.getByText(`الكمية المطلوبة: ${quantityNeeded} وحدة`)).toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 20 } // Test 20 different combinations
    );
  });

  /**
   * Property-Based Test: Notes field display preservation
   * Tests that notes display correctly for various text inputs
   */
  it('property: should display notes correctly for various text inputs', () => {
    const notesExamples = [
      'قسم الطوارئ',
      'حالة حرجة - يحتاج دم فوراً',
      'مريض في العناية المركزة',
      'عملية جراحية طارئة',
      'حادث سير - إصابات متعددة'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...notesExamples),
        (notes) => {
          const request = createTestRequest({ notes });

          const { unmount } = render(
            <ResponseDialog
              open={true}
              onOpenChange={vi.fn()}
              request={request}
              onSuccess={vi.fn()}
            />
          );

          // Verify notes are displayed
          expect(screen.getByText(notes)).toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 5 } // Test all 5 note examples
    );
  });

  /**
   * Property-Based Test: Urgency badge display preservation
   * Tests that urgency badges display correctly for all urgency levels
   */
  it('property: should display urgency badge correctly for all urgency levels', () => {
    const urgencyLevels: Array<{
      api: 'Normal' | 'Urgent' | 'Emergency';
      label: string;
    }> = [
      { api: 'Normal', label: 'عادي' },
      { api: 'Urgent', label: 'عاجل' },
      { api: 'Emergency', label: 'حرج' }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...urgencyLevels),
        (urgency) => {
          const request = createTestRequest({
            urgencyLevel: urgency.api
          });

          const { unmount } = render(
            <ResponseDialog
              open={true}
              onOpenChange={vi.fn()}
              request={request}
              onSuccess={vi.fn()}
            />
          );

          // Verify urgency badge is displayed with correct label
          expect(screen.getByText(urgency.label)).toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 3 } // Test all 3 urgency levels
    );
  });

  /**
   * Property-Based Test: Dialog state management preservation
   * Tests that dialog state (loading, error, success) is managed correctly
   */
  it('property: should manage dialog state correctly during submission lifecycle', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(), // success or failure
        fc.option(fc.integer({ min: 1, max: 9999 }), { nil: null }), // optional donationId
        async (isSuccess, donationId) => {
          const user = userEvent.setup();
          const mockFn = vi.fn().mockResolvedValue(
            isSuccess
              ? { success: true, donationId: donationId || 123 }
              : { success: false, error: 'خطأ في الاتصال', errorType: 'api' }
          );

          vi.mocked(useBloodRequestResponseModule.useBloodRequestResponse).mockReturnValue({
            respondToRequest: mockFn,
            isLoading: false,
            error: null
          });

          const request = createTestRequest();

          const { unmount } = render(
            <ResponseDialog
              open={true}
              onOpenChange={vi.fn()}
              request={request}
              onSuccess={vi.fn()}
            />
          );

          // Click confirm button
          const confirmButton = screen.getByRole('button', { name: /تأكيد الاستجابة/ });
          await user.click(confirmButton);

          // Verify appropriate state is displayed
          if (isSuccess) {
            await waitFor(() => {
              expect(screen.getByText(/تم تسجيل استجابتك بنجاح!/)).toBeInTheDocument();
            });
          } else {
            await waitFor(() => {
              expect(screen.getByText('خطأ في الاتصال')).toBeInTheDocument();
            });
          }

          unmount();
        }
      ),
      { numRuns: 10 } // Test 10 different state scenarios
    );
  });
});
