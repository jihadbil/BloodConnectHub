# Blood Request Response Components

This directory contains React components for the blood request response feature.

## Components

### ResponseDialog (To be implemented in Task 6)
A dialog component that displays blood request details and allows donors to respond to requests.

**Props:**
- `open: boolean` - Controls dialog visibility
- `onOpenChange: (open: boolean) => void` - Callback when dialog state changes
- `request: BloodRequest | null` - The blood request to display
- `onSuccess: () => void` - Callback when response is successful

**Features:**
- Displays complete request details (blood type, quantity, urgency, department, hospital)
- Validates donor eligibility and blood compatibility
- Shows loading states during processing
- Displays success/error messages
- Auto-closes on successful response

## Related Files

- **Types:** `src/types/blood-request-response.ts`
- **Hook:** `src/hooks/useBloodRequestResponse.ts` (To be implemented in Task 4)
- **Utilities:** `src/lib/bloodCompatibility.ts` (Existing)

## Testing

Property-based tests are located alongside the implementation files using the `.test.ts` or `.test.tsx` suffix.

All property tests use fast-check with a minimum of 100 runs per test.
