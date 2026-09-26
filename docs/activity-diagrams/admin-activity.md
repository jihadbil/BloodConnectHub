# مخططات النشاط - المدير

## 1. مخطط نشاط الموافقة على تسجيل متبرع


flowchart TD
    Start([بداية]) --> ViewPendingDonors[عرض المتبرعين المعلقين]
    ViewPendingDonors --> LoadPendingList[تحميل قائمة الموافقات المعلقة]
    LoadPendingList --> CheckPendingCount{هل توجد طلبات معلقة؟}
    
    CheckPendingCount -->|لا| ShowNoPending[عرض: لا توجد طلبات معلقة]
    ShowNoPending --> End([نهاية])
    
    CheckPendingCount -->|نعم| DisplayPendingList[عرض قائمة المتبرعين المعلقين]
    DisplayPendingList --> FilterOptions[خيارات التصفية: فصيلة الدم/المدينة/التاريخ]
    FilterOptions --> SelectDonor[اختيار متبرع للمراجعة]
    
    SelectDonor --> LoadDonorDetails[تحميل تفاصيل المتبرع]
    LoadDonorDetails --> DisplayPersonalInfo[عرض المعلومات الشخصية]
    DisplayPersonalInfo --> DisplayContactInfo[عرض معلومات الاتصال]
    DisplayContactInfo --> DisplayBloodType[عرض فصيلة الدم]
    DisplayBloodType --> LoadMedicalDocuments[تحميل الوثائق الطبية]
    
    LoadMedicalDocuments --> CheckDocuments{هل توجد وثائق؟}
    CheckDocuments -->|لا| ShowNoDocuments[عرض: لا توجد وثائق مرفقة]
    ShowNoDocuments --> DecisionWithoutDocs{قرار بدون وثائق؟}
    
    CheckDocuments -->|نعم| DisplayDocumentsList[عرض قائمة الوثائق]
    DisplayDocumentsList --> ReviewDocuments[مراجعة الوثائق]
    ReviewDocuments --> VerifyDocuments{التحقق من صحة الوثائق}
    
    VerifyDocuments -->|وثائق غير صالحة| MarkDocsInvalid[تحديد الوثائق كغير صالحة]
    MarkDocsInvalid --> DecisionWithInvalidDocs{القرار؟}
    
    VerifyDocuments -->|وثائق صالحة| MarkDocsValid[تحديد الوثائق كصالحة]
    MarkDocsValid --> MakeDecision{اتخاذ القرار}
    
    DecisionWithoutDocs -->|رفض| RejectDonor
    DecisionWithoutDocs -->|طلب وثائق| RequestDocuments[طلب رفع الوثائق]
    RequestDocuments --> NotifyDonorDocs[إشعار المتبرع بطلب الوثائق]
    NotifyDonorDocs --> End
    
    DecisionWithInvalidDocs -->|رفض| RejectDonor
    DecisionWithInvalidDocs -->|طلب إعادة رفع| RequestReupload[طلب إعادة رفع الوثائق]
    RequestReupload --> NotifyDonorReupload[إشعار المتبرع بإعادة الرفع]
    NotifyDonorReupload --> End
    
    MakeDecision -->|موافقة| ApproveDonor[الموافقة على المتبرع]
    MakeDecision -->|رفض| RejectDonor[رفض المتبرع]
    
    ApproveDonor --> UpdateStatusApproved[تحديث الحالة: موافق عليه]
    UpdateStatusApproved --> SetApprovalDate[تعيين تاريخ الموافقة]
    SetApprovalDate --> SaveApproval[(حفظ في قاعدة البيانات)]
    SaveApproval --> NotifyDonorApproved[إشعار المتبرع بالموافقة]
    NotifyDonorApproved --> SendWelcomeEmail[إرسال بريد ترحيبي]
    SendWelcomeEmail --> UpdateStatistics[تحديث إحصائيات المتبرعين]
    UpdateStatistics --> ShowApprovalSuccess[عرض: تمت الموافقة بنجاح]
    ShowApprovalSuccess --> End
    
    RejectDonor --> EnterRejectionReason[إدخال سبب الرفض]
    EnterRejectionReason --> ValidateReason{التحقق من السبب}
    ValidateReason -->|فارغ| ShowReasonRequired[عرض: السبب مطلوب]
    ShowReasonRequired --> EnterRejectionReason
    
    ValidateReason -->|صحيح| UpdateStatusRejected[تحديث الحالة: مرفوض]
    UpdateStatusRejected --> SaveRejection[(حفظ السبب في قاعدة البيانات)]
    SaveRejection --> NotifyDonorRejected[إشعار المتبرع بالرفض]
    NotifyDonorRejected --> LogRejection[تسجيل الرفض في سجل التدقيق]
    LogRejection --> ShowRejectionSuccess[عرض: تم الرفض]
    ShowRejectionSuccess --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowNoPending fill:#FFE4B5
    style ShowNoDocuments fill:#FFE4B5
    style ShowReasonRequired fill:#FFE4B5
    style SaveApproval fill:#87CEEB
    style SaveRejection fill:#87CEEB
