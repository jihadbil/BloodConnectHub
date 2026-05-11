# مستند المتطلبات - تسجيل المتبرع والمستخدم

## المقدمة

هذه الميزة تسمح بإنشاء حساب متبرع وحساب مستخدم مرتبط به في عملية واحدة متكاملة. حالياً، يتطلب النظام إنشاء المستخدم أولاً ثم إنشاء المتبرع وربطه بالمستخدم في خطوات منفصلة. هذه الميزة تبسط العملية وتضمن تناسق البيانات.

## المصطلحات

- **Registration_System**: النظام المسؤول عن تسجيل المتبرعين والمستخدمين
- **Donor_Service**: الخدمة المسؤولة عن إدارة بيانات المتبرعين
- **User_Service**: الخدمة المسؤولة عن إدارة حسابات المستخدمين
- **Database**: قاعدة البيانات التي تخزن بيانات المتبرعين والمستخدمين
- **API_Client**: التطبيق أو الواجهة التي تستدعي API
- **Combined_Registration_Request**: طلب يحتوي على بيانات المستخدم والمتبرع معاً
- **Transaction**: معاملة قاعدة بيانات تضمن تنفيذ جميع العمليات أو فشلها معاً
- **Validation_Error**: خطأ في التحقق من صحة البيانات المدخلة
- **Rollback**: التراجع عن جميع التغييرات في حالة فشل أي جزء من العملية

## المتطلبات

### المتطلب 1: إنشاء متبرع ومستخدم في عملية واحدة

**قصة المستخدم:** كمسؤول نظام، أريد إنشاء حساب متبرع وحساب مستخدم مرتبط به في طلب واحد، حتى أتمكن من تبسيط عملية التسجيل وضمان تناسق البيانات.

#### معايير القبول

1. WHEN THE API_Client يرسل Combined_Registration_Request صحيح، THE Registration_System SHALL إنشاء حساب مستخدم جديد وحساب متبرع مرتبط به
2. THE Registration_System SHALL إرجاع بيانات المستخدم والمتبرع المُنشأين مع معرفاتهما (IDs)
3. THE Registration_System SHALL ربط المتبرع بالمستخدم تلقائياً عبر حقل userID
4. WHEN أي جزء من عملية الإنشاء يفشل، THE Registration_System SHALL تنفيذ Rollback لجميع التغييرات
5. THE Registration_System SHALL إرجاع رسالة خطأ واضحة تحدد سبب الفشل

### المتطلب 2: التحقق من صحة البيانات المدخلة

**قصة المستخدم:** كمطور، أريد التحقق من صحة جميع البيانات المدخلة قبل إنشاء الحسابات، حتى أضمن جودة البيانات وأمان النظام.

#### معايير القبول

1. WHEN THE API_Client يرسل Combined_Registration_Request، THE Registration_System SHALL التحقق من صحة بيانات المستخدم وفقاً لقواعد RegisterRequest
2. WHEN THE API_Client يرسل Combined_Registration_Request، THE Registration_System SHALL التحقق من صحة بيانات المتبرع وفقاً لقواعد CreateDonorDto
3. IF اسم المستخدم (username) موجود مسبقاً، THEN THE Registration_System SHALL إرجاع Validation_Error يوضح أن اسم المستخدم مستخدم
4. IF الرقم الوطني (nationalID) للمتبرع موجود مسبقاً، THEN THE Registration_System SHALL إرجاع Validation_Error يوضح أن الرقم الوطني مسجل
5. THE Registration_System SHALL التحقق من أن كلمة المرور تحتوي على 6 أحرف على الأقل
6. THE Registration_System SHALL التحقق من أن اسم المستخدم يحتوي على 3 أحرف على الأقل
7. THE Registration_System SHALL التحقق من أن جميع الحقول المطلوبة موجودة وغير فارغة

### المتطلب 3: ضمان تناسق البيانات عبر Transaction

**قصة المستخدم:** كمطور، أريد ضمان أن عملية إنشاء المستخدم والمتبرع تتم بشكل ذري (atomic)، حتى لا تحدث حالات غير متسقة في قاعدة البيانات.

#### معايير القبول

1. THE Registration_System SHALL تنفيذ عملية الإنشاء داخل Transaction واحدة
2. IF فشل إنشاء المستخدم، THEN THE Registration_System SHALL عدم إنشاء المتبرع
3. IF فشل إنشاء المتبرع بعد إنشاء المستخدم، THEN THE Registration_System SHALL حذف المستخدم المُنشأ
4. IF فشل ربط المتبرع بالمستخدم، THEN THE Registration_System SHALL حذف كل من المستخدم والمتبرع
5. WHEN تكتمل جميع العمليات بنجاح، THE Registration_System SHALL تأكيد Transaction وحفظ التغييرات

### المتطلب 4: إرجاع استجابة شاملة

**قصة المستخدم:** كمطور واجهة أمامية، أريد الحصول على جميع البيانات المطلوبة في استجابة واحدة، حتى أتمكن من عرض المعلومات للمستخدم دون طلبات إضافية.

#### معايير القبول

