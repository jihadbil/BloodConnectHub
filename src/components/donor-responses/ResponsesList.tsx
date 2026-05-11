import { useDonorResponses } from '@/hooks/useDonorResponses';
import { ResponseCard } from './ResponseCard';
import { DonorResponse, ResponseStatus } from '@/types/donor-response';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Inbox } from 'lucide-react';

interface ResponsesListProps {
  requestId?: number;
  donorId?: number;
  onResponseClick?: (response: DonorResponse) => void;
  onStatusChange?: (id: number, newStatus: ResponseStatus) => void;
  onCancel?: (id: number, reason: string) => void;
  showActions?: boolean;
}

/**
 * ResponsesList Component
 * Displays a list of donor responses with filtering support
 * 
 * Features:
 * - Filters by requestId or donorId
 * - Uses useDonorResponses hook for data fetching
 * - Shows loading state with skeletons
 * - Shows error state with alert
 * - Shows empty state when no responses
 * - Supports onResponseClick for interaction
 * - Passes through action handlers to ResponseCard
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 4.1, 4.2, 4.3**
 */
export function ResponsesList({
  requestId,
  donorId,
  onResponseClick,
  onStatusChange,
  onCancel,
  showActions = false
}: ResponsesListProps) {
  // Fetch responses using the hook
  const { data: responses, isLoading, error } = useDonorResponses({
    requestId,
    donorId
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل الاستجابات'}
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (!responses || responses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">لا توجد استجابات</h3>
        <p className="text-sm text-muted-foreground">
          {requestId && 'لم يتم العثور على استجابات لهذا الطلب'}
          {donorId && 'لم يتم العثور على استجابات لهذا المتبرع'}
          {!requestId && !donorId && 'لا توجد استجابات متاحة'}
        </p>
      </div>
    );
  }

  // Success state - render list
  return (
    <div className="space-y-4">
      {responses.map((response) => (
        <div
          key={response.responseId}
          onClick={() => onResponseClick?.(response)}
          className={onResponseClick ? 'cursor-pointer' : ''}
        >
          <ResponseCard
            response={response}
            onStatusChange={onStatusChange}
            onCancel={onCancel}
            showActions={showActions}
          />
        </div>
      ))}
    </div>
  );
}
