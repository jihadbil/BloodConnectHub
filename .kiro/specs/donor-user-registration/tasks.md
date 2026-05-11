# Implementation Plan: Donor User Registration

## Overview

This implementation plan creates a combined registration endpoint that atomically creates both a User account and a linked Donor profile in a single transaction. The implementation follows the existing C#/.NET API patterns and ensures data consistency through database transactions with proper rollback mechanisms.

## Tasks

- [x] 1. Create DTOs for combined registration
  - Create `RegisterDonorRequest` DTO that combines user and donor fields
  - Create `RegisterDonorResponse` DTO with nested user and donor data
  - Add data annotations for validation (Required, MinLength, StringLength, etc.)
  - Ensure DTOs follow existing API naming conventions
  - _Requirements: 1.1, 2.1, 2.2, 2.5, 2.6, 2.7, 6.1, 6.2, 6.3, 6.4_

- [x] 2. Implement validation logic
  - [x] 2.1 Add username uniqueness validation
    - Check if username exists before creating user
    - Return appropriate error message if duplicate found
    - _Requirements: 2.3_
  
  - [x] 2.2 Add nationalID uniqueness validation
    - Check if nationalID exists before creating donor
    - Return appropriate error message if duplicate found
    - _Requirements: 2.4_
  
  - [x] 2.3 Add roleId existence validation
    - Verify roleId exists in Roles table if provided
    - Return validation error if roleId is invalid
    - _Requirements: 7.3, 7.4_
  
  - [x] 2.4 Add bloodTypeID existence validation
    - Verify bloodTypeID exists in BloodTypes table
    - Return validation error if bloodTypeID is invalid
    - _Requirements: 2.2_

- [~] 3. Implement registration service with transaction support
  - [x] 3.1 Create `RegisterDonorWithUser` method in service layer
    - Accept `RegisterDonorRequest` as parameter
    - Return `ServiceResponse<RegisterDonorResponse>`
    - Implement transaction begin/commit/rollback pattern
    - _Requirements: 1.1, 3.1, 3.5_
  
  - [~] 3.2 Implement user creation within transaction
    - Call existing user service to create user account
    - Hash password using existing password hashing mechanism
    - Pass transaction context to user service
    - Handle user creation errors
    - _Requirements: 1.1, 1.3, 3.2_
  
  - [~] 3.3 Implement donor creation within transaction
    - Call existing donor service to create donor profile
    - Link donor to user via userID
    - Pass transaction context to donor service
    - Handle donor creation errors
    - _Requirements: 1.1, 1.3, 3.3_
  
  - [~] 3.4 Implement transaction rollback on failure
    - Catch exceptions from user or donor creation
    - Rollback transaction if any step fails
    - Ensure no partial data is committed
    - _Requirements: 1.4, 3.2, 3.3, 3.4_
  
  - [~] 3.5 Build combined response with user and donor data
    - Retrieve complete user data including role name
    - Retrieve complete donor data including blood type name
    - Construct `RegisterDonorResponse` with both entities
    - _Requirements: 1.2, 4.1, 4.2, 4.3, 4.4_

- [~] 4. Implement default value handling
  - [~] 4.1 Add default roleId assignment
    - Query database for "Donor" role ID
    - Assign donor role if roleId not provided in request
    - _Requirements: 7.1, 7.2_
  
  - [~] 4.2 Add default isActive assignment
    - Set isActive to true if not provided in request
    - Support explicit false value if provided
    - _Requirements: 8.1, 8.2, 8.3_

- [~] 5. Create API controller endpoint
  - [~] 5.1 Add `RegisterDonor` action method to AuthController
    - Create POST endpoint at `/api/Auth/register-donor`
    - Accept `RegisterDonorRequest` from request body
    - Call registration service method
    - Return 201 Created on success with response data
    - _Requirements: 1.1, 1.2, 4.5_
  
  - [~] 5.2 Implement error handling and HTTP status codes
    - Return 400 Bad Request for validation errors
    - Return 409 Conflict for duplicate username/nationalID
    - Return 500 Internal Server Error for database errors
    - Include error messages in response
    - _Requirements: 1.5, 5.1, 5.2, 5.3, 5.5_
  
  - [~] 5.3 Add logging for errors and operations
    - Log all registration attempts
    - Log validation failures
    - Log transaction rollbacks
    - Ensure no sensitive data (passwords) in logs
    - _Requirements: 5.4, 5.5_

- [~] 6. Checkpoint - Ensure all tests pass
  - Manually test the endpoint with valid data
  - Test validation errors (duplicate username, duplicate nationalID)
  - Test transaction rollback scenarios
  - Verify response structure matches design
  - Ensure all tests pass, ask the user if questions arise.

- [~] 7. Update API documentation
  - [~] 7.1 Add endpoint to OpenAPI/Swagger documentation
    - Document request schema with all fields
    - Document response schema with nested objects
    - Document all HTTP status codes
    - Add example request and response
    - _Requirements: 9.4_
  
  - [~] 7.2 Add code comments and XML documentation
    - Document DTO properties with XML comments
    - Document service methods with XML comments
    - Document controller action with XML comments
    - Include parameter descriptions and return values

- [~] 8. Final checkpoint - Verify backward compatibility
  - Verify existing `/api/Auth/register` endpoint still works
  - Verify existing `/api/Donors` POST endpoint still works
  - Ensure no breaking changes to existing DTOs
  - Test that existing authentication mechanisms work
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 9.1, 9.2, 9.3, 9.5_

## Notes

- All tasks reference specific requirements for traceability
- Transaction handling is critical for data consistency
- Follow existing C#/.NET API patterns and conventions
- Reuse existing services (UserService, DonorService) where possible
- Ensure proper error handling and logging throughout
- Maintain backward compatibility with existing API endpoints
