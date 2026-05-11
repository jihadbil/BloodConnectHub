/**
 * Response Validation Utilities
 * Validates donor response data for creation, updates, and cancellation
 * 
 * Validates:
 * - Field lengths (notes, rejectionReason <= 500 characters)
 * - ID validity (positive integers)
 * - Required fields presence
 * - Status enum values
 */

import { ResponseStatus, CreateDonorResponseRequest, UpdateResponseStatusRequest } from '@/types/donor-response';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates create donor response request data
 * 
 * Requirements: 8.1, 8.3, 8.4
 * 
 * @param data - Create request data to validate
 * @returns ValidationResult with isValid flag and error messages
 * 
 * @example
 * const result = validateCreateRequest({ donorId: 1, requestId: 2, notes: 'test' });
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 */
export function validateCreateRequest(data: CreateDonorResponseRequest): ValidationResult {
  const errors: string[] = [];
  
  // Validate donorId (Requirement 8.3)
  if (!data.donorId || data.donorId <= 0) {
    errors.push('معرف المتبرع غير صحيح');
  }
  
  // Validate requestId (Requirement 8.4)
  if (!data.requestId || data.requestId <= 0) {
    errors.push('معرف الطلب غير صحيح');
  }
  
  // Validate notes length (Requirement 8.1)
  if (data.notes && data.notes.length > 500) {
    errors.push('الملاحظات يجب ألا تتجاوز 500 حرف');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates update response status request data
 * 
 * Requirements: 8.1, 8.5
 * 
 * @param data - Update request data to validate
 * @returns ValidationResult with isValid flag and error messages
 * 
 * @example
 * const result = validateUpdateRequest({ status: ResponseStatus.Confirmed, notes: 'test' });
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 */
export function validateUpdateRequest(data: UpdateResponseStatusRequest): ValidationResult {
  const errors: string[] = [];
  
  // Validate status enum (Requirement 8.5)
  if (!data.status || data.status < 1 || data.status > 6) {
    errors.push('حالة الاستجابة غير صحيحة');
  }
  
  // Validate notes length (Requirement 8.1)
  if (data.notes && data.notes.length > 500) {
    errors.push('الملاحظات يجب ألا تتجاوز 500 حرف');
  }
  
  // Validate donationId if status is Donated (Requirement 5.10)
  if (data.status === ResponseStatus.Donated) {
    if (!data.donationId || data.donationId <= 0) {
      errors.push('يجب تحديد معرف التبرع عند تسجيل حالة "تم التبرع"');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates cancel response request data
 * 
 * Requirements: 6.2, 6.3, 8.2
 * 
 * @param reason - Cancellation reason to validate
 * @returns ValidationResult with isValid flag and error messages
 * 
 * @example
 * const result = validateCancelRequest('المتبرع غير متاح');
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 */
export function validateCancelRequest(reason: string): ValidationResult {
  const errors: string[] = [];
  
  // Validate reason is not empty (Requirement 6.2, 6.3)
  if (!reason || reason.trim().length === 0) {
    errors.push('يجب ذكر سبب الإلغاء');
  }
  
  // Validate reason length (Requirement 8.2)
  if (reason && reason.length > 500) {
    errors.push('سبب الإلغاء يجب ألا يتجاوز 500 حرف');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
