import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBloodRequestResponse } from './useBloodRequestResponse';
import * as useAuthModule from './useAuth';
import * as donorsApiModule from '@/api/donors';
import * as donationsApiModule from '@/api/donations';
import * as bloodRequestsApiModule from '@/api/bloodRequests';

// Mock the useAuth hook
vi.mock('./useAuth');

// Mock the donors API
vi.mock('@/api/donors', () => ({
  donorsApi: {
    getDonorByUserId: vi.fn(),
  },
}));

// Mock the donations API
vi.mock('@/api/donations', () => ({
  donationsApi: {
    create: vi.fn(),
  },
}));

// Mock the blood requests API
vi.mock('@/api/bloodRequests', () => ({
  bloodRequestsApi: {
    fulfill: vi.fn(),
  },
}));

describe('useBloodRequestResponse - Authentication Checks (Task 4.2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkAuthentication', () => {
    it('should return auth error when user is not authenticated', async () => {
      // Arrange: Mock unauthenticated user
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: null,
        isAuthenticated: false,
        userRole: null,
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: false,
        authMode: 'api',
      });

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 1, 500);

      // Assert
      expect(response.success).toBe(false);
      expect(response.errorType).toBe('auth');
      expect(response.error).toBe('يجب تسجيل الدخول للاستجابة لطلبات الدم');
    });

    it('should return auth error when user role is not donor', async () => {
      // Arrange: Mock authenticated staff user
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'staff@test.com', fullName: 'Staff User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'staff',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: true,
        isAdmin: false,
        isDonor: false,
        authMode: 'api',
      });

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 1, 500);

      // Assert
      expect(response.success).toBe(false);
      expect(response.errorType).toBe('auth');
      expect(response.error).toBe('هذه الميزة متاحة للمتبرعين فقط');
    });

    it('should return auth error when user role is admin', async () => {
      // Arrange: Mock authenticated admin user
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'admin@test.com', fullName: 'Admin User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'admin',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: true,
        isDonor: false,
        authMode: 'api',
      });

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 1, 500);

      // Assert
      expect(response.success).toBe(false);
      expect(response.errorType).toBe('auth');
      expect(response.error).toBe('هذه الميزة متاحة للمتبرعين فقط');
    });

    it('should pass authentication checks for authenticated donor', async () => {
      // Arrange: Mock authenticated donor user
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      // Mock donorsApi.getDonorByUserId to return donor data
      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockResolvedValue({
        success: true,
        data: {
          donorId: 1,
          fullName: 'Donor User',
          nationalId: '123456',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          phone: '123',
          bloodTypeId: 1, // O-
          city: 'Tripoli',
          isActive: true,
          createdAt: '2024-01-01',
        },
        message: 'Success',
      });

      // Mock donationsApi.create to return success
      vi.mocked(donationsApiModule.donationsApi.create).mockResolvedValue({
        success: true,
        data: {
          donationId: 1,
          donorId: 1,
          bloodTypeId: 1,
          donationDate: new Date().toISOString(),
          quantity: 500,
          testResult: 'Pending',
          notes: 'Response to request #1',
          createdAt: new Date().toISOString(),
        },
        message: 'Success',
      });

      // Mock bloodRequestsApi.fulfill to return success
      vi.mocked(bloodRequestsApiModule.bloodRequestsApi.fulfill).mockResolvedValue({
        success: true,
        data: true,
        message: 'Request fulfilled successfully',
      });

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 1, 500);

      // Assert
      // Should not fail with auth error and should succeed with donation creation
      expect(response.errorType).not.toBe('auth');
      expect(response.success).toBe(true);
      expect(response.donationId).toBe(1);
    });

    it('should set error state when authentication fails', async () => {
      // Arrange: Mock unauthenticated user
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: null,
        isAuthenticated: false,
        userRole: null,
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: false,
        authMode: 'api',
      });

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      await result.current.respondToRequest(1, 1, 500);

      // Assert
      await waitFor(() => {
        expect(result.current.error).toBe('يجب تسجيل الدخول للاستجابة لطلبات الدم');
      });
    });

    it('should set isLoading to false after authentication check', async () => {
      // Arrange: Mock unauthenticated user
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: null,
        isAuthenticated: false,
        userRole: null,
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: false,
        authMode: 'api',
      });

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      const promise = result.current.respondToRequest(1, 1, 500);

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await promise;
    });
  });
});

