# مخططات النشاط - نظرة عامة على النظام

## 1. مخطط نشاط تسجيل الدخول والمصادقة


flowchart TD
    Start([بداية]) --> InputCredentials[إدخال اسم المستخدم وكلمة المرور]
    InputCredentials --> ValidateInput{التحقق من صحة الإدخال}
    
    ValidateInput -->|بيانات غير صحيحة| ShowValidationError[عرض رسالة خطأ التحقق]
    ShowValidationError --> InputCredentials
    
    ValidateInput -->|بيانات صحيحة| SendLoginRequest[إرسال طلب تسجيل الدخول إلى API]
    SendLoginRequest --> CheckCredentials{التحقق من بيانات الاعتماد}
    
    CheckCredentials -->|بيانات خاطئة| ShowLoginError[عرض رسالة خطأ تسجيل الدخول]
    ShowLoginError --> InputCredentials
    
    CheckCredentials -->|بيانات صحيحة| GenerateToken[إنشاء رمز JWT]
    GenerateToken --> GetUserRoles[جلب أدوار المستخدم]
    GetUserRoles --> SaveToken[حفظ الرمز في LocalStorage]
    SaveToken --> CheckRole{تحديد دور المستخدم}
    
    CheckRole -->|متبرع| RedirectDonor[التوجيه إلى لوحة تحكم المتبرع]
    CheckRole -->|موظف| RedirectStaff[التوجيه إلى لوحة تحكم الموظف]
    CheckRole -->|مدير| RedirectAdmin[التوجيه إلى لوحة تحكم المدير]
    
    RedirectDonor --> End([نهاية])
    RedirectStaff --> End
    RedirectAdmin --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowValidationError fill:#FFE4B5
    style ShowLoginError fill:#FFE4B5
```

## 2. مخطط نشاط إنشاء طلب دم جديد

```mermaid
flowchart TD
    Start([بداية]) --> CheckAuth{التحقق من تسجيل الدخول}
    CheckAuth -->|غير مسجل| RedirectLogin[التوجيه إلى صفحة تسجيل الدخول]
    RedirectLogin --> End([نهاية])
    
    CheckAuth -->|مسجل| CheckRole{التحقق من الصلاحيات}
    CheckRole -->|غير مصرح| ShowAccessDenied[عرض رسالة عدم الصلاحية]
    ShowAccessDenied --> End
    
    CheckRole -->|موظف/مدير| SelectPatient[اختيار المريض]
    SelectPatient --> SearchPatient{البحث عن مريض}
    
    SearchPatient -->|مريض موجود| LoadPatientData[تحميل بيانات المريض]
    SearchPatient -->|مريض جديد| CreatePatient[إنشاء سجل مريض جديد]
    CreatePatient --> LoadPatientData
    
    LoadPatientData --> FillRequestForm[ملء نموذج طلب الدم]
    FillRequestForm --> SelectBloodType[اختيار فصيلة الدم]
    SelectBloodType --> EnterQuantity[إدخال الكمية المطلوبة]
    EnterQuantity --> SelectUrgency[تحديد مستوى الاستعجال]
    SelectUrgency --> SetRequiredDate[تحديد التاريخ المطلوب]
    SetRequiredDate --> AddNotes[إضافة ملاحظات اختيارية]
    
    AddNotes --> ValidateForm{التحقق من صحة البيانات}
    ValidateForm -->|بيانات غير صحيحة| ShowFormError[عرض أخطاء النموذج]
    ShowFormError --> FillRequestForm
    
    ValidateForm -->|بيانات صحيحة| SubmitRequest[إرسال الطلب إلى API]
    SubmitRequest --> SaveToDatabase[(حفظ في قاعدة البيانات)]
    SaveToDatabase --> CheckUrgency{فحص مستوى الاستعجال}
    
    CheckUrgency -->|عادي| NotifyEligibleDonors[إشعار المتبرعين المؤهلين]
    CheckUrgency -->|عاجل| NotifyAllDonors[إشعار جميع المتبرعين المطابقين]
    CheckUrgency -->|طارئ| SendEmergencyAlert[إرسال تنبيه طوارئ فوري]
    
    NotifyEligibleDonors --> ShowSuccess[عرض رسالة نجاح]
    NotifyAllDonors --> ShowSuccess
    SendEmergencyAlert --> ShowSuccess
    
    ShowSuccess --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowAccessDenied fill:#FFE4B5
    style ShowFormError fill:#FFE4B5
    style SaveToDatabase fill:#87CEEB
    style SendEmergencyAlert fill:#FF6B6B
