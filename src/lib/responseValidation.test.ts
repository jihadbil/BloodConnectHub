/**
 * Response Validation Tests
 * Unit tests for response validation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  validateCreateRequest,
  validateUpdateRequest,
  validateCancelRequest
} from './responseValidation';
import { ResponseStatus } from '@/types/donor-response';

describe('validateCreateRequest', () => {
  it('should pass validation for valid data', () => {
    const result = validateCreateRequest({
      donorId: 1,
      requestId: 2,
      notes: 'Test notes'
    });
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should pass validation without notes', () => {
    const result = validateCreateRequest({
      donorId: 1,
      requestId: 2
    });
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject invalid donorId (zero)', () => {
    const result = validateCreateRequest({
      donorId: 0,
      requestId: 2
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('معرف المتبرع غير صحيح');
  });

  it('should reject invalid donorId (negative)', () => {
    const result = validateCreateRequest({
      donorId: -1,
      requestId: 2
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('معرف المتبرع غير صحيح');
  });

  it('should reject invalid requestId (zero)', () => {
    const result = validateCreateRequest({
      donorId: 1,
      requestId: 0
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('معرف الطلب غير صحيح');
  });

  it('should reject invalid requestId (negative)', () => {
    const result = validateCreateRequest({
      donorId: 1,
      requestId: -5
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('معرف الطلب غير صحيح');
  });

  it('should reject notes exceeding 500 characters', () => {
    const longNotes = 'a'.repeat(501);
    const result = validateCreateRequest({
      donorId: 1,
      requestId: 2,
      notes: longNotes
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('الملاحظات يجب ألا تتجاوز 500 حرف');
  });

  it('should accept notes with exactly 500 characters', () => {
    const maxNotes = 'a'.repeat(500);
    const result = validateCreateRequest({
      donorId: 1,
      requestId: 2,
      notes: maxNotes
    });
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should collect multiple errors', () => {
    const result = validateCreateRequest({
      donorId: -1,
      requestId: 0,
      notes: 'a'.repeat(501)
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(3);
    expect(result.errors).toContain('معرف المتبرع غير صحيح');
    expect(result.errors).toContain('معرف الطلب غير صحيح');
    expect(result.errors).toContain('الملاحظات يجب ألا تتجاوز 500 حرف');
  });
});

describe('validateUpdateRequest', () => {
  it('should pass validation for valid status update', () => {
    const result = validateUpdateRequest({
      status: ResponseStatus.Confirmed,
      notes: 'Confirmed for Sunday'
    });
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should pass validation without notes', () => {
    const result = validateUpdateRequest({
      status: ResponseStatus.Confirmed
    });
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject invalid status (zero)', () => {
    const result = validateUpdateRequest({
      status: 0 as ResponseStatus
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('حالة الاستجابة غير صحيحة');
  });

  it('should reject invalid status (greater than 6)', () => {
    const result = validateUpdateRequest({
      status: 7 as ResponseStatus
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('حالة الاستجابة غير صحيحة');
  });

  it('should reject invalid status (negative)', () => {
    const result = validateUpdateRequest({
      status: -1 as ResponseStatus
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('حالة الاستجابة غير صحيحة');
  });

  it('should reject notes exceeding 500 characters', () => {
    const longNotes = 'a'.repeat(501);
    const result = validateUpdateRequest({
      status: ResponseStatus.Confirmed,
      notes: longNotes
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('الملاحظات يجب ألا تتجاوز 500 حرف');
  });

  it('should accept notes with exactly 500 characters', () => {
    const maxNotes = 'a'.repeat(500);
    const result = validateUpdateRequest({
      status: ResponseStatus.Confirmed,
      notes: maxNotes
    });
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should require donationId when status is Donated', () => {
    const result = validateUpdateRequest({
      status: ResponseStatus.Donated
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('يجب تحديد معرف التبرع عند تسجيل حالة "تم التبرع"');
  });

  it('should reject invalid donationId (zero) when status is Donated', () => {
    const result = validateUpdateRequest({
      status: ResponseStatus.Donated,
      donationId: 0
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('يجب تحديد معرف التبرع عند تسجيل حالة "تم التبرع"');
  });

  it('should reject invalid donationId (negative) when status is Donated', () => {
    const result = validateUpdateRequest({
      status: ResponseStatus.Donated,
      donationId: -1
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('يجب تحديد معرف التبرع عند تسجيل حالة "تم التبرع"');
  });

  it('should pass validation with valid donationId when status is Donated', () => {
    const result = validateUpdateRequest({
      status: ResponseStatus.Donated,
      donationId: 123
    });
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should not require donationId for non-Donated statuses', () => {
    const result = validateUpdateRequest({
      status: ResponseStatus.Confirmed
    });
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should collect multiple errors', () => {
    const result = validateUpdateRequest({
      status: 0 as ResponseStatus,
      notes: 'a'.repeat(501)
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
    expect(result.errors).toContain('حالة الاستجابة غير صحيحة');
    expect(result.errors).toContain('الملاحظات يجب ألا تتجاوز 500 حرف');
  });
});

describe('validateCancelRequest', () => {
  it('should pass validation for valid reason', () => {
    const result = validateCancelRequest('المتبرع غير متاح');
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject empty reason', () => {
    const result = validateCancelRequest('');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('يجب ذكر سبب الإلغاء');
  });

  it('should reject whitespace-only reason', () => {
    const result = validateCancelRequest('   ');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('يجب ذكر سبب الإلغاء');
  });

  it('should reject reason exceeding 500 characters', () => {
    const longReason = 'a'.repeat(501);
    const result = validateCancelRequest(longReason);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('سبب الإلغاء يجب ألا يتجاوز 500 حرف');
  });

  it('should accept reason with exactly 500 characters', () => {
    const maxReason = 'a'.repeat(500);
    const result = validateCancelRequest(maxReason);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should accept reason with leading/trailing spaces if not empty', () => {
    const result = validateCancelRequest('  valid reason  ');
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
