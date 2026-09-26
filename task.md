# 📋 قائمة مهام تنفيذ تحديث مربع حوار "إجراء الفحص"

## الملفات المستهدفة
- `src/pages/DonationsManagement.tsx` — الملف الرئيسي (معظم التعديلات)
- `src/api/donorResponses.ts` — التحقق من صحة استدعاء updateStatus
- `src/hooks/useDonorResponses.ts` — التحقق من hook التحديث

---

## المرحلة 1 — الإعداد والـ Imports

- [x] **1.1** فتح `DonationsManagement.tsx` ومراجعة الـ imports الحالية
- [x] **1.2** إضافة import لـ `useUpdateResponseStatus` من `@/hooks/useDonorResponses`
- [x] **1.3** إضافة import لـ `useUpdateBloodRequestStatus` من `@/hooks/useBloodRequests`
- [x] **1.4** إضافة import لـ `donorResponsesApi` من `@/api/donorResponses` (للاستخدام المباشر)
- [x] **1.5** إضافة import لـ `bloodRequestsApi` من `@/api/bloodRequests` (لجلب تفاصيل الطلب)
- [x] **1.6** إضافة import لـ `ResponseStatus` من `@/types/donor-response`

---

## المرحلة 2 — إضافة State وRefs جديدة

- [x] **2.1** إضافة `selectedDonationInfo` state لتخزين بيانات التبرع المختار:
  ```typescript
  const [selectedDonationInfo, setSelectedDonationInfo] = useState<{
    id: number;
    donorId: number;
    bloodTypeId: number;
    quantity: number;
  } | null>(null);
  ```
- [x] **2.2** إضافة `labTestFile` state لملف تقرير المختبر في الحوار:
  ```typescript
  const [labTestFile, setLabTestFile] = useState<File | null>(null);
  ```
- [x] **2.3** إضافة `labTestFileInputRef` باستخدام `useRef<HTMLInputElement>(null)` للتحكم في حقل رفع الملف

---

## المرحلة 3 — تهيئة الـ Hooks الجديدة

- [x] **3.1** تهيئة `updateResponseStatus = useUpdateResponseStatus()` داخل المكون
- [x] **3.2** تهيئة `updateBloodRequestStatus = useUpdateBloodRequestStatus()` داخل المكون

---

## المرحلة 4 — تحديث منطق فتح مربع الحوار

- [x] **4.1** تعديل `onClick` لزر "إجراء فحص" في الجدول ليحفظ بيانات التبرع الكاملة:
  ```typescript
  onClick={() => {
    setSelectedDonationForLabTest(donation.id);
    setSelectedDonationInfo({
      id: donation.id,
      donorId: donation.donorId,
      bloodTypeId: donation.bloodTypeId,
      quantity: donation.quantity,
    });
    setIsLabTestDialogOpen(true);
  }}
  ```

---

## المرحلة 5 — تحديث دالة `handlePerformLabTest`

- [x] **5.1** إضافة التحقق من الملف في بداية الدالة:
  ```typescript
  if (labTestForm.testResult === 'Accepted' && !labTestFile) {
    toast({
      title: 'ملف مطلوب',
      description: 'يجب إرفاق تقرير المختبر قبل قبول العينة',
      variant: 'destructive'
    });
    return;
  }
  ```

- [x] **5.2** إبقاء استدعاء `performLabTest.mutateAsync()` كما هو (الخطوة 1)

- [x] **5.3** إضافة منطق رفع ملف التقرير بعد نجاح الفحص:
  ```typescript
  if (labResult.isSuccess && labTestFile && selectedDonationInfo) {
    await uploadDocument.mutateAsync({
      donorId: selectedDonationInfo.donorId,
      documentType: 'LabReport',
      file: labTestFile,
    });
  }
  ```

