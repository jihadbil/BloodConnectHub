# Reports API Frontend Handoff

Last updated: 2026-03-25

This document is based on the current backend implementation in `ReportsController` and `ReportService`.

## 1. Base Info

- Base route: `/api/reports`
- HTTP method: all report endpoints are `GET`
- Content type: `application/json`
- Route casing: ASP.NET routes are case-insensitive, but frontend should use lowercase paths

## 2. Common Response Envelope

Every endpoint returns this wrapper:

```ts
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: string[] | null;
}
```

Successful response example:

```json
{
  "success": true,
  "message": "تمت العملية بنجاح",
  "data": {},
  "errors": null
}
```

Error response example:

```json
{
  "success": false,
  "message": "تاريخ البداية يجب أن يكون قبل تاريخ النهاية",
  "data": null,
  "errors": null
}
```

## 3. Shared Query Models

### DateFilter

Used by time-based endpoints:

```ts
interface DateFilter {
  startDate?: string; // ISO date/time
  endDate?: string;   // ISO date/time
}
```

Rules:

- Range is inclusive
- If `startDate > endDate`, backend returns `400`
- If only `startDate` is sent, backend filters from `startDate` to now
- If only `endDate` is sent, backend filters from the beginning of the system to `endDate`
- For `GET /api/reports/donations/by-period` only:
  if no filter is sent, backend defaults to the current month
- For most other date-based endpoints:
  if no filter is sent, backend defaults to all data until now

### Pagination

Used by `GET /api/reports/donors/by-city`:

```ts
interface PaginationParams {
  pageNumber?: number; // default 1
  pageSize?: number;   // default 10, max 100
}
```

Paginated response shape:

```ts
interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
```

## 4. TypeScript Data Models

```ts
interface BloodTypeStatistic {
  bloodType: string;
  count: number;
}

interface DonorStatisticsDto {
  statistics: BloodTypeStatistic[];
}

interface ActiveVsInactiveDonorsDto {
  activeCount: number;
  inactiveCount: number;
  totalCount: number;
  activePercentage: number;
  inactivePercentage: number;
}

interface DonorsByCityDto {
  city: string;
  donorCount: number;
}

interface EligibleDonorsByBloodTypeDto {
  bloodType: string;
  eligibleCount: number;
}

interface DonationsByPeriodDto {
  period: string;
  donationCount: number;
  periodStart: string;
  periodEnd: string;
}

interface BloodQuantityDto {
  bloodType: string;
  totalQuantityML: number;
}

interface DonationTestResultsDto {
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
  totalCount: number;
  acceptanceRate: number;
  rejectionRate: number;
}

interface DonationsByBloodTypeDto {
  bloodType: string;
  donationCount: number;
  percentage: number;
}

interface MostActiveDonorDto {
  donorID: number;
  donorName: string;
  bloodType: string;
  donationCount: number;
}

interface InventoryAvailabilityDto {
  bloodType: string;
  quantityAvailable: number;
  quantityReserved: number;
  totalAvailable: number;
}

interface ExpiringBloodUnitsDto {
  bloodType: string;
  unitCount: number;
  daysUntilExpiry: number;
  expiryDate: string;
}

interface ExpiredBloodUnitsDto {
  bloodType: string;
  expiredUnitCount: number;
  totalQuantityWasted: number;
}

interface ConsumptionRateDto {
  bloodType: string;
  totalConsumed: number;
  averageDailyConsumption: number;
  currentInventory: number;
  projectedDaysUntilStockout: number;
}

interface LowInventoryAlertDto {
  bloodType: string;
  currentQuantity: number;
  threshold: number;
  severity: "Critical" | "Warning" | string;
}

interface RequestsByStatusDto {
  pendingCount: number;
  fulfilledCount: number;
  cancelledCount: number;
  totalCount: number;
  fulfillmentRate: number;
  cancellationRate: number;
}

interface RequestsByUrgencyDto {
  urgencyLevel: string;
  requestCount: number;
}

interface FulfillmentRateDto {
  bloodType: string;
  totalRequests: number;
  fulfilledRequests: number;
  fulfillmentRate: number;
}

interface RequestsByBloodTypeDto {
  bloodType: string;
  requestCount: number;
  percentage: number;
}

interface AvgFulfillmentTimeDto {
  urgencyLevel: string;
  averageHours: number;
  requestCount: number;
}

interface MonthlyTrend {
  month: string;
  count: number;
}

interface PatientCountDto {
  totalCount: number;
  trends?: MonthlyTrend[] | null;
}

interface PatientsByBloodTypeDto {
  bloodType: string;
  patientCount: number;
  percentage: number;
}

interface PatientsWithActiveRequestsDto {
  patientID: number;
  patientName: string;
  bloodType: string;
  activeRequestCount: number;
  highestUrgencyLevel: string;
}

interface InventoryStatus {
  bloodType: string;
  quantityAvailable: number;
}

interface DashboardSummaryDto {
  activeDonorsCount: number;
  inactiveDonorsCount: number;
  donationsThisMonth: number;
  donationsThisYear: number;
  pendingRequestsCount: number;
  fulfilledRequestsThisMonth: number;
  emergencyRequestsCount: number;
  inventoryByBloodType: InventoryStatus[];
  expiringUnitsCount: number;
}
```

