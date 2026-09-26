// React Query hooks for Inventory API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventory';
import type { BloodUnitStatus, UpdateQuantityDto } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const inventoryKeys = {
  all: ['inventory'] as const,
  list: () => [...inventoryKeys.all, 'list'] as const,
  summary: () => [...inventoryKeys.all, 'summary'] as const,
  lowStock: () => [...inventoryKeys.all, 'low-stock'] as const,
  expiring: (days?: number) => [...inventoryKeys.all, 'expiring', days] as const,
};

/**
 * جلب المخزون الكامل
 */
export function useInventory() {
  return useQuery({
    queryKey: inventoryKeys.list(),
    queryFn: () => inventoryApi.getAll(),
  });
}

/**
 * جلب ملخص المخزون
 */
export function useInventorySummary() {
  return useQuery({
    queryKey: inventoryKeys.summary(),
    queryFn: () => inventoryApi.getSummary(),
  });
}

/**
 * جلب المخزون المنخفض
 */
export function useLowStockInventory() {
  return useQuery({
    queryKey: inventoryKeys.lowStock(),
    queryFn: () => inventoryApi.getLowStock(),
  });
}

/**
 * جلب الوحدات القريبة من الانتهاء
 */
export function useExpiringInventory(daysThreshold = 14) {
  return useQuery({
    queryKey: inventoryKeys.expiring(daysThreshold),
    queryFn: () => inventoryApi.getExpiring(daysThreshold),
  });
}

/**
 * تحديث كمية فصيلة دم
 */
export function useUpdateInventoryQuantity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ bloodTypeId, data }: { bloodTypeId: number; data: UpdateQuantityDto }) =>
      inventoryApi.updateQuantity(bloodTypeId, data),
    onSuccess: (response) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم تحديث المخزون',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في تحديث المخزون',
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
 * إزالة الوحدات المنتهية الصلاحية
 */
export function useRemoveExpiredInventory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => inventoryApi.removeExpired(),
    onSuccess: (response) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم إزالة الوحدات المنتهية بنجاح',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في إزالة الوحدات',
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
 * تحديث حالة وحدة دم
 */
export function useUpdateItemStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: BloodUnitStatus }) =>
      inventoryApi.updateItemStatus(id, status),
    onSuccess: (response) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم تحديث حالة الوحدة',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في تحديث حالة الوحدة',
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
