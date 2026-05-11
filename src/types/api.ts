// BloodConnect API Types
// Based on the external API documentation

export type Gender = 'Male' | 'Female';
export type UrgencyLevel = 'Normal' | 'Urgent' | 'Emergency';
export type RequestStatus = 'Pending' | 'Fulfilled' | 'PartiallyFulfilled' | 'Cancelled';
export type TestResult = 'Pending' | 'Approved' | 'Rejected';

// API Response types
export interface ServiceResponse<T> {
  success: boolean;
  message?: string;
  data: T | null;
  errors?: string[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Blood Type
export interface BloodType {
  bloodTypeId: number;
  bloodTypeID?: number; // API returns PascalCase
  typeName: string;
  description: string;
}

// User types
export interface ApiUser {
  userID: number;  // API returns userID (capital I and D)
  userId?: number; // Alias for compatibility
  username: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  roles?: string[];
  donorID?: number | null;
  donorName?: string | null;
}

export interface UserRole {
  roleId: number;
  roleName: string;
  description: string;
}

export interface UserWithRoles extends ApiUser {
  userRoles: UserRole[];
}

// Donor types
export interface Donor {
  donorID: number;  // API returns donorID (capital I and D)
  donorId?: number; // Alias for compatibility
  fullName: string;
  nationalID: string;  // API returns nationalID (capital I and D)
  nationalId?: string; // Alias for compatibility
  gender: Gender;
  dateOfBirth: string;
  phone: string;
  bloodTypeID: number;  // API returns bloodTypeID (capital I and D)
  bloodTypeId?: number; // Alias for compatibility
  bloodType?: BloodType;
  bloodTypeName?: string; // API returns bloodTypeName
  city: string;
  lastDonationDate?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
  userID?: number | null;  // API returns userID
  username?: string | null; // API returns username
}

export interface DonorWithDonations extends Donor {
  donations: DonationSummary[];
}

export interface DonationSummary {
  donationId: number;
  donationDate: string;
  quantity: number;
  testResult: TestResult;
  notes?: string;
}

// Patient types
export interface Patient {
  patientId: number;
  fullName: string;
  nationalId: string;
  gender: Gender;
  dateOfBirth: string;
  phone: string;
  city: string;
  bloodTypeId: number;
  bloodType?: BloodType;
  createdAt: string;
  updatedAt?: string;
}

export interface PatientWithRequests extends Patient {
  requests: BloodRequest[];
}

// Blood Request types
export interface BloodRequest {
  requestId: number;
  patientId: number;
  patient?: Patient;
  bloodTypeId: number;
  bloodTypeID?: number; // API returns PascalCase
  bloodType?: BloodType;
  quantityNeeded: number;
  urgencyLevel: UrgencyLevel;
  requestDate: string;
  requiredDate: string;
  status: RequestStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BloodRequestDetails extends BloodRequest {
  requestID?: number; // API returns PascalCase
  patient: Patient;
  bloodType: BloodType;
  fulfillments: RequestFulfillment[];
}

export interface RequestFulfillment {
  fulfillmentId: number;
  donationId: number;
  quantityUsed: number;
  fulfilledAt: string;
}

// Donation types
export interface Donation {
  donationId: number;
  donorId: number;
  donor?: Donor;
  bloodTypeId: number;
  bloodType?: BloodType;
  donationDate: string;
  quantity: number;
  testResult: TestResult;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// Inventory types
export interface BloodInventory {
  inventoryId: number;
  bloodTypeId: number;
  bloodType?: BloodType;
  quantityAvailable: number;
  quantityReserved: number;
  createdAt: string;
  lastUpdated: string;
}

export interface InventorySummary {
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  lowStockTypes: BloodType[];
  byBloodType: BloodInventory[];
}

// Request payload types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  phone: string;
  roleId: number;
}

export interface RegisterDonorRequest {
  // User fields
  username: string;
  password: string;
  fullName: string;
  phone?: string | null;
  roleId?: number;
  
  // Donor fields
  nationalID: string;
  gender: number; // 0=Male, 1=Female
  dateOfBirth: string;
  bloodTypeID: number;
  city?: string | null;
  isActive?: boolean;
}

export interface RegisterDonorResponse {
  user: {
    userID: number;
    username: string;
    fullName: string;
    phone: string | null;
    roleId: number;
    roleName: string;
  };
  donor: {
    donorID: number;
    fullName: string;
    nationalID: string;
    gender: number;
    dateOfBirth: string;
    phone: string | null;
    bloodTypeID: number;
    bloodType: string;
    city: string | null;
    isActive: boolean;
    userID: number;
  };
}

export interface ChangePasswordRequest {
  userId: number;
  currentPassword: string;
  newPassword: string;
}

export interface CreateDonorRequest {
  fullName: string;
  nationalID: string;
  gender: number; // 0=Male, 1=Female
  dateOfBirth: string;
  phone: string;
  bloodTypeID: number;
  city: string;
  isActive?: boolean;
  userID?: number | null;
}

export interface UpdateDonorRequest {
  fullName?: string;
  phone?: string;
  bloodTypeId?: number;
  city?: string;
  isActive?: boolean;
}

export interface CreatePatientRequest {
  fullName: string;
  nationalID: string;
  gender: number; // 0=Male, 1=Female
  dateOfBirth: string;
  phone: string;
  bloodTypeID: number;
  city: string;
}

export interface UpdatePatientRequest {
  fullName?: string;
  phone?: string;
  city?: string;
  bloodTypeId?: number;
}

export interface CreateBloodRequestRequest {
  patientId: number;
  bloodTypeId: number;
  quantityNeeded: number;
  urgencyLevel: UrgencyLevel;
  requiredDate: string;
  notes?: string;
}

export interface CreateDonationRequest {
  donorID: number;
  bloodTypeID: number;
  donationDate: string;
  quantity: number;
  testResult: number; // 0=Pending, 1=Approved, 2=Rejected
  notes?: string;
}

export interface UpdateTestResultRequest {
  testResult: TestResult;
  notes?: string;
}

export interface FulfillRequestPayload {
  donationId: number;
  quantity: number;
}

// Blood Type IDs mapping - التفسير الصحيح من API
export const BLOOD_TYPE_MAP: Record<number, string> = {
  1: 'A+',
  2: 'A-',
  3: 'B+',
  4: 'B-',
  5: 'AB+',
  6: 'AB-',
  7: 'O+',
  8: 'O-',
};

export const BLOOD_TYPE_REVERSE_MAP: Record<string, number> = {
  'A+': 1,
  'A-': 2,
  'B+': 3,
  'B-': 4,
  'AB+': 5,
  'AB-': 6,
  'O+': 7,
  'O-': 8,
};

// User Role IDs
export const USER_ROLE_IDS = {
  Admin: 1,
  BloodBankStaff: 2,
  Doctor: 3,
  Nurse: 4,
} as const;

// ─────────────────────────────────────────────
//  Report Types
// ─────────────────────────────────────────────

// Donor Reports
export interface BloodTypeStatistic {
  bloodType: string;
  count: number;
}

export interface DonorStatisticsDto {
  statistics: BloodTypeStatistic[];
}

export interface ActiveVsInactiveDonorsDto {
  activeCount: number;
  inactiveCount: number;
  totalCount: number;
  activePercentage: number;
  inactivePercentage: number;
}

export interface DonorsByCityDto {
  city: string;
  donorCount: number;
}

export interface EligibleDonorsByBloodTypeDto {
  bloodType: string;
  eligibleCount: number;
}

// Donation Reports
export type GroupBy = 'day' | 'week' | 'month' | 'year';

export interface DonationsByPeriodDto {
  period: string;
  donationCount: number;
  periodStart: string;
  periodEnd: string;
}

export interface BloodQuantityDto {
  bloodType: string;
  totalQuantityML: number;
}

export interface DonationTestResultsDto {
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
  totalCount: number;
  acceptanceRate: number;
  rejectionRate: number;
}

export interface DonationsByBloodTypeDto {
  bloodType: string;
  donationCount: number;
  percentage: number;
}

export interface MostActiveDonorDto {
  donorID: number;
  donorName: string;
  bloodType: string;
  donationCount: number;
}

// Inventory Reports
export interface InventoryAvailabilityDto {
  bloodType: string;
  quantityAvailable: number;
  quantityReserved: number;
  totalAvailable: number;
}

export interface ExpiringBloodUnitsDto {
  bloodType: string;
  unitCount: number;
  daysUntilExpiry: number;
  expiryDate: string;
}

export interface ExpiredBloodUnitsDto {
  bloodType: string;
  expiredUnitCount: number;
  totalQuantityWasted: number;
}

export interface ConsumptionRateDto {
  bloodType: string;
  totalConsumed: number;
  averageDailyConsumption: number;
  currentInventory: number;
  projectedDaysUntilStockout: number;
}

export interface LowInventoryAlertDto {
  bloodType: string;
  currentQuantity: number;
  threshold: number;
  severity: 'Critical' | 'Warning' | string;
}

// Blood Request Reports
export interface RequestsByStatusDto {
  pendingCount: number;
  fulfilledCount: number;
  cancelledCount: number;
  totalCount: number;
  fulfillmentRate: number;
  cancellationRate: number;
}

export interface RequestsByUrgencyDto {
  urgencyLevel: string;
  requestCount: number;
}

export interface FulfillmentRateDto {
  bloodType: string;
  totalRequests: number;
  fulfilledRequests: number;
  fulfillmentRate: number;
}

export interface RequestsByBloodTypeDto {
  bloodType: string;
  requestCount: number;
  percentage: number;
}

export interface AvgFulfillmentTimeDto {
  urgencyLevel: string;
  averageHours: number;
  requestCount: number;
}

// Patient Reports
export interface MonthlyTrend {
  month: string;
  count: number;
}

export interface PatientCountDto {
  totalCount: number;
  trends?: MonthlyTrend[] | null;
}

export interface PatientsByBloodTypeDto {
  bloodType: string;
  patientCount: number;
  percentage: number;
}

export interface PatientsWithActiveRequestsDto {
  patientID: number;
  patientName: string;
  bloodType: string;
  activeRequestCount: number;
  highestUrgencyLevel: string;
}

// Dashboard
export interface InventoryStatus {
  bloodType: string;
  quantityAvailable: number;
}

export interface DashboardSummaryDto {
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

