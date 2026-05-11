// React Query hook for Donor Responses API
import { useQuery } from '@tanstack/react-query';
import { donorResponsesApi } from '@/api/donorResponses';
import type { DonorResponse } from '@/types/donor-response';

// Query keys for cache management
export const donorResponseKeys = {
  all: ['donorResponses'] as const,
  lists: () => [...donorResponseKeys.all, 'list'] as const,
  byRequest: (requestId: number) => [...donorResponseKeys.lists(), 'request', requestId] as const,
  byDonor: (donorId: number) => [...donorResponseKeys.lists(), 'donor', donorId] as const,
  details: () => [...donorResponseKeys.all, 'detail'] as const,
  detail: (id: number) => [...donorResponseKeys.details(), id] as const,
};

/**
 * Filter options for fetching donor responses
 * Either requestId or donorId should be provided, not both
 */
interface DonorResponsesFilter {
  requestId?: number;
  donorId?: number;
}

/**
 * Hook لجلب قوائم الاستجابات باستخدام React Query
 * Fetches donor responses with filtering by requestId or donorId
 * 
 * Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3
 * 
 * @param filter - Filter options (requestId or donorId)
 * @returns Query result with responses, loading state, and error
 * 
 * @example
 * // Get responses for a specific blood request
 * const { data: responses, isLoading, error, refetch } = useDonorResponses({ requestId: 5 });
 * 
 * @example
 * // Get responses for a specific donor
 * const { data: responses, isLoading, error, refetch } = useDonorResponses({ donorId: 10 });
 */
export function useDonorResponses(filter: DonorResponsesFilter) {
  const { requestId, donorId } = filter;

  // Determine which query key and function to use based on filter
  const queryKey = requestId 
    ? donorResponseKeys.byRequest(requestId)
    : donorId 
    ? donorResponseKeys.byDonor(donorId)
    : donorResponseKeys.lists();

  const queryFn = async () => {
    if (requestId) {
      const result = await donorResponsesApi.getByRequestId(requestId);
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'فشل في جلب الاستجابات');
    }
    
    if (donorId) {
      const result = await donorResponsesApi.getByDonorId(donorId);
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'فشل في جلب الاستجابات');
    }
    
    // If no filter provided, return empty array
    return [] as DonorResponse[];
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!(requestId || donorId), // Only run query if filter is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache time (formerly cacheTime)
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 2, // Retry failed requests twice
  });
}

/**
 * Hook لجلب تفاصيل استجابة واحدة
 * Fetches details of a single donor response
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4
 * 
 * @param id - Response ID
 * @returns Query result with response details, loading state, and error
 * 
 * @example
 * const { data: response, isLoading, error } = useDonorResponse(123);
 */
export function useDonorResponse(id: number) {
  return useQuery({
    queryKey: donorResponseKeys.detail(id),
    queryFn: async () => {
      const result = await donorResponsesApi.getById(id);
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'فشل في جلب تفاصيل الاستجابة');
    },
    enabled: !!id && id > 0, // Only run if valid ID provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
