# Staff Dashboard Active Requests Display Fix - Bugfix Design

## Overview

The staff dashboard (`/staff/dashboard`) has a bug where the active blood requests table displays "no active requests" message even when there are pending blood requests in the database. The root cause is that the component filters `requestsData` (from `useBloodRequests()`) by status === 'Pending', but this data source may not contain pending requests or may use a different status format. Meanwhile, `usePendingBloodRequests()` successfully fetches pending requests and is used for the stats counter, but not for the table display.

The fix is straightforward: use the data from `usePendingBloodRequests()` directly for the table instead of filtering `requestsData`.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when pending blood requests exist in the database but the table shows "no active requests"
- **Property (P)**: The desired behavior - the table should display all pending requests from `usePendingBloodRequests()`
- **Preservation**: Mouse clicks, pagination, refresh functionality, and all other UI interactions must remain unchanged
- **activeRequests**: The computed array used to populate the table, currently derived from filtered `requestsData`
- **pendingRequestsData**: The data from `usePendingBloodRequests()` hook that correctly fetches pending requests
- **requestsData**: The data from `useBloodRequests()` hook that fetches paginated requests of all statuses

## Bug Details

### Bug Condition

The bug manifests when there are blood requests with status "Pending" in the database, but the staff dashboard table displays the "no active requests" message instead of showing these requests. The issue occurs because the code filters `requestsData?.data?.items` by `req.status === 'Pending'`, which returns an empty array even though `usePendingBloodRequests()` successfully retrieves pending requests.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { pendingRequestsData, requestsData, activeRequests }
  OUTPUT: boolean
  
  RETURN (pendingRequestsData?.data?.length > 0)
         AND (activeRequests.length === 0)
         AND (table displays "no active requests" message)