## 5. Endpoint Catalog

### Donor Reports

| Endpoint | Query | Response `data` type | Notes |
|---|---|---|---|
| `GET /api/reports/donors/statistics` | none | `DonorStatisticsDto` | Returns all 8 blood types, even when count is `0` |
| `GET /api/reports/donors/active-vs-inactive` | none | `ActiveVsInactiveDonorsDto` | Percentages are already calculated |
| `GET /api/reports/donors/by-city` | `pageNumber`, `pageSize` | `PagedResult<DonorsByCityDto>` | Sorted by `donorCount` descending |
| `GET /api/reports/donors/eligible` | none | `EligibleDonorsByBloodTypeDto[]` | Returns all 8 blood types |

### Donation Reports

| Endpoint | Query | Response `data` type | Notes |
|---|---|---|---|
| `GET /api/reports/donations/by-period` | `startDate`, `endDate`, `groupBy=day|week|month|year` | `DonationsByPeriodDto[]` | If no dates are sent, backend defaults to current month |
| `GET /api/reports/donations/quantity` | `startDate`, `endDate` | `BloodQuantityDto[]` | Returns all 8 blood types plus one extra row where `bloodType = "Total"` |
| `GET /api/reports/donations/test-results` | `startDate`, `endDate` | `DonationTestResultsDto` | Already includes acceptance/rejection rates |
| `GET /api/reports/donations/by-blood-type` | `startDate`, `endDate` | `DonationsByBloodTypeDto[]` | Returns all 8 blood types and percentages |
| `GET /api/reports/donations/most-active-donors` | `startDate`, `endDate`, `limit` | `MostActiveDonorDto[]` | `limit <= 0` is treated as `10` |

### Inventory Reports

| Endpoint | Query | Response `data` type | Notes |
|---|---|---|---|
| `GET /api/reports/inventory/availability` | none | `InventoryAvailabilityDto[]` | Returns all 8 blood types |
| `GET /api/reports/inventory/expiring` | none | `ExpiringBloodUnitsDto[]` | Grouped by blood type and exact expiry date |
| `GET /api/reports/inventory/expired` | `startDate`, `endDate` | `ExpiredBloodUnitsDto[]` | If there is data, backend appends an extra summary row where `bloodType = "Total"` |
| `GET /api/reports/inventory/consumption-rate` | `startDate`, `endDate` | `ConsumptionRateDto[]` | Returns all 8 blood types |
| `GET /api/reports/inventory/low-stock-alerts` | `threshold` | `LowInventoryAlertDto[]` | `threshold <= 0` is treated as `10` |

