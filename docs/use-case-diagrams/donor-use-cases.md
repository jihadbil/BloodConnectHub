# مخطط حالات الاستخدام - المتبرع

## مخطط شامل لجميع وظائف المتبرع في نظام BloodConnectHub


graph TB
    %% تعريف الأدوار
    Donor[🩸 المتبرع]
    NotificationSystem[🔔 نظام الإشعارات]

    %% ==========================================
    %% المصادقة وإدارة الملف الشخصي
    %% ==========================================
    subgraph AuthProfile[المصادقة وإدارة الملف الشخصي]
        UC_Register[التسجيل كمتبرع]
        UC_Login[تسجيل الدخول]
        UC_Logout[تسجيل الخروج]
        UC_ViewProfile[عرض الملف الشخصي]
        UC_UpdateProfile[تحديث المعلومات الشخصية]
        UC_ChangePassword[تغيير كلمة المرور]
        UC_UploadDocs[رفع الوثائق الطبية]
        UC_ViewApprovalStatus[عرض حالة الموافقة]
    end

    %% ==========================================
    %% لوحة التحكم والإحصائيات
    %% ==========================================
    subgraph Dashboard[لوحة التحكم والإحصائيات]
        UC_Dashboard[لوحة تحكم المتبرع]
        UC_ViewStats[عرض الإحصائيات]
        UC_DonationHistory[سجل التبرعات]
        UC_NextEligibleDate[موعد التبرع القادم]
        UC_BloodTypeInfo[معلومات فصيلة الدم]
        UC_TotalDonations[إجمالي التبرعات]
    end

    %% ==========================================
    %% إدارة طلبات الدم
    %% ==========================================
    subgraph BloodRequests[إدارة طلبات الدم]
        UC_BrowseRequests[تصفح طلبات الدم]
        UC_ViewRequestDetails[عرض تفاصيل الطلب]
        UC_FilterByBloodType[تصفية حسب فصيلة الدم]
        UC_FilterByUrgency[تصفية حسب الاستعجال]
        UC_ViewUrgentRequests[عرض الطلبات العاجلة]
        UC_ViewEmergencyRequests[عرض الطلبات الطارئة]
        UC_SearchRequests[البحث في الطلبات]
    end

    %% ==========================================
    %% إدارة الاستجابات
    %% ==========================================
    subgraph ResponseMgmt[إدارة الاستجابات]
        UC_RespondToRequest[الاستجابة لطلب دم]
        UC_SubmitResponse[إرسال الاستجابة]
        UC_AddNotes[إضافة ملاحظات]
        UC_ViewMyResponses[عرض استجاباتي]
        UC_ViewResponseStatus[عرض حالة الاستجابة]
        UC_UpdateResponse[تحديث الاستجابة]
        UC_CancelResponse[إلغاء الاستجابة]
        UC_CancellationReason[تقديم سبب الإلغاء]
        UC_ConfirmAppointment[تأكيد موعد التبرع]
    end

    %% ==========================================
    %% تتبع التبرعات
    %% ==========================================
    subgraph DonationTracking[تتبع التبرعات]
        UC_ViewDonations[عرض تبرعاتي]
        UC_ViewDonationDetails[عرض تفاصيل التبرع]
        UC_ViewTestResults[عرض نتائج الفحوصات]
        UC_ViewLabReports[عرض التقارير المخبرية]
        UC_DownloadReport[تحميل التقرير]
        UC_ViewDonationDate[عرض تاريخ التبرع]
        UC_ViewQuantity[عرض الكمية المتبرع بها]
    end

    %% ==========================================
    %% إدارة الإشعارات
    %% ==========================================
    subgraph Notifications[إدارة الإشعارات]
        UC_ViewNotifications[عرض الإشعارات]
        UC_UnreadCount[عدد الإشعارات غير المقروءة]
        UC_MarkAsRead[تحديد كمقروء]
        UC_MarkAllRead[تحديد الكل كمقروء]
        UC_DeleteNotification[حذف إشعار]
        UC_ReceiveAlert[استقبال تنبيه طلب جديد]
        UC_ReceiveResponseUpdate[استقبال تحديث الاستجابة]
        UC_ReceiveApproval[استقبال إشعار الموافقة]
    end

    %% ==========================================
    %% المعلومات والدعم
    %% ==========================================
    subgraph InfoSupport[المعلومات والدعم]
        UC_BloodTypesInfo[معلومات فصائل الدم]
        UC_Guidelines[إرشادات التبرع]
        UC_EligibilityCriteria[معايير الأهلية]
        UC_FAQ[الأسئلة الشائعة]
        UC_ContactSupport[التواصل مع الدعم]
        UC_AboutPage[صفحة من نحن]
    end

    %% ==========================================
    %% علاقات المتبرع - المصادقة
    %% ==========================================
    Donor --> UC_Register
    Donor --> UC_Login
    Donor --> UC_Logout
    Donor --> UC_ViewProfile
    Donor --> UC_UpdateProfile
    Donor --> UC_ChangePassword
    Donor --> UC_UploadDocs
    Donor --> UC_ViewApprovalStatus

    %% ==========================================
    %% علاقات المتبرع - لوحة التحكم
    %% ==========================================
    Donor --> UC_Dashboard
    Donor --> UC_ViewStats
    Donor --> UC_DonationHistory
    Donor --> UC_NextEligibleDate
    Donor --> UC_BloodTypeInfo
    Donor --> UC_TotalDonations

    %% ==========================================
    %% علاقات المتبرع - طلبات الدم
    %% ==========================================
    Donor --> UC_BrowseRequests
    Donor --> UC_ViewRequestDetails
    Donor --> UC_FilterByBloodType
    Donor --> UC_FilterByUrgency
    Donor --> UC_ViewUrgentRequests
    Donor --> UC_ViewEmergencyRequests
    Donor --> UC_SearchRequests

    %% ==========================================
    %% علاقات المتبرع - الاستجابات
    %% ==========================================
    Donor --> UC_RespondToRequest
    Donor --> UC_SubmitResponse
    Donor --> UC_AddNotes
    Donor --> UC_ViewMyResponses
    Donor --> UC_ViewResponseStatus
    Donor --> UC_UpdateResponse
    Donor --> UC_CancelResponse
    Donor --> UC_CancellationReason
    Donor --> UC_ConfirmAppointment

    %% ==========================================
    %% علاقات المتبرع - التبرعات
    %% ==========================================
    Donor --> UC_ViewDonations
    Donor --> UC_ViewDonationDetails
    Donor --> UC_ViewTestResults
    Donor --> UC_ViewLabReports
    Donor --> UC_DownloadReport
    Donor --> UC_ViewDonationDate
    Donor --> UC_ViewQuantity

    %% ==========================================
    %% علاقات المتبرع - الإشعارات
    %% ==========================================
    Donor --> UC_ViewNotifications
    Donor --> UC_UnreadCount
    Donor --> UC_MarkAsRead
    Donor --> UC_MarkAllRead
    Donor --> UC_DeleteNotification
    Donor --> UC_ReceiveAlert
    Donor --> UC_ReceiveResponseUpdate
    Donor --> UC_ReceiveApproval

    %% ==========================================
    %% علاقات المتبرع - المعلومات
    %% ==========================================
    Donor --> UC_BloodTypesInfo
    Donor --> UC_Guidelines
    Donor --> UC_EligibilityCriteria
    Donor --> UC_FAQ
    Donor --> UC_ContactSupport
    Donor --> UC_AboutPage

    %% ==========================================
    %% علاقات نظام الإشعارات
    %% ==========================================
    NotificationSystem --> UC_ReceiveAlert
    NotificationSystem --> UC_ReceiveResponseUpdate
    NotificationSystem --> UC_ReceiveApproval

    %% ==========================================
    %% علاقات Include
    %% ==========================================
    UC_Dashboard -.->|يتضمن| UC_ViewStats
    UC_Dashboard -.->|يتضمن| UC_DonationHistory
    UC_Dashboard -.->|يتضمن| UC_NextEligibleDate
    UC_RespondToRequest -.->|يتضمن| UC_ViewRequestDetails
    UC_SubmitResponse -.->|يتضمن| UC_ReceiveAlert
    UC_ViewDonations -.->|يتضمن| UC_ViewDonationDetails
    UC_ViewDonationDetails -.->|يتضمن| UC_ViewTestResults
    UC_CancelResponse -.->|يتضمن| UC_CancellationReason
    UC_Register -.->|يتضمن| UC_UploadDocs

    %% ==========================================
    %% علاقات Extend
    %% ==========================================
    UC_AddNotes -.->|يمتد| UC_SubmitResponse
    UC_DownloadReport -.->|يمتد| UC_ViewLabReports
    UC_ConfirmAppointment -.->|يمتد| UC_ViewResponseStatus

    %% تنسيق الألوان
    classDef authStyle fill:#E8F5E9,stroke:#388E3C,stroke-width:2px
    classDef dashboardStyle fill:#E3F2FD,stroke:#1976D2,stroke-width:2px
    classDef requestStyle fill:#FFF9C4,stroke:#F57C00,stroke-width:2px
    classDef responseStyle fill:#FCE4EC,stroke:#C2185B,stroke-width:2px
    classDef donationStyle fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px
    classDef notificationStyle fill:#E0F2F1,stroke:#00796B,stroke-width:2px
    classDef infoStyle fill:#EFEBE9,stroke:#5D4037,stroke-width:2px
    
    class UC_Register,UC_Login,UC_Logout,UC_ViewProfile,UC_UpdateProfile,UC_ChangePassword,UC_UploadDocs,UC_ViewApprovalStatus authStyle
    class UC_Dashboard,UC_ViewStats,UC_DonationHistory,UC_NextEligibleDate,UC_BloodTypeInfo,UC_TotalDonations dashboardStyle
    class UC_BrowseRequests,UC_ViewRequestDetails,UC_FilterByBloodType,UC_FilterByUrgency,UC_ViewUrgentRequests,UC_ViewEmergencyRequests,UC_SearchRequests requestStyle
    class UC_RespondToRequest,UC_SubmitResponse,UC_AddNotes,UC_ViewMyResponses,UC_ViewResponseStatus,UC_UpdateResponse,UC_CancelResponse,UC_CancellationReason,UC_ConfirmAppointment responseStyle
    class UC_ViewDonations,UC_ViewDonationDetails,UC_ViewTestResults,UC_ViewLabReports,UC_DownloadReport,UC_ViewDonationDate,UC_ViewQuantity donationStyle
    class UC_ViewNotifications,UC_UnreadCount,UC_MarkAsRead,UC_MarkAllRead,UC_DeleteNotification,UC_ReceiveAlert,UC_ReceiveResponseUpdate,UC_ReceiveApproval notificationStyle
    class UC_BloodTypesInfo,UC_Guidelines,UC_EligibilityCriteria,UC_FAQ,UC_ContactSupport,UC_AboutPage infoStyle


