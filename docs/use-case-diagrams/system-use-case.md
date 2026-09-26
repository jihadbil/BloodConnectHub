# مخطط حالات الاستخدام الشامل - نظام BloodConnectHub

## نظرة عامة على النظام


graph TB
    %% تعريف الأدوار
    Guest[👤 زائر]
    Donor[🩸 متبرع]
    Staff[👨‍⚕️ موظف]
    Admin[👨‍💼 مدير النظام]
    System[🤖 النظام]

    %% ==========================================
    %% الوصول العام
    %% ==========================================
    subgraph PublicAccess[الوصول العام]
        UC_Home[عرض الصفحة الرئيسية]
        UC_ViewRequests[عرض طلبات الدم]
        UC_ViewUrgent[عرض الطلبات العاجلة]
        UC_About[عرض صفحة من نحن]
        UC_Contact[عرض صفحة اتصل بنا]
        UC_Login[تسجيل الدخول]
        UC_RegisterDonor[التسجيل كمتبرع]
        UC_StaffLogin[تسجيل دخول الموظفين]
        UC_StaffRegister[تسجيل موظف جديد]
    end

    %% ==========================================
    %% وظائف المتبرع
    %% ==========================================
    subgraph DonorFunctions[وظائف المتبرع]
        UC_DonorDashboard[لوحة تحكم المتبرع]
        UC_MyDonations[عرض تبرعاتي]
        UC_RespondRequest[الاستجابة لطلب دم]
        UC_MyResponses[عرض استجاباتي]
        UC_UpdateResponse[تحديث حالة الاستجابة]
        UC_CancelResponse[إلغاء الاستجابة]
        UC_ViewProfile[عرض الملف الشخصي]
        UC_UpdateProfile[تحديث الملف الشخصي]
        UC_ChangePassword[تغيير كلمة المرور]
        UC_ViewNotifications[عرض الإشعارات]
        UC_MarkRead[تحديد كمقروء]
    end

    %% ==========================================
    %% وظائف الموظف
    %% ==========================================
    subgraph StaffFunctions[وظائف الموظف]
        UC_StaffDashboard[لوحة تحكم الموظف]
        
        subgraph DonorMgmt[إدارة المتبرعين]
            UC_ManageDonors[إدارة المتبرعين]
            UC_ApproveDonor[الموافقة/رفض متبرع]
            UC_CheckEligibility[فحص أهلية المتبرع]
            UC_ViewMedicalDocs[عرض الوثائق الطبية]
            UC_VerifyMedicalDocs[التحقق من الوثائق]
        end
        
        subgraph PatientMgmt[إدارة المرضى]
            UC_ManagePatients[إدارة المرضى]
            UC_AddPatient[إضافة مريض]
            UC_UpdatePatient[تحديث بيانات مريض]
        end
        
        subgraph DonationMgmt[إدارة التبرعات]
            UC_ManageDonations[إدارة التبرعات]
            UC_RecordDonation[تسجيل تبرع]
            UC_PerformLabTest[إجراء فحص مخبري]
            UC_UpdateTestResult[تحديث نتيجة الفحص]
        end
        
        subgraph InventoryMgmt[إدارة المخزون]
            UC_ManageInventory[إدارة المخزون]
            UC_InventorySummary[ملخص المخزون]
            UC_UpdateQuantity[تحديث الكميات]
            UC_ViewLowStock[عرض المخزون المنخفض]
            UC_ViewExpiring[عرض الوحدات القريبة من الانتهاء]
            UC_RemoveExpired[إزالة الوحدات المنتهية]
        end
        
        subgraph RequestMgmt[إدارة الطلبات]
            UC_ManageRequests[إدارة طلبات الدم]
            UC_CreateRequest[إنشاء طلب دم]
            UC_UpdateRequestStatus[تحديث حالة الطلب]
            UC_FulfillRequest[تنفيذ الطلب]
            UC_CancelRequest[إلغاء الطلب]
        end
        
        subgraph Reports[التقارير والإحصائيات]
            UC_ReportsDashboard[لوحة التقارير]
            UC_DonorReports[تقارير المتبرعين]
            UC_DonationReports[تقارير التبرعات]
            UC_InventoryReports[تقارير المخزون]
            UC_RequestReports[تقارير الطلبات]
            UC_PrintReports[طباعة التقارير]
        end
    end

    %% ==========================================
    %% وظائف المدير
    %% ==========================================
    subgraph AdminFunctions[وظائف المدير]
        UC_AdminDashboard[لوحة تحكم المدير]
        UC_ManageStaff[إدارة الموظفين]
        UC_ManageUsers[إدارة المستخدمين]
        UC_AssignRoles[تعيين الأدوار]
        UC_ActivateUser[تفعيل/تعطيل مستخدم]
        UC_SystemStats[إحصائيات النظام]
    end

    %% ==========================================
    %% وظائف النظام التلقائية
    %% ==========================================
    subgraph SystemFunctions[وظائف النظام التلقائية]
        UC_SendNotifications[إرسال الإشعارات]
        UC_AutoRemoveExpired[إزالة الوحدات المنتهية تلقائياً]
        UC_CheckLowStock[فحص تنبيهات المخزون المنخفض]
        UC_UpdateInventoryStatus[تحديث حالة المخزون]
    end

    %% ==========================================
    %% علاقات الزائر
    %% ==========================================
    Guest --> UC_Home
    Guest --> UC_ViewRequests
    Guest --> UC_ViewUrgent
    Guest --> UC_About
    Guest --> UC_Contact
    Guest --> UC_Login
    Guest --> UC_RegisterDonor
    Guest --> UC_StaffLogin
    Guest --> UC_StaffRegister

    %% ==========================================
    %% علاقات المتبرع
    %% ==========================================
    Donor --> UC_DonorDashboard
    Donor --> UC_MyDonations
    Donor --> UC_RespondRequest
    Donor --> UC_MyResponses
    Donor --> UC_UpdateResponse
    Donor --> UC_CancelResponse
    Donor --> UC_ViewProfile
    Donor --> UC_UpdateProfile
    Donor --> UC_ChangePassword
    Donor --> UC_ViewNotifications
    Donor --> UC_MarkRead

    %% ==========================================
    %% علاقات الموظف
    %% ==========================================
    Staff --> UC_StaffDashboard
    Staff --> UC_ManageDonors
    Staff --> UC_ApproveDonor
    Staff --> UC_CheckEligibility
    Staff --> UC_ViewMedicalDocs
    Staff --> UC_VerifyMedicalDocs
    Staff --> UC_ManagePatients
    Staff --> UC_AddPatient
    Staff --> UC_UpdatePatient
    Staff --> UC_ManageDonations
    Staff --> UC_RecordDonation
    Staff --> UC_PerformLabTest
    Staff --> UC_UpdateTestResult
    Staff --> UC_ManageInventory
    Staff --> UC_InventorySummary
    Staff --> UC_UpdateQuantity
    Staff --> UC_ViewLowStock
    Staff --> UC_ViewExpiring
    Staff --> UC_RemoveExpired
    Staff --> UC_ManageRequests
    Staff --> UC_CreateRequest
    Staff --> UC_UpdateRequestStatus
    Staff --> UC_FulfillRequest
    Staff --> UC_CancelRequest
    Staff --> UC_ReportsDashboard
    Staff --> UC_DonorReports
    Staff --> UC_DonationReports
    Staff --> UC_InventoryReports
    Staff --> UC_RequestReports
    Staff --> UC_PrintReports

    %% ==========================================
    %% علاقات المدير
    %% ==========================================
    Admin --> UC_AdminDashboard
    Admin --> UC_ManageStaff
    Admin --> UC_ManageUsers
    Admin --> UC_AssignRoles
    Admin --> UC_ActivateUser
    Admin --> UC_SystemStats

    %% ==========================================
    %% علاقات النظام
    %% ==========================================
    System --> UC_SendNotifications
    System --> UC_AutoRemoveExpired
    System --> UC_CheckLowStock
    System --> UC_UpdateInventoryStatus

    %% ==========================================
    %% علاقات Include
    %% ==========================================
    UC_RecordDonation -.->|يتضمن| UC_CheckEligibility
    UC_FulfillRequest -.->|يتضمن| UC_UpdateInventoryStatus
    UC_PerformLabTest -.->|يتضمن| UC_UpdateInventoryStatus
    UC_RespondRequest -.->|يتضمن| UC_SendNotifications
    UC_CreateRequest -.->|يتضمن| UC_SendNotifications
    UC_ApproveDonor -.->|يتضمن| UC_SendNotifications

    %% تنسيق الألوان
    classDef publicStyle fill:#E3F2FD,stroke:#1976D2,stroke-width:2px
    classDef donorStyle fill:#E8F5E9,stroke:#388E3C,stroke-width:2px
    classDef staffStyle fill:#FFF9C4,stroke:#F57C00,stroke-width:2px
    classDef adminStyle fill:#FFEBEE,stroke:#C62828,stroke-width:2px
    classDef systemStyle fill:#ECEFF1,stroke:#455A64,stroke-width:2px
    
    class UC_Home,UC_ViewRequests,UC_ViewUrgent,UC_About,UC_Contact,UC_Login,UC_RegisterDonor,UC_StaffLogin,UC_StaffRegister publicStyle
    class UC_DonorDashboard,UC_MyDonations,UC_RespondRequest,UC_MyResponses,UC_UpdateResponse,UC_CancelResponse,UC_ViewProfile,UC_UpdateProfile,UC_ChangePassword,UC_ViewNotifications,UC_MarkRead donorStyle
    class UC_StaffDashboard,UC_ManageDonors,UC_ApproveDonor,UC_CheckEligibility,UC_ViewMedicalDocs,UC_VerifyMedicalDocs,UC_ManagePatients,UC_AddPatient,UC_UpdatePatient,UC_ManageDonations,UC_RecordDonation,UC_PerformLabTest,UC_UpdateTestResult,UC_ManageInventory,UC_InventorySummary,UC_UpdateQuantity,UC_ViewLowStock,UC_ViewExpiring,UC_RemoveExpired,UC_ManageRequests,UC_CreateRequest,UC_UpdateRequestStatus,UC_FulfillRequest,UC_CancelRequest,UC_ReportsDashboard,UC_DonorReports,UC_DonationReports,UC_InventoryReports,UC_RequestReports,UC_PrintReports staffStyle
    class UC_AdminDashboard,UC_ManageStaff,UC_ManageUsers,UC_AssignRoles,UC_ActivateUser,UC_SystemStats adminStyle
    class UC_SendNotifications,UC_AutoRemoveExpired,UC_CheckLowStock,UC_UpdateInventoryStatus systemStyle