1. WHEN تنجح عملية التسجيل، THE Registration_System SHALL إرجاع كائن يحتوي على بيانات المستخدم الكاملة
2. WHEN تنجح عملية التسجيل، THE Registration_System SHALL إرجاع كائن يحتوي على بيانات المتبرع الكاملة
3. THE Registration_System SHALL تضمين معرف المستخدم (userID) في بيانات المتبرع المُرجعة
4. THE Registration_System SHALL تضمين معرف المتبرع (donorID) في الاستجابة
5. THE Registration_System SHALL إرجاع رمز حالة HTTP 201 (Created) عند النجاح

### المتطلب 5: معالجة الأخطاء والحالات الاستثنائية

**قصة المستخدم:** كمطور، أريد معالجة واضحة للأخطاء، حتى أتمكن من تقديم رسائل مفيدة للمستخدمين وتسهيل تصحيح الأخطاء.

#### معايير القبول

1. IF فشل الاتصال بـ Database، THEN THE Registration_System SHALL إرجاع رمز حالة HTTP 500 مع رسالة خطأ
2. IF كانت البيانات المدخلة غير صحيحة، THEN THE Registration_System SHALL إرجاع رمز حالة HTTP 400 مع تفاصيل الأخطاء
3. IF حدث تعارض في البيانات (username أو nationalID مكرر)، THEN THE Registration_System SHALL إرجاع رمز حالة HTTP 409 مع رسالة توضيحية
4. THE Registration_System SHALL تسجيل جميع الأخطاء في سجل النظام (logs) لأغراض التتبع
5. THE Registration_System SHALL عدم إرجاع معلومات حساسة (مثل كلمات المرور) في رسائل الخطأ

### المتطلب 6: دعم الحقول الاختيارية

**قصة المستخدم:** كمستخدم، أريد إمكانية ترك بعض الحقول فارغة أثناء التسجيل، حتى أتمكن من إكمال التسجيل بسرعة وإضافة التفاصيل لاحقاً.

#### معايير القبول

1. WHERE رقم الهاتف (phone) غير مقدم في بيانات المستخدم، THE Registration_System SHALL إنشاء المستخدم بدون رقم هاتف
2. WHERE رقم الهاتف (phone) غير مقدم في بيانات المتبرع، THE Registration_System SHALL إنشاء المتبرع بدون رقم هاتف
3. WHERE المدينة (city) غير مقدمة، THE Registration_System SHALL إنشاء المتبرع بدون مدينة
4. THE Registration_System SHALL قبول قيم null للحقول الاختيارية
5. THE Registration_System SHALL رفض الطلب إذا كانت الحقول المطلوبة (username, password, fullName, roleId, bloodTypeID, dateOfBirth, gender) مفقودة

### المتطلب 7: تعيين دور المستخدم تلقائياً

**قصة المستخدم:** كمسؤول نظام، أريد أن يتم تعيين دور "متبرع" للمستخدم تلقائياً، حتى يحصل على الصلاحيات المناسبة دون تدخل يدوي.

#### معايير القبول

1. WHERE لم يتم تحديد roleId في الطلب، THE Registration_System SHALL تعيين دور "متبرع" (Donor role) تلقائياً
2. WHERE تم تحديد roleId في الطلب، THE Registration_System SHALL استخدام الدور المحدد
3. THE Registration_System SHALL التحقق من أن roleId المحدد موجود في النظام
4. IF كان roleId غير موجود، THEN THE Registration_System SHALL إرجاع Validation_Error

### المتطلب 8: تفعيل حساب المتبرع

**قصة المستخدم:** كمسؤول نظام، أريد التحكم في حالة تفعيل حساب المتبرع، حتى أتمكن من مراجعة الحسابات قبل تفعيلها.

#### معايير القبول

1. WHERE لم يتم تحديد isActive في الطلب، THE Registration_System SHALL تعيين isActive إلى true تلقائياً
2. WHERE تم تحديد isActive في الطلب، THE Registration_System SHALL استخدام القيمة المحددة
3. WHEN يكون isActive يساوي false، THE Registration_System SHALL إنشاء المتبرع في حالة غير نشطة
4. THE Registration_System SHALL السماح بتغيير حالة isActive لاحقاً عبر endpoints التحديث الموجودة

### المتطلب 9: التوافق مع API الحالي

**قصة المستخدم:** كمطور، أريد أن تكون الميزة الجديدة متوافقة مع API الحالي، حتى لا تتأثر الأنظمة الموجودة.

#### معايير القبول

1. THE Registration_System SHALL الحفاظ على endpoints الموجودة (POST /api/Auth/register و POST /api/Donors) دون تغيير
2. THE Registration_System SHALL إضافة endpoint جديد للتسجيل المدمج دون التأثير على الوظائف الحالية
3. THE Registration_System SHALL استخدام نفس نماذج البيانات (DTOs) الموجودة
4. THE Registration_System SHALL إرجاع استجابات بنفس تنسيق ServiceResponse المستخدم في API
5. THE Registration_System SHALL دعم نفس آليات المصادقة والتفويض الموجودة
