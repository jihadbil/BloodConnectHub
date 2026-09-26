# مخطط حالات الاستخدام - المدير

## مخطط شامل لجميع وظائف المدير في نظام BloodConnectHub



graph TB
    %% تعريف الأدوار
    Admin[👨‍💼 المدير]
    ReportingSystem[📊 نظام التقارير]
    NotificationSystem[🔔 نظام الإشعارات]

    %% ==========================================
    %% المصادقة والملف الشخصي
    %% ==========================================
    subgraph AuthProfile[المصادقة والملف الشخصي]
        UC_Login[تسجيل الدخول كمدير]
        UC_Logout[تسجيل الخروج]
        UC_ViewProfile[عرض الملف الشخصي]
        UC_UpdateProfile[تحديث الملف الشخصي]
        UC_ChangePassword[تغيير كلمة المرور]
    end

    %% ==========================================
    %% لوحة تحكم المدير
    %% ==========================================
    subgraph AdminDashboard[لوحة تحكم المدير]
        UC_Dashboard[لوحة التحكم الرئيسية]
        UC_SystemStats[إحصائيات النظام]
        UC_ActiveDonors[عدد المتبرعين النشطين]
        UC_DonationsMonth[تبرعات هذا الشهر]
        UC_PendingRequests[الطلبات المعلقة]
        UC_EmergencyRequests[الطلبات الطارئة]
        UC_InventoryStatus[حالة المخزون]
        UC_ExpiringAlert[تنبيه الوحدات القريبة من الانتهاء]
        UC_LowStockAlert[تنبيه المخزون المنخفض]
    end

    %% ==========================================
    %% إدارة المستخدمين
    %% ==========================================
    subgraph UserManagement[إدارة المستخدمين]
        UC_ManageUsers[إدارة المستخدمين]
        UC_ViewUsers[عرض جميع المستخدمين]
        UC_SearchUsers[البحث عن مستخدمين]
        UC_FilterByRole[تصفية حسب الدور]
        UC_AddUser[إضافة مستخدم جديد]
        UC_UpdateUser[تحديث بيانات مستخدم]
        UC_DeleteUser[حذف مستخدم]
        UC_ActivateUser[تفعيل حساب مستخدم]
        UC_DeactivateUser[تعطيل حساب مستخدم]
        UC_ResetPassword[إعادة تعيين كلمة المرور]
        UC_UserActivityLog[سجل نشاط المستخدم]
    end


    %% ==========================================
    %% إدارة الأدوار والصلاحيات
    %% ==========================================
    subgraph RoleManagement[إدارة الأدوار والصلاحيات]
        UC_ManageRoles[إدارة الأدوار]
        UC_ViewRoles[عرض جميع الأدوار]
        UC_AssignRole[تعيين دور لمستخدم]
        UC_RemoveRole[إزالة دور من مستخدم]
        UC_CreateRole[إنشاء دور مخصص]
        UC_UpdateRolePermissions[تحديث صلاحيات الدور]
        UC_DeleteRole[حذف دور]
        UC_ViewPermissions[عرض الصلاحيات]
    end

    %% ==========================================
    %% إدارة الموظفين
    %% ==========================================
    subgraph StaffManagement[إدارة الموظفين]
        UC_ManageStaff[إدارة الموظفين]
        UC_ViewStaff[عرض جميع الموظفين]
        UC_AddStaff[إضافة موظف جديد]
        UC_UpdateStaff[تحديث بيانات موظف]
        UC_RemoveStaff[إزالة موظف]
        UC_AssignStaffPermissions[تعيين صلاحيات الموظف]
        UC_StaffPerformance[عرض أداء الموظف]
        UC_StaffActivity[عرض نشاط الموظف]
    end

    %% ==========================================
    %% إدارة المتبرعين (مستوى المدير)
    %% ==========================================
    subgraph DonorManagement[إدارة المتبرعين]
        UC_ManageDonors[إدارة جميع المتبرعين]
        UC_ViewDonors[عرض جميع المتبرعين]
        UC_ApproveDonor[الموافقة على تسجيل متبرع]
        UC_RejectDonor[رفض تسجيل متبرع]
        UC_BulkApprove[الموافقة الجماعية]
        UC_PendingApprovals[عرض الموافقات المعلقة]
        UC_VerifyDocs[التحقق من الوثائق الطبية]
        UC_LinkDonor[ربط متبرع بحساب مستخدم]
        UC_UnlinkDonor[فك ربط متبرع من مستخدم]
        UC_DonorStats[إحصائيات المتبرعين]
        UC_ExportDonors[تصدير بيانات المتبرعين]
    end


    %% ==========================================
    %% إدارة المرضى (مستوى المدير)
    %% ==========================================
    subgraph PatientManagement[إدارة المرضى]
        UC_ManagePatients[إدارة جميع المرضى]
        UC_ViewPatients[عرض جميع المرضى]
        UC_AddPatient[إضافة مريض]
        UC_UpdatePatient[تحديث بيانات مريض]
        UC_DeletePatient[حذف مريض]
        UC_PatientHistory[عرض سجل المريض]
        UC_PatientRequests[عرض طلبات المريض]
        UC_ExportPatients[تصدير بيانات المرضى]
    end

    %% ==========================================
    %% إدارة التبرعات (مستوى المدير)
    %% ==========================================
    subgraph DonationManagement[إدارة التبرعات]
        UC_ManageDonations[إدارة جميع التبرعات]
        UC_ViewDonations[عرض جميع التبرعات]
        UC_RecordDonation[تسجيل تبرع جديد]
        UC_UpdateDonation[تحديث بيانات تبرع]
        UC_DeleteDonation[حذف تبرع]
        UC_ApproveLabTest[الموافقة على نتائج الفحص]
        UC_RejectLabTest[رفض نتائج الفحص]
        UC_DonationStats[إحصائيات التبرعات]
        UC_ExportDonations[تصدير بيانات التبرعات]
    end

    %% ==========================================
    %% إدارة المخزون (مستوى المدير)
    %% ==========================================
    subgraph InventoryManagement[إدارة المخزون]
        UC_ManageInventory[إدارة المخزون]
        UC_ViewInventory[عرض المخزون الكامل]
        UC_UpdateQuantities[تحديث كميات الدم]
        UC_SetThresholds[تعيين حدود المخزون المنخفض]
        UC_ViewExpiring[عرض الوحدات القريبة من الانتهاء]
        UC_RemoveExpired[إزالة الوحدات المنتهية]
        UC_ReserveUnits[حجز وحدات دم]
        UC_ReleaseUnits[إلغاء حجز وحدات]
        UC_TransferUnits[نقل وحدات دم]
        UC_InventoryHistory[سجل المخزون]
        UC_ExportInventory[تصدير بيانات المخزون]
    end


    %% ==========================================
    %% إدارة طلبات الدم (مستوى المدير)
    %% ==========================================
    subgraph RequestManagement[إدارة طلبات الدم]
        UC_ManageRequests[إدارة جميع الطلبات]
        UC_ViewRequests[عرض جميع طلبات الدم]
        UC_CreateRequest[إنشاء طلب دم]
        UC_UpdateRequestStatus[تحديث حالة الطلب]
        UC_FulfillRequest[تنفيذ الطلب]
        UC_CancelRequest[إلغاء الطلب]
        UC_PrioritizeRequests[تحديد أولوية الطلبات]
        UC_RequestHistory[سجل الطلبات]
        UC_ExportRequests[تصدير بيانات الطلبات]
    end

    %% ==========================================
    %% التقارير والتحليلات
    %% ==========================================
    subgraph Reports[التقارير والتحليلات]
        UC_ReportsDashboard[لوحة التقارير]
        
        subgraph DonorReports[تقارير المتبرعين]
            UC_DonorsByBloodType[المتبرعون حسب فصيلة الدم]
            UC_ActiveVsInactive[المتبرعون النشطون مقابل غير النشطين]
            UC_DonorsByCity[المتبرعون حسب المدينة]
            UC_EligibleDonors[تقرير المتبرعين المؤهلين]
        end
        
        subgraph DonationReports[تقارير التبرعات]
            UC_DonationsByPeriod[التبرعات حسب الفترة]
            UC_BloodQuantity[كمية الدم حسب الفصيلة]
            UC_TestResultsStats[إحصائيات نتائج الفحوصات]
            UC_MostActiveDonors[أكثر المتبرعين نشاطاً]
        end
        
        subgraph InventoryReports[تقارير المخزون]
            UC_InventoryAvailability[توفر المخزون]
            UC_ExpiringUnitsReport[تقرير الوحدات القريبة من الانتهاء]
            UC_ExpiredUnitsReport[تقرير الوحدات المنتهية]
            UC_ConsumptionRate[تحليل معدل الاستهلاك]
            UC_LowInventoryAlerts[تنبيهات المخزون المنخفض]
        end
        
        subgraph RequestReports[تقارير الطلبات]
            UC_RequestsByStatus[الطلبات حسب الحالة]
            UC_RequestsByUrgency[الطلبات حسب الاستعجال]
            UC_FulfillmentRate[معدل تنفيذ الطلبات]
            UC_AvgFulfillmentTime[متوسط وقت التنفيذ]
        end
        
        UC_CustomReport[إنشاء تقرير مخصص]
        UC_ScheduleReports[جدولة التقارير التلقائية]
        UC_ExportReports[تصدير التقارير PDF/Excel]
        UC_PrintReports[طباعة التقارير]
        UC_EmailReports[إرسال التقارير بالبريد]
    end


    %% ==========================================
    %% إعدادات النظام
    %% ==========================================
    subgraph SystemConfig[إعدادات النظام]
        UC_SystemSettings[إعدادات النظام]
        UC_BloodTypeThresholds[تعيين حدود فصائل الدم]
        UC_NotificationRules[قواعد الإشعارات]
        UC_EligibilityRules[قواعد الأهلية]
        UC_EmailTemplates[قوالب البريد الإلكتروني]
        UC_SystemParameters[معاملات النظام]
        UC_BackupSettings[إعدادات النسخ الاحتياطي]
        UC_SystemLogs[سجلات النظام]
        UC_ClearCache[مسح ذاكرة التخزين المؤقت]
    end

    %% ==========================================
    %% إدارة الإشعارات
    %% ==========================================
    subgraph NotificationMgmt[إدارة الإشعارات]
        UC_ViewNotifications[عرض جميع الإشعارات]
        UC_BulkNotifications[إرسال إشعارات جماعية]
        UC_CreateAnnouncement[إنشاء إعلان]
        UC_NotifyEligibleDonors[إشعار المتبرعين المؤهلين]
        UC_EmergencyAlerts[تنبيهات الطوارئ]
        UC_NotificationHistory[سجل الإشعارات]
    end

    %% ==========================================
    %% التدقيق والأمان
    %% ==========================================
    subgraph AuditSecurity[التدقيق والأمان]
        UC_AuditLogs[سجلات التدقيق]
        UC_TrackActions[تتبع إجراءات المستخدمين]
        UC_LoginHistory[سجل تسجيلات الدخول]
        UC_MonitorSecurity[مراقبة أمان النظام]
        UC_ReviewChanges[مراجعة التغييرات]
        UC_ExportAudit[تصدير تقارير التدقيق]
        UC_SecurityPolicies[سياسات الأمان]
    end


    %% ==========================================
    %% علاقات المدير - المصادقة
    %% ==========================================
    Admin --> UC_Login
    Admin --> UC_Logout
    Admin --> UC_ViewProfile
    Admin --> UC_UpdateProfile
    Admin --> UC_ChangePassword

    %% ==========================================
    %% علاقات المدير - لوحة التحكم
    %% ==========================================
    Admin --> UC_Dashboard
    Admin --> UC_SystemStats
    Admin --> UC_ActiveDonors
    Admin --> UC_DonationsMonth
    Admin --> UC_PendingRequests
    Admin --> UC_EmergencyRequests
    Admin --> UC_InventoryStatus
    Admin --> UC_ExpiringAlert
    Admin --> UC_LowStockAlert

    %% ==========================================
    %% علاقات المدير - إدارة المستخدمين
    %% ==========================================
    Admin --> UC_ManageUsers
    Admin --> UC_ViewUsers
    Admin --> UC_SearchUsers
    Admin --> UC_FilterByRole
    Admin --> UC_AddUser
    Admin --> UC_UpdateUser
    Admin --> UC_DeleteUser
    Admin --> UC_ActivateUser
    Admin --> UC_DeactivateUser
    Admin --> UC_ResetPassword
    Admin --> UC_UserActivityLog

    %% ==========================================
    %% علاقات المدير - إدارة الأدوار
    %% ==========================================
    Admin --> UC_ManageRoles
    Admin --> UC_ViewRoles
    Admin --> UC_AssignRole
    Admin --> UC_RemoveRole
    Admin --> UC_CreateRole
    Admin --> UC_UpdateRolePermissions
    Admin --> UC_DeleteRole
    Admin --> UC_ViewPermissions

    %% ==========================================
    %% علاقات المدير - إدارة الموظفين
    %% ==========================================
    Admin --> UC_ManageStaff
    Admin --> UC_ViewStaff
    Admin --> UC_AddStaff
    Admin --> UC_UpdateStaff
    Admin --> UC_RemoveStaff
    Admin --> UC_AssignStaffPermissions
    Admin --> UC_StaffPerformance
    Admin --> UC_StaffActivity


    %% ==========================================
    %% علاقات المدير - إدارة المتبرعين
    %% ==========================================
    Admin --> UC_ManageDonors
    Admin --> UC_ViewDonors
    Admin --> UC_ApproveDonor
    Admin --> UC_RejectDonor
    Admin --> UC_BulkApprove
    Admin --> UC_PendingApprovals
    Admin --> UC_VerifyDocs
    Admin --> UC_LinkDonor
    Admin --> UC_UnlinkDonor
    Admin --> UC_DonorStats
    Admin --> UC_ExportDonors

    %% ==========================================
    %% علاقات المدير - إدارة المرضى
    %% ==========================================
    Admin --> UC_ManagePatients
    Admin --> UC_ViewPatients
    Admin --> UC_AddPatient
    Admin --> UC_UpdatePatient
    Admin --> UC_DeletePatient
    Admin --> UC_PatientHistory
    Admin --> UC_PatientRequests
    Admin --> UC_ExportPatients

    %% ==========================================
    %% علاقات المدير - إدارة التبرعات
    %% ==========================================
    Admin --> UC_ManageDonations
    Admin --> UC_ViewDonations
    Admin --> UC_RecordDonation
    Admin --> UC_UpdateDonation
    Admin --> UC_DeleteDonation
    Admin --> UC_ApproveLabTest
    Admin --> UC_RejectLabTest
    Admin --> UC_DonationStats
    Admin --> UC_ExportDonations

    %% ==========================================
    %% علاقات المدير - إدارة المخزون
    %% ==========================================
    Admin --> UC_ManageInventory
    Admin --> UC_ViewInventory
    Admin --> UC_UpdateQuantities
    Admin --> UC_SetThresholds
    Admin --> UC_ViewExpiring
    Admin --> UC_RemoveExpired
    Admin --> UC_ReserveUnits
    Admin --> UC_ReleaseUnits
    Admin --> UC_TransferUnits
    Admin --> UC_InventoryHistory
    Admin --> UC_ExportInventory

    %% ==========================================
    %% علاقات المدير - إدارة الطلبات
    %% ==========================================
    Admin --> UC_ManageRequests
    Admin --> UC_ViewRequests
    Admin --> UC_CreateRequest
    Admin --> UC_UpdateRequestStatus
    Admin --> UC_FulfillRequest
    Admin --> UC_CancelRequest
    Admin --> UC_PrioritizeRequests
    Admin --> UC_RequestHistory
    Admin --> UC_ExportRequests


    %% ==========================================
    %% علاقات المدير - التقارير
    %% ==========================================
    Admin --> UC_ReportsDashboard
    Admin --> UC_DonorsByBloodType
    Admin --> UC_ActiveVsInactive
    Admin --> UC_DonorsByCity
    Admin --> UC_EligibleDonors
    Admin --> UC_DonationsByPeriod
    Admin --> UC_BloodQuantity
    Admin --> UC_TestResultsStats
    Admin --> UC_MostActiveDonors
    Admin --> UC_InventoryAvailability
    Admin --> UC_ExpiringUnitsReport
    Admin --> UC_ExpiredUnitsReport
    Admin --> UC_ConsumptionRate
    Admin --> UC_LowInventoryAlerts
    Admin --> UC_RequestsByStatus
    Admin --> UC_RequestsByUrgency
    Admin --> UC_FulfillmentRate
    Admin --> UC_AvgFulfillmentTime
    Admin --> UC_CustomReport
    Admin --> UC_ScheduleReports
    Admin --> UC_ExportReports
    Admin --> UC_PrintReports
    Admin --> UC_EmailReports

    %% ==========================================
    %% علاقات المدير - إعدادات النظام
    %% ==========================================
    Admin --> UC_SystemSettings
    Admin --> UC_BloodTypeThresholds
    Admin --> UC_NotificationRules
    Admin --> UC_EligibilityRules
    Admin --> UC_EmailTemplates
    Admin --> UC_SystemParameters
    Admin --> UC_BackupSettings
    Admin --> UC_SystemLogs
    Admin --> UC_ClearCache

    %% ==========================================
    %% علاقات المدير - الإشعارات
    %% ==========================================
    Admin --> UC_ViewNotifications
    Admin --> UC_BulkNotifications
    Admin --> UC_CreateAnnouncement
    Admin --> UC_NotifyEligibleDonors
    Admin --> UC_EmergencyAlerts
    Admin --> UC_NotificationHistory

    %% ==========================================
    %% علاقات المدير - التدقيق والأمان
    %% ==========================================
    Admin --> UC_AuditLogs
    Admin --> UC_TrackActions
    Admin --> UC_LoginHistory
    Admin --> UC_MonitorSecurity
    Admin --> UC_ReviewChanges
    Admin --> UC_ExportAudit
    Admin --> UC_SecurityPolicies


    %% ==========================================
    %% علاقات الأنظمة
    %% ==========================================
    ReportingSystem --> UC_ScheduleReports
    ReportingSystem --> UC_EmailReports
    NotificationSystem --> UC_EmergencyAlerts
    NotificationSystem --> UC_LowStockAlert

    %% ==========================================
    %% علاقات Include
    %% ==========================================
    UC_Dashboard -.->|يتضمن| UC_SystemStats
    UC_Dashboard -.->|يتضمن| UC_InventoryStatus
    UC_Dashboard -.->|يتضمن| UC_LowStockAlert
    UC_ManageUsers -.->|يتضمن| UC_ViewUsers
    UC_ManageDonors -.->|يتضمن| UC_ViewDonors
    UC_ManageStaff -.->|يتضمن| UC_ViewStaff
    UC_ApproveDonor -.->|يتضمن| UC_VerifyDocs
    UC_FulfillRequest -.->|يتضمن| UC_UpdateQuantities
    UC_RecordDonation -.->|يتضمن| UC_UpdateQuantities
    UC_BulkNotifications -.->|يتضمن| NotificationSystem
    UC_EmergencyAlerts -.->|يتضمن| NotificationSystem

    %% ==========================================
    %% علاقات Extend
    %% ==========================================
    UC_ExportReports -.->|يمتد| UC_ReportsDashboard
    UC_PrintReports -.->|يمتد| UC_ReportsDashboard
    UC_EmailReports -.->|يمتد| UC_ReportsDashboard
    UC_BulkApprove -.->|يمتد| UC_ApproveDonor
    UC_ResetPassword -.->|يمتد| UC_UpdateUser

    %% تنسيق الألوان
    classDef authStyle fill:#FFEBEE,stroke:#C62828,stroke-width:2px
    classDef dashboardStyle fill:#E8EAF6,stroke:#3F51B5,stroke-width:2px
    classDef userStyle fill:#E1F5FE,stroke:#0277BD,stroke-width:2px
    classDef roleStyle fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px
    classDef staffStyle fill:#E8F5E9,stroke:#388E3C,stroke-width:2px
    classDef donorStyle fill:#FFF9C4,stroke:#F57C00,stroke-width:2px
    classDef patientStyle fill:#FFCCBC,stroke:#D84315,stroke-width:2px
    classDef donationStyle fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px
    classDef inventoryStyle fill:#B2DFDB,stroke:#00796B,stroke-width:2px
    classDef requestStyle fill:#F8BBD0,stroke:#C2185B,stroke-width:2px
    classDef reportStyle fill:#E1BEE7,stroke:#6A1B9A,stroke-width:2px
    classDef configStyle fill:#CFD8DC,stroke:#455A64,stroke-width:2px
    classDef notificationStyle fill:#FFF59D,stroke:#F9A825,stroke-width:2px
    classDef auditStyle fill:#FFCCBC,stroke:#BF360C,stroke-width:2px
    
    class UC_Login,UC_Logout,UC_ViewProfile,UC_UpdateProfile,UC_ChangePassword authStyle
    class UC_Dashboard,UC_SystemStats,UC_ActiveDonors,UC_DonationsMonth,UC_PendingRequests,UC_EmergencyRequests,UC_InventoryStatus,UC_ExpiringAlert,UC_LowStockAlert dashboardStyle
    class UC_ManageUsers,UC_ViewUsers,UC_SearchUsers,UC_FilterByRole,UC_AddUser,UC_UpdateUser,UC_DeleteUser,UC_ActivateUser,UC_DeactivateUser,UC_ResetPassword,UC_UserActivityLog userStyle
    class UC_ManageRoles,UC_ViewRoles,UC_AssignRole,UC_RemoveRole,UC_CreateRole,UC_UpdateRolePermissions,UC_DeleteRole,UC_ViewPermissions roleStyle
    class UC_ManageStaff,UC_ViewStaff,UC_AddStaff,UC_UpdateStaff,UC_RemoveStaff,UC_AssignStaffPermissions,UC_StaffPerformance,UC_StaffActivity staffStyle
    class UC_ManageDonors,UC_ViewDonors,UC_ApproveDonor,UC_RejectDonor,UC_BulkApprove,UC_PendingApprovals,UC_VerifyDocs,UC_LinkDonor,UC_UnlinkDonor,UC_DonorStats,UC_ExportDonors donorStyle
    class UC_ManagePatients,UC_ViewPatients,UC_AddPatient,UC_UpdatePatient,UC_DeletePatient,UC_PatientHistory,UC_PatientRequests,UC_ExportPatients patientStyle
    class UC_ManageDonations,UC_ViewDonations,UC_RecordDonation,UC_UpdateDonation,UC_DeleteDonation,UC_ApproveLabTest,UC_RejectLabTest,UC_DonationStats,UC_ExportDonations donationStyle
    class UC_ManageInventory,UC_ViewInventory,UC_UpdateQuantities,UC_SetThresholds,UC_ViewExpiring,UC_RemoveExpired,UC_ReserveUnits,UC_ReleaseUnits,UC_TransferUnits,UC_InventoryHistory,UC_ExportInventory inventoryStyle
    class UC_ManageRequests,UC_ViewRequests,UC_CreateRequest,UC_UpdateRequestStatus,UC_FulfillRequest,UC_CancelRequest,UC_PrioritizeRequests,UC_RequestHistory,UC_ExportRequests requestStyle
    class UC_ReportsDashboard,UC_DonorsByBloodType,UC_ActiveVsInactive,UC_DonorsByCity,UC_EligibleDonors,UC_DonationsByPeriod,UC_BloodQuantity,UC_TestResultsStats,UC_MostActiveDonors,UC_InventoryAvailability,UC_ExpiringUnitsReport,UC_ExpiredUnitsReport,UC_ConsumptionRate,UC_LowInventoryAlerts,UC_RequestsByStatus,UC_RequestsByUrgency,UC_FulfillmentRate,UC_AvgFulfillmentTime,UC_CustomReport,UC_ScheduleReports,UC_ExportReports,UC_PrintReports,UC_EmailReports reportStyle
    class UC_SystemSettings,UC_BloodTypeThresholds,UC_NotificationRules,UC_EligibilityRules,UC_EmailTemplates,UC_SystemParameters,UC_BackupSettings,UC_SystemLogs,UC_ClearCache configStyle
    class UC_ViewNotifications,UC_BulkNotifications,UC_CreateAnnouncement,UC_NotifyEligibleDonors,UC_EmergencyAlerts,UC_NotificationHistory notificationStyle
    class UC_AuditLogs,UC_TrackActions,UC_LoginHistory,UC_MonitorSecurity,UC_ReviewChanges,UC_ExportAudit,UC_SecurityPolicies auditStyle



