# Implementation Plan: Blood Request Response Feature

## Overview

This implementation plan breaks down the blood request response feature into discrete coding tasks. The feature enables registered donors to respond to blood requests displayed on the BloodRequests page, with comprehensive validation, error handling, and testing.

The implementation follows this approach:
1. Set up core infrastructure (API endpoints, types, utilities)
2. Implement the response hook with validation logic
3. Build the ResponseDialog component
4. Integrate with the existing BloodRequests page
5. Add comprehensive property-based tests using fast-check

## Tasks

- [x] 1. Set up project infrastructure and types
  - Create directory structure for blood-request components
  - Define TypeScript interfaces for response flow (DonationResponse, FulfillRequestPayload, DonorEligibility, BloodCompatibilityCheck, RespondResult)
  - Add fast-check library for property-based testing
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 2. Implement donor API service
  - [x] 2.1 Add getDonorByUserId endpoint to src/api/donors.ts
    - Implement API call to fetch donor information by user ID
    - Include error handling for network failures
    - _Requirements: 5.6_
  
  - [ ]* 2.2 Write property test for donor data parsing
    - **Property 17: تحويل بيانات المتبرع**
    - **Validates: Requirements 12.1, 12.2**
  
  - [ ]* 2.3 Write property test for date conversion
    - **Property 18: تحويل تاريخ آخر تبرع**
    - **Validates: Requirements 12.3**
  
  - [ ]* 2.4 Write property test for round-trip consistency
    - **Property 19: Round-trip لبيانات المتبرع**
    - **Validates: Requirements 12.7**

- [ ] 3. Implement eligibility validation utilities
  - [x] 3.1 Create eligibility checker function
    - Implement checkDonationEligibility function that calculates days since last donation
    - Return DonorEligibility object with isEligible, lastDonationDate, nextEligibleDate, daysUntilEligible
    - Handle null lastDonationDate (new donors are eligible)
    - _Requirements: 5.1, 5.2, 5.3, 5.5_
  
  - [ ]* 3.2 Write property test for eligibility validation
    - **Property 6: التحقق من أهلية التبرع**
    - **Validates: Requirements 5.1, 5.3**
  
  - [ ]* 3.3 Write unit tests for eligibility edge cases
    - Test null lastDonationDate (new donor)
    - Test exactly 90 days since last donation
    - Test invalid date formats
    - _Requirements: 5.5_

- [ ] 4. Implement useBloodRequestResponse hook
  - [x] 4.1 Create hook skeleton with state management
    - Set up isLoading and error state
    - Define respondToRequest function signature
    - _Requirements: 2.3, 3.1_
  
  - [x] 4.2 Implement authentication checks
    - Check for valid JWT token
    - Verify user role is "donor"
    - Return appropriate error types for auth failures
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_
  
  - [ ]* 4.3 Write property test for authentication verification
    - **Property 2: التحقق من المصادقة**
    - **Validates: Requirements 2.3**
  
  - [ ]* 4.4 Write property test for role verification
    - **Property 3: التحقق من دور المستخدم**
    - **Validates: Requirements 3.1**
  
  - [x] 4.5 Implement blood compatibility check
    - Fetch donor information using getDonorByUserId
    - Call canDonateToPatient from bloodCompatibility module
    - Return detailed error with blood types if incompatible
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 4.6 Write property test for blood compatibility
    - **Property 4: التحقق من توافق فصيلة الدم**
    - **Validates: Requirements 4.1, 4.3**
  
  - [ ]* 4.7 Write property test for compatibility error message
    - **Property 5: محتوى رسالة خطأ التوافق**
    - **Validates: Requirements 4.5**
  
  - [x] 4.8 Implement eligibility check
    - Call checkDonationEligibility with donor's lastDonationDate
    - Return detailed error with dates if not eligible
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ]* 4.9 Write property test for eligibility error message
    - **Property 7: محتوى رسالة خطأ الأهلية**
    - **Validates: Requirements 5.4**
  
  - [x] 4.10 Implement donation creation
    - Build DonationResponse payload with all required fields
    - Call POST /api/donations endpoint
    - Handle API errors appropriately
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  
  - [ ]* 4.11 Write property test for donation record creation
    - **Property 8: إنشاء سجل تبرع كامل**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7**
  
  - [x] 4.12 Implement request fulfillment
    - Call POST /api/bloodrequests/{id}/fulfill with donationId and quantity
    - Only call if donation creation succeeded
    - _Requirements: 6.8, 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 4.13 Write property test for donation-request linking
    - **Property 9: ربط التبرع بالطلب**
    - **Validates: Requirements 6.8**
  
  - [ ]* 4.14 Write property test for error handling
    - **Property 14: منع استدعاء fulfill عند فشل create**
    - **Validates: Requirements 10.2**
  
  - [ ]* 4.15 Write unit tests for hook error scenarios
    - Test network failure during donation creation
    - Test network failure during fulfill
    - Test invalid API responses
    - _Requirements: 10.1, 10.3, 10.4, 10.5_

