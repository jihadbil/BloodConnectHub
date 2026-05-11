# إصلاح تسجيل المتبرع والاستجابة لطلبات الدم وعرض فصائل الدم
## Donor Registration, Blood Request Response, and Blood Type Display Fix

## المشاكل التي تم إصلاحها / Fixed Issues

### 1. مشكلة تسجيل المتبرع - معرف المستخدم فارغ
**Problem**: عند تسجيل متبرع جديد، كان حقل `userID` يُرسل بقيمة `null` إلى الخلفية

**السبب / Root Cause**:
- استجابة API من `/api/Auth/register` تُرجع `userID` (بحروف كبيرة I و D)
- الكود كان يبحث عن `userId` (camelCase) أولاً
- لم يكن هناك تسجيل كافٍ للبيانات (logging) لتتبع المشكلة

**الحل / Solution**:
```typescript
// في src/pages/Register.tsx
// استخراج userID من الاستجابة - API يُرجع userID (بحروف كبيرة)
const userID = (userData as any)?.userID || (userData as any)?.userId || null;
console.log("Extracted userID:", userID);

const donorPayload = {
  fullName: formData.fullName,
  nationalID: formData.nationalId,
  gender: formData.gender === "Male" ? 0 : 1,
  dateOfBirth: formData.dateOfBirth || new Date().toISOString().split('T')[0],
  phone: formData.phone,
  bloodTypeID: BLOOD_TYPE_REVERSE_MAP[formData.bloodType],
  city: formData.city,
  isActive: true,
  userID: userID, // ✅ الآن يتم إرسال معرف المستخدم بشكل صحيح
};
```

**التحسينات / Improvements**:
- إضافة تسجيل مفصل (detailed logging) لتتبع البيانات
- التحقق من كلا الحالتين: `userID` و `userId`
- تسجيل الـ payload الكامل قبل الإرسال

---

### 2. مشكلة الاستجابة لطلبات الدم - لم يتم العثور على معلومات المتبرع
**Problem**: عند محاولة متبرع مسجل الدخول الاستجابة لطلب دم، يظهر خطأ "لم يتم العثور على معلومات المتبرع"

**السبب / Root Cause**:
- بيانات المستخدم بعد تسجيل الدخول لا تحتوي على `donorID`
- الكود كان يبحث فقط عن `userId` في كائن المستخدم
- API يُرجع `userID` (بحروف كبيرة) وليس `userId` (camelCase)

**الحل / Solution**:
تم تحديث ثلاث دوال في `src/hooks/useBloodRequestResponse.ts`:

#### أ) `checkBloodCompatibility`
```typescript
// استخراج userID من بيانات المستخدم
const userIdToSearch = (user as any)?.userID || (user as any)?.userId || null;
console.log("Extracted userID from user data:", userIdToSearch);

if (!userIdToSearch) {
  return {
    success: false,
    error: 'لم يتم العثور على معلومات المستخدم. يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى.',
    errorType: 'compatibility',
  };
}

// جلب جميع المتبرعين والبحث عن المتبرع المرتبط بهذا المستخدم
const allDonorsResponse = await donorsApi.getAll(1, 1000);
if (allDonorsResponse.success && allDonorsResponse.data?.items) {
  const matchingDonor = allDonorsResponse.data.items.find(
    (d: any) => d.userID === userIdToSearch
  );
  if (matchingDonor) {
    donorID = matchingDonor.donorID || matchingDonor.donorId;
  }
}
```

#### ب) `checkDonationEligibility`
نفس المنطق المطبق للتحقق من أهلية التبرع

#### ج) `respondToRequest` - إنشاء التبرع
نفس المنطق المطبق عند إنشاء سجل التبرع

**التحسينات / Improvements**:
- البحث عن كلا الحقلين: `userID` و `userId`
- رسائل خطأ أوضح للمستخدم
- تسجيل مفصل (detailed logging) لتتبع المشكلة
- معالجة أفضل للأخطاء (better error handling)

---

### 3. مشكلة عرض فصائل الدم الخاطئة في صفحة طلبات الدم ✅
**Problem**: فصائل الدم المعروضة في صفحة `/blood-requests` كانت خاطئة