- [x] **5.4** إضافة منطق جلب استجابات المتبرع وتحديث `DonorRequestResponses`:
  ```typescript
  if (labResult.isSuccess && selectedDonationInfo) {
    const responsesResult = await donorResponsesApi.getByDonorId(
      selectedDonationInfo.donorId
    );
    if (responsesResult.isSuccess && responsesResult.data) {
      const confirmedResponse = responsesResult.data.find(
        r => r.status === ResponseStatus.Confirmed
      );
      if (confirmedResponse) {
        const newStatus = labTestForm.testResult === 'Accepted'
          ? ResponseStatus.Donated   // 3
          : ResponseStatus.Rejected; // 4

        await updateResponseStatus.mutateAsync({
          id: confirmedResponse.responseId,
          data: {
            status: newStatus,
            notes: labTestForm.testNotes || undefined,
            donationId: labTestForm.testResult === 'Accepted'
              ? selectedDonationForLabTest!
              : undefined,
          }
        });
      }
    }
  }
  ```

- [x] **5.5** إضافة منطق إقفال الطلب عند اكتمال الوحدات (عند الموافقة فقط):
  ```typescript
  if (
    labResult.isSuccess &&
    labTestForm.testResult === 'Accepted' &&
    selectedDonationInfo &&
    confirmedResponse?.requestId
  ) {
    const requestResult = await bloodRequestsApi.getById(confirmedResponse.requestId);
    if (requestResult.isSuccess && requestResult.data) {
      const req = requestResult.data as any;
      const alreadyFulfilled = req.quantityFulfilled ?? 0;
      const totalFulfilled = alreadyFulfilled + selectedDonationInfo.quantity;
      const needed = req.quantityNeeded ?? 0;

      if (totalFulfilled >= needed) {
        await updateBloodRequestStatus.mutateAsync({
          id: confirmedResponse.requestId,
          status: 2 as any, // RequestStatus.Fulfilled
          notes: 'تم تلبية جميع الوحدات المطلوبة',
        });
      }
    }
  }
  ```

- [x] **5.6** تحديث كتلة `finally` / إعادة التعيين لتشمل المتغيرات الجديدة:
  ```typescript
  setLabTestFile(null);
  if (labTestFileInputRef.current) labTestFileInputRef.current.value = '';
  setSelectedDonationInfo(null);
  ```

---

## المرحلة 6 — تحديث JSX لمربع الحوار

- [x] **6.1** إضافة قسم رفع ملف تقرير المختبر قبل خيار "إضافة للمخزون":
  ```tsx
  {/* قسم رفع تقرير المختبر — إلزامي عند مقبول */}
  {labTestForm.testResult === 'Accepted' && (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
      <p className="text-xs text-amber-700 font-semibold flex items-center gap-1">
        <AlertCircle className="h-3.5 w-3.5" />
        يجب إرفاق تقرير المختبر قبل قبول العينة
      </p>
      <Label className="text-xs flex items-center gap-1">
        <Upload className="h-3.5 w-3.5" />
        تقرير المختبر <span className="text-destructive">*</span>
      </Label>
      <input
        ref={labTestFileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="block w-full text-xs text-muted-foreground
          file:mr-3 file:py-1.5 file:px-3
          file:rounded file:border-0
          file:text-xs file:font-medium
          file:bg-primary file:text-primary-foreground
          hover:file:bg-primary/90 cursor-pointer"
        onChange={(e) => setLabTestFile(e.target.files?.[0] || null)}
      />
      {labTestFile && (
        <p className="text-xs text-green-700 flex items-center gap-1">
          <FileCheck className="h-3.5 w-3.5" />
          {labTestFile.name}
        </p>
      )}
    </div>
  )}
  ```

- [x] **6.2** تحديث شرط تعطيل زر "حفظ نتيجة الفحص" ليشمل حالة الملف الإلزامي:
  ```tsx
  disabled={
    performLabTest.isPending ||
    uploadDocument.isPending ||
    updateResponseStatus.isPending ||
    updateBloodRequestStatus.isPending ||
    (labTestForm.testResult === 'Accepted' && !labTestFile)
  }
  ```