describe('useBloodRequestResponse - Blood Compatibility Check (Task 4.5)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkBloodCompatibility', () => {
    it('should return compatibility error when donor blood type is incompatible', async () => {
      // Arrange: Mock authenticated donor with blood type A+ (ID 4 in bloodCompatibility module)
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      // Mock donorsApi.getDonorByUserId to return donor with blood type A+ (ID 4)
      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockResolvedValue({
        success: true,
        data: {
          donorId: 1,
          fullName: 'Donor User',
          nationalId: '123456',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          phone: '123',
          bloodTypeId: 4, // A+ in bloodCompatibility module
          city: 'Tripoli',
          isActive: true,
          createdAt: '2024-01-01',
        },
        message: 'Success',
      });

      // Act: Try to respond to a request for blood type B- (ID 5) which is incompatible with A+
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 5, 500);

      // Assert
      expect(response.success).toBe(false);
      expect(response.errorType).toBe('compatibility');
      expect(response.error).toContain('غير متوافقة');
      expect(response.error).toContain('A+'); // Donor blood type
      expect(response.error).toContain('B-'); // Request blood type
    });

    it('should pass compatibility check when donor blood type is compatible', async () => {
      // Arrange: Mock authenticated donor with blood type O- (ID 1 in bloodCompatibility module)
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      // Mock donorsApi.getDonorByUserId to return donor with blood type O- (ID 1)
      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockResolvedValue({
        success: true,
        data: {
          donorId: 1,
          fullName: 'Donor User',
          nationalId: '123456',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          phone: '123',
          bloodTypeId: 1, // O- (universal donor) in bloodCompatibility module
          city: 'Tripoli',
          isActive: true,
          createdAt: '2024-01-01',
        },
        message: 'Success',
      });

      // Mock donationsApi.create to return success
      vi.mocked(donationsApiModule.donationsApi.create).mockResolvedValue({
        success: true,
        data: {
          donationId: 1,
          donorId: 1,
          bloodTypeId: 4,
          donationDate: new Date().toISOString(),
          quantity: 500,
          testResult: 'Pending',
          notes: 'Response to request #1',
          createdAt: new Date().toISOString(),
        },
        message: 'Success',
      });

      // Mock bloodRequestsApi.fulfill to return success
      vi.mocked(bloodRequestsApiModule.bloodRequestsApi.fulfill).mockResolvedValue({
        success: true,
        data: true,
        message: 'Request fulfilled successfully',
      });

      // Act: Try to respond to a request for blood type A+ (ID 4) which is compatible with O-
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 4, 500);

      // Assert: Should not fail with compatibility error and should succeed with donation creation
      expect(response.errorType).not.toBe('compatibility');
      expect(response.success).toBe(true);
      expect(response.donationId).toBe(1);
    });

    it('should return error when getDonorByUserId fails', async () => {
      // Arrange: Mock authenticated donor
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      // Mock donorsApi.getDonorByUserId to return failure
      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockResolvedValue({
        success: false,
        data: null,
        message: 'Donor not found',
      });

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 1, 500);

      // Assert
      expect(response.success).toBe(false);
      expect(response.errorType).toBe('compatibility');
      expect(response.error).toBe('فشل في جلب معلومات المتبرع');
    });

    it('should return error when getDonorByUserId throws exception', async () => {
      // Arrange: Mock authenticated donor
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      // Mock donorsApi.getDonorByUserId to throw error
      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockRejectedValue(new Error('Network error'));

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 1, 500);

      // Assert
      expect(response.success).toBe(false);
      expect(response.errorType).toBe('compatibility');
      expect(response.error).toBe('حدث خطأ أثناء التحقق من توافق فصيلة الدم');
    });

    it('should set error state when compatibility check fails', async () => {
      // Arrange: Mock authenticated donor with incompatible blood type
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockResolvedValue({
        success: true,
        data: {
          donorId: 1,
          fullName: 'Donor User',
          nationalId: '123456',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          phone: '123',
          bloodTypeId: 4, // A+ in bloodCompatibility module
          city: 'Tripoli',
          isActive: true,
          createdAt: '2024-01-01',
        },
        message: 'Success',
      });

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      await result.current.respondToRequest(1, 5, 500); // Request for B- (incompatible)

      // Assert
      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
        expect(result.current.error).toContain('غير متوافقة');
      });
    });
  });
});

