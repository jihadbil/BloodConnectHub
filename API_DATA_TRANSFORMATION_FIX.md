# إصلاح تحويل بيانات API لطلبات الدم

## المشكلة

عند فتح مربع الحوار ResponseDialog من صفحة طلبات الدم، كانت البيانات تظهر بشكل غير صحيح:

- **فصيلة الدم**: تظهر "فصيلة undefined" بدلاً من "A+" أو "AB+" إلخ
- **التاريخ**: يظهر "Invalid Date" بدلاً من التاريخ الصحيح
- **مستوى الاستعجال**: يظهر "عادي" دائماً حتى للطلبات العاجلة

## السبب الجذري

API الخلفي يرسل البيانات بتنسيق مختلف عن ما يتوقعه الكود:

### تنسيق API الفعلي:
```json
{
  "requestID": 1,
  "patientName": "test1",
  "bloodTypeName": "AB+",
  "quantityNeeded": 2,
  "urgencyLevel": 1,
  "status": 1,
  "requiredDate": "0001-01-01T00:00:00"
}
```

### التنسيق المتوقع في الكود:
```typescript
{
  requestId: number,
  bloodType: { typeName: string },
  urgencyLevel: 'Normal' | 'Urgent' | 'Emergency',
  requestDate: string,
  status: 'Pending' | 'Fulfilled' | ...
}
```

## الحل

تم إضافة طبقة تحويل بيانات في `src/api/bloodRequests.ts` لتحويل البيانات من تنسيق API إلى التنسيق المتوقع:

### التحويلات المطبقة:

1. **أسماء الحقول**:
   - `requestID` → `requestId`
   - `patientID` → `patientId`
   - `bloodTypeID` → `bloodTypeId`

2. **فصيلة الدم**:
   - تحويل `bloodTypeName` (نص) إلى كائن `bloodType: { typeName, bloodTypeId }`

3. **مستوى الاستعجال**:
   - تحويل من رقم (0, 1, 2) إلى نص:
     - `0` → `'Normal'`
     - `1` → `'Urgent'`
     - `2` → `'Emergency'`

4. **حالة الطلب**:
   - تحويل من رقم (0, 1, 2, 3) إلى نص:
     - `0` → `'Pending'`
     - `1` → `'Fulfilled'`
     - `2` → `'PartiallyFulfilled'`
     - `3` → `'Cancelled'`

5. **التاريخ**:
   - إضافة `requestDate` من `createdAt` إذا كان مفقوداً

6. **بيانات المريض**:
   - تحويل `patientName` إلى كائن `patient: { fullName, patientId }`

## الملفات المعدلة

- `src/api/bloodRequests.ts`: إضافة دوال التحويل وتطبيقها على جميع endpoints

## الاختبارات

- ✅ جميع الاختبارات نجحت (79 اختبار)
- ✅ لا توجد أخطاء TypeScript
- ✅ البناء ناجح

## النتيجة

الآن عند فتح مربع الحوار ResponseDialog:
- ✅ فصيلة الدم تظهر بشكل صحيح (مثل "AB+")
- ✅ التاريخ يظهر بشكل صحيح (مثل "منذ 3 ساعة")
- ✅ مستوى الاستعجال يظهر بشكل صحيح ("عادي"، "عاجل"، "حرج")