## 📝 ملاحظات مهمة

### 🎯 لوحة تحكم المدير

**تعرض لوحة التحكم:**
- 📊 إحصائيات النظام في الوقت الفعلي
- 🚨 التنبيهات الحرجة والطارئة
- ⏳ الموافقات المعلقة
- ⚠️ تحذيرات المخزون المنخفض
- 🆘 الطلبات الطارئة
- 📈 النشاطات الأخيرة
- 👥 عدد المتبرعين النشطين
- 💉 تبرعات الشهر الحالي
- 📦 حالة المخزون لجميع الفصائل
- ⏰ الوحدات القريبة من الانتهاء

### 👥 إدارة المستخدمين

**تشمل إدارة المستخدمين:**
- ➕ إنشاء/تحديث/حذف المستخدمين
- 🎭 تعيين/إزالة الأدوار
- ✅ تفعيل/تعطيل الحسابات
- 🔑 إعادة تعيين كلمات المرور
- 📋 عرض سجلات النشاط
- 🔍 البحث والتصفية المتقدمة
- 📊 تتبع أداء المستخدمين

### 🎭 إدارة الأدوار والصلاحيات

**الأدوار المتاحة في النظام:**
- 👨‍💼 **مدير (Admin):** صلاحيات كاملة
- 👨‍⚕️ **موظف بنك الدم (Staff):** إدارة العمليات اليومية
- 👨‍⚕️ **طبيب (Doctor):** عرض البيانات الطبية
- 👩‍⚕️ **ممرض (Nurse):** مساعدة في العمليات
- 🩸 **متبرع (Donor):** الاستجابة للطلبات