- [x] **6.3** تحديث نص زر الحفظ ليعكس حالات التحميل الجديدة:
  ```tsx
  {performLabTest.isPending
    ? 'جاري تسجيل الفحص...'
    : uploadDocument.isPending
    ? 'جاري رفع التقرير...'
    : updateResponseStatus.isPending
    ? 'جاري تحديث الاستجابة...'
    : updateBloodRequestStatus.isPending
    ? 'جاري تحديث الطلب...'
    : 'حفظ نتيجة الفحص'}
  ```

- [x] **6.4** إضافة نص تلميحي أسفل مربع اختيار النتيجة:
  ```tsx
  <p className="text-xs text-muted-foreground">
    {labTestForm.testResult === 'Accepted'
      ? '⚠️ يتطلب رفع تقرير المختبر'
      : 'لا يتطلب ملفاً مرفقاً'}
  </p>
  ```

- [x] **6.5** إضافة معالجة لإعادة تعيين الملف عند إغلاق الحوار (في `onOpenChange`):
  ```tsx
  onOpenChange={(open) => {
    setIsLabTestDialogOpen(open);
    if (!open) {
      setLabTestFile(null);
      if (labTestFileInputRef.current) labTestFileInputRef.current.value = '';
      setSelectedDonationForLabTest(null);
      setSelectedDonationInfo(null);
    }
  }}
  ```

---

## المرحلة 7 — التحقق من النوع في `UpdateResponseStatusRequest`

- [x] **7.1** التحقق من أن `UpdateResponseStatusRequest` في `src/types/donor-response.ts` يحتوي على `donationId` (وليس `donationID`):
  ```typescript
  export interface UpdateResponseStatusRequest {
    status: ResponseStatus;
    notes?: string;
    donationId?: number; // ← تحقق من هذا الاسم
  }
  ```
- [x] **7.2** التحقق من `donorResponsesApi.updateStatus()` في `src/api/donorResponses.ts` — التأكد أنه يرسل `donationID` (بالأحرف الكبيرة) للـ API إذا كان الـ DTO يتوقع `donationID`:
  ```typescript
  // في donorResponses.ts عند بناء body الطلب
  const body = {
    status: data.status,
    notes: data.notes,
    donationID: data.donationId, // تحويل من camelCase إلى PascalCase
  };
  ```

---

## المرحلة 8 — التحقق النهائي

- [x] **8.1** التأكد من عدم وجود أخطاء TypeScript في `DonationsManagement.tsx` (تشغيل `tsc --noEmit`)
- [x] **8.2** اختبار السيناريو: قبول عينة بدون ملف → يجب أن يظهر خطأ
- [x] **8.3** اختبار السيناريو: قبول عينة مع ملف → يجب أن تتحدث جميع البيانات
- [x] **8.4** اختبار السيناريو: رفض عينة بدون ملف → يجب أن ينجح
- [x] **8.5** اختبار السيناريو: اكتمال وحدات الطلب → يجب أن يُغلق الطلب
- [x] **8.6** التحقق من تحديث البيانات في الجدول بعد إغلاق الحوار (refetch تلقائي)

---

## ملاحظات التنفيذ

> ترتيب التنفيذ المقترح:
> `المرحلة 1` → `المرحلة 2` → `المرحلة 3` → `المرحلة 4` → `المرحلة 5` → `المرحلة 6` → `المرحلة 7` → `المرحلة 8`

> الملف الرئيسي الوحيد الذي يحتاج لتعديلات جوهرية هو `DonationsManagement.tsx`.
> الملفات الأخرى (`donorResponses.ts`, `useBloodRequests.ts`) قد تحتاج تعديلات طفيفة فقط للتوافق مع `donationID` vs `donationId`.