## 📝 ملاحظات مهمة

### 🔐 التسجيل والموافقة

**عند التسجيل، يجب على المتبرع تقديم:**
- المعلومات الشخصية الكاملة
- الرقم الوطني
- فصيلة الدم
- الوثائق الطبية
- معلومات الاتصال

**حالات الموافقة:**
- ⏳ **معلق (Pending):** في انتظار المراجعة من الموظفين
- ✅ **موافق عليه (Approved):** يمكنه التبرع والاستجابة للطلبات
- ❌ **مرفوض (Rejected):** لا يمكنه التبرع (مع ذكر السبب)

### 🩸 شروط الاستجابة لطلبات الدم

**يمكن للمتبرع الاستجابة لطلب دم فقط إذا:**
- ✅ تمت الموافقة على حسابه
- ✅ فصيلة دمه تطابق الطلب
- ✅ مؤهل للتبرع (مر 56 يوماً على آخر تبرع)
- ✅ لم يستجب لنفس الطلب مسبقاً

### 📊 لوحة تحكم المتبرع

**تعرض لوحة التحكم:**
- 📈 إجمالي عدد التبرعات
- 📅 تاريخ آخر تبرع
- ⏰ موعد التبرع القادم المتاح
- 📋 الاستجابات المعلقة
- 🔔 الإشعارات الحديثة
- 🚨 الطلبات العاجلة والطارئة
- 🩸 معلومات فصيلة الدم

