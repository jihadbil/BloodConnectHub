// React Query mutations for Donor Response Actions
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { donorResponsesApi } from '@/api/donorResponses';
import { donorResponseKeys } from './useDonorResponses';
import { bloodRequestKeys } from './useBloodRequests';
import { useToast } from '@/hooks/use-toast';
import { validateCreateRequest, validateUpdateRequest, validateCancelRequest } from '@/lib/responseValidation';
import { isValidTransition, getTransitionErrorMessage } from '@/lib/responseStateMachine';
import type { 
  CreateDonorResponseRequest, 
  UpdateResponseStatusRequest,
  DonorResponse,
  ResponseStatus
} from '@/types/donor-response';
import type { RespondResult } from '@/types/blood-request-response';

/**
 * Hook لتنفيذ العمليات على الاستجابات (إنشاء، تحديث، إلغاء)
 * Provides mutation functions for creating, updating, and cancelling donor responses
 * 
 * Requirements: 1.1, 5.1, 5.13, 5.14, 6.1, 6.7
 * 
 * Features:
 * - Optimistic updates for better UX
 * - Client-side validation before API calls
 * - State machine validation for status transitions
 * - Unified error handling with RespondResult
 * - Separate loading states for each operation
 * - Automatic cache invalidation
 * 
 * @returns Object with mutation functions and loading states
 * 
 * @example
 * const { createResponse, updateStatus, cancelResponse, isCreating } = useResponseActions();
 * 
 * // Create a new response
 * const result = await createResponse({ donorId: 1, requestId: 5, notes: 'متاح غداً' });
 * if (result.success) {
 *   console.log('Response created:', result.donationId);
 * }
 */
