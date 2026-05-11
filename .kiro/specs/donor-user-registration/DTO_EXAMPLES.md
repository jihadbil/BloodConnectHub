# DTO Examples for Combined Donor Registration

## RegisterDonorRequest Example

### Minimal Request (Required Fields Only)

```json
{
  "username": "ahmed_ali",
  "password": "SecurePass123",
  "fullName": "Ahmed Ali Mohammed",
  "nationalID": "1234567890",
  "gender": 1,
  "dateOfBirth": "1990-05-15T00:00:00Z",
  "bloodTypeID": 3
}
```

### Complete Request (With Optional Fields)

```json
{
  "username": "fatima_hassan",
  "password": "SecurePass456",
  "fullName": "Fatima Hassan Ibrahim",
  "phone": "+966501234567",
  "roleId": 2,
  "nationalID": "9876543210",
  "gender": 2,
  "dateOfBirth": "1995-08-20T00:00:00Z",
  "bloodTypeID": 1,
  "city": "Riyadh",
  "isActive": true
}
```

## RegisterDonorResponse Example

### Successful Registration Response

```json
{
  "success": true,
  "message": "Donor and user account created successfully",
  "data": {
    "user": {
      "userID": 42,
      "username": "ahmed_ali",
      "fullName": "Ahmed Ali Mohammed",
      "phone": null,
      "roleId": 2,
      "roleName": "Donor"
    },
    "donor": {
      "donorID": 15,
      "fullName": "Ahmed Ali Mohammed",
      "nationalID": "1234567890",
      "gender": 1,
      "dateOfBirth": "1990-05-15T00:00:00Z",
      "phone": null,
      "bloodTypeID": 3,
      "bloodTypeName": "O+",
      "city": null,
      "isActive": true,
      "userID": 42
    }
  },
  "errors": null
}
```

### Complete Response (With All Optional Fields)

```json
{
  "success": true,
  "message": "Donor and user account created successfully",
  "data": {
    "user": {
      "userID": 43,
      "username": "fatima_hassan",
      "fullName": "Fatima Hassan Ibrahim",
      "phone": "+966501234567",
      "roleId": 2,
      "roleName": "Donor"
    },
    "donor": {
      "donorID": 16,
      "fullName": "Fatima Hassan Ibrahim",
      "nationalID": "9876543210",
      "gender": 2,
      "dateOfBirth": "1995-08-20T00:00:00Z",
      "phone": "+966501234567",
      "bloodTypeID": 1,
      "bloodTypeName": "A+",
      "city": "Riyadh",
      "isActive": true,
      "userID": 43
    }
  },
  "errors": null
}
```

## Error Response Examples

### Validation Error (400 Bad Request)

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    "Username must be at least 3 characters long",
    "Password must be at least 6 characters long",
    "National ID is required"
  ]
}
```

### Duplicate Username (409 Conflict)

```json
{
  "success": false,
  "message": "Username already exists",
  "data": null,
  "errors": [
    "The username 'ahmed_ali' is already registered in the system"
  ]
}
```

### Duplicate National ID (409 Conflict)

```json
{
  "success": false,
  "message": "National ID already registered",
  "data": null,
  "errors": [
    "A donor with National ID '1234567890' already exists"
  ]
}
```

### Invalid Blood Type ID (400 Bad Request)

```json
{
  "success": false,
  "message": "Invalid blood type",
  "data": null,
  "errors": [
    "Blood type ID 999 does not exist in the system"
  ]
}
```

### Invalid Role ID (400 Bad Request)

```json
{
  "success": false,
  "message": "Invalid role",
  "data": null,
  "errors": [
    "Role ID 999 does not exist in the system"
  ]
}
```

### Database Error (500 Internal Server Error)

```json
{
  "success": false,
  "message": "An error occurred while creating the donor account",
  "data": null,
  "errors": [
    "Database connection failed",
    "Transaction rolled back"
  ]
}
```

## Field Mappings

### User Fields (from RegisterRequest)
| Field | Source | Destination | Notes |
|-------|--------|-------------|-------|
| username | RegisterDonorRequest.username | User.Username | Unique, min 3 chars |
| password | RegisterDonorRequest.password | User.PasswordHash | Hashed, min 6 chars |
| fullName | RegisterDonorRequest.fullName | User.FullName | Shared with donor |
| phone | RegisterDonorRequest.phone | User.Phone | Optional, nullable |
| roleId | RegisterDonorRequest.roleId | User.RoleID | Defaults to Donor role |

### Donor Fields (from CreateDonorDto)
| Field | Source | Destination | Notes |
|-------|--------|-------------|-------|
| fullName | RegisterDonorRequest.fullName | Donor.FullName | Shared with user |
| nationalID | RegisterDonorRequest.nationalID | Donor.NationalID | Unique, required |
| gender | RegisterDonorRequest.gender | Donor.Gender | 1=Male, 2=Female |
| dateOfBirth | RegisterDonorRequest.dateOfBirth | Donor.DateOfBirth | Required |
| phone | RegisterDonorRequest.phone | Donor.Phone | Optional, nullable |
| bloodTypeID | RegisterDonorRequest.bloodTypeID | Donor.BloodTypeID | Required, must exist |
| city | RegisterDonorRequest.city | Donor.City | Optional, nullable |
| isActive | RegisterDonorRequest.isActive | Donor.IsActive | Defaults to true |
| userID | User.UserID (after creation) | Donor.UserID | Auto-linked |

## cURL Examples

### Register Donor (Minimal)

```bash
curl -X POST "http://localhost:5000/api/Auth/register-donor" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ahmed_ali",
    "password": "SecurePass123",
    "fullName": "Ahmed Ali Mohammed",
    "nationalID": "1234567890",
    "gender": 1,
    "dateOfBirth": "1990-05-15T00:00:00Z",
    "bloodTypeID": 3
  }'
