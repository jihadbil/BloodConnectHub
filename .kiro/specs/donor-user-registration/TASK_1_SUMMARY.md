# Task 1 Summary: Create DTOs for Combined Registration

## Completed Actions

### 1. Added RegisterDonorRequest DTO

Created a new DTO schema in `BloodConnect APIv2.json` that combines user and donor registration fields:

**Schema Location**: `#/components/schemas/RegisterDonorRequest`

**Required Fields**:
- `username` (string, min 3 characters) - User account username
- `password` (string, min 6 characters) - User account password
- `fullName` (string, min 1 character) - Full name for both user and donor
- `nationalID` (string) - Donor's national ID (must be unique)
- `gender` (Gender enum: 1=Male, 2=Female) - Donor's gender
- `dateOfBirth` (date-time) - Donor's date of birth
- `bloodTypeID` (integer) - Donor's blood type ID (must exist in BloodTypes table)

**Optional Fields**:
- `phone` (string, tel format, nullable) - Phone number for both user and donor
- `roleId` (integer, nullable) - User role ID (defaults to Donor role if not provided)
- `city` (string, nullable) - Donor's city of residence
- `isActive` (boolean, nullable) - Donor account active status (defaults to true)

**Validation Annotations**:
- Username: MinLength(3)
- Password: MinLength(6)
- FullName: MinLength(1)
- Phone: Format("tel")
- All required fields are enforced via the `required` array

### 2. Added RegisterDonorResponse DTO

Created a response DTO that returns both user and donor data with nested objects:

**Schema Location**: `#/components/schemas/RegisterDonorResponse`

**Structure**:
```json
{
  "user": {
    "userID": integer,
    "username": string,
    "fullName": string,
    "phone": string (nullable),
    "roleId": integer,
    "roleName": string (nullable)
  },
  "donor": {
    "donorID": integer,
    "fullName": string,
    "nationalID": string,
    "gender": Gender enum,
    "dateOfBirth": date-time,
    "phone": string (nullable),
    "bloodTypeID": integer,
    "bloodTypeName": string (nullable),
    "city": string (nullable),
    "isActive": boolean,
    "userID": integer
  }
}
```

**Key Features**:
- Includes complete user data with role name
- Includes complete donor data with blood type name
- Shows the link between user and donor via userID
- Returns both IDs (userID and donorID) for future operations

### 3. Added RegisterDonorResponseServiceResponse Wrapper

Created a ServiceResponse wrapper for the RegisterDonorResponse:

**Schema Location**: `#/components/schemas/RegisterDonorResponseServiceResponse`

**Structure**:
```json
{
  "success": boolean,
  "message": string (nullable),
  "data": RegisterDonorResponse,
  "errors": array of strings (nullable)
}
```

This follows the existing API pattern of wrapping all responses in a ServiceResponse object.

### 4. Added API Endpoint Definition

Added the new endpoint to the OpenAPI spec:

**Endpoint**: `POST /api/Auth/register-donor`

**Tags**: Auth

**Summary**: Register a new donor with linked user account

**Description**: Creates both a User account and a linked Donor profile in a single atomic transaction

**Request Body**: RegisterDonorRequest (application/json)

**Responses**:
- **201 Created**: Registration successful, returns RegisterDonorResponseServiceResponse
- **400 Bad Request**: Validation errors (missing required fields, invalid formats, etc.)
- **409 Conflict**: Username or National ID already exists
- **500 Internal Server Error**: Database or system error

## Naming Conventions

All DTOs follow the existing API naming conventions:
- Request DTOs: `{Action}{Entity}Request` (e.g., RegisterDonorRequest)
- Response DTOs: `{Entity}Response` (e.g., RegisterDonorResponse)
- Service Response wrappers: `{ResponseDto}ServiceResponse`
- Endpoint paths: `/api/{Controller}/{action}` (e.g., /api/Auth/register-donor)

## Requirements Satisfied

This task satisfies the following requirements from the spec:

- **1.1**: Combined registration request structure
- **2.1**: Username validation (minLength: 3)
- **2.2**: Blood type ID validation (required field)
- **2.5**: Password validation (minLength: 6)
- **2.6**: Username validation (minLength: 3)
- **2.7**: All required fields enforced
- **6.1**: Optional phone field for user
- **6.2**: Optional phone field for donor
- **6.3**: Optional city field
- **6.4**: Optional fields support null values

## Next Steps

The DTOs are now defined in the OpenAPI specification. The next tasks will:
1. Implement validation logic (Task 2)
2. Implement the registration service with transaction support (Task 3)
3. Implement default value handling (Task 4)
4. Create the API controller endpoint (Task 5)

## Files Modified

- `BloodConnect APIv2.json`: Added 3 new schemas and 1 new endpoint definition
