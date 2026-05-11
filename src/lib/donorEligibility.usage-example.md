# Donor Eligibility Checker - Usage Examples

## Overview

The `checkDonationEligibility` function determines if a donor is eligible to donate blood based on their last donation date. Donors must wait at least 90 days (3 months) between donations.

## Import

```typescript
import { checkDonationEligibility } from '@/lib/donorEligibility';
```

## Usage Examples

### Example 1: New Donor (Never Donated Before)

```typescript
const eligibility = checkDonationEligibility(null);

console.log(eligibility);
// Output:
// {
//   isEligible: true,
//   lastDonationDate: null,
//   nextEligibleDate: null,
//   daysUntilEligible: 0
// }
```

### Example 2: Eligible Donor (Donated 100 Days Ago)

```typescript
const lastDonation = new Date('2024-10-01');
const eligibility = checkDonationEligibility(lastDonation);

console.log(eligibility);
// Output:
// {
//   isEligible: true,
//   lastDonationDate: Date('2024-10-01'),
//   nextEligibleDate: Date('2024-12-30'), // 90 days after last donation
//   daysUntilEligible: 0
// }
```

### Example 3: Ineligible Donor (Donated 30 Days Ago)

```typescript
const lastDonation = new Date('2024-12-20');
const eligibility = checkDonationEligibility(lastDonation);

console.log(eligibility);
// Output:
// {
//   isEligible: false,
//   lastDonationDate: Date('2024-12-20'),
//   nextEligibleDate: Date('2025-03-20'), // 90 days after last donation
//   daysUntilEligible: 60 // Days remaining until eligible
// }
```

## Integration with Blood Request Response Hook

This function will be used in the `useBloodRequestResponse` hook to validate donor eligibility:

```typescript
// In useBloodRequestResponse.ts
import { checkDonationEligibility } from '@/lib/donorEligibility';

const respondToRequest = async (requestId: number) => {
  // ... fetch donor information
  const donor = await getDonorByUserId(userId);
  
  // Check eligibility
  const eligibility = checkDonationEligibility(donor.lastDonationDate);
  
  if (!eligibility.isEligible) {
    return {
      success: false,
      error: `عذراً، آخر تبرع لك كان في ${formatDate(eligibility.lastDonationDate)}. يمكنك التبرع مرة أخرى في ${formatDate(eligibility.nextEligibleDate)}`,
      errorType: 'eligibility'
    };
  }
  
  // ... proceed with donation
};
```

## Error Message Display

When a donor is not eligible, display a clear message with the dates:

```typescript
if (!eligibility.isEligible) {
  const lastDate = formatDate(eligibility.lastDonationDate);
  const nextDate = formatDate(eligibility.nextEligibleDate);
  const daysLeft = eligibility.daysUntilEligible;
  
  const message = `عذراً، آخر تبرع لك كان في ${lastDate}. يمكنك التبرع مرة أخرى في ${nextDate} (بعد ${daysLeft} يوم)`;
  
  // Display message to user
}
```

## Requirements Validation

This function validates the following requirements:

- **Requirement 5.1**: Checks donation eligibility based on last donation date
- **Requirement 5.2**: Calculates time period between last donation and current date
- **Requirement 5.3**: Enforces 90-day (3 months) waiting period
- **Requirement 5.5**: Treats new donors (null lastDonationDate) as eligible

## Testing

The function is thoroughly tested with:
- New donors (null lastDonationDate)
- Eligible donors (90+ days since last donation)
- Ineligible donors (less than 90 days)
- Edge cases (donation today, very old dates)
- Date calculations across month/year boundaries

See `src/lib/donorEligibility.test.ts` for complete test coverage.
