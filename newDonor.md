# توثيق ميزة الاستجابة لطلب التبرع بالدم
**Donor Response to Blood Request — Complete API Documentation**

> **الإصدار:** 1.0.0 &emsp; **تاريخ الإضافة:** 2026-04-03 &emsp; **المشروع:** BloodConnect API

---

## 📌 جدول المحتويات

1. [معلومات الاتصال والبيئات](#1-معلومات-الاتصال-والبيئات)
2. [المصادقة والتفويض](#2-المصادقة-والتفويض)
3. [بنية الاستجابة الموحدة](#3-بنية-الاستجابة-الموحدة)
4. [Enums — القيم المرجعية](#4-enums--القيم-المرجعية)
5. [نموذج البيانات DonorResponseDto](#5-نموذج-البيانات-donorresponsedto)
6. [Endpoints — التفصيل الكامل](#6-endpoints--التفصيل-الكامل)
7. [قواعد الأعمال والتحقق](#7-قواعد-الأعمال-والتحقق)
8. [State Machine — انتقالات الحالة](#8-state-machine--انتقالات-الحالة)
9. [التأثير على طلبات الدم](#9-التأثير-على-طلبات-الدم)
10. [أمثلة cURL جاهزة](#10-أمثلة-curl-جاهزة)
11. [أكواد الخطأ المرجعية](#11-أكواد-الخطأ-المرجعية)

---

## 1. معلومات الاتصال والبيئات

| البيئة | Base URL |
|--------|----------|
| **Development** (محلي) | `http://localhost:5000/api` |
| **Production** | `https://db41650.databaseasp.net/api` |

**Content-Type المطلوب في جميع الطلبات:**
```
Content-Type: application/json
```

**CORS:** مفتوح لجميع الـ Origins (`AllowAll`) — لا قيود على المصدر.

---

## 2. المصادقة والتفويض

> ⚠️ **ملاحظة:** endpoints الاستجابة لا تشترط JWT حالياً في الكود الحالي. إذا أضيف Authorization في المستقبل، يُرسَل الـ Token كالتالي:

```http
Authorization: Bearer {your_jwt_token}
```

**الحصول على Token:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password"
}
```

**مدة صلاحية Token:** 1440 دقيقة (24 ساعة)

---

## 3. بنية الاستجابة الموحدة

**كل response من الـ API يأتي بهذا الشكل دائماً:**

```json
{
  "success": true | false,
  "message": "رسالة نصية",
  "data": { ... } | [ ... ] | null,
  "errors": null | ["خطأ 1", "خطأ 2"]
}
```

| الحقل | النوع | الوصف |
|-------|-------|-------|
| `success` | `boolean` | `true` إذا نجحت العملية |
| `message` | `string` | رسالة توضيحية دائماً موجودة |
| `data` | `object \| array \| null` | البيانات المطلوبة (null عند الفشل) |
| `errors` | `string[] \| null` | قائمة أخطاء التحقق (null عند النجاح) |

---

## 4. Enums — القيم المرجعية

### ResponseStatus — حالة الاستجابة

| القيمة الرقمية | الاسم | الوصف |
|----------------|-------|-------|
| `1` | `Interested` | المتبرع أبدى اهتمامه |
| `2` | `Confirmed` | الموظف أكّد وحدد موعداً |
| `3` | `Donated` | تم التبرع الفعلي |
| `4` | `Rejected` | مرفوض |
| `5` | `NoShow` | أكّد لكن لم يحضر |
| `6` | `Cancelled` | ملغى |

### UrgencyLevel — درجة الاستعجال

| القيمة الرقمية | الاسم | الوصف |
|----------------|-------|-------|
| `1` | `Normal` | عادي — غير عاجل |
| `2` | `Urgent` | عاجل — يحتاج أولوية |
| `3` | `Emergency` | طارئ — حالة حرجة |

### RequestStatus — حالة طلب الدم

| القيمة الرقمية | الاسم | الوصف |
|----------------|-------|-------|
| `1` | `Pending` | قيد الانتظار |
| `2` | `Fulfilled` | تم التوفير بالكامل |
| `3` | `PartiallyFulfilled` | تم التوفير جزئياً |
| `4` | `Cancelled` | ملغى |

---

## 5. نموذج البيانات DonorResponseDto

هذا هو الـ object الذي يُرجَع في `data` لمعظم Endpoints:

```json
{
  "responseID":        1,
  "donorID":           5,
  "donorName":         "أحمد محمد",
  "donorPhone":        "0501234567",
  "bloodTypeName":     "A+",
  "requestID":         12,
  "patientName":       "خالد عبدالله",
  "urgencyLevel":      2,
  "status":            2,
  "statusDescription": "تم التأكيد",
  "notes":             "الموعد يوم الأحد الساعة 10",
  "rejectionReason":   null,
  "responseDate":      "2026-04-03T10:00:00Z",
  "confirmedAt":       "2026-04-03T11:00:00Z",
  "donationID":        null,
  "createdAt":         "2026-04-03T10:00:00Z",
  "updatedAt":         "2026-04-03T11:00:00Z"
}
```

| الحقل | النوع | Nullable | الوصف |
|-------|-------|----------|-------|
| `responseID` | `int` | ❌ | المعرف الفريد للاستجابة |
| `donorID` | `int` | ❌ | معرف المتبرع |
| `donorName` | `string` | ❌ | الاسم الكامل للمتبرع |
| `donorPhone` | `string` | ❌ | رقم هاتف المتبرع للتواصل |
| `bloodTypeName` | `string` | ❌ | فصيلة دم المتبرع (مثال: `A+`) |
| `requestID` | `int` | ❌ | معرف طلب الدم |
| `patientName` | `string` | ❌ | اسم المريض صاحب الطلب |
| `urgencyLevel` | `int` (enum) | ❌ | درجة استعجال الطلب (1/2/3) |
| `status` | `int` (enum) | ❌ | حالة الاستجابة الحالية (1-6) |
| `statusDescription` | `string` | ❌ | الوصف النصي للحالة بالعربية |
| `notes` | `string` | ✅ | ملاحظات إضافية |
| `rejectionReason` | `string` | ✅ | سبب الرفض أو الإلغاء |
| `responseDate` | `datetime` (ISO 8601) | ❌ | وقت تسجيل الاهتمام |
| `confirmedAt` | `datetime` (ISO 8601) | ✅ | وقت التأكيد (null حتى يُؤكَّد) |
| `donationID` | `int` | ✅ | معرف التبرع الفعلي (null حتى يتبرع) |
| `createdAt` | `datetime` (ISO 8601) | ❌ | وقت إنشاء السجل |
| `updatedAt` | `datetime` (ISO 8601) | ✅ | وقت آخر تحديث |

> 📌 **ملاحظة:** جميع التواريخ بتوقيت UTC (تنتهي بـ `Z`). المطور مسؤول عن تحويلها للتوقيت المحلي.

---

## 6. Endpoints — التفصيل الكامل

### Base: `/api/donorresponses`

---

### `POST /api/donorresponses`
**تسجيل استجابة جديدة (متبرع يُبدي اهتمامه)**

| | |
|--|--|
| **Method** | `POST` |
| **URL** | `/api/donorresponses` |
| **Auth** | غير مطلوب حالياً |
| **Response** | `201 Created` |

**Request Body:**
```json
{
  "donorID": 5,
  "requestID": 12,
  "notes": "يمكنني التبرع خلال يومين"
}
```

| الحقل | النوع | مطلوب؟ | القيود |
|-------|-------|---------|--------|
| `donorID` | `int` | ✅ | يجب أن يكون معرف متبرع موجود |
| `requestID` | `int` | ✅ | يجب أن يكون معرف طلب موجود |
| `notes` | `string` | ❌ | حد أقصى 500 حرف |

**Success Response — 201 Created:**
```json
{
  "success": true,
  "message": "تم تسجيل استجابتك بنجاح. سيتواصل معك الفريق قريباً",
  "data": { /* DonorResponseDto */ },
  "errors": null
}
```

**Error Responses — 400 Bad Request:**
```json
{
  "success": false,
  "message": "فصيلة دم المتبرع لا تتوافق مع فصيلة الدم المطلوبة في هذا الطلب",
  "data": null,
  "errors": null
}
```

| حالة الخطأ | رسالة `message` |
|------------|----------------|
| طلب غير موجود | `"طلب الدم غير موجود"` |
| الطلب مكتمل/ملغى | `"لا يمكن الاستجابة لهذا الطلب — حالته الحالية: Fulfilled"` |
| متبرع غير موجود | `"المتبرع غير موجود"` |
| متبرع غير نشط | `"المتبرع غير نشط ولا يمكنه الاستجابة"` |
| فصيلة دم غير متوافقة | `"فصيلة دم المتبرع لا تتوافق مع فصيلة الدم المطلوبة"` |
| استجابة مكررة | `"لديك استجابة نشطة مسبقاً لهذا الطلب"` |
| بيانات تحقق خاطئة | `"بيانات غير صحيحة"` + قائمة `errors` |

---

### `GET /api/donorresponses/{id}`
**جلب تفاصيل استجابة واحدة**

| | |
|--|--|
| **Method** | `GET` |
| **URL** | `/api/donorresponses/{id}` |
| **Auth** | غير مطلوب حالياً |

**Path Parameters:**
| المعامل | النوع | الوصف |
|---------|-------|-------|
| `id` | `int` | معرف الاستجابة |

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "تمت العملية بنجاح",
  "data": { /* DonorResponseDto */ },
  "errors": null
}
```

**Error — 404 Not Found:**
```json
{
  "success": false,
  "message": "الاستجابة غير موجودة",
  "data": null,
  "errors": null
}
```

---

### `GET /api/donorresponses/request/{requestId}`
**جلب جميع المستجيبين لطلب دم معين**

| | |
|--|--|
| **Method** | `GET` |
| **URL** | `/api/donorresponses/request/{requestId}` |
| **Auth** | غير مطلوب حالياً |

**Path Parameters:**
| المعامل | النوع | الوصف |
|---------|-------|-------|
| `requestId` | `int` | معرف طلب الدم |

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "تمت العملية بنجاح",
  "data": [
    { /* DonorResponseDto */ },
    { /* DonorResponseDto */ }
  ],
  "errors": null
}
```
> النتائج مرتبة تنازلياً حسب `responseDate` (الأحدث أولاً).  
> إذا لم توجد استجابات، يُرجَع `data: []` (مصفوفة فارغة).

**Error — 404 Not Found:** إذا كان `requestId` غير موجود.

---

### `GET /api/donorresponses/donor/{donorId}`
**جلب جميع استجابات متبرع معين**

| | |
|--|--|
| **Method** | `GET` |
| **URL** | `/api/donorresponses/donor/{donorId}` |
| **Auth** | غير مطلوب حالياً |

**Path Parameters:**
| المعامل | النوع | الوصف |
|---------|-------|-------|
| `donorId` | `int` | معرف المتبرع |

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "تمت العملية بنجاح",
  "data": [ /* قائمة DonorResponseDto */ ],
  "errors": null
}
```
> النتائج مرتبة تنازلياً حسب `responseDate`.

---

### `PUT /api/donorresponses/{id}/status`
**تحديث حالة الاستجابة (للموظف)**

| | |
|--|--|
| **Method** | `PUT` |
| **URL** | `/api/donorresponses/{id}/status` |
| **Auth** | غير مطلوب حالياً |

**Path Parameters:**
| المعامل | النوع | الوصف |
|---------|-------|-------|
| `id` | `int` | معرف الاستجابة |

**Request Body:**
```json
{
  "status": 2,
  "notes": "تم تأكيد الموعد يوم الأحد الساعة 10 صباحاً",
  "donationID": null
}
```

| الحقل | النوع | مطلوب؟ | ملاحظات |
|-------|-------|---------|---------|
| `status` | `int` (enum) | ✅ | قيمة من 1 إلى 6 |
| `notes` | `string` | ❌ | حد أقصى 500 حرف |
| `donationID` | `int` | ⚠️ | **مطلوب** فقط عند `status = 3 (Donated)` |

> ⚠️ **مهم جداً:** عند إرسال `status: 3 (Donated)` يجب إرسال `donationID` بمعرف تبرع موجود في النظام، وإلا ستُرفض العملية.

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "تم تحديث حالة الاستجابة بنجاح",
  "data": { /* DonorResponseDto المحدث */ },
  "errors": null
}
```

**Error Responses — 400 Bad Request:**

| حالة الخطأ | رسالة `message` |
|------------|----------------|
| استجابة غير موجودة | `"الاستجابة غير موجودة"` |
| انتقال غير مسموح | `"الانتقال من 'Interested' إلى 'Donated' غير مسموح"` |
| الاستجابة مكتملة | `"لا يمكن تغيير حالة استجابة تم التبرع بها مسبقاً"` |
| الاستجابة ملغاة | `"لا يمكن تغيير حالة استجابة ملغاة"` |
| `donationID` مفقود | `"يجب تحديد معرف التبرع عند تسجيل حالة 'تم التبرع'"` |
| `donationID` غير موجود | `"التبرع برقم X غير موجود"` |

---

### `POST /api/donorresponses/{id}/cancel`
**إلغاء استجابة**

| | |
|--|--|
| **Method** | `POST` |
| **URL** | `/api/donorresponses/{id}/cancel` |
| **Auth** | غير مطلوب حالياً |

**Path Parameters:**
| المعامل | النوع | الوصف |
|---------|-------|-------|
| `id` | `int` | معرف الاستجابة |

**Request Body:** نص عادي (string) — سبب الإلغاء
```json
"تراجع المتبرع عن الاستجابة"
```

> ⚠️ يجب إرسال الـ `Content-Type: application/json` وإحاطة النص بعلامتَي اقتباس.

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "تم إلغاء الاستجابة بنجاح",
  "data": true,
  "errors": null
}
```

**Error Responses — 400 Bad Request:**

| حالة الخطأ | رسالة `message` |
|------------|----------------|
| سبب الإلغاء فارغ | `"يجب ذكر سبب الإلغاء"` |
| الاستجابة انتهت مسبقاً | `"لا يمكن إلغاء الاستجابة — حالتها الحالية: Donated"` |

---

### `GET /api/bloodrequests/{id}/responses`
**الاستجابات عبر مسار طلب الدم**

| | |
|--|--|
| **Method** | `GET` |
| **URL** | `/api/bloodrequests/{id}/responses` |

> يُرجَع نفس نتيجة `GET /api/donorresponses/request/{id}` — طريق بديل للوصول من داخل سياق الطلب.

---

## 7. قواعد الأعمال والتحقق

| القاعدة | التفصيل |
|---------|---------|
| **توافق فصيلة الدم** | `Donor.BloodTypeID` يجب أن يساوي `BloodRequest.BloodTypeID` تماماً |
| **أهلية المتبرع** | `Donor.IsActive` يجب أن يكون `true` |
| **حالة الطلب** | يقبل الاستجابة فقط إذا كان `Pending (1)` أو `PartiallyFulfilled (3)` |
| **عدم التكرار** | لا يمكن للمتبرع الاستجابة للطلب نفسه إذا كانت استجابته `Interested` أو `Confirmed` |
| **صحة التبرع** | عند `status = Donated`، الـ `donationID` يجب أن يشير لتبرع موجود |

---

## 8. State Machine — انتقالات الحالة

```
               ┌─────────────────────────────────┐
               │                                 │
  POST /       ▼                                 │
donorresponses ● Interested(1) ──────────────────┤
               │                                 │
               ├──► Confirmed(2) ────────────────┤
               │         │                       │
               │         ├──► Donated(3) ✅ FINAL │
               │         │                       │
               │         └──► NoShow(5) ─────────┤
               │                   │             │
               │                   └─────────────┤
               │                                 │
               └──► Rejected(4) ─────────────────┤
                                                  │
                                                  ▼
                                          Cancelled(6) 🔒 FINAL
```

| الحالة الحالية | يمكن التغيير إلى |
|----------------|-----------------|
| `Interested (1)` | `Confirmed`, `Rejected`, `Cancelled` |
| `Confirmed (2)` | `Donated`, `NoShow`, `Cancelled` |
| `Rejected (4)` | `Cancelled` |
| `NoShow (5)` | `Confirmed`, `Cancelled` |
| `Donated (3)` | ❌ **لا يمكن تغييرها** |
| `Cancelled (6)` | ❌ **لا يمكن تغييرها** |

---

## 9. التأثير على طلبات الدم

عند تسجيل `status = 3 (Donated)`، يُحدَّث `BloodRequest.Status` **تلقائياً**:

| عدد التبرعات المكتملة | حالة الطلب الجديدة |
|----------------------|-------------------|
| `donatedCount >= QuantityNeeded` | `Fulfilled (2)` |
| `0 < donatedCount < QuantityNeeded` | `PartiallyFulfilled (3)` |

---

## 10. أمثلة cURL جاهزة

### تسجيل استجابة جديدة
```bash
curl -X POST "http://localhost:5000/api/donorresponses" \
  -H "Content-Type: application/json" \
  -d '{
    "donorID": 5,
    "requestID": 12,
    "notes": "يمكنني التبرع خلال يومين"
  }'
```

### جلب المستجيبين لطلب معين
```bash
curl -X GET "http://localhost:5000/api/donorresponses/request/12"
```

### تأكيد استجابة (Confirm)
```bash
curl -X PUT "http://localhost:5000/api/donorresponses/1/status" \
  -H "Content-Type: application/json" \
  -d '{
    "status": 2,
    "notes": "الموعد يوم الأحد الساعة 10 صباحاً",
    "donationID": null
  }'
```

### تسجيل التبرع الفعلي (Donate)
```bash
curl -X PUT "http://localhost:5000/api/donorresponses/1/status" \
  -H "Content-Type: application/json" \
  -d '{
    "status": 3,
    "notes": "تم التبرع بنجاح",
    "donationID": 88
  }'
```

### رفض استجابة
```bash
curl -X PUT "http://localhost:5000/api/donorresponses/1/status" \
  -H "Content-Type: application/json" \
  -d '{
    "status": 4,
    "notes": "المتبرع غير مؤهل طبياً حالياً",
    "donationID": null
  }'
```

### إلغاء استجابة
```bash
curl -X POST "http://localhost:5000/api/donorresponses/1/cancel" \
  -H "Content-Type: application/json" \
  -d '"تراجع المتبرع عن الاستجابة"'
```

### جلب استجابات متبرع
```bash
curl -X GET "http://localhost:5000/api/donorresponses/donor/5"
```

---

## 11. أكواد الخطأ المرجعية

| HTTP Status | المعنى | متى يحدث |
|-------------|--------|-----------|
| `200 OK` | نجاح | GET / PUT / POST cancel |
| `201 Created` | تم الإنشاء | POST /donorresponses |
| `400 Bad Request` | خطأ في البيانات أو قاعدة العمل | فصيلة دم خاطئة، انتقال حالة غير مسموح، إلخ |
| `404 Not Found` | السجل غير موجود | ID غير صحيح |
| `500 Internal Server Error` | خطأ في الخادم | مشكلة غير متوقعة |

**مثال على استجابة 500:**
```json
{
  "success": false,
  "message": "حدث خطأ غير متوقع",
  "data": null,
  "errors": null
}
```

---

## ✅ ملخص سريع للمطور

```
سجّل اهتمام   → POST /api/donorresponses
اجلب تفاصيل   → GET  /api/donorresponses/{id}
اجلب لطلب     → GET  /api/donorresponses/request/{requestId}
اجلب لمتبرع   → GET  /api/donorresponses/donor/{donorId}
حدّث الحالة   → PUT  /api/donorresponses/{id}/status
ألغِ          → POST /api/donorresponses/{id}/cancel
اجلب عبر طلب → GET  /api/bloodrequests/{id}/responses
```
