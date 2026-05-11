# خطة التنفيذ - ميزة الاستجابة لطلب التبرع بالدم
# Implementation Plan - Donor Response to Blood Request Feature

## نظرة عامة / Overview

تهدف هذه الخطة إلى تنفيذ ميزة الاستجابة لطلب التبرع بالدم بشكل تدريجي ومنظم. الميزة تتضمن طبقة API Client، React Hooks، مكونات UI، state machine، وأدوات التحقق من الصحة.

## المهام / Tasks

- [x] 1. إعداد البنية التحتية والأنواع الأساسية
  - إنشاء ملف TypeScript types وenums للاستجابات
  - تعريف ResponseStatus enum مع القيم (Interested=1, Confirmed=2, Donated=3, Rejected=4, NoShow=5, Cancelled=6)
  - تعريف DonorResponse interface مع جميع الحقول المطلوبة
  - تعريف CreateDonorResponseRequest وUpdateResponseStatusRequest interfaces
  - تعريف ResponseStatusLabels للعرض بالعربية
  - _Requirements: 1.1, 2.1, 5.1, 8.3, 8.4, 8.5_

- [ ] 2. تطوير State Machine وأدوات التحقق
  - [x] 2.1 إنشاء responseStateMachine.ts
    - تطبيق دالة isValidTransition للتحقق من صحة انتقالات الحالة
    - تطبيق دالة getAllowedTransitions لإرجاع الانتقالات المسموحة
    - تطبيق دالة isTerminalState للتحقق من الحالات النهائية (Donated, Cancelled)
    - تطبيق جميع قواعد الانتقال المحددة في المتطلبات
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_
  
  - [ ]* 2.2 كتابة property test لـ state machine
    - **Property 4: State Transition Validation**
    - **Property 5: Terminal State Protection**
    - **Validates: Requirements 5.1, 5.6, 5.7, 5.8**
  
  - [x] 2.3 إنشاء responseValidation.ts
    - تطبيق validateCreateRequest للتحقق من بيانات الإنشاء
    - تطبيق validateUpdateRequest للتحقق من بيانات التحديث
    - تطبيق validateCancelRequest للتحقق من سبب الإلغاء
    - تطبيق التحقق من طول الحقول (notes, rejectionReason <= 500 حرف)
    - تطبيق التحقق من صحة IDs (positive integers)
    - _Requirements: 6.2, 6.3, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  
  - [ ]* 2.4 كتابة unit tests لأدوات التحقق
    - اختبار validateCreateRequest مع بيانات صحيحة وخاطئة
    - اختبار validateUpdateRequest مع حالات مختلفة
    - اختبار validateCancelRequest مع أسباب فارغة وصحيحة
    - اختبار التحقق من طول الحقول
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 3. Checkpoint - التحقق من البنية الأساسية
  - تأكد من أن جميع الأنواع والـ enums معرّفة بشكل صحيح
  - تأكد من أن state machine يعمل كما هو متوقع
  - تأكد من أن أدوات التحقق تعمل بشكل صحيح
  - اسأل المستخدم إذا كانت هناك أي أسئلة أو مشاكل

- [ ] 4. تطوير طبقة API Client
  - [x] 4.1 إنشاء donorResponses.ts في src/api
    - تطبيق دالة transformApiDonorResponse لتحويل البيانات من API
    - تطبيق create() لإنشاء استجابة جديدة (POST /api/donorresponses)
    - تطبيق getById() لجلب استجابة واحدة (GET /api/donorresponses/{id})
    - تطبيق getByRequestId() لجلب استجابات طلب (GET /api/donorresponses/request/{requestId})
    - تطبيق getByDonorId() لجلب استجابات متبرع (GET /api/donorresponses/donor/{donorId})
    - تطبيق updateStatus() لتحديث الحالة (PUT /api/donorresponses/{id}/status)
    - تطبيق cancel() لإلغاء استجابة (POST /api/donorresponses/{id}/cancel)
    - معالجة الأخطاء وتحويلها إلى تنسيق موحد
    - _Requirements: 1.1, 1.10, 2.1, 2.5, 3.1, 4.1, 5.1, 5.14, 6.1, 6.7, 9.1, 9.2, 9.3, 9.4, 9.6_
  
  - [ ]* 4.2 كتابة property tests لـ API client
    - **Property 1: Response Creation with Valid Data**
    - **Property 2: Response Data Completeness**
    - **Property 3: Response List Ordering**
    - **Validates: Requirements 1.1, 1.6, 1.8, 1.9, 2.1, 2.2, 2.3, 2.4, 3.2, 4.2**
  
  - [ ]* 4.3 كتابة unit tests لـ API client
    - اختبار معالجة الأخطاء (طلب غير موجود، متبرع غير نشط، فصيلة دم غير متوافقة)
    - اختبار رفض الاستجابة لطلب مكتمل أو ملغى
    - اختبار رفض استجابة مكررة
    - اختبار تحويل البيانات من API format إلى app format
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.7, 1.8_

