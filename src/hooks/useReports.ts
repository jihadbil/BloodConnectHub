// React Query Hooks for Reports API
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/api/reports';
import type { DateFilter } from '@/api/reports';
import type { GroupBy } from '@/types/api';

// ─────────────────────────────────────────────
//  Query Keys
// ─────────────────────────────────────────────
export const reportKeys = {
    all: ['reports'] as const,
    dashboard: () => [...reportKeys.all, 'dashboard'] as const,
    // donors
    donorStats: () => [...reportKeys.all, 'donors', 'statistics'] as const,
    donorActiveVsInactive: () => [...reportKeys.all, 'donors', 'active-vs-inactive'] as const,
    donorsByCity: (page: number, pageSize: number) =>
        [...reportKeys.all, 'donors', 'by-city', { page, pageSize }] as const,
    eligibleDonors: () => [...reportKeys.all, 'donors', 'eligible'] as const,
    // donations
    donationsByPeriod: (params?: DateFilter & { groupBy?: GroupBy }) =>
        [...reportKeys.all, 'donations', 'by-period', params] as const,
    donationsQuantity: (params?: DateFilter) =>
        [...reportKeys.all, 'donations', 'quantity', params] as const,
    donationTestResults: (params?: DateFilter) =>
        [...reportKeys.all, 'donations', 'test-results', params] as const,
    donationsByBloodType: (params?: DateFilter) =>
        [...reportKeys.all, 'donations', 'by-blood-type', params] as const,
    mostActiveDonors: (params?: DateFilter & { limit?: number }) =>
        [...reportKeys.all, 'donations', 'most-active-donors', params] as const,
    // inventory
    inventoryAvailability: () => [...reportKeys.all, 'inventory', 'availability'] as const,
    expiringUnits: () => [...reportKeys.all, 'inventory', 'expiring'] as const,
    expiredUnits: (params?: DateFilter) => [...reportKeys.all, 'inventory', 'expired', params] as const,
    consumptionRate: (params?: DateFilter) => [...reportKeys.all, 'inventory', 'consumption-rate', params] as const,
    lowStockAlerts: (threshold?: number) => [...reportKeys.all, 'inventory', 'low-stock', threshold] as const,
    // requests
    requestsByStatus: (params?: DateFilter) => [...reportKeys.all, 'requests', 'by-status', params] as const,
    requestsByUrgency: (params?: DateFilter) => [...reportKeys.all, 'requests', 'by-urgency', params] as const,
    fulfillmentRate: (params?: DateFilter) => [...reportKeys.all, 'requests', 'fulfillment-rate', params] as const,
    requestsByBloodType: (params?: DateFilter) => [...reportKeys.all, 'requests', 'by-blood-type', params] as const,
    avgFulfillmentTime: (params?: DateFilter) => [...reportKeys.all, 'requests', 'avg-fulfillment-time', params] as const,
    // patients
    patientCount: (params?: DateFilter) => [...reportKeys.all, 'patients', 'count', params] as const,
    patientsByBloodType: () => [...reportKeys.all, 'patients', 'by-blood-type'] as const,
    patientsWithActiveRequests: () => [...reportKeys.all, 'patients', 'with-active-requests'] as const,
};

// ─────────────────────────────────────────────
//  Dashboard
// ─────────────────────────────────────────────
export function useDashboardSummary() {
    return useQuery({
        queryKey: reportKeys.dashboard(),
        queryFn: () => reportsApi.dashboard.summary(),
    });
}

// ─────────────────────────────────────────────
//  Donor Hooks
// ─────────────────────────────────────────────
export function useDonorStatistics() {
    return useQuery({
        queryKey: reportKeys.donorStats(),
        queryFn: () => reportsApi.donors.statistics(),
    });
}

export function useActiveVsInactiveDonors() {
    return useQuery({
        queryKey: reportKeys.donorActiveVsInactive(),
        queryFn: () => reportsApi.donors.activeVsInactive(),
    });
}

export function useDonorsByCity(pageNumber = 1, pageSize = 10) {
    return useQuery({
        queryKey: reportKeys.donorsByCity(pageNumber, pageSize),
        queryFn: () => reportsApi.donors.byCity(pageNumber, pageSize),
    });
}

export function useEligibleDonorsByBloodType() {
    return useQuery({
        queryKey: reportKeys.eligibleDonors(),
        queryFn: () => reportsApi.donors.eligible(),
    });
}