**يمكن للمدير:**
- إنشاء أدوار مخصصة
- تحديد صلاحيات كل دور
- تعيين أدوار متعددة لمستخدم واحد
- عرض جميع الصلاحيات لكل دور


### 📊 نظام التقارير الشامل

**تقارير المتبرعين:**
- 🩸 توزيع المتبرعين حسب فصيلة الدم
- ✅ المتبرعون النشطون مقابل غير النشطين
- 🌍 توزيع المتبرعين حسب المدينة
- ✔️ المتبرعون المؤهلون للتبرع حالياً

**تقارير التبرعات:**
- 📅 التبرعات حسب الفترة (يوم/أسبوع/شهر/سنة)
- 💉 كمية الدم المجمعة حسب الفصيلة
- 🧪 إحصائيات نتائج الفحوصات
- 🏆 أكثر المتبرعين نشاطاً

**تقارير المخزون:**
- 📦 توفر المخزون لكل فصيلة
- ⏰ الوحدات القريبة من الانتهاء
- ❌ الوحدات المنتهية والمهدرة
- 📉 تحليل معدل الاستهلاك
- ⚠️ تنبيهات المخزون المنخفض

**تقارير الطلبات:**
- 📊 الطلبات حسب الحالة
- 🚨 الطلبات حسب مستوى الاستعجال
- ✅ معدل تنفيذ الطلبات
- ⏱️ متوسط وقت تنفيذ الطلبات

