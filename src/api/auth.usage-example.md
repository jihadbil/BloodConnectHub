# Auth API Usage Examples

## Username Validation

### Check if Username Exists

Before registering a new user or donor, you can check if a username is already taken:

```typescript
import { authApi } from '@/api/auth';

// Check username availability
const checkUsername = async (username: string) => {
  try {
    const response = await authApi.checkUsernameExists(username);
    
    if (response.success && response.data) {
      console.log('Username already exists');
      return false; // Username taken
    } else {
      console.log('Username available');
      return true; // Username available
    }
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
};

// Usage in a form
const handleUsernameBlur = async (username: string) => {
  const isAvailable = await checkUsername(username);
  if (!isAvailable) {
    setError('username', { 
      type: 'manual', 
      message: 'Username already exists' 
    });
  }
};
```

## Combined Donor Registration

### Register a New Donor with User Account

The `registerDonor` endpoint creates both a user account and a linked donor profile in a single atomic transaction:

```typescript
import { authApi } from '@/api/auth';
import type { RegisterDonorRequest } from '@/types/api';

// Complete registration with all fields
const registerNewDonor = async () => {
  const request: RegisterDonorRequest = {
    // User fields
    username: 'ahmed_ali',
    password: 'SecurePass123!',
    fullName: 'Ahmed Ali',
    phone: '0501234567',
    roleId: 5, // Optional: defaults to Donor role if not provided
    
    // Donor fields
    nationalID: '1234567890',
    gender: 0, // 0=Male, 1=Female
    dateOfBirth: '1990-01-01',
    bloodTypeID: 1, // A+
    city: 'Riyadh',
    isActive: true, // Optional: defaults to true if not provided
  };

  try {
    const response = await authApi.registerDonor(request);
    
    if (response.success && response.data) {
      console.log('Registration successful!');
      console.log('User ID:', response.data.user.userID);
      console.log('Donor ID:', response.data.donor.donorID);
      console.log('Username:', response.data.user.username);
      console.log('Blood Type:', response.data.donor.bloodType);
      
      // Both user and donor are created and linked
      return response.data;
    } else {
      console.error('Registration failed:', response.message);
      console.error('Errors:', response.errors);
      return null;
    }
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
};
```

### Minimal Registration (Optional Fields Omitted)

```typescript
// Minimal registration with only required fields
const registerMinimalDonor = async () => {
  const request: RegisterDonorRequest = {
    // Required user fields
    username: 'sara_mohammed',
    password: 'SecurePass123!',
    fullName: 'Sara Mohammed',
    
    // Required donor fields
    nationalID: '9876543210',
    gender: 1, // Female
    dateOfBirth: '1995-05-15',
    bloodTypeID: 5, // O+
    
    // Optional fields omitted - will use defaults:
    // - roleId: defaults to Donor role
    // - isActive: defaults to true
    // - phone: null
    // - city: null
  };

  try {
    const response = await authApi.registerDonor(request);
    
    if (response.success && response.data) {
      console.log('Minimal registration successful!');
      console.log('Role:', response.data.user.roleName); // "Donor"
      console.log('Active:', response.data.donor.isActive); // true
      return response.data;
    }
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
};
```

## Complete Registration Flow with Validation

### React Hook Form Example

