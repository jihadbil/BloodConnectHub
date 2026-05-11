// Inventory API endpoints
import { apiClient } from './client';
import type {
  ServiceResponse,
  BloodInventory,
  InventorySummary,
} from '@/types/api';

export const inventoryApi = {
  /**
   * جلب المخزون الكامل
   */
  getAll: async (): Promise<ServiceResponse<BloodInventory[]>> => {
    return apiClient.get<BloodInventory[]>('/inventory');
  },

  /**
   * جلب ملخص المخزون
   */
  getSummary: async (): Promise<ServiceResponse<InventorySummary>> => {
    return apiClient.get<InventorySummary>('/inventory/summary');
  },

  /**
   * جلب المخزون المنخفض
   */
  getLowStock: async (): Promise<ServiceResponse<BloodInventory[]>> => {
    return apiClient.get<BloodInventory[]>('/inventory/low-stock');
  },

  /**
   * تحديث كمية فصيلة دم معينة
   */
  updateQuantity: async (
    bloodTypeId: number,
    quantity: number
  ): Promise<ServiceResponse<BloodInventory>> => {
    console.log('Updating inventory:', { bloodTypeId, quantity });
    return apiClient.put<BloodInventory>(`/Inventory/blood-type/${bloodTypeId}`, {
      quantityChange: quantity,
    });
  },
};