**السبب / Root Cause**:
- الكود كان يعطي الأولوية لـ `req.bloodType?.typeName` من API
- لكن API لا يُرجع دائماً كائن `bloodType` كامل
- `BLOOD_TYPE_MAP` تم تحديثه لكن الكود لم يستخدمه بشكل صحيح

**الحل / Solution**:
```typescript
// في src/pages/BloodRequests.tsx
// استخراج فصيلة الدم - استخدام BLOOD_TYPE_MAP مباشرة لأن API يُرجع bloodTypeId
// BLOOD_TYPE_MAP تم تحديثه ليطابق البيانات الفعلية من API
const bloodTypeName = BLOOD_TYPE_MAP[req.bloodTypeId] || req.bloodType?.typeName || `فصيلة ${req.bloodTypeId}`;
```

**التحسينات / Improvements**:
- إعطاء الأولوية لـ `BLOOD_TYPE_MAP` بدلاً من `req.bloodType?.typeName`
- التأكد من أن `BLOOD_TYPE_MAP` يطابق البيانات الفعلية من API
- إضافة fallback لعرض معرف الفصيلة إذا لم يتم العثور عليها

**الـ Mapping الصحيح**:
```typescript
export const BLOOD_TYPE_MAP: Record<number, string> = {
  1: 'O-',
  2: 'O+',
  3: 'A-',
  4: 'A+',
  5: 'B-',
  6: 'B+',
  7: 'AB-',
  8: 'AB+',
};
```

---

## الملفات المعدلة / Modified Files

1. **src/pages/Register.tsx**
   - تحسين استخراج `userID` من استجابة التسجيل
   - إضافة تسجيل مفصل للبيانات
   - تحسين معالجة الأخطاء

2. **src/hooks/useBloodRequestResponse.ts**
   - تحديث `checkBloodCompatibility()` للبحث عن `userID` بشكل صحيح
   - تحديث `checkDonationEligibility()` للبحث عن `userID` بشكل صحيح
   - تحديث `respondToRequest()` للبحث عن `userID` بشكل صحيح
   - إضافة تسجيل مفصل في جميع الدوال
   - تحسين رسائل الخطأ

3. **src/pages/BloodRequests.tsx** ✅
   - تحديث منطق استخراج فصيلة الدم لاستخدام `BLOOD_TYPE_MAP` مباشرة
   - إعطاء الأولوية للـ mapping الصحيح بدلاً من `req.bloodType?.typeName`

4. **src/pages/StaffDashboard.tsx** ✅
   - تحديث عرض فصائل الدم في قائمة الطلبات النشطة
   - تحديث عرض فصائل الدم في قائمة المتبرعين
   - استخدام `BLOOD_TYPE_MAP` مباشرة بدلاً من `req.bloodType?.typeName`

5. **src/pages/AdminDashboard.tsx** ✅
   - تحديث عرض فصائل الدم في قائمة الطلبات الأخيرة
   - استخدام `BLOOD_TYPE_MAP` مباشرة بدلاً من `req.bloodType?.typeName`

6. **src/components/blood-requests/ResponseDialog.tsx** ✅
   - تحديث عرض فصيلة الدم في مربع حوار الاستجابة
   - استخدام `BLOOD_TYPE_MAP` مباشرة بدلاً من `request.bloodType?.typeName`

---

## اختبار الإصلاحات / Testing the Fixes

### اختبار 1: تسجيل متبرع جديد
1. افتح صفحة التسجيل `/register`
2. املأ جميع الحقول المطلوبة
3. اضغط على "تسجيل كمتبرع"
4. افتح Console في المتصفح
5. تحقق من السجلات (logs):
   ```
   User Data received from signUp: {...}
   Extracted userID: <number>
   Donor Payload being sent: { ..., userID: <number> }
   Donor created successfully: {...}
   ```

### اختبار 2: الاستجابة لطلب دم
1. سجل الدخول بحساب متبرع
2. انتقل إلى صفحة طلبات الدم `/blood-requests`
3. اضغط على "استجب الآن" لأي طلب
4. اضغط على "تأكيد الاستجابة"
5. يجب أن تنجح العملية بدون أخطاء
6. تحقق من Console:
   ```
   User data in checkBloodCompatibility: {...}
   Extracted userID from user data: <number>
   Found matching donor: {...}
   Final donorID: <number>
   ```

