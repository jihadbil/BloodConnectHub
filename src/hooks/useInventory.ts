// React Query hooks for Inventory API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventory';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const inventoryKeys = {
  all: ['inventory'] as const,
  list: () => [...inventoryKeys.all, 'list'] as const,
  summary: () => [...inventoryKeys.all, 'summary'] as const,
  lowStock: () => [...inventoryKeys.all, 'low-stock'] as const,
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
 * تحديث كمية فصيلة دم
 */
export function useUpdateInventoryQuantity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ bloodTypeId, quantity }: { bloodTypeId: number; quantity: number }) =>
      inventoryApi.updateQuantity(bloodTypeId, quantity),
    onSuccess: (response) => {
      if (response.success) {
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