**مميزات التقارير:**
- 🎨 إنشاء تقارير مخصصة
- ⏰ جدولة التقارير التلقائية
- 📄 تصدير بصيغ متعددة (PDF, Excel, CSV)
- 🖨️ طباعة مباشرة
- 📧 إرسال التقارير بالبريد الإلكتروني

### ⚙️ إعدادات النظام

**يمكن للمدير تكوين:**
- 🩸 حدود المخزون المنخفض لكل فصيلة دم
- 🔔 قواعد إرسال الإشعارات
- ✅ معايير أهلية المتبرعين
- 📧 قوالب البريد الإلكتروني
- 🔧 معاملات النظام العامة
- 💾 إعدادات النسخ الاحتياطي التلقائي
- 📝 عرض سجلات النظام
- 🗑️ مسح ذاكرة التخزين المؤقت


### 🔔 إدارة الإشعارات

**يمكن للمدير:**
- 📢 إرسال إشعارات جماعية لجميع المستخدمين
- 📣 إنشاء إعلانات عامة
- 🩸 إشعار المتبرعين المؤهلين لفصيلة دم معينة
- 🚨 إرسال تنبيهات طوارئ فورية
- 📜 عرض سجل جميع الإشعارات المرسلة
- 📊 تحليل معدلات قراءة الإشعارات