- [ ] 5. تطوير React Hooks
  - [x] 5.1 إنشاء useDonorResponses.ts في src/hooks
    - تطبيق hook لجلب قوائم الاستجابات باستخدام React Query
    - دعم الفلترة حسب requestId أو donorId
    - إدارة حالات loading وerror
    - توفير دالة refetch لإعادة جلب البيانات
    - تطبيق caching strategy مع staleTime و cacheTime
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3_
  
  - [x] 5.2 إنشاء useResponseActions.ts في src/hooks
    - تطبيق createResponse() مع optimistic updates
    - تطبيق updateStatus() مع التحقق من صحة الانتقال
    - تطبيق cancelResponse() مع التحقق من السبب
    - إدارة حالات loading لكل عملية (isCreating, isUpdating, isCancelling)
    - معالجة الأخطاء وإرجاع RespondResult موحد
    - _Requirements: 1.1, 5.1, 5.13, 5.14, 6.1, 6.7_
  
  - [ ]* 5.3 كتابة property tests للـ hooks
    - **Property 6: Confirmed Status Timestamp**
    - **Property 7: Donated Status Requires Donation ID**
    - **Property 8: Update Timestamp Maintenance**
    - **Property 9: Cancellation Requires Reason**
    - **Validates: Requirements 5.9, 5.10, 5.11, 5.12, 5.13, 6.1, 6.2, 6.3, 6.4, 10.3, 10.4**
  
  - [ ]* 5.4 كتابة unit tests للـ hooks
    - اختبار useDonorResponses مع requestId وdonorId
    - اختبار معالجة أخطاء الشبكة
    - اختبار useResponseActions مع عمليات ناجحة وفاشلة
    - اختبار optimistic updates والتراجع عند الفشل
    - _Requirements: 1.1, 5.1, 6.1_

- [x] 6. Checkpoint - التحقق من الطبقات الأساسية
  - تأكد من أن API client يتواصل بنجاح مع backend
  - تأكد من أن React hooks تعمل بشكل صحيح
  - اختبر العمليات الأساسية (create, update, cancel)
  - اسأل المستخدم إذا كانت هناك أي أسئلة أو مشاكل

- [ ] 7. تطوير مكونات UI
  - [x] 7.1 إنشاء ResponseStatusBadge.tsx
    - عرض حالة الاستجابة كـ badge ملون
    - استخدام ألوان مختلفة لكل حالة (أخضر للـ Donated، أحمر للـ Rejected، إلخ)
    - دعم className للتخصيص
    - _Requirements: 5.1, 9.4_
  
  - [x] 7.2 إنشاء ResponseCard.tsx
    - عرض بطاقة استجابة واحدة مع جميع التفاصيل
    - عرض معلومات المتبرع (الاسم، الهاتف، فصيلة الدم)
    - عرض معلومات الطلب (اسم المريض، درجة الاستعجال)
    - عرض ResponseStatusBadge
    - عرض الملاحظات وسبب الرفض إن وجد
    - عرض الطوابع الزمنية بتنسيق محلي
    - دعم أزرار الإجراءات (تحديث الحالة، إلغاء) إذا showActions=true
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 10.5_
  
  - [x] 7.3 إنشاء ResponsesList.tsx
    - عرض قائمة الاستجابات مع دعم الفلترة حسب requestId أو donorId
    - استخدام useDonorResponses hook لجلب البيانات
    - عرض حالات loading وerror
    - عرض رسالة "لا توجد استجابات" إذا كانت القائمة فارغة
    - دعم onResponseClick للتفاعل مع الاستجابة
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3_
  
  - [x] 7.4 تحديث ResponseDialog.tsx (إذا لزم الأمر)
    - التحقق من توافق فصيلة الدم قبل الإرسال
    - التحقق من أهلية المتبرع
    - عرض رسائل خطأ واضحة للمستخدم
    - عرض رسالة نجاح بعد التأكيد
    - إغلاق الحوار تلقائياً بعد النجاح
    - _Requirements: 1.1, 1.4, 1.5, 1.6, 1.7, 1.8, 1.10, 9.4, 9.5_
  
  - [ ]* 7.5 كتابة unit tests للمكونات
    - اختبار ResponseStatusBadge مع جميع الحالات
    - اختبار ResponseCard مع بيانات مختلفة
    - اختبار ResponsesList مع قوائم فارغة وممتلئة
    - اختبار ResponseDialog مع سيناريوهات النجاح والفشل
    - اختبار عرض رسائل الخطأ
    - _Requirements: 1.1, 2.1, 3.1, 5.1, 9.4, 9.5_