```


## 2. مخطط نشاط إدارة المستخدمين والأدوار

```mermaid
flowchart TD
    Start([بداية]) --> ViewUsersPage[فتح صفحة إدارة المستخدمين]
    ViewUsersPage --> LoadUsersList[تحميل قائمة المستخدمين]
    LoadUsersList --> DisplayUsers[عرض المستخدمين مع الأدوار]
    
    DisplayUsers --> SelectAction{اختيار الإجراء}
    SelectAction -->|إضافة مستخدم| AddNewUser[إضافة مستخدم جديد]
    SelectAction -->|تعديل مستخدم| SelectUserToEdit[اختيار مستخدم للتعديل]
    SelectAction -->|حذف مستخدم| SelectUserToDelete[اختيار مستخدم للحذف]
    SelectAction -->|تعيين دور| SelectUserForRole[اختيار مستخدم لتعيين دور]
    SelectAction -->|تفعيل/تعطيل| SelectUserToToggle[اختيار مستخدم للتفعيل/التعطيل]
    SelectAction -->|عرض سجل النشاط| SelectUserForLog[اختيار مستخدم لعرض السجل]
    
    %% إضافة مستخدم جديد
    AddNewUser --> FillUserForm[ملء نموذج المستخدم]
    FillUserForm --> EnterUsername[إدخال اسم المستخدم]
    EnterUsername --> EnterEmail[إدخال البريد الإلكتروني]
    EnterEmail --> EnterFullName[إدخال الاسم الكامل]
    EnterFullName --> EnterPhone[إدخال رقم الهاتف]
    EnterPhone --> GeneratePassword[إنشاء كلمة مرور مؤقتة]
    GeneratePassword --> SelectUserRole[اختيار الدور]
    
    SelectUserRole --> ValidateUserForm{التحقق من صحة البيانات}
    ValidateUserForm -->|بيانات غير صحيحة| ShowUserFormError[عرض أخطاء النموذج]
    ShowUserFormError --> FillUserForm
    
    ValidateUserForm -->|بيانات صحيحة| CheckUsernameExists{فحص اسم المستخدم}
    CheckUsernameExists -->|موجود| ShowUsernameExists[عرض: اسم المستخدم محجوز]
    ShowUsernameExists --> EnterUsername
    
    CheckUsernameExists -->|غير موجود| CreateUser[إنشاء حساب المستخدم]
    CreateUser --> AssignRole[تعيين الدور]
    AssignRole --> SaveNewUser[(حفظ في قاعدة البيانات)]
    SaveNewUser --> SendCredentials[إرسال بيانات الدخول بالبريد]
    SendCredentials --> LogUserCreation[تسجيل في سجل التدقيق]
    LogUserCreation --> ShowUserCreated[عرض: تم إنشاء المستخدم]
    ShowUserCreated --> End([نهاية])
    
    %% تعديل مستخدم
    SelectUserToEdit --> LoadUserData[تحميل بيانات المستخدم]
    LoadUserData --> ShowEditForm[عرض نموذج التعديل]
    ShowEditForm --> ModifyUserData[تعديل البيانات]
    ModifyUserData --> ValidateEditForm{التحقق من البيانات}
    
    ValidateEditForm -->|بيانات غير صحيحة| ShowEditError[عرض أخطاء التعديل]
    ShowEditError --> ModifyUserData
    
    ValidateEditForm -->|بيانات صحيحة| UpdateUser[تحديث بيانات المستخدم]
    UpdateUser --> SaveUserUpdate[(حفظ التحديثات)]
    SaveUserUpdate --> LogUserUpdate[تسجيل التعديل في سجل التدقيق]
    LogUserUpdate --> NotifyUserUpdate[إشعار المستخدم بالتحديث]
    NotifyUserUpdate --> ShowUpdateSuccess[عرض: تم التحديث بنجاح]
    ShowUpdateSuccess --> End
    
    %% حذف مستخدم
    SelectUserToDelete --> CheckUserDeletable{هل يمكن الحذف؟}
    CheckUserDeletable -->|لا - مدير وحيد| ShowCannotDelete[عرض: لا يمكن حذف المدير الوحيد]
    ShowCannotDelete --> End
    
    CheckUserDeletable -->|نعم| ConfirmDelete{تأكيد الحذف؟}
    ConfirmDelete -->|لا| End
    ConfirmDelete -->|نعم| CheckUserData{فحص بيانات المستخدم}
    
    CheckUserData -->|له بيانات مرتبطة| ShowDataWarning[عرض تحذير: سيتم حذف البيانات المرتبطة]
    ShowDataWarning --> ConfirmDeleteWithData{تأكيد الحذف مع البيانات؟}
    ConfirmDeleteWithData -->|لا| End
    ConfirmDeleteWithData -->|نعم| DeleteUser
    
    CheckUserData -->|لا توجد بيانات| DeleteUser[حذف المستخدم]
    DeleteUser --> RemoveUserRoles[إزالة جميع الأدوار]
    RemoveUserRoles --> SaveUserDeletion[(حذف من قاعدة البيانات)]
    SaveUserDeletion --> LogUserDeletion[تسجيل الحذف في سجل التدقيق]
    LogUserDeletion --> ShowDeleteSuccess[عرض: تم الحذف بنجاح]
    ShowDeleteSuccess --> End
    
    %% تعيين دور
    SelectUserForRole --> LoadUserRoles[تحميل أدوار المستخدم الحالية]
    LoadUserRoles --> ShowRolesList[عرض قائمة الأدوار المتاحة]
    ShowRolesList --> SelectRoleAction{اختيار الإجراء}
    
    SelectRoleAction -->|إضافة دور| SelectNewRole[اختيار دور جديد]
    SelectRoleAction -->|إزالة دور| SelectRoleToRemove[اختيار دور للإزالة]
    
    SelectNewRole --> CheckRoleExists{هل الدور موجود مسبقاً؟}
    CheckRoleExists -->|نعم| ShowRoleExists[عرض: الدور موجود مسبقاً]
    ShowRoleExists --> End
    
    CheckRoleExists -->|لا| AssignNewRole[تعيين الدور الجديد]
    AssignNewRole --> SaveRoleAssignment[(حفظ تعيين الدور)]
    SaveRoleAssignment --> LogRoleAssignment[تسجيل في سجل التدقيق]
    LogRoleAssignment --> NotifyUserRole[إشعار المستخدم بالدور الجديد]
    NotifyUserRole --> ShowRoleAssigned[عرض: تم تعيين الدور]
    ShowRoleAssigned --> End
    
    SelectRoleToRemove --> CheckLastRole{هل هو الدور الأخير؟}
    CheckLastRole -->|نعم| ShowCannotRemoveLastRole[عرض: لا يمكن إزالة الدور الأخير]
    ShowCannotRemoveLastRole --> End
    
    CheckLastRole -->|لا| RemoveRole[إزالة الدور]
    RemoveRole --> SaveRoleRemoval[(حفظ إزالة الدور)]
    SaveRoleRemoval --> LogRoleRemoval[تسجيل في سجل التدقيق]
    LogRoleRemoval --> ShowRoleRemoved[عرض: تم إزالة الدور]
    ShowRoleRemoved --> End
    
    %% تفعيل/تعطيل
    SelectUserToToggle --> CheckCurrentStatus{فحص الحالة الحالية}
    CheckCurrentStatus -->|نشط| DeactivateUser[تعطيل المستخدم]
    CheckCurrentStatus -->|معطل| ActivateUser[تفعيل المستخدم]
    
    DeactivateUser --> SaveDeactivation[(حفظ التعطيل)]
    SaveDeactivation --> LogDeactivation[تسجيل التعطيل]
    LogDeactivation --> NotifyDeactivation[إشعار المستخدم]
    NotifyDeactivation --> ShowDeactivated[عرض: تم التعطيل]
    ShowDeactivated --> End
    
    ActivateUser --> SaveActivation[(حفظ التفعيل)]
    SaveActivation --> LogActivation[تسجيل التفعيل]
    LogActivation --> NotifyActivation[إشعار المستخدم]
    NotifyActivation --> ShowActivated[عرض: تم التفعيل]
    ShowActivated --> End
    
    %% عرض سجل النشاط
    SelectUserForLog --> LoadActivityLog[تحميل سجل نشاط المستخدم]
    LoadActivityLog --> DisplayActivityLog[عرض السجل]
    DisplayActivityLog --> FilterLog[تصفية حسب: التاريخ/النوع/الإجراء]
    FilterLog --> ExportLog{تصدير السجل؟}
    ExportLog -->|نعم| GenerateLogReport[إنشاء تقرير PDF]
    GenerateLogReport --> DownloadLogReport[تحميل التقرير]
    DownloadLogReport --> End
    ExportLog -->|لا| End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowUserFormError fill:#FFE4B5
    style ShowUsernameExists fill:#FFE4B5
    style ShowEditError fill:#FFE4B5
    style ShowCannotDelete fill:#FFE4B5
    style ShowRoleExists fill:#FFE4B5
    style ShowCannotRemoveLastRole fill:#FFE4B5
    style SaveNewUser fill:#87CEEB
    style SaveUserUpdate fill:#87CEEB
    style SaveUserDeletion fill:#87CEEB
    style SaveRoleAssignment fill:#87CEEB
    style SaveRoleRemoval fill:#87CEEB