```


## 3. مخطط نشاط تسجيل تبرع جديد

```mermaid
flowchart TD
    Start([بداية]) --> CheckAuth{التحقق من تسجيل الدخول}
    CheckAuth -->|غير مسجل| RedirectLogin[التوجيه إلى تسجيل الدخول]
    RedirectLogin --> End([نهاية])
    
    CheckAuth -->|مسجل| CheckRole{التحقق من الصلاحيات}
    CheckRole -->|غير مصرح| ShowAccessDenied[عرض رسالة عدم الصلاحية]
    ShowAccessDenied --> End
    
    CheckRole -->|موظف/مدير| SearchDonor[البحث عن المتبرع]
    SearchDonor --> DonorFound{هل المتبرع موجود؟}
    
    DonorFound -->|لا| ShowDonorNotFound[عرض رسالة: المتبرع غير موجود]
    ShowDonorNotFound --> SearchDonor
    
    DonorFound -->|نعم| LoadDonorData[تحميل بيانات المتبرع]
    LoadDonorData --> CheckEligibility{فحص أهلية المتبرع}
    
    CheckEligibility -->|غير مؤهل| ShowIneligible[عرض سبب عدم الأهلية]
    ShowIneligible --> End
    
    CheckEligibility -->|مؤهل| FillDonationForm[ملء نموذج التبرع]
    FillDonationForm --> EnterQuantity[إدخال كمية الدم]
    EnterQuantity --> SelectDate[اختيار تاريخ التبرع]
    SelectDate --> AddNotes[إضافة ملاحظات]
    
    AddNotes --> ValidateForm{التحقق من صحة البيانات}
    ValidateForm -->|بيانات غير صحيحة| ShowFormError[عرض أخطاء النموذج]
    ShowFormError --> FillDonationForm
    
    ValidateForm -->|بيانات صحيحة| SubmitDonation[إرسال بيانات التبرع]
    SubmitDonation --> SaveDonation[(حفظ التبرع في قاعدة البيانات)]
    SaveDonation --> UpdateDonorLastDate[تحديث تاريخ آخر تبرع للمتبرع]
    UpdateDonorLastDate --> ScheduleLabTest[جدولة الفحص المخبري]
    ScheduleLabTest --> NotifyDonor[إرسال إشعار للمتبرع]
    NotifyDonor --> ShowSuccess[عرض رسالة نجاح]
    ShowSuccess --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowAccessDenied fill:#FFE4B5
    style ShowDonorNotFound fill:#FFE4B5
    style ShowIneligible fill:#FFE4B5
    style ShowFormError fill:#FFE4B5
    style SaveDonation fill:#87CEEB
