# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Pending Requests Not Displayed in Table
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - Test that when `pendingRequestsData.data.length > 0`, the table displays these requests (not the empty state message)
  - The test assertions should match the Expected Behavior Properties from design:
    - Assert table rows count equals `pendingRequestsData.data.length`
    - Assert empty state message "لا توجد طلبات نشطة" is NOT visible
    - Assert each table row displays correct data (blood type, patient, department, units, urgency, date)
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found:
    - Example: 3 pending requests exist → stats counter shows "3" → table shows empty message
    - Example: Create new request → stats increments → table remains empty
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Table Functionality Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (when `pendingRequestsData.data.length === 0`)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - Empty state message displays when genuinely no pending requests exist
    - Stats counter continues to show correct count from `usePendingBloodRequests()`
    - Donor tab functionality remains completely unchanged
    - Refresh button, cancel button, and other UI interactions work identically
    - New request dialog and creation flow work the same way
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Fix for active requests display bug

  - [x] 3.1 Implement the fix in StaffDashboard.tsx
    - Replace data source for `activeRequests` from filtered `requestsData` to `pendingRequestsData`
    - Change: `const activeRequests = requestsData?.data?.items?.filter(req => req.status === 'Pending').map(req => { ... }) || [];`
    - To: `const activeRequests = pendingRequestsData?.data?.map(req => { ... }) || [];`
    - Update loading state condition from `requestsLoading` to `pendingLoading` for the table
    - Keep `requestsData` fetch for calculating `completedRequests` in stats
    - Ensure data transformation logic remains the same (blood type mapping, date formatting, etc.)
    - _Bug_Condition: isBugCondition(input) where (pendingRequestsData?.data?.length > 0) AND (activeRequests.length === 0) AND (table displays "no active requests" message)_
    - _Expected_Behavior: For all states where pendingRequestsData contains pending requests, display them in the table with all details (blood type, patient, department, units, urgency, date)_
    - _Preservation: Empty state display when genuinely no pending requests, stats counter accuracy, donor tab functionality, all button actions, new request dialog_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Pending Requests Displayed in Table
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify that when pending requests exist, they appear in the table
    - Verify that table rows count matches `pendingRequestsData.data.length`
    - Verify that empty state message does not appear when requests exist
    - _Requirements: 2.1, 2.2_

  - [x] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Table Functionality Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm empty state displays correctly when no pending requests
    - Confirm stats counter still shows correct count
    - Confirm donor tab, buttons, and dialogs work identically
    - Confirm all tests still pass after fix (no regressions)

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