### اختبار 3: عرض فصائل الدم ✅
1. افتح صفحة طلبات الدم `/blood-requests`
2. تحقق من أن فصائل الدم المعروضة صحيحة (O-, O+, A-, A+, B-, B+, AB-, AB+)
3. قارن مع البيانات الفعلية من API
4. يجب أن تتطابق الفصائل مع `BLOOD_TYPE_MAP`

### اختبار 4: عرض فصائل الدم في لوحة تحكم الموظفين ✅
1. سجل الدخول بحساب موظف
2. افتح صفحة `/staff/dashboard`
3. تحقق من أن فصائل الدم في قائمة الطلبات النشطة صحيحة
4. تحقق من أن فصائل الدم في قائمة المتبرعين صحيحة
5. يجب أن تتطابق جميع الفصائل مع `BLOOD_TYPE_MAP`

### اختبار 5: عرض فصائل الدم في لوحة تحكم المدير ✅
1. سجل الدخول بحساب مدير
2. افتح صفحة `/admin/dashboard`
3. تحقق من أن فصائل الدم في قائمة الطلبات الأخيرة صحيحة
4. يجب أن تتطابق جميع الفصائل مع `BLOOD_TYPE_MAP`

### اختبار 6: عرض فصيلة الدم في مربع حوار الاستجابة ✅
1. سجل الدخول بحساب متبرع
2. افتح صفحة `/blood-requests`
3. اضغط على "استجب الآن" لأي طلب
4. تحقق من أن فصيلة الدم المعروضة في مربع الحوار صحيحة
5. يجب أن تتطابق مع `BLOOD_TYPE_MAP`

---

## ملاحظات مهمة / Important Notes

### تنسيق أسماء الحقول في API
API الخلفية تستخدم **PascalCase** لأسماء الحقول:
- ✅ `userID` (صحيح)
- ❌ `userId` (خطأ)
- ✅ `donorID` (صحيح)
- ❌ `donorId` (خطأ)
- ✅ `nationalID` (صحيح)
- ❌ `nationalId` (خطأ)
- ✅ `bloodTypeID` (صحيح)
- ❌ `bloodTypeId` (خطأ)

### نقاط النهاية المستخدمة / API Endpoints Used
1. `POST /api/Auth/register` - تسجيل مستخدم جديد
2. `POST /api/Donors` - إنشاء سجل متبرع
3. `GET /api/Donors?pageNumber=1&pageSize=1000` - جلب جميع المتبرعين
4. `GET /api/Donors/{id}` - جلب تفاصيل متبرع محدد
5. `POST /api/Donations` - إنشاء تبرع جديد
6. `POST /api/BloodRequests/{id}/fulfill` - ربط التبرع بالطلب

---

## الخطوات التالية / Next Steps

1. ✅ اختبار تسجيل متبرع جديد
2. ✅ اختبار تسجيل الدخول بحساب متبرع
3. ✅ اختبار الاستجابة لطلب دم
4. ✅ اختبار عرض فصائل الدم في صفحة `/blood-requests`
5. ✅ اختبار عرض فصائل الدم في صفحة `/staff/dashboard`
6. ✅ اختبار عرض فصائل الدم في صفحة `/admin/dashboard`
7. ✅ اختبار عرض فصيلة الدم في مربع حوار الاستجابة
8. 🔄 التحقق من أن `donorID` يُحفظ في بيانات المستخدم بعد تسجيل الدخول (تحسين مستقبلي)
9. 🔄 إضافة cache للمتبرعين لتقليل عدد الطلبات إلى API (تحسين مستقبلي)

---

## تحسينات مستقبلية / Future Improvements

1. **تحسين الأداء**: حفظ `donorID` في localStorage بعد أول استعلام ناجح
2. **تحسين UX**: إضافة مؤشر تحميل أثناء البحث عن معلومات المتبرع
3. **تحسين API**: إضافة `donorID` إلى استجابة تسجيل الدخول من الخلفية
4. **تحسين الأمان**: استخدام endpoint مخصص `/api/Donors/user/{userId}` بدلاً من جلب جميع المتبرعين

---

**تاريخ الإصلاح / Fix Date**: 2026-04-29
**الحالة / Status**: ✅ مكتمل / Completed