- [ ] 8. تطوير معالجة الأخطاء الشاملة
  - [x] 8.1 إنشاء error handling utilities
    - تطبيق handleApiError() لمعالجة أخطاء الشبكة
    - تطبيق getErrorStrategy() لتحديد استراتيجية معالجة كل نوع خطأ
    - تطبيق error recovery strategies (retry, redirect, dismiss, contact)
    - تطبيق exponential backoff للإعادة التلقائية
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [x] 8.2 تطبيق error display في المكونات
    - عرض Alert components للأخطاء
    - عرض أزرار إعادة المحاولة عند الحاجة
    - عرض رسائل التواصل مع الدعم للأخطاء الحرجة
    - _Requirements: 9.4, 9.5_
  
  - [ ]* 8.3 كتابة unit tests لمعالجة الأخطاء
    - اختبار handleApiError مع أنواع أخطاء مختلفة
    - اختبار getErrorStrategy مع جميع أنواع الأخطاء
    - اختبار retry logic مع exponential backoff
    - _Requirements: 9.1, 9.2, 9.3, 9.6_

- [ ] 9. تطبيق ميزة تحديث حالة طلب الدم تلقائياً
  - [x] 9.1 تحديث API client لدعم التحديث التلقائي
    - التأكد من أن updateStatus() يتعامل مع تحديث حالة الطلب
    - التحقق من أن العملية atomic (تحديث الاستجابة والطلب معاً)
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 9.2 كتابة property test للتحديث التلقائي
    - **Property 10: Automatic Request Status Update**
    - **Validates: Requirements 7.1, 7.2, 7.3**
  
  - [ ]* 9.3 كتابة integration test للتدفق الكامل
    - اختبار دورة حياة كاملة: Interested → Confirmed → Donated
    - التحقق من تحديث حالة الطلب إلى Fulfilled أو PartiallyFulfilled
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 10. Checkpoint - التحقق من التكامل الكامل
  - اختبر التدفق الكامل من إنشاء استجابة حتى التبرع
  - تأكد من أن جميع المكونات تعمل معاً بشكل صحيح
  - تأكد من أن معالجة الأخطاء تعمل في جميع السيناريوهات
  - اسأل المستخدم إذا كانت هناك أي أسئلة أو مشاكل

- [ ] 11. تطبيق ميزات إدارة الطوابع الزمنية
  - [x] 11.1 التحقق من تنسيق الطوابع الزمنية
    - التأكد من أن جميع timestamps بتنسيق ISO 8601 مع UTC (Z suffix)
    - تطبيق دوال تحويل التواريخ للعرض المحلي
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_
  
  - [ ]* 11.2 كتابة property tests للطوابع الزمنية
    - **Property 18: Timestamp Initialization**
    - **Property 19: ISO 8601 Timestamp Format**
    - **Validates: Requirements 10.1, 10.2, 10.5, 10.6, 10.7**
  
  - [ ]* 11.3 كتابة unit tests للطوابع الزمنية
    - اختبار تنسيق ISO 8601
    - اختبار تحويل التواريخ للعرض المحلي
    - اختبار تحديث timestamps عند العمليات
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 12. تطبيق ميزات التحقق من تنسيق الاستجابة الموحد
  - [x] 12.1 التحقق من تنسيق جميع الاستجابات
    - التأكد من أن جميع responses تتبع {success, message, data, errors}
    - التأكد من أن الرسائل بالعربية
    - التأكد من استخدام HTTP status codes المناسبة
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [ ]* 12.2 كتابة property tests للتنسيق الموحد
    - **Property 14: Unified Response Format**
    - **Property 15: Arabic Message Presence**
    - **Property 16: Validation Error Details**
    - **Property 17: HTTP Status Code Appropriateness**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6**

