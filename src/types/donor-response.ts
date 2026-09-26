// Donor Response Feature Types
// Types for managing donor responses to blood requests

import { UrgencyLevel } from './api';

/**
 * Response Status Enum
 * Represents the lifecycle stages of a donor response
 */
export enum ResponseStatus {
  Interested = 1,
  Confirmed = 2,
  Donated = 3,
  Rejected = 4,
  NoShow = 5,
  Cancelled = 6
}

/**
 * Arabic labels for ResponseStatus enum
 * Used for display in the UI
 */
export const ResponseStatusLabels: Record<ResponseStatus, string> = {
  [ResponseStatus.Interested]: 'مهتم بالتبرع',
  [ResponseStatus.Confirmed]: 'تم التأكيد',
  [ResponseStatus.Donated]: 'تم التبرع',
  [ResponseStatus.Rejected]: 'مرفوض',
  [ResponseStatus.NoShow]: 'لم يحضر',
  [ResponseStatus.Cancelled]: 'ملغى'
};

/**
 * Badge variant mapping for each state
 */
export const ResponseStatusVariant: Record<ResponseStatus, 'default' | 'secondary' | 'success' | 'destructive' | 'outline'> = {
  [ResponseStatus.Interested]: 'default',
  [ResponseStatus.Confirmed]: 'success',
  [ResponseStatus.Donated]: 'success',
  [ResponseStatus.Rejected]: 'destructive',
  [ResponseStatus.NoShow]: 'destructive',
  [ResponseStatus.Cancelled]: 'outline'
};

/**
 * DonorResponse Interface
 * Complete donor response object with all fields
 */
export interface DonorResponse {
  responseId: number;
  donorId: number;
  donorName: string;
  donorPhone?: string;
  bloodTypeName: string;
  requestId: number;
  patientName?: string;
  urgencyLevel?: UrgencyLevel;
  status: ResponseStatus;
  statusDescription?: string;
  notes?: string;
  rejectionReason?: string;
  responseDate: string; // ISO 8601
  confirmedAt?: string; // ISO 8601
  donationId?: number;
  createdAt: string; // ISO 8601
  updatedAt?: string; // ISO 8601
}

/**
 * CreateDonorResponseRequest
 * Payload for creating a new donor response
 */
export interface CreateDonorResponseRequest {
  donorId: number;
  requestId: number;
  notes?: string;
}

/**
 * UpdateResponseStatusRequest
 * Payload for updating response status
 */
export interface UpdateResponseStatusRequest {
  status: ResponseStatus;
  notes?: string;
  donationId?: number; // Required when status = Donated
}

/**
 * API Response from Backend
 * Raw response format from the ASP.NET Core API
 */
export interface ApiDonorResponse {
  responseID: number;
  donorID: number;
  donorName: string;
  donorPhone?: string;
  bloodTypeName: string;
  requestID: number;
  patientName?: string;
  urgencyLevel?: number; // 1=Normal, 2=Urgent, 3=Emergency
  status: number; // 1-6
  statusDescription?: string;
  notes?: string;
  rejectionReason?: string;
  responseDate: string;
  confirmedAt?: string;
  donationID?: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Donor eligibility information based on last donation date
 */
export interface DonorEligibility {
  isEligible: boolean;
  lastDonationDate: Date | null;
  nextEligibleDate: Date | null;
  daysUntilEligible: number;
}

/**
 * Result of responding to a blood request
 */
export interface RespondResult {
  success: boolean;
  donationId?: number;
  error?: string;
  errorType?: 'auth' | 'compatibility' | 'eligibility' | 'api' | 'unknown';
}