```


## 3. مخطط نشاط إنشاء وجدولة التقارير

```mermaid
flowchart TD
    Start([بداية]) --> OpenReportsDashboard[فتح لوحة التقارير]
    OpenReportsDashboard --> SelectReportType{اختيار نوع التقرير}
    
    SelectReportType -->|تقارير المتبرعين| DonorReports[تقارير المتبرعين]
    SelectReportType -->|تقارير التبرعات| DonationReports[تقارير التبرعات]
    SelectReportType -->|تقارير المخزون| InventoryReports[تقارير المخزون]
    SelectReportType -->|تقارير الطلبات| RequestReports[تقارير الطلبات]
    SelectReportType -->|تقرير مخصص| CustomReport[تقرير مخصص]
    
    %% تقارير المتبرعين
    DonorReports --> SelectDonorReport{اختيار التقرير}
    SelectDonorReport -->|حسب فصيلة الدم| DonorsByBloodType[المتبرعون حسب فصيلة الدم]
    SelectDonorReport -->|نشط/غير نشط| ActiveVsInactive[نشط مقابل غير نشط]
    SelectDonorReport -->|حسب المدينة| DonorsByCity[المتبرعون حسب المدينة]
    SelectDonorReport -->|المؤهلون| EligibleDonors[المتبرعون المؤهلون]
    
    %% تقارير التبرعات
    DonationReports --> SelectDonationReport{اختيار التقرير}
    SelectDonationReport -->|حسب الفترة| DonationsByPeriod[التبرعات حسب الفترة]
    SelectDonationReport -->|كمية الدم| BloodQuantity[كمية الدم حسب الفصيلة]
    SelectDonationReport -->|نتائج الفحوصات| TestResults[إحصائيات نتائج الفحوصات]
    SelectDonationReport -->|الأكثر نشاطاً| MostActive[أكثر المتبرعين نشاطاً]
    
    %% تقارير المخزون
    InventoryReports --> SelectInventoryReport{اختيار التقرير}
    SelectInventoryReport -->|التوفر| InventoryAvailability[توفر المخزون]
    SelectInventoryReport -->|القريبة من الانتهاء| ExpiringUnits[الوحدات القريبة من الانتهاء]
    SelectInventoryReport -->|المنتهية| ExpiredUnits[الوحدات المنتهية]
    SelectInventoryReport -->|معدل الاستهلاك| ConsumptionRate[معدل الاستهلاك]
    
    %% تقارير الطلبات
    RequestReports --> SelectRequestReport{اختيار التقرير}
    SelectRequestReport -->|حسب الحالة| RequestsByStatus[الطلبات حسب الحالة]
    SelectRequestReport -->|حسب الاستعجال| RequestsByUrgency[الطلبات حسب الاستعجال]
    SelectRequestReport -->|معدل التنفيذ| FulfillmentRate[معدل تنفيذ الطلبات]
    SelectRequestReport -->|وقت التنفيذ| AvgFulfillmentTime[متوسط وقت التنفيذ]
    
    %% تجميع جميع التقارير
    DonorsByBloodType --> SetReportParameters
    ActiveVsInactive --> SetReportParameters
    DonorsByCity --> SetReportParameters
    EligibleDonors --> SetReportParameters
    DonationsByPeriod --> SetReportParameters
    BloodQuantity --> SetReportParameters
    TestResults --> SetReportParameters
    MostActive --> SetReportParameters
    InventoryAvailability --> SetReportParameters
    ExpiringUnits --> SetReportParameters
    ExpiredUnits --> SetReportParameters
    ConsumptionRate --> SetReportParameters
    RequestsByStatus --> SetReportParameters
    RequestsByUrgency --> SetReportParameters
    FulfillmentRate --> SetReportParameters
    AvgFulfillmentTime --> SetReportParameters
    
    %% تقرير مخصص
    CustomReport --> SelectDataSources[اختيار مصادر البيانات]
    SelectDataSources --> SelectFields[اختيار الحقول]
    SelectFields --> SetFilters[تعيين المرشحات]
    SetFilters --> SetReportParameters
    
    %% معاملات التقرير
    SetReportParameters[تعيين معاملات التقرير]
    SetReportParameters --> SelectDateRange[اختيار نطاق التاريخ]
    SelectDateRange --> SelectGrouping[اختيار التجميع: يوم/أسبوع/شهر/سنة]
    SelectGrouping --> AddFilters[إضافة مرشحات إضافية]
    AddFilters --> PreviewReport{معاينة التقرير؟}
    
    PreviewReport -->|نعم| GeneratePreview[إنشاء معاينة]
    GeneratePreview --> DisplayPreview[عرض المعاينة]
    DisplayPreview --> SatisfiedWithPreview{راضٍ عن المعاينة؟}
    SatisfiedWithPreview -->|لا| SetReportParameters
    SatisfiedWithPreview -->|نعم| SelectReportAction
    
    PreviewReport -->|لا| SelectReportAction{اختيار الإجراء}
    
    SelectReportAction -->|إنشاء الآن| GenerateReport[إنشاء التقرير]
    SelectReportAction -->|جدولة| ScheduleReport[جدولة التقرير]
    
    %% إنشاء التقرير
    GenerateReport --> FetchData[جلب البيانات من قاعدة البيانات]
    FetchData --> ProcessData[معالجة وتحليل البيانات]
    ProcessData --> CreateCharts[إنشاء الرسوم البيانية]
    CreateCharts --> FormatReport[تنسيق التقرير]
    FormatReport --> DisplayReport[عرض التقرير]
    
    DisplayReport --> ReportActions{إجراءات التقرير}
    ReportActions -->|تصدير PDF| ExportPDF[تصدير كـ PDF]
    ReportActions -->|تصدير Excel| ExportExcel[تصدير كـ Excel]
    ReportActions -->|طباعة| PrintReport[طباعة التقرير]
    ReportActions -->|إرسال بالبريد| EmailReport[إرسال بالبريد الإلكتروني]
    ReportActions -->|حفظ| SaveReport[حفظ التقرير]
    
    ExportPDF --> DownloadPDF[تحميل ملف PDF]
    DownloadPDF --> End([نهاية])
    
    ExportExcel --> DownloadExcel[تحميل ملف Excel]
    DownloadExcel --> End
    
    PrintReport --> OpenPrintDialog[فتح نافذة الطباعة]
    OpenPrintDialog --> End
    
    EmailReport --> EnterEmailAddresses[إدخال عناوين البريد]
    EnterEmailAddresses --> AddEmailMessage[إضافة رسالة]
    AddEmailMessage --> SendEmail[إرسال البريد]
    SendEmail --> ShowEmailSent[عرض: تم الإرسال]
    ShowEmailSent --> End
    
    SaveReport --> SaveToDatabase[(حفظ في قاعدة البيانات)]
    SaveToDatabase --> ShowSaveSuccess[عرض: تم الحفظ]
    ShowSaveSuccess --> End
    
    %% جدولة التقرير
    ScheduleReport --> SelectFrequency[اختيار التكرار]
    SelectFrequency --> FrequencyOptions{نوع التكرار}
    
    FrequencyOptions -->|يومي| SetDailyTime[تعيين الوقت اليومي]
    FrequencyOptions -->|أسبوعي| SetWeeklySchedule[تعيين اليوم والوقت]
    FrequencyOptions -->|شهري| SetMonthlySchedule[تعيين التاريخ والوقت]
    FrequencyOptions -->|مخصص| SetCustomSchedule[تعيين جدول مخصص]
    
    SetDailyTime --> SelectRecipients
    SetWeeklySchedule --> SelectRecipients
    SetMonthlySchedule --> SelectRecipients
    SetCustomSchedule --> SelectRecipients
    
    SelectRecipients[اختيار المستلمين]
    SelectRecipients --> SelectFormat[اختيار صيغة التقرير: PDF/Excel]
    SelectFormat --> ValidateSchedule{التحقق من الجدول}
    
    ValidateSchedule -->|غير صحيح| ShowScheduleError[عرض أخطاء الجدول]
    ShowScheduleError --> SelectFrequency
    
    ValidateSchedule -->|صحيح| SaveSchedule[(حفظ الجدول)]
    SaveSchedule --> ActivateSchedule[تفعيل الجدول]
    ActivateSchedule --> ShowScheduleSuccess[عرض: تم جدولة التقرير]
    ShowScheduleSuccess --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowScheduleError fill:#FFE4B5
    style SaveToDatabase fill:#87CEEB
    style SaveSchedule fill:#87CEEB
