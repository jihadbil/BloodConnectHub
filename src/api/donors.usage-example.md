# getDonorByUserId Usage Example

## Purpose
This endpoint fetches donor information (including blood type and last donation date) based on the userId from AuthContext. This is essential for the blood-request-response feature to verify donor eligibility and blood type compatibility.

## Usage in Blood Request Response Feature

```typescript
import { donorsApi } from '@/api';
import { useAuth } from '@/hooks/useAuth';

// In your component or hook
const { user } = useAuth();

// Fetch donor information by user ID
const response = await donorsApi.getDonorByUserId(user.userId);

if (response.success && response.data) {
  const donor = response.data;
  
  // Access donor information
  console.log('Donor ID:', donor.donorId);
  console.log('Blood Type ID:', donor.bloodTypeId);
  console.log('Last Donation Date:', donor.lastDonationDate);
  
  // Check eligibility (90 days since last donation)
  if (donor.lastDonationDate) {
    const lastDonation = new Date(donor.lastDonationDate);
    const today = new Date();
    const daysSinceLastDonation = Math.floor(
      (today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const isEligible = daysSinceLastDonation >= 90;
    console.log('Is Eligible:', isEligible);
  } else {
    // No previous donations - eligible
    console.log('Is Eligible: true (no previous donations)');
  }
  
  // Check blood compatibility
  import { canDonateToPatient } from '@/lib/bloodCompatibility';
  const isCompatible = canDonateToPatient(donor.bloodTypeId, requestBloodTypeId);
  console.log('Is Compatible:', isCompatible);
}
```

## Error Handling

```typescript
const response = await donorsApi.getDonorByUserId(userId);

if (!response.success) {
  // Handle different error scenarios
  if (response.errors?.includes('Network error')) {
    console.error('فشل الاتصال بالخادم. يرجى المحاولة مرة أخرى');
  } else if (response.message?.includes('غير موجود')) {
    console.error('المتبرع غير موجود');
  } else {
    console.error('حدث خطأ غير متوقع:', response.message);
  }
}
```

## API Endpoint
- **Method**: GET
- **Path**: `/api/donors/user/{userId}`
- **Response**: `ServiceResponse<Donor>`

## Related Requirements
- **Requirement 5.6**: The system SHALL fetch donor information from API_Backend to get last donation date
- **Design Section 4**: Donor Service - getDonorByUserId endpoint