### 🔒 التدقيق والأمان

**نظام التدقيق الشامل:**
- 📋 سجلات تدقيق كاملة لجميع العمليات
- 👤 تتبع إجراءات كل مستخدم
- 🔐 سجل محاولات تسجيل الدخول (ناجحة وفاشلة)
- 🛡️ مراقبة أمان النظام في الوقت الفعلي
- 📝 مراجعة جميع التغييرات على البيانات
- 📤 تصدير تقارير التدقيق للامتثال
- 🔧 تكوين سياسات الأمان

**معلومات التدقيق المسجلة:**
- من قام بالعملية (المستخدم)
- ماذا فعل (نوع العملية)
- متى (التاريخ والوقت)
- أين (عنوان IP)
- التفاصيل (البيانات قبل وبعد التغيير)

### 📦 إدارة المخزون المتقدمة

**وظائف إضافية للمدير:**
- 🔒 حجز وحدات دم لطلبات محددة
- 🔓 إلغاء حجز الوحدات
- 🔄 نقل وحدات بين المواقع
- 📊 عرض سجل كامل لحركة المخزون
- ⚙️ تعيين حدود مخصصة لكل فصيلة
- 🗑️ إزالة الوحدات المنتهية يدوياً أو تلقائياً
- 📈 تحليل اتجاهات الاستهلاك