- [x] 5. Checkpoint - Ensure core logic tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement ResponseDialog component
  - [x] 6.1 Create component structure with dialog UI
    - Use shadcn/ui Dialog component
    - Display request details (blood type, quantity, urgency, department, hospital)
    - Add loading state with spinner
    - Add error display area
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
  
  - [ ]* 6.2 Write property test for dialog content display
    - **Property 1: عرض محتوى Dialog الكامل**
    - **Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6**
  
  - [x] 6.3 Implement confirm handler
    - Call useBloodRequestResponse hook's respondToRequest
    - Set isSubmitting state during processing
    - Disable confirm button while submitting
    - _Requirements: 11.2, 11.3_
  
  - [ ]* 6.4 Write property test for loading state management
    - **Property 16: عرض مؤشر تحميل أثناء المعالجة**
    - **Validates: Requirements 11.2, 11.3**
  
  - [ ]* 6.5 Write property test for loading state cleanup
    - **Property 15: إيقاف حالة التحميل دائماً**
    - **Validates: Requirements 10.6**
  
  - [x] 6.6 Implement success handling
    - Display success message with donation ID
    - Show next steps information
    - Auto-close dialog after success
    - Call onSuccess callback to refresh list
    - _Requirements: 8.1, 8.2, 8.3, 9.1_
  
  - [ ]* 6.7 Write property test for success message
    - **Property 10: عرض رسالة نجاح شاملة**
    - **Validates: Requirements 8.1, 8.2, 8.3**
  
  - [ ]* 6.8 Write property test for dialog auto-close
    - **Property 12: إغلاق Dialog بعد النجاح**
    - **Validates: Requirements 9.1**
  
  - [x] 6.9 Implement error handling
    - Display error messages based on error type
    - Show appropriate actions (retry, dismiss, contact)
    - Handle all error types (auth, validation, api, data)
    - _Requirements: 8.4, 8.5, 8.6, 10.1, 10.5_
  
  - [ ]* 6.10 Write property test for error display
    - **Property 11: عرض رسالة خطأ عند الفشل**
    - **Validates: Requirements 8.4**
  
  - [x] 6.11 Add UI enhancements
    - Use appropriate icons for blood type and urgency
    - Apply urgency-based colors (red for critical, orange for urgent, green for normal)
    - Add cancel button
    - Ensure all text is in Arabic
    - _Requirements: 11.1, 11.4, 11.5, 11.6, 11.7_
  
  - [ ]* 6.12 Write unit tests for component rendering
    - Test dialog opens with correct request data
    - Test cancel button closes dialog
    - Test urgency color coding
    - _Requirements: 11.1, 11.4, 11.5, 11.6_

- [ ] 7. Integrate with BloodRequests page
  - [x] 7.1 Update BloodRequests page to use new ResponseDialog
    - Replace existing simple dialog with ResponseDialog component
    - Pass request data to ResponseDialog
    - Handle dialog open/close state
    - _Requirements: 1.1_
  
  - [x] 7.2 Implement list refresh on success
    - Add onSuccess handler that refetches blood requests
    - Show loading indicator during refresh
    - Update UI to reflect new request status
    - _Requirements: 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 7.3 Write property test for list refresh
    - **Property 13: تحديث القائمة بعد النجاح**
    - **Validates: Requirements 9.2, 9.4**
  
  - [ ]* 7.4 Write integration tests for full flow
    - Test complete flow from button click to list update
    - Test dialog state management
    - Test error scenarios in full context
    - _Requirements: 1.1, 9.1, 9.2_

- [x] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property-based tests use fast-check with minimum 100 runs per test
- All property tests are annotated with property number and validated requirements
- Error handling follows the comprehensive strategy defined in design document
- All user-facing text must be in Arabic
- The implementation assumes all backend API endpoints are available and working
