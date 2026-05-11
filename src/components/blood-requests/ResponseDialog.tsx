import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Droplet, MapPin, AlertCircle, Loader2, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BloodRequest, BloodRequestDetails } from "@/types/api";
import { BLOOD_TYPE_MAP } from "@/types/api";
import { useBloodRequestResponse } from "@/hooks/useBloodRequestResponse";
import { bloodRequestsApi } from "@/api/bloodRequests";
import { formatTimeAgo } from "@/lib/utils";

interface ResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: BloodRequest | null;
  onSuccess: () => void;
}

const urgencyConfig = {
  Normal: { label: "عادي", variant: "secondary" as const, className: "" },
  Urgent: { label: "عاجل", variant: "outline" as const, className: "border-orange-500 text-orange-600 bg-orange-50" },
  Emergency: { label: "حرج", variant: "destructive" as const, className: "bg-destructive text-white" },
};

/**
 * Get appropriate action for error type
 * Implements requirements 8.4, 8.5, 8.6, 10.1, 10.5
 */
const getErrorAction = (errorType: 'auth' | 'compatibility' | 'eligibility' | 'api' | 'unknown'): {
  action: 'retry' | 'dismiss' | 'contact';
  actionLabel: string;
} => {
  switch (errorType) {
    case 'auth':
      return { action: 'dismiss', actionLabel: 'حسناً' };
    case 'compatibility':
    case 'eligibility':
      return { action: 'dismiss', actionLabel: 'فهمت' };
    case 'api':
      return { action: 'retry', actionLabel: 'إعادة المحاولة' };
    case 'unknown':
    default:
      return { action: 'contact', actionLabel: 'حسناً' };
  }
};

