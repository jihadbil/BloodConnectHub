import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResponseDialog } from './ResponseDialog';
import { BloodRequest } from '@/types/api';
import * as useBloodRequestResponseModule from '@/hooks/useBloodRequestResponse';
import * as fc from 'fast-check';
import { BLOOD_TYPE_MAP } from '@/types/api';

// Mock the hook
vi.mock('@/hooks/useBloodRequestResponse');

/**
 * Bug Condition Exploration Test for ResponseDialog Data Display
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3**
 * 
 * **Property 1: Bug Condition** - Dialog Data Display Matches Card Display
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * DO NOT attempt to fix the test or the code when it fails
 * 
 * This test encodes the expected behavior - it will validate the fix when it passes after implementation
 * 
 * GOAL: Surface counterexamples that demonstrate the bug exists
 */
describe('ResponseDialog Bug Condition Exploration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation
    vi.mocked(useBloodRequestResponseModule.useBloodRequestResponse).mockReturnValue({
      respondToRequest: vi.fn(),
      isLoading: false,
      error: null
    });
  });

  /**
   * Helper function to determine if a BloodRequest triggers the bug condition
   * Bug condition: Dialog is open AND data transformation is inconsistent
   */
  function isBugCondition(request: BloodRequest): boolean {
    // Bug manifests when:
    // 1. bloodType nested object is missing (only bloodTypeId present)
    // 2. urgencyLevel uses API enum values ('Normal', 'Urgent', 'Emergency')
    // 3. requestDate needs relative time formatting
    return (
      request.bloodType === undefined || 
      request.bloodType === null ||
      ['Normal', 'Urgent', 'Emergency'].includes(request.urgencyLevel)
    );
  }

  /**
   * Test Case 1: Blood type without nested object
   * bloodTypeId=1 should display "A+" not "فصيلة 1"
   */
  it('should display blood type correctly when bloodType object is missing (bloodTypeId=1 → "A+")', () => {
    const request: BloodRequest = {
      requestId: 1,
      patientId: 1,
      bloodTypeId: 1, // Should map to "A+"
      bloodType: undefined, // Missing nested object - triggers bug
      quantityNeeded: 2,
      urgencyLevel: 'Urgent',
      requestDate: '2024-01-15T10:00:00Z',
      requiredDate: '2024-01-20T10:00:00Z',
      status: 'Pending',
      notes: 'قسم الطوارئ',
      createdAt: '2024-01-15T10:00:00Z'
    };

    expect(isBugCondition(request)).toBe(true);

    render(
      <ResponseDialog
        open={true}
        onOpenChange={vi.fn()}
        request={request}
        onSuccess={vi.fn()}
      />
    );

    // Expected: Should display "A+" from BLOOD_TYPE_MAP[1]
    // Bug: Displays "فصيلة 1" because fallback doesn't work correctly
    const bloodTypeDisplay = screen.getByText(/فصيلة الدم: A\+/);
    expect(bloodTypeDisplay).toBeInTheDocument();
  });

  /**
   * Test Case 2: Urgency level 'Emergency' should display "حرج" badge
   */
  it('should display urgency level "حرج" for Emergency urgency', () => {
    const request: BloodRequest = {
      requestId: 2,
      patientId: 2,
      bloodTypeId: 2,
      bloodType: undefined,
      quantityNeeded: 3,
      urgencyLevel: 'Emergency', // API enum value
      requestDate: '2024-01-15T10:00:00Z',
      requiredDate: '2024-01-20T10:00:00Z',
      status: 'Pending',
      notes: 'حالة حرجة',
      createdAt: '2024-01-15T10:00:00Z'
    };

    expect(isBugCondition(request)).toBe(true);

    render(
      <ResponseDialog
        open={true}
        onOpenChange={vi.fn()}
        request={request}
        onSuccess={vi.fn()}
      />
    );

    // Expected: Should display "حرج" badge
    // Bug: May display wrong urgency or nothing because urgencyConfig keys don't match API enum
    const urgencyBadge = screen.getByText('حرج');
    expect(urgencyBadge).toBeInTheDocument();
  });

  /**
   * Test Case 3: Urgency level 'Urgent' should display "عاجل" badge
   */
  it('should display urgency level "عاجل" for Urgent urgency', () => {
    const request: BloodRequest = {
      requestId: 3,
      patientId: 3,
      bloodTypeId: 3,
      bloodType: undefined,
      quantityNeeded: 1,
      urgencyLevel: 'Urgent', // API enum value
      requestDate: '2024-01-15T10:00:00Z',
      requiredDate: '2024-01-20T10:00:00Z',
      status: 'Pending',
      notes: 'حالة عاجلة',
      createdAt: '2024-01-15T10:00:00Z'
    };

    expect(isBugCondition(request)).toBe(true);

    render(
      <ResponseDialog
        open={true}
        onOpenChange={vi.fn()}
        request={request}
        onSuccess={vi.fn()}
      />
    );

    // Expected: Should display "عاجل" badge
    const urgencyBadge = screen.getByText('عاجل');
    expect(urgencyBadge).toBeInTheDocument();
  });

  /**
   * Test Case 4: Request date from 3 hours ago should display "منذ 3 ساعة" not absolute date
   */
  it('should display request date in relative time format (3 hours ago → "منذ 3 ساعة")', () => {
    // Create a date 3 hours ago
    const threeHoursAgo = new Date();
    threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);

    const request: BloodRequest = {
      requestId: 4,
      patientId: 4,
      bloodTypeId: 4,
      bloodType: undefined,
      quantityNeeded: 2,
      urgencyLevel: 'Normal',
      requestDate: threeHoursAgo.toISOString(),
      requiredDate: '2024-01-20T10:00:00Z',
      status: 'Pending',
      notes: 'طلب عادي',
      createdAt: threeHoursAgo.toISOString()
    };

    expect(isBugCondition(request)).toBe(true);

    render(
      <ResponseDialog
        open={true}
        onOpenChange={vi.fn()}
        request={request}
        onSuccess={vi.fn()}
      />
    );

    // Expected: Should display "منذ 3 ساعة" (relative time)
    // Bug: Displays absolute date like "15/1/2024" using toLocaleDateString
    const dateDisplay = screen.getByText(/منذ 3 ساعة/);
    expect(dateDisplay).toBeInTheDocument();
  });

  /**
   * Property-Based Test: Blood type display for all blood type IDs
   * Tests that all bloodTypeId values (1-8) display correctly when bloodType object is missing
   */
  it('property: should display correct blood type for all bloodTypeId values without nested object', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 8 }), // bloodTypeId from 1 to 8
        (bloodTypeId) => {
          const request: BloodRequest = {
            requestId: bloodTypeId,
            patientId: bloodTypeId,
            bloodTypeId: bloodTypeId,
            bloodType: undefined, // Missing nested object - triggers bug
            quantityNeeded: 2,
            urgencyLevel: 'Normal',
            requestDate: '2024-01-15T10:00:00Z',
            requiredDate: '2024-01-20T10:00:00Z',
            status: 'Pending',
            notes: 'Test',
            createdAt: '2024-01-15T10:00:00Z'
          };

          const { unmount } = render(
            <ResponseDialog
              open={true}
              onOpenChange={vi.fn()}
              request={request}
              onSuccess={vi.fn()}
            />
          );

          // Expected blood type name from BLOOD_TYPE_MAP
          const expectedBloodType = BLOOD_TYPE_MAP[bloodTypeId];
          
          // Should display the correct blood type name, not "فصيلة [number]"
          const bloodTypeRegex = new RegExp(`فصيلة الدم: ${expectedBloodType.replace('+', '\\+')}`);
          const bloodTypeDisplay = screen.getByText(bloodTypeRegex);
          expect(bloodTypeDisplay).toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 8 } // Run for all 8 blood types
    );
  });

  /**
   * Property-Based Test: Urgency level display for all API enum values
   * Tests that all urgencyLevel API values map correctly to display labels
   */
  it('property: should display correct urgency badge for all urgency levels', () => {
    const urgencyLevels: Array<{ api: 'Normal' | 'Urgent' | 'Emergency', expected: string }> = [
      { api: 'Normal', expected: 'عادي' },
      { api: 'Urgent', expected: 'عاجل' },
      { api: 'Emergency', expected: 'حرج' }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...urgencyLevels),
        (urgencyLevel) => {
          const request: BloodRequest = {
            requestId: 1,
            patientId: 1,
            bloodTypeId: 1,
            bloodType: undefined,
            quantityNeeded: 2,
            urgencyLevel: urgencyLevel.api,
            requestDate: '2024-01-15T10:00:00Z',
            requiredDate: '2024-01-20T10:00:00Z',
            status: 'Pending',
            notes: 'Test',
            createdAt: '2024-01-15T10:00:00Z'
          };

          const { unmount } = render(
            <ResponseDialog
              open={true}
              onOpenChange={vi.fn()}
              request={request}
              onSuccess={vi.fn()}
            />
          );

          // Should display the correct urgency label
          const urgencyBadge = screen.getByText(urgencyLevel.expected);
          expect(urgencyBadge).toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 3 } // Run for all 3 urgency levels
    );
  });

  /**
   * Property-Based Test: Request date display in relative time format
   * Tests that various timestamps display in relative time format, not absolute
   */
  it('property: should display request date in relative time format for recent dates', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 23 }), // Hours ago (1-23 hours)
        (hoursAgo) => {
          const date = new Date();
          date.setHours(date.getHours() - hoursAgo);

          const request: BloodRequest = {
            requestId: 1,
            patientId: 1,
            bloodTypeId: 1,
            bloodType: undefined,
            quantityNeeded: 2,
            urgencyLevel: 'Normal',
            requestDate: date.toISOString(),
            requiredDate: '2024-01-20T10:00:00Z',
            status: 'Pending',
            notes: 'Test',
            createdAt: date.toISOString()
          };

          const { unmount } = render(
            <ResponseDialog
              open={true}
              onOpenChange={vi.fn()}
              request={request}
              onSuccess={vi.fn()}
            />
          );

          // Should display relative time format "منذ X ساعة"
          // Not absolute date format like "15/1/2024"
          const dateRegex = new RegExp(`منذ ${hoursAgo} ساعة`);
          const dateDisplay = screen.getByText(dateRegex);
          expect(dateDisplay).toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 10 } // Test with 10 different hour values
    );
  });
});