```typescript
import { useForm } from 'react-hook-form';
import { authApi } from '@/api/auth';
import type { RegisterDonorRequest } from '@/types/api';

interface DonorRegistrationForm {
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone?: string;
  nationalID: string;
  gender: number;
  dateOfBirth: string;
  bloodTypeID: number;
  city?: string;
}

const DonorRegistrationForm = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<DonorRegistrationForm>();

  // Validate username on blur
  const handleUsernameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const username = e.target.value;
    
    if (username.length < 3) {
      setError('username', { 
        type: 'manual', 
        message: 'Username must be at least 3 characters' 
      });
      return;
    }

    try {
      const response = await authApi.checkUsernameExists(username);
      
      if (response.success && response.data === true) {
        setError('username', { 
          type: 'manual', 
          message: 'Username already exists. Please choose another.' 
        });
      }
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };

  const onSubmit = async (data: DonorRegistrationForm) => {
    // Final username check before submission
    const usernameCheck = await authApi.checkUsernameExists(data.username);
    
    if (usernameCheck.success && usernameCheck.data === true) {
      setError('username', { 
        type: 'manual', 
        message: 'Username already exists' 
      });
      return;
    }

    // Prepare registration request
    const request: RegisterDonorRequest = {
      username: data.username,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone || null,
      nationalID: data.nationalID,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      bloodTypeID: data.bloodTypeID,
      city: data.city || null,
    };

    try {
      const response = await authApi.registerDonor(request);
      
      if (response.success && response.data) {
        // Registration successful
        console.log('Registration successful!');
        // Redirect to login or dashboard
      } else {
        // Handle errors
        if (response.errors?.includes('Username already exists')) {
          setError('username', { 
            type: 'manual', 
            message: 'Username already exists' 
          });
        } else if (response.errors?.includes('National ID already registered')) {
          setError('nationalID', { 
            type: 'manual', 
            message: 'National ID already registered' 
          });
        } else {
          // Generic error
          console.error('Registration failed:', response.message);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('username', { 
          required: 'Username is required',
          minLength: { value: 3, message: 'Username must be at least 3 characters' }
        })}
        onBlur={handleUsernameBlur}
        placeholder="Username"
      />
      {errors.username && <span>{errors.username.message}</span>}
      
      {/* Other form fields... */}
      
      <button type="submit">Register</button>
    </form>
  );
};
```

## Error Handling

### Common Error Responses

```typescript
// 409 Conflict - Duplicate username
{
  success: false,
  data: null,
  message: 'Username already exists',
  errors: ['Username already exists']
}

// 409 Conflict - Duplicate national ID
{
  success: false,
  data: null,
  message: 'National ID already registered',
  errors: ['National ID already registered']
}

// 400 Bad Request - Validation errors
{
  success: false,
  data: null,
  message: 'Validation failed',
  errors: [
    'Username must be at least 3 characters',
    'Password must be at least 6 characters',
    'Invalid blood type ID'
  ]
}

// 500 Internal Server Error - Database error
{
  success: false,
  data: null,
  message: 'An error occurred during registration',
  errors: ['Database connection failed']
}
```

## Transaction Behavior

The `registerDonor` endpoint uses database transactions to ensure data consistency:

1. **Atomic Operation**: Both user and donor are created in a single transaction
2. **Rollback on Failure**: If any step fails, all changes are rolled back
3. **No Partial Data**: You'll never have a user without a donor or vice versa

```typescript
// Example: If donor creation fails, user creation is also rolled back
const response = await authApi.registerDonor({
  username: 'testuser',
  password: 'password123',
  fullName: 'Test User',
  nationalID: '1234567890',
  gender: 0,
  dateOfBirth: '1990-01-01',
  bloodTypeID: 999, // Invalid blood type ID
});

// Result: Neither user nor donor is created
// The database remains in a consistent state
console.log(response.success); // false
console.log(response.errors); // ['Invalid blood type ID']
```

## Best Practices

1. **Always validate username before submission**: Use `checkUsernameExists` on blur or before form submission
2. **Handle all error cases**: Check for duplicate username, duplicate national ID, and validation errors
3. **Provide clear feedback**: Show specific error messages to help users correct their input
4. **Use default values wisely**: Omit optional fields to use sensible defaults (Donor role, active status)
5. **Secure passwords**: Enforce password requirements on the frontend (min 6 characters, complexity rules)
6. **Validate national ID format**: Ensure national ID matches expected format before submission

## Blood Type IDs Reference

```typescript
const BLOOD_TYPES = {
  1: 'A+',
  2: 'A-',
  3: 'B+',
  4: 'B-',
  5: 'O+',
  6: 'O-',
  7: 'AB+',
  8: 'AB-',
};
```

## Gender Values

```typescript
enum Gender {
  Male = 0,
  Female = 1
}
```
