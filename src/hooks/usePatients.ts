// React Query hooks for Patients API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientsApi } from '@/api/patients';
import type { CreatePatientRequest, UpdatePatientRequest } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...patientKeys.lists(), { page, pageSize }] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  detail: (id: number) => [...patientKeys.details(), id] as const,
  requests: (id: number) => [...patientKeys.all, 'requests', id] as const,
};

/**
 * جلب قائمة المرضى
 */
export function usePatients(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: patientKeys.list(page, pageSize),
    queryFn: () => patientsApi.getAll(page, pageSize),
  });
}

/**
 * جلب تفاصيل مريض
 */
export function usePatient(id: number) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => patientsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * جلب طلبات دم مريض محدد
 */
export function usePatientRequests(id: number) {
  return useQuery({
    queryKey: patientKeys.requests(id),
    queryFn: () => patientsApi.getRequests(id),
    enabled: !!id,
  });
}

/**
 * إضافة مريض جديد
 */
export function useCreatePatient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreatePatientRequest) => patientsApi.create(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: patientKeys.all });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم إضافة المريض بنجاح',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في إضافة المريض',
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
 * تحديث بيانات مريض
 */
export function useUpdatePatient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePatientRequest }) =>
      patientsApi.update(id, data),
    onSuccess: (response, { id }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم تحديث بيانات المريض',
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
 * حذف مريض
 */
export function useDeletePatient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => patientsApi.delete(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: patientKeys.all });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم حذف المريض',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في حذف المريض',
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