```

## 4. مخطط نشاط إجراء فحص مخبري وتحديث المخزون

```mermaid
flowchart TD
    Start([بداية]) --> SelectDonation[اختيار التبرع للفحص]
    SelectDonation --> LoadDonationData[تحميل بيانات التبرع]
    LoadDonationData --> CheckTestStatus{فحص حالة الاختبار}
    
    CheckTestStatus -->|تم الفحص مسبقاً| ShowAlreadyTested[عرض: تم الفحص مسبقاً]
    ShowAlreadyTested --> End([نهاية])
    
    CheckTestStatus -->|لم يتم الفحص| PerformLabTest[إجراء الفحوصات المخبرية]
    PerformLabTest --> EnterTestResults[إدخال نتائج الفحص]
    EnterTestResults --> UploadLabReport[رفع التقرير المخبري PDF]
    UploadLabReport --> SelectTestResult{اختيار نتيجة الفحص}
    
    SelectTestResult -->|مرفوض| MarkAsRejected[تحديد كمرفوض]
    MarkAsRejected --> AddRejectionReason[إضافة سبب الرفض]
    AddRejectionReason --> SaveRejectedTest[(حفظ النتيجة)]
    SaveRejectedTest --> NotifyDonorRejected[إشعار المتبرع بالرفض]
    NotifyDonorRejected --> End
    
    SelectTestResult -->|مقبول| MarkAsApproved[تحديد كمقبول]
    MarkAsApproved --> AddToInventory{إضافة للمخزون؟}
    
    AddToInventory -->|لا| SaveApprovedTest[(حفظ النتيجة فقط)]
    SaveApprovedTest --> NotifyDonorApproved[إشعار المتبرع بالقبول]
    NotifyDonorApproved --> End
    
    AddToInventory -->|نعم| CreateBloodUnit[إنشاء وحدة دم جديدة]
    CreateBloodUnit --> SetExpiryDate[تعيين تاريخ الانتهاء 42 يوم]
    SetExpiryDate --> UpdateInventoryQuantity[تحديث كمية المخزون]
    UpdateInventoryQuantity --> SaveToInventory[(حفظ في المخزون)]
    SaveToInventory --> CheckLowStock{فحص المخزون المنخفض}
    
    CheckLowStock -->|مخزون منخفض| SendLowStockAlert[إرسال تنبيه مخزون منخفض]
    CheckLowStock -->|مخزون كافي| NotifySuccess[إشعار بالنجاح]
    SendLowStockAlert --> NotifySuccess
    
    NotifySuccess --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowAlreadyTested fill:#FFE4B5
    style SaveRejectedTest fill:#87CEEB
    style SaveApprovedTest fill:#87CEEB
    style SaveToInventory fill:#87CEEB
    style SendLowStockAlert fill:#FFA500
```


## 5. مخطط نشاط تنفيذ طلب دم

```mermaid
flowchart TD
    Start([بداية]) --> SelectRequest[اختيار طلب الدم]
    SelectRequest --> LoadRequestData[تحميل بيانات الطلب]
    LoadRequestData --> CheckRequestStatus{فحص حالة الطلب}
    
    CheckRequestStatus -->|منفذ/ملغى| ShowCannotFulfill[عرض: لا يمكن تنفيذ الطلب]
    ShowCannotFulfill --> End([نهاية])
    
    CheckRequestStatus -->|معلق| CheckInventory{فحص توفر المخزون}
    CheckInventory -->|غير متوفر| ShowInsufficientStock[عرض: مخزون غير كافي]
    ShowInsufficientStock --> End
    
    CheckInventory -->|متوفر| SelectDonation[اختيار التبرع المناسب]
    SelectDonation --> CheckDonationStatus{فحص حالة التبرع}
    
    CheckDonationStatus -->|غير مقبول| ShowInvalidDonation[عرض: تبرع غير صالح]
    ShowInvalidDonation --> SelectDonation
    
    CheckDonationStatus -->|مقبول| EnterQuantity[إدخال الكمية المستخدمة]
    EnterQuantity --> ValidateQuantity{التحقق من الكمية}
    
    ValidateQuantity -->|كمية غير صحيحة| ShowQuantityError[عرض: كمية غير صحيحة]
    ShowQuantityError --> EnterQuantity
    
    ValidateQuantity -->|كمية صحيحة| CreateFulfillment[إنشاء سجل تنفيذ]
    CreateFulfillment --> UpdateInventory[تحديث المخزون - خصم الكمية]
    UpdateInventory --> UpdateBloodUnitStatus[تحديث حالة وحدة الدم إلى مستخدمة]
    UpdateBloodUnitStatus --> CheckFullyFulfilled{هل تم تنفيذ الطلب كاملاً؟}
    
    CheckFullyFulfilled -->|نعم| UpdateRequestStatusFulfilled[تحديث حالة الطلب: منفذ]
    CheckFullyFulfilled -->|لا| UpdateRequestStatusPartial[تحديث حالة الطلب: منفذ جزئياً]
    
    UpdateRequestStatusFulfilled --> SaveFulfillment[(حفظ التنفيذ)]
    UpdateRequestStatusPartial --> SaveFulfillment
    
    SaveFulfillment --> NotifyStaff[إشعار الموظفين]
    NotifyStaff --> GenerateReport[إنشاء تقرير التنفيذ]
    GenerateReport --> ShowSuccess[عرض رسالة نجاح]
    ShowSuccess --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowCannotFulfill fill:#FFE4B5
    style ShowInsufficientStock fill:#FFE4B5
    style ShowInvalidDonation fill:#FFE4B5
    style ShowQuantityError fill:#FFE4B5
    style SaveFulfillment fill:#87CEEB