describe('useBloodRequestResponse - Eligibility Check (Task 4.8)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkDonationEligibility', () => {
    it('should return eligibility error when donor donated within 90 days', async () => {
      // Arrange: Mock authenticated donor
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      // Mock donor with recent donation (30 days ago)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockResolvedValue({
        success: true,
        data: {
          donorId: 1,
          fullName: 'Donor User',
          nationalId: '123456',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          phone: '123',
          bloodTypeId: 1, // O- (universal donor)
          city: 'Tripoli',
          lastDonationDate: thirtyDaysAgo.toISOString(),
          isActive: true,
          createdAt: '2024-01-01',
        },
        message: 'Success',
      });

      // Act: Try to respond to a compatible request
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 4, 500);

      // Assert
      expect(response.success).toBe(false);
      expect(response.errorType).toBe('eligibility');
      expect(response.error).toContain('آخر تبرع لك كان في');
      expect(response.error).toContain('يمكنك التبرع مرة أخرى في');
    });

    it('should pass eligibility check when donor donated more than 90 days ago', async () => {
      // Arrange: Mock authenticated donor
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      // Mock donor with old donation (100 days ago)
      const hundredDaysAgo = new Date();
      hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);

      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockResolvedValue({
        success: true,
        data: {
          donorId: 1,
          fullName: 'Donor User',
          nationalId: '123456',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          phone: '123',
          bloodTypeId: 1, // O- (universal donor)
          city: 'Tripoli',
          lastDonationDate: hundredDaysAgo.toISOString(),
          isActive: true,
          createdAt: '2024-01-01',
        },
        message: 'Success',
      });

      // Mock donationsApi.create to return success
      vi.mocked(donationsApiModule.donationsApi.create).mockResolvedValue({
        success: true,
        data: {
          donationId: 1,
          donorId: 1,
          bloodTypeId: 4,
          donationDate: new Date().toISOString(),
          quantity: 500,
          testResult: 'Pending',
          notes: 'Response to request #1',
          createdAt: new Date().toISOString(),
        },
        message: 'Success',
      });

      // Mock bloodRequestsApi.fulfill to return success
      vi.mocked(bloodRequestsApiModule.bloodRequestsApi.fulfill).mockResolvedValue({
        success: true,
        data: true,
        message: 'Request fulfilled successfully',
      });

      // Act: Try to respond to a compatible request
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 4, 500);

      // Assert: Should not fail with eligibility error and should succeed with donation creation
      expect(response.errorType).not.toBe('eligibility');
      expect(response.success).toBe(true);
      expect(response.donationId).toBe(1);
    });

    it('should pass eligibility check when donor has never donated before', async () => {
      // Arrange: Mock authenticated donor
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      // Mock donor with no previous donations (lastDonationDate is undefined)
      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockResolvedValue({
        success: true,
        data: {
          donorId: 1,
          fullName: 'Donor User',
          nationalId: '123456',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          phone: '123',
          bloodTypeId: 1, // O- (universal donor)
          city: 'Tripoli',
          // lastDonationDate is undefined (never donated)
          isActive: true,
          createdAt: '2024-01-01',
        },
        message: 'Success',
      });

      // Mock donationsApi.create to return success
      vi.mocked(donationsApiModule.donationsApi.create).mockResolvedValue({
        success: true,
        data: {
          donationId: 1,
          donorId: 1,
          bloodTypeId: 4,
          donationDate: new Date().toISOString(),
          quantity: 500,
          testResult: 'Pending',
          notes: 'Response to request #1',
          createdAt: new Date().toISOString(),
        },
        message: 'Success',
      });

      // Mock bloodRequestsApi.fulfill to return success
      vi.mocked(bloodRequestsApiModule.bloodRequestsApi.fulfill).mockResolvedValue({
        success: true,
        data: true,
        message: 'Request fulfilled successfully',
      });

      // Act: Try to respond to a compatible request
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 4, 500);

      // Assert: Should not fail with eligibility error and should succeed with donation creation
      expect(response.errorType).not.toBe('eligibility');
      expect(response.success).toBe(true);
      expect(response.donationId).toBe(1);
    });

    it('should return error when getDonorByUserId fails during eligibility check', async () => {
      // Arrange: Mock authenticated donor
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      // Mock getDonorByUserId to succeed first (for compatibility check) then fail (for eligibility check)
      let callCount = 0;
      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          // First call (compatibility check) - succeed
          return {
            success: true,
            data: {
              donorId: 1,
              fullName: 'Donor User',
              nationalId: '123456',
              gender: 'Male',
              dateOfBirth: '1990-01-01',
              phone: '123',
              bloodTypeId: 1,
              city: 'Tripoli',
              isActive: true,
              createdAt: '2024-01-01',
            },
            message: 'Success',
          };
        } else {
          // Second call (eligibility check) - fail
          return {
            success: false,
            data: null,
            message: 'Donor not found',
          };
        }
      });

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 4, 500);

      // Assert
      expect(response.success).toBe(false);
      expect(response.errorType).toBe('eligibility');
      expect(response.error).toBe('فشل في جلب معلومات المتبرع');
    });

    it('should set error state when eligibility check fails', async () => {
      // Arrange: Mock authenticated donor with recent donation
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockResolvedValue({
        success: true,
        data: {
          donorId: 1,
          fullName: 'Donor User',
          nationalId: '123456',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          phone: '123',
          bloodTypeId: 1,
          city: 'Tripoli',
          lastDonationDate: thirtyDaysAgo.toISOString(),
          isActive: true,
          createdAt: '2024-01-01',
        },
        message: 'Success',
      });

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      await result.current.respondToRequest(1, 4, 500);

      // Assert
      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
        expect(result.current.error).toContain('آخر تبرع لك كان في');
      });
    });
  });
});