export function useResponseActions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * إنشاء استجابة جديدة مع optimistic updates
   * Create a new donor response with optimistic UI updates
   * 
   * Requirements: 1.1, 1.10, 9.1, 9.2, 9.3, 9.4
   */
  const createMutation = useMutation({
    mutationFn: async (data: CreateDonorResponseRequest): Promise<DonorResponse> => {
      // Client-side validation (Requirement 8.1, 8.3, 8.4)
      const validation = validateCreateRequest(data);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const result = await donorResponsesApi.create(data);
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'فشل في إنشاء الاستجابة');
      }
      
      return result.data;
    },
    onMutate: async (data) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ 
        queryKey: donorResponseKeys.byRequest(data.requestId) 
      });
      
      // Snapshot previous value for rollback
      const previousResponses = queryClient.getQueryData(
        donorResponseKeys.byRequest(data.requestId)
      );
      
      return { previousResponses, requestId: data.requestId };
    },
    onSuccess: (response, variables, context) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ 
        queryKey: donorResponseKeys.byRequest(variables.requestId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: donorResponseKeys.byDonor(variables.donorId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: bloodRequestKeys.detail(variables.requestId) 
      });
      
      toast({
        title: 'تم بنجاح',
        description: 'تم تسجيل استجابتك بنجاح. سيتواصل معك الفريق قريباً',
      });
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousResponses) {
        queryClient.setQueryData(
          donorResponseKeys.byRequest(context.requestId),
          context.previousResponses
        );
      }
      
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل في إنشاء الاستجابة',
        variant: 'destructive',
      });
    },
  });

  /**
   * تحديث حالة الاستجابة مع التحقق من صحة الانتقال
   * Update response status with state machine validation
   * 
   * Requirements: 5.1, 5.8, 5.13, 5.14, 9.1, 9.2, 9.3, 9.4
   */
  const updateStatusMutation = useMutation({
    mutationFn: async ({ 
      id, 
      data, 
      currentStatus 
    }: { 
      id: number; 
      data: UpdateResponseStatusRequest; 
      currentStatus: ResponseStatus;
    }): Promise<DonorResponse> => {
      // Client-side validation (Requirement 8.1, 8.5)
      const validation = validateUpdateRequest(data);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // State machine validation (Requirement 5.1, 5.8)
      if (!isValidTransition(currentStatus, data.status)) {
        const errorMessage = getTransitionErrorMessage(currentStatus, data.status);
        throw new Error(errorMessage);
      }

      const result = await donorResponsesApi.updateStatus(id, data);
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'فشل في تحديث حالة الاستجابة');
      }
      
      return result.data;
    },
    onMutate: async ({ id }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: donorResponseKeys.detail(id) 
      });
      
      // Snapshot previous value
      const previousResponse = queryClient.getQueryData(
        donorResponseKeys.detail(id)
      );
      
      return { previousResponse, id };
    },
    onSuccess: (response) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: donorResponseKeys.detail(response.responseId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: donorResponseKeys.byRequest(response.requestId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: donorResponseKeys.byDonor(response.donorId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: bloodRequestKeys.detail(response.requestId) 
      });
      
      toast({
        title: 'تم بنجاح',
        description: 'تم تحديث حالة الاستجابة بنجاح',
      });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousResponse) {
        queryClient.setQueryData(
          donorResponseKeys.detail(context.id),
          context.previousResponse
        );
      }
      
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل في تحديث الحالة',
        variant: 'destructive',
      });
    },
  });

  /**
   * إلغاء استجابة مع التحقق من السبب
   * Cancel a donor response with reason validation
   * 
   * Requirements: 6.1, 6.2, 6.3, 6.4, 6.7, 9.1, 9.2, 9.3, 9.4
   */
  const cancelMutation = useMutation({
    mutationFn: async ({ 
      id, 
      reason,
      requestId,
      donorId
    }: { 
      id: number; 
      reason: string;
      requestId: number;
      donorId: number;
    }): Promise<boolean> => {
      // Client-side validation (Requirement 6.2, 6.3, 8.2)
      const validation = validateCancelRequest(reason);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const result = await donorResponsesApi.cancel(id, reason);
      
      if (!result.success) {
        throw new Error(result.message || 'فشل في إلغاء الاستجابة');
      }
      
      return true;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: donorResponseKeys.detail(variables.id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: donorResponseKeys.byRequest(variables.requestId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: donorResponseKeys.byDonor(variables.donorId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: bloodRequestKeys.detail(variables.requestId) 
      });
      
      toast({
        title: 'تم بنجاح',
        description: 'تم إلغاء الاستجابة بنجاح',
      });
    },
    onError: (error) => {
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل في إلغاء الاستجابة',
        variant: 'destructive',
      });
    },
  });

  /**
   * Wrapper function for createResponse that returns RespondResult
   * 
   * Requirements: 1.1, 9.1, 9.2, 9.3
   */
  const createResponse = async (data: CreateDonorResponseRequest): Promise<RespondResult> => {
    try {
      const response = await createMutation.mutateAsync(data);
      return {
        success: true,
        donationId: response.responseId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'فشل في إنشاء الاستجابة',
        errorType: determineErrorType(error),
      };
    }
  };

  /**
   * Wrapper function for updateStatus that returns RespondResult
   * 
   * Requirements: 5.1, 5.14, 9.1, 9.2, 9.3
   */
  const updateStatus = async (
    id: number, 
    data: UpdateResponseStatusRequest,
    currentStatus: ResponseStatus
  ): Promise<RespondResult> => {
    try {
      const response = await updateStatusMutation.mutateAsync({ id, data, currentStatus });
      return {
        success: true,
        donationId: response.responseId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'فشل في تحديث الحالة',
        errorType: determineErrorType(error),
      };
    }
  };

  /**
   * Wrapper function for cancelResponse that returns RespondResult
   * 
   * Requirements: 6.1, 6.7, 9.1, 9.2, 9.3
   */
  const cancelResponse = async (
    id: number, 
    reason: string,
    requestId: number,
    donorId: number
  ): Promise<RespondResult> => {
    try {
      await cancelMutation.mutateAsync({ id, reason, requestId, donorId });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'فشل في إلغاء الاستجابة',
        errorType: determineErrorType(error),
      };
    }
  };

  return {
    // Operations
    createResponse,
    updateStatus,
    cancelResponse,
    
    // Loading states (Requirement 5.14)
    isCreating: createMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
    isCancelling: cancelMutation.isPending,
  };
}

/**
 * Helper function to determine error type from error object
 * 
 * @param error - Error object
 * @returns Error type for RespondResult
 */
function determineErrorType(error: unknown): RespondResult['errorType'] {
  if (!(error instanceof Error)) {
    return 'unknown';
  }

  const message = error.message.toLowerCase();

  if (message.includes('مصادق') || message.includes('تسجيل الدخول')) {
    return 'auth';
  }

  if (message.includes('توافق') || message.includes('فصيلة')) {
    return 'compatibility';
  }

  if (message.includes('أهلية') || message.includes('متاح')) {
    return 'eligibility';
  }

  if (message.includes('خادم') || message.includes('شبكة')) {
    return 'api';
  }

  return 'unknown';
}
