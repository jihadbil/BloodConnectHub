// Blood Request Response Feature Types
// Types for the donor response flow to blood requests

import { TestResult } from './api';

/**
 * Payload for creating a donation in response to a blood request
 */
export interface DonationResponse {
  donorID: number;
  bloodTypeID: number;
  donationDate: string; // ISO 8601 format
  quantity: number;
  testResult: 0; // Pending
  notes: string; // "Response to request #{requestId}"
}

/**
 * Payload for linking a donation to a blood request
 */
export interface FulfillRequestPayload {
  donationId: number;
  quantity: number;
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
 * Blood compatibility check result
 */
export interface BloodCompatibilityCheck {
  isCompatible: boolean;
  donorBloodType: string;
  requestBloodType: string;
  reason?: string; // في حالة عدم التوافق
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

/**
 * Error handling strategy for different error types
 */
export interface ErrorHandlingStrategy {
  errorType: 'auth' | 'validation' | 'api' | 'data' | 'unknown';
  userMessage: string; // رسالة للمستخدم بالعربية
  action: 'retry' | 'redirect' | 'dismiss' | 'contact';
  logLevel: 'error' | 'warn' | 'info';
}