```

### Register Donor (Complete)

```bash
curl -X POST "http://localhost:5000/api/Auth/register-donor" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "fatima_hassan",
    "password": "SecurePass456",
    "fullName": "Fatima Hassan Ibrahim",
    "phone": "+966501234567",
    "roleId": 2,
    "nationalID": "9876543210",
    "gender": 2,
    "dateOfBirth": "1995-08-20T00:00:00Z",
    "bloodTypeID": 1,
    "city": "Riyadh",
    "isActive": true
  }'
```

## TypeScript Interface Examples

For frontend developers using TypeScript:

```typescript
// Request interface
interface RegisterDonorRequest {
  username: string;           // min 3 chars
  password: string;           // min 6 chars
  fullName: string;           // required
  phone?: string | null;      // optional
  roleId?: number | null;     // optional, defaults to Donor
  nationalID: string;         // required, unique
  gender: 1 | 2;             // 1=Male, 2=Female
  dateOfBirth: string;        // ISO 8601 date-time
  bloodTypeID: number;        // required
  city?: string | null;       // optional
  isActive?: boolean | null;  // optional, defaults to true
}

// Response interfaces
interface UserData {
  userID: number;
  username: string | null;
  fullName: string | null;
  phone: string | null;
  roleId: number;
  roleName: string | null;
}

interface DonorData {
  donorID: number;
  fullName: string | null;
  nationalID: string | null;
  gender: 1 | 2;
  dateOfBirth: string;
  phone: string | null;
  bloodTypeID: number;
  bloodTypeName: string | null;
  city: string | null;
  isActive: boolean;
  userID: number;
}

interface RegisterDonorResponse {
  user: UserData;
  donor: DonorData;
}

interface ServiceResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
  errors: string[] | null;
}

type RegisterDonorApiResponse = ServiceResponse<RegisterDonorResponse>;
```

## Validation Rules Summary

### Username
- **Required**: Yes
- **Min Length**: 3 characters
- **Unique**: Yes
- **Pattern**: Alphanumeric and underscore

### Password
- **Required**: Yes
- **Min Length**: 6 characters
- **Hashed**: Yes (before storage)

### Full Name
- **Required**: Yes
- **Min Length**: 1 character
- **Shared**: Used for both User and Donor

### Phone
- **Required**: No
- **Format**: Tel format (e.g., +966501234567)
- **Nullable**: Yes

### Role ID
- **Required**: No
- **Default**: Donor role ID (queried from database)
- **Validation**: Must exist in Roles table if provided

### National ID
- **Required**: Yes
- **Unique**: Yes (across all donors)
- **Format**: String

### Gender
- **Required**: Yes
- **Values**: 1 (Male) or 2 (Female)
- **Type**: Integer enum

### Date of Birth
- **Required**: Yes
- **Format**: ISO 8601 date-time
- **Type**: DateTime

### Blood Type ID
- **Required**: Yes
- **Validation**: Must exist in BloodTypes table
- **Type**: Integer

### City
- **Required**: No
- **Nullable**: Yes
- **Type**: String

### Is Active
- **Required**: No
- **Default**: true
- **Type**: Boolean
