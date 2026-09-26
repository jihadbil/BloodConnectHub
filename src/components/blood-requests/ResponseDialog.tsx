import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BloodRequest } from "@/types/api";
import { BLOOD_TYPE_MAP } from "@/types/api";
import { useCreateDonorResponse } from "@/hooks/useDonorResponses";
import { useAuth } from "@/hooks/useAuth";
import { formatTimeAgo, mapUrgencyLevel } from "@/lib/utils";
import { useCreateDonation } from "@/hooks/useDonations";
import { useDonorByUserId } from "@/hooks/useDonors";

interface ResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: BloodRequest | null;
  onSuccess: () => void;
}

const urgencyConfig = {
  normal: { label: "عادي", variant: "secondary" as const, className: "" },
  urgent: { label: "عاجل", variant: "outline" as const, className: "border-orange-500 text-orange-600 bg-orange-50" },
  critical: { label: "طارئ", variant: "destructive" as const, className: "bg-destructive text-white" },
};

export function ResponseDialog({ open, onOpenChange, request, onSuccess }: ResponseDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [responseId, setResponseId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");

  const { user } = useAuth();
  const createDonorResponse = useCreateDonorResponse();

  // جلب بيانات المتبرع لاستخراج bloodTypeID — يشارك Cache مع DonorDashboard
  const { data: donorData } = useDonorByUserId(user?.id || "");
  const donorBloodTypeID =
    (donorData?.data as any)?.bloodTypeID ||
    (donorData?.data as any)?.bloodTypeId;

  const createDonation = useCreateDonation();

  const handleConfirm = async () => {
    if (!request) return;

    const donorId = (user as any)?.donorID || (user as any)?.donorId;
    if (!donorId) {
      setError('لم يتم العثور على معلومات المتبرع. يرجى تسجيل الخروج والدخول مرة أخرى.');
      return;
    }

    const requestId = request.requestId || (request as any).requestID || (request as any).id;
    if (!requestId) {
      setError('معرف الطلب غير صحيح.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createDonorResponse.mutateAsync({
        donorId,
        requestId,
        notes: notes.trim() || undefined,
      });

      if (result.success && result.data) {
        setResponseId(result.data.responseId);

        // ─── إنشاء سجل تبرع تلقائي بحالة قيد الفحص ───
        // POST /api/Donations — الـ Backend يُعيّن testResult = Pending (1) تلقائياً
        if (donorBloodTypeID && donorId) {
          try {
            const patientStr = request.patientName || request.patient?.fullName;
            await createDonation.mutateAsync({
              donorID: donorId,
              bloodTypeID: donorBloodTypeID,
              donationDate: new Date().toISOString(),
              quantity: 1,
              notes: `استجابة لطلب الدم #${requestId}${patientStr ? ` - للمريض: ${patientStr}` : ''}`,
            });
          } catch {
            // فشل إنشاء سجل التبرع لا يوقف العملية الأصلية
            // رسالة النجاح تُعرض للمستخدم بشكل طبيعي
            console.warn("[ResponseDialog] تعذّر إنشاء سجل التبرع التلقائي");
          }
        }
        // ─── نهاية الإضافة ───

        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          setResponseId(null);
          setNotes('');
          onOpenChange(false);
          onSuccess();
        }, 3000);
      } else {
        setError(result.message || 'حدث خطأ أثناء تسجيل الاستجابة');
      }
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      setShowSuccess(false);
      setResponseId(null);
      setNotes('');
      onOpenChange(false);
    }
  };

  if (!request) return null;

  const bloodTypeId = (request as any).bloodTypeID || request.bloodTypeId || 0;
  const bloodTypeName = BLOOD_TYPE_MAP[bloodTypeId] || request.bloodType?.typeName || `فصيلة ${bloodTypeId}`;
  const urgencyMapped = mapUrgencyLevel(request.urgencyLevel);
  const urgency = urgencyConfig[urgencyMapped] || urgencyConfig.normal;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>تأكيد الاستجابة للطلب</DialogTitle>
          <DialogDescription>
            سجل اهتمامك بالتبرع لمساعدة المريض، وسيتواصل معك المستشفى لتأكيد الموعد.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Success Message */}
          {showSuccess && responseId && (
            <Alert className="bg-green-50 border-green-500">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 font-bold">تم تسجيل اهتمامك بالتبرع بنجاح!</AlertTitle>
              <AlertDescription className="text-green-700 mt-2">
                <p className="mb-2">شكراً لك على مبادرتك الإنسانية. رقم الاستجابة المرجعي: <strong>#{responseId}</strong></p>
                <p className="text-sm font-semibold">الخطوات التالية:</p>
                <ul className="text-sm list-disc list-inside mr-4 mt-1 space-y-1">
                  <li>سيتواصل معك مستشفى غريان التعليمي قريباً لتأكيد الموعد المناسب للتبرع.</li>
                  <li>ستصلك رسالة إشعار فور تأكيد المستشفى لاستجابتك.</li>
                  <li>يرجى التأكد من إحضار بطاقة الهوية عند الذهاب للتبرع.</li>
                </ul>
                <p className="text-sm mt-3 text-muted-foreground">سيتم إغلاق هذه النافذة تلقائياً...</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Request Details & Input Form - Hide when showing success */}
          {!showSuccess && (
            <>
              <div className="bg-secondary/50 p-4 rounded-lg space-y-3">
                {/* Blood Type and Quantity */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Droplet className="h-12 w-12 text-primary fill-primary" />
                    <span className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-sm">
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
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm text-muted-foreground">مستوى الاستعجال:</span>
                  <Badge variant={urgency.variant} className={urgency.className}>
                    {urgency.label}
                  </Badge>
                </div>

                {/* Patient Name / Hospital Info */}
                {request.patientName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-sm text-muted-foreground">المريض:</span>
                    <span className="font-medium text-foreground">{request.patientName}</span>
                  </div>
                )}

                {/* Description / Notes */}
                {request.notes && (
                  <div className="pt-1">
                    <span className="text-sm text-muted-foreground">القسم/الوصف:</span>
                    <p className="text-sm text-foreground mt-1 bg-white/40 p-2 rounded border border-gray-100">{request.notes}</p>
                  </div>
                )}

                {/* Hospital Info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                  <MapPin className="h-4 w-4" />
                  <span>مستشفى غريان التعليمي</span>
                </div>

                {/* Request Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>تاريخ الطلب: {formatTimeAgo(request.requestDate || (request as any).createdAt || (request as any).requestDate || new Date().toISOString())}</span>
                </div>
              </div>

              {/* Optional Notes Form */}
              <div className="space-y-2">
                <Label htmlFor="response-notes">ملاحظات (اختياري)</Label>
                <Textarea
                  id="response-notes"
                  placeholder="مثال: متاح في الفترة الصباحية، أو أي معلومات إضافية..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">{notes.length}/500</span>
                </div>
              </div>

              {/* Important Notice */}
              <Alert className="bg-blue-50/50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 font-semibold">ملاحظة هامة</AlertTitle>
                <AlertDescription className="text-blue-700 text-xs mt-1">
                  بعد تسجيل اهتمامك، سيتواصل معك فريق المستشفى لتحديد موعد التبرع المناسب. ستصلك رسالة تأكيد لاحقاً.
                </AlertDescription>
              </Alert>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>خطأ</AlertTitle>
                  <AlertDescription className="mt-1">
                    <p>{error}</p>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>

        {/* Footer Actions - Hide when showing success */}
        {!showSuccess && (
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري التسجيل...
                </>
              ) : (
                'أنا مهتم بالتبرع'
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
