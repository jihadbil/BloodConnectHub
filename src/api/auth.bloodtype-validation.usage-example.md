# Blood Type Validation - Usage Example

## Overview

The `checkBloodTypeExists` function validates whether a blood type ID exists in the system before attempting donor registration. This validation helps prevent registration errors and provides better user experience.

## API Function

```typescript
checkBloodTypeExists: async (bloodTypeId: number): Promise<ServiceResponse<boolean>>
```

### Parameters

- `bloodTypeId` (number): The blood type ID to validate (1-8 for standard blood types)

### Returns

- `Promise<ServiceResponse<boolean>>`: A promise that resolves to a service response containing:
  - `success`: Whether the API call succeeded
  - `data`: `true` if blood type exists, `false` otherwise
  - `message`: Descriptive message about the result
  - `errors`: Array of error messages if any

## Valid Blood Type IDs

| ID | Blood Type |
|----|------------|
| 1  | A+         |
| 2  | A-         |
| 3  | B+         |
| 4  | B-         |
| 5  | O+         |
| 6  | O-         |
| 7  | AB+        |
| 8  | AB-        |

## Usage Examples

### Basic Usage

```typescript
import { authApi } from '@/api/auth';

// Check if blood type ID 1 (A+) exists
const result = await authApi.checkBloodTypeExists(1);

if (result.success && result.data) {
  console.log('Blood type exists!');
} else {
  console.log('Blood type not found');
}
```

### Form Validation

```typescript
import { authApi } from '@/api/auth';
import { useState } from 'react';

function DonorRegistrationForm() {
  const [bloodTypeId, setBloodTypeId] = useState<number>(1);
  const [bloodTypeError, setBloodTypeError] = useState<string>('');

  const validateBloodType = async (id: number) => {
    try {
      const result = await authApi.checkBloodTypeExists(id);
      
      if (!result.success || !result.data) {
        setBloodTypeError('Invalid blood type ID');
        return false;
      }
      
      setBloodTypeError('');
      return true;
    } catch (error) {
      setBloodTypeError('Failed to validate blood type');
      return false;
    }
  };

  const handleBloodTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setBloodTypeId(id);
    await validateBloodType(id);
  };

  return (
    <div>
      <select value={bloodTypeId} onChange={handleBloodTypeChange}>
        <option value={1}>A+</option>
        <option value={2}>A-</option>
        <option value={3}>B+</option>
        <option value={4}>B-</option>
        <option value={5}>O+</option>
        <option value={6}>O-</option>
        <option value={7}>AB+</option>
        <option value={8}>AB-</option>
      </select>
      {bloodTypeError && <span className="error">{bloodTypeError}</span>}
    </div>
  );
}
```

### Pre-Registration Validation

```typescript
import { authApi } from '@/api/auth';
import type { RegisterDonorRequest } from '@/types/api';

async function validateRegistrationData(data: RegisterDonorRequest): Promise<string[]> {
  const errors: string[] = [];

  // Validate username
  const usernameCheck = await authApi.checkUsernameExists(data.username);
  if (usernameCheck.success && usernameCheck.data) {
    errors.push('Username already exists');
  }

  // Validate national ID
  const nationalIDCheck = await authApi.checkNationalIDExists(data.nationalID);
  if (nationalIDCheck.success && nationalIDCheck.data) {
    errors.push('National ID already registered');
  }

  // Validate blood type ID
  const bloodTypeCheck = await authApi.checkBloodTypeExists(data.bloodTypeID);
  if (!bloodTypeCheck.success || !bloodTypeCheck.data) {
    errors.push('Invalid blood type ID');
  }

  // Validate role ID if provided
  if (data.roleId) {
    const roleCheck = await authApi.checkRoleExists(data.roleId);
    if (!roleCheck.success || !roleCheck.data) {
      errors.push('Invalid role ID');
    }
  }

  return errors;
}

// Usage
const registrationData: RegisterDonorRequest = {
  username: 'newdonor',
  password: 'password123',
  fullName: 'Ahmed Ali',
  nationalID: '1234567890',
  gender: 0,
  dateOfBirth: '1990-01-01',
  bloodTypeID: 1,
};

const validationErrors = await validateRegistrationData(registrationData);

if (validationErrors.length === 0) {
  // Proceed with registration
  const result = await authApi.registerDonor(registrationData);
  console.log('Registration successful:', result);
} else {
  // Display errors to user
  console.error('Validation errors:', validationErrors);
}
```

