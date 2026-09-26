// React Query hooks for Donations API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donationsApi } from '@/api/donations';
import type { CreateDonationRequest, UpdateTestResultRequest, LabTestDonationDto } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { inventoryKeys } from '@/hooks/useInventory';

// Map TestResult string → numeric value expected by API
const TEST_RESULT_MAP: Record<string, number> = {
  Pending: 1,
  Accepted: 2,
  Rejected: 3,
};

// Query keys
export const donationKeys = {
  all: ['donations'] as const,
  lists: () => [...donationKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...donationKeys.lists(), { page, pageSize }] as const,
  details: () => [...donationKeys.all, 'detail'] as const,
  detail: (id: number) => [...donationKeys.details(), id] as const,
  recent: (days?: number) => [...donationKeys.all, 'recent', days] as const,
  byDonor: (donorId: number) => [...donationKeys.all, 'donor', donorId] as const,
};

/**
 * جلب قائمة التبرعات
 */
export function useDonations(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: donationKeys.list(page, pageSize),
    queryFn: () => donationsApi.getAll(page, pageSize),
  });
}

/**
 * جلب تفاصيل تبرع
 */
export function useDonation(id: number) {
  return useQuery({
    queryKey: donationKeys.detail(id),
    queryFn: () => donationsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * جلب تبرعات متبرع محدد
 */
export function useDonorDonations(donorId: number) {
  return useQuery({
    queryKey: donationKeys.byDonor(donorId),
    queryFn: () => donationsApi.getByDonor(donorId),
    enabled: !!donorId,
  });
}

/**
 * جلب التبرعات الأخيرة
 */
export function useRecentDonations(days = 30) {
  return useQuery({
    queryKey: donationKeys.recent(days),
    queryFn: () => donationsApi.getRecent(days),
  });
}

/**
 * تسجيل تبرع جديد
 */
export function useCreateDonation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateDonationRequest) => donationsApi.create(data),
    onSuccess: (response) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: donationKeys.all });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم تسجيل التبرع بنجاح',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في تسجيل التبرع',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'فشل الاتصال بالخادم',
        variant: 'destructive',
      });
    },
  });
}

/**
 * تحديث نتيجة فحص تبرع
 */
export function useUpdateDonationTestResult() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTestResultRequest }) => {
      const numericResult = typeof data.testResult === 'string'
        ? TEST_RESULT_MAP[data.testResult] ?? data.testResult
        : data.testResult;
      return donationsApi.updateTestResult(id, { ...data, testResult: numericResult as any });
    },
    onSuccess: (response, { id }) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: donationKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: donationKeys.lists() });
        queryClient.invalidateQueries({ queryKey: donationKeys.recent() });
        // تحديث المخزون عند تغيير نتيجة الفحص
        queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم تحديث نتيجة الفحص',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في تحديث النتيجة',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'فشل الاتصال بالخادم',
        variant: 'destructive',
      });
    },
  });
}

/**
 * إجراء فحص مخبري
 */
export function usePerformLabTest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LabTestDonationDto }) => {
      // Convert string testResult to numeric value as required by the API
      const numericResult = typeof data.testResult === 'string'
        ? TEST_RESULT_MAP[data.testResult] ?? data.testResult
        : data.testResult;
      return donationsApi.performLabTest(id, { ...data, testResult: numericResult as any });
    },
    onSuccess: (response, { id }) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: donationKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: donationKeys.lists() });
        queryClient.invalidateQueries({ queryKey: donationKeys.recent() });
        // تحديث المخزون لأن الفحص الناجح يضيف وحدات للمخزون
        queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم تسجيل نتيجة الفحص المخبري بنجاح',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في تسجيل نتيجة الفحص',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'فشل الاتصال بالخادم',
        variant: 'destructive',
      });
    },
  });
}

/**
 * حذف تبرع
 */
export function useDeleteDonation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => donationsApi.delete(id),
    onSuccess: (response) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: donationKeys.all });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم حذف التبرع',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في حذف التبرع',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'فشل الاتصال بالخادم',
        variant: 'destructive',
      });
    },
  });
}