### Blood Request Reports

| Endpoint | Query | Response `data` type | Notes |
|---|---|---|---|
| `GET /api/reports/requests/by-status` | `startDate`, `endDate` | `RequestsByStatusDto` | `PartiallyFulfilled` is counted inside `fulfilledCount` |
| `GET /api/reports/requests/by-urgency` | `startDate`, `endDate` | `RequestsByUrgencyDto[]` | Only pending requests are included; rows are returned for all urgency levels |
| `GET /api/reports/requests/fulfillment-rate` | `startDate`, `endDate` | `FulfillmentRateDto[]` | Returns all 8 blood types |
| `GET /api/reports/requests/by-blood-type` | `startDate`, `endDate` | `RequestsByBloodTypeDto[]` | Returns all 8 blood types |
| `GET /api/reports/requests/avg-fulfillment-time` | `startDate`, `endDate` | `AvgFulfillmentTimeDto[]` | Cancelled requests are excluded; partially fulfilled requests are included |

### Patient Reports

| Endpoint | Query | Response `data` type | Notes |
|---|---|---|---|
| `GET /api/reports/patients/count` | `startDate`, `endDate` | `PatientCountDto` | `trends` is returned only when the selected range spans multiple months |
| `GET /api/reports/patients/by-blood-type` | none | `PatientsByBloodTypeDto[]` | Returns all 8 blood types |
| `GET /api/reports/patients/with-active-requests` | none | `PatientsWithActiveRequestsDto[]` | Only patients with pending requests are returned |

### Dashboard

| Endpoint | Query | Response `data` type | Notes |
|---|---|---|---|
| `GET /api/reports/dashboard/summary` | none | `DashboardSummaryDto` | Includes dashboard cards plus inventory list by blood type |

## 6. Frontend Notes Per Endpoint

### Good defaults for charts

- Blood type charts:
  `donors/statistics`, `donors/eligible`, `donations/by-blood-type`, `requests/by-blood-type`, `patients/by-blood-type`, `dashboard/summary.inventoryByBloodType`
- Distribution cards:
  `donors/active-vs-inactive`, `donations/test-results`, `requests/by-status`
- Ranking table:
  `donations/most-active-donors`
- Time series chart:
  `donations/by-period`
- Paginated table:
  `donors/by-city`

### Important implementation details

- `BloodQuantityDto[]` and `ExpiredBloodUnitsDto[]` may contain an extra summary row with `"Total"`
- Some report lists intentionally include zero-value rows for missing blood types; frontend should not filter them unless desired by UX
- Percentage fields are raw numeric values, not formatted strings
- Dates come back as ISO datetime strings in JSON
- `requests/by-urgency` returns values ordered by urgency priority:
  `Emergency`, `Urgent`, `Normal`
- `patients/count` may return `trends = null`

## 7. Suggested Frontend Request Helpers

```ts
type QueryValue = string | number | boolean | undefined | null;

export function buildQuery(params: Record<string, QueryValue>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  return search.toString();
}

export async function getReport<T>(path: string, params?: Record<string, QueryValue>) {
  const query = params ? buildQuery(params) : "";
  const url = query ? `${path}?${query}` : path;

  const res = await fetch(url);
  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to load report");
  }

  return json.data;
}
```

Example:

```ts
const data = await getReport<DonationsByPeriodDto[]>(
  "/api/reports/donations/by-period",
  { groupBy: "month", startDate: "2026-01-01", endDate: "2026-03-25" }
);
```

## 8. Recommended Frontend Delivery Order

1. Build shared `ApiResponse<T>` and `PagedResult<T>` types
2. Build a reusable query builder for date filters, pagination, `groupBy`, `limit`, and `threshold`
3. Start with dashboard and donor charts because their response shapes are simple
4. Then build paginated city table and top donors table
5. Finally build the more specialized inventory and fulfillment analytics screens
