import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi } from './auth';
import { apiClient } from './client';
import type { ServiceResponse, RegisterDonorRequest, RegisterDonorResponse } from '@/types/api';

// Mock the API client
vi.mock('./client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('authApi - Username Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkUsernameExists', () => {
    it('should check if username exists', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: true,
        message: 'Username exists',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.checkUsernameExists('existinguser');

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-username/existinguser');
      expect(result.data).toBe(true);
    });

    it('should return false when username does not exist', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: false,
        message: 'Username available',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.checkUsernameExists('newuser');

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-username/newuser');
      expect(result.data).toBe(false);
    });

    it('should encode special characters in username', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: false,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      await authApi.checkUsernameExists('user@test');

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-username/user%40test');
    });
  });

  describe('checkNationalIDExists', () => {
    it('should check if national ID exists', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: true,
        message: 'National ID exists',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.checkNationalIDExists('1234567890');

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-nationalid/1234567890');
      expect(result.data).toBe(true);
    });

    it('should return false when national ID does not exist', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: false,
        message: 'National ID available',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.checkNationalIDExists('9876543210');

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-nationalid/9876543210');
      expect(result.data).toBe(false);
    });

    it('should encode special characters in national ID', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: false,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      await authApi.checkNationalIDExists('123/456');

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-nationalid/123%2F456');
    });

    it('should handle national IDs with spaces', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: false,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      await authApi.checkNationalIDExists('123 456 789');

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-nationalid/123%20456%20789');
    });
  });

  describe('checkRoleExists', () => {
    it('should check if role ID exists', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: true,
        message: 'Role exists',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.checkRoleExists(5);

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-role/5');
      expect(result.data).toBe(true);
    });

    it('should return false when role ID does not exist', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: false,
        message: 'Role not found',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.checkRoleExists(999);

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-role/999');
      expect(result.data).toBe(false);
    });

    it('should handle valid donor role ID', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: true,
        message: 'Role exists',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.checkRoleExists(5); // Donor role

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-role/5');
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });

    it('should handle zero as invalid role ID', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: false,
        message: 'Role not found',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.checkRoleExists(0);

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-role/0');
      expect(result.data).toBe(false);
    });

    it('should handle negative role ID', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: false,
        message: 'Role not found',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.checkRoleExists(-1);

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-role/-1');
      expect(result.data).toBe(false);
    });
  });

  describe('checkBloodTypeExists', () => {
    it('should check if blood type ID exists', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: true,
        message: 'Blood type exists',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.checkBloodTypeExists(1);

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-bloodtype/1');
      expect(result.data).toBe(true);
    });

    it('should return false when blood type ID does not exist', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: false,
        message: 'Blood type not found',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.checkBloodTypeExists(999);

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-bloodtype/999');
      expect(result.data).toBe(false);
    });

    it('should handle valid blood type IDs (1-8)', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: true,
        message: 'Blood type exists',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      // Test A+ (ID: 1)
      const result = await authApi.checkBloodTypeExists(1);

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-bloodtype/1');
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });

    it('should handle zero as invalid blood type ID', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: false,
        message: 'Blood type not found',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.checkBloodTypeExists(0);

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-bloodtype/0');
      expect(result.data).toBe(false);
    });

    it('should handle negative blood type ID', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: false,
        message: 'Blood type not found',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.checkBloodTypeExists(-1);

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-bloodtype/-1');
      expect(result.data).toBe(false);
    });

    it('should handle blood type ID greater than 8', async () => {
      const mockResponse: ServiceResponse<boolean> = {
        success: true,
        data: false,
        message: 'Blood type not found',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.checkBloodTypeExists(10);

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-bloodtype/10');
      expect(result.data).toBe(false);
    });
  });

  describe('registerDonor', () => {
    it('should register a new donor with user account', async () => {
      const request: RegisterDonorRequest = {
        username: 'newdonor',
        password: 'password123',
        fullName: 'Ahmed Ali',
        phone: '0501234567',
        nationalID: '1234567890',
        gender: 0, // Male
        dateOfBirth: '1990-01-01',
        bloodTypeID: 1, // A+
        city: 'Riyadh',
      };

      const mockResponse: ServiceResponse<RegisterDonorResponse> = {
        success: true,
        data: {
          user: {
            userID: 1,
            username: 'newdonor',
            fullName: 'Ahmed Ali',
            phone: '0501234567',
            roleId: 5,
            roleName: 'Donor',
          },
          donor: {
            donorID: 1,
            fullName: 'Ahmed Ali',
            nationalID: '1234567890',
            gender: 0,
            dateOfBirth: '1990-01-01',
            phone: '0501234567',
            bloodTypeID: 1,
            bloodType: 'A+',
            city: 'Riyadh',
            isActive: true,
            userID: 1,
          },
        },
        message: 'Donor registered successfully',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.registerDonor(request);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register-donor', request);
      expect(result.success).toBe(true);
      expect(result.data?.user.username).toBe('newdonor');
      expect(result.data?.donor.nationalID).toBe('1234567890');
    });

    it('should handle duplicate username error', async () => {
      const request: RegisterDonorRequest = {
        username: 'existinguser',
        password: 'password123',
        fullName: 'Ahmed Ali',
        nationalID: '1234567890',
        gender: 0,
        dateOfBirth: '1990-01-01',
        bloodTypeID: 1,
      };

      const mockResponse: ServiceResponse<RegisterDonorResponse> = {
        success: false,
        data: null,
        message: 'Username already exists',
        errors: ['Username already exists'],
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.registerDonor(request);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Username already exists');
    });

    it('should handle duplicate nationalID error', async () => {
      const request: RegisterDonorRequest = {
        username: 'newuser',
        password: 'password123',
        fullName: 'Ahmed Ali',
        nationalID: '9999999999',
        gender: 0,
        dateOfBirth: '1990-01-01',
        bloodTypeID: 1,
      };

      const mockResponse: ServiceResponse<RegisterDonorResponse> = {
        success: false,
        data: null,
        message: 'National ID already registered',
        errors: ['National ID already registered'],
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.registerDonor(request);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('National ID already registered');
    });

    it('should use default values for optional fields', async () => {
      const request: RegisterDonorRequest = {
        username: 'minimaluser',
        password: 'password123',
        fullName: 'Ahmed Ali',
        nationalID: '1234567890',
        gender: 0,
        dateOfBirth: '1990-01-01',
        bloodTypeID: 1,
        // Optional fields not provided
      };

      const mockResponse: ServiceResponse<RegisterDonorResponse> = {
        success: true,
        data: {
          user: {
            userID: 1,
            username: 'minimaluser',
            fullName: 'Ahmed Ali',
            phone: null,
            roleId: 5, // Default Donor role
            roleName: 'Donor',
          },
          donor: {
            donorID: 1,
            fullName: 'Ahmed Ali',
            nationalID: '1234567890',
            gender: 0,
            dateOfBirth: '1990-01-01',
            phone: null,
            bloodTypeID: 1,
            bloodType: 'A+',
            city: null,
            isActive: true, // Default true
            userID: 1,
          },
        },
        message: 'Donor registered successfully',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.registerDonor(request);

      expect(result.success).toBe(true);
      expect(result.data?.user.roleId).toBe(5); // Default Donor role
      expect(result.data?.donor.isActive).toBe(true); // Default active
    });
  });
});

describe('authApi - Username Validation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate username before registration', async () => {
    // First check if username exists
    const checkResponse: ServiceResponse<boolean> = {
      success: true,
      data: true, // Username exists
      message: 'Username exists',
    };

    vi.mocked(apiClient.get).mockResolvedValue(checkResponse);

    const usernameExists = await authApi.checkUsernameExists('existinguser');

    expect(usernameExists.data).toBe(true);

    // If username exists, registration should not proceed
    // This would be handled in the UI/form validation layer
  });

  it('should proceed with registration when username is available', async () => {
    // First check if username exists
    const checkResponse: ServiceResponse<boolean> = {
      success: true,
      data: false, // Username available
      message: 'Username available',
    };

    vi.mocked(apiClient.get).mockResolvedValue(checkResponse);

    const usernameExists = await authApi.checkUsernameExists('newuser');

    expect(usernameExists.data).toBe(false);

    // Username is available, proceed with registration
    const request: RegisterDonorRequest = {
      username: 'newuser',
      password: 'password123',
      fullName: 'Ahmed Ali',
      nationalID: '1234567890',
      gender: 0,
      dateOfBirth: '1990-01-01',
      bloodTypeID: 1,
    };

    const registerResponse: ServiceResponse<RegisterDonorResponse> = {
      success: true,
      data: {
        user: {
          userID: 1,
          username: 'newuser',
          fullName: 'Ahmed Ali',
          phone: null,
          roleId: 5,
          roleName: 'Donor',
        },
        donor: {
          donorID: 1,
          fullName: 'Ahmed Ali',
          nationalID: '1234567890',
          gender: 0,
          dateOfBirth: '1990-01-01',
          phone: null,
          bloodTypeID: 1,
          bloodType: 'A+',
          city: null,
          isActive: true,
          userID: 1,
        },
      },
      message: 'Donor registered successfully',
    };

    vi.mocked(apiClient.post).mockResolvedValue(registerResponse);

    const result = await authApi.registerDonor(request);

    expect(result.success).toBe(true);
    expect(result.data?.user.username).toBe('newuser');
  });
});

