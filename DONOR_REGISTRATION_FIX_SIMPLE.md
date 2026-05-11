# إصلاح تسجيل المتبرعين - Donor Registration Fix

## المشكلة
كان الكود يستخدم أسماء حقول خاطئة عند إرسال البيانات إلى `/api/Donors`:
- ❌ `nationalId` (خطأ)
- ❌ `bloodTypeId` (خطأ)
- ❌ `gender: formData.gender as Gender` (خطأ - يرسل "Male" أو "Female" كنص)
- ❌ **لم يتم إرسال `userID`** (المشكلة الرئيسية!)

## الحل
تم تصحيح أسماء الحقول لتطابق DTO الصحيح:
- ✅ `nationalID` (صحيح - بحرف I و D كبيرين)
- ✅ `bloodTypeID` (صحيح - بحرف I و D كبيرين)  
- ✅ `gender: formData.gender === "Male" ? 0 : 1` (صحيح - يرسل 0 للذكر و 1 للأنثى)
- ✅ **`userID: userData?.userId || null`** (تم إضافة معرف المستخدم!)

## الكود المصحح

```typescript
// Step 1: Register user account
const { error: signUpError, data: userData } = await signUp(
  formData.username,
  formData.password,
  formData.fullName,
  formData.phone
);

// Step 2: Create donor record using /api/Donors endpoint
const donorResponse = await donorsApi.create({
  fullName: formData.fullName,
  nationalID: formData.nationalId,           // ✅ nationalID بدلاً من nationalId
  gender: formData.gender === "Male" ? 0 : 1, // ✅ 0 أو 1 بدلاً من "Male" أو "Female"
  dateOfBirth: formData.dateOfBirth || new Date().toISOString().split('T')[0],
  phone: formData.phone,
  bloodTypeID: BLOOD_TYPE_REVERSE_MAP[formData.bloodType], // ✅ bloodTypeID بدلاً من bloodTypeId
  city: formData.city,
  isActive: true,
  userID: userData?.userId || null, // ✅ إضافة معرف المستخدم من الخطوة 1
});
```

## CreateDonorRequest DTO

```typescript
interface CreateDonorRequest {
  fullName: string;
  nationalID: string;      // ⚠️ حرف I و D كبيرين
  gender: number;          // ⚠️ 0=Male, 1=Female
  dateOfBirth: string;
  phone: string;
  bloodTypeID: number;     // ⚠️ حرف I و D كبيرين
  city: string;
  isActive?: boolean;
  userID?: number | null;  // ⚠️ معرف المستخدم (مهم جداً!)
}
```

## سير العمل (Workflow)

1. **الخطوة 1:** تسجيل المستخدم عبر `/api/Auth/register`
   - يتم إنشاء حساب مستخدم جديد
   - نحصل على `userData` الذي يحتوي على `userId`
   
2. **الخطوة 2:** إنشاء سجل متبرع عبر `/api/Donors`
   - يتم إنشاء سجل متبرع مرتبط بالمستخدم
   - يستخدم نفس البيانات من النموذج
   - **يتم ربط المتبرع بالمستخدم عبر `userID`**
   
3. **الخطوة 3:** التوجيه إلى لوحة التحكم
   - بعد نجاح العمليتين، يتم التوجيه إلى `/donor/dashboard`

## الملفات المعدلة
- ✅ `src/pages/Register.tsx` - تصحيح أسماء الحقول وإضافة userID
- ✅ `src/types/api.ts` - إضافة userID إلى CreateDonorRequest interface

## مثال على البيانات المرسلة

```json
{
  "fullName": "أحمد علي",
  "nationalID": "123456789012",
  "gender": 0,
  "dateOfBirth": "1990-01-15",
  "phone": "0912345678",
  "bloodTypeID": 1,
  "city": "طرابلس",
  "isActive": true,
  "userID": 123
}
```

---
**تاريخ الإصلاح:** 2026-04-29
**الحالة:** ✅ تم الإصلاح بالكامل