### 🔄 دورة حياة الاستجابة

**مراحل حالة الاستجابة:**

```
معلق (Pending)
    ↓
تم الاتصال (Contacted)
    ↓
مؤكد (Confirmed)
    ↓
مكتمل (Completed)
```

**أو:**
```
معلق (Pending) → مرفوض (Rejected)
```

**أو:**
```
أي حالة → ملغى (Cancelled)
```

### 🔔 نظام الإشعارات

**يرسل النظام إشعارات للمتبرع عند:**
- 🆕 وجود طلب دم جديد يطابق فصيلة دمه
- 🔄 تحديث حالة استجابته
- ✅ الموافقة على حسابه أو رفضه
- 📅 اقتراب موعد التبرع المؤكد
- 🧪 توفر نتائج الفحوصات المخبرية
- ⚠️ طلبات طارئة تحتاج لفصيلة دمه

### 📋 تتبع التبرعات

**يمكن للمتبرع عرض:**
- 📅 تاريخ كل تبرع
- 💉 الكمية المتبرع بها (بالملليلتر)
- 🧪 نتائج الفحوصات (معلق، مقبول، مرفوض)
- 📄 التقارير المخبرية الكاملة
- 📥 تحميل التقارير بصيغة PDF
- 📝 ملاحظات الموظفين

### 🎯 معايير الأهلية للتبرع

**الشروط الأساسية:**
- العمر: 18-65 سنة
- الوزن: أكثر من 50 كجم
- الفترة بين التبرعات: 56 يوماً على الأقل
- صحة جيدة وخالي من الأمراض المعدية
- عدم تناول أدوية معينة
- ضغط الدم ضمن المعدل الطبيعي

### 📊 الإحصائيات

- **عدد حالات الاستخدام:** ~60 حالة
- **عدد المجموعات الرئيسية:** 7 مجموعات
- **عدد الأدوار المتفاعلة:** 2 (المتبرع، نظام الإشعارات)

