/**
 * Bug Condition Exploration Test for Staff Dashboard Active Requests Display
 * 
 * **Validates: Requirements 2.1, 2.2**
 * 
 * This test explores the bug condition where pending blood requests exist in the database
 * but the table displays "no active requests" message instead of showing these requests.
 * 
 * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists.
 * **DO NOT attempt to fix the test or the code when it fails.**
 * 
 * The test encodes the expected behavior - it will validate the fix when it passes after implementation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import StaffDashboard from './StaffDashboard';
import * as useBloodRequestsModule from '@/hooks/useBloodRequests';
import * as useDonorsModule from '@/hooks/useDonors';
import * as usePatientsModule from '@/hooks/usePatients';

// Mock the hooks
vi.mock('@/hooks/useBloodRequests');
vi.mock('@/hooks/useDonors');
vi.mock('@/hooks/usePatients');

// Mock the layout components
vi.mock('@/components/layout/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

// Helper to create a test wrapper with React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('StaffDashboard - Bug Condition Exploration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Property 1: Bug Condition - Pending Requests Not Displayed in Table
   * 
   * This test verifies that when pendingRequestsData contains pending blood requests,
   * the table should display these requests (not the empty state message).
   * 
   * **EXPECTED OUTCOME**: Test FAILS on unfixed code (this is correct - it proves the bug exists)
   * 
   * The bug manifests as:
   * - pendingRequestsData.data.length > 0 (e.g., 3 pending requests)
   * - Stats counter shows "3" 
   * - Table shows "لا توجد طلبات نشطة" message instead of the requests
   */
  it('should display pending requests in table when pendingRequestsData contains data', async () => {
    // Arrange: Set up mock data that triggers the bug condition
    const mockPendingRequests = [
      {
        requestId: 1,
        bloodTypeId: 1,
        bloodType: { typeName: 'A+' },
        quantityNeeded: 2,
        urgencyLevel: 2, // Emergency
        requestDate: '2024-01-15T10:00:00Z',
        status: 'Pending',
        patient: { fullName: 'أحمد محمد' },
        notes: 'الطوارئ - حالة عاجلة',
      },
      {
        requestId: 2,
        bloodTypeId: 3,
        bloodType: { typeName: 'O+' },
        quantityNeeded: 1,
        urgencyLevel: 1, // Urgent
        requestDate: '2024-01-15T11:00:00Z',
        status: 'Pending',
        patient: { fullName: 'فاطمة علي' },
        notes: 'الجراحة - عملية مجدولة',
      },
      {
        requestId: 3,
        bloodTypeId: 2,
        bloodType: { typeName: 'B+' },
        quantityNeeded: 3,
        urgencyLevel: 0, // Normal
        requestDate: '2024-01-15T12:00:00Z',
        status: 'Pending',
        patient: { fullName: 'محمد حسن' },
        notes: 'الباطنة - علاج روتيني',
      },
    ];

    // Mock usePendingBloodRequests to return pending requests (this works correctly)
    vi.spyOn(useBloodRequestsModule, 'usePendingBloodRequests').mockReturnValue({
      data: {
        success: true,
        message: 'Success',
        data: mockPendingRequests,
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    // Mock useBloodRequests to return empty or non-pending data (simulating the bug)
    // This is the data source currently used for the table, which doesn't include pending requests
    vi.spyOn(useBloodRequestsModule, 'useBloodRequests').mockReturnValue({
      data: {
        success: true,
        message: 'Success',
        data: {
          items: [], // Empty or doesn't include pending requests
          totalCount: 0,
          totalPages: 0,
          currentPage: 1,
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    // Mock other hooks
    vi.spyOn(useDonorsModule, 'useDonors').mockReturnValue({
      data: {
        success: true,
        message: 'Success',
        data: { items: [], totalCount: 0, totalPages: 0, currentPage: 1 },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    vi.spyOn(usePatientsModule, 'usePatients').mockReturnValue({
      data: {
        success: true,
        message: 'Success',
        data: { items: [], totalCount: 0, totalPages: 0, currentPage: 1 },
      },
      isLoading: false,
      error: null,
    } as any);

    vi.spyOn(useBloodRequestsModule, 'useCreateBloodRequest').mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    vi.spyOn(useBloodRequestsModule, 'useCancelBloodRequest').mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    // Act: Render the component
    render(<StaffDashboard />, { wrapper: createWrapper() });

    // Wait for component to finish loading
    await waitFor(() => {
      expect(screen.queryByText(/جاري التحميل/i)).not.toBeInTheDocument();
    });

    // Assert: Verify the bug condition is satisfied
    // 1. Stats counter should show correct count (this works correctly)
    const statsCard = screen.getByText('طلبات نشطة').closest('.pt-6');
    expect(statsCard).toBeInTheDocument();
    expect(statsCard).toHaveTextContent('3'); // Stats counter shows correct count

    // 2. Table should display the pending requests (NOT the empty state message)
    // **CRITICAL ASSERTIONS - These will FAIL on unfixed code, confirming the bug**
    
    // Assert: Empty state message should NOT be visible
    const emptyMessage = screen.queryByText(/لا توجد طلبات نشطة/i);
    expect(emptyMessage).not.toBeInTheDocument();

    // Assert: Table should have rows equal to pendingRequestsData.data.length
    const tableRows = screen.getAllByRole('row').filter(row => {
      // Filter out header row
      return !row.querySelector('th');
    });
    expect(tableRows).toHaveLength(mockPendingRequests.length);

    // Assert: Each table row should display correct data
    expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
    expect(screen.getByText('فاطمة علي')).toBeInTheDocument();
    expect(screen.getByText('محمد حسن')).toBeInTheDocument();

    // Assert: Blood types should be displayed
    expect(screen.getByText('A+')).toBeInTheDocument();
    expect(screen.getByText('O+')).toBeInTheDocument();
    expect(screen.getByText('B+')).toBeInTheDocument();

    // Assert: Departments should be displayed
    expect(screen.getByText('الطوارئ')).toBeInTheDocument();
    expect(screen.getByText('الجراحة')).toBeInTheDocument();
    expect(screen.getByText('الباطنة')).toBeInTheDocument();

    // Assert: Units should be displayed
    const cells = screen.getAllByRole('cell');
    const unitCells = cells.filter(cell => cell.textContent === '2' || cell.textContent === '1' || cell.textContent === '3');
    expect(unitCells.length).toBeGreaterThan(0);

    // Assert: Urgency badges should be displayed
    expect(screen.getByText('حرج')).toBeInTheDocument(); // Emergency
    expect(screen.getByText('عاجل')).toBeInTheDocument(); // Urgent
    expect(screen.getByText('عادي')).toBeInTheDocument(); // Normal
  });

  /**
   * Counterexample Documentation:
   * 
   * When this test FAILS on unfixed code, it demonstrates the bug:
   * - Example 1: 3 pending requests exist → stats counter shows "3" → table shows empty message
   * - Example 2: pendingRequestsData.data.length = 3 → activeRequests.length = 0 → empty state displayed
   * - Example 3: usePendingBloodRequests() returns data → useBloodRequests() filter returns empty → table empty
   * 
   * Root Cause:
   * The component uses `requestsData?.data?.items?.filter(req => req.status === 'Pending')`
   * which returns an empty array, while `pendingRequestsData` correctly contains pending requests.
   * 
   * Expected Fix:
   * Change the data source for `activeRequests` from filtered `requestsData` to `pendingRequestsData`.
   */
});

/**
 * Property 2: Preservation - Non-Table Functionality Unchanged
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 * 
 * These tests verify that non-table functionality remains unchanged after the fix.
 * They use property-based testing to generate many test cases for stronger guarantees.
 * 
 * **IMPORTANT**: These tests should PASS on unfixed code to establish baseline behavior.
 * 
 * The tests focus on:
 * - Empty state message displays when genuinely no pending requests exist
 * - Stats counter continues to show correct count from usePendingBloodRequests()
 * - Donor tab functionality remains completely unchanged
 * - Refresh button, cancel button, and other UI interactions work identically
 * - New request dialog and creation flow work the same way
 */

import * as fc from 'fast-check';
import { fireEvent } from '@testing-library/react';

describe('StaffDashboard - Preservation Properties', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Property 2.1: Empty State Preservation
   * 
   * When there are genuinely no pending requests (pendingRequestsData.data.length === 0),
   * the component should display the empty state message exactly as before.
   * 
   * **EXPECTED OUTCOME**: Test PASSES on unfixed code (confirms baseline behavior)
   */
  it('should display empty state message when no pending requests exist', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random completed/cancelled requests count (0-10)
        fc.integer({ min: 0, max: 10 }),
        async (completedCount) => {
          // Arrange: Set up mock data with NO pending requests
          vi.spyOn(useBloodRequestsModule, 'usePendingBloodRequests').mockReturnValue({
            data: {
              success: true,
              message: 'Success',
              data: [], // No pending requests
            },
            isLoading: false,
            error: null,
            refetch: vi.fn(),
          } as any);

          vi.spyOn(useBloodRequestsModule, 'useBloodRequests').mockReturnValue({
            data: {
              success: true,
              message: 'Success',
              data: {
                items: [],
                totalCount: completedCount,
                totalPages: 0,
                currentPage: 1,
              },
            },
            isLoading: false,
            error: null,
            refetch: vi.fn(),
          } as any);

          vi.spyOn(useDonorsModule, 'useDonors').mockReturnValue({
            data: {
              success: true,
              message: 'Success',
              data: { items: [], totalCount: 0, totalPages: 0, currentPage: 1 },
            },
            isLoading: false,
            error: null,
            refetch: vi.fn(),
          } as any);

          vi.spyOn(usePatientsModule, 'usePatients').mockReturnValue({
            data: {
              success: true,
              message: 'Success',
              data: { items: [], totalCount: 0, totalPages: 0, currentPage: 1 },
            },
            isLoading: false,
            error: null,
          } as any);

          vi.spyOn(useBloodRequestsModule, 'useCreateBloodRequest').mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false,
          } as any);

          vi.spyOn(useBloodRequestsModule, 'useCancelBloodRequest').mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false,
          } as any);

          // Act: Render the component
          const { unmount } = render(<StaffDashboard />, { wrapper: createWrapper() });

          // Wait for component to finish loading
          await waitFor(() => {
            expect(screen.queryByText(/جاري التحميل/i)).not.toBeInTheDocument();
          });

          // Assert: Empty state message should be visible
          const emptyMessage = screen.getByText(/لا توجد طلبات نشطة/i);
          expect(emptyMessage).toBeInTheDocument();

          // Assert: Stats counter should show 0 active requests
          const statsCard = screen.getByText('طلبات نشطة').closest('.pt-6');
          expect(statsCard).toBeInTheDocument();
          expect(statsCard).toHaveTextContent('0');

          // Cleanup
          unmount();
        }
      ),
      { numRuns: 10 } // Run 10 test cases with different completed counts
    );
  });

  /**
   * Property 2.2: Stats Counter Preservation
   * 
   * The stats counter should continue to show the correct count from usePendingBloodRequests()
   * regardless of the data in useBloodRequests().
   * 
   * **EXPECTED OUTCOME**: Test PASSES on unfixed code (confirms baseline behavior)
   */
  it('should display correct stats counter from usePendingBloodRequests', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random pending requests count (0-20)
        fc.integer({ min: 0, max: 20 }),
        // Generate random completed requests count (0-50)
        fc.integer({ min: 0, max: 50 }),
        // Generate random donors count (0-100)
        fc.integer({ min: 0, max: 100 }),
        async (pendingCount, completedCount, donorsCount) => {
          // Arrange: Set up mock data with specific counts
          const mockPendingRequests = Array.from({ length: pendingCount }, (_, i) => ({
            requestId: i + 1,
            bloodTypeId: (i % 8) + 1,
            bloodType: { typeName: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][i % 8] },
            quantityNeeded: (i % 3) + 1,
            urgencyLevel: i % 3,
            requestDate: new Date().toISOString(),
            status: 'Pending',
            patient: { fullName: `مريض ${i + 1}` },
            notes: `قسم ${i % 3}`,
          }));

          vi.spyOn(useBloodRequestsModule, 'usePendingBloodRequests').mockReturnValue({
            data: {
              success: true,
              message: 'Success',
              data: mockPendingRequests,
            },
            isLoading: false,
            error: null,
            refetch: vi.fn(),
          } as any);

          vi.spyOn(useBloodRequestsModule, 'useBloodRequests').mockReturnValue({
            data: {
              success: true,
              message: 'Success',
              data: {
                items: [],
                totalCount: pendingCount + completedCount,
                totalPages: 0,
                currentPage: 1,
              },
            },
            isLoading: false,
            error: null,
            refetch: vi.fn(),
          } as any);

          vi.spyOn(useDonorsModule, 'useDonors').mockReturnValue({
            data: {
              success: true,
              message: 'Success',
              data: { items: [], totalCount: donorsCount, totalPages: 0, currentPage: 1 },
            },
            isLoading: false,
            error: null,
            refetch: vi.fn(),
          } as any);

          vi.spyOn(usePatientsModule, 'usePatients').mockReturnValue({
            data: {
              success: true,
              message: 'Success',
              data: { items: [], totalCount: 0, totalPages: 0, currentPage: 1 },
            },
            isLoading: false,
            error: null,
          } as any);

          vi.spyOn(useBloodRequestsModule, 'useCreateBloodRequest').mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false,
          } as any);

          vi.spyOn(useBloodRequestsModule, 'useCancelBloodRequest').mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false,
          } as any);

          // Act: Render the component
          const { unmount } = render(<StaffDashboard />, { wrapper: createWrapper() });

          // Wait for component to finish loading
          await waitFor(() => {
            expect(screen.queryByText(/جاري التحميل/i)).not.toBeInTheDocument();
          });

          // Assert: Stats counter should show correct pending count
          const activeRequestsCard = screen.getByText('طلبات نشطة').closest('.pt-6');
          expect(activeRequestsCard).toBeInTheDocument();
          expect(activeRequestsCard).toHaveTextContent(pendingCount.toString());

          // Assert: Completed requests counter should show correct count
          const completedRequestsCard = screen.getByText('طلبات مكتملة').closest('.pt-6');
          expect(completedRequestsCard).toBeInTheDocument();
          expect(completedRequestsCard).toHaveTextContent(completedCount.toString());

          // Assert: Donors counter should show correct count
          const donorsCard = screen.getByText('إجمالي المتبرعين').closest('.pt-6');
          expect(donorsCard).toBeInTheDocument();
          expect(donorsCard).toHaveTextContent(donorsCount.toString());

          // Cleanup
          unmount();
        }
      ),
      { numRuns: 10 } // Run 10 test cases with different counts
    );
  });

  /**
   * Property 2.3: Donor Tab Preservation
   * 
   * The donor tab functionality should remain completely unchanged.
   * This test verifies that the donor tab is accessible and displays correctly.
   * 
   * **EXPECTED OUTCOME**: Test PASSES on unfixed code (confirms baseline behavior)
   */
  it('should preserve donor tab functionality unchanged', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random donor count (0-20)
        fc.integer({ min: 0, max: 20 }),
        async (donorCount) => {
          // Arrange: Set up mock data
          vi.spyOn(useBloodRequestsModule, 'usePendingBloodRequests').mockReturnValue({
            data: {
              success: true,
              message: 'Success',
              data: [],
            },
            isLoading: false,
            error: null,
            refetch: vi.fn(),
          } as any);

          vi.spyOn(useBloodRequestsModule, 'useBloodRequests').mockReturnValue({
            data: {
              success: true,
              message: 'Success',
              data: {
                items: [],
                totalCount: 0,
                totalPages: 0,
                currentPage: 1,
              },
            },
            isLoading: false,
            error: null,
            refetch: vi.fn(),
          } as any);

          vi.spyOn(useDonorsModule, 'useDonors').mockReturnValue({
            data: {
              success: true,
              message: 'Success',
              data: {
                items: [],
                totalCount: donorCount,
                totalPages: 0,
                currentPage: 1,
              },
            },
            isLoading: false,
            error: null,
            refetch: vi.fn(),
          } as any);

          vi.spyOn(usePatientsModule, 'usePatients').mockReturnValue({
            data: {
              success: true,
              message: 'Success',
              data: { items: [], totalCount: 0, totalPages: 0, currentPage: 1 },
            },
            isLoading: false,
            error: null,
          } as any);

          vi.spyOn(useBloodRequestsModule, 'useCreateBloodRequest').mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false,
          } as any);

          vi.spyOn(useBloodRequestsModule, 'useCancelBloodRequest').mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false,
          } as any);

          // Act: Render the component
          const { unmount } = render(<StaffDashboard />, { wrapper: createWrapper() });

          // Wait for component to finish loading
          await waitFor(() => {
            expect(screen.queryByText(/جاري التحميل/i)).not.toBeInTheDocument();
          });

          // Assert: Donor tab should be present and accessible
          const donorsTabs = screen.getAllByRole('tab', { name: /المتبرعين/i });
          expect(donorsTabs.length).toBeGreaterThan(0);

          // Assert: Requests tab should be present (default tab)
          const requestsTabs = screen.getAllByRole('tab', { name: /طلبات الدم/i });
          expect(requestsTabs.length).toBeGreaterThan(0);

          // Cleanup
          unmount();
        }
      ),
      { numRuns: 5 } // Run 5 test cases with different donor counts
    );
  });

  /**
   * Property 2.4: Button Actions Preservation
   * 
   * UI buttons and interactions should remain accessible and functional.
   * This test verifies that key buttons are present and can be interacted with.
   * 
   * **EXPECTED OUTCOME**: Test PASSES on unfixed code (confirms baseline behavior)
   */
  it('should preserve button functionality and accessibility', async () => {
    // Arrange: Set up mock data
    vi.spyOn(useBloodRequestsModule, 'usePendingBloodRequests').mockReturnValue({
      data: {
        success: true,
        message: 'Success',
        data: [],
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    vi.spyOn(useBloodRequestsModule, 'useBloodRequests').mockReturnValue({
      data: {
        success: true,
        message: 'Success',
        data: {
          items: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: 1,
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    vi.spyOn(useDonorsModule, 'useDonors').mockReturnValue({
      data: {
        success: true,
        message: 'Success',
        data: { items: [], totalCount: 0, totalPages: 0, currentPage: 1 },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    vi.spyOn(usePatientsModule, 'usePatients').mockReturnValue({
      data: {
        success: true,
        message: 'Success',
        data: { items: [], totalCount: 0, totalPages: 0, currentPage: 1 },
      },
      isLoading: false,
      error: null,
    } as any);

    vi.spyOn(useBloodRequestsModule, 'useCreateBloodRequest').mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    vi.spyOn(useBloodRequestsModule, 'useCancelBloodRequest').mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    // Act: Render the component
    render(<StaffDashboard />, { wrapper: createWrapper() });

    // Wait for component to finish loading
    await waitFor(() => {
      expect(screen.queryByText(/جاري التحميل/i)).not.toBeInTheDocument();
    });

    // Assert: New request button should be present
    const newRequestButton = screen.getByRole('button', { name: /طلب دم جديد/i });
    expect(newRequestButton).toBeInTheDocument();

    // Assert: Refresh button should be present
    const refreshButtons = screen.getAllByRole('button', { name: /تحديث/i });
    expect(refreshButtons.length).toBeGreaterThan(0);

    // Assert: Tab buttons should be present
    const requestsTabs = screen.getAllByRole('tab', { name: /طلبات الدم/i });
    expect(requestsTabs.length).toBeGreaterThan(0);

    const donorsTabs = screen.getAllByRole('tab', { name: /المتبرعين/i });
    expect(donorsTabs.length).toBeGreaterThan(0);
  });

  /**
   * Property 2.5: New Request Dialog Preservation
   * 
   * The new request dialog and creation flow should work the same way.
   * 
   * **EXPECTED OUTCOME**: Test PASSES on unfixed code (confirms baseline behavior)
   */
  it('should preserve new request dialog functionality', async () => {
    // Arrange: Set up mock data with patients
    const mockPatients = [
      { patientID: 1, fullName: 'أحمد محمد', nationalID: '123456789' },
      { patientID: 2, fullName: 'فاطمة علي', nationalID: '987654321' },
    ];

    vi.spyOn(useBloodRequestsModule, 'usePendingBloodRequests').mockReturnValue({
      data: {
        success: true,
        message: 'Success',
        data: [],
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    vi.spyOn(useBloodRequestsModule, 'useBloodRequests').mockReturnValue({
      data: {
        success: true,
        message: 'Success',
        data: {
          items: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: 1,
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    vi.spyOn(useDonorsModule, 'useDonors').mockReturnValue({
      data: {
        success: true,
        message: 'Success',
        data: { items: [], totalCount: 0, totalPages: 0, currentPage: 1 },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    vi.spyOn(usePatientsModule, 'usePatients').mockReturnValue({
      data: {
        success: true,
        message: 'Success',
        data: { items: mockPatients, totalCount: mockPatients.length, totalPages: 1, currentPage: 1 },
      },
      isLoading: false,
      error: null,
    } as any);

    vi.spyOn(useBloodRequestsModule, 'useCreateBloodRequest').mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    vi.spyOn(useBloodRequestsModule, 'useCancelBloodRequest').mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    // Act: Render the component
    render(<StaffDashboard />, { wrapper: createWrapper() });

    // Wait for component to finish loading
    await waitFor(() => {
      expect(screen.queryByText(/جاري التحميل/i)).not.toBeInTheDocument();
    });

    // Act: Click "طلب دم جديد" button to open dialog
    const newRequestButton = screen.getByRole('button', { name: /طلب دم جديد/i });
    fireEvent.click(newRequestButton);

    // Assert: Dialog should open with form fields
    await waitFor(() => {
      expect(screen.getByText('إنشاء طلب دم جديد')).toBeInTheDocument();
      expect(screen.getByText('المريض')).toBeInTheDocument();
      expect(screen.getByText('فصيلة الدم المطلوبة')).toBeInTheDocument();
      expect(screen.getByText('عدد الوحدات')).toBeInTheDocument();
      expect(screen.getByText('القسم')).toBeInTheDocument();
      expect(screen.getByText('مستوى الاستعجال')).toBeInTheDocument();
      expect(screen.getByText('ملاحظات إضافية')).toBeInTheDocument();
    });

    // Assert: Cancel button should be present
    const cancelButton = screen.getByRole('button', { name: /إلغاء/i });
    expect(cancelButton).toBeInTheDocument();

    // Act: Click cancel to close dialog
    fireEvent.click(cancelButton);

    // Assert: Dialog should close
    await waitFor(() => {
      expect(screen.queryByText('إنشاء طلب دم جديد')).not.toBeInTheDocument();
    });
  });
});