```


## 4. مخطط نشاط إدارة المخزون وتنبيهات المخزون المنخفض

```mermaid
flowchart TD
    Start([بداية]) --> OpenInventoryPage[فتح صفحة إدارة المخزون]
    OpenInventoryPage --> LoadInventoryData[تحميل بيانات المخزون]
    LoadInventoryData --> DisplayInventorySummary[عرض ملخص المخزون]
    
    DisplayInventorySummary --> ShowTotalUnits[عرض إجمالي الوحدات]
    ShowTotalUnits --> ShowAvailableUnits[عرض الوحدات المتاحة]
    ShowAvailableUnits --> ShowReservedUnits[عرض الوحدات المحجوزة]
    ShowReservedUnits --> ShowByBloodType[عرض التفصيل حسب فصيلة الدم]
    
    ShowByBloodType --> CheckLowStock{فحص المخزون المنخفض}
    CheckLowStock -->|يوجد مخزون منخفض| HighlightLowStock[تمييز الفصائل المنخفضة]
    CheckLowStock -->|مخزون كافي| ShowNormalStatus[عرض الحالة الطبيعية]
    
    HighlightLowStock --> ShowLowStockAlert[عرض تنبيه المخزون المنخفض]
    ShowLowStockAlert --> CheckCriticalLevel{فحص المستوى الحرج}
    
    CheckCriticalLevel -->|حرج جداً| ShowCriticalAlert[عرض تنبيه حرج]
    CheckCriticalLevel -->|تحذير| ShowWarningAlert[عرض تحذير]
    
    ShowCriticalAlert --> SendEmergencyNotification[إرسال إشعار طوارئ]
    SendEmergencyNotification --> NotifyAllAdmins[إشعار جميع المدراء]
    NotifyAllAdmins --> NotifyEligibleDonors[إشعار المتبرعين المؤهلين]
    NotifyEligibleDonors --> SelectAction
    
    ShowWarningAlert --> NotifyAdmins[إشعار المدراء]
    NotifyAdmins --> SelectAction
    
    ShowNormalStatus --> SelectAction{اختيار الإجراء}
    
    SelectAction -->|تحديث الكميات| UpdateQuantities[تحديث الكميات]
    SelectAction -->|عرض الوحدات القريبة من الانتهاء| ViewExpiring[عرض الوحدات القريبة من الانتهاء]
    SelectAction -->|إزالة الوحدات المنتهية| RemoveExpired[إزالة الوحدات المنتهية]
    SelectAction -->|حجز وحدات| ReserveUnits[حجز وحدات]
    SelectAction -->|إلغاء حجز| ReleaseUnits[إلغاء حجز وحدات]
    SelectAction -->|نقل وحدات| TransferUnits[نقل وحدات]
    SelectAction -->|تعيين حدود| SetThresholds[تعيين حدود المخزون]
    SelectAction -->|عرض السجل| ViewHistory[عرض سجل المخزون]
    
    %% تحديث الكميات
    UpdateQuantities --> SelectBloodType[اختيار فصيلة الدم]
    SelectBloodType --> EnterQuantityChange[إدخال التغيير في الكمية]
    EnterQuantityChange --> SelectChangeType{نوع التغيير}
    
    SelectChangeType -->|إضافة| AddQuantity[إضافة كمية]
    SelectChangeType -->|خصم| SubtractQuantity[خصم كمية]
    
    AddQuantity --> EnterReason[إدخال سبب الإضافة]
    SubtractQuantity --> EnterReason
    
    EnterReason --> ValidateQuantity{التحقق من الكمية}
    ValidateQuantity -->|غير صحيحة| ShowQuantityError[عرض: كمية غير صحيحة]
    ShowQuantityError --> EnterQuantityChange
    
    ValidateQuantity -->|صحيحة| UpdateInventoryDB[(تحديث قاعدة البيانات)]
    UpdateInventoryDB --> LogInventoryChange[تسجيل التغيير في السجل]
    LogInventoryChange --> CheckNewLevel{فحص المستوى الجديد}
    
    CheckNewLevel -->|أصبح منخفضاً| TriggerLowStockAlert[تفعيل تنبيه المخزون المنخفض]
    CheckNewLevel -->|طبيعي| ShowUpdateSuccess[عرض: تم التحديث بنجاح]
    
    TriggerLowStockAlert --> ShowUpdateSuccess
    ShowUpdateSuccess --> End([نهاية])
    
    %% عرض الوحدات القريبة من الانتهاء
    ViewExpiring --> SetExpiryThreshold[تعيين عتبة الانتهاء: أيام]
    SetExpiryThreshold --> QueryExpiringUnits[الاستعلام عن الوحدات القريبة من الانتهاء]
    QueryExpiringUnits --> CheckExpiringUnits{هل توجد وحدات؟}
    
    CheckExpiringUnits -->|لا| ShowNoExpiring[عرض: لا توجد وحدات قريبة من الانتهاء]
    ShowNoExpiring --> End
    
    CheckExpiringUnits -->|نعم| DisplayExpiringList[عرض قائمة الوحدات]
    DisplayExpiringList --> GroupByBloodType[تجميع حسب فصيلة الدم]
    GroupByBloodType --> ShowExpiryDates[عرض تواريخ الانتهاء]
    ShowExpiryDates --> ExpiringActions{إجراءات}
    
    ExpiringActions -->|تصدير القائمة| ExportExpiringList[تصدير القائمة]
    ExpiringActions -->|إشعار الموظفين| NotifyStaffExpiring[إشعار الموظفين]
    ExpiringActions -->|تحديد للاستخدام الأولوي| PrioritizeExpiring[تحديد للاستخدام الأولوي]
    
    ExportExpiringList --> End
    NotifyStaffExpiring --> End
    PrioritizeExpiring --> End
    
    %% إزالة الوحدات المنتهية
    RemoveExpired --> QueryExpiredUnits[الاستعلام عن الوحدات المنتهية]
    QueryExpiredUnits --> CheckExpiredUnits{هل توجد وحدات منتهية؟}
    
    CheckExpiredUnits -->|لا| ShowNoExpired[عرض: لا توجد وحدات منتهية]
    ShowNoExpired --> End
    
    CheckExpiredUnits -->|نعم| DisplayExpiredList[عرض قائمة الوحدات المنتهية]
    DisplayExpiredList --> ShowExpiredCount[عرض العدد الإجمالي]
    ShowExpiredCount --> ConfirmRemoval{تأكيد الإزالة؟}
    
    ConfirmRemoval -->|لا| End
    ConfirmRemoval -->|نعم| MarkAsExpired[تحديد الحالة: منتهية]
    MarkAsExpired --> UpdateInventoryAfterRemoval[تحديث كميات المخزون]
    UpdateInventoryAfterRemoval --> LogExpiredRemoval[تسجيل الإزالة]
    LogExpiredRemoval --> GenerateWasteReport[إنشاء تقرير الهدر]
    GenerateWasteReport --> ShowRemovalSuccess[عرض: تم إزالة الوحدات المنتهية]
    ShowRemovalSuccess --> End
    
    %% حجز وحدات
    ReserveUnits --> SelectBloodTypeReserve[اختيار فصيلة الدم]
    SelectBloodTypeReserve --> EnterReserveQuantity[إدخال الكمية للحجز]
    EnterReserveQuantity --> SelectRequest[اختيار الطلب المرتبط]
    SelectRequest --> CheckAvailability{فحص التوفر}
    
    CheckAvailability -->|غير متوفر| ShowInsufficientStock[عرض: مخزون غير كافي]
    ShowInsufficientStock --> End
    
    CheckAvailability -->|متوفر| CreateReservation[إنشاء الحجز]
    CreateReservation --> UpdateReservedQuantity[تحديث الكمية المحجوزة]
    UpdateReservedQuantity --> SaveReservation[(حفظ الحجز)]
    SaveReservation --> ShowReserveSuccess[عرض: تم الحجز بنجاح]
    ShowReserveSuccess --> End
    
    %% إلغاء حجز
    ReleaseUnits --> SelectReservation[اختيار الحجز]
    SelectReservation --> ConfirmRelease{تأكيد إلغاء الحجز؟}
    ConfirmRelease -->|لا| End
    ConfirmRelease -->|نعم| ReleaseReservation[إلغاء الحجز]
    ReleaseReservation --> UpdateReleasedQuantity[تحديث الكمية المتاحة]
    UpdateReleasedQuantity --> SaveRelease[(حفظ الإلغاء)]
    SaveRelease --> ShowReleaseSuccess[عرض: تم إلغاء الحجز]
    ShowReleaseSuccess --> End
    
    %% نقل وحدات
    TransferUnits --> SelectSourceLocation[اختيار الموقع المصدر]
    SelectSourceLocation --> SelectDestination[اختيار الموقع الوجهة]
    SelectDestination --> SelectUnitsToTransfer[اختيار الوحدات للنقل]
    SelectUnitsToTransfer --> EnterTransferReason[إدخال سبب النقل]
    EnterTransferReason --> CreateTransferRecord[إنشاء سجل النقل]
    CreateTransferRecord --> UpdateLocations[تحديث المواقع]
    UpdateLocations --> SaveTransfer[(حفظ النقل)]
    SaveTransfer --> NotifyDestination[إشعار الموقع الوجهة]
    NotifyDestination --> ShowTransferSuccess[عرض: تم النقل بنجاح]
    ShowTransferSuccess --> End
    
    %% تعيين حدود
    SetThresholds --> SelectBloodTypeThreshold[اختيار فصيلة الدم]
    SelectBloodTypeThreshold --> EnterLowThreshold[إدخال حد المخزون المنخفض]
    EnterLowThreshold --> EnterCriticalThreshold[إدخال حد المخزون الحرج]
    EnterCriticalThreshold --> ValidateThresholds{التحقق من الحدود}
    
    ValidateThresholds -->|غير صحيحة| ShowThresholdError[عرض: حدود غير صحيحة]
    ShowThresholdError --> EnterLowThreshold
    
    ValidateThresholds -->|صحيحة| SaveThresholds[(حفظ الحدود)]
    SaveThresholds --> ApplyToAllLocations[تطبيق على جميع المواقع]
    ApplyToAllLocations --> ShowThresholdSuccess[عرض: تم تعيين الحدود]
    ShowThresholdSuccess --> End
    
    %% عرض السجل
    ViewHistory --> SelectHistoryPeriod[اختيار الفترة الزمنية]
    SelectHistoryPeriod --> LoadHistoryData[تحميل بيانات السجل]
    LoadHistoryData --> DisplayHistory[عرض السجل]
    DisplayHistory --> FilterHistory[تصفية حسب: النوع/المستخدم/الفصيلة]
    FilterHistory --> ExportHistory{تصدير السجل؟}
    
    ExportHistory -->|نعم| GenerateHistoryReport[إنشاء تقرير السجل]
    GenerateHistoryReport --> DownloadHistory[تحميل التقرير]
    DownloadHistory --> End
    
    ExportHistory -->|لا| End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowQuantityError fill:#FFE4B5
    style ShowInsufficientStock fill:#FFE4B5
    style ShowThresholdError fill:#FFE4B5
    style ShowCriticalAlert fill:#FF6B6B
    style ShowWarningAlert fill:#FFA500
    style UpdateInventoryDB fill:#87CEEB
    style SaveReservation fill:#87CEEB
    style SaveRelease fill:#87CEEB
    style SaveTransfer fill:#87CEEB
    style SaveThresholds fill:#87CEEB