```

## 6. مخطط نشاط إزالة الوحدات المنتهية تلقائياً (عملية النظام)

```mermaid
flowchart TD
    Start([بداية - مهمة مجدولة يومياً]) --> GetCurrentDate[الحصول على التاريخ الحالي]
    GetCurrentDate --> QueryExpiredUnits[الاستعلام عن الوحدات المنتهية]
    QueryExpiredUnits --> CheckExpiredUnits{هل توجد وحدات منتهية؟}
    
    CheckExpiredUnits -->|لا| LogNoExpired[تسجيل: لا توجد وحدات منتهية]
    LogNoExpired --> End([نهاية])
    
    CheckExpiredUnits -->|نعم| LoopUnits[حلقة: لكل وحدة منتهية]
    LoopUnits --> CheckUnitStatus{فحص حالة الوحدة}
    
    CheckUnitStatus -->|مستخدمة/محجوزة| SkipUnit[تخطي الوحدة]
    SkipUnit --> MoreUnits{المزيد من الوحدات؟}
    
    CheckUnitStatus -->|متاحة| MarkAsExpired[تحديد الحالة: منتهية]
    MarkAsExpired --> UpdateInventoryQuantity[تحديث كمية المخزون - خصم]
    UpdateInventoryQuantity --> LogExpiredUnit[تسجيل الوحدة المنتهية]
    LogExpiredUnit --> MoreUnits
    
    MoreUnits -->|نعم| LoopUnits
    MoreUnits -->|لا| GenerateReport[إنشاء تقرير الوحدات المنتهية]
    GenerateReport --> CheckCriticalStock{فحص المخزون الحرج}
    
    CheckCriticalStock -->|مخزون حرج| SendCriticalAlert[إرسال تنبيه حرج للمدير]
    CheckCriticalStock -->|مخزون عادي| SendSummaryEmail[إرسال ملخص بالبريد]
    
    SendCriticalAlert --> UpdateSystemLogs[تحديث سجلات النظام]
    SendSummaryEmail --> UpdateSystemLogs
    UpdateSystemLogs --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style SendCriticalAlert fill:#FF6B6B
    style LogExpiredUnit fill:#87CEEB
    style UpdateSystemLogs fill:#87CEEB


## 📝 ملاحظات عامة

### 🎨 دليل الألوان
- 🟢 **أخضر فاتح:** نقطة البداية
- 🔴 **وردي فاتح:** نقطة النهاية
- 🟡 **برتقالي فاتح:** رسائل الخطأ والتحذيرات
- 🔵 **أزرق فاتح:** عمليات قاعدة البيانات
- 🔴 **أحمر:** تنبيهات الطوارئ
- 🟠 **برتقالي:** تنبيهات المخزون

### 🔄 العمليات التلقائية
- إزالة الوحدات المنتهية: تعمل يومياً في منتصف الليل
- فحص المخزون المنخفض: يعمل كل 6 ساعات
- إرسال الإشعارات: فوري عند حدوث الأحداث

### 🔐 التحقق من الصلاحيات
جميع العمليات تتطلب:
1. التحقق من تسجيل الدخول
2. التحقق من صلاحيات الدور
3. التحقق من صلاحية الرمز (JWT)