// ─────────────────────────────────────────────
//  Donation Hooks
// ─────────────────────────────────────────────
export function useDonationsByPeriod(params?: DateFilter & { groupBy?: GroupBy }) {
    return useQuery({
        queryKey: reportKeys.donationsByPeriod(params),
        queryFn: () => reportsApi.donations.byPeriod(params),
    });
}

export function useDonationsQuantity(params?: DateFilter) {
    return useQuery({
        queryKey: reportKeys.donationsQuantity(params),
        queryFn: () => reportsApi.donations.quantity(params),
    });
}

export function useDonationTestResults(params?: DateFilter) {
    return useQuery({
        queryKey: reportKeys.donationTestResults(params),
        queryFn: () => reportsApi.donations.testResults(params),
    });
}

export function useDonationsByBloodType(params?: DateFilter) {
    return useQuery({
        queryKey: reportKeys.donationsByBloodType(params),
        queryFn: () => reportsApi.donations.byBloodType(params),
    });
}

export function useMostActiveDonors(params?: DateFilter & { limit?: number }) {
    return useQuery({
        queryKey: reportKeys.mostActiveDonors(params),
        queryFn: () => reportsApi.donations.mostActiveDonors(params),
    });
}

// ─────────────────────────────────────────────
//  Inventory Hooks
// ─────────────────────────────────────────────
export function useInventoryAvailability() {
    return useQuery({
        queryKey: reportKeys.inventoryAvailability(),
        queryFn: () => reportsApi.inventory.availability(),
    });
}

export function useExpiringBloodUnits() {
    return useQuery({
        queryKey: reportKeys.expiringUnits(),
        queryFn: () => reportsApi.inventory.expiring(),
    });
}

export function useExpiredBloodUnits(params?: DateFilter) {
    return useQuery({
        queryKey: reportKeys.expiredUnits(params),
        queryFn: () => reportsApi.inventory.expired(params),
    });
}

export function useConsumptionRate(params?: DateFilter) {
    return useQuery({
        queryKey: reportKeys.consumptionRate(params),
        queryFn: () => reportsApi.inventory.consumptionRate(params),
    });
}

export function useLowStockAlerts(threshold?: number) {
    return useQuery({
        queryKey: reportKeys.lowStockAlerts(threshold),
        queryFn: () => reportsApi.inventory.lowStockAlerts(threshold),
    });
}

// ─────────────────────────────────────────────
//  Request Hooks
// ─────────────────────────────────────────────
export function useRequestsByStatus(params?: DateFilter) {
    return useQuery({
        queryKey: reportKeys.requestsByStatus(params),
        queryFn: () => reportsApi.requests.byStatus(params),
    });
}

export function useRequestsByUrgency(params?: DateFilter) {
    return useQuery({
        queryKey: reportKeys.requestsByUrgency(params),
        queryFn: () => reportsApi.requests.byUrgency(params),
    });
}

export function useFulfillmentRate(params?: DateFilter) {
    return useQuery({
        queryKey: reportKeys.fulfillmentRate(params),
        queryFn: () => reportsApi.requests.fulfillmentRate(params),
    });
}

export function useRequestsByBloodType(params?: DateFilter) {
    return useQuery({
        queryKey: reportKeys.requestsByBloodType(params),
        queryFn: () => reportsApi.requests.byBloodType(params),
    });
}

export function useAvgFulfillmentTime(params?: DateFilter) {
    return useQuery({
        queryKey: reportKeys.avgFulfillmentTime(params),
        queryFn: () => reportsApi.requests.avgFulfillmentTime(params),
    });
}

// ─────────────────────────────────────────────
//  Patient Hooks
// ─────────────────────────────────────────────
export function usePatientCount(params?: DateFilter) {
    return useQuery({
        queryKey: reportKeys.patientCount(params),
        queryFn: () => reportsApi.patients.count(params),
    });
}

export function usePatientsByBloodType() {
    return useQuery({
        queryKey: reportKeys.patientsByBloodType(),
        queryFn: () => reportsApi.patients.byBloodType(),
    });
}

export function usePatientsWithActiveRequests() {
    return useQuery({
        queryKey: reportKeys.patientsWithActiveRequests(),
        queryFn: () => reportsApi.patients.withActiveRequests(),
    });
}