```


## 5. مخطط نشاط مراجعة سجلات التدقيق والأمان

```mermaid
flowchart TD
    Start([بداية]) --> OpenAuditPage[فتح صفحة سجلات التدقيق]
    OpenAuditPage --> SelectAuditType{اختيار نوع السجل}
    
    SelectAuditType -->|سجل التدقيق الكامل| FullAuditLog[سجل التدقيق الكامل]
    SelectAuditType -->|سجل تسجيل الدخول| LoginHistory[سجل تسجيل الدخول]
    SelectAuditType -->|تتبع الإجراءات| ActionTracking[تتبع إجراءات المستخدمين]
    SelectAuditType -->|مراجعة التغييرات| DataChanges[مراجعة التغييرات على البيانات]
    SelectAuditType -->|مراقبة الأمان| SecurityMonitoring[مراقبة أمان النظام]
    
    %% سجل التدقيق الكامل
    FullAuditLog --> SetAuditFilters[تعيين المرشحات]
    SetAuditFilters --> SelectDateRange[اختيار نطاق التاريخ]
    SelectDateRange --> SelectUser[اختيار مستخدم محدد اختياري]
    SelectUser --> SelectActionType[اختيار نوع الإجراء]
    SelectActionType --> SelectModule[اختيار الوحدة: متبرعين/تبرعات/مخزون]
    
    SelectModule --> LoadAuditData[تحميل بيانات التدقيق]
    LoadAuditData --> CheckAuditData{هل توجد بيانات؟}
    
    CheckAuditData -->|لا| ShowNoAuditData[عرض: لا توجد سجلات]
    ShowNoAuditData --> End([نهاية])
    
    CheckAuditData -->|نعم| DisplayAuditLog[عرض سجل التدقيق]
    DisplayAuditLog --> ShowAuditDetails[عرض التفاصيل]
    ShowAuditDetails --> ForEachEntry[لكل سجل]
    
    ForEachEntry --> ShowTimestamp[عرض الطابع الزمني]
    ShowTimestamp --> ShowUser[عرض المستخدم]
    ShowUser --> ShowAction[عرض الإجراء]
    ShowAction --> ShowModule[عرض الوحدة]
    ShowModule --> ShowIPAddress[عرض عنوان IP]
    ShowIPAddress --> ShowBeforeAfter[عرض البيانات قبل/بعد]
    
    ShowBeforeAfter --> AuditActions{إجراءات التدقيق}
    AuditActions -->|عرض التفاصيل| ViewAuditDetails[عرض تفاصيل السجل]
    AuditActions -->|تصدير| ExportAuditLog[تصدير سجل التدقيق]
    AuditActions -->|تحليل| AnalyzeAudit[تحليل الأنماط]
    AuditActions -->|إنشاء تقرير| GenerateAuditReport[إنشاء تقرير التدقيق]
    
    ViewAuditDetails --> ShowFullDetails[عرض التفاصيل الكاملة]
    ShowFullDetails --> ShowRequestData[عرض بيانات الطلب]
    ShowRequestData --> ShowResponseData[عرض بيانات الاستجابة]
    ShowResponseData --> End
    
    ExportAuditLog --> SelectExportFormat{اختيار صيغة التصدير}
    SelectExportFormat -->|PDF| ExportAuditPDF[تصدير كـ PDF]
    SelectExportFormat -->|Excel| ExportAuditExcel[تصدير كـ Excel]
    SelectExportFormat -->|CSV| ExportAuditCSV[تصدير كـ CSV]
    SelectExportFormat -->|JSON| ExportAuditJSON[تصدير كـ JSON]
    
    ExportAuditPDF --> DownloadAuditFile[تحميل الملف]
    ExportAuditExcel --> DownloadAuditFile
    ExportAuditCSV --> DownloadAuditFile
    ExportAuditJSON --> DownloadAuditFile
    DownloadAuditFile --> End
    
    AnalyzeAudit --> DetectPatterns[كشف الأنماط]
    DetectPatterns --> IdentifyAnomalies[تحديد الشذوذات]
    IdentifyAnomalies --> CheckSuspicious{هل توجد أنشطة مشبوهة؟}
    
    CheckSuspicious -->|نعم| HighlightSuspicious[تمييز الأنشطة المشبوهة]
    HighlightSuspicious --> GenerateSecurityAlert[إنشاء تنبيه أمني]
    GenerateSecurityAlert --> NotifySecurityTeam[إشعار فريق الأمان]
    NotifySecurityTeam --> End
    
    CheckSuspicious -->|لا| ShowAnalysisResults[عرض نتائج التحليل]
    ShowAnalysisResults --> End
    
    GenerateAuditReport --> SelectReportType[اختيار نوع التقرير]
    SelectReportType --> CompileAuditData[تجميع بيانات التدقيق]
    CompileAuditData --> CreateAuditSummary[إنشاء ملخص]
    CreateAuditSummary --> AddCharts[إضافة رسوم بيانية]
    AddCharts --> FormatAuditReport[تنسيق التقرير]
    FormatAuditReport --> SaveAuditReport[(حفظ التقرير)]
    SaveAuditReport --> End
    
    %% سجل تسجيل الدخول
    LoginHistory --> SetLoginFilters[تعيين مرشحات تسجيل الدخول]
    SetLoginFilters --> SelectLoginDateRange[اختيار نطاق التاريخ]
    SelectLoginDateRange --> SelectLoginUser[اختيار مستخدم]
    SelectLoginUser --> SelectLoginStatus{اختيار الحالة}
    
    SelectLoginStatus -->|ناجح| SuccessfulLogins[تسجيلات الدخول الناجحة]
    SelectLoginStatus -->|فاشل| FailedLogins[محاولات الدخول الفاشلة]
    SelectLoginStatus -->|الكل| AllLogins[جميع محاولات الدخول]
    
    SuccessfulLogins --> LoadLoginData
    FailedLogins --> LoadLoginData
    AllLogins --> LoadLoginData
    
    LoadLoginData[تحميل بيانات تسجيل الدخول]
    LoadLoginData --> DisplayLoginHistory[عرض سجل تسجيل الدخول]
    DisplayLoginHistory --> ShowLoginDetails[عرض التفاصيل]
    
    ShowLoginDetails --> ForEachLogin[لكل محاولة]
    ForEachLogin --> ShowLoginTime[عرض الوقت]
    ShowLoginTime --> ShowLoginUser[عرض المستخدم]
    ShowLoginUser --> ShowLoginIP[عرض عنوان IP]
    ShowLoginIP --> ShowLoginDevice[عرض الجهاز/المتصفح]
    ShowLoginDevice --> ShowLoginStatus[عرض الحالة]
    ShowLoginStatus --> ShowLoginLocation[عرض الموقع الجغرافي]
    
    ShowLoginLocation --> CheckFailedAttempts{فحص المحاولات الفاشلة}
    CheckFailedAttempts -->|محاولات متعددة| HighlightBruteForce[تمييز محاولات القوة الغاشمة]
    HighlightBruteForce --> BlockSuspiciousIP[حظر IP المشبوه]
    BlockSuspiciousIP --> NotifyAdmin[إشعار المدير]
    NotifyAdmin --> End
    
    CheckFailedAttempts -->|طبيعي| LoginActions{إجراءات}
    LoginActions -->|تصدير| ExportLoginHistory[تصدير سجل الدخول]
    LoginActions -->|تحليل| AnalyzeLoginPatterns[تحليل أنماط الدخول]
    
    ExportLoginHistory --> End
    AnalyzeLoginPatterns --> End
    
    %% تتبع الإجراءات
    ActionTracking --> SelectActionUser[اختيار المستخدم]
    SelectActionUser --> SelectActionPeriod[اختيار الفترة]
    SelectActionPeriod --> LoadUserActions[تحميل إجراءات المستخدم]
    LoadUserActions --> DisplayActionTimeline[عرض الجدول الزمني للإجراءات]
    
    DisplayActionTimeline --> GroupByModule[تجميع حسب الوحدة]
    GroupByModule --> ShowActionStats[عرض إحصائيات الإجراءات]
    ShowActionStats --> IdentifyUnusualActivity{تحديد نشاط غير عادي؟}
    
    IdentifyUnusualActivity -->|نعم| FlagUnusualActivity[وضع علامة على النشاط]
    FlagUnusualActivity --> InvestigateActivity[التحقيق في النشاط]
    InvestigateActivity --> End
    
    IdentifyUnusualActivity -->|لا| End
    
    %% مراجعة التغييرات
    DataChanges --> SelectDataModule[اختيار الوحدة]
    SelectDataModule --> SelectChangePeriod[اختيار الفترة]
    SelectChangePeriod --> LoadDataChanges[تحميل التغييرات]
    LoadDataChanges --> DisplayChanges[عرض التغييرات]
    
    DisplayChanges --> ForEachChange[لكل تغيير]
    ForEachChange --> ShowChangeType[عرض نوع التغيير: إضافة/تعديل/حذف]
    ShowChangeType --> ShowChangedBy[عرض من قام بالتغيير]
    ShowChangedBy --> ShowChangeTime[عرض وقت التغيير]
    ShowChangeTime --> ShowOldValue[عرض القيمة القديمة]
    ShowOldValue --> ShowNewValue[عرض القيمة الجديدة]
    
    ShowNewValue --> ChangeActions{إجراءات}
    ChangeActions -->|التراجع| RevertChange[التراجع عن التغيير]
    ChangeActions -->|مقارنة| CompareVersions[مقارنة الإصدارات]
    ChangeActions -->|تدقيق| AuditChange[تدقيق التغيير]
    
    RevertChange --> ConfirmRevert{تأكيد التراجع؟}
    ConfirmRevert -->|نعم| ExecuteRevert[تنفيذ التراجع]
    ExecuteRevert --> LogRevert[تسجيل التراجع]
    LogRevert --> NotifyRevert[إشعار المستخدم]
    NotifyRevert --> End
    ConfirmRevert -->|لا| End
    
    CompareVersions --> ShowDifferences[عرض الاختلافات]
    ShowDifferences --> End
    
    AuditChange --> ReviewChangeDetails[مراجعة تفاصيل التغيير]
    ReviewChangeDetails --> ApproveChange{الموافقة على التغيير؟}
    ApproveChange -->|نعم| MarkAsApproved[تحديد كموافق عليه]
    ApproveChange -->|لا| MarkAsRejected[تحديد كمرفوض]
    MarkAsApproved --> End
    MarkAsRejected --> End
    
    %% مراقبة الأمان
    SecurityMonitoring --> LoadSecurityMetrics[تحميل مقاييس الأمان]
    LoadSecurityMetrics --> DisplaySecurityDashboard[عرض لوحة الأمان]
    
    DisplaySecurityDashboard --> ShowActiveUsers[عرض المستخدمين النشطين]
    ShowActiveUsers --> ShowFailedLoginAttempts[عرض محاولات الدخول الفاشلة]
    ShowFailedLoginAttempts --> ShowSuspiciousActivities[عرض الأنشطة المشبوهة]
    ShowSuspiciousActivities --> ShowSecurityAlerts[عرض التنبيهات الأمنية]
    
    ShowSecurityAlerts --> CheckSecurityThreats{فحص التهديدات}
    CheckSecurityThreats -->|توجد تهديدات| HandleThreat[معالجة التهديد]
    CheckSecurityThreats -->|لا توجد تهديدات| MonitorContinuously[المراقبة المستمرة]
    
    HandleThreat --> IdentifyThreatType[تحديد نوع التهديد]
    IdentifyThreatType --> TakeAction[اتخاذ الإجراء المناسب]
    TakeAction --> BlockAccess[حظر الوصول]
    BlockAccess --> NotifySecurityAdmin[إشعار مدير الأمان]
    NotifySecurityAdmin --> LogSecurityIncident[تسجيل الحادثة الأمنية]
    LogSecurityIncident --> End
    
    MonitorContinuously --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ShowNoAuditData fill:#FFE4B5
    style GenerateSecurityAlert fill:#FF6B6B
    style HighlightBruteForce fill:#FF6B6B
    style BlockSuspiciousIP fill:#FF6B6B
    style HandleThreat fill:#FF6B6B
    style SaveAuditReport fill:#87CEEB
    style LogRevert fill:#87CEEB
    style LogSecurityIncident fill:#87CEEB