END FUNCTION
```

### Examples

- **Example 1**: Database has 3 pending blood requests → `pendingRequestsData.data.length = 3` → `activeRequests.length = 0` → Table shows "لا توجد طلبات نشطة - جميع الطلبات تم تلبيتها"
- **Example 2**: Database has 1 urgent pending request → Stats counter shows "1" → Table shows empty state message
- **Example 3**: User creates a new blood request → Stats counter increments → Table still shows "no active requests"
- **Edge case**: Database has 0 pending requests → Both stats counter and table should show 0/empty state (this currently works correctly)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- The stats counter "طلبات نشطة" must continue to display the correct count from `usePendingBloodRequests()`
- The table structure, columns, and formatting must remain exactly the same
- The refresh button functionality must continue to work
- The pagination controls must continue to work (though may need adjustment for the new data source)
- The cancel request functionality must continue to work
- The "no active requests" message must still appear when there are genuinely 0 pending requests
- All other tabs (donors) and UI elements must remain completely unaffected

**Scope:**
All functionality that does NOT involve the display of pending requests in the table should be completely unaffected by this fix. This includes:
- Donor management tab and its table
- Stats cards display
- New request creation dialog
- Navigation and header
- All button interactions (view, edit, cancel)

## Hypothesized Root Cause

Based on the bug description and code analysis, the root cause is:

1. **Incorrect Data Source**: The `activeRequests` variable is computed by filtering `requestsData?.data?.items` with `req.status === 'Pending'`, but this data source either:
   - Does not include pending requests (only returns other statuses)
   - Uses a different status value format that doesn't match the string 'Pending'
   - Returns paginated data that may not include pending requests on the current page

2. **Unused Correct Data Source**: The component already fetches `pendingRequestsData` from `usePendingBloodRequests()`, which successfully retrieves pending requests (as evidenced by the correct stats counter), but this data is not used for the table display.

3. **Data Structure Mismatch**: The `requestsData` from `useBloodRequests()` may have a different structure or status enumeration than expected, causing the filter to fail.

## Correctness Properties

Property 1: Bug Condition - Display Pending Requests in Table

_For any_ state where `pendingRequestsData` contains pending blood requests (length > 0), the fixed component SHALL display these requests in the active requests table with all their details (blood type, patient, department, units, urgency, date), and SHALL NOT display the "no active requests" message.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Empty State Display

_For any_ state where there are genuinely no pending requests in the database (`pendingRequestsData.data.length === 0`), the fixed component SHALL display the "no active requests" message exactly as before, preserving the empty state UI behavior.

**Validates: Requirements 3.1, 3.6**

Property 3: Preservation - Non-Table Functionality

_For any_ user interaction that does NOT involve the active requests table display (donor tab, stats cards, new request dialog, cancel button, refresh button), the fixed component SHALL produce exactly the same behavior as the original component, preserving all existing functionality.

**Validates: Requirements 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

**File**: `src/pages/StaffDashboard.tsx`

**Function**: `StaffDashboard` component (lines ~110-130)

**Specific Changes**:

1. **Replace Data Source for activeRequests**: Change the computation of `activeRequests` from filtering `requestsData` to directly using `pendingRequestsData`
   - Current code (lines ~110-125):
     ```typescript
     const activeRequests = requestsData?.data?.items?.filter(req => req.status === 'Pending').map(req => {
       // ... transformation logic
     }) || [];
     ```
   - Fixed code:
     ```typescript
     const activeRequests = pendingRequestsData?.data?.map(req => {
       // ... same transformation logic
     }) || [];
     ```

2. **Update Loading State**: Change the loading condition for the table to use `pendingLoading` instead of `requestsLoading`
   - Current code (line ~450): `{requestsLoading ? (`
   - Fixed code: `{pendingLoading ? (`

3. **Remove or Update Pagination**: Since `usePendingBloodRequests()` returns all pending requests (not paginated), either:
   - Remove the pagination controls for the active requests table, OR
   - Implement client-side pagination if needed

4. **Keep requestsData for Stats**: The `requestsData` should still be fetched for calculating `completedRequests` in stats, so the `useBloodRequests()` hook call should remain.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm that pending requests exist but are not displayed in the table.

**Test Plan**: Create test cases that set up a state with pending blood requests in the database, render the StaffDashboard component, and assert that the table shows the "no active requests" message. Run these tests on the UNFIXED code to observe failures and confirm the root cause.

**Test Cases**:
1. **Single Pending Request Test**: Create 1 pending request → Render dashboard → Assert table shows empty message (will fail on unfixed code)
2. **Multiple Pending Requests Test**: Create 3 pending requests → Render dashboard → Assert table shows empty message (will fail on unfixed code)
3. **Stats vs Table Mismatch Test**: Verify stats counter shows correct count but table is empty (will fail on unfixed code)
4. **Mixed Status Test**: Create 2 pending and 2 completed requests → Assert only pending ones should appear in table (will fail on unfixed code)

**Expected Counterexamples**:
- Table displays "لا توجد طلبات نشطة" when `pendingRequestsData.data.length > 0`
- Stats counter shows correct count (e.g., "3") but table is empty
- Possible causes: incorrect data source, filter not matching status values, data structure mismatch

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds (pending requests exist), the fixed function displays them correctly in the table.

**Pseudocode:**
```
FOR ALL state WHERE pendingRequestsData.data.length > 0 DO
  result := renderStaffDashboard_fixed(state)
  ASSERT result.table.rows.length === pendingRequestsData.data.length
  ASSERT result.table.emptyMessage NOT visible
  ASSERT result.table.rows[i].data matches pendingRequestsData.data[i] for all i
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold (no pending requests), the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL state WHERE pendingRequestsData.data.length === 0 DO
  ASSERT renderStaffDashboard_original(state).table.emptyMessage visible
  ASSERT renderStaffDashboard_fixed(state).table.emptyMessage visible
  ASSERT renderStaffDashboard_original(state).table === renderStaffDashboard_fixed(state).table
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across different UI states
- It catches edge cases that manual unit tests might miss (e.g., different combinations of donor data, stats values)
- It provides strong guarantees that behavior is unchanged for all non-table-display interactions

**Test Plan**: Observe behavior on UNFIXED code first for non-table interactions (donor tab, stats, buttons), then write property-based tests capturing that behavior.

**Test Cases**:
1. **Empty State Preservation**: Verify that when there are 0 pending requests, both old and new code show the same empty state message
2. **Stats Counter Preservation**: Verify that stats counter continues to show correct count after fix
3. **Donor Tab Preservation**: Verify that donor tab functionality is completely unchanged
4. **Button Actions Preservation**: Verify that refresh, cancel, and other button actions work identically
5. **New Request Dialog Preservation**: Verify that creating new requests works the same way

### Unit Tests

- Test that `activeRequests` is correctly computed from `pendingRequestsData` instead of filtered `requestsData`
- Test that table renders correct number of rows when pending requests exist
- Test that table shows empty state when no pending requests exist
- Test that each table row displays correct data (blood type, patient, department, units, urgency, date)
- Test that loading state uses `pendingLoading` instead of `requestsLoading`

### Property-Based Tests

- Generate random sets of pending blood requests and verify table displays all of them correctly
- Generate random combinations of pending/completed requests and verify only pending ones appear in table
- Generate random UI states and verify all non-table functionality remains unchanged
- Test that stats counter and table display are always in sync (both use `pendingRequestsData`)

### Integration Tests

- Test full user flow: create new request → verify it appears in table immediately after creation
- Test refresh flow: click refresh button → verify table updates with latest pending requests
- Test cancel flow: cancel a request → verify it disappears from table
- Test that switching between tabs (requests/donors) works correctly with the new data source
