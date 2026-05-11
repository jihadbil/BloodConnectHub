# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Dialog Data Display Matches Card Display
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases: BloodRequest objects with bloodTypeId but no nested bloodType object, urgencyLevel API enum values, and requestDate timestamps
  - Test that ResponseDialog displays bloodType, requestDate, and urgencyLevel correctly for all inputs where isBugCondition returns true
  - Test cases:
    - Blood type without nested object: bloodTypeId=1 should display "A+" not "فصيلة 1"
    - Urgency level 'Emergency' should display "حرج" badge
    - Urgency level 'Urgent' should display "عاجل" badge
    - Request date from 3 hours ago should display "منذ 3 ساعة" not absolute date
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Display Functionality Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (dialog interactions that don't involve bloodType, requestDate, urgencyLevel display)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Test cases:
    - Dialog submission: clicking "تأكيد الاستجابة" calls API correctly
    - Error handling: errors display with appropriate actions
    - Success messages: success message with donation ID displays correctly
    - Other fields: quantityNeeded, notes, hospital info display correctly
    - Dialog interactions: open, close, cancel work correctly
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 3. Fix ResponseDialog data display

  - [x] 3.1 Import utility functions
    - Add imports for `mapUrgencyLevel` and `formatTimeAgo` from `@/lib/utils`
    - Verify BLOOD_TYPE_MAP is imported from `@/types/api`
    - _Bug_Condition: isBugCondition(input) where input.dialogOpen === true AND data transformation is inconsistent_
    - _Expected_Behavior: Dialog uses same utility functions as card component_
    - _Preservation: Import changes should not affect any existing functionality_
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.2 Fix blood type display logic
    - Ensure blood type display uses: `request.bloodType?.typeName || BLOOD_TYPE_MAP[request.bloodTypeId] || \`فصيلة ${request.bloodTypeId}\``
    - This matches the card's proven working pattern
    - _Bug_Condition: isBugCondition(input) where input.request.bloodType is undefined_
    - _Expected_Behavior: Blood type displays correctly using BLOOD_TYPE_MAP fallback_
    - _Preservation: Other field displays remain unchanged_
    - _Requirements: 2.1_

  - [x] 3.3 Fix urgency level display logic
    - Replace direct urgencyConfig access with mapped value
    - Change from: `urgencyConfig[request.urgencyLevel]`
    - Change to: `urgencyConfig[mapUrgencyLevel(request.urgencyLevel)]`
    - Update urgencyConfig keys to use internal format: 'critical', 'urgent', 'normal'
    - _Bug_Condition: isBugCondition(input) where urgencyConfig[input.request.urgencyLevel] is undefined_
    - _Expected_Behavior: Urgency level displays correctly with proper mapping from API enum to internal format_
    - _Preservation: Urgency badge styling and behavior remain unchanged_
    - _Requirements: 2.3_

  - [x] 3.4 Fix request date display format
    - Replace absolute date format with relative time format
    - Change from: `new Date(request.requestDate).toLocaleDateString('ar-LY')`
    - Change to: `formatTimeAgo(request.requestDate)`
    - _Bug_Condition: isBugCondition(input) where dateFormatMismatch(input.request.requestDate) is true_
    - _Expected_Behavior: Date displays in relative time format matching card display_
    - _Preservation: Date field layout and styling remain unchanged_
    - _Requirements: 2.2_

  - [x] 3.5 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Dialog Data Display Matches Card Display
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Display Functionality Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