### 🎯 الموافقة على المتبرعين

**عملية الموافقة:**
1. 📋 عرض طلبات التسجيل المعلقة
2. 📄 مراجعة الوثائق الطبية المرفقة
3. ✅ الموافقة أو ❌ الرفض مع ذكر السبب
4. 🔔 إرسال إشعار تلقائي للمتبرع
5. 📊 تحديث الإحصائيات

**الموافقة الجماعية:**
- يمكن الموافقة على عدة متبرعين دفعة واحدة
- تصفية حسب فصيلة الدم أو المدينة
- مراجعة سريعة للوثائق


### 🔄 علاقات Include و Extend

**علاقات Include (يتضمن):**
- **لوحة التحكم** تتضمن **إحصائيات النظام** و **حالة المخزون** و **تنبيهات المخزون المنخفض**
- **إدارة المستخدمين** تتضمن **عرض المستخدمين**
- **إدارة المتبرعين** تتضمن **عرض المتبرعين**
- **الموافقة على متبرع** تتضمن **التحقق من الوثائق**
- **تنفيذ طلب** تتضمن **تحديث الكميات**
- **تسجيل تبرع** تتضمن **تحديث الكميات**
- **الإشعارات الجماعية** تتضمن **نظام الإشعارات**

**علاقات Extend (يمتد):**
- **تصدير التقارير** يمتد من **لوحة التقارير**
- **طباعة التقارير** يمتد من **لوحة التقارير**
- **إرسال التقارير بالبريد** يمتد من **لوحة التقارير**
- **الموافقة الجماعية** تمتد من **الموافقة على متبرع**
- **إعادة تعيين كلمة المرور** تمتد من **تحديث مستخدم**

