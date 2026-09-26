// Inventory API endpoints
import { apiClient } from './client';
import type {
  ServiceResponse,
  BloodInventory,
  InventorySummary,
  UpdateQuantityDto,
  BloodUnitStatus,
  BloodInventoryItem,
} from '@/types/api';

export const inventoryApi = {
  /**
   * جلب المخزون الكامل
   */
  getAll: async (): Promise<ServiceResponse<BloodInventory[]>> => {
    return apiClient.get<BloodInventory[]>('/Inventory');
  },

  /**
   * جلب ملخص المخزون
   */
  getSummary: async (): Promise<ServiceResponse<InventorySummary>> => {
    return apiClient.get<InventorySummary>('/Inventory/summary');
  },

  /**
   * جلب المخزون المنخفض
   */
  getLowStock: async (threshold?: number): Promise<ServiceResponse<BloodInventory[]>> => {
    const query = threshold !== undefined ? `?threshold=${threshold}` : '';
    return apiClient.get<BloodInventory[]>(`/Inventory/low-stock${query}`);
  },

  /**
   * تحديث كمية فصيلة دم معينة
   */
  updateQuantity: async (
    bloodTypeId: number,
    data: UpdateQuantityDto
  ): Promise<ServiceResponse<BloodInventory>> => {
    return apiClient.put<BloodInventory>(`/Inventory/blood-type/${bloodTypeId}`, data);
  },

  /**
   * جلب مخزون فصيلة محددة
   */
  getByBloodType: async (bloodTypeId: number): Promise<ServiceResponse<BloodInventory>> => {
    return apiClient.get<BloodInventory>(`/Inventory/blood-type/${bloodTypeId}`);
  },

  /**
   * جلب الوحدات القريبة من الانتهاء
   */
  getExpiring: async (daysThreshold?: number): Promise<ServiceResponse<BloodInventoryItem[]>> => {
    const query = daysThreshold !== undefined ? `?daysThreshold=${daysThreshold}` : '';
    const response = await apiClient.get<any[]>(`/Inventory/expiring${query}`);
    
    if (response.isSuccess && response.data) {
      const mappedData = response.data.map((item: any): BloodInventoryItem => {
        return {
          itemId: item.itemId ?? item.inventoryItemId ?? item.inventoryItemID ?? item.id,
          bloodTypeId: item.bloodTypeId ?? item.bloodTypeID ?? item.inventoryID ?? item.inventoryId ?? 0,
          bloodTypeName: item.bloodTypeName ?? '',
          donationId: item.donationId ?? item.donationID ?? 0,
          status: item.status,
          expiryDate: item.expiryDate,
          isExpired: item.isExpired ?? false,
          createdAt: item.createdAt ?? item.addedAt ?? '',
        };
      });
      return {
        ...response,
        data: mappedData,
      };
    }
    return response as unknown as ServiceResponse<BloodInventoryItem[]>;
  },

  /**
   * إزالة الوحدات المنتهية الصلاحية
   */
  removeExpired: async (): Promise<ServiceResponse<boolean>> => {
    return apiClient.post<boolean>('/Inventory/remove-expired');
  },

  /**
   * تحديث حالة وحدة دم
   */
  updateItemStatus: async (id: number, status: BloodUnitStatus): Promise<ServiceResponse<boolean>> => {
    // API might expect the primitive value directly in the body
    return apiClient.patch<boolean>(`/Inventory/items/${id}/status`, status);
  },
};