export function ResponseDialog({ open, onOpenChange, request, onSuccess }: ResponseDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'auth' | 'compatibility' | 'eligibility' | 'api' | 'unknown'>('unknown');
  const [showSuccess, setShowSuccess] = useState(false);
  const [donationId, setDonationId] = useState<number | null>(null);
  const [requestDetails, setRequestDetails] = useState<BloodRequestDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const { respondToRequest } = useBloodRequestResponse();

  // جلب تفاصيل الطلب الكاملة عند فتح الحوار
  useEffect(() => {
    if (open && request) {
      setIsLoadingDetails(true);
      setError(null);
      
      bloodRequestsApi.getDetails(request.requestId)
        .then(response => {
          if (response.success && response.data) {
            console.log("Request details loaded:", response.data);
            setRequestDetails(response.data);
          } else {
            console.error("Failed to load request details:", response.message);
            setError('فشل في تحميل تفاصيل الطلب');
          }
        })
        .catch(err => {
          console.error("Error loading request details:", err);
          setError('حدث خطأ أثناء تحميل تفاصيل الطلب');
        })
        .finally(() => {
          setIsLoadingDetails(false);
        });
    } else {
      setRequestDetails(null);
    }
  }, [open, request]);

  const handleConfirm = async () => {
    if (!requestDetails) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // استخدام bloodType.bloodTypeID من التفاصيل الكاملة
      const bloodTypeId = requestDetails.bloodType?.bloodTypeID || (requestDetails.bloodType as any)?.bloodTypeId || 0;
      
      console.log("Request details:", requestDetails);
      console.log("requestDetails.bloodType:", requestDetails.bloodType);
      console.log("Extracted bloodTypeId:", bloodTypeId);
      
      if (!bloodTypeId || bloodTypeId === 0) {
        setError('فشل في تحديد فصيلة الدم المطلوبة. يرجى المحاولة مرة أخرى.');
        setIsSubmitting(false);
        return;
      }
      
      const result = await respondToRequest(
        requestDetails.requestID || requestDetails.requestId,
        bloodTypeId,
        requestDetails.quantityNeeded
      );

      if (result.success) {
        // Display success message with donation ID
        setDonationId(result.donationId || null);
        setShowSuccess(true);
        
        // Auto-close dialog after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setDonationId(null);
          onOpenChange(false);
          // Call onSuccess callback to refresh list
          onSuccess();
        }, 3000);
      } else {
        // Set error with type information for enhanced display
        setError(result.error || 'حدث خطأ أثناء معالجة الطلب');
        setErrorType(result.errorType || 'unknown');
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      setErrorType('unknown');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      setErrorType('unknown');
      setShowSuccess(false);
      setDonationId(null);
      setRequestDetails(null);
      onOpenChange(false);
    }
  };

  if (!request) return null;

  // استخدام التفاصيل الكاملة إذا كانت متوفرة، وإلا استخدام request الأصلي
  const displayRequest = requestDetails || request;
  
  // استخراج bloodTypeId من التفاصيل الكاملة
  const bloodTypeId = requestDetails?.bloodType?.bloodTypeID || 
                       (requestDetails?.bloodType as any)?.bloodTypeId || 
                       (request as any).bloodTypeID || 
                       request.bloodTypeId || 
                       0;
  
  console.log("Display - requestDetails:", requestDetails);
  console.log("Display - bloodTypeId:", bloodTypeId);
  
  // استخدام BLOOD_TYPE_MAP مباشرة لأن API يُرجع bloodTypeId
  const bloodTypeName = BLOOD_TYPE_MAP[bloodTypeId] || displayRequest.bloodType?.typeName || `فصيلة ${bloodTypeId}`;
  const urgency = urgencyConfig[displayRequest.urgencyLevel] || urgencyConfig.Normal;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>تأكيد الاستجابة للطلب</DialogTitle>
          <DialogDescription>
            راجع تفاصيل الطلب أدناه وقم بتأكيد استجابتك للتبرع
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Loading State */}
          {isLoadingDetails && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="mr-3 text-muted-foreground">جاري تحميل تفاصيل الطلب...</span>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && donationId && (
            <Alert className="bg-green-50 border-green-500">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">تم تسجيل استجابتك بنجاح!</AlertTitle>
              <AlertDescription className="text-green-700">
                <p className="mb-2">شكراً لك على استجابتك السريعة. رقم التبرع المرجعي: <strong>#{donationId}</strong></p>
                <p className="text-sm">
                  <strong>الخطوات التالية:</strong>
                </p>
                <ul className="text-sm list-disc list-inside mr-4 mt-1">
                  <li>سيتم التواصل معك من قبل مستشفى غريان المركزي خلال 24 ساعة</li>
                  <li>سيتم تحديد موعد التبرع المناسب لك</li>
                  <li>يرجى التأكد من أهليتك الصحية للتبرع</li>
                </ul>
                <p className="text-sm mt-2 text-muted-foreground">سيتم إغلاق هذه النافذة تلقائياً...</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Request Details - Hide when showing success */}
          {!showSuccess && (
            <>
              <div className="bg-secondary/50 p-4 rounded-lg space-y-3">
            {/* Blood Type and Quantity */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Droplet className="h-12 w-12 text-primary fill-primary" />
                <span className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-xs">
                  {bloodTypeName}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">
                  فصيلة الدم: {bloodTypeName}
                </p>
                <p className="text-sm text-muted-foreground">
                  الكمية المطلوبة: {request.quantityNeeded} وحدة
                </p>
              </div>
            </div>

            {/* Urgency Level */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">مستوى الاستعجال:</span>
              <Badge variant={urgency.variant} className={urgency.className}>
                {urgency.label}
              </Badge>
            </div>

            {/* Department/Description */}
            {request.notes && (
              <div>
                <span className="text-sm text-muted-foreground">القسم/الوصف:</span>
                <p className="text-sm text-foreground mt-1">{request.notes}</p>
              </div>
            )}

            {/* Hospital Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
              <MapPin className="h-4 w-4" />
              <span>مستشفى غريان المركزي</span>
            </div>

            {/* Request Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>تاريخ الطلب: {formatTimeAgo(request.requestDate)}</span>
            </div>
          </div>

          {/* Important Notice */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>ملاحظة مهمة</AlertTitle>
            <AlertDescription>
              بعد تأكيد الاستجابة، سيتم التواصل معك من قبل المستشفى لتحديد موعد التبرع. يرجى التأكد من أهليتك للتبرع.
            </AlertDescription>
          </Alert>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>خطأ</AlertTitle>
              <AlertDescription>
                <p className="mb-3">{error}</p>
                {/* Display appropriate action based on error type */}
                <div className="flex gap-2 mt-2">
                  {(() => {
                    const { action, actionLabel } = getErrorAction(errorType);
                    
                    if (action === 'retry') {
                      return (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className="bg-white hover:bg-gray-50"
                          >
                            {actionLabel}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setError(null)}
                            className="bg-white hover:bg-gray-50"
                          >
                            إلغاء
                          </Button>
                        </>
                      );
                    } else if (action === 'contact') {
                      return (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setError(null)}
                            className="bg-white hover:bg-gray-50"
                          >
                            {actionLabel}
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1">
                            إذا استمرت المشكلة، يرجى التواصل مع مستشفى غريان المركزي
                          </p>
                        </>
                      );
                    } else {
                      // dismiss action
                      return (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setError(null)}
                          className="bg-white hover:bg-gray-50"
                        >
                          {actionLabel}
                        </Button>
                      );
                    }
                  })()}
                </div>
              </AlertDescription>
            </Alert>
          )}
            </>
          )}
        </div>

        {/* Footer Actions - Hide when showing success */}
        {!showSuccess && (
          <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting || isLoadingDetails}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting || isLoadingDetails || !requestDetails}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              'تأكيد الاستجابة'
            )}
          </Button>
        </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