### 📊 الإحصائيات

- **عدد حالات الاستخدام:** ~120 حالة
- **عدد المجموعات الرئيسية:** 13 مجموعة
- **عدد الأدوار المتفاعلة:** 3 (المدير، نظام التقارير، نظام الإشعارات)
- **عدد أنواع التقارير:** 4 فئات رئيسية (متبرعين، تبرعات، مخزون، طلبات)

### 🎨 دليل الألوان

| اللون | الاستخدام |
|------|----------|
| 🔴 أحمر فاتح | المصادقة والملف الشخصي |
| 🔵 أزرق بنفسجي | لوحة التحكم |
| 🔵 أزرق فاتح | إدارة المستخدمين |
| 🟣 بنفسجي | إدارة الأدوار |
| 🟢 أخضر فاتح | إدارة الموظفين |
| 🟡 أصفر فاتح | إدارة المتبرعين |
| 🟠 برتقالي فاتح | إدارة المرضى |
| 🟢 أخضر | إدارة التبرعات |
| 🔵 أزرق مخضر | إدارة المخزون |
| 🔴 وردي | إدارة الطلبات |
| 🟣 بنفسجي فاتح | التقارير |
| ⚪ رمادي | إعدادات النظام |
| 🟡 أصفر | إدارة الإشعارات |
| 🟠 برتقالي | التدقيق والأمان |

### 🔐 الصلاحيات الخاصة بالمدير

**المدير له صلاحيات حصرية في:**
- إدارة المستخدمين والأدوار
- تعيين وإزالة الصلاحيات
- الوصول إلى سجلات التدقيق الكاملة
- تكوين إعدادات النظام
- إدارة النسخ الاحتياطي
- عرض جميع البيانات الحساسة
- حذف السجلات
- تصدير البيانات الكاملة

**بالإضافة إلى جميع صلاحيات الموظف:**
- إدارة المتبرعين والمرضى
- تسجيل التبرعات
- إدارة المخزون
- إدارة طلبات الدم
- عرض التقارير

