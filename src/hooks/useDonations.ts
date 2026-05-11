// React Query hooks for Donations API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donationsApi } from '@/api/donations';
import type { CreateDonationRequest, UpdateTestResultRequest } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const donationKeys = {
  all: ['donations'] as const,
  lists: () => [...donationKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...donationKeys.lists(), { page, pageSize }] as const,
  details: () => [...donationKeys.all, 'detail'] as const,
  detail: (id: number) => [...donationKeys.details(), id] as const,
  approved: () => [...donationKeys.all, 'approved'] as const,
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
 * جلب التبرعات المعتمدة
 */
export function useApprovedDonations() {
  return useQuery({
    queryKey: donationKeys.approved(),
    queryFn: () => donationsApi.getApproved(),
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
      if (response.success) {
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
    mutationFn: ({ id, data }: { id: number; data: UpdateTestResultRequest }) =>
      donationsApi.updateTestResult(id, data),
    onSuccess: (response, { id }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: donationKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: donationKeys.lists() });
        queryClient.invalidateQueries({ queryKey: donationKeys.approved() });
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
 * حذف تبرع
 */
export function useDeleteDonation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => donationsApi.delete(id),
    onSuccess: (response) => {
      if (response.success) {
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
