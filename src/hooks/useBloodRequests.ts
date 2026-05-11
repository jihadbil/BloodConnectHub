// React Query hooks for Blood Requests API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bloodRequestsApi } from '@/api/bloodRequests';
import type { CreateBloodRequestRequest, RequestStatus, FulfillRequestPayload } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const bloodRequestKeys = {
  all: ['bloodRequests'] as const,
  lists: () => [...bloodRequestKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...bloodRequestKeys.lists(), { page, pageSize }] as const,
  details: () => [...bloodRequestKeys.all, 'detail'] as const,
  detail: (id: number) => [...bloodRequestKeys.details(), id] as const,
  pending: () => [...bloodRequestKeys.all, 'pending'] as const,
  urgent: () => [...bloodRequestKeys.all, 'urgent'] as const,
};

/**
 * جلب قائمة طلبات الدم
 */
export function useBloodRequests(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: bloodRequestKeys.list(page, pageSize),
    queryFn: () => bloodRequestsApi.getAll(page, pageSize),
  });
}

/**
 * جلب تفاصيل طلب دم
 */
export function useBloodRequest(id: number) {
  return useQuery({
    queryKey: bloodRequestKeys.detail(id),
    queryFn: () => bloodRequestsApi.getDetails(id),
    enabled: !!id,
  });
}

/**
 * جلب الطلبات المعلقة
 */
export function usePendingBloodRequests() {
  return useQuery({
    queryKey: bloodRequestKeys.pending(),
    queryFn: () => bloodRequestsApi.getPending(),
  });
}

/**
 * جلب الطلبات العاجلة
 */
export function useUrgentBloodRequests() {
  return useQuery({
    queryKey: bloodRequestKeys.urgent(),
    queryFn: () => bloodRequestsApi.getUrgent(),
  });
}

/**
 * إنشاء طلب دم جديد
 */
export function useCreateBloodRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateBloodRequestRequest) => bloodRequestsApi.create(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: bloodRequestKeys.all });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم إنشاء طلب الدم بنجاح',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في إنشاء طلب الدم',
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
 * تحديث حالة طلب
 */
export function useUpdateBloodRequestStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status, notes }: { id: number; status: RequestStatus; notes?: string }) =>
      bloodRequestsApi.updateStatus(id, status, notes),
    onSuccess: (response, { id }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: bloodRequestKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: bloodRequestKeys.lists() });
        queryClient.invalidateQueries({ queryKey: bloodRequestKeys.pending() });
        queryClient.invalidateQueries({ queryKey: bloodRequestKeys.urgent() });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم تحديث حالة الطلب',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في تحديث الحالة',
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
 * تنفيذ طلب دم (ربطه بتبرع)
 */
export function useFulfillBloodRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FulfillRequestPayload }) =>
      bloodRequestsApi.fulfill(id, payload),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: bloodRequestKeys.all });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم تنفيذ الطلب بنجاح',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في تنفيذ الطلب',
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
 * إلغاء طلب دم
 */
export function useCancelBloodRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      bloodRequestsApi.cancel(id, reason),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: bloodRequestKeys.all });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم إلغاء الطلب',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في إلغاء الطلب',
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
