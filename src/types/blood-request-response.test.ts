// Test file to verify fast-check setup and type definitions
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import type {
  DonationResponse,
  FulfillRequestPayload,
  DonorEligibility,
  BloodCompatibilityCheck,
  RespondResult,
} from './blood-request-response';

describe('Blood Request Response Types', () => {
  it('should verify fast-check is working', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n === n;
      })
    );
  });

  it('should create valid DonationResponse objects', () => {
    const donationResponse: DonationResponse = {
      donorID: 1,
      bloodTypeID: 5,
      donationDate: new Date().toISOString(),
      quantity: 450,
      testResult: 0,
      notes: 'Response to request #123',
    };

    expect(donationResponse.donorID).toBe(1);
    expect(donationResponse.testResult).toBe(0);
  });

  it('should create valid FulfillRequestPayload objects', () => {
    const payload: FulfillRequestPayload = {
      donationId: 1,
      quantity: 450,
    };

    expect(payload.donationId).toBe(1);
    expect(payload.quantity).toBe(450);
  });

  it('should create valid DonorEligibility objects', () => {
    const eligibility: DonorEligibility = {
      isEligible: true,
      lastDonationDate: new Date('2024-01-01'),
      nextEligibleDate: new Date('2024-04-01'),
      daysUntilEligible: 0,
    };

    expect(eligibility.isEligible).toBe(true);
    expect(eligibility.lastDonationDate).toBeInstanceOf(Date);
  });

  it('should create valid BloodCompatibilityCheck objects', () => {
    const check: BloodCompatibilityCheck = {
      isCompatible: true,
      donorBloodType: 'O+',
      requestBloodType: 'A+',
    };

    expect(check.isCompatible).toBe(true);
    expect(check.donorBloodType).toBe('O+');
  });

  it('should create valid RespondResult objects', () => {
    const result: RespondResult = {
      success: true,
      donationId: 123,
    };

    expect(result.success).toBe(true);
    expect(result.donationId).toBe(123);
  });
});