describe('authApi - National ID Validation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate national ID before registration', async () => {
    // First check if national ID exists
    const checkResponse: ServiceResponse<boolean> = {
      success: true,
      data: true, // National ID exists
      message: 'National ID already registered',
    };

    vi.mocked(apiClient.get).mockResolvedValue(checkResponse);

    const nationalIDExists = await authApi.checkNationalIDExists('1234567890');

    expect(nationalIDExists.data).toBe(true);

    // If national ID exists, registration should not proceed
    // This would be handled in the UI/form validation layer
  });

  it('should proceed with registration when national ID is available', async () => {
    // First check if national ID exists
    const checkResponse: ServiceResponse<boolean> = {
      success: true,
      data: false, // National ID available
      message: 'National ID available',
    };

    vi.mocked(apiClient.get).mockResolvedValue(checkResponse);

    const nationalIDExists = await authApi.checkNationalIDExists('9876543210');

    expect(nationalIDExists.data).toBe(false);

    // National ID is available, proceed with registration
    const request: RegisterDonorRequest = {
      username: 'newdonor',
      password: 'password123',
      fullName: 'Ahmed Ali',
      nationalID: '9876543210',
      gender: 0,
      dateOfBirth: '1990-01-01',
      bloodTypeID: 1,
    };

    const registerResponse: ServiceResponse<RegisterDonorResponse> = {
      success: true,
      data: {
        user: {
          userID: 1,
          username: 'newdonor',
          fullName: 'Ahmed Ali',
          phone: null,
          roleId: 5,
          roleName: 'Donor',
        },
        donor: {
          donorID: 1,
          fullName: 'Ahmed Ali',
          nationalID: '9876543210',
          gender: 0,
          dateOfBirth: '1990-01-01',
          phone: null,
          bloodTypeID: 1,
          bloodType: 'A+',
          city: null,
          isActive: true,
          userID: 1,
        },
      },
      message: 'Donor registered successfully',
    };

    vi.mocked(apiClient.post).mockResolvedValue(registerResponse);

    const result = await authApi.registerDonor(request);

    expect(result.success).toBe(true);
    expect(result.data?.donor.nationalID).toBe('9876543210');
  });

  it('should validate both username and national ID before registration', async () => {
    // Check username
    const usernameCheckResponse: ServiceResponse<boolean> = {
      success: true,
      data: false, // Username available
      message: 'Username available',
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce(usernameCheckResponse);

    const usernameExists = await authApi.checkUsernameExists('newuser');
    expect(usernameExists.data).toBe(false);

    // Check national ID
    const nationalIDCheckResponse: ServiceResponse<boolean> = {
      success: true,
      data: false, // National ID available
      message: 'National ID available',
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce(nationalIDCheckResponse);

    const nationalIDExists = await authApi.checkNationalIDExists('1234567890');
    expect(nationalIDExists.data).toBe(false);

    // Both are available, proceed with registration
    const request: RegisterDonorRequest = {
      username: 'newuser',
      password: 'password123',
      fullName: 'Ahmed Ali',
      nationalID: '1234567890',
      gender: 0,
      dateOfBirth: '1990-01-01',
      bloodTypeID: 1,
    };

    const registerResponse: ServiceResponse<RegisterDonorResponse> = {
      success: true,
      data: {
        user: {
          userID: 1,
          username: 'newuser',
          fullName: 'Ahmed Ali',
          phone: null,
          roleId: 5,
          roleName: 'Donor',
        },
        donor: {
          donorID: 1,
          fullName: 'Ahmed Ali',
          nationalID: '1234567890',
          gender: 0,
          dateOfBirth: '1990-01-01',
          phone: null,
          bloodTypeID: 1,
          bloodType: 'A+',
          city: null,
          isActive: true,
          userID: 1,
        },
      },
      message: 'Donor registered successfully',
    };

    vi.mocked(apiClient.post).mockResolvedValue(registerResponse);

    const result = await authApi.registerDonor(request);

    expect(result.success).toBe(true);
    expect(result.data?.user.username).toBe('newuser');
    expect(result.data?.donor.nationalID).toBe('1234567890');
  });
});

