// Reports API Module
// Covers all 21 endpoints under /api/reports

import { apiClient } from './client';
import type {
    ServiceResponse,
    PagedResult,
    GroupBy,
    DonorStatisticsDto,
    ActiveVsInactiveDonorsDto,
    DonorsByCityDto,
    EligibleDonorsByBloodTypeDto,
    DonationsByPeriodDto,
    BloodQuantityDto,
    DonationTestResultsDto,
    DonationsByBloodTypeDto,
    MostActiveDonorDto,
    InventoryAvailabilityDto,
    ExpiringBloodUnitsDto,
    ExpiredBloodUnitsDto,
    ConsumptionRateDto,
    LowInventoryAlertDto,
    RequestsByStatusDto,
    RequestsByUrgencyDto,
    FulfillmentRateDto,
    RequestsByBloodTypeDto,
    AvgFulfillmentTimeDto,
    PatientCountDto,
    PatientsByBloodTypeDto,
    PatientsWithActiveRequestsDto,
    DashboardSummaryDto,
} from '@/types/api';

type QueryValue = string | number | boolean | undefined | null;
type Params = Record<string, QueryValue>;

function buildReportQuery(params: Params): string {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            search.set(key, String(value));
        }
    });
    return search.toString();
}

function buildUrl(path: string, params?: Params): string {
    if (!params) return path;
    const query = buildReportQuery(params);
    return query ? `${path}?${query}` : path;
}

export interface DateFilter {
    startDate?: string;
    endDate?: string;
}

// ─────────────────────────────────────────────
//  Donor Reports
// ─────────────────────────────────────────────
const donorReports = {
    statistics(): Promise<ServiceResponse<DonorStatisticsDto>> {
        return apiClient.get('/reports/donors/statistics');
    },

    activeVsInactive(): Promise<ServiceResponse<ActiveVsInactiveDonorsDto>> {
        return apiClient.get('/reports/donors/active-vs-inactive');
    },

    byCity(
        pageNumber = 1,
        pageSize = 10,
    ): Promise<ServiceResponse<PagedResult<DonorsByCityDto>>> {
        const url = buildUrl('/reports/donors/by-city', { pageNumber, pageSize });
        return apiClient.get(url);
    },

    eligible(): Promise<ServiceResponse<EligibleDonorsByBloodTypeDto[]>> {
        return apiClient.get('/reports/donors/eligible');
    },
};

// ─────────────────────────────────────────────
//  Donation Reports
// ─────────────────────────────────────────────
const donationReports = {
    byPeriod(params?: DateFilter & { groupBy?: GroupBy }): Promise<ServiceResponse<DonationsByPeriodDto[]>> {
        const url = buildUrl('/reports/donations/by-period', params as Params);
        return apiClient.get(url);
    },

    quantity(params?: DateFilter): Promise<ServiceResponse<BloodQuantityDto[]>> {
        const url = buildUrl('/reports/donations/quantity', params as Params);
        return apiClient.get(url);
    },

    testResults(params?: DateFilter): Promise<ServiceResponse<DonationTestResultsDto>> {
        const url = buildUrl('/reports/donations/test-results', params as Params);
        return apiClient.get(url);
    },

    byBloodType(params?: DateFilter): Promise<ServiceResponse<DonationsByBloodTypeDto[]>> {
        const url = buildUrl('/reports/donations/by-blood-type', params as Params);
        return apiClient.get(url);
    },

    mostActiveDonors(params?: DateFilter & { limit?: number }): Promise<ServiceResponse<MostActiveDonorDto[]>> {
        const url = buildUrl('/reports/donations/most-active-donors', params as Params);
        return apiClient.get(url);
    },
};

// ─────────────────────────────────────────────
//  Inventory Reports
// ─────────────────────────────────────────────
const inventoryReports = {
    availability(): Promise<ServiceResponse<InventoryAvailabilityDto[]>> {
        return apiClient.get('/reports/inventory/availability');
    },

    expiring(): Promise<ServiceResponse<ExpiringBloodUnitsDto[]>> {
        return apiClient.get('/reports/inventory/expiring');
    },

    expired(params?: DateFilter): Promise<ServiceResponse<ExpiredBloodUnitsDto[]>> {
        const url = buildUrl('/reports/inventory/expired', params as Params);
        return apiClient.get(url);
    },

    consumptionRate(params?: DateFilter): Promise<ServiceResponse<ConsumptionRateDto[]>> {
        const url = buildUrl('/reports/inventory/consumption-rate', params as Params);
        return apiClient.get(url);
    },

    lowStockAlerts(threshold?: number): Promise<ServiceResponse<LowInventoryAlertDto[]>> {
        const url = buildUrl('/reports/inventory/low-stock-alerts', threshold != null ? { threshold } : undefined);
        return apiClient.get(url);
    },
};

// ─────────────────────────────────────────────
//  Blood Request Reports
// ─────────────────────────────────────────────
const requestReports = {
    byStatus(params?: DateFilter): Promise<ServiceResponse<RequestsByStatusDto>> {
        const url = buildUrl('/reports/requests/by-status', params as Params);
        return apiClient.get(url);
    },

    byUrgency(params?: DateFilter): Promise<ServiceResponse<RequestsByUrgencyDto[]>> {
        const url = buildUrl('/reports/requests/by-urgency', params as Params);
        return apiClient.get(url);
    },

    fulfillmentRate(params?: DateFilter): Promise<ServiceResponse<FulfillmentRateDto[]>> {
        const url = buildUrl('/reports/requests/fulfillment-rate', params as Params);
        return apiClient.get(url);
    },

    byBloodType(params?: DateFilter): Promise<ServiceResponse<RequestsByBloodTypeDto[]>> {
        const url = buildUrl('/reports/requests/by-blood-type', params as Params);
        return apiClient.get(url);
    },

    avgFulfillmentTime(params?: DateFilter): Promise<ServiceResponse<AvgFulfillmentTimeDto[]>> {
        const url = buildUrl('/reports/requests/avg-fulfillment-time', params as Params);
        return apiClient.get(url);
    },
};

// ─────────────────────────────────────────────
//  Patient Reports
// ─────────────────────────────────────────────
const patientReports = {
    count(params?: DateFilter): Promise<ServiceResponse<PatientCountDto>> {
        const url = buildUrl('/reports/patients/count', params as Params);
        return apiClient.get(url);
    },

    byBloodType(): Promise<ServiceResponse<PatientsByBloodTypeDto[]>> {
        return apiClient.get('/reports/patients/by-blood-type');
    },

    withActiveRequests(): Promise<ServiceResponse<PatientsWithActiveRequestsDto[]>> {
        return apiClient.get('/reports/patients/with-active-requests');
    },
};

// ─────────────────────────────────────────────
//  Dashboard
// ─────────────────────────────────────────────
const dashboardReports = {
    summary(): Promise<ServiceResponse<DashboardSummaryDto>> {
        return apiClient.get('/reports/dashboard/summary');
    },
};

// ─────────────────────────────────────────────
//  Unified export
// ─────────────────────────────────────────────
export const reportsApi = {
    donors: donorReports,
    donations: donationReports,
    inventory: inventoryReports,
    requests: requestReports,
    patients: patientReports,
    dashboard: dashboardReports,
};