### Error Handling

```typescript
import { authApi } from '@/api/auth';

async function checkBloodTypeWithErrorHandling(bloodTypeId: number) {
  try {
    const result = await authApi.checkBloodTypeExists(bloodTypeId);
    
    if (!result.success) {
      console.error('API call failed:', result.message);
      return false;
    }
    
    if (!result.data) {
      console.warn(`Blood type ID ${bloodTypeId} does not exist`);
      return false;
    }
    
    console.log(`Blood type ID ${bloodTypeId} is valid`);
    return true;
    
  } catch (error) {
    console.error('Network error:', error);
    throw new Error('Failed to validate blood type. Please check your connection.');
  }
}
```

### Batch Validation

```typescript
import { authApi } from '@/api/auth';

async function validateAllBloodTypes(): Promise<Map<number, boolean>> {
  const results = new Map<number, boolean>();
  
  // Validate all standard blood type IDs (1-8)
  for (let id = 1; id <= 8; id++) {
    try {
      const result = await authApi.checkBloodTypeExists(id);
      results.set(id, result.success && result.data === true);
    } catch (error) {
      results.set(id, false);
    }
  }
  
  return results;
}

// Usage
const validBloodTypes = await validateAllBloodTypes();
console.log('Valid blood types:', Array.from(validBloodTypes.entries())
  .filter(([_, isValid]) => isValid)
  .map(([id]) => id)
);
```

## Integration with Donor Registration

The blood type validation is typically used as part of the donor registration flow:

```typescript
import { authApi } from '@/api/auth';
import type { RegisterDonorRequest } from '@/types/api';

async function registerDonorWithValidation(data: RegisterDonorRequest) {
  // Step 1: Validate username
  const usernameCheck = await authApi.checkUsernameExists(data.username);
  if (usernameCheck.data) {
    throw new Error('Username already exists');
  }

  // Step 2: Validate national ID
  const nationalIDCheck = await authApi.checkNationalIDExists(data.nationalID);
  if (nationalIDCheck.data) {
    throw new Error('National ID already registered');
  }

  // Step 3: Validate blood type ID
  const bloodTypeCheck = await authApi.checkBloodTypeExists(data.bloodTypeID);
  if (!bloodTypeCheck.data) {
    throw new Error('Invalid blood type ID');
  }

  // Step 4: Validate role ID if provided
  if (data.roleId) {
    const roleCheck = await authApi.checkRoleExists(data.roleId);
    if (!roleCheck.data) {
      throw new Error('Invalid role ID');
    }
  }

  // Step 5: All validations passed, proceed with registration
  const result = await authApi.registerDonor(data);
  
  if (!result.success) {
    throw new Error(result.message || 'Registration failed');
  }

  return result.data;
}
```

## API Endpoint

The function calls the following API endpoint:

```
GET /api/auth/check-bloodtype/{bloodTypeId}
```

### Request

- **Method**: GET
- **URL**: `/api/auth/check-bloodtype/{bloodTypeId}`
- **Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json`

### Response

```json
{
  "success": true,
  "data": true,
  "message": "Blood type exists"
}
```

or

```json
{
  "success": true,
  "data": false,
  "message": "Blood type not found"
}
```

## Best Practices

1. **Validate Early**: Check blood type ID as soon as the user selects it, not just on form submission
2. **Cache Results**: Consider caching validation results for frequently checked blood types
3. **Handle Errors Gracefully**: Always handle network errors and API failures
4. **Provide Feedback**: Show clear error messages to users when validation fails
5. **Combine Validations**: Validate all required fields before attempting registration
6. **Use Type Safety**: Leverage TypeScript types to ensure correct blood type ID ranges

## Related Functions

- `checkUsernameExists(username: string)`: Validate username availability
- `checkNationalIDExists(nationalID: string)`: Validate national ID uniqueness
- `checkRoleExists(roleId: number)`: Validate role ID existence
- `registerDonor(data: RegisterDonorRequest)`: Register a new donor with user account

## See Also

- [Authentication API Documentation](./auth.usage-example.md)
- [Donor Registration Flow](./donors.usage-example.md)
- [API Types](../types/api.ts)