## 📝 ملاحظات خاصة بالمدير

### 🔐 صلاحيات المدير الحصرية
- إدارة المستخدمين والأدوار
- الموافقة على تسجيل المتبرعين
- الوصول إلى سجلات التدقيق الكاملة
- تكوين إعدادات النظام
- إدارة النسخ الاحتياطي
- حذف السجلات
- تصدير البيانات الكاملة

### 📊 أنواع التقارير المتاحة
1. **تقارير المتبرعين:** حسب فصيلة الدم، المدينة، الحالة
2. **تقارير التبرعات:** حسب الفترة، الكمية، نتائج الفحوصات
3. **تقارير المخزون:** التوفر، الوحدات المنتهية، معدل الاستهلاك
4. **تقارير الطلبات:** حسب الحالة، الاستعجال، معدل التنفيذ

### 🔔 تنبيهات المخزون
- **حرج:** أقل من 10 وحدات
- **تحذير:** أقل من 20 وحدة
- **طبيعي:** 20 وحدة فأكثر

### 🔒 سجلات التدقيق
تتضمن:
- من قام بالعملية
- ماذا فعل
- متى (التاريخ والوقت)
- من أين (عنوان IP)
- البيانات قبل وبعد التغيير

### 🎨 دليل الألوان
- 🟢 **أخضر فاتح:** نقطة البداية
- 🔴 **وردي فاتح:** نقطة النهاية
- 🟡 **برتقالي فاتح:** رسائل الخطأ والتحذيرات
- 🔵 **أزرق فاتح:** عمليات قاعدة البيانات
- 🔴 **أحمر:** تنبيهات الطوارئ والأمان
- 🟠 **برتقالي:** تحذيرات المخزون

