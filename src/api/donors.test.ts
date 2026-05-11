import { describe, it, expect, vi, beforeEach } from 'vitest';
import { donorsApi } from './donors';
import { apiClient } from './client';
import type { ServiceResponse, Donor } from '@/types/api';

// Mock the apiClient
vi.mock('./client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('donorsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDonorByUserId', () => {
    it('should fetch donor information by user ID', async () => {
      // Arrange
      const userId = 123;
      const mockDonor: Donor = {
        donorId: 1,
        fullName: 'أحمد محمد',
        nationalId: '1234567890',
        gender: 'Male',
        dateOfBirth: '1990-01-01',
        phone: '0912345678',
        bloodTypeId: 5,
        city: 'غريان',
        lastDonationDate: '2024-01-15',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
      };

      const mockResponse: ServiceResponse<Donor> = {
        success: true,
        message: 'تم جلب بيانات المتبرع بنجاح',
        data: mockDonor,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      // Act
      const result = await donorsApi.getDonorByUserId(userId);

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith(`/donors/user/${userId}`);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockDonor);
      expect(result.data?.donorId).toBe(1);
      expect(result.data?.bloodTypeId).toBe(5);
      expect(result.data?.lastDonationDate).toBe('2024-01-15');
    });

    it('should handle network failures', async () => {
      // Arrange
      const userId = 123;
      const mockErrorResponse: ServiceResponse<Donor> = {
        success: false,
        message: 'فشل الاتصال بالخادم',
        data: null,
        errors: ['Network error'],
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockErrorResponse);

      // Act
      const result = await donorsApi.getDonorByUserId(userId);

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith(`/donors/user/${userId}`);
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.errors).toContain('Network error');
    });

    it('should handle donor not found', async () => {
      // Arrange
      const userId = 999;
      const mockErrorResponse: ServiceResponse<Donor> = {
        success: false,
        message: 'المتبرع غير موجود',
        data: null,
        errors: ['Donor not found for user ID'],
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockErrorResponse);

      // Act
      const result = await donorsApi.getDonorByUserId(userId);

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith(`/donors/user/${userId}`);
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
    });

    it('should handle donor with no previous donations (lastDonationDate is null)', async () => {
      // Arrange
      const userId = 456;
      const mockDonor: Donor = {
        donorId: 2,
        fullName: 'فاطمة علي',
        nationalId: '0987654321',
        gender: 'Female',
        dateOfBirth: '1995-05-15',
        phone: '0923456789',
        bloodTypeId: 1,
        city: 'طرابلس',
        lastDonationDate: undefined, // No previous donations
        isActive: true,
        createdAt: '2024-02-01T00:00:00Z',
      };

      const mockResponse: ServiceResponse<Donor> = {
        success: true,
        message: 'تم جلب بيانات المتبرع بنجاح',
        data: mockDonor,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      // Act
      const result = await donorsApi.getDonorByUserId(userId);

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith(`/donors/user/${userId}`);
      expect(result.success).toBe(true);
      expect(result.data?.lastDonationDate).toBeUndefined();
    });
  });
});
