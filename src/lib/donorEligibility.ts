import { DonorEligibility } from '@/types/blood-request-response';

/**
 * Minimum days required between donations (90 days = 3 months)
 */
const MINIMUM_DAYS_BETWEEN_DONATIONS = 90;

/**
 * Checks if a donor is eligible to donate blood based on their last donation date.
 * 
 * Rules:
 * - Donors must wait at least 90 days (3 months) between donations
 * - New donors (lastDonationDate = null) are always eligible
 * 
 * @param lastDonationDate - The date of the donor's last donation, or null if they've never donated
 * @returns DonorEligibility object with eligibility status and relevant dates
 * 
 * @example
 * // New donor (never donated before)
 * checkDonationEligibility(null)
 * // Returns: { isEligible: true, lastDonationDate: null, nextEligibleDate: null, daysUntilEligible: 0 }
 * 
 * @example
 * // Donor who donated 100 days ago
 * checkDonationEligibility(new Date('2024-10-01'))
 * // Returns: { isEligible: true, lastDonationDate: Date, nextEligibleDate: Date, daysUntilEligible: 0 }
 * 
 * @example
 * // Donor who donated 30 days ago
 * checkDonationEligibility(new Date('2024-12-20'))
 * // Returns: { isEligible: false, lastDonationDate: Date, nextEligibleDate: Date, daysUntilEligible: 60 }
 */
export function checkDonationEligibility(lastDonationDate: Date | null): DonorEligibility {
  // New donors (never donated before) are always eligible
  if (lastDonationDate === null) {
    return {
      isEligible: true,
      lastDonationDate: null,
      nextEligibleDate: null,
      daysUntilEligible: 0,
    };
  }

  const today = new Date();
  
  // Calculate days since last donation
  const timeDiff = today.getTime() - lastDonationDate.getTime();
  const daysSinceLastDonation = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // Check if donor is eligible (90+ days since last donation)
  const isEligible = daysSinceLastDonation >= MINIMUM_DAYS_BETWEEN_DONATIONS;

  // Calculate next eligible date (last donation + 90 days)
  const nextEligibleDate = new Date(lastDonationDate);
  nextEligibleDate.setDate(nextEligibleDate.getDate() + MINIMUM_DAYS_BETWEEN_DONATIONS);

  // Calculate days until eligible (0 if already eligible)
  const daysUntilEligible = isEligible 
    ? 0 
    : MINIMUM_DAYS_BETWEEN_DONATIONS - daysSinceLastDonation;

  return {
    isEligible,
    lastDonationDate,
    nextEligibleDate,
    daysUntilEligible,
  };
}
