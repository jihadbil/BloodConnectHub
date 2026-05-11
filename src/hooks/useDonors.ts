// React Query hooks for Donors API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donorsApi } from '@/api/donors';
import type { CreateDonorRequest, UpdateDonorRequest } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const donorKeys = {
  all: ['donors'] as const,
  lists: () => [...donorKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...donorKeys.lists(), { page, pageSize }] as const,
  details: () => [...donorKeys.all, 'detail'] as const,
  detail: (id: number) => [...donorKeys.details(), id] as const,
  eligible: (bloodTypeId?: number) => [...donorKeys.all, 'eligible', bloodTypeId] as const,
  donations: (id: number) => [...donorKeys.all, 'donations', id] as const,
};

/**
 * جلب قائمة المتبرعين
 */
export function useDonors(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: donorKeys.list(page, pageSize),
    queryFn: () => donorsApi.getAll(page, pageSize),
  });
}

/**
 * جلب تفاصيل متبرع
 */
export function useDonor(id: number) {
  return useQuery({
    queryKey: donorKeys.detail(id),
    queryFn: () => donorsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * جلب المتبرعين المؤهلين للتبرع
 */
export function useEligibleDonors(bloodTypeId?: number) {
  return useQuery({
    queryKey: donorKeys.eligible(bloodTypeId),
    queryFn: () => donorsApi.getEligible(bloodTypeId),
  });
}

/**
 * جلب تبرعات متبرع محدد
 */
export function useDonorDonations(id: number) {
  return useQuery({
    queryKey: donorKeys.donations(id),
    queryFn: () => donorsApi.getDonations(id),
    enabled: !!id,
  });
}

/**
 * إضافة متبرع جديد
 */
export function useCreateDonor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateDonorRequest) => donorsApi.create(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: donorKeys.all });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم إضافة المتبرع بنجاح',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في إضافة المتبرع',
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
 * تحديث بيانات متبرع
 */
export function useUpdateDonor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDonorRequest }) =>
      donorsApi.update(id, data),
    onSuccess: (response, { id }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: donorKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: donorKeys.lists() });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم تحديث بيانات المتبرع',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في تحديث البيانات',
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
 * حذف متبرع
 */
export function useDeleteDonor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => donorsApi.delete(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: donorKeys.all });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم حذف المتبرع',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في حذف المتبرع',
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
 * فحص أهلية متبرع
 */
export function useCheckDonorEligibility() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => donorsApi.checkEligibility(id),
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: response.data ? 'مؤهل للتبرع' : 'غير مؤهل',
          description: response.message,
          variant: response.data ? 'default' : 'destructive',
        });
      }
    },
  });
}