describe('useBloodRequestResponse - Request Fulfillment (Task 4.12)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fulfillRequest', () => {
    it('should call fulfill endpoint after successful donation creation', async () => {
      // Arrange: Mock authenticated donor with eligible status
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      // Mock donor with old donation (eligible)
      const hundredDaysAgo = new Date();
      hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);

      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockResolvedValue({
        success: true,
        data: {
          donorId: 1,
          fullName: 'Donor User',
          nationalId: '123456',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          phone: '123',
          bloodTypeId: 1, // O- (universal donor)
          city: 'Tripoli',
          lastDonationDate: hundredDaysAgo.toISOString(),
          isActive: true,
          createdAt: '2024-01-01',
        },
        message: 'Success',
      });

      // Mock successful donation creation
      vi.mocked(donationsApiModule.donationsApi.create).mockResolvedValue({
        success: true,
        data: {
          donationId: 123,
          donorId: 1,
          bloodTypeId: 4,
          donationDate: new Date().toISOString(),
          quantity: 500,
          testResult: 'Pending',
          notes: 'Response to request #1',
          createdAt: new Date().toISOString(),
        },
        message: 'Success',
      });

      // Mock successful fulfill
      vi.mocked(bloodRequestsApiModule.bloodRequestsApi.fulfill).mockResolvedValue({
        success: true,
        data: true,
        message: 'Request fulfilled successfully',
      });

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 4, 500);

      // Assert
      expect(bloodRequestsApiModule.bloodRequestsApi.fulfill).toHaveBeenCalledWith(1, {
        donationId: 123,
        quantity: 500,
      });
      expect(response.success).toBe(true);
      expect(response.donationId).toBe(123);
    });

    it('should NOT call fulfill endpoint if donation creation fails', async () => {
      // Arrange: Mock authenticated donor with eligible status
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      // Mock donor with old donation (eligible)
      const hundredDaysAgo = new Date();
      hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);

      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockResolvedValue({
        success: true,
        data: {
          donorId: 1,
          fullName: 'Donor User',
          nationalId: '123456',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          phone: '123',
          bloodTypeId: 1, // O- (universal donor)
          city: 'Tripoli',
          lastDonationDate: hundredDaysAgo.toISOString(),
          isActive: true,
          createdAt: '2024-01-01',
        },
        message: 'Success',
      });

      // Mock failed donation creation
      vi.mocked(donationsApiModule.donationsApi.create).mockResolvedValue({
        success: false,
        data: null,
        message: 'Failed to create donation',
      });

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 4, 500);

      // Assert
      expect(bloodRequestsApiModule.bloodRequestsApi.fulfill).not.toHaveBeenCalled();
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to create donation');
    });

    it('should return error if fulfill endpoint fails', async () => {
      // Arrange: Mock authenticated donor with eligible status
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      // Mock donor with old donation (eligible)
      const hundredDaysAgo = new Date();
      hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);

      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockResolvedValue({
        success: true,
        data: {
          donorId: 1,
          fullName: 'Donor User',
          nationalId: '123456',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          phone: '123',
          bloodTypeId: 1, // O- (universal donor)
          city: 'Tripoli',
          lastDonationDate: hundredDaysAgo.toISOString(),
          isActive: true,
          createdAt: '2024-01-01',
        },
        message: 'Success',
      });

      // Mock successful donation creation
      vi.mocked(donationsApiModule.donationsApi.create).mockResolvedValue({
        success: true,
        data: {
          donationId: 123,
          donorId: 1,
          bloodTypeId: 4,
          donationDate: new Date().toISOString(),
          quantity: 500,
          testResult: 'Pending',
          notes: 'Response to request #1',
          createdAt: new Date().toISOString(),
        },
        message: 'Success',
      });

      // Mock failed fulfill
      vi.mocked(bloodRequestsApiModule.bloodRequestsApi.fulfill).mockResolvedValue({
        success: false,
        data: false,
        message: 'Failed to fulfill request',
      });

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 4, 500);

      // Assert
      expect(bloodRequestsApiModule.bloodRequestsApi.fulfill).toHaveBeenCalledWith(1, {
        donationId: 123,
        quantity: 500,
      });
      expect(response.success).toBe(false);
      expect(response.errorType).toBe('api');
      expect(response.error).toBe('Failed to fulfill request');
    });

    it('should return error if fulfill endpoint throws exception', async () => {
      // Arrange: Mock authenticated donor with eligible status
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      // Mock donor with old donation (eligible)
      const hundredDaysAgo = new Date();
      hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);

      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockResolvedValue({
        success: true,
        data: {
          donorId: 1,
          fullName: 'Donor User',
          nationalId: '123456',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          phone: '123',
          bloodTypeId: 1, // O- (universal donor)
          city: 'Tripoli',
          lastDonationDate: hundredDaysAgo.toISOString(),
          isActive: true,
          createdAt: '2024-01-01',
        },
        message: 'Success',
      });

      // Mock successful donation creation
      vi.mocked(donationsApiModule.donationsApi.create).mockResolvedValue({
        success: true,
        data: {
          donationId: 123,
          donorId: 1,
          bloodTypeId: 4,
          donationDate: new Date().toISOString(),
          quantity: 500,
          testResult: 'Pending',
          notes: 'Response to request #1',
          createdAt: new Date().toISOString(),
        },
        message: 'Success',
      });

      // Mock fulfill throwing error
      vi.mocked(bloodRequestsApiModule.bloodRequestsApi.fulfill).mockRejectedValue(new Error('Network error'));

      // Act
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(1, 4, 500);

      // Assert
      expect(bloodRequestsApiModule.bloodRequestsApi.fulfill).toHaveBeenCalledWith(1, {
        donationId: 123,
        quantity: 500,
      });
      expect(response.success).toBe(false);
      expect(response.errorType).toBe('api');
      expect(response.error).toBe('Network error');
    });

    it('should pass correct requestId, donationId, and quantity to fulfill endpoint', async () => {
      // Arrange: Mock authenticated donor with eligible status
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { userId: 1, username: 'donor@test.com', fullName: 'Donor User', phone: '123', isActive: true, createdAt: '2024-01-01' },
        isAuthenticated: true,
        userRole: 'donor',
        isLoading: false,
        session: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        isStaff: false,
        isAdmin: false,
        isDonor: true,
        authMode: 'api',
      });

      // Mock donor with old donation (eligible)
      const hundredDaysAgo = new Date();
      hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);

      vi.mocked(donorsApiModule.donorsApi.getDonorByUserId).mockResolvedValue({
        success: true,
        data: {
          donorId: 1,
          fullName: 'Donor User',
          nationalId: '123456',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          phone: '123',
          bloodTypeId: 1, // O- (universal donor)
          city: 'Tripoli',
          lastDonationDate: hundredDaysAgo.toISOString(),
          isActive: true,
          createdAt: '2024-01-01',
        },
        message: 'Success',
      });

      // Mock successful donation creation with specific donationId
      vi.mocked(donationsApiModule.donationsApi.create).mockResolvedValue({
        success: true,
        data: {
          donationId: 456,
          donorId: 1,
          bloodTypeId: 4,
          donationDate: new Date().toISOString(),
          quantity: 750,
          testResult: 'Pending',
          notes: 'Response to request #99',
          createdAt: new Date().toISOString(),
        },
        message: 'Success',
      });

      // Mock successful fulfill
      vi.mocked(bloodRequestsApiModule.bloodRequestsApi.fulfill).mockResolvedValue({
        success: true,
        data: true,
        message: 'Request fulfilled successfully',
      });

      // Act: Call with specific requestId and quantity
      const { result } = renderHook(() => useBloodRequestResponse());
      const response = await result.current.respondToRequest(99, 4, 750);

      // Assert: Verify correct parameters passed to fulfill
      expect(bloodRequestsApiModule.bloodRequestsApi.fulfill).toHaveBeenCalledWith(99, {
        donationId: 456,
        quantity: 750,
      });
      expect(response.success).toBe(true);
      expect(response.donationId).toBe(456);
    });
  });
});