- [ ] 13. تطبيق ميزات التحقق من صحة الحقول
  - [x] 13.1 التحقق من طول الحقول والقيم
    - التأكد من تطبيق حد 500 حرف لـ notes وrejectionReason
    - التأكد من التحقق من IDs (positive integers)
    - التأكد من التحقق من status enum (1-6)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  
  - [ ]* 13.2 كتابة property tests للتحقق من الحقول
    - **Property 11: Field Length Validation**
    - **Property 12: ID Validation**
    - **Property 13: Status Enum Validation**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

- [ ] 14. الاختبار الشامل والمراجعة
  - [x] 14.1 تشغيل جميع الاختبارات
    - تشغيل جميع unit tests والتأكد من نجاحها
    - تشغيل جميع property tests (100 iterations لكل test)
    - تشغيل integration tests
    - التحقق من test coverage (الهدف: 85%+)
    - _Requirements: جميع المتطلبات_
  
  - [ ] 14.2 الاختبار اليدوي الشامل
    - اختبار جميع السيناريوهات الأساسية يدوياً
    - اختبار معالجة الأخطاء في جميع الحالات
    - اختبار التجربة على أجهزة مختلفة (desktop, mobile)
    - اختبار الأداء مع بيانات كبيرة
    - _Requirements: جميع المتطلبات_
  
  - [ ] 14.3 مراجعة الكود والتوثيق
    - مراجعة جميع الكود للتأكد من جودته
    - التأكد من وجود تعليقات واضحة
    - إنشاء usage examples للمطورين
    - تحديث API documentation إذا لزم الأمر

- [ ] 15. Checkpoint النهائي - التحقق من الجاهزية للنشر
  - تأكد من نجاح جميع الاختبارات
  - تأكد من أن الميزة تعمل بشكل كامل في بيئة التطوير
  - تأكد من أن التوثيق كامل وواضح
  - اسأل المستخدم إذا كان جاهزاً للنشر

- [ ] 16. النشر والمتابعة
  - [ ] 16.1 النشر إلى بيئة الإنتاج
    - إنشاء pull request مع وصف تفصيلي
    - مراجعة الكود من قبل فريق آخر (إذا أمكن)
    - دمج الكود في الفرع الرئيسي
    - نشر التحديث إلى الإنتاج
  
  - [ ] 16.2 المتابعة بعد النشر
    - مراقبة الأخطاء في بيئة الإنتاج
    - جمع ملاحظات المستخدمين
    - إصلاح أي مشاكل عاجلة
    - تخطيط للتحسينات المستقبلية

## ملاحظات / Notes

- المهام المميزة بـ `*` اختيارية ويمكن تخطيها للحصول على MVP أسرع
- كل مهمة تشير إلى المتطلبات المرتبطة بها للتتبع
- Checkpoints موضوعة في نقاط استراتيجية للتحقق من التقدم
- Property tests تتحقق من الخصائص العامة عبر مدخلات عشوائية
- Unit tests تتحقق من أمثلة محددة وحالات حدية
- جميع الاختبارات ضرورية لضمان جودة الكود لكنها اختيارية للتنفيذ السريع

## التبعيات المطلوبة / Required Dependencies

تأكد من تثبيت المكتبات التالية:
```bash
npm install @tanstack/react-query
npm install -D vitest @testing-library/react @testing-library/user-event fast-check @vitest/coverage-v8
```

## الأولويات / Priorities

1. **عالية (High)**: المهام 1-7 (البنية الأساسية والمكونات الرئيسية)
2. **متوسطة (Medium)**: المهام 8-13 (معالجة الأخطاء والميزات الإضافية)
3. **منخفضة (Low)**: المهام 14-16 (الاختبار الشامل والنشر)

## الوقت المتوقع / Estimated Time

- المهام 1-7: 3-4 أيام
- المهام 8-13: 2-3 أيام
- المهام 14-16: 1-2 أيام
- **الإجمالي**: 6-9 أيام عمل