## 📝 ملاحظات مهمة

### التسلسل الهرمي للأدوار
- **المتبرع** يرث صلاحيات الزائر
- **الموظف** يرث صلاحيات الزائر
- **المدير** يرث جميع صلاحيات الموظف + صلاحيات إدارية إضافية

### علاقات Include (يتضمن)
تستخدم عندما تكون حالة استخدام جزءاً إلزامياً من حالة أخرى:
- **تسجيل تبرع** يتضمن **فحص أهلية المتبرع**
- **تنفيذ طلب** يتضمن **تحديث حالة المخزون**
- **إجراء فحص مخبري** يتضمن **تحديث حالة المخزون**
- **الاستجابة لطلب** يتضمن **إرسال إشعار**
- **إنشاء طلب دم** يتضمن **إرسال إشعار**
- **الموافقة على متبرع** يتضمن **إرسال إشعار**

### وظائف النظام التلقائية
النظام يقوم بالمهام التالية تلقائياً:
- إرسال الإشعارات للمستخدمين
- إزالة الوحدات المنتهية الصلاحية
- فحص وإرسال تنبيهات المخزون المنخفض
- تحديث حالة المخزون عند التبرعات والطلبات

### الإحصائيات
- **عدد الأدوار:** 5 (زائر، متبرع، موظف، مدير، نظام)
- **عدد حالات الاستخدام:** ~80 حالة
- **عدد المجموعات الرئيسية:** 6 مجموعات

