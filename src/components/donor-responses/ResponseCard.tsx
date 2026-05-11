import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponseStatusBadge } from './ResponseStatusBadge';
import { DonorResponse, ResponseStatus } from '@/types/donor-response';
import { Phone, User, Droplet, Calendar, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponseCardProps {
  response: DonorResponse;
  onStatusChange?: (id: number, newStatus: ResponseStatus) => void;
  onCancel?: (id: number, reason: string) => void;
  showActions?: boolean;
}

/**
 * ResponseCard Component
 * Displays a single donor response with all details
 * 
 * Features:
 * - Shows donor information (name, phone, blood type)
 * - Shows request information (patient name, urgency level)
 * - Displays ResponseStatusBadge
 * - Shows notes and rejection reason if present
 * - Displays timestamps in local format
 * - Supports action buttons (update status, cancel) if showActions=true
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 5.1, 10.5**
 */
export function ResponseCard({ 
  response, 
  onStatusChange, 
  onCancel, 
  showActions = false 
}: ResponseCardProps) {
  // Format date to local Arabic format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get urgency level badge color
  const getUrgencyColor = (level: string): string => {
    switch (level) {
      case 'Emergency':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Urgent':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Normal':
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  // Get urgency level Arabic label
  const getUrgencyLabel = (level: string): string => {
    switch (level) {
      case 'Emergency':
        return 'طارئ';
      case 'Urgent':
        return 'عاجل';
      case 'Normal':
      default:
        return 'عادي';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg">{response.donorName}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span dir="ltr">{response.donorPhone}</span>
            </div>
          </div>
          <ResponseStatusBadge status={response.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Donor Blood Type */}
        <div className="flex items-center gap-2 text-sm">
          <Droplet className="h-4 w-4 text-red-500" />
          <span className="text-muted-foreground">فصيلة الدم:</span>
          <span className="font-semibold">{response.bloodTypeName}</span>
        </div>

        {/* Patient Information */}
        <div className="border-t pt-3 space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">اسم المريض: </span>
            <span className="font-medium">{response.patientName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">درجة الاستعجال:</span>
            <span className={cn(
              'text-xs font-semibold px-2 py-1 rounded-md border',
              getUrgencyColor(response.urgencyLevel)
            )}>
              {getUrgencyLabel(response.urgencyLevel)}
            </span>
          </div>
        </div>

        {/* Notes */}
        {response.notes && (
          <div className="border-t pt-3">
            <div className="flex items-start gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <span className="text-muted-foreground">ملاحظات: </span>
                <p className="text-foreground mt-1">{response.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Reason */}
        {response.rejectionReason && (
          <div className="border-t pt-3">
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
              <div>
                <span className="text-muted-foreground">سبب الرفض/الإلغاء: </span>
                <p className="text-foreground mt-1">{response.rejectionReason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="border-t pt-3 space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>تاريخ الاستجابة: {formatDate(response.responseDate)}</span>
          </div>
          {response.confirmedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>تاريخ التأكيد: {formatDate(response.confirmedAt)}</span>
            </div>
          )}
          {response.updatedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>آخر تحديث: {formatDate(response.updatedAt)}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Action Buttons */}
      {showActions && (
        <CardFooter className="flex gap-2 pt-3 border-t">
          {response.status === ResponseStatus.Interested && (
            <>
              <Button
                size="sm"
                onClick={() => onStatusChange?.(response.responseId, ResponseStatus.Confirmed)}
              >
                تأكيد
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange?.(response.responseId, ResponseStatus.Rejected)}
              >
                رفض
              </Button>
            </>
          )}
          
          {response.status === ResponseStatus.Confirmed && (
            <>
              <Button
                size="sm"
                variant="success"
                onClick={() => onStatusChange?.(response.responseId, ResponseStatus.Donated)}
              >
                تم التبرع
              </Button>
              <Button
                size="sm"
                variant="warning"
                onClick={() => onStatusChange?.(response.responseId, ResponseStatus.NoShow)}
              >
                لم يحضر
              </Button>
            </>
          )}

          {response.status === ResponseStatus.NoShow && (
            <Button
              size="sm"
              onClick={() => onStatusChange?.(response.responseId, ResponseStatus.Confirmed)}
            >
              إعادة التأكيد
            </Button>
          )}

          {/* Cancel button - available for non-terminal states */}
          {response.status !== ResponseStatus.Donated && 
           response.status !== ResponseStatus.Cancelled && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                const reason = prompt('يرجى إدخال سبب الإلغاء:');
                if (reason && reason.trim()) {
                  onCancel?.(response.responseId, reason.trim());
                }
              }}
            >
              إلغاء
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
