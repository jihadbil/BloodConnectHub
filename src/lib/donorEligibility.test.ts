import { describe, it, expect } from 'vitest';
import { checkDonationEligibility } from './donorEligibility';

describe('checkDonationEligibility', () => {
  describe('New donors (null lastDonationDate)', () => {
    it('should return eligible for new donors with null lastDonationDate', () => {
      const result = checkDonationEligibility(null);

      expect(result.isEligible).toBe(true);
      expect(result.lastDonationDate).toBe(null);
      expect(result.nextEligibleDate).toBe(null);
      expect(result.daysUntilEligible).toBe(0);
    });
  });

  describe('Eligible donors (90+ days since last donation)', () => {
    it('should return eligible for donor who donated exactly 90 days ago', () => {
      const today = new Date();
      const lastDonation = new Date(today);
      lastDonation.setDate(lastDonation.getDate() - 90);

      const result = checkDonationEligibility(lastDonation);

      expect(result.isEligible).toBe(true);
      expect(result.lastDonationDate).toEqual(lastDonation);
      expect(result.daysUntilEligible).toBe(0);
      expect(result.nextEligibleDate).toBeDefined();
    });

    it('should return eligible for donor who donated 100 days ago', () => {
      const today = new Date();
      const lastDonation = new Date(today);
      lastDonation.setDate(lastDonation.getDate() - 100);

      const result = checkDonationEligibility(lastDonation);

      expect(result.isEligible).toBe(true);
      expect(result.lastDonationDate).toEqual(lastDonation);
      expect(result.daysUntilEligible).toBe(0);
    });

    it('should return eligible for donor who donated 365 days ago', () => {
      const today = new Date();
      const lastDonation = new Date(today);
      lastDonation.setDate(lastDonation.getDate() - 365);

      const result = checkDonationEligibility(lastDonation);

      expect(result.isEligible).toBe(true);
      expect(result.daysUntilEligible).toBe(0);
    });
  });

  describe('Ineligible donors (less than 90 days since last donation)', () => {
    it('should return ineligible for donor who donated 1 day ago', () => {
      const today = new Date();
      const lastDonation = new Date(today);
      lastDonation.setDate(lastDonation.getDate() - 1);

      const result = checkDonationEligibility(lastDonation);

      expect(result.isEligible).toBe(false);
      expect(result.lastDonationDate).toEqual(lastDonation);
      expect(result.daysUntilEligible).toBe(89);
      expect(result.nextEligibleDate).toBeDefined();
    });

    it('should return ineligible for donor who donated 30 days ago', () => {
      const today = new Date();
      const lastDonation = new Date(today);
      lastDonation.setDate(lastDonation.getDate() - 30);

      const result = checkDonationEligibility(lastDonation);

      expect(result.isEligible).toBe(false);
      expect(result.daysUntilEligible).toBe(60);
    });

    it('should return ineligible for donor who donated 89 days ago', () => {
      const today = new Date();
      const lastDonation = new Date(today);
      lastDonation.setDate(lastDonation.getDate() - 89);

      const result = checkDonationEligibility(lastDonation);

      expect(result.isEligible).toBe(false);
      expect(result.daysUntilEligible).toBe(1);
    });
  });

  describe('Next eligible date calculation', () => {
    it('should calculate correct next eligible date', () => {
      const lastDonation = new Date('2024-01-01');
      const result = checkDonationEligibility(lastDonation);

      const expectedNextDate = new Date('2024-01-01');
      expectedNextDate.setDate(expectedNextDate.getDate() + 90);

      expect(result.nextEligibleDate).toEqual(expectedNextDate);
    });

    it('should handle date calculations across month boundaries', () => {
      const lastDonation = new Date('2024-01-31');
      const result = checkDonationEligibility(lastDonation);

      const expectedNextDate = new Date('2024-01-31');
      expectedNextDate.setDate(expectedNextDate.getDate() + 90);

      expect(result.nextEligibleDate).toEqual(expectedNextDate);
    });

    it('should handle date calculations across year boundaries', () => {
      const lastDonation = new Date('2023-12-01');
      const result = checkDonationEligibility(lastDonation);

      const expectedNextDate = new Date('2023-12-01');
      expectedNextDate.setDate(expectedNextDate.getDate() + 90);

      expect(result.nextEligibleDate).toEqual(expectedNextDate);
    });
  });

  describe('Edge cases', () => {
    it('should handle donation today (0 days ago)', () => {
      const today = new Date();
      const result = checkDonationEligibility(today);

      expect(result.isEligible).toBe(false);
      expect(result.daysUntilEligible).toBe(90);
    });

    it('should handle very old donation dates', () => {
      const veryOldDate = new Date('2020-01-01');
      const result = checkDonationEligibility(veryOldDate);

      expect(result.isEligible).toBe(true);
      expect(result.daysUntilEligible).toBe(0);
    });
  });
});