describe('authApi - Role Validation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate role ID before registration', async () => {
    // Check if role ID exists
    const checkResponse: ServiceResponse<boolean> = {
      success: true,
      data: false, // Role does not exist
      message: 'Role not found',
    };

    vi.mocked(apiClient.get).mockResolvedValue(checkResponse);

    const roleExists = await authApi.checkRoleExists(999);

    expect(roleExists.data).toBe(false);

    // If role doesn't exist, registration should not proceed
    // This would be handled in the UI/form validation layer
  });

  it('should proceed with registration when role ID is valid', async () => {
    // Check if role ID exists
    const checkResponse: ServiceResponse<boolean> = {
      success: true,
      data: true, // Role exists
      message: 'Role exists',
    };

    vi.mocked(apiClient.get).mockResolvedValue(checkResponse);

    const roleExists = await authApi.checkRoleExists(5);

    expect(roleExists.data).toBe(true);

    // Role is valid, proceed with registration
    const request: RegisterDonorRequest = {
      username: 'newdonor',
      password: 'password123',
      fullName: 'Ahmed Ali',
      nationalID: '1234567890',
      gender: 0,
      dateOfBirth: '1990-01-01',
      bloodTypeID: 1,
      roleId: 5, // Donor role
    };

    const registerResponse: ServiceResponse<RegisterDonorResponse> = {
      success: true,
      data: {
        user: {
          userID: 1,
          username: 'newdonor',
          fullName: 'Ahmed Ali',
          phone: null,
          roleId: 5,
          roleName: 'Donor',
        },
        donor: {
          donorID: 1,
          fullName: 'Ahmed Ali',
          nationalID: '1234567890',
          gender: 0,
          dateOfBirth: '1990-01-01',
          phone: null,
          bloodTypeID: 1,
          bloodType: 'A+',
          city: null,
          isActive: true,
          userID: 1,
        },
      },
      message: 'Donor registered successfully',
    };

    vi.mocked(apiClient.post).mockResolvedValue(registerResponse);

    const result = await authApi.registerDonor(request);

    expect(result.success).toBe(true);
    expect(result.data?.user.roleId).toBe(5);
  });

  it('should handle registration with invalid role ID error', async () => {
    // Attempt registration with invalid role ID
    const request: RegisterDonorRequest = {
      username: 'newdonor',
      password: 'password123',
      fullName: 'Ahmed Ali',
      nationalID: '1234567890',
      gender: 0,
      dateOfBirth: '1990-01-01',
      bloodTypeID: 1,
      roleId: 999, // Invalid role
    };

    const mockResponse: ServiceResponse<RegisterDonorResponse> = {
      success: false,
      data: null,
      message: 'Invalid role ID',
      errors: ['Invalid role ID'],
    };

    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const result = await authApi.registerDonor(request);

    expect(result.success).toBe(false);
    expect(result.errors).toContain('Invalid role ID');
  });

  it('should validate all fields before registration', async () => {
    // Check username
    const usernameCheckResponse: ServiceResponse<boolean> = {
      success: true,
      data: false, // Username available
      message: 'Username available',
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce(usernameCheckResponse);

    const usernameExists = await authApi.checkUsernameExists('newuser');
    expect(usernameExists.data).toBe(false);

    // Check national ID
    const nationalIDCheckResponse: ServiceResponse<boolean> = {
      success: true,
      data: false, // National ID available
      message: 'National ID available',
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce(nationalIDCheckResponse);

    const nationalIDExists = await authApi.checkNationalIDExists('1234567890');
    expect(nationalIDExists.data).toBe(false);

    // Check role ID
    const roleCheckResponse: ServiceResponse<boolean> = {
      success: true,
      data: true, // Role exists
      message: 'Role exists',
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce(roleCheckResponse);

    const roleExists = await authApi.checkRoleExists(5);
    expect(roleExists.data).toBe(true);

    // All validations passed, proceed with registration
    const request: RegisterDonorRequest = {
      username: 'newuser',
      password: 'password123',
      fullName: 'Ahmed Ali',
      nationalID: '1234567890',
      gender: 0,
      dateOfBirth: '1990-01-01',
      bloodTypeID: 1,
      roleId: 5,
    };

    const registerResponse: ServiceResponse<RegisterDonorResponse> = {
      success: true,
      data: {
        user: {
          userID: 1,
          username: 'newuser',
          fullName: 'Ahmed Ali',
          phone: null,
          roleId: 5,
          roleName: 'Donor',
        },
        donor: {
          donorID: 1,
          fullName: 'Ahmed Ali',
          nationalID: '1234567890',
          gender: 0,
          dateOfBirth: '1990-01-01',
          phone: null,
          bloodTypeID: 1,
          bloodType: 'A+',
          city: null,
          isActive: true,
          userID: 1,
        },
      },
      message: 'Donor registered successfully',
    };

    vi.mocked(apiClient.post).mockResolvedValue(registerResponse);

    const result = await authApi.registerDonor(request);

    expect(result.success).toBe(true);
    expect(result.data?.user.username).toBe('newuser');
    expect(result.data?.donor.nationalID).toBe('1234567890');
    expect(result.data?.user.roleId).toBe(5);
  });
});

describe('authApi - Blood Type Validation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate blood type ID before registration', async () => {
    // Check if blood type ID exists
    const checkResponse: ServiceResponse<boolean> = {
      success: true,
      data: false, // Blood type does not exist
      message: 'Blood type not found',
    };

    vi.mocked(apiClient.get).mockResolvedValue(checkResponse);

    const bloodTypeExists = await authApi.checkBloodTypeExists(999);

    expect(bloodTypeExists.data).toBe(false);

    // If blood type doesn't exist, registration should not proceed
    // This would be handled in the UI/form validation layer
  });

  it('should proceed with registration when blood type ID is valid', async () => {
    // Check if blood type ID exists
    const checkResponse: ServiceResponse<boolean> = {
      success: true,
      data: true, // Blood type exists
      message: 'Blood type exists',
    };

    vi.mocked(apiClient.get).mockResolvedValue(checkResponse);

    const bloodTypeExists = await authApi.checkBloodTypeExists(1);

    expect(bloodTypeExists.data).toBe(true);

    // Blood type is valid, proceed with registration
    const request: RegisterDonorRequest = {
      username: 'newdonor',
      password: 'password123',
      fullName: 'Ahmed Ali',
      nationalID: '1234567890',
      gender: 0,
      dateOfBirth: '1990-01-01',
      bloodTypeID: 1, // A+
    };

    const registerResponse: ServiceResponse<RegisterDonorResponse> = {
      success: true,
      data: {
        user: {
          userID: 1,
          username: 'newdonor',
          fullName: 'Ahmed Ali',
          phone: null,
          roleId: 5,
          roleName: 'Donor',
        },
        donor: {
          donorID: 1,
          fullName: 'Ahmed Ali',
          nationalID: '1234567890',
          gender: 0,
          dateOfBirth: '1990-01-01',
          phone: null,
          bloodTypeID: 1,
          bloodType: 'A+',
          city: null,
          isActive: true,
          userID: 1,
        },
      },
      message: 'Donor registered successfully',
    };

    vi.mocked(apiClient.post).mockResolvedValue(registerResponse);

    const result = await authApi.registerDonor(request);

    expect(result.success).toBe(true);
    expect(result.data?.donor.bloodTypeID).toBe(1);
    expect(result.data?.donor.bloodType).toBe('A+');
  });

  it('should handle registration with invalid blood type ID error', async () => {
    // Attempt registration with invalid blood type ID
    const request: RegisterDonorRequest = {
      username: 'newdonor',
      password: 'password123',
      fullName: 'Ahmed Ali',
      nationalID: '1234567890',
      gender: 0,
      dateOfBirth: '1990-01-01',
      bloodTypeID: 999, // Invalid blood type
    };

    const mockResponse: ServiceResponse<RegisterDonorResponse> = {
      success: false,
      data: null,
      message: 'Invalid blood type ID',
      errors: ['Invalid blood type ID'],
    };

    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const result = await authApi.registerDonor(request);

    expect(result.success).toBe(false);
    expect(result.errors).toContain('Invalid blood type ID');
  });

  it('should validate all required fields including blood type before registration', async () => {
    // Check username
    const usernameCheckResponse: ServiceResponse<boolean> = {
      success: true,
      data: false, // Username available
      message: 'Username available',
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce(usernameCheckResponse);

    const usernameExists = await authApi.checkUsernameExists('newuser');
    expect(usernameExists.data).toBe(false);

    // Check national ID
    const nationalIDCheckResponse: ServiceResponse<boolean> = {
      success: true,
      data: false, // National ID available
      message: 'National ID available',
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce(nationalIDCheckResponse);

    const nationalIDExists = await authApi.checkNationalIDExists('1234567890');
    expect(nationalIDExists.data).toBe(false);

    // Check blood type ID
    const bloodTypeCheckResponse: ServiceResponse<boolean> = {
      success: true,
      data: true, // Blood type exists
      message: 'Blood type exists',
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce(bloodTypeCheckResponse);

    const bloodTypeExists = await authApi.checkBloodTypeExists(1);
    expect(bloodTypeExists.data).toBe(true);

    // All validations passed, proceed with registration
    const request: RegisterDonorRequest = {
      username: 'newuser',
      password: 'password123',
      fullName: 'Ahmed Ali',
      nationalID: '1234567890',
      gender: 0,
      dateOfBirth: '1990-01-01',
      bloodTypeID: 1,
    };

    const registerResponse: ServiceResponse<RegisterDonorResponse> = {
      success: true,
      data: {
        user: {
          userID: 1,
          username: 'newuser',
          fullName: 'Ahmed Ali',
          phone: null,
          roleId: 5,
          roleName: 'Donor',
        },
        donor: {
          donorID: 1,
          fullName: 'Ahmed Ali',
          nationalID: '1234567890',
          gender: 0,
          dateOfBirth: '1990-01-01',
          phone: null,
          bloodTypeID: 1,
          bloodType: 'A+',
          city: null,
          isActive: true,
          userID: 1,
        },
      },
      message: 'Donor registered successfully',
    };

    vi.mocked(apiClient.post).mockResolvedValue(registerResponse);

    const result = await authApi.registerDonor(request);

    expect(result.success).toBe(true);
    expect(result.data?.user.username).toBe('newuser');
    expect(result.data?.donor.nationalID).toBe('1234567890');
    expect(result.data?.donor.bloodTypeID).toBe(1);
    expect(result.data?.donor.bloodType).toBe('A+');
  });

  it('should handle all valid blood type IDs (1-8)', async () => {
    const bloodTypeMap = [
      { id: 1, name: 'A+' },
      { id: 2, name: 'A-' },
      { id: 3, name: 'B+' },
      { id: 4, name: 'B-' },
      { id: 5, name: 'O+' },
      { id: 6, name: 'O-' },
      { id: 7, name: 'AB+' },
      { id: 8, name: 'AB-' },
    ];

    for (const bloodType of bloodTypeMap) {
      const checkResponse: ServiceResponse<boolean> = {
        success: true,
        data: true,
        message: 'Blood type exists',
      };

      vi.mocked(apiClient.get).mockResolvedValue(checkResponse);

      const result = await authApi.checkBloodTypeExists(bloodType.id);

      expect(result.data).toBe(true);
      expect(apiClient.get).toHaveBeenCalledWith(`/auth/check-bloodtype/${bloodType.id}`);
    }
  });
});
