import { Badge } from '@/components/ui/badge';
import { ResponseStatus, ResponseStatusLabels } from '@/types/donor-response';
import { cn } from '@/lib/utils';

interface ResponseStatusBadgeProps {
  status: ResponseStatus;
  className?: string;
}

/**
 * ResponseStatusBadge Component
 * Displays donor response status as a colored badge with Arabic labels
 * 
 * Color mapping:
 * - Interested (مهتم): Blue
 * - Confirmed (مؤكد): Purple
 * - Donated (تم التبرع): Green
 * - Rejected (مرفوض): Red
 * - NoShow (لم يحضر): Orange
 * - Cancelled (ملغى): Gray
 */
export function ResponseStatusBadge({ status, className }: ResponseStatusBadgeProps) {
  const getStatusColor = (status: ResponseStatus): string => {
    switch (status) {
      case ResponseStatus.Interested:
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100/80';
      case ResponseStatus.Confirmed:
        return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100/80';
      case ResponseStatus.Donated:
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100/80';
      case ResponseStatus.Rejected:
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100/80';
      case ResponseStatus.NoShow:
        return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100/80';
      case ResponseStatus.Cancelled:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100/80';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100/80';
    }
  };

  const label = ResponseStatusLabels[status] || 'غير معروف';
  const colorClasses = getStatusColor(status);

  return (
    <Badge className={cn(colorClasses, className)}>
      {label}
    </Badge>
  );
}
