# BloodConnect API Documentation

## جدول المحتويات (Table of Contents)

- [المقدمة (Introduction)](#المقدمة-introduction)
- [دليل البدء السريع (Quick Start Guide)](#دليل-البدء-السريع-quick-start-guide)
- [Base URL & Configuration](#base-url--configuration)
- [المصادقة (Authentication)](#المصادقة-authentication)
- [البنية الموحدة للاستجابات (Common Response Structure)](#البنية-الموحدة-للاستجابات-common-response-structure)
- [الترقيم (Pagination)](#الترقيم-pagination)
- [نماذج البيانات (Data Models)](#نماذج-البيانات-data-models)
- [نقاط نهاية API (API Endpoints)](#نقاط-نهاية-api-api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Users Endpoints](#users-endpoints)
  - [Donors Endpoints](#donors-endpoints)
  - [Patients Endpoints](#patients-endpoints)
  - [Donations Endpoints](#donations-endpoints)
  - [Blood Requests Endpoints](#blood-requests-endpoints)
  - [Inventory Endpoints](#inventory-endpoints)
- [معالجة الأخطاء (Error Handling)](#معالجة-الأخطاء-error-handling)
- [أمثلة الاستخدام (Examples & Use Cases)](#أمثلة-الاستخدام-examples--use-cases)

---

## المقدمة (Introduction)

### نظرة عامة (Overview)

**BloodConnect** هو نظام إدارة بنك الدم شامل ومتطور، مصمم لتسهيل عمليات التبرع بالدم وإدارة المخزون وتلبية احتياجات المرضى بكفاءة عالية. يوفر النظام واجهة برمجية (API) قوية وآمنة تمكّن المطورين من بناء تطبيقات ويب وموبايل متكاملة لإدارة جميع جوانب عمليات بنك الدم.

### الميزات الرئيسية (Key Features)

يوفر BloodConnect API مجموعة شاملة من الميزات لإدارة عمليات بنك الدم:

- **إدارة المتبرعين (Donors Management)**: تسجيل المتبرعين، تتبع تاريخ التبرعات، التحقق من الأهلية للتبرع، والبحث حسب فصيلة الدم
- **إدارة المرضى (Patients Management)**: تسجيل بيانات المرضى، حفظ التاريخ الطبي، وربط المرضى بطلبات الدم
- **إدارة التبرعات (Donations Management)**: تسجيل عمليات التبرع، تتبع نتائج الفحوصات، وإدارة بيانات التبرعات
- **إدارة طلبات الدم (Blood Requests Management)**: إنشاء طلبات الدم، تحديد مستوى الأولوية، تتبع حالة الطلبات، والبحث عن الطلبات العاجلة
- **إدارة المخزون (Inventory Management)**: تتبع كميات الدم المتوفرة، مراقبة تواريخ الانتهاء، وإدارة حالة المخزون
- **نظام المصادقة والأمان (Authentication & Security)**: مصادقة آمنة باستخدام JWT، إدارة المستخدمين والصلاحيات

### التقنيات المستخدمة (Technologies)

تم بناء BloodConnect API باستخدام أحدث التقنيات لضمان الأداء العالي والأمان:

- **ASP.NET Core 10.0**: إطار عمل حديث وعالي الأداء لبناء Web APIs
- **SQL Server**: قاعدة بيانات قوية وموثوقة لتخزين البيانات
- **JWT (JSON Web Tokens)**: آلية مصادقة آمنة ومعيارية لحماية نقاط النهاية
- **RESTful Architecture**: تصميم API يتبع معايير REST لسهولة الاستخدام والتكامل

### الجمهور المستهدف (Target Audience)

هذا التوثيق موجه إلى:

- **مطورو تطبيقات الويب (Web Developers)**: لبناء واجهات إدارة بنوك الدم عبر المتصفح
- **مطورو تطبيقات الموبايل (Mobile Developers)**: لتطوير تطبيقات iOS وAndroid للمتبرعين والمرضى
- **مهندسو التكامل (Integration Engineers)**: لربط BloodConnect مع أنظمة المستشفيات والأنظمة الصحية الأخرى
- **مهندسو DevOps**: لنشر وإدارة النظام في بيئات الإنتاج

### كيفية استخدام هذا التوثيق (How to Use This Documentation)

- **للمبتدئين**: ابدأ بقسم [دليل البدء السريع](#دليل-البدء-السريع-quick-start-guide) للحصول على نظرة سريعة وتجربة أول طلب API
- **للمطورين**: راجع أقسام [نماذج البيانات](#نماذج-البيانات-data-models) و[نقاط نهاية API](#نقاط-نهاية-api-api-endpoints) للحصول على تفاصيل شاملة
- **للمرجع السريع**: استخدم [جدول المحتويات](#جدول-المحتويات-table-of-contents) للانتقال مباشرة إلى القسم المطلوب

---

## دليل البدء السريع (Quick Start Guide)

مرحباً بك في دليل البدء السريع لـ BloodConnect API! سيساعدك هذا الدليل على البدء في استخدام API خلال دقائق معدودة.

### خطوات الإعداد الأولية (Initial Setup)

#### 1. Base URL

جميع طلبات API تبدأ بالـ Base URL التالي:

```
https://api.bloodconnect.com/api
```

**ملاحظة:** في بيئة التطوير (Development)، قد يكون Base URL مختلفاً:
```
http://localhost:5000/api
```

#### 2. HTTP Headers المطلوبة

لجميع الطلبات، يجب تضمين الـ Headers التالية:

| Header | Value | Description |
|--------|-------|-------------|
| `Content-Type` | `application/json` | نوع المحتوى المرسل (JSON) |
| `Accept` | `application/json` | نوع المحتوى المطلوب في الاستجابة |
| `Authorization` | `Bearer {token}` | JWT Token للطلبات المحمية (بعد تسجيل الدخول) |

**ملاحظة:** الـ `Authorization` header مطلوب فقط للطلبات المحمية (Protected Endpoints).

---

### الخطوة 1: تسجيل مستخدم جديد (Register)

أول خطوة هي تسجيل مستخدم جديد في النظام.

#### Endpoint

```
POST /api/auth/register
```

#### Request Body

```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "role": "Admin"
}
```

#### مثال cURL

```bash
curl -X POST https://api.bloodconnect.com/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123!",
    "role": "Admin"
  }'
```

#### Response (Success - 201 Created)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john.doe@example.com",
    "role": "Admin",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "errors": null
}
```

#### Response (Error - 400 Bad Request)

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    "Email is already registered",
    "Password must be at least 8 characters"
  ]
}
```

---

### الخطوة 2: تسجيل الدخول والحصول على JWT Token (Login)

بعد التسجيل، يجب تسجيل الدخول للحصول على JWT Token الذي ستستخدمه في جميع الطلبات المحمية.

#### Endpoint

```
POST /api/auth/login
```

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

#### مثال cURL

```bash
curl -X POST https://api.bloodconnect.com/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidW5pcXVlX25hbWUiOiJqb2huX2RvZSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3MDUzMTgyMDAsImV4cCI6MTcwNTQwNDYwMCwiaWF0IjoxNzA1MzE4MjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    "expiresAt": "2024-01-16T10:30:00Z",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john.doe@example.com",
      "role": "Admin"
    }
  },
  "errors": null
}
```

**مهم جداً:** احفظ الـ `token` من الاستجابة، ستحتاجه في جميع الطلبات المحمية!

#### Response (Error - 401 Unauthorized)

```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null,
  "errors": [
    "Authentication failed"
  ]
}
```

---

### الخطوة 3: أول طلب محمي باستخدام Token

الآن بعد حصولك على JWT Token، يمكنك إجراء طلبات محمية. لنجرب الحصول على قائمة المتبرعين.

#### Endpoint

```
GET /api/donors?pageNumber=1&pageSize=10
```

#### مثال cURL

```bash
curl -X GET "https://api.bloodconnect.com/api/donors?pageNumber=1&pageSize=10" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidW5pcXVlX25hbWUiOiJqb2huX2RvZSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3MDUzMTgyMDAsImV4cCI6MTcwNTQwNDYwMCwiaWF0IjoxNzA1MzE4MjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
```

**ملاحظة مهمة:** استبدل الـ Token في الأمر أعلاه بالـ Token الذي حصلت عليه من Login!

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Donors retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "userId": 2,
        "firstName": "Ahmed",
        "lastName": "Ali",
        "dateOfBirth": "1990-05-15T00:00:00Z",
        "gender": 0,
        "bloodType": "O+",
        "phoneNumber": "+966501234567",
        "email": "ahmed.ali@example.com",
        "address": "123 King Fahd Road",
        "city": "Riyadh",
        "lastDonationDate": "2024-01-01T00:00:00Z",
        "isEligible": true,
        "createdAt": "2023-12-01T10:00:00Z",
        "updatedAt": "2024-01-01T10:00:00Z"
      },
      {
        "id": 2,
        "userId": 3,
        "firstName": "Fatima",
        "lastName": "Hassan",
        "dateOfBirth": "1995-08-20T00:00:00Z",
        "gender": 1,
        "bloodType": "A+",
        "phoneNumber": "+966502345678",
        "email": "fatima.hassan@example.com",
        "address": "456 Olaya Street",
        "city": "Riyadh",
        "lastDonationDate": "2023-12-15T00:00:00Z",
        "isEligible": true,
        "createdAt": "2023-11-15T10:00:00Z",
        "updatedAt": "2023-12-15T10:00:00Z"
      }
    ],
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 1,
    "totalCount": 2
  },
  "errors": null
}
```

#### Response (Error - 401 Unauthorized)

إذا لم تقم بتضمين Token أو كان Token غير صالح:

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

---

### نصائح للبدء (Getting Started Tips)

#### 1. استخدام Postman أو Insomnia

لتسهيل اختبار API، ننصح باستخدام أدوات مثل:
- **Postman**: أداة شهيرة لاختبار APIs
- **Insomnia**: بديل خفيف وسهل الاستخدام

**خطوات الإعداد في Postman:**
1. أنشئ Collection جديدة باسم "BloodConnect API"
2. أضف متغير `base_url` بقيمة `https://api.bloodconnect.com/api`
3. أضف متغير `token` وقم بتحديثه بعد Login
4. في كل طلب محمي، أضف Header: `Authorization: Bearer {{token}}`

#### 2. إدارة JWT Token

- **مدة الصلاحية:** JWT Token صالح لمدة 24 ساعة من وقت الإصدار
- **التجديد:** عند انتهاء صلاحية Token، قم بتسجيل الدخول مرة أخرى للحصول على Token جديد
- **الأمان:** لا تشارك Token الخاص بك مع أحد، ولا تقم بتخزينه في الكود المصدري

#### 3. فهم بنية الاستجابات

جميع استجابات API تتبع بنية موحدة (`ServiceResponse<T>`):

```json
{
  "success": true/false,
  "message": "رسالة توضيحية",
  "data": { /* البيانات المطلوبة */ },
  "errors": [ /* قائمة الأخطاء إن وجدت */ ]
}
```

- **success**: `true` إذا نجح الطلب، `false` إذا فشل
- **message**: رسالة توضيحية عن نتيجة الطلب
- **data**: البيانات المطلوبة (null في حالة الفشل)
- **errors**: قائمة بالأخطاء (null في حالة النجاح)

#### 4. التعامل مع Pagination

عند طلب قوائم كبيرة (مثل المتبرعين، المرضى، إلخ)، استخدم Pagination:

```
GET /api/donors?pageNumber=1&pageSize=20
```

- **pageNumber**: رقم الصفحة (يبدأ من 1)
- **pageSize**: عدد العناصر في الصفحة (الافتراضي: 10، الحد الأقصى: 100)

#### 5. أكواد الحالة الشائعة (Common Status Codes)

| Code | Meaning | متى يحدث |
|------|---------|----------|
| 200 | OK | الطلب نجح |
| 201 | Created | تم إنشاء مورد جديد بنجاح |
| 400 | Bad Request | بيانات الطلب غير صحيحة |
| 401 | Unauthorized | Token مفقود أو غير صالح |
| 404 | Not Found | المورد المطلوب غير موجود |
| 500 | Internal Server Error | خطأ في الخادم |

#### 6. الخطوات التالية

بعد إتمام هذا الدليل، يمكنك:

1. **استكشاف Endpoints الأخرى**: راجع قسم [نقاط نهاية API](#نقاط-نهاية-api-api-endpoints) لمعرفة جميع الـ endpoints المتاحة
2. **فهم نماذج البيانات**: راجع قسم [نماذج البيانات](#نماذج-البيانات-data-models) لفهم بنية البيانات
3. **معالجة الأخطاء**: راجع قسم [معالجة الأخطاء](#معالجة-الأخطاء-error-handling) لمعرفة كيفية التعامل مع الأخطاء
4. **أمثلة متقدمة**: راجع قسم [أمثلة الاستخدام](#أمثلة-الاستخدام-examples--use-cases) لسيناريوهات استخدام واقعية

#### 7. نظرة عامة على Controllers المتاحة

BloodConnect API يوفر 7 Controllers رئيسية:

| Controller | الوصف | Endpoints |
|-----------|--------|-----------|
| **Authentication** | تسجيل المستخدمين والدخول | `/api/auth/*` |
| **Users** | إدارة المستخدمين | `/api/users/*` |
| **Donors** | إدارة المتبرعين | `/api/donors/*` |
| **Patients** | إدارة المرضى | `/api/patients/*` |
| **Donations** | إدارة التبرعات | `/api/donations/*` |
| **Blood Requests** | إدارة طلبات الدم | `/api/bloodrequests/*` |
| **Inventory** | إدارة مخزون الدم | `/api/inventory/*` |

---

### ملخص سريع (Quick Summary)

```bash
# 1. تسجيل مستخدم جديد
curl -X POST https://api.bloodconnect.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"Pass123!","role":"Admin"}'

# 2. تسجيل الدخول والحصول على Token
curl -X POST https://api.bloodconnect.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Pass123!"}'

# 3. استخدام Token في طلب محمي
curl -X GET "https://api.bloodconnect.com/api/donors?pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**تهانينا! 🎉** أنت الآن جاهز لاستخدام BloodConnect API. استمتع بالتطوير!

---

## Base URL & Configuration

### Base URL

جميع طلبات API تبدأ بالـ Base URL التالي. يختلف Base URL حسب البيئة التي تعمل عليها:

#### Production Environment (بيئة الإنتاج)

```
https://api.bloodconnect.com/api
```

استخدم هذا URL عند نشر تطبيقك في بيئة الإنتاج (Production). هذا هو الخادم الرسمي الذي يحتوي على البيانات الحقيقية.

**مثال طلب في Production:**
```bash
curl -X GET https://api.bloodconnect.com/api/donors \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Development Environment (بيئة التطوير)

```
http://localhost:5000/api
```

أو

```
https://dev.bloodconnect.com/api
```

استخدم هذا URL أثناء التطوير والاختبار. بيئة التطوير تحتوي على بيانات تجريبية ويمكنك إجراء التجارب عليها دون القلق من التأثير على البيانات الحقيقية.

**مثال طلب في Development:**
```bash
curl -X GET http://localhost:5000/api/donors \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Staging Environment (بيئة الاختبار - اختياري)

```
https://staging.bloodconnect.com/api
```

بيئة اختبار تحاكي بيئة الإنتاج، تُستخدم للاختبار النهائي قبل النشر.

---

### HTTP Headers المطلوبة (Required Headers)

لجميع الطلبات إلى API، يجب تضمين الـ Headers التالية:

| Header | Value | Required | Description |
|--------|-------|----------|-------------|
| `Content-Type` | `application/json` | نعم | نوع المحتوى المرسل في Request Body |
| `Accept` | `application/json` | نعم | نوع المحتوى المطلوب في الاستجابة |
| `Authorization` | `Bearer {token}` | للطلبات المحمية فقط | JWT Token للمصادقة |

**مثال Headers كاملة:**

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**ملاحظات مهمة:**
- الـ `Authorization` header مطلوب فقط للـ endpoints المحمية (Protected Endpoints)
- endpoints التسجيل والدخول (`/api/auth/register` و `/api/auth/login`) لا تتطلب `Authorization` header
- تأكد من استخدام `Bearer` قبل الـ Token مع مسافة واحدة

---

### CORS Configuration (إعدادات مشاركة الموارد)

BloodConnect API يدعم **CORS (Cross-Origin Resource Sharing)** للسماح لتطبيقات الويب من نطاقات (domains) مختلفة بالوصول إلى API.

#### Origins المسموح بها (Allowed Origins)

##### في بيئة Production:

API يسمح بالطلبات من النطاقات التالية فقط:

```
https://bloodconnect.com
https://www.bloodconnect.com
https://app.bloodconnect.com
https://mobile.bloodconnect.com
```

**ملاحظة:** أي طلبات من نطاقات أخرى سيتم رفضها لأسباب أمنية.

##### في بيئة Development:

API يسمح بالطلبات من جميع النطاقات المحلية:

```
http://localhost:*
http://127.0.0.1:*
https://localhost:*
```

هذا يسمح لك بتطوير تطبيقك محلياً على أي منفذ (port) دون قيود.

#### HTTP Methods المسموح بها (Allowed Methods)

API يدعم الـ HTTP Methods التالية:

```
GET, POST, PUT, PATCH, DELETE, OPTIONS
```

#### Headers المسموح بها (Allowed Headers)

يمكنك إرسال الـ Headers التالية في طلباتك:

```
Content-Type
Accept
Authorization
X-Requested-With
```

#### Credentials Support

API يدعم إرسال Credentials (مثل Cookies وAuthentication headers) في الطلبات عبر CORS:

```
Access-Control-Allow-Credentials: true
```

#### Preflight Requests

عند إجراء طلبات معقدة (مثل POST أو PUT مع Custom Headers)، المتصفح قد يرسل **Preflight Request** (OPTIONS request) أولاً للتحقق من الأذونات. API يتعامل مع هذه الطلبات تلقائياً.

**مثال Preflight Request:**

```http
OPTIONS /api/donors HTTP/1.1
Host: api.bloodconnect.com
Origin: https://app.bloodconnect.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

**Response:**

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.bloodconnect.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-Requested-With
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

---

### معالجة أخطاء CORS (CORS Error Handling)

إذا واجهت خطأ CORS في المتصفح، تحقق من:

1. **Origin الخاص بك مسموح به**: تأكد أن نطاق تطبيقك مدرج في قائمة Allowed Origins
2. **Headers صحيحة**: تأكد من إرسال `Content-Type` و `Accept` headers
3. **Method مدعوم**: تأكد أنك تستخدم HTTP Method مدعوم (GET, POST, PUT, PATCH, DELETE)
4. **Credentials**: إذا كنت ترسل Credentials، تأكد من تفعيل `withCredentials: true` في طلبك

**مثال خطأ CORS شائع:**

```
Access to fetch at 'https://api.bloodconnect.com/api/donors' from origin 'http://unauthorized-domain.com' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**الحل:** تواصل مع فريق التطوير لإضافة نطاقك إلى قائمة Allowed Origins.

---

### أمثلة الاتصال من منصات مختلفة

#### JavaScript (Fetch API)

```javascript
// في بيئة Production
const baseURL = 'https://api.bloodconnect.com/api';
const token = 'YOUR_JWT_TOKEN';

fetch(`${baseURL}/donors`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  credentials: 'include' // لإرسال Cookies إذا لزم الأمر
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.bloodconnect.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// إضافة Token لجميع الطلبات
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// استخدام
api.get('/donors')
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));
```

#### Python (Requests)

```python
import requests

base_url = 'https://api.bloodconnect.com/api'
token = 'YOUR_JWT_TOKEN'

headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Bearer {token}'
}

response = requests.get(f'{base_url}/donors', headers=headers)
data = response.json()
print(data)
```

#### C# (.NET)

```csharp
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

public class BloodConnectClient
{
    private readonly HttpClient _httpClient;
    private const string BaseUrl = "https://api.bloodconnect.com/api";

    public BloodConnectClient(string token)
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(BaseUrl)
        };
        
        _httpClient.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));
        
        _httpClient.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", token);
    }

    public async Task<string> GetDonorsAsync()
    {
        var response = await _httpClient.GetAsync("/donors");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }
}
```

#### Swift (iOS)

```swift
import Foundation

let baseURL = "https://api.bloodconnect.com/api"
let token = "YOUR_JWT_TOKEN"

func getDonors() {
    guard let url = URL(string: "\(baseURL)/donors") else { return }
    
    var request = URLRequest(url: url)
    request.httpMethod = "GET"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue("application/json", forHTTPHeaderField: "Accept")
    request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    
    URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            print("Error: \(error)")
            return
        }
        
        if let data = data {
            // معالجة البيانات
            print(String(data: data, encoding: .utf8) ?? "")
        }
    }.resume()
}
```

#### Kotlin (Android)

```kotlin
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response

class BloodConnectClient(private val token: String) {
    private val baseUrl = "https://api.bloodconnect.com/api"
    private val client = OkHttpClient()

    fun getDonors(): Response {
        val request = Request.Builder()
            .url("$baseUrl/donors")
            .addHeader("Content-Type", "application/json")
            .addHeader("Accept", "application/json")
            .addHeader("Authorization", "Bearer $token")
            .build()

        return client.newCall(request).execute()
    }
}
```

---

### نصائح للإعداد (Configuration Tips)

#### 1. استخدام متغيرات البيئة (Environment Variables)

لا تقم بتضمين Base URL مباشرة في الكود. استخدم متغيرات البيئة:

**JavaScript (.env):**
```env
REACT_APP_API_BASE_URL=https://api.bloodconnect.com/api
REACT_APP_API_TOKEN=your_token_here
```

**Python (.env):**
```env
API_BASE_URL=https://api.bloodconnect.com/api
API_TOKEN=your_token_here
```

#### 2. إنشاء API Client مركزي

أنشئ ملف واحد لإدارة جميع طلبات API:

```javascript
// api-client.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const apiClient = {
  get: (endpoint, token) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  },
  // ... POST, PUT, DELETE methods
};
```

#### 3. معالجة انتهاء صلاحية Token

قم بإنشاء Interceptor للتحقق من انتهاء صلاحية Token وتجديده تلقائياً:

```javascript
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## المصادقة (Authentication)

BloodConnect API يستخدم **JWT (JSON Web Tokens)** كآلية مصادقة آمنة ومعيارية لحماية نقاط النهاية (Endpoints) وضمان أن الطلبات تأتي من مستخدمين مصرح لهم.

---

### ما هو JWT (JSON Web Token)؟

**JWT** هو معيار مفتوح (RFC 7519) لإنشاء رموز وصول (Access Tokens) آمنة تُستخدم لنقل المعلومات بين الأطراف بشكل آمن. JWT يتكون من ثلاثة أجزاء مفصولة بنقاط:

```
header.payload.signature
```

#### مثال JWT Token:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidW5pcXVlX25hbWUiOiJqb2huX2RvZSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3MDUzMTgyMDAsImV4cCI6MTcwNTQwNDYwMCwiaWF0IjoxNzA1MzE4MjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

#### أجزاء JWT:

1. **Header (الرأس)**: يحتوي على نوع الرمز (JWT) وخوارزمية التشفير المستخدمة (مثل HS256)
   ```json
   {
     "alg": "HS256",
     "typ": "JWT"
   }
   ```

2. **Payload (الحمولة)**: يحتوي على البيانات (Claims) مثل معرف المستخدم، الاسم، البريد الإلكتروني، الدور، وتاريخ الانتهاء
   ```json
   {
     "sub": "1",
     "unique_name": "john_doe",
     "email": "john.doe@example.com",
     "role": "Admin",
     "nbf": 1705318200,
     "exp": 1705404600,
     "iat": 1705318200
   }
   ```

3. **Signature (التوقيع)**: يُستخدم للتحقق من أن الرمز لم يتم التلاعب به
   ```
   HMACSHA256(
     base64UrlEncode(header) + "." + base64UrlEncode(payload),
     secret_key
   )
   ```

#### مزايا JWT:

- **Stateless**: لا يحتاج الخادم لتخزين معلومات الجلسة (Session)
- **آمن**: التوقيع الرقمي يضمن عدم التلاعب بالبيانات
- **محمول**: يمكن استخدامه عبر منصات ولغات برمجة مختلفة
- **قابل للتوسع**: يمكن إضافة معلومات إضافية في Payload

---

### كيفية الحصول على JWT Token

للحصول على JWT Token، يجب عليك تسجيل الدخول باستخدام endpoint `/api/auth/login` مع بيانات اعتماد صحيحة (البريد الإلكتروني وكلمة المرور).

#### Endpoint: تسجيل الدخول (Login)

```
POST /api/auth/login
```

#### Request Body:

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

#### مثال cURL:

```bash
curl -X POST https://api.bloodconnect.com/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

#### Response (Success - 200 OK):

عند نجاح تسجيل الدخول، ستحصل على استجابة تحتوي على JWT Token:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidW5pcXVlX25hbWUiOiJqb2huX2RvZSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3MDUzMTgyMDAsImV4cCI6MTcwNTQwNDYwMCwiaWF0IjoxNzA1MzE4MjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    "expiresAt": "2024-01-16T10:30:00Z",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john.doe@example.com",
      "role": "Admin"
    }
  },
  "errors": null
}
```

**مهم جداً:** احفظ قيمة `token` من الاستجابة، ستحتاجها في جميع الطلبات المحمية!

#### Response (Error - 401 Unauthorized):

إذا كانت بيانات الاعتماد غير صحيحة:

```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null,
  "errors": [
    "Authentication failed. Please check your credentials."
  ]
}
```

---

### كيفية استخدام JWT Token في الطلبات

بعد الحصول على JWT Token من endpoint تسجيل الدخول، يجب تضمينه في **Authorization Header** لجميع الطلبات المحمية (Protected Endpoints).

#### صيغة Authorization Header:

```
Authorization: Bearer {token}
```

**ملاحظات مهمة:**
- يجب استخدام الكلمة `Bearer` متبوعة بمسافة واحدة ثم الـ Token
- لا تضع الـ Token بين علامات اقتباس
- تأكد من نسخ الـ Token كاملاً دون أي مسافات إضافية

#### مثال كامل:

```http
GET /api/donors HTTP/1.1
Host: api.bloodconnect.com
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidW5pcXVlX25hbWUiOiJqb2huX2RvZSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3MDUzMTgyMDAsImV4cCI6MTcwNTQwNDYwMCwiaWF0IjoxNzA1MzE4MjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

#### مثال cURL:

```bash
curl -X GET https://api.bloodconnect.com/api/donors \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidW5pcXVlX25hbWUiOiJqb2huX2RvZSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3MDUzMTgyMDAsImV4cCI6MTcwNTQwNDYwMCwiaWF0IjoxNzA1MzE4MjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
```

#### مثال JavaScript (Fetch):

```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // الـ Token الذي حصلت عليه من Login

fetch('https://api.bloodconnect.com/api/donors', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### مثال Python (Requests):

```python
import requests

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  # الـ Token الذي حصلت عليه من Login

headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Bearer {token}'
}

response = requests.get('https://api.bloodconnect.com/api/donors', headers=headers)
data = response.json()
print(data)
```

#### مثال C# (.NET):

```csharp
using System.Net.Http;
using System.Net.Http.Headers;

var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // الـ Token الذي حصلت عليه من Login

var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

var response = await client.GetAsync("https://api.bloodconnect.com/api/donors");
var content = await response.Content.ReadAsStringAsync();
```

---

### مدة صلاحية JWT Token

JWT Token الصادر من BloodConnect API له مدة صلاحية محددة لأسباب أمنية.

#### معلومات الصلاحية:

| Property | Value | Description |
|----------|-------|-------------|
| **مدة الصلاحية** | 24 ساعة | Token صالح لمدة 24 ساعة من وقت الإصدار |
| **حقل الانتهاء** | `exp` | يحتوي Payload على حقل `exp` (Expiration Time) بصيغة Unix Timestamp |
| **حقل الإصدار** | `iat` | يحتوي Payload على حقل `iat` (Issued At) بصيغة Unix Timestamp |
| **حقل البداية** | `nbf` | يحتوي Payload على حقل `nbf` (Not Before) - Token لا يكون صالحاً قبل هذا الوقت |

#### مثال Payload مع معلومات الصلاحية:

```json
{
  "sub": "1",
  "unique_name": "john_doe",
  "email": "john.doe@example.com",
  "role": "Admin",
  "iat": 1705318200,
  "nbf": 1705318200,
  "exp": 1705404600
}
```

**شرح الحقول:**
- **iat** (Issued At): `1705318200` = 2024-01-15 10:30:00 UTC (وقت إصدار Token)
- **nbf** (Not Before): `1705318200` = 2024-01-15 10:30:00 UTC (Token صالح من هذا الوقت)
- **exp** (Expiration): `1705404600` = 2024-01-16 10:30:00 UTC (Token ينتهي في هذا الوقت)

#### حساب وقت الانتهاء:

عند تسجيل الدخول، تحصل على حقل `expiresAt` في الاستجابة يوضح متى سينتهي Token:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2024-01-16T10:30:00Z",
    "user": { ... }
  }
}
```

#### ماذا يحدث عند انتهاء صلاحية Token؟

عند محاولة استخدام Token منتهي الصلاحية، ستحصل على استجابة خطأ:

**Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Token has expired",
  "data": null,
  "errors": [
    "Your authentication token has expired. Please login again."
  ]
}
```

**HTTP Status Code:** `401 Unauthorized`

#### كيفية التعامل مع انتهاء الصلاحية:

1. **تسجيل الدخول مرة أخرى**: عند انتهاء صلاحية Token، يجب على المستخدم تسجيل الدخول مرة أخرى للحصول على Token جديد

2. **التحقق من الصلاحية قبل الطلب**: يمكنك فك تشفير Token والتحقق من حقل `exp` قبل إرسال الطلب

3. **معالجة خطأ 401 تلقائياً**: في تطبيقك، قم بإنشاء Interceptor يكتشف خطأ 401 ويوجه المستخدم لصفحة تسجيل الدخول

**مثال JavaScript للتحقق من صلاحية Token:**

```javascript
function isTokenExpired(token) {
  try {
    // فك تشفير Payload (الجزء الثاني من Token)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // التحقق من حقل exp
    const expirationTime = payload.exp * 1000; // تحويل إلى milliseconds
    const currentTime = Date.now();
    
    return currentTime >= expirationTime;
  } catch (error) {
    return true; // إذا فشل فك التشفير، اعتبر Token منتهي
  }
}

// استخدام
const token = localStorage.getItem('token');
if (isTokenExpired(token)) {
  // إعادة توجيه المستخدم لصفحة تسجيل الدخول
  window.location.href = '/login';
}
```

**مثال Axios Interceptor:**

```javascript
import axios from 'axios';

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

### أمثلة عملية كاملة

#### مثال 1: تسجيل الدخول واستخدام Token

**الخطوة 1: تسجيل الدخول**

```bash
curl -X POST https://api.bloodconnect.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed.ali@example.com",
    "password": "MySecurePass123!"
  }'
```

**الاستجابة:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwidW5pcXVlX25hbWUiOiJhaG1lZF9hbGkiLCJlbWFpbCI6ImFobWVkLmFsaUBleGFtcGxlLmNvbSIsInJvbGUiOiJVc2VyIiwibmJmIjoxNzA1MzIwMDAwLCJleHAiOjE3MDU0MDY0MDAsImlhdCI6MTcwNTMyMDAwMH0.abc123xyz789",
    "expiresAt": "2024-01-16T11:00:00Z",
    "user": {
      "id": 2,
      "username": "ahmed_ali",
      "email": "ahmed.ali@example.com",
      "role": "User"
    }
  },
  "errors": null
}
```

**الخطوة 2: استخدام Token للحصول على قائمة المتبرعين**

```bash
curl -X GET "https://api.bloodconnect.com/api/donors?pageNumber=1&pageSize=5" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwidW5pcXVlX25hbWUiOiJhaG1lZF9hbGkiLCJlbWFpbCI6ImFobWVkLmFsaUBleGFtcGxlLmNvbSIsInJvbGUiOiJVc2VyIiwibmJmIjoxNzA1MzIwMDAwLCJleHAiOjE3MDU0MDY0MDAsImlhdCI6MTcwNTMyMDAwMH0.abc123xyz789"
```

**الاستجابة:**

```json
{
  "success": true,
  "message": "Donors retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "firstName": "Ahmed",
        "lastName": "Ali",
        "bloodType": "O+",
        "isEligible": true
      }
    ],
    "pageNumber": 1,
    "pageSize": 5,
    "totalPages": 1,
    "totalCount": 1
  },
  "errors": null
}
```

---

#### مثال 2: إنشاء متبرع جديد باستخدام Token

```bash
curl -X POST https://api.bloodconnect.com/api/donors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwidW5pcXVlX25hbWUiOiJhaG1lZF9hbGkiLCJlbWFpbCI6ImFobWVkLmFsaUBleGFtcGxlLmNvbSIsInJvbGUiOiJVc2VyIiwibmJmIjoxNzA1MzIwMDAwLCJleHAiOjE3MDU0MDY0MDAsImlhdCI6MTcwNTMyMDAwMH0.abc123xyz789" \
  -d '{
    "userId": 2,
    "firstName": "Fatima",
    "lastName": "Hassan",
    "dateOfBirth": "1995-08-20",
    "gender": 1,
    "bloodType": "A+",
    "phoneNumber": "+966502345678",
    "email": "fatima.hassan@example.com",
    "address": "456 Olaya Street",
    "city": "Riyadh"
  }'
```

**الاستجابة:**

```json
{
  "success": true,
  "message": "Donor created successfully",
  "data": {
    "id": 2,
    "userId": 2,
    "firstName": "Fatima",
    "lastName": "Hassan",
    "dateOfBirth": "1995-08-20T00:00:00Z",
    "gender": 1,
    "bloodType": "A+",
    "phoneNumber": "+966502345678",
    "email": "fatima.hassan@example.com",
    "address": "456 Olaya Street",
    "city": "Riyadh",
    "lastDonationDate": null,
    "isEligible": true,
    "createdAt": "2024-01-15T11:30:00Z",
    "updatedAt": "2024-01-15T11:30:00Z"
  },
  "errors": null
}
```

---

#### مثال 3: محاولة الوصول بدون Token (خطأ)

```bash
curl -X GET https://api.bloodconnect.com/api/donors \
  -H "Content-Type: application/json"
```

**الاستجابة (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token. Please login to access this resource."
  ]
}
```

---

#### مثال 4: محاولة الوصول بـ Token غير صحيح (خطأ)

```bash
curl -X GET https://api.bloodconnect.com/api/donors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid_token_here"
```

**الاستجابة (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Invalid authentication token",
  "data": null,
  "errors": [
    "The provided token is invalid or malformed. Please login again."
  ]
}
```

---

### نصائح أمنية مهمة (Security Best Practices)

#### 1. تخزين Token بشكل آمن

**في تطبيقات الويب:**
- استخدم `localStorage` أو `sessionStorage` لتخزين Token
- لا تخزن Token في Cookies إذا كان موقعك عرضة لـ XSS attacks
- استخدم HTTPS دائماً لمنع اعتراض Token

```javascript
// تخزين Token بعد Login
localStorage.setItem('token', response.data.token);
localStorage.setItem('tokenExpiry', response.data.expiresAt);

// استرجاع Token
const token = localStorage.getItem('token');

// حذف Token عند Logout
localStorage.removeItem('token');
localStorage.removeItem('tokenExpiry');
```

**في تطبيقات الموبايل:**
- استخدم Secure Storage (مثل Keychain في iOS أو Keystore في Android)
- لا تخزن Token في SharedPreferences العادية

#### 2. لا تشارك Token

- **لا تشارك Token** مع أي شخص آخر
- **لا تنشر Token** في الكود المصدري أو في GitHub
- **لا ترسل Token** عبر البريد الإلكتروني أو الرسائل

#### 3. استخدام HTTPS فقط

- **دائماً** استخدم HTTPS في بيئة Production
- لا ترسل Token عبر HTTP غير المشفر
- تأكد من صحة شهادة SSL

#### 4. معالجة انتهاء الصلاحية

- تحقق من صلاحية Token قبل إرسال الطلبات
- أنشئ Interceptor للتعامل مع أخطاء 401 تلقائياً
- وجه المستخدم لصفحة Login عند انتهاء الصلاحية

#### 5. تسجيل الخروج (Logout)

عند تسجيل الخروج، احذف Token من التخزين المحلي:

```javascript
function logout() {
  // حذف Token
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');
  
  // إعادة توجيه المستخدم
  window.location.href = '/login';
}
```

#### 6. عدم فك تشفير Token في الـ Frontend

- Token يحتوي على معلومات حساسة (مثل User ID والدور)
- لا تعتمد على البيانات في Token للتحقق من الصلاحيات في Frontend
- الخادم (Backend) هو المسؤول الوحيد عن التحقق من الصلاحيات

---

### الأسئلة الشائعة (FAQ)

#### س1: هل يمكنني استخدام نفس Token من أجهزة متعددة؟

**ج:** نعم، يمكنك استخدام نفس Token من أجهزة متعددة (مثل الموبايل والويب) طالما أن Token لم تنته صلاحيته. ومع ذلك، لأسباب أمنية، يُنصح بتسجيل الدخول من كل جهاز للحصول على Token منفصل.

#### س2: ماذا أفعل إذا نسيت Token؟

**ج:** لا يمكن استرجاع Token بعد فقدانه. يجب عليك تسجيل الدخول مرة أخرى للحصول على Token جديد.

#### س3: هل يمكنني تجديد Token دون تسجيل الدخول مرة أخرى؟

**ج:** حالياً، BloodConnect API لا يدعم تجديد Token (Refresh Token). يجب عليك تسجيل الدخول مرة أخرى عند انتهاء صلاحية Token. قد يتم إضافة ميزة Refresh Token في إصدارات مستقبلية.

#### س4: هل Token آمن؟

**ج:** نعم، JWT Token آمن طالما:
- تستخدم HTTPS لإرسال الطلبات
- تخزن Token بشكل آمن في تطبيقك
- لا تشارك Token مع أحد
- تتعامل مع انتهاء الصلاحية بشكل صحيح

#### س5: ما هي الـ Endpoints التي تتطلب Token؟

**ج:** جميع الـ Endpoints تتطلب Token **باستثناء**:
- `POST /api/auth/register` (تسجيل مستخدم جديد)
- `POST /api/auth/login` (تسجيل الدخول)

جميع الـ Endpoints الأخرى (Users، Donors، Patients، Donations، Blood Requests، Inventory) تتطلب Token صالح.

#### س6: كيف أعرف إذا كان Token منتهي الصلاحية؟

**ج:** يمكنك معرفة ذلك بطريقتين:
1. فك تشفير Token والتحقق من حقل `exp`
2. محاولة إرسال طلب - إذا حصلت على خطأ 401 مع رسالة "Token has expired"، فهذا يعني أن Token منتهي

---

### ملخص سريع (Quick Summary)

| الموضوع | التفاصيل |
|---------|----------|
| **آلية المصادقة** | JWT (JSON Web Tokens) |
| **كيفية الحصول على Token** | `POST /api/auth/login` مع email وpassword |
| **كيفية استخدام Token** | إضافة Header: `Authorization: Bearer {token}` |
| **مدة الصلاحية** | 24 ساعة من وقت الإصدار |
| **عند انتهاء الصلاحية** | تسجيل الدخول مرة أخرى للحصول على Token جديد |
| **Endpoints المحمية** | جميع الـ Endpoints ما عدا `/api/auth/register` و `/api/auth/login` |
| **خطأ Token مفقود** | 401 Unauthorized - "Missing or invalid authentication token" |
| **خطأ Token منتهي** | 401 Unauthorized - "Token has expired" |

---

---

## البنية الموحدة للاستجابات (Common Response Structure)

جميع استجابات BloodConnect API تتبع بنية موحدة تُسمى **ServiceResponse<T>**. هذه البنية الموحدة تسهل على المطورين التعامل مع الاستجابات بشكل متسق ومتوقع، سواء كانت الاستجابة ناجحة أو تحتوي على أخطاء.

---

### ما هو ServiceResponse<T>؟

**ServiceResponse<T>** هو غلاف (Wrapper) موحد يُستخدم لجميع استجابات API. الحرف `T` يمثل نوع البيانات (Generic Type) الذي يمكن أن يكون أي كائن (Object) أو قائمة (Array) حسب نوع الطلب.

#### مزايا استخدام ServiceResponse:

- **التوحيد (Consistency)**: جميع الاستجابات لها نفس البنية، مما يسهل معالجتها
- **الوضوح (Clarity)**: يمكنك معرفة حالة الطلب فوراً من خلال حقل `success`
- **معالجة الأخطاء (Error Handling)**: الأخطاء موحدة ومنظمة في حقل `errors`
- **المرونة (Flexibility)**: حقل `data` يمكن أن يحتوي على أي نوع بيانات

---

### بنية ServiceResponse<T>

```typescript
{
  success: boolean,      // حالة الطلب: true للنجاح، false للفشل
  message: string,       // رسالة توضيحية عن نتيجة الطلب
  data: T | null,        // البيانات المطلوبة (null في حالة الفشل)
  errors: string[] | null // قائمة الأخطاء (null في حالة النجاح)
}
```

---

### خصائص ServiceResponse (Properties)

| Property | Type | Description | متى يكون null؟ |
|----------|------|-------------|----------------|
| **success** | `boolean` | يشير إلى نجاح أو فشل الطلب. `true` = نجح، `false` = فشل | لا يكون null أبداً |
| **message** | `string` | رسالة توضيحية مقروءة للإنسان تصف نتيجة الطلب | لا يكون null أبداً |
| **data** | `T \| null` | البيانات المطلوبة. يمكن أن يكون كائن (Object)، قائمة (Array)، أو أي نوع بيانات آخر | `null` عند فشل الطلب |
| **errors** | `string[] \| null` | قائمة بالأخطاء أو رسائل التحقق (Validation). كل عنصر في القائمة يمثل خطأ واحد | `null` عند نجاح الطلب |

---

### شرح تفصيلي للخصائص

#### 1. success (boolean)

هذا الحقل يخبرك فوراً إذا كان الطلب قد نجح أم فشل.

- **`true`**: الطلب نجح، البيانات موجودة في حقل `data`
- **`false`**: الطلب فشل، الأخطاء موجودة في حقل `errors`

**مثال استخدام في JavaScript:**

```javascript
fetch('https://api.bloodconnect.com/api/donors')
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      console.log('Success:', result.data);
    } else {
      console.error('Error:', result.errors);
    }
  });
```

#### 2. message (string)

رسالة نصية توضح نتيجة الطلب. هذه الرسالة مفيدة للـ logging أو لعرضها للمستخدم.

**أمثلة رسائل النجاح:**
- `"User registered successfully"`
- `"Donors retrieved successfully"`
- `"Donation created successfully"`
- `"Blood request updated successfully"`

**أمثلة رسائل الفشل:**
- `"Validation failed"`
- `"Invalid email or password"`
- `"Resource not found"`
- `"Unauthorized access"`

#### 3. data (T | null)

يحتوي على البيانات الفعلية المطلوبة. نوع البيانات يعتمد على الـ endpoint:

- **كائن واحد (Single Object)**: عند طلب مورد محدد (مثل `GET /api/donors/1`)
- **قائمة (Array)**: عند طلب قائمة موارد (مثل `GET /api/donors`)
- **كائن مع Pagination**: عند طلب قائمة مع ترقيم صفحات
- **null**: عند فشل الطلب

**أمثلة أنواع data:**

```typescript
// مثال 1: كائن واحد (Single Donor)
data: {
  id: 1,
  firstName: "Ahmed",
  lastName: "Ali",
  bloodType: "O+"
}

// مثال 2: قائمة بسيطة (Array of Donors)
data: [
  { id: 1, firstName: "Ahmed", bloodType: "O+" },
  { id: 2, firstName: "Fatima", bloodType: "A+" }
]

// مثال 3: قائمة مع Pagination
data: {
  items: [...],
  pageNumber: 1,
  pageSize: 10,
  totalPages: 5,
  totalCount: 50
}

// مثال 4: عند الفشل
data: null
```

#### 4. errors (string[] | null)

قائمة بالأخطاء أو رسائل التحقق من الصحة (Validation Errors). كل عنصر في القائمة يمثل خطأ واحد.

**متى يُستخدم:**
- أخطاء التحقق من الصحة (Validation Errors)
- أخطاء المصادقة (Authentication Errors)
- أخطاء الصلاحيات (Authorization Errors)
- أخطاء منطق الأعمال (Business Logic Errors)

**أمثلة:**

```json
// مثال 1: أخطاء التحقق من الصحة
"errors": [
  "Email is required",
  "Password must be at least 8 characters",
  "Phone number format is invalid"
]

// مثال 2: خطأ مصادقة
"errors": [
  "Invalid email or password"
]

// مثال 3: خطأ صلاحيات
"errors": [
  "You do not have permission to access this resource"
]

// مثال 4: عند النجاح
"errors": null
```

---

### مثال Success Response كامل

عندما ينجح الطلب، تكون الاستجابة كالتالي:

#### مثال 1: الحصول على متبرع واحد (GET /api/donors/1)

```json
{
  "success": true,
  "message": "Donor retrieved successfully",
  "data": {
    "id": 1,
    "userId": 2,
    "firstName": "Ahmed",
    "lastName": "Ali",
    "dateOfBirth": "1990-05-15T00:00:00Z",
    "gender": 0,
    "bloodType": "O+",
    "phoneNumber": "+966501234567",
    "email": "ahmed.ali@example.com",
    "address": "123 King Fahd Road",
    "city": "Riyadh",
    "lastDonationDate": "2024-01-01T00:00:00Z",
    "isEligible": true,
    "createdAt": "2023-12-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  },
  "errors": null
}
```

#### مثال 2: إنشاء تبرع جديد (POST /api/donations)

```json
{
  "success": true,
  "message": "Donation created successfully",
  "data": {
    "id": 15,
    "donorId": 1,
    "donationDate": "2024-01-15T10:30:00Z",
    "quantity": 450,
    "bloodType": "O+",
    "testResult": 1,
    "notes": "Donation completed successfully",
    "collectionCenter": "Riyadh Blood Bank",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "errors": null
}
```

#### مثال 3: الحصول على قائمة متبرعين مع Pagination (GET /api/donors?pageNumber=1&pageSize=10)

```json
{
  "success": true,
  "message": "Donors retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "userId": 2,
        "firstName": "Ahmed",
        "lastName": "Ali",
        "dateOfBirth": "1990-05-15T00:00:00Z",
        "gender": 0,
        "bloodType": "O+",
        "phoneNumber": "+966501234567",
        "email": "ahmed.ali@example.com",
        "address": "123 King Fahd Road",
        "city": "Riyadh",
        "lastDonationDate": "2024-01-01T00:00:00Z",
        "isEligible": true,
        "createdAt": "2023-12-01T10:00:00Z",
        "updatedAt": "2024-01-01T10:00:00Z"
      },
      {
        "id": 2,
        "userId": 3,
        "firstName": "Fatima",
        "lastName": "Hassan",
        "dateOfBirth": "1995-08-20T00:00:00Z",
        "gender": 1,
        "bloodType": "A+",
        "phoneNumber": "+966502345678",
        "email": "fatima.hassan@example.com",
        "address": "456 Olaya Street",
        "city": "Riyadh",
        "lastDonationDate": "2023-12-15T00:00:00Z",
        "isEligible": true,
        "createdAt": "2023-11-15T10:00:00Z",
        "updatedAt": "2023-12-15T10:00:00Z"
      }
    ],
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 5,
    "totalCount": 47
  },
  "errors": null
}
```

#### مثال 4: تسجيل دخول ناجح (POST /api/auth/login)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidW5pcXVlX25hbWUiOiJqb2huX2RvZSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3MDUzMTgyMDAsImV4cCI6MTcwNTQwNDYwMCwiaWF0IjoxNzA1MzE4MjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    "expiresAt": "2024-01-16T10:30:00Z",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john.doe@example.com",
      "role": "Admin"
    }
  },
  "errors": null
}
```

---

### مثال Error Response كامل

عندما يفشل الطلب، تكون الاستجابة كالتالي:

#### مثال 1: أخطاء التحقق من الصحة (400 Bad Request)

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    "Email is required",
    "Password must be at least 8 characters",
    "Phone number format is invalid"
  ]
}
```

**متى يحدث:** عند إرسال بيانات غير صحيحة أو ناقصة في Request Body.

**كيفية المعالجة:**
```javascript
if (!result.success) {
  result.errors.forEach(error => {
    console.error('Validation Error:', error);
    // عرض الخطأ للمستخدم
  });
}
```

#### مثال 2: خطأ مصادقة (401 Unauthorized)

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

**متى يحدث:** عند عدم تضمين JWT Token أو عند انتهاء صلاحيته.

**كيفية المعالجة:**
```javascript
if (response.status === 401) {
  // إعادة توجيه المستخدم لصفحة تسجيل الدخول
  window.location.href = '/login';
}
```

#### مثال 3: خطأ عدم وجود المورد (404 Not Found)

```json
{
  "success": false,
  "message": "Resource not found",
  "data": null,
  "errors": [
    "Donor with ID 999 does not exist"
  ]
}
```

**متى يحدث:** عند طلب مورد غير موجود (مثل متبرع بـ ID غير موجود).

**كيفية المعالجة:**
```javascript
if (response.status === 404) {
  console.error('Resource not found:', result.errors[0]);
  // عرض رسالة للمستخدم
}
```

#### مثال 4: خطأ صلاحيات (403 Forbidden)

```json
{
  "success": false,
  "message": "Access forbidden",
  "data": null,
  "errors": [
    "You do not have permission to perform this action"
  ]
}
```

**متى يحدث:** عند محاولة الوصول إلى مورد أو إجراء عملية بدون الصلاحيات الكافية.

**كيفية المعالجة:**
```javascript
if (response.status === 403) {
  alert('You do not have permission to access this resource');
}
```

#### مثال 5: خطأ في الخادم (500 Internal Server Error)

```json
{
  "success": false,
  "message": "An internal server error occurred",
  "data": null,
  "errors": [
    "An unexpected error occurred. Please try again later."
  ]
}
```

**متى يحدث:** عند حدوث خطأ غير متوقع في الخادم.

**كيفية المعالجة:**
```javascript
if (response.status === 500) {
  console.error('Server error:', result.errors);
  alert('An error occurred. Please try again later.');
}
```

#### مثال 6: خطأ تسجيل دخول (401 Unauthorized)

```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null,
  "errors": [
    "Authentication failed. Please check your credentials."
  ]
}
```

**متى يحدث:** عند إدخال بريد إلكتروني أو كلمة مرور غير صحيحة.

---

### كيفية التعامل مع ServiceResponse في الكود

#### JavaScript / TypeScript

```javascript
// تعريف Interface للـ ServiceResponse
interface ServiceResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[] | null;
}

// دالة مساعدة للتعامل مع الاستجابات
async function handleApiResponse<T>(response: Response): Promise<T> {
  const result: ServiceResponse<T> = await response.json();
  
  if (result.success) {
    console.log('Success:', result.message);
    return result.data as T;
  } else {
    console.error('Error:', result.message);
    console.error('Details:', result.errors);
    throw new Error(result.errors?.join(', ') || result.message);
  }
}

// استخدام
try {
  const response = await fetch('https://api.bloodconnect.com/api/donors/1', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const donor = await handleApiResponse<Donor>(response);
  console.log('Donor:', donor);
} catch (error) {
  console.error('Failed to fetch donor:', error);
}
```

#### Python

```python
from typing import TypeVar, Generic, Optional, List
from dataclasses import dataclass

T = TypeVar('T')

@dataclass
class ServiceResponse(Generic[T]):
    success: bool
    message: str
    data: Optional[T]
    errors: Optional[List[str]]

# دالة مساعدة للتعامل مع الاستجابات
def handle_api_response(response):
    result = response.json()
    
    if result['success']:
        print(f"Success: {result['message']}")
        return result['data']
    else:
        print(f"Error: {result['message']}")
        print(f"Details: {result['errors']}")
        raise Exception(', '.join(result['errors']) if result['errors'] else result['message'])

# استخدام
try:
    response = requests.get(
        'https://api.bloodconnect.com/api/donors/1',
        headers={'Authorization': f'Bearer {token}'}
    )
    donor = handle_api_response(response)
    print(f"Donor: {donor}")
except Exception as error:
    print(f"Failed to fetch donor: {error}")
```

#### C# (.NET)

```csharp
// تعريف Class للـ ServiceResponse
public class ServiceResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }
    public List<string> Errors { get; set; }
}

// دالة مساعدة للتعامل مع الاستجابات
public async Task<T> HandleApiResponseAsync<T>(HttpResponseMessage response)
{
    var json = await response.Content.ReadAsStringAsync();
    var result = JsonSerializer.Deserialize<ServiceResponse<T>>(json);
    
    if (result.Success)
    {
        Console.WriteLine($"Success: {result.Message}");
        return result.Data;
    }
    else
    {
        Console.WriteLine($"Error: {result.Message}");
        Console.WriteLine($"Details: {string.Join(", ", result.Errors ?? new List<string>())}");
        throw new Exception(string.Join(", ", result.Errors ?? new List<string> { result.Message }));
    }
}

// استخدام
try
{
    var response = await _httpClient.GetAsync("/donors/1");
    var donor = await HandleApiResponseAsync<Donor>(response);
    Console.WriteLine($"Donor: {donor}");
}
catch (Exception error)
{
    Console.WriteLine($"Failed to fetch donor: {error.Message}");
}
```

---

### ملخص سريع (Quick Summary)

| Scenario | success | message | data | errors |
|----------|---------|---------|------|--------|
| **طلب ناجح** | `true` | رسالة نجاح | البيانات المطلوبة | `null` |
| **خطأ تحقق من الصحة** | `false` | "Validation failed" | `null` | قائمة الأخطاء |
| **خطأ مصادقة** | `false` | "Unauthorized" | `null` | رسالة الخطأ |
| **مورد غير موجود** | `false` | "Not found" | `null` | رسالة الخطأ |
| **خطأ في الخادم** | `false` | "Server error" | `null` | رسالة الخطأ |

---

### نصائح مهمة (Important Tips)

1. **تحقق دائماً من `success` أولاً**: قبل الوصول إلى `data`، تأكد من أن `success` يساوي `true`

2. **عرض الأخطاء للمستخدم**: استخدم `errors` لعرض رسائل خطأ واضحة للمستخدم

3. **استخدم `message` للـ Logging**: حقل `message` مفيد لتسجيل الأحداث (Logging)

4. **تعامل مع `null`**: تذكر أن `data` يكون `null` عند الفشل، و`errors` يكون `null` عند النجاح

5. **أنواع البيانات المختلفة**: `data` يمكن أن يكون كائن واحد، قائمة، أو كائن مع pagination حسب الـ endpoint

6. **معالجة الأخطاء المتعددة**: حقل `errors` هو قائمة (Array)، لذا يمكن أن يحتوي على أكثر من خطأ واحد

---

## الترقيم (Pagination)

عند التعامل مع قوائم كبيرة من البيانات (مثل المتبرعين، المرضى، التبرعات، إلخ)، يستخدم BloodConnect API نظام **Pagination (الترقيم)** لتقسيم النتائج إلى صفحات صغيرة. هذا يحسن الأداء ويقلل من حجم البيانات المنقولة في كل طلب.

---

### معاملات الترقيم (Pagination Parameters)

عند طلب قوائم البيانات، يمكنك استخدام المعاملات التالية في **Query String** للتحكم في الترقيم:

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `pageNumber` | integer | 1 | لا | رقم الصفحة المطلوبة (يبدأ من 1) |
| `pageSize` | integer | 10 | لا | عدد العناصر في كل صفحة |

#### القيم الافتراضية (Default Values):

- **pageNumber**: إذا لم يتم تحديده، القيمة الافتراضية هي `1` (الصفحة الأولى)
- **pageSize**: إذا لم يتم تحديده، القيمة الافتراضية هي `10` عناصر لكل صفحة
- **الحد الأقصى لـ pageSize**: `100` عنصر لكل صفحة (لحماية الأداء)
- **الحد الأدنى لـ pageSize**: `1` عنصر لكل صفحة

#### قواعد الاستخدام:

- **pageNumber** يجب أن يكون عدد صحيح موجب (1، 2، 3، ...)
- **pageSize** يجب أن يكون بين 1 و 100
- إذا طلبت صفحة غير موجودة (مثل pageNumber=100 وهناك 5 صفحات فقط)، ستحصل على قائمة فارغة

---

### بنية الاستجابة مع الترقيم (Paginated Response Structure)

عند طلب قائمة بيانات مع pagination، تكون بنية الاستجابة كالتالي:

```json
{
  "success": true,
  "message": "Success message",
  "data": {
    "items": [
      // قائمة العناصر في الصفحة الحالية
    ],
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 5,
    "totalCount": 50
  },
  "errors": null
}
```

#### شرح الحقول:

| Field | Type | Description |
|-------|------|-------------|
| `items` | array | قائمة العناصر في الصفحة الحالية |
| `pageNumber` | integer | رقم الصفحة الحالية |
| `pageSize` | integer | عدد العناصر في كل صفحة |
| `totalPages` | integer | إجمالي عدد الصفحات المتاحة |
| `totalCount` | integer | إجمالي عدد العناصر في جميع الصفحات |

#### معلومات إضافية:

- **items**: يحتوي على العناصر الفعلية للصفحة المطلوبة. إذا كانت الصفحة فارغة، سيكون `items` قائمة فارغة `[]`
- **totalPages**: يُحسب تلقائياً بناءً على `totalCount` و `pageSize`. مثال: إذا كان `totalCount = 50` و `pageSize = 10`، فإن `totalPages = 5`
- **totalCount**: العدد الإجمالي لجميع العناصر في قاعدة البيانات (بغض النظر عن الترقيم)

---

### مثال Request مع Pagination

#### مثال 1: طلب الصفحة الأولى مع 10 عناصر (القيم الافتراضية)

```bash
curl -X GET "https://api.bloodconnect.com/api/donors?pageNumber=1&pageSize=10" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

أو ببساطة (بدون تحديد المعاملات، سيتم استخدام القيم الافتراضية):

```bash
curl -X GET "https://api.bloodconnect.com/api/donors" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### مثال 2: طلب الصفحة الثانية مع 20 عنصر

```bash
curl -X GET "https://api.bloodconnect.com/api/donors?pageNumber=2&pageSize=20" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### مثال 3: طلب الصفحة الثالثة مع 50 عنصر

```bash
curl -X GET "https://api.bloodconnect.com/api/donors?pageNumber=3&pageSize=50" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### مثال JavaScript (Fetch):

```javascript
const pageNumber = 2;
const pageSize = 20;
const token = 'YOUR_TOKEN_HERE';

fetch(`https://api.bloodconnect.com/api/donors?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    console.log('Items:', data.data.items);
    console.log('Current Page:', data.data.pageNumber);
    console.log('Total Pages:', data.data.totalPages);
    console.log('Total Count:', data.data.totalCount);
  })
  .catch(error => console.error('Error:', error));
```

---

### مثال Response مع بيانات Pagination

#### Response (Success - 200 OK):

```json
{
  "success": true,
  "message": "Donors retrieved successfully",
  "data": {
    "items": [
      {
        "id": 11,
        "userId": 15,
        "firstName": "Mohammed",
        "lastName": "Ahmed",
        "dateOfBirth": "1988-03-10T00:00:00Z",
        "gender": 0,
        "bloodType": "B+",
        "phoneNumber": "+966503456789",
        "email": "mohammed.ahmed@example.com",
        "address": "789 Al Malaz Street",
        "city": "Riyadh",
        "lastDonationDate": "2023-11-20T00:00:00Z",
        "isEligible": true,
        "createdAt": "2023-10-01T10:00:00Z",
        "updatedAt": "2023-11-20T10:00:00Z"
      },
      {
        "id": 12,
        "userId": 16,
        "firstName": "Sara",
        "lastName": "Khalid",
        "dateOfBirth": "1992-07-25T00:00:00Z",
        "gender": 1,
        "bloodType": "AB+",
        "phoneNumber": "+966504567890",
        "email": "sara.khalid@example.com",
        "address": "321 Al Olaya Road",
        "city": "Riyadh",
        "lastDonationDate": "2024-01-05T00:00:00Z",
        "isEligible": false,
        "createdAt": "2023-09-15T10:00:00Z",
        "updatedAt": "2024-01-05T10:00:00Z"
      },
      {
        "id": 13,
        "userId": 17,
        "firstName": "Abdullah",
        "lastName": "Omar",
        "dateOfBirth": "1985-12-30T00:00:00Z",
        "gender": 0,
        "bloodType": "O-",
        "phoneNumber": "+966505678901",
        "email": "abdullah.omar@example.com",
        "address": "654 King Abdullah Road",
        "city": "Jeddah",
        "lastDonationDate": "2023-10-10T00:00:00Z",
        "isEligible": true,
        "createdAt": "2023-08-01T10:00:00Z",
        "updatedAt": "2023-10-10T10:00:00Z"
      }
    ],
    "pageNumber": 2,
    "pageSize": 3,
    "totalPages": 17,
    "totalCount": 50
  },
  "errors": null
}
```

#### تفسير الاستجابة:

- **items**: يحتوي على 3 متبرعين (العناصر 11، 12، 13)
- **pageNumber**: `2` - نحن في الصفحة الثانية
- **pageSize**: `3` - كل صفحة تحتوي على 3 عناصر
- **totalPages**: `17` - هناك 17 صفحة إجمالاً (50 عنصر ÷ 3 عناصر لكل صفحة = 16.67 ≈ 17 صفحة)
- **totalCount**: `50` - هناك 50 متبرع إجمالاً في قاعدة البيانات

---

### مثال Response لصفحة فارغة

إذا طلبت صفحة غير موجودة (مثل pageNumber=100 وهناك 17 صفحة فقط):

```json
{
  "success": true,
  "message": "Donors retrieved successfully",
  "data": {
    "items": [],
    "pageNumber": 100,
    "pageSize": 10,
    "totalPages": 17,
    "totalCount": 50
  },
  "errors": null
}
```

**ملاحظة:** `items` قائمة فارغة `[]`، لكن `success` لا يزال `true` لأن الطلب نفسه نجح (لم يكن هناك خطأ في الطلب).

---

### حساب عدد الصفحات (Calculating Pages)

يمكنك حساب عدد الصفحات الإجمالي باستخدام المعادلة التالية:

```
totalPages = ceil(totalCount / pageSize)
```

**أمثلة:**

| totalCount | pageSize | totalPages | الحساب |
|------------|----------|------------|---------|
| 50 | 10 | 5 | ceil(50 / 10) = 5 |
| 47 | 10 | 5 | ceil(47 / 10) = 4.7 ≈ 5 |
| 100 | 20 | 5 | ceil(100 / 20) = 5 |
| 15 | 10 | 2 | ceil(15 / 10) = 1.5 ≈ 2 |
| 5 | 10 | 1 | ceil(5 / 10) = 0.5 ≈ 1 |

---

### التنقل بين الصفحات (Navigating Pages)

#### الانتقال إلى الصفحة التالية (Next Page):

```javascript
if (currentPageNumber < totalPages) {
  const nextPage = currentPageNumber + 1;
  // اطلب الصفحة التالية
  fetch(`/api/donors?pageNumber=${nextPage}&pageSize=${pageSize}`);
}
```

#### الانتقال إلى الصفحة السابقة (Previous Page):

```javascript
if (currentPageNumber > 1) {
  const previousPage = currentPageNumber - 1;
  // اطلب الصفحة السابقة
  fetch(`/api/donors?pageNumber=${previousPage}&pageSize=${pageSize}`);
}
```

#### الانتقال إلى الصفحة الأولى (First Page):

```javascript
fetch(`/api/donors?pageNumber=1&pageSize=${pageSize}`);
```

#### الانتقال إلى الصفحة الأخيرة (Last Page):

```javascript
fetch(`/api/donors?pageNumber=${totalPages}&pageSize=${pageSize}`);
```

---

### مثال كامل: بناء Pagination UI

#### مثال React Component:

```javascript
import React, { useState, useEffect } from 'react';

function DonorsList() {
  const [donors, setDonors] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDonors();
  }, [pageNumber]);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://api.bloodconnect.com/api/donors?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      const result = await response.json();
      
      if (result.success) {
        setDonors(result.data.items);
        setTotalPages(result.data.totalPages);
        setTotalCount(result.data.totalCount);
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPageNumber(page);
    }
  };

  return (
    <div>
      <h1>Donors List</h1>
      <p>Total Donors: {totalCount}</p>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {donors.map(donor => (
              <li key={donor.id}>
                {donor.firstName} {donor.lastName} - {donor.bloodType}
              </li>
            ))}
          </ul>

          <div className="pagination">
            <button 
              onClick={() => goToPage(1)} 
              disabled={pageNumber === 1}
            >
              First
            </button>
            
            <button 
              onClick={() => goToPage(pageNumber - 1)} 
              disabled={pageNumber === 1}
            >
              Previous
            </button>
            
            <span>
              Page {pageNumber} of {totalPages}
            </span>
            
            <button 
              onClick={() => goToPage(pageNumber + 1)} 
              disabled={pageNumber === totalPages}
            >
              Next
            </button>
            
            <button 
              onClick={() => goToPage(totalPages)} 
              disabled={pageNumber === totalPages}
            >
              Last
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default DonorsList;
```

---

### Endpoints التي تدعم Pagination

جميع endpoints التي تُرجع قوائم بيانات تدعم Pagination:

| Endpoint | Description |
|----------|-------------|
| `GET /api/users` | قائمة المستخدمين |
| `GET /api/donors` | قائمة المتبرعين |
| `GET /api/patients` | قائمة المرضى |
| `GET /api/donations` | قائمة التبرعات |
| `GET /api/bloodrequests` | قائمة طلبات الدم |
| `GET /api/inventory` | قائمة مخزون الدم |
| `GET /api/donors/eligible` | قائمة المتبرعين المؤهلين |
| `GET /api/donors/by-bloodtype/{bloodType}` | المتبرعين حسب فصيلة الدم |
| `GET /api/patients/by-bloodtype/{bloodType}` | المرضى حسب فصيلة الدم |
| `GET /api/donations/donor/{donorId}` | تبرعات متبرع محدد |
| `GET /api/bloodrequests/urgent` | الطلبات العاجلة |
| `GET /api/bloodrequests/by-status/{status}` | الطلبات حسب الحالة |
| `GET /api/inventory/by-bloodtype/{bloodType}` | المخزون حسب فصيلة الدم |
| `GET /api/inventory/available` | المخزون المتاح |
| `GET /api/inventory/expiring` | المخزون القريب من الانتهاء |

---

### نصائح لاستخدام Pagination بفعالية

#### 1. اختر pageSize مناسب

- **للعرض في جداول**: استخدم `pageSize=10` أو `pageSize=20`
- **للعرض في قوائم طويلة**: استخدم `pageSize=50`
- **لتحميل جميع البيانات**: استخدم `pageSize=100` (الحد الأقصى)

#### 2. احفظ حالة الصفحة الحالية

احفظ `pageNumber` الحالي في state أو URL parameters حتى يتمكن المستخدم من العودة إلى نفس الصفحة:

```javascript
// في React Router
<Link to={`/donors?page=${pageNumber}`}>Donors</Link>
```

#### 3. عرض معلومات الترقيم للمستخدم

اعرض معلومات مفيدة مثل:
- "عرض 11-20 من أصل 50 متبرع"
- "الصفحة 2 من 5"

```javascript
const startItem = (pageNumber - 1) * pageSize + 1;
const endItem = Math.min(pageNumber * pageSize, totalCount);
console.log(`Showing ${startItem}-${endItem} of ${totalCount} items`);
```

#### 4. معالجة الأخطاء

تحقق من صحة `pageNumber` و `pageSize` قبل إرسال الطلب:

```javascript
if (pageNumber < 1 || pageSize < 1 || pageSize > 100) {
  console.error('Invalid pagination parameters');
  return;
}
```

#### 5. تحسين الأداء

- استخدم **Caching** لتخزين الصفحات التي تم تحميلها مسبقاً
- استخدم **Lazy Loading** لتحميل الصفحات عند الحاجة فقط
- استخدم **Infinite Scroll** كبديل للـ Pagination التقليدية في تطبيقات الموبايل

#### 6. التعامل مع Pagination + Filtering

يمكنك دمج Pagination مع معاملات الفلترة الأخرى:

```bash
GET /api/donors/by-bloodtype/O+?pageNumber=1&pageSize=20
```

**ملاحظة:** عند تطبيق فلتر، يتم حساب `totalCount` و `totalPages` بناءً على النتائج المفلترة فقط.

---

### معالجة أخطاء Pagination

#### خطأ: pageSize أكبر من الحد الأقصى

إذا طلبت `pageSize` أكبر من 100:

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    "pageSize must be between 1 and 100"
  ]
}
```

#### خطأ: pageNumber أو pageSize غير صالح

إذا أرسلت قيم غير صحيحة (مثل أحرف بدلاً من أرقام):

```json
{
  "success": false,
  "message": "Invalid pagination parameters",
  "data": null,
  "errors": [
    "pageNumber must be a positive integer",
    "pageSize must be a positive integer"
  ]
}
```

---

### ملخص سريع (Quick Summary)

```bash
# الصفحة الأولى (القيم الافتراضية)
GET /api/donors

# الصفحة الثانية مع 20 عنصر
GET /api/donors?pageNumber=2&pageSize=20

# الصفحة الأخيرة (استخدم totalPages من الاستجابة السابقة)
GET /api/donors?pageNumber=5&pageSize=10
```

**بنية الاستجابة:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [...],
    "pageNumber": 2,
    "pageSize": 20,
    "totalPages": 5,
    "totalCount": 100
  },
  "errors": null
}
```

---

## نماذج البيانات (Data Models)

تستخدم BloodConnect API مجموعة من نماذج البيانات (Data Models) لتمثيل الكيانات المختلفة في النظام. كل نموذج يحتوي على مجموعة من الخصائص (Properties) التي تصف البيانات المخزنة والمنقولة عبر API.

### نظرة عامة على النماذج (Models Overview)

يحتوي النظام على **6 نماذج بيانات رئيسية** و**4 أنواع تعداد (Enums)**:

**النماذج الرئيسية:**
1. **User**: يمثل مستخدمي النظام (المسؤولين والموظفين)
2. **Donor**: يمثل المتبرعين بالدم
3. **Patient**: يمثل المرضى المحتاجين للدم
4. **Donation**: يمثل عمليات التبرع بالدم
5. **BloodRequest**: يمثل طلبات الدم من المستشفيات
6. **BloodInventory**: يمثل مخزون الدم المتوفر

**أنواع التعداد (Enums):**
1. **Gender**: جنس الشخص (ذكر، أنثى، آخر)
2. **RequestStatus**: حالة طلب الدم (قيد الانتظار، موافق عليه، مكتمل، مرفوض، ملغي)
3. **TestResult**: نتيجة فحص الدم (قيد الانتظار، ناجح، فاشل)
4. **UrgencyLevel**: مستوى الأولوية (منخفض، متوسط، عالي، حرج)

### العلاقات بين النماذج (Model Relationships)

- **User → Donor**: مستخدم واحد يمكن أن يكون متبرعاً واحداً (علاقة 1:1)
- **Donor → Donation**: متبرع واحد يمكن أن يكون له عدة تبرعات (علاقة 1:N)
- **Patient → BloodRequest**: مريض واحد يمكن أن يكون له عدة طلبات دم (علاقة 1:N)
- **Donation → BloodInventory**: تبرع واحد يمكن أن يضيف عنصر واحد للمخزون (علاقة 1:1)

### ملاحظات مهمة (Important Notes)

- جميع التواريخ بصيغة **ISO 8601** (مثال: `2024-01-15T10:30:00Z`)
- جميع الـ IDs من نوع **integer** (أعداد صحيحة موجبة)
- الحقول المنتهية بـ `?` في TypeScript تعني أنها **اختيارية (Optional)** ويمكن أن تكون `null`
- فصائل الدم المدعومة: **A+, A-, B+, B-, AB+, AB-, O+, O-**

---

### 1. User Model

**الوصف:** يمثل مستخدمي النظام الذين يمكنهم تسجيل الدخول والوصول إلى API. يتضمن معلومات المصادقة والصلاحيات.

#### خصائص User Model (Properties)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | integer | نعم | المعرف الفريد للمستخدم (Primary Key) |
| `username` | string | نعم | اسم المستخدم (فريد في النظام) |
| `email` | string | نعم | البريد الإلكتروني (فريد في النظام) |
| `passwordHash` | string | نعم | كلمة المرور المشفرة (لا يتم إرجاعها في الاستجابات) |
| `role` | string | نعم | دور المستخدم في النظام (مثل: Admin، User، Manager) |
| `createdAt` | DateTime | نعم | تاريخ ووقت إنشاء المستخدم |
| `updatedAt` | DateTime | نعم | تاريخ ووقت آخر تحديث للمستخدم |

#### مثال JSON كامل

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "passwordHash": "$2a$11$hashed_password_here",
  "role": "Admin",
  "createdAt": "2023-12-01T10:00:00Z",
  "updatedAt": "2024-01-15T14:30:00Z"
}
```

#### ملاحظات مهمة

- **passwordHash**: هذا الحقل لا يتم إرجاعه في استجابات API لأسباب أمنية. يُستخدم فقط داخلياً للتحقق من كلمة المرور
- **username**: يجب أن يكون فريداً في النظام. لا يمكن أن يكون هناك مستخدمان بنفس اسم المستخدم
- **email**: يجب أن يكون فريداً وبصيغة بريد إلكتروني صحيحة
- **role**: يحدد صلاحيات المستخدم في النظام. الأدوار الشائعة: `Admin` (مسؤول)، `User` (مستخدم عادي)، `Manager` (مدير)

#### الأدوار المتاحة (Available Roles)

| Role | Description | Permissions |
|------|-------------|-------------|
| `Admin` | مسؤول النظام | صلاحيات كاملة على جميع الموارد |
| `Manager` | مدير | صلاحيات إدارة المتبرعين والمرضى والمخزون |
| `User` | مستخدم عادي | صلاحيات القراءة فقط |

---

### 2. Donor Model

**الوصف:** يمثل المتبرعين بالدم في النظام. يحتوي على معلومات شخصية وطبية عن المتبرع، بما في ذلك فصيلة الدم وأهلية التبرع.

#### خصائص Donor Model (Properties)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | integer | نعم | المعرف الفريد للمتبرع (Primary Key) |
| `userId` | integer | نعم | معرف المستخدم المرتبط بالمتبرع (Foreign Key → User) |
| `firstName` | string | نعم | الاسم الأول للمتبرع |
| `lastName` | string | نعم | اسم العائلة للمتبرع |
| `dateOfBirth` | DateTime | نعم | تاريخ الميلاد |
| `gender` | integer (enum) | نعم | الجنس (0 = Male، 1 = Female، 2 = Other) |
| `bloodType` | string | نعم | فصيلة الدم (A+, A-, B+, B-, AB+, AB-, O+, O-) |
| `phoneNumber` | string | نعم | رقم الهاتف |
| `email` | string | نعم | البريد الإلكتروني |
| `address` | string | نعم | العنوان الكامل |
| `city` | string | نعم | المدينة |
| `lastDonationDate` | DateTime | لا (nullable) | تاريخ آخر تبرع (null إذا لم يتبرع من قبل) |
| `isEligible` | boolean | نعم | هل المتبرع مؤهل للتبرع حالياً؟ |
| `createdAt` | DateTime | نعم | تاريخ ووقت إضافة المتبرع للنظام |
| `updatedAt` | DateTime | نعم | تاريخ ووقت آخر تحديث لبيانات المتبرع |

#### مثال JSON كامل

```json
{
  "id": 1,
  "userId": 2,
  "firstName": "Ahmed",
  "lastName": "Ali",
  "dateOfBirth": "1990-05-15T00:00:00Z",
  "gender": 0,
  "bloodType": "O+",
  "phoneNumber": "+966501234567",
  "email": "ahmed.ali@example.com",
  "address": "123 King Fahd Road",
  "city": "Riyadh",
  "lastDonationDate": "2024-01-01T00:00:00Z",
  "isEligible": true,
  "createdAt": "2023-12-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

#### العلاقات (Relationships)

- **Donor → User**: كل متبرع مرتبط بمستخدم واحد في النظام (علاقة Many-to-One)
  - `userId` يشير إلى `User.id`
  - المستخدم يجب أن يكون موجوداً قبل إنشاء المتبرع
  
- **Donor → Donation**: متبرع واحد يمكن أن يكون له عدة تبرعات (علاقة One-to-Many)
  - يمكن الحصول على جميع تبرعات متبرع معين عبر endpoint `/api/donations/donor/{donorId}`

#### ملاحظات مهمة

- **gender**: يُخزن كرقم (enum). القيم: `0` = Male (ذكر)، `1` = Female (أنثى)، `2` = Other (آخر)
- **bloodType**: يجب أن يكون واحداً من الفصائل المدعومة: `A+, A-, B+, B-, AB+, AB-, O+, O-`
- **lastDonationDate**: يمكن أن يكون `null` إذا لم يتبرع الشخص من قبل
- **isEligible**: يُحدد تلقائياً بناءً على `lastDonationDate`. المتبرع يجب أن ينتظر 56 يوماً على الأقل بين التبرعات
- **phoneNumber**: يُفضل استخدام التنسيق الدولي (مثل: `+966501234567`)
- **email**: يجب أن يكون بصيغة بريد إلكتروني صحيحة

#### معايير الأهلية للتبرع (Eligibility Criteria)

المتبرع يعتبر مؤهلاً (`isEligible = true`) إذا:
- مر 56 يوماً على الأقل منذ آخر تبرع
- العمر بين 18 و 65 سنة
- الوزن أكثر من 50 كجم (يُفحص خارج النظام)
- لا يعاني من أمراض معدية (يُفحص خارج النظام)

---

### 3. Patient Model

**الوصف:** يمثل المرضى المحتاجين للدم في النظام. يحتوي على معلومات شخصية وطبية عن المريض، بما في ذلك التاريخ الطبي ومعلومات المستشفى.

#### خصائص Patient Model (Properties)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | integer | نعم | المعرف الفريد للمريض (Primary Key) |
| `firstName` | string | نعم | الاسم الأول للمريض |
| `lastName` | string | نعم | اسم العائلة للمريض |
| `dateOfBirth` | DateTime | نعم | تاريخ الميلاد |
| `gender` | integer (enum) | نعم | الجنس (0 = Male، 1 = Female، 2 = Other) |
| `bloodType` | string | نعم | فصيلة الدم المطلوبة (A+, A-, B+, B-, AB+, AB-, O+, O-) |
| `phoneNumber` | string | نعم | رقم الهاتف |
| `email` | string | نعم | البريد الإلكتروني |
| `address` | string | نعم | العنوان الكامل |
| `city` | string | نعم | المدينة |
| `medicalHistory` | string | لا (nullable) | التاريخ الطبي للمريض (أمراض سابقة، عمليات، إلخ) |
| `hospitalName` | string | نعم | اسم المستشفى الذي يتلقى فيه المريض العلاج |
| `doctorName` | string | نعم | اسم الطبيب المعالج |
| `createdAt` | DateTime | نعم | تاريخ ووقت إضافة المريض للنظام |
| `updatedAt` | DateTime | نعم | تاريخ ووقت آخر تحديث لبيانات المريض |

#### مثال JSON كامل

```json
{
  "id": 1,
  "firstName": "Sara",
  "lastName": "Mohammed",
  "dateOfBirth": "1985-08-20T00:00:00Z",
  "gender": 1,
  "bloodType": "A+",
  "phoneNumber": "+966502345678",
  "email": "sara.mohammed@example.com",
  "address": "456 Olaya Street",
  "city": "Riyadh",
  "medicalHistory": "Previous surgery in 2020, no chronic diseases",
  "hospitalName": "King Fahd Medical City",
  "doctorName": "Dr. Abdullah Al-Rashid",
  "createdAt": "2023-11-15T10:00:00Z",
  "updatedAt": "2024-01-10T14:20:00Z"
}
```

#### العلاقات (Relationships)

- **Patient → BloodRequest**: مريض واحد يمكن أن يكون له عدة طلبات دم (علاقة One-to-Many)
  - يمكن الحصول على جميع طلبات مريض معين عبر فلترة `/api/bloodrequests` بـ `patientId`

#### ملاحظات مهمة

- **gender**: يُخزن كرقم (enum). القيم: `0` = Male (ذكر)، `1` = Female (أنثى)، `2` = Other (آخر)
- **bloodType**: يجب أن يكون واحداً من الفصائل المدعومة: `A+, A-, B+, B-, AB+, AB-, O+, O-`
- **medicalHistory**: حقل نصي طويل يمكن أن يحتوي على معلومات طبية مفصلة. يمكن أن يكون `null` إذا لم تتوفر معلومات
- **hospitalName**: اسم المستشفى مهم لتنسيق عملية نقل الدم
- **doctorName**: اسم الطبيب المعالج للتواصل والتنسيق
- **phoneNumber**: يُفضل استخدام التنسيق الدولي (مثل: `+966502345678`)
- **email**: يجب أن يكون بصيغة بريد إلكتروني صحيحة

#### الفرق بين Patient و Donor

| Aspect | Patient | Donor |
|--------|---------|-------|
| **الغرض** | يحتاج للدم | يتبرع بالدم |
| **العلاقة مع User** | لا يوجد (مستقل) | مرتبط بـ User |
| **التاريخ الطبي** | يحتوي على `medicalHistory` | لا يحتوي |
| **معلومات المستشفى** | يحتوي على `hospitalName` و `doctorName` | لا يحتوي |
| **الأهلية** | لا يوجد حقل `isEligible` | يحتوي على `isEligible` |
| **آخر تبرع** | لا يوجد | يحتوي على `lastDonationDate` |

---

### 4. Donation Model

**الوصف:** يمثل عمليات التبرع بالدم في النظام. يحتوي على معلومات عن المتبرع، كمية الدم، نتيجة الفحوصات، ومكان التبرع.

#### خصائص Donation Model (Properties)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | integer | نعم | المعرف الفريد للتبرع (Primary Key) |
| `donorId` | integer | نعم | معرف المتبرع (Foreign Key → Donor) |
| `donationDate` | DateTime | نعم | تاريخ ووقت التبرع |
| `quantity` | integer | نعم | كمية الدم المتبرع بها (بالمليلتر - ml) |
| `bloodType` | string | نعم | فصيلة الدم (A+, A-, B+, B-, AB+, AB-, O+, O-) |
| `testResult` | integer (enum) | نعم | نتيجة فحص الدم (0 = Pending، 1 = Passed، 2 = Failed) |
| `notes` | string | لا (nullable) | ملاحظات إضافية عن التبرع |
| `collectionCenter` | string | نعم | اسم مركز جمع الدم |
| `createdAt` | DateTime | نعم | تاريخ ووقت تسجيل التبرع في النظام |
| `updatedAt` | DateTime | نعم | تاريخ ووقت آخر تحديث لبيانات التبرع |

#### مثال JSON كامل

```json
{
  "id": 15,
  "donorId": 1,
  "donationDate": "2024-01-15T10:30:00Z",
  "quantity": 450,
  "bloodType": "O+",
  "testResult": 1,
  "notes": "Donation completed successfully. Donor in good health.",
  "collectionCenter": "Riyadh Blood Bank - Main Branch",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T14:00:00Z"
}
```

#### العلاقات (Relationships)

- **Donation → Donor**: كل تبرع مرتبط بمتبرع واحد (علاقة Many-to-One)
  - `donorId` يشير إلى `Donor.id`
  - المتبرع يجب أن يكون موجوداً قبل تسجيل التبرع
  
- **Donation → BloodInventory**: تبرع واحد يمكن أن يضيف عنصر واحد للمخزون (علاقة One-to-One)
  - بعد نجاح فحص الدم (`testResult = Passed`)، يتم إضافة التبرع للمخزون تلقائياً

#### ملاحظات مهمة

- **quantity**: الكمية القياسية للتبرع هي 450 مليلتر (ml). يمكن أن تتراوح بين 350-500 ml
- **bloodType**: يجب أن يطابق فصيلة دم المتبرع (`Donor.bloodType`)
- **testResult**: 
  - `0` (Pending): الفحص قيد الانتظار (الحالة الافتراضية عند التسجيل)
  - `1` (Passed): الفحص ناجح، الدم صالح للاستخدام
  - `2` (Failed): الفحص فاشل، الدم غير صالح للاستخدام
- **notes**: حقل اختياري لتسجيل أي ملاحظات (حالة المتبرع، مشاكل أثناء التبرع، إلخ)
- **collectionCenter**: اسم المركز أو المستشفى الذي تم فيه التبرع
- **donationDate**: يُستخدم لتحديث `Donor.lastDonationDate` تلقائياً

#### دورة حياة التبرع (Donation Lifecycle)

1. **التسجيل**: يتم تسجيل التبرع بحالة `testResult = Pending`
2. **الفحص**: يتم فحص الدم في المختبر
3. **النتيجة**: 
   - إذا نجح الفحص (`testResult = Passed`): يُضاف للمخزون
   - إذا فشل الفحص (`testResult = Failed`): يُرفض ولا يُضاف للمخزون
4. **التحديث**: يتم تحديث `Donor.lastDonationDate` و `Donor.isEligible`

#### الكميات القياسية (Standard Quantities)

| نوع التبرع | الكمية (ml) | الوصف |
|-----------|-------------|--------|
| **تبرع كامل** | 450 ml | الكمية القياسية للتبرع الكامل |
| **تبرع مزدوج** | 900 ml | تبرع خلايا دم حمراء مزدوج (نادر) |
| **تبرع صفائح** | 200-400 ml | تبرع صفائح دموية فقط |

---

### 5. BloodRequest Model

**الوصف:** يمثل طلبات الدم من المستشفيات والمرضى. يحتوي على معلومات عن المريض، فصيلة الدم المطلوبة، الكمية، مستوى الأولوية، وحالة الطلب.

#### خصائص BloodRequest Model (Properties)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | integer | نعم | المعرف الفريد للطلب (Primary Key) |
| `patientId` | integer | نعم | معرف المريض (Foreign Key → Patient) |
| `bloodType` | string | نعم | فصيلة الدم المطلوبة (A+, A-, B+, B-, AB+, AB-, O+, O-) |
| `quantity` | integer | نعم | كمية الدم المطلوبة (بالمليلتر - ml) |
| `urgencyLevel` | integer (enum) | نعم | مستوى الأولوية (0 = Low، 1 = Medium، 2 = High، 3 = Critical) |
| `requestStatus` | integer (enum) | نعم | حالة الطلب (0 = Pending، 1 = Approved، 2 = Fulfilled، 3 = Rejected، 4 = Cancelled) |
| `requestDate` | DateTime | نعم | تاريخ ووقت إنشاء الطلب |
| `requiredDate` | DateTime | نعم | التاريخ المطلوب تلبية الطلب فيه |
| `hospitalName` | string | نعم | اسم المستشفى الطالبة |
| `doctorName` | string | نعم | اسم الطبيب المسؤول |
| `reason` | string | نعم | سبب الحاجة للدم (عملية جراحية، حادث، إلخ) |
| `notes` | string | لا (nullable) | ملاحظات إضافية عن الطلب |
| `createdAt` | DateTime | نعم | تاريخ ووقت تسجيل الطلب في النظام |
| `updatedAt` | DateTime | نعم | تاريخ ووقت آخر تحديث لبيانات الطلب |

#### مثال JSON كامل

```json
{
  "id": 25,
  "patientId": 1,
  "bloodType": "A+",
  "quantity": 900,
  "urgencyLevel": 3,
  "requestStatus": 1,
  "requestDate": "2024-01-15T08:00:00Z",
  "requiredDate": "2024-01-15T18:00:00Z",
  "hospitalName": "King Fahd Medical City",
  "doctorName": "Dr. Abdullah Al-Rashid",
  "reason": "Emergency surgery - severe blood loss from accident",
  "notes": "Patient is in critical condition. Immediate blood transfusion required.",
  "createdAt": "2024-01-15T08:00:00Z",
  "updatedAt": "2024-01-15T09:30:00Z"
}
```

#### العلاقات (Relationships)

- **BloodRequest → Patient**: كل طلب مرتبط بمريض واحد (علاقة Many-to-One)
  - `patientId` يشير إلى `Patient.id`
  - المريض يجب أن يكون موجوداً قبل إنشاء الطلب

#### ملاحظات مهمة

- **bloodType**: يجب أن يطابق أو يكون متوافقاً مع فصيلة دم المريض (`Patient.bloodType`)
- **quantity**: الكمية المطلوبة بالمليلتر. الكميات الشائعة: 450 ml (وحدة واحدة)، 900 ml (وحدتان)
- **urgencyLevel** (مستوى الأولوية):
  - `0` (Low): حالة غير عاجلة، يمكن الانتظار عدة أيام
  - `1` (Medium): حالة متوسطة، مطلوب خلال 24-48 ساعة
  - `2` (High): حالة عاجلة، مطلوب خلال 12 ساعة
  - `3` (Critical): حالة حرجة، مطلوب فوراً (خلال ساعات)
- **requestStatus** (حالة الطلب):
  - `0` (Pending): قيد الانتظار، لم تتم المراجعة بعد
  - `1` (Approved): تمت الموافقة، جاري البحث عن الدم
  - `2` (Fulfilled): تم تلبية الطلب بنجاح
  - `3` (Rejected): تم رفض الطلب
  - `4` (Cancelled): تم إلغاء الطلب من قبل المستشفى أو المريض
- **requiredDate**: التاريخ المستهدف لتلبية الطلب. يجب أن يكون في المستقبل
- **reason**: سبب الحاجة للدم (مثل: عملية جراحية، حادث، نزيف، علاج كيميائي، إلخ)
- **notes**: حقل اختياري لأي معلومات إضافية

#### دورة حياة الطلب (Request Lifecycle)

1. **الإنشاء**: يتم إنشاء الطلب بحالة `Pending`
2. **المراجعة**: يراجع الموظفون الطلب ويتحققون من توفر الدم
3. **الموافقة/الرفض**: 
   - إذا توفر الدم: `Approved`
   - إذا لم يتوفر: `Rejected`
4. **التلبية**: بعد توفير الدم للمستشفى: `Fulfilled`
5. **الإلغاء**: يمكن إلغاء الطلب في أي وقت: `Cancelled`

#### مستويات الأولوية والأوقات المتوقعة

| Urgency Level | الوصف | الوقت المتوقع للتلبية |
|---------------|--------|------------------------|
| **Low (0)** | حالة غير عاجلة | 3-7 أيام |
| **Medium (1)** | حالة متوسطة | 24-48 ساعة |
| **High (2)** | حالة عاجلة | 6-12 ساعة |
| **Critical (3)** | حالة حرجة | فوراً (1-3 ساعات) |

#### توافق فصائل الدم (Blood Type Compatibility)

عند تلبية الطلب، يجب مراعاة توافق فصائل الدم:

| فصيلة المريض | يمكنه استقبال من |
|--------------|------------------|
| **A+** | A+, A-, O+, O- |
| **A-** | A-, O- |
| **B+** | B+, B-, O+, O- |
| **B-** | B-, O- |
| **AB+** | جميع الفصائل (المستقبل العام) |
| **AB-** | AB-, A-, B-, O- |
| **O+** | O+, O- |
| **O-** | O- فقط |

---

### 6. BloodInventory Model

**الوصف:** يمثل مخزون الدم المتوفر في بنك الدم. يحتوي على معلومات عن فصيلة الدم، الكمية المتوفرة، تاريخ الجمع والانتهاء، ومكان التخزين.

#### خصائص BloodInventory Model (Properties)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | integer | نعم | المعرف الفريد لعنصر المخزون (Primary Key) |
| `bloodType` | string | نعم | فصيلة الدم (A+, A-, B+, B-, AB+, AB-, O+, O-) |
| `quantity` | integer | نعم | كمية الدم المتوفرة (بالمليلتر - ml) |
| `donationId` | integer | نعم | معرف التبرع المصدر (Foreign Key → Donation) |
| `collectionDate` | DateTime | نعم | تاريخ جمع الدم (من التبرع) |
| `expiryDate` | DateTime | نعم | تاريخ انتهاء صلاحية الدم |
| `storageLocation` | string | نعم | موقع التخزين (رقم الثلاجة، الرف، إلخ) |
| `status` | string | نعم | حالة المخزون (Available، Reserved، Expired، Used) |
| `createdAt` | DateTime | نعم | تاريخ ووقت إضافة العنصر للمخزون |
| `updatedAt` | DateTime | نعم | تاريخ ووقت آخر تحديث للعنصر |

#### مثال JSON كامل

```json
{
  "id": 50,
  "bloodType": "O+",
  "quantity": 450,
  "donationId": 15,
  "collectionDate": "2024-01-15T10:30:00Z",
  "expiryDate": "2024-02-19T10:30:00Z",
  "storageLocation": "Refrigerator-A, Shelf-3, Position-12",
  "status": "Available",
  "createdAt": "2024-01-15T14:00:00Z",
  "updatedAt": "2024-01-15T14:00:00Z"
}
```

#### العلاقات (Relationships)

- **BloodInventory → Donation**: كل عنصر مخزون مرتبط بتبرع واحد (علاقة One-to-One)
  - `donationId` يشير إلى `Donation.id`
  - يتم إنشاء عنصر المخزون تلقائياً عند نجاح فحص التبرع (`Donation.testResult = Passed`)

#### ملاحظات مهمة

- **bloodType**: يجب أن يطابق فصيلة دم التبرع (`Donation.bloodType`)
- **quantity**: عادةً تساوي كمية التبرع (450 ml). تقل تدريجياً عند الاستخدام
- **expiryDate**: يُحسب تلقائياً بإضافة 35 يوماً إلى `collectionDate` (مدة صلاحية الدم المبرد)
- **storageLocation**: معلومات دقيقة عن موقع التخزين لسهولة الوصول
- **status** (حالة المخزون):
  - `Available`: متوفر للاستخدام
  - `Reserved`: محجوز لطلب معين
  - `Expired`: انتهت صلاحيته
  - `Used`: تم استخدامه بالكامل
- **collectionDate**: يُنسخ من `Donation.donationDate`

#### حالات المخزون (Inventory Status)

| Status | الوصف | متى يُستخدم |
|--------|-------|-------------|
| **Available** | متوفر للاستخدام | الحالة الافتراضية عند الإضافة |
| **Reserved** | محجوز | عند تخصيصه لطلب دم معين |
| **Expired** | منتهي الصلاحية | عند تجاوز `expiryDate` |
| **Used** | مستخدم | عند استخدام الكمية بالكامل (`quantity = 0`) |

#### مدة الصلاحية (Shelf Life)

| نوع المنتج | مدة الصلاحية | درجة الحرارة |
|-----------|--------------|--------------|
| **دم كامل** | 35 يوم | 2-6°C |
| **خلايا دم حمراء** | 42 يوم | 2-6°C |
| **صفائح دموية** | 5-7 أيام | 20-24°C (مع رج مستمر) |
| **بلازما مجمدة** | 12 شهر | -18°C أو أقل |

**ملاحظة:** النظام الحالي يفترض دم كامل بمدة صلاحية 35 يوم.

#### إدارة المخزون (Inventory Management)

##### 1. إضافة للمخزون (Adding to Inventory)
- يتم تلقائياً عند نجاح فحص التبرع
- `status = Available`
- `expiryDate = collectionDate + 35 days`

##### 2. حجز من المخزون (Reserving)
- عند الموافقة على طلب دم
- `status = Reserved`
- يُربط بـ `BloodRequest.id`

##### 3. استخدام من المخزون (Using)
- عند تلبية طلب دم
- `quantity` تقل بالكمية المستخدمة
- إذا `quantity = 0`: `status = Used`

##### 4. انتهاء الصلاحية (Expiration)
- يتم فحص `expiryDate` يومياً
- إذا `expiryDate < currentDate`: `status = Expired`
- الدم المنتهي يُحذف أو يُحفظ للإحصائيات

#### مثال سيناريو كامل

```
1. تبرع جديد (Donation #15)
   ↓
2. فحص الدم → ناجح (testResult = Passed)
   ↓
3. إضافة للمخزون (BloodInventory #50)
   - bloodType: O+
   - quantity: 450 ml
   - status: Available
   - expiryDate: 2024-02-19
   ↓
4. طلب دم جديد (BloodRequest #25)
   - bloodType: O+
   - quantity: 450 ml
   ↓
5. حجز من المخزون
   - BloodInventory #50
   - status: Reserved
   ↓
6. تلبية الطلب
   - BloodInventory #50
   - quantity: 0 ml
   - status: Used
```

---

### 7. Enums (أنواع التعداد)

**الوصف:** أنواع التعداد (Enumerations) هي مجموعات محددة من القيم الثابتة المستخدمة في النظام. تُخزن كأرقام صحيحة (integers) في قاعدة البيانات لكفاءة الأداء.

---

#### 7.1 Gender Enum (الجنس)

يُستخدم لتحديد جنس الشخص (متبرع أو مريض).

| Value | Name | الاسم بالعربية | Description |
|-------|------|----------------|-------------|
| `0` | Male | ذكر | الجنس الذكري |
| `1` | Female | أنثى | الجنس الأنثوي |
| `2` | Other | آخر | جنس آخر أو يفضل عدم التحديد |

**مثال استخدام في JSON:**

```json
{
  "firstName": "Ahmed",
  "lastName": "Ali",
  "gender": 0,
  "bloodType": "O+"
}
```

**ملاحظات:**
- يُخزن كرقم صحيح (integer) في قاعدة البيانات
- يُستخدم في `Donor.gender` و `Patient.gender`
- القيمة الافتراضية عادةً `0` (Male)

---

#### 7.2 RequestStatus Enum (حالة طلب الدم)

يُستخدم لتتبع حالة طلب الدم من الإنشاء حتى التلبية أو الإلغاء.

| Value | Name | الاسم بالعربية | Description |
|-------|------|----------------|-------------|
| `0` | Pending | قيد الانتظار | الطلب تم إنشاؤه ولم تتم مراجعته بعد |
| `1` | Approved | موافق عليه | تمت الموافقة على الطلب وجاري البحث عن الدم |
| `2` | Fulfilled | مكتمل | تم تلبية الطلب بنجاح وتسليم الدم |
| `3` | Rejected | مرفوض | تم رفض الطلب (لعدم توفر الدم أو أسباب أخرى) |
| `4` | Cancelled | ملغي | تم إلغاء الطلب من قبل المستشفى أو المريض |

**مثال استخدام في JSON:**

```json
{
  "id": 25,
  "patientId": 1,
  "bloodType": "A+",
  "quantity": 900,
  "requestStatus": 1,
  "urgencyLevel": 3
}
```

**دورة الحياة النموذجية (Typical Lifecycle):**

```
Pending (0) → Approved (1) → Fulfilled (2)
     ↓              ↓
  Rejected (3)  Cancelled (4)
```

**ملاحظات:**
- يُستخدم في `BloodRequest.requestStatus`
- الحالة الافتراضية عند الإنشاء: `Pending (0)`
- يمكن الانتقال من `Pending` إلى `Approved` أو `Rejected`
- يمكن الانتقال من `Approved` إلى `Fulfilled` أو `Cancelled`
- `Fulfilled`، `Rejected`، و `Cancelled` هي حالات نهائية (لا يمكن تغييرها)

---

#### 7.3 TestResult Enum (نتيجة فحص الدم)

يُستخدم لتتبع نتيجة فحص الدم المتبرع به في المختبر.

| Value | Name | الاسم بالعربية | Description |
|-------|------|----------------|-------------|
| `0` | Pending | قيد الانتظار | الفحص لم يتم بعد أو النتيجة قيد الانتظار |
| `1` | Passed | ناجح | الفحص ناجح، الدم صالح للاستخدام |
| `2` | Failed | فاشل | الفحص فاشل، الدم غير صالح للاستخدام |

**مثال استخدام في JSON:**

```json
{
  "id": 15,
  "donorId": 1,
  "donationDate": "2024-01-15T10:30:00Z",
  "quantity": 450,
  "bloodType": "O+",
  "testResult": 1,
  "collectionCenter": "Riyadh Blood Bank"
}
```

**دورة الحياة (Lifecycle):**

```
Pending (0) → Passed (1)  → يُضاف للمخزون
           → Failed (2)  → يُرفض ولا يُضاف للمخزون
```

**ملاحظات:**
- يُستخدم في `Donation.testResult`
- الحالة الافتراضية عند تسجيل التبرع: `Pending (0)`
- فقط التبرعات بحالة `Passed (1)` تُضاف إلى `BloodInventory`
- التبرعات بحالة `Failed (2)` تُحفظ للإحصائيات ولا تُستخدم

**أسباب الفشل الشائعة:**
- وجود أمراض معدية (HIV، Hepatitis، إلخ)
- مستويات غير طبيعية من خلايا الدم
- وجود أدوية أو مواد غير مسموح بها
- مشاكل في جودة الدم

---

#### 7.4 UrgencyLevel Enum (مستوى الأولوية)

يُستخدم لتحديد مدى إلحاح طلب الدم وأولوية تلبيته.

| Value | Name | الاسم بالعربية | Description | الوقت المتوقع |
|-------|------|----------------|-------------|---------------|
| `0` | Low | منخفض | حالة غير عاجلة، يمكن الانتظار | 3-7 أيام |
| `1` | Medium | متوسط | حالة متوسطة الأولوية | 24-48 ساعة |
| `2` | High | عالي | حالة عاجلة تتطلب اهتماماً سريعاً | 6-12 ساعة |
| `3` | Critical | حرج | حالة حرجة تتطلب تدخلاً فورياً | 1-3 ساعات |

**مثال استخدام في JSON:**

```json
{
  "id": 25,
  "patientId": 1,
  "bloodType": "A+",
  "quantity": 900,
  "urgencyLevel": 3,
  "requestStatus": 1,
  "reason": "Emergency surgery - severe blood loss"
}
```

**أمثلة الحالات:**

| Urgency Level | أمثلة الحالات |
|---------------|---------------|
| **Low (0)** | عمليات جراحية مجدولة، علاج كيميائي روتيني |
| **Medium (1)** | عمليات جراحية خلال يومين، أنيميا متوسطة |
| **High (2)** | نزيف داخلي، عمليات جراحية عاجلة |
| **Critical (3)** | حوادث خطيرة، نزيف حاد، صدمة نقص الدم |

**ملاحظات:**
- يُستخدم في `BloodRequest.urgencyLevel`
- يؤثر على أولوية معالجة الطلب في النظام
- الطلبات بمستوى `Critical (3)` تُعالج أولاً
- يمكن للنظام إرسال تنبيهات تلقائية للطلبات الحرجة

**نظام الأولويات (Priority System):**

```
Critical (3) → أعلى أولوية، معالجة فورية
    ↓
High (2)     → أولوية عالية، معالجة سريعة
    ↓
Medium (1)   → أولوية متوسطة، معالجة عادية
    ↓
Low (0)      → أولوية منخفضة، معالجة عند التوفر
```

---

### ملخص الـ Enums (Enums Summary)

| Enum | القيم المتاحة | يُستخدم في | الحالة الافتراضية |
|------|---------------|------------|-------------------|
| **Gender** | 0=Male, 1=Female, 2=Other | Donor, Patient | 0 (Male) |
| **RequestStatus** | 0=Pending, 1=Approved, 2=Fulfilled, 3=Rejected, 4=Cancelled | BloodRequest | 0 (Pending) |
| **TestResult** | 0=Pending, 1=Passed, 2=Failed | Donation | 0 (Pending) |
| **UrgencyLevel** | 0=Low, 1=Medium, 2=High, 3=Critical | BloodRequest | 1 (Medium) |

**نصائح مهمة عند استخدام Enums:**

1. **استخدم الأرقام في API Requests**: عند إرسال البيانات، استخدم القيمة الرقمية (مثل `0` بدلاً من `"Male"`)
2. **التحقق من الصحة**: تأكد من أن القيمة المرسلة ضمن النطاق المسموح (مثلاً: Gender يجب أن يكون 0، 1، أو 2)
3. **العرض للمستخدم**: في واجهة المستخدم، قم بتحويل الأرقام إلى نصوص مقروءة (مثل `0` → "Male" أو "ذكر")
4. **الحالات الافتراضية**: عند إنشاء كيان جديد، استخدم الحالة الافتراضية المناسبة

**مثال كود JavaScript للتحويل:**

```javascript
// Gender Enum
const Gender = {
  0: 'Male',
  1: 'Female',
  2: 'Other'
};

// RequestStatus Enum
const RequestStatus = {
  0: 'Pending',
  1: 'Approved',
  2: 'Fulfilled',
  3: 'Rejected',
  4: 'Cancelled'
};

// TestResult Enum
const TestResult = {
  0: 'Pending',
  1: 'Passed',
  2: 'Failed'
};

// UrgencyLevel Enum
const UrgencyLevel = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
  3: 'Critical'
};

// استخدام
const donor = {
  firstName: 'Ahmed',
  gender: 0  // سيُعرض كـ "Male"
};

console.log(`Gender: ${Gender[donor.gender]}`); // Output: Gender: Male
```

---

---

## نقاط نهاية API (API Endpoints)

### Authentication Endpoints

تتيح نقاط نهاية المصادقة (Authentication Endpoints) للمستخدمين تسجيل حسابات جديدة وتسجيل الدخول للحصول على JWT Token. هذه الـ endpoints هي الوحيدة التي لا تتطلب مصادقة مسبقة.

---

#### POST /api/auth/register

**الوصف (Description):**

تسجيل مستخدم جديد في النظام. يتم إنشاء حساب جديد مع اسم المستخدم وكلمة المرور والدور المحدد.

**HTTP Method:** `POST`

**URL:** `/api/auth/register`

**Authentication Required:** لا (No)

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | نعم | اسم المستخدم (3 أحرف على الأقل) |
| `fullName` | string | نعم | الاسم الكامل للمستخدم |
| `password` | string | نعم | كلمة المرور (6 أحرف على الأقل) |
| `phone` | string | لا | رقم الهاتف (بصيغة صحيحة) |
| `roleId` | integer | نعم | معرف الدور (1 = Admin، 2 = User، إلخ) |

**Request Body Example:**

```json
{
  "username": "john_doe",
  "fullName": "John Doe",
  "password": "SecurePassword123!",
  "phone": "+966501234567",
  "roleId": 2
}
```

**Response Structure:**

```json
{
  "success": boolean,
  "message": string,
  "data": {
    "id": integer,
    "username": string,
    "fullName": string,
    "phone": string,
    "createdAt": datetime,
    "updatedAt": datetime
  },
  "errors": string[] | null
}
```

**Status Codes:**

| Code | Meaning | Description |
|------|---------|-------------|
| 201 | Created | تم إنشاء الحساب بنجاح |
| 400 | Bad Request | بيانات غير صحيحة أو اسم المستخدم موجود مسبقاً |
| 500 | Internal Server Error | خطأ في الخادم |

---

**مثال Request (JSON):**

```json
{
  "username": "ahmed_ali",
  "fullName": "Ahmed Ali",
  "password": "MySecurePass123!",
  "phone": "+966501234567",
  "roleId": 2
}
```

**مثال Request (cURL):**

```bash
curl -X POST https://api.bloodconnect.com/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "username": "ahmed_ali",
    "fullName": "Ahmed Ali",
    "password": "MySecurePass123!",
    "phone": "+966501234567",
    "roleId": 2
  }'
```

**مثال Success Response (201 Created):**

```json
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "data": {
    "id": 15,
    "username": "ahmed_ali",
    "fullName": "Ahmed Ali",
    "phone": "+966501234567",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "errors": null
}
```

**مثال Error Response (400 Bad Request - Validation Errors):**

```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "data": null,
  "errors": [
    "اسم المستخدم يجب أن يكون 3 أحرف على الأقل",
    "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    "رقم الهاتف غير صحيح"
  ]
}
```

**مثال Error Response (400 Bad Request - Username Already Exists):**

```json
{
  "success": false,
  "message": "فشل إنشاء الحساب",
  "data": null,
  "errors": [
    "اسم المستخدم موجود مسبقاً"
  ]
}
```

**مثال Error Response (500 Internal Server Error):**

```json
{
  "success": false,
  "message": "حدث خطأ في الخادم",
  "data": null,
  "errors": [
    "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً."
  ]
}
```

---

#### POST /api/auth/login

**الوصف (Description):**

تسجيل الدخول للحصول على JWT Token. يتم استخدام اسم المستخدم وكلمة المرور للمصادقة، وعند النجاح يتم إرجاع Token صالح لمدة 24 ساعة.

**HTTP Method:** `POST`

**URL:** `/api/auth/login`

**Authentication Required:** لا (No)

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | نعم | اسم المستخدم |
| `password` | string | نعم | كلمة المرور |

**Request Body Example:**

```json
{
  "username": "john_doe",
  "password": "SecurePassword123!"
}
```

**Response Structure (مع JWT Token):**

```json
{
  "success": boolean,
  "message": string,
  "data": {
    "token": string,
    "expiresAt": datetime,
    "user": {
      "id": integer,
      "username": string,
      "fullName": string,
      "phone": string,
      "roleId": integer
    }
  },
  "errors": string[] | null
}
```

**Status Codes:**

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | تم تسجيل الدخول بنجاح |
| 400 | Bad Request | بيانات غير صحيحة |
| 401 | Unauthorized | اسم المستخدم أو كلمة المرور غير صحيحة |
| 500 | Internal Server Error | خطأ في الخادم |

---

**مثال Request (JSON):**

```json
{
  "username": "ahmed_ali",
  "password": "MySecurePass123!"
}
```

**مثال Request (cURL):**

```bash
curl -X POST https://api.bloodconnect.com/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "username": "ahmed_ali",
    "password": "MySecurePass123!"
  }'
```

**مثال Success Response مع Token (200 OK):**

```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNSIsInVuaXF1ZV9uYW1lIjoiYWhtZWRfYWxpIiwiZnVsbE5hbWUiOiJBaG1lZCBBbGkiLCJyb2xlSWQiOiIyIiwibmJmIjoxNzA1MzIwMDAwLCJleHAiOjE3MDU0MDY0MDAsImlhdCI6MTcwNTMyMDAwMH0.abc123xyz789def456ghi012jkl345mno678pqr901stu234vwx567yz",
    "expiresAt": "2024-01-16T10:30:00Z",
    "user": {
      "id": 15,
      "username": "ahmed_ali",
      "fullName": "Ahmed Ali",
      "phone": "+966501234567",
      "roleId": 2
    }
  },
  "errors": null
}
```

**ملاحظة مهمة:** احفظ قيمة `token` من الاستجابة، ستحتاجها في جميع الطلبات المحمية! استخدمها في Authorization Header بصيغة: `Bearer {token}`

**مثال Error Response (400 Bad Request - Validation Errors):**

```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "data": null,
  "errors": [
    "اسم المستخدم مطلوب",
    "كلمة المرور مطلوبة"
  ]
}
```

**مثال Error Response (401 Unauthorized - Invalid Credentials):**

```json
{
  "success": false,
  "message": "فشل تسجيل الدخول",
  "data": null,
  "errors": [
    "اسم المستخدم أو كلمة المرور غير صحيحة"
  ]
}
```

**مثال Error Response (500 Internal Server Error):**

```json
{
  "success": false,
  "message": "حدث خطأ في الخادم",
  "data": null,
  "errors": [
    "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً."
  ]
}
```

---

#### POST /api/auth/change-password

**الوصف (Description):**

تغيير كلمة المرور للمستخدم الحالي. يتطلب كلمة المرور الحالية وكلمة المرور الجديدة.

**HTTP Method:** `POST`

**URL:** `/api/auth/change-password`

**Authentication Required:** نعم (Yes)

**Request Headers:**

```http
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | integer | نعم | معرف المستخدم |
| `currentPassword` | string | نعم | كلمة المرور الحالية |
| `newPassword` | string | نعم | كلمة المرور الجديدة (6 أحرف على الأقل) |

**Request Body Example:**

```json
{
  "userId": 15,
  "currentPassword": "MySecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Response Structure:**

```json
{
  "success": boolean,
  "message": string,
  "data": boolean,
  "errors": string[] | null
}
```

**Status Codes:**

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | تم تغيير كلمة المرور بنجاح |
| 400 | Bad Request | بيانات غير صحيحة أو كلمة المرور الحالية خاطئة |
| 401 | Unauthorized | Token مفقود أو غير صالح |
| 500 | Internal Server Error | خطأ في الخادم |

---

**مثال Request (JSON):**

```json
{
  "userId": 15,
  "currentPassword": "MySecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

**مثال Request (cURL):**

```bash
curl -X POST https://api.bloodconnect.com/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "userId": 15,
    "currentPassword": "MySecurePass123!",
    "newPassword": "NewSecurePass456!"
  }'
```

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم تغيير كلمة المرور بنجاح",
  "data": true,
  "errors": null
}
```

**مثال Error Response (400 Bad Request - Validation Errors):**

```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "data": false,
  "errors": [
    "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"
  ]
}
```

**مثال Error Response (400 Bad Request - Current Password Incorrect):**

```json
{
  "success": false,
  "message": "فشل تغيير كلمة المرور",
  "data": false,
  "errors": [
    "كلمة المرور الحالية غير صحيحة"
  ]
}
```

**مثال Error Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "غير مصرح",
  "data": false,
  "errors": [
    "Token مفقود أو غير صالح"
  ]
}
```

**مثال Error Response (500 Internal Server Error):**

```json
{
  "success": false,
  "message": "حدث خطأ في الخادم",
  "data": false,
  "errors": [
    "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً."
  ]
}
```

---

### ملاحظات مهمة حول Authentication Endpoints

#### 1. عدم الحاجة للمصادقة

Endpoints التسجيل (`/api/auth/register`) وتسجيل الدخول (`/api/auth/login`) **لا تتطلب** JWT Token في Authorization Header، لأنها تُستخدم للحصول على Token في المقام الأول.

#### 2. استخدام Token بعد Login

بعد تسجيل الدخول بنجاح، احفظ الـ `token` من الاستجابة واستخدمه في جميع الطلبات المحمية الأخرى:

```javascript
// حفظ Token بعد Login
const loginResponse = await fetch('/api/auth/login', { ... });
const result = await loginResponse.json();
if (result.success) {
  localStorage.setItem('token', result.data.token);
  localStorage.setItem('tokenExpiry', result.data.expiresAt);
}

// استخدام Token في طلبات أخرى
const token = localStorage.getItem('token');
fetch('/api/donors', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

#### 3. مدة صلاحية Token

JWT Token صالح لمدة **24 ساعة** من وقت الإصدار. بعد انتهاء الصلاحية، يجب تسجيل الدخول مرة أخرى للحصول على Token جديد.

#### 4. تغيير كلمة المرور

endpoint تغيير كلمة المرور (`/api/auth/change-password`) **يتطلب** مصادقة، لذا يجب تضمين JWT Token في Authorization Header.

#### 5. أمان كلمات المرور

- كلمة المرور يجب أن تكون **6 أحرف على الأقل**
- يُنصح باستخدام كلمات مرور قوية تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز خاصة
- كلمات المرور يتم تشفيرها (Hashing) قبل التخزين في قاعدة البيانات

#### 6. معالجة الأخطاء

عند فشل التسجيل أو تسجيل الدخول، تحقق من حقل `errors` في الاستجابة لمعرفة السبب:

```javascript
if (!result.success) {
  result.errors.forEach(error => {
    console.error('Error:', error);
    // عرض الخطأ للمستخدم
  });
}
```

---

### Users Endpoints

تتيح لك Users Endpoints إدارة المستخدمين في نظام BloodConnect. يمكنك من خلالها الحصول على قوائم المستخدمين، عرض تفاصيل مستخدم محدد، تحديث بيانات المستخدمين، وحذفهم.

**ملاحظة مهمة:** جميع Users Endpoints تتطلب مصادقة (Authentication Required: Yes). يجب تضمين JWT Token في Authorization Header.

---

#### GET /api/users

**الوصف (Description):**  
الحصول على قائمة جميع المستخدمين المسجلين في النظام مع دعم الترقيم (Pagination).

**HTTP Method:** `GET`

**URL:** `/api/users`

**Authentication Required:** Yes (يتطلب JWT Token)

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pageNumber` | integer | لا | 1 | رقم الصفحة المطلوبة (يبدأ من 1) |
| `pageSize` | integer | لا | 10 | عدد المستخدمين في كل صفحة (الحد الأقصى: 100) |

**Response Structure:**

استجابة ناجحة تحتوي على قائمة المستخدمين مع معلومات الترقيم (Paginated Response).

**Status Codes:**

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | تم استرجاع قائمة المستخدمين بنجاح |
| 401 | Unauthorized | Token مفقود أو غير صالح |
| 500 | Internal Server Error | خطأ في الخادم |

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/users?pageNumber=1&pageSize=10" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john.doe@example.com",
        "role": "Admin",
        "createdAt": "2023-12-01T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      },
      {
        "id": 2,
        "username": "ahmed_ali",
        "email": "ahmed.ali@example.com",
        "role": "User",
        "createdAt": "2023-12-05T14:30:00Z",
        "updatedAt": "2024-01-10T09:15:00Z"
      },
      {
        "id": 3,
        "username": "fatima_hassan",
        "email": "fatima.hassan@example.com",
        "role": "User",
        "createdAt": "2023-12-10T11:20:00Z",
        "updatedAt": "2024-01-12T16:45:00Z"
      }
    ],
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 1,
    "totalCount": 3
  },
  "errors": null
}
```

**مثال Error Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

---

#### GET /api/users/{id}

**الوصف (Description):**  
الحصول على تفاصيل مستخدم محدد باستخدام معرفه (ID).

**HTTP Method:** `GET`

**URL:** `/api/users/{id}`

**Authentication Required:** Yes (يتطلب JWT Token)

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | نعم | معرف المستخدم (User ID) |

**Response Structure:**

استجابة ناجحة تحتوي على تفاصيل المستخدم المطلوب.

**Status Codes:**

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | تم استرجاع بيانات المستخدم بنجاح |
| 401 | Unauthorized | Token مفقود أو غير صالح |
| 404 | Not Found | المستخدم غير موجود |
| 500 | Internal Server Error | خطأ في الخادم |

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/users/1" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john.doe@example.com",
    "role": "Admin",
    "createdAt": "2023-12-01T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  "errors": null
}
```

**مثال Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "User not found",
  "data": null,
  "errors": [
    "User with ID 999 does not exist"
  ]
}
```

**مثال Error Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

---

#### PUT /api/users/{id}

**الوصف (Description):**  
تحديث جميع بيانات مستخدم محدد. يتطلب هذا الـ endpoint إرسال جميع حقول المستخدم (Full Update).

**HTTP Method:** `PUT`

**URL:** `/api/users/{id}`

**Authentication Required:** Yes (يتطلب JWT Token)

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | نعم | معرف المستخدم (User ID) |

**Request Body:**

```json
{
  "username": "john_doe_updated",
  "email": "john.updated@example.com",
  "password": "NewSecurePassword123!",
  "role": "Admin"
}
```

**Request Body Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | نعم | اسم المستخدم (يجب أن يكون فريداً) |
| `email` | string | نعم | البريد الإلكتروني (يجب أن يكون فريداً وصالحاً) |
| `password` | string | لا | كلمة المرور الجديدة (8 أحرف على الأقل) |
| `role` | string | نعم | دور المستخدم (Admin، User، إلخ) |

**Response Structure:**

استجابة ناجحة تحتوي على بيانات المستخدم المحدثة.

**Status Codes:**

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | تم تحديث المستخدم بنجاح |
| 400 | Bad Request | بيانات الطلب غير صحيحة أو ناقصة |
| 401 | Unauthorized | Token مفقود أو غير صالح |
| 404 | Not Found | المستخدم غير موجود |
| 500 | Internal Server Error | خطأ في الخادم |

**مثال Request:**

```bash
curl -X PUT "https://api.bloodconnect.com/api/users/1" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "username": "john_doe_updated",
    "email": "john.updated@example.com",
    "password": "NewSecurePassword123!",
    "role": "Admin"
  }'
```

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "username": "john_doe_updated",
    "email": "john.updated@example.com",
    "role": "Admin",
    "createdAt": "2023-12-01T10:00:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  },
  "errors": null
}
```

**مثال Error Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    "Email is already in use by another user",
    "Username must be at least 3 characters"
  ]
}
```

**مثال Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "User not found",
  "data": null,
  "errors": [
    "User with ID 999 does not exist"
  ]
}
```

---

#### DELETE /api/users/{id}

**الوصف (Description):**  
حذف مستخدم محدد من النظام بشكل نهائي.

**HTTP Method:** `DELETE`

**URL:** `/api/users/{id}`

**Authentication Required:** Yes (يتطلب JWT Token)

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | نعم | معرف المستخدم (User ID) |

**Response Structure:**

استجابة ناجحة تؤكد حذف المستخدم.

**Status Codes:**

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | تم حذف المستخدم بنجاح |
| 401 | Unauthorized | Token مفقود أو غير صالح |
| 404 | Not Found | المستخدم غير موجود |
| 500 | Internal Server Error | خطأ في الخادم |

**مثال Request:**

```bash
curl -X DELETE "https://api.bloodconnect.com/api/users/5" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": 5,
    "username": "deleted_user",
    "email": "deleted@example.com",
    "role": "User"
  },
  "errors": null
}
```

**مثال Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "User not found",
  "data": null,
  "errors": [
    "User with ID 999 does not exist"
  ]
}
```

**مثال Error Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

---

#### PATCH /api/users/{id}

**الوصف (Description):**  
تحديث جزئي لبيانات مستخدم محدد. على عكس PUT، يسمح PATCH بتحديث حقول محددة فقط دون الحاجة لإرسال جميع البيانات.

**الفرق بين PUT و PATCH:**

| Aspect | PUT | PATCH |
|--------|-----|-------|
| **النوع** | تحديث كامل (Full Update) | تحديث جزئي (Partial Update) |
| **الحقول المطلوبة** | يجب إرسال جميع الحقول | يمكن إرسال الحقول المراد تحديثها فقط |
| **الحقول غير المرسلة** | قد يتم حذفها أو تعيينها لقيم افتراضية | تبقى كما هي دون تغيير |
| **الاستخدام** | عند تحديث كامل للمورد | عند تحديث حقل أو حقلين فقط |

**مثال توضيحي:**

```javascript
// PUT: يجب إرسال جميع الحقول
PUT /api/users/1
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Pass123!",
  "role": "Admin"
}

// PATCH: إرسال الحقول المراد تحديثها فقط
PATCH /api/users/1
{
  "email": "newemail@example.com"  // تحديث البريد الإلكتروني فقط
}
```

**HTTP Method:** `PATCH`

**URL:** `/api/users/{id}`

**Authentication Required:** Yes (يتطلب JWT Token)

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | نعم | معرف المستخدم (User ID) |

**Request Body (Partial):**

يمكنك إرسال أي من الحقول التالية (واحد أو أكثر):

```json
{
  "username": "new_username",
  "email": "newemail@example.com",
  "password": "NewPassword123!",
  "role": "User"
}
```

**Request Body Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | لا | اسم المستخدم الجديد (يجب أن يكون فريداً) |
| `email` | string | لا | البريد الإلكتروني الجديد (يجب أن يكون فريداً وصالحاً) |
| `password` | string | لا | كلمة المرور الجديدة (8 أحرف على الأقل) |
| `role` | string | لا | دور المستخدم الجديد |

**ملاحظة:** يمكنك إرسال حقل واحد فقط أو أي مجموعة من الحقول. الحقول غير المرسلة ستبقى كما هي.

**Response Structure:**

استجابة ناجحة تحتوي على بيانات المستخدم المحدثة (جميع الحقول، وليس فقط المحدثة).

**Status Codes:**

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | تم تحديث المستخدم بنجاح |
| 400 | Bad Request | بيانات الطلب غير صحيحة |
| 401 | Unauthorized | Token مفقود أو غير صالح |
| 404 | Not Found | المستخدم غير موجود |
| 500 | Internal Server Error | خطأ في الخادم |

**مثال Request 1: تحديث البريد الإلكتروني فقط**

```bash
curl -X PATCH "https://api.bloodconnect.com/api/users/1" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "email": "john.newemail@example.com"
  }'
```

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john.newemail@example.com",
    "role": "Admin",
    "createdAt": "2023-12-01T10:00:00Z",
    "updatedAt": "2024-01-15T15:45:00Z"
  },
  "errors": null
}
```

**مثال Request 2: تحديث اسم المستخدم والدور**

```bash
curl -X PATCH "https://api.bloodconnect.com/api/users/2" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "username": "ahmed_ali_updated",
    "role": "Admin"
  }'
```

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 2,
    "username": "ahmed_ali_updated",
    "email": "ahmed.ali@example.com",
    "role": "Admin",
    "createdAt": "2023-12-05T14:30:00Z",
    "updatedAt": "2024-01-15T16:00:00Z"
  },
  "errors": null
}
```

**مثال Request 3: تحديث كلمة المرور فقط**

```bash
curl -X PATCH "https://api.bloodconnect.com/api/users/3" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "password": "NewSecurePassword456!"
  }'
```

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 3,
    "username": "fatima_hassan",
    "email": "fatima.hassan@example.com",
    "role": "User",
    "createdAt": "2023-12-10T11:20:00Z",
    "updatedAt": "2024-01-15T16:15:00Z"
  },
  "errors": null
}
```

**مثال Error Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    "Email is already in use by another user"
  ]
}
```

**مثال Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "User not found",
  "data": null,
  "errors": [
    "User with ID 999 does not exist"
  ]
}
```

---

**ملخص Users Endpoints:**

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/api/users` | GET | الحصول على قائمة المستخدمين (مع pagination) | Required |
| `/api/users/{id}` | GET | الحصول على مستخدم محدد | Required |
| `/api/users/{id}` | PUT | تحديث كامل لمستخدم | Required |
| `/api/users/{id}` | DELETE | حذف مستخدم | Required |
| `/api/users/{id}` | PATCH | تحديث جزئي لمستخدم | Required |

---

### Donors Endpoints

#### GET /api/donors

**الوصف (Description):**

الحصول على قائمة جميع المتبرعين المسجلين في النظام مع دعم الترقيم (Pagination) والبحث والترتيب. يتيح هذا الـ endpoint للمطورين استرجاع بيانات المتبرعين بشكل منظم ومقسم على صفحات لتحسين الأداء وتجربة المستخدم.

**HTTP Method:** `GET`

**URL:** `/api/donors`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Query Parameters (معاملات الاستعلام):**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pageNumber` | integer | No | 1 | رقم الصفحة المطلوبة (يبدأ من 1) |
| `pageSize` | integer | No | 10 | عدد العناصر في كل صفحة (الحد الأقصى: 100) |
| `searchTerm` | string | No | null | مصطلح البحث للبحث في الاسم أو الرقم الوطني أو رقم الهاتف |
| `sortBy` | string | No | null | اسم الحقل للترتيب حسبه (مثل: "FullName", "DateOfBirth", "LastDonationDate") |
| `sortDescending` | boolean | No | false | ترتيب تنازلي (true) أو تصاعدي (false) |

---

**Response Structure (بنية الاستجابة):**

الاستجابة تتبع بنية `ServiceResponse<PagedResult<Donor>>` الموحدة:

```json
{
  "success": true,
  "message": "string",
  "data": {
    "items": [
      {
        "donorID": 0,
        "fullName": "string",
        "nationalID": "string",
        "gender": 0,
        "dateOfBirth": "2024-01-01T00:00:00Z",
        "phone": "string",
        "bloodTypeID": 0,
        "city": "string",
        "lastDonationDate": "2024-01-01T00:00:00Z",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "bloodType": {
          "bloodTypeID": 0,
          "bloodTypeName": "string"
        }
      }
    ],
    "totalCount": 0,
    "pageNumber": 0,
    "pageSize": 0,
    "totalPages": 0,
    "hasPrevious": false,
    "hasNext": false
  },
  "errors": null
}
```

---

**Status Codes (أكواد الحالة):**

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | تم استرجاع قائمة المتبرعين بنجاح |
| 401 | Unauthorized | JWT Token مفقود أو غير صالح |
| 500 | Internal Server Error | خطأ في الخادم أثناء معالجة الطلب |

---

**مثال Request (طلب بسيط):**

**cURL:**

```bash
curl -X GET "https://api.bloodconnect.com/api/donors?pageNumber=1&pageSize=10" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**JavaScript (Fetch):**

```javascript
const token = 'YOUR_JWT_TOKEN';

fetch('https://api.bloodconnect.com/api/donors?pageNumber=1&pageSize=10', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Python (Requests):**

```python
import requests

token = 'YOUR_JWT_TOKEN'
url = 'https://api.bloodconnect.com/api/donors'
params = {
    'pageNumber': 1,
    'pageSize': 10
}
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Bearer {token}'
}

response = requests.get(url, params=params, headers=headers)
data = response.json()
print(data)
```

---

**مثال Request (مع البحث والترتيب):**

**cURL:**

```bash
curl -X GET "https://api.bloodconnect.com/api/donors?pageNumber=1&pageSize=20&searchTerm=ahmed&sortBy=FullName&sortDescending=false" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**JavaScript (Fetch):**

```javascript
const token = 'YOUR_JWT_TOKEN';
const params = new URLSearchParams({
  pageNumber: 1,
  pageSize: 20,
  searchTerm: 'ahmed',
  sortBy: 'FullName',
  sortDescending: false
});

fetch(`https://api.bloodconnect.com/api/donors?${params}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم استرجاع قائمة المتبرعين بنجاح",
  "data": {
    "items": [
      {
        "donorID": 1,
        "fullName": "أحمد محمد علي",
        "nationalID": "1234567890",
        "gender": 0,
        "dateOfBirth": "1990-05-15T00:00:00Z",
        "phone": "+966501234567",
        "bloodTypeID": 1,
        "city": "الرياض",
        "lastDonationDate": "2024-01-15T10:30:00Z",
        "isActive": true,
        "createdAt": "2023-12-01T10:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "bloodType": {
          "bloodTypeID": 1,
          "bloodTypeName": "O+"
        }
      },
      {
        "donorID": 2,
        "fullName": "فاطمة حسن إبراهيم",
        "nationalID": "0987654321",
        "gender": 1,
        "dateOfBirth": "1995-08-20T00:00:00Z",
        "phone": "+966502345678",
        "bloodTypeID": 2,
        "city": "جدة",
        "lastDonationDate": "2023-12-20T14:00:00Z",
        "isActive": true,
        "createdAt": "2023-11-15T10:00:00Z",
        "updatedAt": "2023-12-20T14:00:00Z",
        "bloodType": {
          "bloodTypeID": 2,
          "bloodTypeName": "A+"
        }
      },
      {
        "donorID": 3,
        "fullName": "خالد عبدالله السعيد",
        "nationalID": "1122334455",
        "gender": 0,
        "dateOfBirth": "1988-03-10T00:00:00Z",
        "phone": "+966503456789",
        "bloodTypeID": 3,
        "city": "الدمام",
        "lastDonationDate": "2024-02-01T09:15:00Z",
        "isActive": true,
        "createdAt": "2023-10-20T10:00:00Z",
        "updatedAt": "2024-02-01T09:15:00Z",
        "bloodType": {
          "bloodTypeID": 3,
          "bloodTypeName": "B+"
        }
      }
    ],
    "totalCount": 25,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 3,
    "hasPrevious": false,
    "hasNext": true
  },
  "errors": null
}
```

**شرح حقول الاستجابة:**

- **items**: مصفوفة تحتوي على المتبرعين في الصفحة الحالية
- **totalCount**: إجمالي عدد المتبرعين في النظام (25 متبرع)
- **pageNumber**: رقم الصفحة الحالية (1)
- **pageSize**: عدد العناصر في كل صفحة (10)
- **totalPages**: إجمالي عدد الصفحات (3 صفحات)
- **hasPrevious**: هل توجد صفحة سابقة؟ (false لأننا في الصفحة الأولى)
- **hasNext**: هل توجد صفحة تالية؟ (true لأن هناك صفحتين إضافيتين)

**شرح حقول Donor:**

- **donorID**: المعرف الفريد للمتبرع
- **fullName**: الاسم الكامل للمتبرع
- **nationalID**: الرقم الوطني (رقم الهوية)
- **gender**: الجنس (0 = ذكر، 1 = أنثى، 2 = آخر)
- **dateOfBirth**: تاريخ الميلاد بصيغة ISO 8601
- **phone**: رقم الهاتف
- **bloodTypeID**: معرف فصيلة الدم
- **city**: المدينة
- **lastDonationDate**: تاريخ آخر تبرع (null إذا لم يتبرع بعد)
- **isActive**: هل المتبرع نشط في النظام؟
- **createdAt**: تاريخ إنشاء السجل
- **updatedAt**: تاريخ آخر تحديث للسجل
- **bloodType**: كائن يحتوي على معلومات فصيلة الدم (ID والاسم)

---

**مثال Error Response (401 Unauthorized):**

عندما يكون JWT Token مفقوداً أو غير صالح:

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

---

**مثال Error Response (500 Internal Server Error):**

عند حدوث خطأ في الخادم:

```json
{
  "success": false,
  "message": "An error occurred while retrieving donors",
  "data": null,
  "errors": [
    "Database connection failed"
  ]
}
```

---

**ملاحظات مهمة (Important Notes):**

1. **Pagination الافتراضية:**
   - إذا لم تحدد `pageNumber` أو `pageSize`، سيتم استخدام القيم الافتراضية (pageNumber=1, pageSize=10)
   - الحد الأقصى لـ `pageSize` هو 100 عنصر لتجنب تحميل بيانات كبيرة جداً

2. **البحث (Search):**
   - معامل `searchTerm` يبحث في الحقول التالية: الاسم الكامل، الرقم الوطني، رقم الهاتف
   - البحث غير حساس لحالة الأحرف (Case-insensitive)

3. **الترتيب (Sorting):**
   - يمكنك الترتيب حسب أي حقل في نموذج Donor
   - الحقول الشائعة للترتيب: "FullName", "DateOfBirth", "LastDonationDate", "CreatedAt"
   - استخدم `sortDescending=true` للترتيب التنازلي (من الأحدث للأقدم)

4. **العلاقات (Relationships):**
   - الاستجابة تتضمن معلومات فصيلة الدم (BloodType) المرتبطة بكل متبرع
   - لا تتضمن الاستجابة قائمة التبرعات (Donations) - استخدم endpoint `/api/donors/{id}/donations` للحصول عليها

5. **الأداء (Performance):**
   - استخدم Pagination دائماً عند التعامل مع قوائم كبيرة
   - قلل `pageSize` إذا كانت الاستجابة بطيئة
   - استخدم `searchTerm` لتقليل عدد النتائج

6. **Gender Enum:**
   - 0 = Male (ذكر)
   - 1 = Female (أنثى)
   - 2 = Other (آخر)

---

**أمثلة استخدام متقدمة:**

**مثال 1: الحصول على الصفحة الثانية مع 20 عنصر:**

```bash
curl -X GET "https://api.bloodconnect.com/api/donors?pageNumber=2&pageSize=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**مثال 2: البحث عن متبرعين باسم "أحمد":**

```bash
curl -X GET "https://api.bloodconnect.com/api/donors?searchTerm=أحمد&pageSize=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**مثال 3: ترتيب المتبرعين حسب آخر تبرع (الأحدث أولاً):**

```bash
curl -X GET "https://api.bloodconnect.com/api/donors?sortBy=LastDonationDate&sortDescending=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**مثال 4: البحث والترتيب معاً:**

```bash
curl -X GET "https://api.bloodconnect.com/api/donors?searchTerm=الرياض&sortBy=FullName&pageSize=25" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

---

#### GET /api/donors/{id}

**الوصف (Description):**

الحصول على تفاصيل متبرع محدد باستخدام معرفه الفريد (Donor ID). يتيح هذا الـ endpoint للمطورين استرجاع جميع معلومات متبرع واحد بما في ذلك البيانات الشخصية، معلومات الاتصال، فصيلة الدم، وتاريخ آخر تبرع.

**HTTP Method:** `GET`

**URL:** `/api/donors/{id}`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Path Parameters (معاملات المسار):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | المعرف الفريد للمتبرع (Donor ID) |

---

**Response Structure (بنية الاستجابة):**

الاستجابة تتبع بنية `ServiceResponse<Donor>` الموحدة:

```json
{
  "success": true,
  "message": "string",
  "data": {
    "donorID": 0,
    "fullName": "string",
    "nationalID": "string",
    "gender": 0,
    "dateOfBirth": "2024-01-01T00:00:00Z",
    "phone": "string",
    "bloodTypeID": 0,
    "city": "string",
    "lastDonationDate": "2024-01-01T00:00:00Z",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "bloodType": {
      "bloodTypeID": 0,
      "bloodTypeName": "string"
    }
  },
  "errors": null
}
```

---

**Status Codes (أكواد الحالة):**

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | تم استرجاع بيانات المتبرع بنجاح |
| 401 | Unauthorized | JWT Token مفقود أو غير صالح |
| 404 | Not Found | المتبرع المطلوب غير موجود |
| 500 | Internal Server Error | خطأ في الخادم أثناء معالجة الطلب |

---

**مثال Request:**

**cURL:**

```bash
curl -X GET "https://api.bloodconnect.com/api/donors/1" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**JavaScript (Fetch):**

```javascript
const token = 'YOUR_JWT_TOKEN';
const donorId = 1;

fetch(`https://api.bloodconnect.com/api/donors/${donorId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Python (Requests):**

```python
import requests

token = 'YOUR_JWT_TOKEN'
donor_id = 1
url = f'https://api.bloodconnect.com/api/donors/{donor_id}'
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Bearer {token}'
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)
```

**C# (.NET):**

```csharp
using System.Net.Http;
using System.Net.Http.Headers;

var token = "YOUR_JWT_TOKEN";
var donorId = 1;
var client = new HttpClient();

client.DefaultRequestHeaders.Authorization = 
    new AuthenticationHeaderValue("Bearer", token);
client.DefaultRequestHeaders.Accept.Add(
    new MediaTypeWithQualityHeaderValue("application/json"));

var response = await client.GetAsync(
    $"https://api.bloodconnect.com/api/donors/{donorId}");
var content = await response.Content.ReadAsStringAsync();
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم استرجاع بيانات المتبرع بنجاح",
  "data": {
    "donorID": 1,
    "fullName": "أحمد محمد علي",
    "nationalID": "1234567890",
    "gender": 0,
    "dateOfBirth": "1990-05-15T00:00:00Z",
    "phone": "+966501234567",
    "bloodTypeID": 1,
    "city": "الرياض",
    "lastDonationDate": "2024-01-15T10:30:00Z",
    "isActive": true,
    "createdAt": "2023-12-01T10:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "bloodType": {
      "bloodTypeID": 1,
      "bloodTypeName": "O+"
    }
  },
  "errors": null
}
```

**شرح حقول Donor:**

- **donorID**: المعرف الفريد للمتبرع (1)
- **fullName**: الاسم الكامل للمتبرع ("أحمد محمد علي")
- **nationalID**: الرقم الوطني (رقم الهوية) ("1234567890")
- **gender**: الجنس (0 = ذكر، 1 = أنثى، 2 = آخر)
- **dateOfBirth**: تاريخ الميلاد بصيغة ISO 8601 ("1990-05-15")
- **phone**: رقم الهاتف ("+966501234567")
- **bloodTypeID**: معرف فصيلة الدم (1)
- **city**: المدينة ("الرياض")
- **lastDonationDate**: تاريخ آخر تبرع ("2024-01-15T10:30:00Z") - يكون null إذا لم يتبرع بعد
- **isActive**: هل المتبرع نشط في النظام؟ (true)
- **createdAt**: تاريخ إنشاء السجل ("2023-12-01T10:00:00Z")
- **updatedAt**: تاريخ آخر تحديث للسجل ("2024-01-15T10:30:00Z")
- **bloodType**: كائن يحتوي على معلومات فصيلة الدم:
  - **bloodTypeID**: معرف فصيلة الدم (1)
  - **bloodTypeName**: اسم فصيلة الدم ("O+")

---

**مثال Error Response (401 Unauthorized):**

عندما يكون JWT Token مفقوداً أو غير صالح:

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

---

**مثال Error Response (404 Not Found):**

عندما لا يوجد متبرع بالمعرف المطلوب:

```json
{
  "success": false,
  "message": "Donor not found",
  "data": null,
  "errors": [
    "No donor exists with ID: 999"
  ]
}
```

---

**مثال Error Response (500 Internal Server Error):**

عند حدوث خطأ في الخادم:

```json
{
  "success": false,
  "message": "An error occurred while retrieving donor details",
  "data": null,
  "errors": [
    "Database connection failed"
  ]
}
```

---

**ملاحظات مهمة (Important Notes):**

1. **معرف المتبرع (Donor ID):**
   - يجب أن يكون `id` رقماً صحيحاً موجباً (Positive Integer)
   - إذا أرسلت قيمة غير صحيحة (مثل نص أو رقم سالب)، ستحصل على خطأ 400 Bad Request

2. **العلاقات (Relationships):**
   - الاستجابة تتضمن معلومات فصيلة الدم (BloodType) المرتبطة بالمتبرع
   - لا تتضمن الاستجابة قائمة التبرعات (Donations) - استخدم endpoint `/api/donors/{id}/donations` للحصول عليها

3. **حالة المتبرع (Donor Status):**
   - حقل `isActive` يشير إلى ما إذا كان المتبرع نشطاً في النظام
   - المتبرعون غير النشطين (isActive = false) قد يكونون محذوفين أو معطلين مؤقتاً

4. **آخر تبرع (Last Donation):**
   - حقل `lastDonationDate` يكون `null` إذا لم يقم المتبرع بأي تبرع بعد
   - يتم تحديث هذا الحقل تلقائياً عند تسجيل تبرع جديد

5. **Gender Enum:**
   - 0 = Male (ذكر)
   - 1 = Female (أنثى)
   - 2 = Other (آخر)

6. **فصائل الدم المدعومة:**
   - O+, O-, A+, A-, B+, B-, AB+, AB-

---

**حالات الاستخدام (Use Cases):**

**1. عرض ملف المتبرع الشخصي:**
```javascript
// عرض تفاصيل متبرع في صفحة الملف الشخصي
async function displayDonorProfile(donorId) {
  const response = await fetch(`/api/donors/${donorId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const result = await response.json();
  
  if (result.success) {
    const donor = result.data;
    console.log(`الاسم: ${donor.fullName}`);
    console.log(`فصيلة الدم: ${donor.bloodType.bloodTypeName}`);
    console.log(`آخر تبرع: ${donor.lastDonationDate || 'لم يتبرع بعد'}`);
  }
}
```

**2. التحقق من وجود متبرع قبل التحديث:**
```python
def check_donor_exists(donor_id):
    response = requests.get(
        f'https://api.bloodconnect.com/api/donors/{donor_id}',
        headers={'Authorization': f'Bearer {token}'}
    )
    return response.status_code == 200
```

**3. الحصول على فصيلة دم متبرع محدد:**
```javascript
async function getDonorBloodType(donorId) {
  const response = await fetch(`/api/donors/${donorId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const result = await response.json();
  
  if (result.success) {
    return result.data.bloodType.bloodTypeName;
  }
  return null;
}
```

---

#### POST /api/donors

**الوصف (Description):**

إنشاء متبرع جديد في النظام. يتيح هذا الـ endpoint للمطورين تسجيل متبرعين جدد مع جميع بياناتهم الشخصية ومعلومات الاتصال وفصيلة الدم. يتم التحقق من صحة جميع البيانات المدخلة قبل الحفظ في قاعدة البيانات.

**HTTP Method:** `POST`

**URL:** `/api/donors`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Request Body (بنية الطلب):**

يجب إرسال البيانات بصيغة JSON في Request Body:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `fullName` | string | Yes | Max 100 characters | الاسم الكامل للمتبرع |
| `nationalID` | string | Yes | Max 20 characters, Unique | الرقم الوطني (رقم الهوية) - يجب أن يكون فريداً |
| `gender` | integer | Yes | 0, 1, or 2 | الجنس (0 = ذكر، 1 = أنثى، 2 = آخر) |
| `dateOfBirth` | string (ISO 8601) | Yes | Valid date | تاريخ الميلاد بصيغة ISO 8601 |
| `phone` | string | Yes | Max 15 characters | رقم الهاتف |
| `city` | string | Yes | Max 50 characters | المدينة |
| `bloodTypeID` | integer | Yes | Valid Blood Type ID (1-8) | معرف فصيلة الدم |

**مثال Request Body:**

```json
{
  "fullName": "محمد أحمد السعيد",
  "nationalID": "1234567890",
  "gender": 0,
  "dateOfBirth": "1992-03-15T00:00:00Z",
  "phone": "+966501234567",
  "city": "الرياض",
  "bloodTypeID": 1
}
```

---

**Response Structure (بنية الاستجابة):**

الاستجابة تتبع بنية `ServiceResponse<Donor>` الموحدة:

```json
{
  "success": true,
  "message": "string",
  "data": {
    "donorID": 0,
    "fullName": "string",
    "nationalID": "string",
    "gender": 0,
    "dateOfBirth": "2024-01-01T00:00:00Z",
    "phone": "string",
    "bloodTypeID": 0,
    "city": "string",
    "lastDonationDate": null,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "bloodType": {
      "bloodTypeID": 0,
      "bloodTypeName": "string"
    }
  },
  "errors": null
}
```

---

**Status Codes (أكواد الحالة):**

| Code | Status | Description |
|------|--------|-------------|
| 201 | Created | تم إنشاء المتبرع بنجاح |
| 400 | Bad Request | بيانات الطلب غير صحيحة أو ناقصة |
| 401 | Unauthorized | JWT Token مفقود أو غير صالح |
| 409 | Conflict | الرقم الوطني موجود مسبقاً في النظام |
| 500 | Internal Server Error | خطأ في الخادم أثناء معالجة الطلب |

---

**مثال Request:**

**cURL:**

```bash
curl -X POST "https://api.bloodconnect.com/api/donors" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "fullName": "محمد أحمد السعيد",
    "nationalID": "1234567890",
    "gender": 0,
    "dateOfBirth": "1992-03-15T00:00:00Z",
    "phone": "+966501234567",
    "city": "الرياض",
    "bloodTypeID": 1
  }'
```

**JavaScript (Fetch):**

```javascript
const token = 'YOUR_JWT_TOKEN';

const newDonor = {
  fullName: "محمد أحمد السعيد",
  nationalID: "1234567890",
  gender: 0,
  dateOfBirth: "1992-03-15T00:00:00Z",
  phone: "+966501234567",
  city: "الرياض",
  bloodTypeID: 1
};

fetch('https://api.bloodconnect.com/api/donors', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(newDonor)
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Python (Requests):**

```python
import requests
from datetime import datetime

token = 'YOUR_JWT_TOKEN'
url = 'https://api.bloodconnect.com/api/donors'

new_donor = {
    'fullName': 'محمد أحمد السعيد',
    'nationalID': '1234567890',
    'gender': 0,
    'dateOfBirth': '1992-03-15T00:00:00Z',
    'phone': '+966501234567',
    'city': 'الرياض',
    'bloodTypeID': 1
}

headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Bearer {token}'
}

response = requests.post(url, json=new_donor, headers=headers)
data = response.json()
print(data)
```

**C# (.NET):**

```csharp
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

var token = "YOUR_JWT_TOKEN";
var client = new HttpClient();

client.DefaultRequestHeaders.Authorization = 
    new AuthenticationHeaderValue("Bearer", token);
client.DefaultRequestHeaders.Accept.Add(
    new MediaTypeWithQualityHeaderValue("application/json"));

var newDonor = new
{
    fullName = "محمد أحمد السعيد",
    nationalID = "1234567890",
    gender = 0,
    dateOfBirth = "1992-03-15T00:00:00Z",
    phone = "+966501234567",
    city = "الرياض",
    bloodTypeID = 1
};

var json = JsonSerializer.Serialize(newDonor);
var content = new StringContent(json, Encoding.UTF8, "application/json");

var response = await client.PostAsync(
    "https://api.bloodconnect.com/api/donors", content);
var responseContent = await response.Content.ReadAsStringAsync();
```

---

**مثال Success Response (201 Created):**

```json
{
  "success": true,
  "message": "تم إنشاء المتبرع بنجاح",
  "data": {
    "donorID": 15,
    "fullName": "محمد أحمد السعيد",
    "nationalID": "1234567890",
    "gender": 0,
    "dateOfBirth": "1992-03-15T00:00:00Z",
    "phone": "+966501234567",
    "bloodTypeID": 1,
    "city": "الرياض",
    "lastDonationDate": null,
    "isActive": true,
    "createdAt": "2024-02-08T14:30:00Z",
    "updatedAt": "2024-02-08T14:30:00Z",
    "bloodType": {
      "bloodTypeID": 1,
      "bloodTypeName": "O+"
    }
  },
  "errors": null
}
```

**شرح الاستجابة:**

- تم إنشاء المتبرع بنجاح وتم تعيين `donorID` فريد له (15)
- حقل `lastDonationDate` يكون `null` لأن المتبرع جديد ولم يتبرع بعد
- حقل `isActive` يتم تعيينه تلقائياً إلى `true`
- تم تعيين `createdAt` و `updatedAt` إلى وقت الإنشاء
- تم تضمين معلومات فصيلة الدم (BloodType) في الاستجابة

---

**مثال Error Response (400 Bad Request - Validation Error):**

عندما تكون البيانات المدخلة غير صحيحة أو ناقصة:

```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "data": null,
  "errors": [
    "الاسم الكامل مطلوب",
    "الرقم الوطني مطلوب",
    "رقم الهاتف يجب أن لا يتجاوز 15 رقم",
    "فصيلة الدم غير صالحة"
  ]
}
```

---

**مثال Error Response (400 Bad Request - Invalid Blood Type):**

عندما يكون معرف فصيلة الدم غير صالح:

```json
{
  "success": false,
  "message": "فصيلة الدم غير موجودة",
  "data": null,
  "errors": [
    "Blood type with ID 99 does not exist"
  ]
}
```

---

**مثال Error Response (401 Unauthorized):**

عندما يكون JWT Token مفقوداً أو غير صالح:

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

---

**مثال Error Response (409 Conflict - Duplicate National ID):**

عندما يكون الرقم الوطني موجوداً مسبقاً في النظام:

```json
{
  "success": false,
  "message": "الرقم الوطني موجود مسبقاً",
  "data": null,
  "errors": [
    "A donor with national ID '1234567890' already exists in the system"
  ]
}
```

---

**مثال Error Response (500 Internal Server Error):**

عند حدوث خطأ في الخادم:

```json
{
  "success": false,
  "message": "An error occurred while creating the donor",
  "data": null,
  "errors": [
    "Database connection failed"
  ]
}
```

---

**ملاحظات مهمة (Important Notes):**

1. **الحقول المطلوبة (Required Fields):**
   - جميع الحقول في Request Body مطلوبة ولا يمكن تركها فارغة
   - إذا كان أي حقل مفقوداً، ستحصل على خطأ 400 Bad Request مع قائمة بالحقول المفقودة

2. **الرقم الوطني (National ID):**
   - يجب أن يكون الرقم الوطني فريداً في النظام
   - إذا حاولت إنشاء متبرع برقم وطني موجود مسبقاً، ستحصل على خطأ 409 Conflict
   - الحد الأقصى للطول: 20 حرف

3. **Gender Enum:**
   - 0 = Male (ذكر)
   - 1 = Female (أنثى)
   - 2 = Other (آخر)
   - يجب إرسال القيمة الرقمية (0، 1، أو 2) وليس النص

4. **تاريخ الميلاد (Date of Birth):**
   - يجب إرسال التاريخ بصيغة ISO 8601: `YYYY-MM-DDTHH:mm:ssZ`
   - مثال: `"1992-03-15T00:00:00Z"`
   - يمكن أيضاً استخدام صيغة مبسطة: `"1992-03-15"`

5. **فصيلة الدم (Blood Type ID):**
   - يجب أن يكون `bloodTypeID` معرفاً صالحاً موجوداً في جدول فصائل الدم
   - القيم الصالحة عادة من 1 إلى 8 (O+, O-, A+, A-, B+, B-, AB+, AB-)
   - إذا أرسلت معرفاً غير موجود، ستحصل على خطأ 400 Bad Request

6. **رقم الهاتف (Phone):**
   - يُفضل استخدام التنسيق الدولي: `+966501234567`
   - الحد الأقصى للطول: 15 حرف
   - يمكن أن يحتوي على أرقام وعلامات (+، -)

7. **الحقول التلقائية (Auto-Generated Fields):**
   - `donorID`: يتم توليده تلقائياً من قاعدة البيانات
   - `isActive`: يتم تعيينه تلقائياً إلى `true`
   - `lastDonationDate`: يكون `null` عند الإنشاء
   - `createdAt` و `updatedAt`: يتم تعيينهما تلقائياً إلى وقت الإنشاء

8. **الاستجابة (Response):**
   - عند النجاح، يتم إرجاع Status Code 201 Created
   - الاستجابة تحتوي على بيانات المتبرع الكاملة بما في ذلك `donorID` الجديد
   - يتم تضمين معلومات فصيلة الدم (BloodType) في الاستجابة

9. **Location Header:**
   - عند النجاح، يتم إضافة `Location` header في الاستجابة يحتوي على URL للمتبرع الجديد
   - مثال: `Location: https://api.bloodconnect.com/api/donors/15`

---

**حالات الاستخدام (Use Cases):**

**1. تسجيل متبرع جديد من نموذج ويب:**

```javascript
async function registerNewDonor(formData) {
  const donorData = {
    fullName: formData.fullName,
    nationalID: formData.nationalID,
    gender: parseInt(formData.gender),
    dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
    phone: formData.phone,
    city: formData.city,
    bloodTypeID: parseInt(formData.bloodTypeID)
  };

  try {
    const response = await fetch('/api/donors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(donorData)
    });

    const result = await response.json();

    if (result.success) {
      console.log('تم تسجيل المتبرع بنجاح!');
      console.log('معرف المتبرع:', result.data.donorID);
      return result.data;
    } else {
      console.error('فشل التسجيل:', result.errors);
      return null;
    }
  } catch (error) {
    console.error('خطأ في الاتصال:', error);
    return null;
  }
}
```

**2. التحقق من الرقم الوطني قبل الإنشاء:**

```python
def create_donor_if_not_exists(donor_data, token):
    # التحقق من وجود الرقم الوطني
    check_url = f"https://api.bloodconnect.com/api/donors/national/{donor_data['nationalID']}"
    check_response = requests.get(check_url, headers={'Authorization': f'Bearer {token}'})
    
    if check_response.status_code == 200:
        print('الرقم الوطني موجود مسبقاً')
        return None
    
    # إنشاء المتبرع
    create_url = 'https://api.bloodconnect.com/api/donors'
    response = requests.post(create_url, json=donor_data, headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    })
    
    if response.status_code == 201:
        result = response.json()
        print(f"تم إنشاء المتبرع بنجاح: {result['data']['donorID']}")
        return result['data']
    else:
        print('فشل إنشاء المتبرع:', response.json()['errors'])
        return None
```

**3. معالجة أخطاء Validation:**

```javascript
async function createDonorWithValidation(donorData) {
  try {
    const response = await fetch('/api/donors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(donorData)
    });

    const result = await response.json();

    if (response.status === 201) {
      // نجح الإنشاء
      return { success: true, donor: result.data };
    } else if (response.status === 400) {
      // خطأ في البيانات
      return { success: false, validationErrors: result.errors };
    } else if (response.status === 409) {
      // الرقم الوطني موجود مسبقاً
      return { success: false, conflict: true, message: result.message };
    } else {
      // خطأ آخر
      return { success: false, error: result.message };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}
```

**4. إنشاء متبرع مع معالجة كاملة للأخطاء:**

```csharp
public async Task<Donor?> CreateDonorAsync(CreateDonorRequest request)
{
    try
    {
        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PostAsync("/api/donors", content);
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<ServiceResponse<Donor>>(responseContent);

        if (response.StatusCode == HttpStatusCode.Created && result?.Success == true)
        {
            Console.WriteLine($"تم إنشاء المتبرع بنجاح: {result.Data?.DonorID}");
            return result.Data;
        }
        else if (response.StatusCode == HttpStatusCode.BadRequest)
        {
            Console.WriteLine("خطأ في البيانات:");
            result?.Errors?.ForEach(error => Console.WriteLine($"- {error}"));
            return null;
        }
        else if (response.StatusCode == HttpStatusCode.Conflict)
        {
            Console.WriteLine("الرقم الوطني موجود مسبقاً");
            return null;
        }
        else
        {
            Console.WriteLine($"خطأ: {result?.Message}");
            return null;
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"خطأ في الاتصال: {ex.Message}");
        return null;
    }
}
```

---

**نصائح للمطورين (Developer Tips):**

1. **التحقق من البيانات في الواجهة الأمامية:**
   - قم بالتحقق من صحة البيانات في الواجهة الأمامية قبل إرسالها إلى API
   - هذا يحسن تجربة المستخدم ويقلل من الطلبات الفاشلة

2. **معالجة الأخطاء بشكل صحيح:**
   - تحقق دائماً من Status Code قبل معالجة الاستجابة
   - اعرض رسائل الأخطاء للمستخدم بشكل واضح ومفهوم

3. **استخدام Location Header:**
   - بعد إنشاء المتبرع بنجاح، يمكنك استخدام `Location` header للانتقال إلى صفحة المتبرع
   - أو يمكنك استخدام `donorID` من الاستجابة

4. **التعامل مع التواريخ:**
   - تأكد من تحويل التواريخ إلى صيغة ISO 8601 قبل الإرسال
   - في JavaScript: `new Date(dateString).toISOString()`
   - في Python: `datetime.strptime(date_str, '%Y-%m-%d').isoformat()`

5. **اختبار API:**
   - اختبر جميع حالات الأخطاء المحتملة (بيانات ناقصة، رقم وطني مكرر، فصيلة دم غير صالحة)
   - تأكد من معالجة جميع Status Codes بشكل صحيح

---

#### PUT /api/donors/{id}

**الوصف (Description):**

تحديث بيانات متبرع موجود في النظام. يتيح هذا الـ endpoint للمطورين تحديث جميع معلومات المتبرع بما في ذلك البيانات الشخصية، معلومات الاتصال، وفصيلة الدم. يتم استبدال جميع بيانات المتبرع بالبيانات الجديدة المرسلة في الطلب (Full Update).

**HTTP Method:** `PUT`

**URL:** `/api/donors/{id}`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Path Parameters (معاملات المسار):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | معرف المتبرع المراد تحديثه (Donor ID) |

**مثال URL:**
```
PUT /api/donors/15
```

---

**Request Body (بنية الطلب):**

يجب إرسال جميع بيانات المتبرع بصيغة JSON في Request Body. جميع الحقول مطلوبة:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `fullName` | string | Yes | Max 100 characters | الاسم الكامل للمتبرع |
| `nationalID` | string | Yes | Max 20 characters, Unique | الرقم الوطني (رقم الهوية) |
| `gender` | integer | Yes | 0, 1, or 2 | الجنس (0 = ذكر، 1 = أنثى، 2 = آخر) |
| `dateOfBirth` | string (ISO 8601) | Yes | Valid date | تاريخ الميلاد |
| `phone` | string | Yes | Max 15 characters | رقم الهاتف |
| `city` | string | Yes | Max 50 characters | المدينة |
| `bloodTypeID` | integer | Yes | Valid Blood Type ID (1-8) | معرف فصيلة الدم |
| `isActive` | boolean | Yes | true or false | حالة المتبرع (نشط/غير نشط) |

**مثال Request Body:**

```json
{
  "fullName": "محمد أحمد السعيد المحدث",
  "nationalID": "1234567890",
  "gender": 0,
  "dateOfBirth": "1992-03-15T00:00:00Z",
  "phone": "+966509876543",
  "city": "جدة",
  "bloodTypeID": 2,
  "isActive": true
}
```

---

**Response Structure (بنية الاستجابة):**

الاستجابة تتبع بنية `ServiceResponse<Donor>` الموحدة:

```json
{
  "success": true,
  "message": "string",
  "data": {
    "donorID": 0,
    "fullName": "string",
    "nationalID": "string",
    "gender": 0,
    "dateOfBirth": "2024-01-01T00:00:00Z",
    "phone": "string",
    "bloodTypeID": 0,
    "city": "string",
    "lastDonationDate": "2024-01-01T00:00:00Z",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-02-08T00:00:00Z",
    "bloodType": {
      "bloodTypeID": 0,
      "bloodTypeName": "string"
    }
  },
  "errors": null
}
```

---

**Status Codes (أكواد الحالة):**

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | تم تحديث المتبرع بنجاح |
| 400 | Bad Request | بيانات الطلب غير صحيحة أو ناقصة |
| 401 | Unauthorized | JWT Token مفقود أو غير صالح |
| 404 | Not Found | المتبرع المطلوب غير موجود |
| 409 | Conflict | الرقم الوطني موجود لمتبرع آخر |
| 500 | Internal Server Error | خطأ في الخادم أثناء معالجة الطلب |

---

**مثال Request:**

**cURL:**

```bash
curl -X PUT "https://api.bloodconnect.com/api/donors/15" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "fullName": "محمد أحمد السعيد المحدث",
    "nationalID": "1234567890",
    "gender": 0,
    "dateOfBirth": "1992-03-15T00:00:00Z",
    "phone": "+966509876543",
    "city": "جدة",
    "bloodTypeID": 2,
    "isActive": true
  }'
```

**JavaScript (Fetch):**

```javascript
const token = 'YOUR_JWT_TOKEN';
const donorId = 15;

const updatedDonor = {
  fullName: "محمد أحمد السعيد المحدث",
  nationalID: "1234567890",
  gender: 0,
  dateOfBirth: "1992-03-15T00:00:00Z",
  phone: "+966509876543",
  city: "جدة",
  bloodTypeID: 2,
  isActive: true
};

fetch(`https://api.bloodconnect.com/api/donors/${donorId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(updatedDonor)
})
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('تم تحديث المتبرع بنجاح:', data.data);
    } else {
      console.error('فشل التحديث:', data.errors);
    }
  })
  .catch(error => console.error('Error:', error));
```

**Python (Requests):**

```python
import requests

token = 'YOUR_JWT_TOKEN'
donor_id = 15
url = f'https://api.bloodconnect.com/api/donors/{donor_id}'

updated_donor = {
    'fullName': 'محمد أحمد السعيد المحدث',
    'nationalID': '1234567890',
    'gender': 0,
    'dateOfBirth': '1992-03-15T00:00:00Z',
    'phone': '+966509876543',
    'city': 'جدة',
    'bloodTypeID': 2,
    'isActive': True
}

headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Bearer {token}'
}

response = requests.put(url, json=updated_donor, headers=headers)
data = response.json()

if response.status_code == 200 and data['success']:
    print(f"تم تحديث المتبرع بنجاح: {data['data']['donorID']}")
else:
    print(f"فشل التحديث: {data['errors']}")
```

**C# (.NET):**

```csharp
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

var token = "YOUR_JWT_TOKEN";
var donorId = 15;
var client = new HttpClient();

client.DefaultRequestHeaders.Authorization = 
    new AuthenticationHeaderValue("Bearer", token);
client.DefaultRequestHeaders.Accept.Add(
    new MediaTypeWithQualityHeaderValue("application/json"));

var updatedDonor = new
{
    fullName = "محمد أحمد السعيد المحدث",
    nationalID = "1234567890",
    gender = 0,
    dateOfBirth = "1992-03-15T00:00:00Z",
    phone = "+966509876543",
    city = "جدة",
    bloodTypeID = 2,
    isActive = true
};

var json = JsonSerializer.Serialize(updatedDonor);
var content = new StringContent(json, Encoding.UTF8, "application/json");

var response = await client.PutAsync(
    $"https://api.bloodconnect.com/api/donors/{donorId}", content);
var responseContent = await response.Content.ReadAsStringAsync();

if (response.IsSuccessStatusCode)
{
    Console.WriteLine("تم تحديث المتبرع بنجاح");
}
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم تحديث المتبرع بنجاح",
  "data": {
    "donorID": 15,
    "fullName": "محمد أحمد السعيد المحدث",
    "nationalID": "1234567890",
    "gender": 0,
    "dateOfBirth": "1992-03-15T00:00:00Z",
    "phone": "+966509876543",
    "bloodTypeID": 2,
    "city": "جدة",
    "lastDonationDate": "2024-01-15T10:30:00Z",
    "isActive": true,
    "createdAt": "2023-12-01T10:00:00Z",
    "updatedAt": "2024-02-08T15:45:00Z",
    "bloodType": {
      "bloodTypeID": 2,
      "bloodTypeName": "A+"
    }
  },
  "errors": null
}
```

**شرح الاستجابة:**

- تم تحديث بيانات المتبرع بنجاح
- حقل `updatedAt` تم تحديثه إلى وقت التحديث الحالي
- حقل `createdAt` يبقى كما هو (لا يتغير)
- حقل `lastDonationDate` يبقى كما هو (لا يتأثر بالتحديث)
- تم تحديث فصيلة الدم من O+ إلى A+
- تم تحديث المدينة من الرياض إلى جدة
- تم تحديث رقم الهاتف

---

**مثال Error Response (400 Bad Request - Validation Error):**

عندما تكون البيانات المدخلة غير صحيحة أو ناقصة:

```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "data": null,
  "errors": [
    "الاسم الكامل مطلوب",
    "رقم الهاتف يجب أن لا يتجاوز 15 رقم",
    "فصيلة الدم غير صالحة"
  ]
}
```

---

**مثال Error Response (401 Unauthorized):**

عندما يكون JWT Token مفقوداً أو غير صالح:

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

---

**مثال Error Response (404 Not Found):**

عندما لا يوجد متبرع بالمعرف المطلوب:

```json
{
  "success": false,
  "message": "Donor not found",
  "data": null,
  "errors": [
    "No donor exists with ID: 999"
  ]
}
```

---

**مثال Error Response (409 Conflict - Duplicate National ID):**

عندما تحاول تحديث الرقم الوطني إلى رقم موجود لمتبرع آخر:

```json
{
  "success": false,
  "message": "الرقم الوطني موجود لمتبرع آخر",
  "data": null,
  "errors": [
    "A donor with national ID '9876543210' already exists in the system"
  ]
}
```

---

**مثال Error Response (500 Internal Server Error):**

عند حدوث خطأ في الخادم:

```json
{
  "success": false,
  "message": "An error occurred while updating the donor",
  "data": null,
  "errors": [
    "Database connection failed"
  ]
}
```

---

**ملاحظات مهمة (Important Notes):**

1. **PUT vs PATCH:**
   - **PUT** يستبدل جميع بيانات المتبرع (Full Update)
   - يجب إرسال جميع الحقول حتى لو لم تتغير
   - إذا كنت تريد تحديث حقول محددة فقط، استخدم PATCH endpoint (إن كان متاحاً)

2. **الحقول المطلوبة (Required Fields):**
   - جميع الحقول في Request Body مطلوبة
   - حتى لو كنت تريد تحديث حقل واحد فقط، يجب إرسال جميع الحقول الأخرى بقيمها الحالية

3. **معرف المتبرع (Donor ID):**
   - يجب أن يكون `id` في URL موجوداً في النظام
   - إذا أرسلت معرفاً غير موجود، ستحصل على خطأ 404 Not Found
   - لا يمكن تغيير `donorID` - هو معرف ثابت

4. **الرقم الوطني (National ID):**
   - يمكن تحديث الرقم الوطني للمتبرع
   - يجب أن يكون الرقم الوطني الجديد فريداً (غير مستخدم من قبل متبرع آخر)
   - إذا حاولت تحديثه إلى رقم موجود لمتبرع آخر، ستحصل على خطأ 409 Conflict

5. **فصيلة الدم (Blood Type):**
   - يمكن تحديث فصيلة دم المتبرع
   - يجب أن يكون `bloodTypeID` معرفاً صالحاً موجوداً في جدول فصائل الدم
   - تحديث فصيلة الدم لا يؤثر على التبرعات السابقة

6. **حالة المتبرع (isActive):**
   - يمكن تعطيل المتبرع بتعيين `isActive` إلى `false`
   - المتبرعون غير النشطين لا يظهرون في قوائم المتبرعين المؤهلين
   - يمكن إعادة تفعيل المتبرع بتعيين `isActive` إلى `true`

7. **الحقول التي لا تتأثر بالتحديث:**
   - `donorID`: لا يمكن تغييره
   - `createdAt`: يبقى كما هو (تاريخ الإنشاء الأصلي)
   - `lastDonationDate`: لا يتأثر بتحديث البيانات الشخصية (يتم تحديثه فقط عند تسجيل تبرع جديد)

8. **حقل updatedAt:**
   - يتم تحديث `updatedAt` تلقائياً إلى وقت التحديث الحالي
   - لا تحتاج لإرساله في Request Body

9. **التحقق من الوجود قبل التحديث:**
   - يُنصح بالتحقق من وجود المتبرع أولاً باستخدام GET endpoint
   - أو معالجة خطأ 404 Not Found بشكل صحيح

10. **الأذونات (Permissions):**
    - قد تتطلب بعض الأنظمة صلاحيات خاصة لتحديث بيانات المتبرعين
    - تأكد من أن المستخدم لديه الصلاحيات المناسبة

---

**حالات الاستخدام (Use Cases):**

**1. تحديث معلومات الاتصال للمتبرع:**

```javascript
async function updateDonorContactInfo(donorId, newPhone, newCity) {
  // أولاً، احصل على البيانات الحالية
  const currentDonor = await fetch(`/api/donors/${donorId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json());

  if (!currentDonor.success) {
    console.error('المتبرع غير موجود');
    return null;
  }

  // ثانياً، قم بتحديث الحقول المطلوبة فقط
  const updatedData = {
    ...currentDonor.data,
    phone: newPhone,
    city: newCity
  };

  // ثالثاً، أرسل طلب التحديث
  const response = await fetch(`/api/donors/${donorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updatedData)
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('تم تحديث معلومات الاتصال بنجاح');
    return result.data;
  } else {
    console.error('فشل التحديث:', result.errors);
    return null;
  }
}
```

**2. تحديث فصيلة دم المتبرع:**

```python
def update_donor_blood_type(donor_id, new_blood_type_id, token):
    # الحصول على البيانات الحالية
    get_url = f'https://api.bloodconnect.com/api/donors/{donor_id}'
    get_response = requests.get(get_url, headers={'Authorization': f'Bearer {token}'})
    
    if get_response.status_code != 200:
        print('المتبرع غير موجود')
        return None
    
    current_donor = get_response.json()['data']
    
    # تحديث فصيلة الدم
    current_donor['bloodTypeID'] = new_blood_type_id
    
    # إرسال طلب التحديث
    put_url = f'https://api.bloodconnect.com/api/donors/{donor_id}'
    put_response = requests.put(put_url, json=current_donor, headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    })
    
    if put_response.status_code == 200:
        result = put_response.json()
        print(f"تم تحديث فصيلة الدم إلى: {result['data']['bloodType']['bloodTypeName']}")
        return result['data']
    else:
        print('فشل التحديث:', put_response.json()['errors'])
        return None
```

**3. تعطيل متبرع (Deactivate):**

```javascript
async function deactivateDonor(donorId) {
  try {
    // الحصول على البيانات الحالية
    const getDonorResponse = await fetch(`/api/donors/${donorId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!getDonorResponse.ok) {
      throw new Error('المتبرع غير موجود');
    }
    
    const currentDonor = await getDonorResponse.json();
    
    // تعطيل المتبرع
    const updatedDonor = {
      ...currentDonor.data,
      isActive: false
    };
    
    // إرسال طلب التحديث
    const updateResponse = await fetch(`/api/donors/${donorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedDonor)
    });
    
    const result = await updateResponse.json();
    
    if (result.success) {
      console.log('تم تعطيل المتبرع بنجاح');
      return true;
    } else {
      console.error('فشل التعطيل:', result.errors);
      return false;
    }
  } catch (error) {
    console.error('خطأ:', error.message);
    return false;
  }
}
```

**4. تحديث مع معالجة كاملة للأخطاء:**

```csharp
public async Task<bool> UpdateDonorAsync(int donorId, UpdateDonorRequest request)
{
    try
    {
        // التحقق من وجود المتبرع أولاً
        var getDonorResponse = await _httpClient.GetAsync($"/api/donors/{donorId}");
        
        if (getDonorResponse.StatusCode == HttpStatusCode.NotFound)
        {
            Console.WriteLine($"المتبرع {donorId} غير موجود");
            return false;
        }
        
        // إرسال طلب التحديث
        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var updateResponse = await _httpClient.PutAsync($"/api/donors/{donorId}", content);
        var responseContent = await updateResponse.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<ServiceResponse<Donor>>(responseContent);

        if (updateResponse.StatusCode == HttpStatusCode.OK && result?.Success == true)
        {
            Console.WriteLine($"تم تحديث المتبرع {donorId} بنجاح");
            return true;
        }
        else if (updateResponse.StatusCode == HttpStatusCode.BadRequest)
        {
            Console.WriteLine("خطأ في البيانات:");
            result?.Errors?.ForEach(error => Console.WriteLine($"- {error}"));
            return false;
        }
        else if (updateResponse.StatusCode == HttpStatusCode.Conflict)
        {
            Console.WriteLine("الرقم الوطني موجود لمتبرع آخر");
            return false;
        }
        else
        {
            Console.WriteLine($"خطأ: {result?.Message}");
            return false;
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"خطأ في الاتصال: {ex.Message}");
        return false;
    }
}
```

**5. تحديث متعدد الحقول مع Validation:**

```javascript
async function updateDonorWithValidation(donorId, updates) {
  try {
    // الحصول على البيانات الحالية
    const currentResponse = await fetch(`/api/donors/${donorId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!currentResponse.ok) {
      return { success: false, error: 'المتبرع غير موجود' };
    }
    
    const currentDonor = await currentResponse.json();
    
    // دمج التحديثات مع البيانات الحالية
    const updatedDonor = {
      ...currentDonor.data,
      ...updates
    };
    
    // التحقق من البيانات قبل الإرسال
    if (!updatedDonor.fullName || updatedDonor.fullName.length > 100) {
      return { success: false, error: 'الاسم الكامل غير صالح' };
    }
    
    if (!updatedDonor.phone || updatedDonor.phone.length > 15) {
      return { success: false, error: 'رقم الهاتف غير صالح' };
    }
    
    // إرسال طلب التحديث
    const updateResponse = await fetch(`/api/donors/${donorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedDonor)
    });
    
    const result = await updateResponse.json();
    
    if (updateResponse.status === 200 && result.success) {
      return { success: true, donor: result.data };
    } else if (updateResponse.status === 400) {
      return { success: false, validationErrors: result.errors };
    } else if (updateResponse.status === 409) {
      return { success: false, conflict: true, message: result.message };
    } else {
      return { success: false, error: result.message };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

// استخدام
const result = await updateDonorWithValidation(15, {
  phone: '+966509876543',
  city: 'جدة'
});

if (result.success) {
  console.log('تم التحديث بنجاح:', result.donor);
} else {
  console.error('فشل التحديث:', result.error || result.validationErrors);
}
```

---

**نصائح للمطورين (Developer Tips):**

1. **احصل على البيانات الحالية أولاً:**
   - قبل التحديث، احصل على البيانات الحالية باستخدام GET endpoint
   - هذا يضمن أنك لا تفقد أي بيانات عند التحديث

2. **استخدم Spread Operator للدمج:**
   - في JavaScript: `{ ...currentData, ...updates }`
   - هذا يسهل تحديث حقول محددة مع الحفاظ على الباقي

3. **معالجة الأخطاء بشكل شامل:**
   - تحقق من جميع Status Codes المحتملة (200، 400، 401، 404، 409، 500)
   - اعرض رسائل خطأ واضحة للمستخدم

4. **التحقق من البيانات قبل الإرسال:**
   - قم بالتحقق من صحة البيانات في الواجهة الأمامية
   - هذا يقلل من الطلبات الفاشلة ويحسن تجربة المستخدم

5. **استخدام PATCH للتحديثات الجزئية:**
   - إذا كان PATCH endpoint متاحاً، استخدمه لتحديث حقول محددة فقط
   - هذا أكثر كفاءة من PUT الذي يتطلب جميع الحقول

6. **تتبع التغييرات:**
   - احتفظ بسجل للتغييرات المهمة (مثل تغيير فصيلة الدم)
   - يمكنك استخدام حقل `updatedAt` لمعرفة آخر تحديث

7. **الأمان:**
   - تأكد من أن المستخدم لديه الصلاحيات المناسبة لتحديث بيانات المتبرعين
   - لا تسمح للمتبرعين بتحديث بيانات متبرعين آخرين

---

#### DELETE /api/donors/{id}

**الوصف (Description):**

حذف متبرع من النظام باستخدام معرفه الفريد (Donor ID). يتيح هذا الـ endpoint للمطورين إزالة سجل متبرع بشكل نهائي من قاعدة البيانات. **تحذير:** هذه عملية لا يمكن التراجع عنها، وسيتم حذف جميع البيانات المرتبطة بالمتبرع.

**HTTP Method:** `DELETE`

**URL:** `/api/donors/{id}`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Path Parameters (معاملات المسار):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | المعرف الفريد للمتبرع المراد حذفه (Donor ID) |

**مثال URL:**
```
DELETE /api/donors/15
```

---

**Request Body:**

لا يتطلب هذا الـ endpoint أي Request Body. يتم تحديد المتبرع المراد حذفه من خلال `id` في URL.

---

**Response Structure (بنية الاستجابة):**

الاستجابة تتبع بنية `ServiceResponse<object>` الموحدة:

```json
{
  "success": true,
  "message": "string",
  "data": null,
  "errors": null
}
```

---

**Status Codes (أكواد الحالة):**

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | تم حذف المتبرع بنجاح |
| 401 | Unauthorized | JWT Token مفقود أو غير صالح |
| 404 | Not Found | المتبرع المطلوب غير موجود |
| 500 | Internal Server Error | خطأ في الخادم أثناء معالجة الطلب |

---

**مثال Request:**

**cURL:**

```bash
curl -X DELETE "https://api.bloodconnect.com/api/donors/15" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**JavaScript (Fetch):**

```javascript
const token = 'YOUR_JWT_TOKEN';
const donorId = 15;

fetch(`https://api.bloodconnect.com/api/donors/${donorId}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('تم حذف المتبرع بنجاح');
    } else {
      console.error('فشل الحذف:', data.errors);
    }
  })
  .catch(error => console.error('Error:', error));
```

**Python (Requests):**

```python
import requests

token = 'YOUR_JWT_TOKEN'
donor_id = 15
url = f'https://api.bloodconnect.com/api/donors/{donor_id}'

headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Bearer {token}'
}

response = requests.delete(url, headers=headers)
data = response.json()

if response.status_code == 200 and data['success']:
    print(f"تم حذف المتبرع {donor_id} بنجاح")
else:
    print(f"فشل الحذف: {data.get('errors', data.get('message'))}")
```

**C# (.NET):**

```csharp
using System.Net.Http;
using System.Net.Http.Headers;

var token = "YOUR_JWT_TOKEN";
var donorId = 15;
var client = new HttpClient();

client.DefaultRequestHeaders.Authorization = 
    new AuthenticationHeaderValue("Bearer", token);
client.DefaultRequestHeaders.Accept.Add(
    new MediaTypeWithQualityHeaderValue("application/json"));

var response = await client.DeleteAsync(
    $"https://api.bloodconnect.com/api/donors/{donorId}");
var content = await response.Content.ReadAsStringAsync();

if (response.IsSuccessStatusCode)
{
    Console.WriteLine($"تم حذف المتبرع {donorId} بنجاح");
}
else
{
    Console.WriteLine($"فشل الحذف: {content}");
}
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم حذف المتبرع بنجاح",
  "data": null,
  "errors": null
}
```

**شرح الاستجابة:**

- **success**: `true` يشير إلى نجاح عملية الحذف
- **message**: رسالة تأكيد الحذف
- **data**: `null` لأن عملية الحذف لا تُرجع بيانات
- **errors**: `null` لأنه لا توجد أخطاء

---

**مثال Error Response (401 Unauthorized):**

عندما يكون JWT Token مفقوداً أو غير صالح:

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

---

**مثال Error Response (404 Not Found):**

عندما لا يوجد متبرع بالمعرف المطلوب:

```json
{
  "success": false,
  "message": "Donor not found",
  "data": null,
  "errors": [
    "No donor exists with ID: 15"
  ]
}
```

---

**مثال Error Response (500 Internal Server Error):**

عند حدوث خطأ في الخادم:

```json
{
  "success": false,
  "message": "An error occurred while deleting the donor",
  "data": null,
  "errors": [
    "Database connection failed"
  ]
}
```

---

**ملاحظات مهمة (Important Notes):**

1. **عملية لا يمكن التراجع عنها:**
   - حذف المتبرع هو عملية نهائية ولا يمكن التراجع عنها
   - تأكد من تأكيد المستخدم قبل تنفيذ عملية الحذف
   - يُنصح بعرض رسالة تحذيرية للمستخدم قبل الحذف

2. **البيانات المرتبطة:**
   - قد يتم حذف جميع البيانات المرتبطة بالمتبرع (مثل التبرعات) حسب إعدادات قاعدة البيانات
   - أو قد يتم منع الحذف إذا كان هناك تبرعات مرتبطة بالمتبرع
   - تحقق من سياسة النظام بخصوص Cascade Delete

3. **بديل للحذف - التعطيل:**
   - بدلاً من الحذف النهائي، يمكنك تعطيل المتبرع باستخدام PUT endpoint وتعيين `isActive` إلى `false`
   - هذا يحافظ على البيانات التاريخية ويسمح بإعادة التفعيل لاحقاً
   - **مثال:**
     ```javascript
     // تعطيل بدلاً من الحذف
     await fetch(`/api/donors/${donorId}`, {
       method: 'PUT',
       body: JSON.stringify({ ...donorData, isActive: false })
     });
     ```

4. **معرف المتبرع (Donor ID):**
   - يجب أن يكون `id` رقماً صحيحاً موجباً (Positive Integer)
   - إذا أرسلت قيمة غير صحيحة، ستحصل على خطأ 400 Bad Request

5. **الأذونات (Permissions):**
   - عادةً ما تتطلب عملية الحذف صلاحيات إدارية (Admin)
   - تأكد من أن المستخدم لديه الصلاحيات المناسبة لحذف المتبرعين
   - قد يتم رفض الطلب مع خطأ 403 Forbidden إذا لم تكن لديك الصلاحيات

6. **التحقق من الوجود:**
   - يُنصح بالتحقق من وجود المتبرع أولاً باستخدام GET endpoint
   - أو معالجة خطأ 404 Not Found بشكل صحيح في التطبيق

7. **Soft Delete vs Hard Delete:**
   - **Hard Delete**: حذف نهائي من قاعدة البيانات (قد يكون هذا هو السلوك الافتراضي)
   - **Soft Delete**: تعليم السجل كمحذوف دون إزالته فعلياً (يتطلب تعديل في الكود)
   - تحقق من نوع الحذف المستخدم في النظام

8. **Audit Trail:**
   - يُنصح بتسجيل عمليات الحذف في سجل التدقيق (Audit Log)
   - احتفظ بمعلومات: من قام بالحذف، متى، ولماذا

---

**حالات الاستخدام (Use Cases):**

**1. حذف متبرع مع تأكيد المستخدم:**

```javascript
async function deleteDonorWithConfirmation(donorId) {
  // عرض رسالة تأكيد للمستخدم
  const confirmed = confirm(
    'هل أنت متأكد من حذف هذا المتبرع؟ هذه العملية لا يمكن التراجع عنها.'
  );
  
  if (!confirmed) {
    console.log('تم إلغاء عملية الحذف');
    return { success: false, cancelled: true };
  }
  
  try {
    const response = await fetch(`/api/donors/${donorId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (response.status === 200 && result.success) {
      console.log('تم حذف المتبرع بنجاح');
      return { success: true };
    } else if (response.status === 404) {
      console.error('المتبرع غير موجود');
      return { success: false, notFound: true };
    } else {
      console.error('فشل الحذف:', result.errors);
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.error('خطأ في الاتصال:', error);
    return { success: false, networkError: true };
  }
}

// استخدام
const result = await deleteDonorWithConfirmation(15);
if (result.success) {
  // تحديث الواجهة - إزالة المتبرع من القائمة
  removeDonorFromUI(15);
}
```

**2. حذف مع التحقق من الوجود أولاً:**

```python
def delete_donor_safely(donor_id, token):
    """حذف متبرع مع التحقق من وجوده أولاً"""
    
    # التحقق من وجود المتبرع
    get_url = f'https://api.bloodconnect.com/api/donors/{donor_id}'
    get_response = requests.get(get_url, headers={
        'Authorization': f'Bearer {token}'
    })
    
    if get_response.status_code == 404:
        print(f'المتبرع {donor_id} غير موجود')
        return {'success': False, 'error': 'not_found'}
    
    if get_response.status_code != 200:
        print('خطأ في التحقق من وجود المتبرع')
        return {'success': False, 'error': 'check_failed'}
    
    # عرض معلومات المتبرع قبل الحذف
    donor = get_response.json()['data']
    print(f"سيتم حذف المتبرع: {donor['fullName']} (ID: {donor_id})")
    
    # تأكيد الحذف
    confirmation = input('هل أنت متأكد؟ (yes/no): ')
    if confirmation.lower() != 'yes':
        print('تم إلغاء عملية الحذف')
        return {'success': False, 'cancelled': True}
    
    # تنفيذ الحذف
    delete_url = f'https://api.bloodconnect.com/api/donors/{donor_id}'
    delete_response = requests.delete(delete_url, headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    })
    
    if delete_response.status_code == 200:
        result = delete_response.json()
        if result['success']:
            print(f"تم حذف المتبرع {donor_id} بنجاح")
            return {'success': True, 'donor': donor}
    
    print('فشل الحذف:', delete_response.json().get('errors'))
    return {'success': False, 'error': 'delete_failed'}
```

**3. حذف متعدد مع معالجة الأخطاء:**

```javascript
async function deleteMult ipleDonors(donorIds) {
  const results = {
    successful: [],
    failed: [],
    notFound: []
  };
  
  for (const donorId of donorIds) {
    try {
      const response = await fetch(`/api/donors/${donorId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.status === 200 && result.success) {
        results.successful.push(donorId);
        console.log(`✓ تم حذف المتبرع ${donorId}`);
      } else if (response.status === 404) {
        results.notFound.push(donorId);
        console.log(`✗ المتبرع ${donorId} غير موجود`);
      } else {
        results.failed.push({ id: donorId, errors: result.errors });
        console.log(`✗ فشل حذف المتبرع ${donorId}`);
      }
    } catch (error) {
      results.failed.push({ id: donorId, error: 'Network error' });
      console.error(`✗ خطأ في حذف المتبرع ${donorId}:`, error);
    }
  }
  
  // عرض ملخص النتائج
  console.log('\n=== ملخص عملية الحذف ===');
  console.log(`نجح: ${results.successful.length}`);
  console.log(`فشل: ${results.failed.length}`);
  console.log(`غير موجود: ${results.notFound.length}`);
  
  return results;
}

// استخدام
const donorIdsToDelete = [15, 16, 17, 999];
const results = await deleteMultipleDonors(donorIdsToDelete);
```

**4. تعطيل بدلاً من الحذف (Soft Delete):**

```csharp
public async Task<bool> DeactivateDonorInsteadOfDelete(int donorId)
{
    try
    {
        // الحصول على بيانات المتبرع الحالية
        var getDonorResponse = await _httpClient.GetAsync($"/api/donors/{donorId}");
        
        if (getDonorResponse.StatusCode == HttpStatusCode.NotFound)
        {
            Console.WriteLine($"المتبرع {donorId} غير موجود");
            return false;
        }
        
        var donorContent = await getDonorResponse.Content.ReadAsStringAsync();
        var donorResult = JsonSerializer.Deserialize<ServiceResponse<Donor>>(donorContent);
        
        if (donorResult?.Data == null)
        {
            Console.WriteLine("فشل في الحصول على بيانات المتبرع");
            return false;
        }
        
        // تعطيل المتبرع بدلاً من حذفه
        var donor = donorResult.Data;
        donor.IsActive = false;
        
        var json = JsonSerializer.Serialize(donor);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var updateResponse = await _httpClient.PutAsync($"/api/donors/{donorId}", content);
        
        if (updateResponse.IsSuccessStatusCode)
        {
            Console.WriteLine($"تم تعطيل المتبرع {donorId} بنجاح (Soft Delete)");
            return true;
        }
        else
        {
            Console.WriteLine("فشل في تعطيل المتبرع");
            return false;
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"خطأ: {ex.Message}");
        return false;
    }
}
```

**5. حذف مع Audit Log:**

```javascript
async function deleteDonorWithAudit(donorId, reason, deletedBy) {
  try {
    // الحصول على بيانات المتبرع قبل الحذف للـ Audit Log
    const getDonorResponse = await fetch(`/api/donors/${donorId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!getDonorResponse.ok) {
      return { success: false, error: 'Donor not found' };
    }
    
    const donorData = await getDonorResponse.json();
    const donor = donorData.data;
    
    // تنفيذ الحذف
    const deleteResponse = await fetch(`/api/donors/${donorId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const deleteResult = await deleteResponse.json();
    
    if (deleteResponse.status === 200 && deleteResult.success) {
      // تسجيل عملية الحذف في Audit Log
      const auditLog = {
        action: 'DELETE_DONOR',
        donorId: donorId,
        donorName: donor.fullName,
        donorNationalId: donor.nationalID,
        deletedBy: deletedBy,
        deletedAt: new Date().toISOString(),
        reason: reason
      };
      
      // حفظ Audit Log (يمكن إرساله إلى endpoint منفصل)
      await saveAuditLog(auditLog);
      
      console.log('تم حذف المتبرع وتسجيل العملية في Audit Log');
      return { success: true, auditLog: auditLog };
    } else {
      return { success: false, errors: deleteResult.errors };
    }
  } catch (error) {
    console.error('خطأ:', error);
    return { success: false, networkError: true };
  }
}

// استخدام
const result = await deleteDonorWithAudit(
  15,
  'بيانات مكررة',
  'admin@bloodconnect.com'
);
```

---

**نصائح للمطورين (Developer Tips):**

1. **استخدم التأكيد دائماً:**
   - اطلب من المستخدم تأكيد عملية الحذف
   - اعرض معلومات المتبرع قبل الحذف للتأكد من الاختيار الصحيح

2. **فكر في Soft Delete:**
   - بدلاً من الحذف النهائي، استخدم تعطيل المتبرع (`isActive = false`)
   - هذا يحافظ على البيانات التاريخية ويسمح بالاسترجاع

3. **معالجة الأخطاء:**
   - تحقق من جميع Status Codes المحتملة (200، 401، 404، 500)
   - اعرض رسائل خطأ واضحة للمستخدم

4. **التحقق من الصلاحيات:**
   - تأكد من أن المستخدم لديه صلاحيات الحذف
   - عادةً ما تكون عملية الحذف مقتصرة على المسؤولين (Admins)

5. **Audit Trail:**
   - احتفظ بسجل لعمليات الحذف
   - سجل: من قام بالحذف، متى، ولماذا

6. **التعامل مع البيانات المرتبطة:**
   - تحقق من سياسة النظام بخصوص البيانات المرتبطة (مثل التبرعات)
   - قد تحتاج لحذف أو نقل البيانات المرتبطة أولاً

7. **تحديث الواجهة:**
   - بعد الحذف الناجح، قم بتحديث الواجهة فوراً
   - أزل المتبرع من القوائم والجداول

8. **معالجة الحالات الخاصة:**
   - ماذا لو كان المتبرع لديه تبرعات نشطة؟
   - ماذا لو كان المتبرع مرتبطاً بطلبات دم معلقة؟
   - تعامل مع هذه الحالات بشكل مناسب

---

#### GET /api/donors/eligible

**الوصف (Description):**

الحصول على قائمة المتبرعين المؤهلين للتبرع بالدم. يتيح هذا الـ endpoint للمطورين استرجاع المتبرعين الذين يستوفون معايير الأهلية للتبرع، مما يسهل عملية تحديد المتبرعين المتاحين لتلبية احتياجات بنك الدم. يتم تطبيق معايير الأهلية تلقائياً على النتائج.

**HTTP Method:** `GET`

**URL:** `/api/donors/eligible`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Query Parameters (معاملات الاستعلام):**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pageNumber` | integer | No | 1 | رقم الصفحة المطلوبة (يبدأ من 1) |
| `pageSize` | integer | No | 10 | عدد العناصر في كل صفحة (الحد الأقصى: 100) |
| `bloodType` | string | No | null | فلترة حسب فصيلة دم محددة (مثل: "O+", "A-", "B+") |

---

**معايير الأهلية للتبرع (Eligibility Criteria):**

المتبرع يعتبر مؤهلاً للتبرع إذا استوفى جميع الشروط التالية:

1. **حالة النشاط (Active Status):**
   - يجب أن يكون `isActive = true`
   - المتبرعون غير النشطين لا يظهرون في النتائج

2. **الفترة الزمنية منذ آخر تبرع (Time Since Last Donation):**
   - **للذكور (Male):** يجب أن يكون قد مر 3 أشهر (90 يوماً) على الأقل منذ آخر تبرع
   - **للإناث (Female):** يجب أن يكون قد مر 4 أشهر (120 يوماً) على الأقل منذ آخر تبرع
   - إذا كان `lastDonationDate` يساوي `null` (لم يتبرع من قبل)، يعتبر المتبرع مؤهلاً

3. **العمر (Age):**
   - يجب أن يكون عمر المتبرع بين 18 و 65 سنة
   - يتم حساب العمر من `dateOfBirth`

4. **الحالة الصحية (Health Status):**
   - يجب أن يكون آخر تبرع (إن وجد) قد اجتاز الفحوصات (`testResult = Passed`)
   - أو لم يتبرع من قبل (`lastDonationDate = null`)

**ملاحظة:** هذه المعايير قد تختلف حسب سياسات بنك الدم والقوانين المحلية. تأكد من مراجعة المعايير المطبقة في نظامك.

---

**Response Structure (بنية الاستجابة):**

الاستجابة تتبع بنية `ServiceResponse<PagedResult<Donor>>` الموحدة:

```json
{
  "success": true,
  "message": "string",
  "data": {
    "items": [
      {
        "donorID": 0,
        "fullName": "string",
        "nationalID": "string",
        "gender": 0,
        "dateOfBirth": "2024-01-01T00:00:00Z",
        "phone": "string",
        "bloodTypeID": 0,
        "city": "string",
        "lastDonationDate": "2024-01-01T00:00:00Z",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "bloodType": {
          "bloodTypeID": 0,
          "bloodTypeName": "string"
        }
      }
    ],
    "totalCount": 0,
    "pageNumber": 0,
    "pageSize": 0,
    "totalPages": 0,
    "hasPrevious": false,
    "hasNext": false
  },
  "errors": null
}
```

---

**Status Codes (أكواد الحالة):**

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | تم استرجاع قائمة المتبرعين المؤهلين بنجاح |
| 401 | Unauthorized | JWT Token مفقود أو غير صالح |
| 500 | Internal Server Error | خطأ في الخادم أثناء معالجة الطلب |

---

**مثال Request (طلب بسيط):**

**cURL:**

```bash
curl -X GET "https://api.bloodconnect.com/api/donors/eligible?pageNumber=1&pageSize=10" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**JavaScript (Fetch):**

```javascript
const token = 'YOUR_JWT_TOKEN';

fetch('https://api.bloodconnect.com/api/donors/eligible?pageNumber=1&pageSize=10', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log(`عدد المتبرعين المؤهلين: ${data.data.totalCount}`);
      console.log('المتبرعون المؤهلون:', data.data.items);
    }
  })
  .catch(error => console.error('Error:', error));
```

**Python (Requests):**

```python
import requests

token = 'YOUR_JWT_TOKEN'
url = 'https://api.bloodconnect.com/api/donors/eligible'
params = {
    'pageNumber': 1,
    'pageSize': 10
}
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Bearer {token}'
}

response = requests.get(url, params=params, headers=headers)
data = response.json()

if data['success']:
    print(f"عدد المتبرعين المؤهلين: {data['data']['totalCount']}")
    for donor in data['data']['items']:
        print(f"- {donor['fullName']} ({donor['bloodType']['bloodTypeName']})")
```

---

**مثال Request (مع فلترة حسب فصيلة الدم):**

**cURL:**

```bash
curl -X GET "https://api.bloodconnect.com/api/donors/eligible?pageNumber=1&pageSize=20&bloodType=O%2B" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**JavaScript (Fetch):**

```javascript
const token = 'YOUR_JWT_TOKEN';
const bloodType = 'O+';
const params = new URLSearchParams({
  pageNumber: 1,
  pageSize: 20,
  bloodType: bloodType
});

fetch(`https://api.bloodconnect.com/api/donors/eligible?${params}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log(`عدد المتبرعين المؤهلين بفصيلة ${bloodType}: ${data.data.totalCount}`);
    }
  })
  .catch(error => console.error('Error:', error));
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم استرجاع قائمة المتبرعين المؤهلين بنجاح",
  "data": {
    "items": [
      {
        "donorID": 5,
        "fullName": "خالد عبدالله المطيري",
        "nationalID": "1122334455",
        "gender": 0,
        "dateOfBirth": "1995-03-10T00:00:00Z",
        "phone": "+966503456789",
        "bloodTypeID": 1,
        "city": "الرياض",
        "lastDonationDate": "2023-10-15T10:00:00Z",
        "isActive": true,
        "createdAt": "2023-01-20T10:00:00Z",
        "updatedAt": "2024-01-15T09:15:00Z",
        "bloodType": {
          "bloodTypeID": 1,
          "bloodTypeName": "O+"
        }
      },
      {
        "donorID": 12,
        "fullName": "سارة أحمد الغامدي",
        "nationalID": "2233445566",
        "gender": 1,
        "dateOfBirth": "1992-07-22T00:00:00Z",
        "phone": "+966504567890",
        "bloodTypeID": 1,
        "city": "جدة",
        "lastDonationDate": "2023-09-01T14:30:00Z",
        "isActive": true,
        "createdAt": "2023-03-10T10:00:00Z",
        "updatedAt": "2024-01-20T11:00:00Z",
        "bloodType": {
          "bloodTypeID": 1,
          "bloodTypeName": "O+"
        }
      },
      {
        "donorID": 18,
        "fullName": "عمر محمد الشهري",
        "nationalID": "3344556677",
        "gender": 0,
        "dateOfBirth": "1988-11-05T00:00:00Z",
        "phone": "+966505678901",
        "bloodTypeID": 1,
        "city": "الدمام",
        "lastDonationDate": null,
        "isActive": true,
        "createdAt": "2024-01-05T10:00:00Z",
        "updatedAt": "2024-01-05T10:00:00Z",
        "bloodType": {
          "bloodTypeID": 1,
          "bloodTypeName": "O+"
        }
      }
    ],
    "totalCount": 15,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 2,
    "hasPrevious": false,
    "hasNext": true
  },
  "errors": null
}
```

**شرح الاستجابة:**

- **items**: مصفوفة تحتوي على المتبرعين المؤهلين في الصفحة الحالية
- **totalCount**: إجمالي عدد المتبرعين المؤهلين (15 متبرع)
- **pageNumber**: رقم الصفحة الحالية (1)
- **pageSize**: عدد العناصر في كل صفحة (10)
- **totalPages**: إجمالي عدد الصفحات (2 صفحة)
- **hasPrevious**: هل توجد صفحة سابقة؟ (false)
- **hasNext**: هل توجد صفحة تالية؟ (true)

**ملاحظات على المتبرعين في المثال:**

1. **خالد عبدالله المطيري (ID: 5):**
   - آخر تبرع: 2023-10-15 (مر أكثر من 3 أشهر)
   - الجنس: ذكر (يحتاج 90 يوماً)
   - مؤهل للتبرع ✓

2. **سارة أحمد الغامدي (ID: 12):**
   - آخر تبرع: 2023-09-01 (مر أكثر من 4 أشهر)
   - الجنس: أنثى (تحتاج 120 يوماً)
   - مؤهلة للتبرع ✓

3. **عمر محمد الشهري (ID: 18):**
   - آخر تبرع: null (لم يتبرع من قبل)
   - متبرع جديد
   - مؤهل للتبرع ✓

---

**مثال Error Response (401 Unauthorized):**

عندما يكون JWT Token مفقوداً أو غير صالح:

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

---

**مثال Error Response (500 Internal Server Error):**

عند حدوث خطأ في الخادم:

```json
{
  "success": false,
  "message": "An error occurred while retrieving eligible donors",
  "data": null,
  "errors": [
    "Database connection failed"
  ]
}
```

---

**ملاحظات مهمة (Important Notes):**

1. **معايير الأهلية التلقائية:**
   - يتم تطبيق معايير الأهلية تلقائياً على مستوى الخادم
   - لا تحتاج لتطبيق فلترة إضافية في الواجهة الأمامية
   - النتائج تحتوي فقط على المتبرعين المؤهلين

2. **الفترة الزمنية بين التبرعات:**
   - **ذكور:** 90 يوماً (3 أشهر) كحد أدنى
   - **إناث:** 120 يوماً (4 أشهر) كحد أدنى
   - هذه الفترات قد تختلف حسب سياسات بنك الدم المحلية

3. **المتبرعون الجدد:**
   - المتبرعون الذين لم يتبرعوا من قبل (`lastDonationDate = null`) يظهرون في النتائج
   - يعتبرون مؤهلين تلقائياً إذا استوفوا باقي الشروط (العمر، الحالة النشطة)

4. **فلترة حسب فصيلة الدم:**
   - استخدم معامل `bloodType` لفلترة المتبرعين حسب فصيلة دم محددة
   - مفيد عند البحث عن متبرعين لطلب دم محدد
   - القيم الصالحة: "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"

5. **Pagination:**
   - استخدم Pagination دائماً للحصول على أداء أفضل
   - القيم الافتراضية: pageNumber=1, pageSize=10
   - الحد الأقصى لـ pageSize: 100

6. **حالة النشاط (isActive):**
   - فقط المتبرعون النشطون (`isActive = true`) يظهرون في النتائج
   - المتبرعون المعطلون لا يعتبرون مؤهلين حتى لو استوفوا باقي الشروط

7. **العمر:**
   - الحد الأدنى: 18 سنة
   - الحد الأقصى: 65 سنة
   - يتم حساب العمر من `dateOfBirth` مقارنة بالتاريخ الحالي

8. **نتائج الفحوصات:**
   - إذا كان للمتبرع تبرعات سابقة، يجب أن يكون آخر تبرع قد اجتاز الفحوصات
   - المتبرعون الذين فشلوا في الفحوصات الأخيرة لا يظهرون في النتائج

---

**حالات الاستخدام (Use Cases):**

**1. عرض المتبرعين المؤهلين في لوحة التحكم:**

```javascript
async function displayEligibleDonors() {
  try {
    const response = await fetch('/api/donors/eligible?pageNumber=1&pageSize=50', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const result = await response.json();
    
    if (result.success) {
      const donors = result.data.items;
      const totalCount = result.data.totalCount;
      
      console.log(`إجمالي المتبرعين المؤهلين: ${totalCount}`);
      
      // عرض المتبرعين في جدول
      donors.forEach(donor => {
        console.log(`${donor.fullName} - ${donor.bloodType.bloodTypeName} - ${donor.city}`);
      });
      
      return donors;
    }
  } catch (error) {
    console.error('خطأ في جلب المتبرعين المؤهلين:', error);
    return [];
  }
}
```

**2. البحث عن متبرعين مؤهلين لفصيلة دم محددة:**

```python
def find_eligible_donors_for_blood_request(blood_type, token):
    """البحث عن متبرعين مؤهلين لطلب دم محدد"""
    
    url = 'https://api.bloodconnect.com/api/donors/eligible'
    params = {
        'bloodType': blood_type,
        'pageSize': 100  # الحصول على أكبر عدد ممكن
    }
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    response = requests.get(url, params=params, headers=headers)
    
    if response.status_code == 200:
        result = response.json()
        if result['success']:
            donors = result['data']['items']
            total = result['data']['totalCount']
            
            print(f"وجدنا {total} متبرع مؤهل بفصيلة {blood_type}")
            
            # ترتيب حسب آخر تبرع (الأقدم أولاً)
            donors_sorted = sorted(
                donors,
                key=lambda d: d['lastDonationDate'] or '1900-01-01'
            )
            
            return donors_sorted
    
    return []

# استخدام
eligible_donors = find_eligible_donors_for_blood_request('O+', token)
for donor in eligible_donors[:5]:  # أول 5 متبرعين
    print(f"- {donor['fullName']}: {donor['phone']}")
```

**3. إحصائيات المتبرعين المؤهلين:**

```javascript
async function getEligibleDonorsStatistics() {
  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const statistics = {};
  
  for (const bloodType of bloodTypes) {
    try {
      const response = await fetch(
        `/api/donors/eligible?bloodType=${encodeURIComponent(bloodType)}&pageSize=1`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      const result = await response.json();
      
      if (result.success) {
        statistics[bloodType] = result.data.totalCount;
      }
    } catch (error) {
      console.error(`خطأ في جلب إحصائيات ${bloodType}:`, error);
      statistics[bloodType] = 0;
    }
  }
  
  // عرض الإحصائيات
  console.log('=== إحصائيات المتبرعين المؤهلين ===');
  for (const [bloodType, count] of Object.entries(statistics)) {
    console.log(`${bloodType}: ${count} متبرع`);
  }
  
  return statistics;
}

// استخدام
const stats = await getEligibleDonorsStatistics();
```

**4. إشعار المتبرعين المؤهلين:**

```csharp
public async Task<List<string>> GetEligibleDonorPhoneNumbers(string bloodType)
{
    var phoneNumbers = new List<string>();
    var pageNumber = 1;
    var hasMore = true;
    
    while (hasMore)
    {
        var url = $"/api/donors/eligible?bloodType={bloodType}&pageNumber={pageNumber}&pageSize=50";
        var response = await _httpClient.GetAsync(url);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<ServiceResponse<PagedResult<Donor>>>(content);
            
            if (result?.Success == true && result.Data?.Items != null)
            {
                // جمع أرقام الهواتف
                phoneNumbers.AddRange(
                    result.Data.Items.Select(d => d.Phone)
                );
                
                hasMore = result.Data.HasNext;
                pageNumber++;
            }
            else
            {
                hasMore = false;
            }
        }
        else
        {
            hasMore = false;
        }
    }
    
    Console.WriteLine($"تم جمع {phoneNumbers.Count} رقم هاتف لمتبرعين مؤهلين بفصيلة {bloodType}");
    return phoneNumbers;
}

// استخدام - إرسال رسائل SMS للمتبرعين المؤهلين
var phoneNumbers = await GetEligibleDonorPhoneNumbers("O+");
foreach (var phone in phoneNumbers)
{
    await SendSMS(phone, "نحتاج لتبرعك! يرجى زيارة بنك الدم في أقرب وقت.");
}
```

**5. مقارنة المتبرعين المؤهلين مع الطلبات العاجلة:**

```javascript
async function matchEligibleDonorsWithUrgentRequests() {
  try {
    // الحصول على الطلبات العاجلة
    const requestsResponse = await fetch('/api/bloodrequests/urgent', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const requestsResult = await requestsResponse.json();
    
    if (!requestsResult.success) {
      console.error('فشل في جلب الطلبات العاجلة');
      return;
    }
    
    const urgentRequests = requestsResult.data;
    
    // لكل طلب عاجل، البحث عن متبرعين مؤهلين
    for (const request of urgentRequests) {
      console.log(`\n=== طلب عاجل: ${request.bloodType} ===`);
      
      const donorsResponse = await fetch(
        `/api/donors/eligible?bloodType=${encodeURIComponent(request.bloodType)}&pageSize=10`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const donorsResult = await donorsResponse.json();
      
      if (donorsResult.success) {
        const eligibleCount = donorsResult.data.totalCount;
        console.log(`عدد المتبرعين المؤهلين: ${eligibleCount}`);
        
        if (eligibleCount > 0) {
          console.log('المتبرعون المتاحون:');
          donorsResult.data.items.forEach(donor => {
            console.log(`- ${donor.fullName} (${donor.phone})`);
          });
        } else {
          console.log('⚠️ تحذير: لا يوجد متبرعون مؤهلون لهذه الفصيلة!');
        }
      }
    }
  } catch (error) {
    console.error('خطأ في المطابقة:', error);
  }
}
```

---

**نصائح للمطورين (Developer Tips):**

1. **استخدام هذا الـ Endpoint للطلبات العاجلة:**
   - عند استلام طلب دم عاجل، استخدم هذا الـ endpoint للعثور على متبرعين مؤهلين بسرعة
   - فلتر حسب فصيلة الدم المطلوبة لتقليل النتائج

2. **التحديث الدوري:**
   - قم بتحديث قائمة المتبرعين المؤهلين بشكل دوري (مثلاً كل ساعة)
   - حالة الأهلية تتغير مع مرور الوقت

3. **التخزين المؤقت (Caching):**
   - يمكنك تخزين النتائج مؤقتاً لتحسين الأداء
   - لكن تأكد من تحديث الـ Cache بانتظام (مثلاً كل 30 دقيقة)

4. **إشعارات المتبرعين:**
   - استخدم هذا الـ endpoint للحصول على قائمة المتبرعين المؤهلين لإرسال إشعارات
   - يمكنك إرسال رسائل SMS أو بريد إلكتروني أو إشعارات push

5. **لوحة التحكم:**
   - اعرض عدد المتبرعين المؤهلين لكل فصيلة دم في لوحة التحكم
   - هذا يساعد في تخطيط حملات التبرع

6. **معالجة الحالات الخاصة:**
   - إذا كانت النتائج فارغة لفصيلة دم معينة، اعرض تحذيراً
   - اقترح على المستخدم البحث عن فصائل دم متوافقة (مثل O- للجميع)

---

#### GET /api/donors/by-bloodtype/{bloodType}

**الوصف (Description):**

الحصول على قائمة المتبرعين حسب فصيلة دم محددة. يتيح هذا الـ endpoint للمطورين البحث عن جميع المتبرعين الذين لديهم فصيلة دم معينة، بغض النظر عن حالة أهليتهم للتبرع. هذا مفيد للحصول على قائمة شاملة بالمتبرعين لفصيلة دم محددة لأغراض التواصل أو التخطيط.

**HTTP Method:** `GET`

**URL:** `/api/donors/by-bloodtype/{bloodType}`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Path Parameters (معاملات المسار):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `bloodType` | string | Yes | فصيلة الدم المطلوبة (مثل: "O+", "A-", "B+", "AB-") |

**القيم الصالحة لـ bloodType:**
- `O+` - O موجب
- `O-` - O سالب
- `A+` - A موجب
- `A-` - A سالب
- `B+` - B موجب
- `B-` - B سالب
- `AB+` - AB موجب
- `AB-` - AB سالب

---

**Query Parameters (معاملات الاستعلام):**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pageNumber` | integer | No | 1 | رقم الصفحة المطلوبة (يبدأ من 1) |
| `pageSize` | integer | No | 10 | عدد العناصر في كل صفحة (الحد الأقصى: 100) |

---

**Response Structure (بنية الاستجابة):**

الاستجابة تتبع بنية `ServiceResponse<PagedResult<Donor>>` الموحدة:

```json
{
  "success": true,
  "message": "string",
  "data": {
    "items": [
      {
        "id": 0,
        "userId": 0,
        "firstName": "string",
        "lastName": "string",
        "dateOfBirth": "2024-01-01T00:00:00Z",
        "gender": 0,
        "bloodType": "string",
        "phoneNumber": "string",
        "email": "string",
        "address": "string",
        "city": "string",
        "lastDonationDate": "2024-01-01T00:00:00Z",
        "isEligible": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pageNumber": 0,
    "pageSize": 0,
    "totalPages": 0,
    "totalCount": 0
  },
  "errors": null
}
```

---

**Status Codes (أكواد الحالة):**

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | تم استرجاع قائمة المتبرعين بنجاح |
| 400 | Bad Request | فصيلة الدم المدخلة غير صالحة |
| 401 | Unauthorized | JWT Token مفقود أو غير صالح |
| 404 | Not Found | لا يوجد متبرعون بفصيلة الدم المحددة |
| 500 | Internal Server Error | خطأ في الخادم أثناء معالجة الطلب |

---

**مثال Request (طلب بسيط):**

**cURL:**

```bash
curl -X GET "https://api.bloodconnect.com/api/donors/by-bloodtype/O%2B?pageNumber=1&pageSize=10" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**ملاحظة:** يجب ترميز `+` في URL إلى `%2B` (مثل: `O+` تصبح `O%2B`)

**JavaScript (Fetch):**

```javascript
const token = 'YOUR_JWT_TOKEN';
const bloodType = 'O+';

fetch(`https://api.bloodconnect.com/api/donors/by-bloodtype/${encodeURIComponent(bloodType)}?pageNumber=1&pageSize=10`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log(`عدد المتبرعين بفصيلة ${bloodType}: ${data.data.totalCount}`);
      console.log('المتبرعون:', data.data.items);
    }
  })
  .catch(error => console.error('Error:', error));
```

**Python (Requests):**

```python
import requests
from urllib.parse import quote

token = 'YOUR_JWT_TOKEN'
blood_type = 'O+'
url = f'https://api.bloodconnect.com/api/donors/by-bloodtype/{quote(blood_type)}'
params = {
    'pageNumber': 1,
    'pageSize': 10
}
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Bearer {token}'
}

response = requests.get(url, params=params, headers=headers)
data = response.json()

if data['success']:
    print(f"عدد المتبرعين بفصيلة {blood_type}: {data['data']['totalCount']}")
    for donor in data['data']['items']:
        print(f"- {donor['firstName']} {donor['lastName']} ({donor['phoneNumber']})")
```

**C# (.NET):**

```csharp
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;

public async Task<string> GetDonorsByBloodType(string bloodType, string token)
{
    var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    
    var encodedBloodType = HttpUtility.UrlEncode(bloodType);
    var url = $"https://api.bloodconnect.com/api/donors/by-bloodtype/{encodedBloodType}?pageNumber=1&pageSize=10";
    
    var response = await client.GetAsync(url);
    response.EnsureSuccessStatusCode();
    
    return await response.Content.ReadAsStringAsync();
}

// استخدام
var result = await GetDonorsByBloodType("O+", token);
Console.WriteLine(result);
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم استرجاع قائمة المتبرعين بفصيلة O+ بنجاح",
  "data": {
    "items": [
      {
        "id": 1,
        "userId": 2,
        "firstName": "Ahmed",
        "lastName": "Ali",
        "dateOfBirth": "1990-05-15T00:00:00Z",
        "gender": 0,
        "bloodType": "O+",
        "phoneNumber": "+966501234567",
        "email": "ahmed.ali@example.com",
        "address": "123 King Fahd Road",
        "city": "Riyadh",
        "lastDonationDate": "2024-01-01T00:00:00Z",
        "isEligible": true,
        "createdAt": "2023-12-01T10:00:00Z",
        "updatedAt": "2024-01-01T10:00:00Z"
      },
      {
        "id": 5,
        "userId": 8,
        "firstName": "Khalid",
        "lastName": "Mohammed",
        "dateOfBirth": "1985-08-20T00:00:00Z",
        "gender": 0,
        "bloodType": "O+",
        "phoneNumber": "+966502345678",
        "email": "khalid.m@example.com",
        "address": "456 Olaya Street",
        "city": "Jeddah",
        "lastDonationDate": "2023-11-15T00:00:00Z",
        "isEligible": false,
        "createdAt": "2023-10-15T10:00:00Z",
        "updatedAt": "2023-11-15T10:00:00Z"
      },
      {
        "id": 12,
        "userId": 15,
        "firstName": "Omar",
        "lastName": "Hassan",
        "dateOfBirth": "1995-03-10T00:00:00Z",
        "gender": 0,
        "bloodType": "O+",
        "phoneNumber": "+966503456789",
        "email": "omar.hassan@example.com",
        "address": "789 King Abdullah Road",
        "city": "Dammam",
        "lastDonationDate": null,
        "isEligible": true,
        "createdAt": "2024-01-10T10:00:00Z",
        "updatedAt": "2024-01-10T10:00:00Z"
      }
    ],
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 3,
    "totalCount": 28
  },
  "errors": null
}
```

**شرح الاستجابة:**

- **items**: مصفوفة تحتوي على جميع المتبرعين بفصيلة O+ في الصفحة الحالية
- **totalCount**: إجمالي عدد المتبرعين بفصيلة O+ (28 متبرع)
- **pageNumber**: رقم الصفحة الحالية (1)
- **pageSize**: عدد العناصر في كل صفحة (10)
- **totalPages**: إجمالي عدد الصفحات (3 صفحات)

**ملاحظات على المتبرعين في المثال:**

1. **Ahmed Ali (ID: 1):**
   - مؤهل للتبرع (`isEligible: true`)
   - آخر تبرع: 2024-01-01

2. **Khalid Mohammed (ID: 5):**
   - غير مؤهل للتبرع حالياً (`isEligible: false`)
   - آخر تبرع: 2023-11-15 (لم يمر الوقت الكافي)

3. **Omar Hassan (ID: 12):**
   - مؤهل للتبرع (`isEligible: true`)
   - متبرع جديد (لم يتبرع من قبل)

---

**مثال Error Response (400 Bad Request):**

عندما تكون فصيلة الدم المدخلة غير صالحة:

```json
{
  "success": false,
  "message": "Invalid blood type",
  "data": null,
  "errors": [
    "Blood type 'XYZ' is not valid. Valid values are: O+, O-, A+, A-, B+, B-, AB+, AB-"
  ]
}
```

---

**مثال Error Response (401 Unauthorized):**

عندما يكون JWT Token مفقوداً أو غير صالح:

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

---

**مثال Error Response (404 Not Found):**

عندما لا يوجد متبرعون بفصيلة الدم المحددة:

```json
{
  "success": false,
  "message": "No donors found with blood type AB-",
  "data": null,
  "errors": [
    "No donors registered with the specified blood type"
  ]
}
```

---

**مثال Error Response (500 Internal Server Error):**

عند حدوث خطأ في الخادم:

```json
{
  "success": false,
  "message": "An error occurred while retrieving donors",
  "data": null,
  "errors": [
    "Database connection failed"
  ]
}
```

---

**ملاحظات مهمة (Important Notes):**

1. **الفرق بين هذا الـ Endpoint و `/api/donors/eligible`:**
   - **`/api/donors/by-bloodtype/{bloodType}`**: يعرض **جميع** المتبرعين بفصيلة دم محددة (مؤهلين وغير مؤهلين)
   - **`/api/donors/eligible`**: يعرض فقط المتبرعين **المؤهلين** للتبرع حالياً
   - استخدم `/api/donors/by-bloodtype/{bloodType}` للحصول على قائمة شاملة
   - استخدم `/api/donors/eligible` مع فلتر `bloodType` للحصول على المتبرعين الجاهزين للتبرع فوراً

2. **ترميز URL (URL Encoding):**
   - يجب ترميز الرموز الخاصة في URL
   - `+` يجب أن يكون `%2B`
   - `-` لا يحتاج ترميز
   - استخدم دوال الترميز المناسبة في لغة البرمجة (`encodeURIComponent` في JavaScript، `quote` في Python، `HttpUtility.UrlEncode` في C#)

3. **حالة الأهلية (isEligible):**
   - النتائج تحتوي على حقل `isEligible` لكل متبرع
   - يمكنك فلترة النتائج في الواجهة الأمامية حسب الحاجة
   - `isEligible: true` = المتبرع مؤهل للتبرع حالياً
   - `isEligible: false` = المتبرع غير مؤهل حالياً (قد يكون بسبب فترة الانتظار أو أسباب صحية)

4. **Pagination:**
   - استخدم Pagination دائماً للحصول على أداء أفضل
   - القيم الافتراضية: pageNumber=1, pageSize=10
   - الحد الأقصى لـ pageSize: 100
   - استخدم `totalCount` لمعرفة إجمالي عدد المتبرعين

5. **فصائل الدم النادرة:**
   - بعض فصائل الدم نادرة (مثل AB-)
   - قد تحصل على نتائج قليلة أو فارغة لهذه الفصائل
   - تعامل مع حالة النتائج الفارغة بشكل مناسب في تطبيقك

6. **حساسية الأحرف (Case Sensitivity):**
   - فصيلة الدم حساسة لحالة الأحرف
   - استخدم الأحرف الكبيرة: `O+` وليس `o+`
   - `AB+` وليس `ab+` أو `Ab+`

7. **المتبرعون الجدد:**
   - المتبرعون الذين لم يتبرعوا من قبل (`lastDonationDate = null`) يظهرون في النتائج
   - عادة ما يكونون مؤهلين (`isEligible: true`) إذا استوفوا باقي الشروط

8. **البيانات الشخصية:**
   - النتائج تحتوي على معلومات شخصية (أرقام هواتف، عناوين)
   - تأكد من حماية هذه البيانات وعدم مشاركتها بشكل غير آمن
   - اتبع قوانين حماية البيانات (GDPR، إلخ)

---

**حالات الاستخدام (Use Cases):**

**1. عرض جميع المتبرعين بفصيلة دم محددة:**

```javascript
async function displayDonorsByBloodType(bloodType) {
  try {
    const response = await fetch(
      `/api/donors/by-bloodtype/${encodeURIComponent(bloodType)}?pageNumber=1&pageSize=50`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    const result = await response.json();
    
    if (result.success) {
      const donors = result.data.items;
      const totalCount = result.data.totalCount;
      
      console.log(`إجمالي المتبرعين بفصيلة ${bloodType}: ${totalCount}`);
      
      // تصنيف المتبرعين حسب الأهلية
      const eligible = donors.filter(d => d.isEligible);
      const notEligible = donors.filter(d => !d.isEligible);
      
      console.log(`- مؤهلون: ${eligible.length}`);
      console.log(`- غير مؤهلين: ${notEligible.length}`);
      
      return donors;
    }
  } catch (error) {
    console.error('خطأ في جلب المتبرعين:', error);
    return [];
  }
}

// استخدام
const donors = await displayDonorsByBloodType('O+');
```

**2. إحصائيات شاملة لجميع فصائل الدم:**

```python
def get_all_blood_types_statistics(token):
    """الحصول على إحصائيات شاملة لجميع فصائل الدم"""
    
    blood_types = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
    statistics = {}
    
    for blood_type in blood_types:
        try:
            url = f'https://api.bloodconnect.com/api/donors/by-bloodtype/{blood_type}'
            params = {'pageSize': 1}  # نحتاج فقط totalCount
            headers = {'Authorization': f'Bearer {token}'}
            
            response = requests.get(url, params=params, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                if result['success']:
                    total = result['data']['totalCount']
                    
                    # حساب المؤهلين وغير المؤهلين
                    # (نحتاج طلب آخر للحصول على جميع البيانات)
                    statistics[blood_type] = {
                        'total': total,
                        'eligible': 0,  # سيتم حسابه
                        'notEligible': 0  # سيتم حسابه
                    }
        except Exception as e:
            print(f"خطأ في جلب إحصائيات {blood_type}: {e}")
            statistics[blood_type] = {'total': 0, 'eligible': 0, 'notEligible': 0}
    
    # عرض الإحصائيات
    print('=== إحصائيات المتبرعين حسب فصيلة الدم ===')
    for blood_type, stats in statistics.items():
        print(f"{blood_type}: {stats['total']} متبرع")
    
    return statistics

# استخدام
stats = get_all_blood_types_statistics(token)
```

**3. البحث عن متبرعين لطلب دم محدد:**

```javascript
async function findDonorsForBloodRequest(requestBloodType) {
  // الحصول على جميع المتبرعين بفصيلة الدم المطلوبة
  const response = await fetch(
    `/api/donors/by-bloodtype/${encodeURIComponent(requestBloodType)}?pageSize=100`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  
  const result = await response.json();
  
  if (result.success) {
    const allDonors = result.data.items;
    
    // فلترة المتبرعين المؤهلين فقط
    const eligibleDonors = allDonors.filter(d => d.isEligible);
    
    // ترتيب حسب آخر تبرع (الأقدم أولاً)
    eligibleDonors.sort((a, b) => {
      const dateA = a.lastDonationDate ? new Date(a.lastDonationDate) : new Date(0);
      const dateB = b.lastDonationDate ? new Date(b.lastDonationDate) : new Date(0);
      return dateA - dateB;
    });
    
    console.log(`وجدنا ${eligibleDonors.length} متبرع مؤهل من أصل ${allDonors.length}`);
    
    return eligibleDonors;
  }
  
  return [];
}

// استخدام
const eligibleDonors = await findDonorsForBloodRequest('A+');
console.log('أفضل 5 متبرعين للتواصل معهم:');
eligibleDonors.slice(0, 5).forEach(donor => {
  console.log(`- ${donor.firstName} ${donor.lastName}: ${donor.phoneNumber}`);
});
```

**4. تصدير قائمة المتبرعين لفصيلة دم محددة:**

```csharp
public async Task<List<Donor>> ExportAllDonorsByBloodType(string bloodType)
{
    var allDonors = new List<Donor>();
    var pageNumber = 1;
    var hasMore = true;
    
    while (hasMore)
    {
        var url = $"/api/donors/by-bloodtype/{HttpUtility.UrlEncode(bloodType)}?pageNumber={pageNumber}&pageSize=100";
        var response = await _httpClient.GetAsync(url);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<ServiceResponse<PagedResult<Donor>>>(content);
            
            if (result?.Success == true && result.Data?.Items != null)
            {
                allDonors.AddRange(result.Data.Items);
                
                hasMore = pageNumber < result.Data.TotalPages;
                pageNumber++;
            }
            else
            {
                hasMore = false;
            }
        }
        else
        {
            hasMore = false;
        }
    }
    
    Console.WriteLine($"تم تصدير {allDonors.Count} متبرع بفصيلة {bloodType}");
    
    // حفظ في ملف CSV أو Excel
    await SaveToCsv(allDonors, $"donors_{bloodType}.csv");
    
    return allDonors;
}
```

**5. مقارنة فصائل الدم المختلفة:**

```javascript
async function compareBloodTypes() {
  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const comparison = [];
  
  for (const bloodType of bloodTypes) {
    try {
      const response = await fetch(
        `/api/donors/by-bloodtype/${encodeURIComponent(bloodType)}?pageSize=1`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      const result = await response.json();
      
      if (result.success) {
        comparison.push({
          bloodType: bloodType,
          totalDonors: result.data.totalCount
        });
      }
    } catch (error) {
      console.error(`خطأ في جلب ${bloodType}:`, error);
    }
  }
  
  // ترتيب حسب عدد المتبرعين (من الأكثر إلى الأقل)
  comparison.sort((a, b) => b.totalDonors - a.totalDonors);
  
  console.log('=== مقارنة فصائل الدم ===');
  comparison.forEach((item, index) => {
    console.log(`${index + 1}. ${item.bloodType}: ${item.totalDonors} متبرع`);
  });
  
  // تحديد الفصائل النادرة (أقل من 10 متبرعين)
  const rare = comparison.filter(item => item.totalDonors < 10);
  if (rare.length > 0) {
    console.log('\n⚠️ فصائل دم نادرة (تحتاج حملات تبرع):');
    rare.forEach(item => {
      console.log(`- ${item.bloodType}: ${item.totalDonors} متبرع فقط`);
    });
  }
  
  return comparison;
}

// استخدام
const comparison = await compareBloodTypes();
```

---

**نصائح للمطورين (Developer Tips):**

1. **استخدام الـ Endpoint المناسب:**
   - للحصول على قائمة شاملة: استخدم `/api/donors/by-bloodtype/{bloodType}`
   - للحصول على المتبرعين الجاهزين فوراً: استخدم `/api/donors/eligible` مع فلتر `bloodType`

2. **معالجة النتائج الفارغة:**
   - بعض فصائل الدم نادرة وقد لا يكون لديك متبرعون
   - اعرض رسالة مناسبة للمستخدم
   - اقترح البحث عن فصائل دم متوافقة

3. **التخزين المؤقت (Caching):**
   - يمكنك تخزين النتائج مؤقتاً لتحسين الأداء
   - تأكد من تحديث الـ Cache عند إضافة متبرعين جدد

4. **فلترة في الواجهة الأمامية:**
   - استخدم حقل `isEligible` لفلترة النتائج في الواجهة
   - يمكنك عرض المتبرعين المؤهلين أولاً، ثم غير المؤهلين

5. **التعامل مع Pagination:**
   - للحصول على جميع المتبرعين، استخدم حلقة تكرارية
   - اطلب صفحة واحدة في كل مرة حتى `hasNext = false`

6. **حماية البيانات الشخصية:**
   - لا تعرض أرقام الهواتف والعناوين للجميع
   - استخدم صلاحيات مناسبة للوصول إلى هذه البيانات

7. **معالجة الأخطاء:**
   - تعامل مع حالة 404 (لا يوجد متبرعون)
   - تعامل مع حالة 400 (فصيلة دم غير صالحة)
   - اعرض رسائل خطأ واضحة للمستخدم

---

### Patients Endpoints

#### GET /api/patients

**الوصف (Description):**

الحصول على قائمة جميع المرضى المسجلين في النظام مع دعم الترقيم (Pagination). يتيح هذا الـ endpoint للمطورين استرجاع بيانات المرضى بشكل منظم ومقسم على صفحات لتحسين الأداء وتجربة المستخدم.

**HTTP Method:** `GET`

**URL:** `/api/patients`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Query Parameters (معاملات الاستعلام):**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pageNumber` | integer | No | 1 | رقم الصفحة المطلوبة (يبدأ من 1) |
| `pageSize` | integer | No | 10 | عدد العناصر في كل صفحة (الحد الأقصى: 100) |

---

**Response Structure (بنية الاستجابة):**

الاستجابة تتبع بنية `ServiceResponse<PagedResult<Patient>>` الموحدة:

```json
{
  "success": true,
  "message": "string",
  "data": {
    "items": [
      {
        "id": 0,
        "firstName": "string",
        "lastName": "string",
        "dateOfBirth": "2024-01-01T00:00:00Z",
        "gender": 0,
        "bloodType": "string",
        "phoneNumber": "string",
        "email": "string",
        "address": "string",
        "city": "string",
        "medicalHistory": "string",
        "hospitalName": "string",
        "doctorName": "string",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "totalCount": 0,
    "pageNumber": 0,
    "pageSize": 0,
    "totalPages": 0,
    "hasPrevious": false,
    "hasNext": false
  },
  "errors": null
}
```

---

**Status Codes (أكواد الحالة):**

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | تم استرجاع قائمة المرضى بنجاح |
| 401 | Unauthorized | JWT Token مفقود أو غير صالح |
| 500 | Internal Server Error | خطأ في الخادم أثناء معالجة الطلب |

---

**مثال Request (طلب بسيط):**

**cURL:**

```bash
curl -X GET "https://api.bloodconnect.com/api/patients?pageNumber=1&pageSize=10" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**JavaScript (Fetch):**

```javascript
const token = 'YOUR_JWT_TOKEN';

fetch('https://api.bloodconnect.com/api/patients?pageNumber=1&pageSize=10', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Python (Requests):**

```python
import requests

token = 'YOUR_JWT_TOKEN'
url = 'https://api.bloodconnect.com/api/patients'
params = {
    'pageNumber': 1,
    'pageSize': 10
}
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Bearer {token}'
}

response = requests.get(url, params=params, headers=headers)
data = response.json()
print(data)
```

**C# (.NET):**

```csharp
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

public async Task<string> GetPatients(string token, int pageNumber = 1, int pageSize = 10)
{
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    
    var url = $"https://api.bloodconnect.com/api/patients?pageNumber={pageNumber}&pageSize={pageSize}";
    var response = await client.GetAsync(url);
    response.EnsureSuccessStatusCode();
    
    return await response.Content.ReadAsStringAsync();
}

// استخدام
var result = await GetPatients(token, 1, 10);
Console.WriteLine(result);
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم استرجاع قائمة المرضى بنجاح",
  "data": {
    "items": [
      {
        "id": 1,
        "firstName": "سارة",
        "lastName": "أحمد",
        "dateOfBirth": "1988-03-12T00:00:00Z",
        "gender": 1,
        "bloodType": "A+",
        "phoneNumber": "+966501234567",
        "email": "sara.ahmed@example.com",
        "address": "123 شارع الملك فهد",
        "city": "الرياض",
        "medicalHistory": "لا توجد أمراض مزمنة",
        "hospitalName": "مستشفى الملك فيصل التخصصي",
        "doctorName": "د. محمد العلي",
        "createdAt": "2023-12-01T10:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      },
      {
        "id": 2,
        "firstName": "خالد",
        "lastName": "محمد",
        "dateOfBirth": "1975-07-25T00:00:00Z",
        "gender": 0,
        "bloodType": "O+",
        "phoneNumber": "+966502345678",
        "email": "khaled.m@example.com",
        "address": "456 شارع العليا",
        "city": "جدة",
        "medicalHistory": "ضغط دم مرتفع، يتناول أدوية منتظمة",
        "hospitalName": "مستشفى الملك عبدالعزيز",
        "doctorName": "د. فاطمة حسن",
        "createdAt": "2023-11-15T10:00:00Z",
        "updatedAt": "2023-12-20T14:00:00Z"
      },
      {
        "id": 3,
        "firstName": "نورة",
        "lastName": "عبدالله",
        "dateOfBirth": "1992-11-08T00:00:00Z",
        "gender": 1,
        "bloodType": "B+",
        "phoneNumber": "+966503456789",
        "email": "noura.abdullah@example.com",
        "address": "789 شارع الأمير سلطان",
        "city": "الدمام",
        "medicalHistory": "حساسية من البنسلين",
        "hospitalName": "مستشفى الدمام المركزي",
        "doctorName": "د. عمر الشمري",
        "createdAt": "2024-01-05T10:00:00Z",
        "updatedAt": "2024-01-05T10:00:00Z"
      }
    ],
    "totalCount": 45,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 5,
    "hasPrevious": false,
    "hasNext": true
  },
  "errors": null
}
```

**شرح الاستجابة:**

- **items**: مصفوفة تحتوي على بيانات المرضى في الصفحة الحالية (3 مرضى في هذا المثال)
- **totalCount**: إجمالي عدد المرضى في النظام (45 مريض)
- **pageNumber**: رقم الصفحة الحالية (1)
- **pageSize**: عدد العناصر في كل صفحة (10)
- **totalPages**: إجمالي عدد الصفحات (5 صفحات)
- **hasPrevious**: هل توجد صفحة سابقة؟ (false لأننا في الصفحة الأولى)
- **hasNext**: هل توجد صفحة تالية؟ (true لأن هناك 4 صفحات أخرى)

---

**مثال Error Response (401 Unauthorized):**

عندما يكون JWT Token مفقوداً أو غير صالح:

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

---

**مثال Error Response (500 Internal Server Error):**

عند حدوث خطأ في الخادم:

```json
{
  "success": false,
  "message": "An error occurred while retrieving patients",
  "data": null,
  "errors": [
    "Database connection failed"
  ]
}
```

---

**ملاحظات مهمة (Important Notes):**

1. **Pagination (الترقيم):**
   - القيم الافتراضية: `pageNumber=1`, `pageSize=10`
   - الحد الأقصى لـ `pageSize`: 100 عنصر
   - استخدم `hasPrevious` و `hasNext` للتنقل بين الصفحات
   - استخدم `totalPages` لعرض عدد الصفحات الإجمالي

2. **البيانات الشخصية والطبية:**
   - النتائج تحتوي على معلومات شخصية حساسة (أرقام هواتف، عناوين، تاريخ طبي)
   - يجب حماية هذه البيانات وفقاً لقوانين حماية البيانات (GDPR، HIPAA، إلخ)
   - لا تشارك البيانات الطبية مع أطراف غير مصرح لها
   - استخدم HTTPS دائماً لنقل البيانات

3. **Gender Enum:**
   - `0` = Male (ذكر)
   - `1` = Female (أنثى)
   - `2` = Other (آخر)

4. **فصائل الدم (Blood Types):**
   - القيم الصالحة: `O+`, `O-`, `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`
   - يتم تخزينها كنص (string) في قاعدة البيانات

5. **التاريخ الطبي (Medical History):**
   - حقل نصي حر يحتوي على معلومات طبية مهمة
   - قد يكون فارغاً أو يحتوي على "لا توجد أمراض مزمنة"
   - يجب مراجعته بعناية عند التعامل مع طلبات الدم

6. **معلومات المستشفى والطبيب:**
   - `hospitalName`: اسم المستشفى الذي يتابع فيه المريض
   - `doctorName`: اسم الطبيب المعالج
   - هذه المعلومات مهمة للتواصل في حالات الطوارئ

7. **الأداء (Performance):**
   - استخدم `pageSize` مناسب (10-50) لتحسين الأداء
   - لا تطلب جميع المرضى دفعة واحدة (تجنب `pageSize=1000`)
   - استخدم Pagination للتنقل بين الصفحات

8. **التواريخ (Dates):**
   - جميع التواريخ بصيغة ISO 8601: `YYYY-MM-DDTHH:mm:ssZ`
   - `dateOfBirth`: تاريخ الميلاد
   - `createdAt`: تاريخ إنشاء السجل
   - `updatedAt`: تاريخ آخر تحديث

---

**حالات الاستخدام (Use Cases):**

**1. عرض قائمة المرضى مع Pagination:**

```javascript
async function displayPatients(pageNumber = 1, pageSize = 10) {
  try {
    const response = await fetch(
      `https://api.bloodconnect.com/api/patients?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    const result = await response.json();
    
    if (result.success) {
      const { items, totalCount, pageNumber, totalPages, hasPrevious, hasNext } = result.data;
      
      console.log(`عرض ${items.length} مريض من أصل ${totalCount}`);
      console.log(`الصفحة ${pageNumber} من ${totalPages}`);
      
      items.forEach(patient => {
        console.log(`${patient.firstName} ${patient.lastName} - ${patient.bloodType}`);
      });
      
      // أزرار التنقل
      if (hasPrevious) {
        console.log('← الصفحة السابقة متاحة');
      }
      if (hasNext) {
        console.log('الصفحة التالية متاحة →');
      }
      
      return result.data;
    }
  } catch (error) {
    console.error('خطأ في جلب المرضى:', error);
    return null;
  }
}

// استخدام
await displayPatients(1, 20);
```

**2. الحصول على جميع المرضى (All Pages):**

```python
def get_all_patients(token):
    """الحصول على جميع المرضى من جميع الصفحات"""
    
    all_patients = []
    page_number = 1
    has_next = True
    
    while has_next:
        try:
            url = 'https://api.bloodconnect.com/api/patients'
            params = {'pageNumber': page_number, 'pageSize': 100}
            headers = {'Authorization': f'Bearer {token}'}
            
            response = requests.get(url, params=params, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                if result['success']:
                    data = result['data']
                    all_patients.extend(data['items'])
                    
                    has_next = data['hasNext']
                    page_number += 1
                    
                    print(f"تم جلب الصفحة {data['pageNumber']} من {data['totalPages']}")
                else:
                    has_next = False
            else:
                has_next = False
                
        except Exception as e:
            print(f"خطأ في جلب الصفحة {page_number}: {e}")
            has_next = False
    
    print(f"إجمالي المرضى المسترجعين: {len(all_patients)}")
    return all_patients

# استخدام
patients = get_all_patients(token)
```

**3. إحصائيات المرضى حسب فصيلة الدم:**

```javascript
async function getPatientsStatisticsByBloodType() {
  // الحصول على جميع المرضى
  let allPatients = [];
  let pageNumber = 1;
  let hasNext = true;
  
  while (hasNext) {
    const response = await fetch(
      `https://api.bloodconnect.com/api/patients?pageNumber=${pageNumber}&pageSize=100`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    const result = await response.json();
    
    if (result.success) {
      allPatients = allPatients.concat(result.data.items);
      hasNext = result.data.hasNext;
      pageNumber++;
    } else {
      hasNext = false;
    }
  }
  
  // تجميع الإحصائيات
  const statistics = {};
  
  allPatients.forEach(patient => {
    const bloodType = patient.bloodType;
    if (!statistics[bloodType]) {
      statistics[bloodType] = 0;
    }
    statistics[bloodType]++;
  });
  
  // عرض الإحصائيات
  console.log('=== إحصائيات المرضى حسب فصيلة الدم ===');
  Object.entries(statistics)
    .sort((a, b) => b[1] - a[1])
    .forEach(([bloodType, count]) => {
      console.log(`${bloodType}: ${count} مريض`);
    });
  
  return statistics;
}

// استخدام
const stats = await getPatientsStatisticsByBloodType();
```

**4. تصدير قائمة المرضى إلى CSV:**

```csharp
public async Task<List<Patient>> ExportAllPatients(string token)
{
    var allPatients = new List<Patient>();
    var pageNumber = 1;
    var hasNext = true;
    
    while (hasNext)
    {
        var url = $"https://api.bloodconnect.com/api/patients?pageNumber={pageNumber}&pageSize=100";
        
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        
        var response = await _httpClient.SendAsync(request);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<ServiceResponse<PagedResult<Patient>>>(content);
            
            if (result?.Success == true && result.Data?.Items != null)
            {
                allPatients.AddRange(result.Data.Items);
                hasNext = result.Data.HasNext;
                pageNumber++;
                
                Console.WriteLine($"تم جلب الصفحة {result.Data.PageNumber} من {result.Data.TotalPages}");
            }
            else
            {
                hasNext = false;
            }
        }
        else
        {
            hasNext = false;
        }
    }
    
    Console.WriteLine($"إجمالي المرضى: {allPatients.Count}");
    
    // حفظ في ملف CSV
    await SavePatientsToCsv(allPatients, "patients_export.csv");
    
    return allPatients;
}

private async Task SavePatientsToCsv(List<Patient> patients, string filename)
{
    var csv = new StringBuilder();
    csv.AppendLine("ID,الاسم الأول,الاسم الأخير,تاريخ الميلاد,الجنس,فصيلة الدم,رقم الهاتف,البريد الإلكتروني,المدينة,المستشفى,الطبيب");
    
    foreach (var patient in patients)
    {
        csv.AppendLine($"{patient.Id},{patient.FirstName},{patient.LastName},{patient.DateOfBirth:yyyy-MM-dd},{patient.Gender},{patient.BloodType},{patient.PhoneNumber},{patient.Email},{patient.City},{patient.HospitalName},{patient.DoctorName}");
    }
    
    await File.WriteAllTextAsync(filename, csv.ToString());
    Console.WriteLine($"تم حفظ البيانات في {filename}");
}
```

**5. البحث عن مرضى في مدينة معينة:**

```javascript
async function findPatientsByCity(cityName) {
  let matchingPatients = [];
  let pageNumber = 1;
  let hasNext = true;
  
  while (hasNext) {
    const response = await fetch(
      `https://api.bloodconnect.com/api/patients?pageNumber=${pageNumber}&pageSize=100`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    const result = await response.json();
    
    if (result.success) {
      // فلترة المرضى حسب المدينة
      const cityPatients = result.data.items.filter(
        patient => patient.city.toLowerCase() === cityName.toLowerCase()
      );
      
      matchingPatients = matchingPatients.concat(cityPatients);
      hasNext = result.data.hasNext;
      pageNumber++;
    } else {
      hasNext = false;
    }
  }
  
  console.log(`وجدنا ${matchingPatients.length} مريض في ${cityName}`);
  return matchingPatients;
}

// استخدام
const riyadhPatients = await findPatientsByCity('الرياض');
```

---

**نصائح للمطورين (Developer Tips):**

1. **استخدام Pagination بكفاءة:**
   - ابدأ بـ `pageSize` صغير (10-20) للصفحة الأولى
   - استخدم `pageSize` أكبر (50-100) عند تصدير البيانات
   - لا تطلب جميع البيانات دفعة واحدة

2. **التخزين المؤقت (Caching):**
   - خزن النتائج مؤقتاً لتقليل الطلبات
   - حدث الـ Cache عند إضافة أو تعديل مرضى
   - استخدم مدة صلاحية مناسبة (5-10 دقائق)

3. **معالجة الأخطاء:**
   - تعامل مع حالة 401 (Token منتهي الصلاحية)
   - تعامل مع حالة 500 (خطأ في الخادم)
   - اعرض رسائل خطأ واضحة للمستخدم

4. **حماية البيانات:**
   - لا تعرض البيانات الطبية للجميع
   - استخدم صلاحيات مناسبة للوصول
   - سجل عمليات الوصول للبيانات الحساسة

5. **واجهة المستخدم:**
   - اعرض مؤشر تحميل أثناء جلب البيانات
   - أضف أزرار "السابق" و "التالي" للتنقل
   - اعرض رقم الصفحة الحالية وإجمالي الصفحات

6. **الأداء:**
   - استخدم Lazy Loading لتحميل الصفحات عند الحاجة
   - لا تحمل جميع الصفحات مرة واحدة
   - استخدم Virtual Scrolling للقوائم الطويلة

---

#### GET /api/patients/{id}

**الوصف (Description):**

الحصول على بيانات مريض محدد باستخدام معرفه الفريد (ID). يتيح هذا الـ endpoint للمطورين استرجاع جميع التفاصيل الخاصة بمريض واحد، بما في ذلك المعلومات الشخصية والطبية.

**HTTP Method:** `GET`

**URL:** `/api/patients/{id}`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Path Parameters (معاملات المسار):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | المعرف الفريد للمريض (Patient ID) |

---

**Response Structure (بنية الاستجابة):**

الاستجابة تتبع بنية `ServiceResponse<Patient>` الموحدة:

```json
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "firstName": "string",
    "lastName": "string",
    "dateOfBirth": "2024-01-01T00:00:00Z",
    "gender": 0,
    "bloodType": "string",
    "phoneNumber": "string",
    "email": "string",
    "address": "string",
    "city": "string",
    "medicalHistory": "string",
    "hospitalName": "string",
    "doctorName": "string",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "errors": null
}
```

---

**Status Codes (أكواد الحالة):**

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | تم استرجاع بيانات المريض بنجاح |
| 401 | Unauthorized | JWT Token مفقود أو غير صالح |
| 404 | Not Found | المريض غير موجود (ID غير صحيح) |
| 500 | Internal Server Error | خطأ في الخادم أثناء معالجة الطلب |

---

**مثال Request (طلب بسيط):**

**cURL:**

```bash
curl -X GET "https://api.bloodconnect.com/api/patients/1" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**JavaScript (Fetch):**

```javascript
const token = 'YOUR_JWT_TOKEN';
const patientId = 1;

fetch(`https://api.bloodconnect.com/api/patients/${patientId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Python (Requests):**

```python
import requests

token = 'YOUR_JWT_TOKEN'
patient_id = 1
url = f'https://api.bloodconnect.com/api/patients/{patient_id}'
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Bearer {token}'
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)
```

**C# (.NET):**

```csharp
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

public async Task<string> GetPatientById(string token, int patientId)
{
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    
    var url = $"https://api.bloodconnect.com/api/patients/{patientId}";
    var response = await client.GetAsync(url);
    response.EnsureSuccessStatusCode();
    
    return await response.Content.ReadAsStringAsync();
}

// استخدام
var result = await GetPatientById(token, 1);
Console.WriteLine(result);
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم استرجاع بيانات المريض بنجاح",
  "data": {
    "id": 1,
    "firstName": "سارة",
    "lastName": "أحمد",
    "dateOfBirth": "1988-03-12T00:00:00Z",
    "gender": 1,
    "bloodType": "A+",
    "phoneNumber": "+966501234567",
    "email": "sara.ahmed@example.com",
    "address": "123 شارع الملك فهد",
    "city": "الرياض",
    "medicalHistory": "لا توجد أمراض مزمنة",
    "hospitalName": "مستشفى الملك فيصل التخصصي",
    "doctorName": "د. محمد العلي",
    "createdAt": "2023-12-01T10:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "errors": null
}
```

**شرح الاستجابة:**

- **id**: المعرف الفريد للمريض (1)
- **firstName**: الاسم الأول (سارة)
- **lastName**: الاسم الأخير (أحمد)
- **dateOfBirth**: تاريخ الميلاد بصيغة ISO 8601
- **gender**: الجنس (1 = Female)
- **bloodType**: فصيلة الدم (A+)
- **phoneNumber**: رقم الهاتف مع رمز الدولة
- **email**: البريد الإلكتروني
- **address**: العنوان الكامل
- **city**: المدينة
- **medicalHistory**: التاريخ الطبي (معلومات حساسة)
- **hospitalName**: اسم المستشفى الذي يتابع فيه المريض
- **doctorName**: اسم الطبيب المعالج
- **createdAt**: تاريخ إنشاء السجل
- **updatedAt**: تاريخ آخر تحديث

---

**مثال Error Response (401 Unauthorized):**

عندما يكون JWT Token مفقوداً أو غير صالح:

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

---

**مثال Error Response (404 Not Found):**

عندما يكون المريض غير موجود (ID غير صحيح):

```json
{
  "success": false,
  "message": "Patient not found",
  "data": null,
  "errors": [
    "No patient found with ID: 999"
  ]
}
```

---

**مثال Error Response (500 Internal Server Error):**

عند حدوث خطأ في الخادم:

```json
{
  "success": false,
  "message": "An error occurred while retrieving patient",
  "data": null,
  "errors": [
    "Database connection failed"
  ]
}
```

---

**ملاحظات مهمة (Important Notes):**

1. **معرف المريض (Patient ID):**
   - يجب أن يكون ID رقماً صحيحاً موجباً (integer > 0)
   - إذا كان ID غير موجود، ستحصل على خطأ 404
   - لا يمكن استخدام قيم سالبة أو نصية

2. **البيانات الشخصية والطبية:**
   - الاستجابة تحتوي على معلومات شخصية حساسة جداً
   - **medicalHistory** يحتوي على معلومات طبية سرية
   - يجب حماية هذه البيانات وفقاً لقوانين حماية البيانات (GDPR، HIPAA، إلخ)
   - لا تشارك البيانات الطبية مع أطراف غير مصرح لها
   - استخدم HTTPS دائماً لنقل البيانات

3. **Gender Enum:**
   - `0` = Male (ذكر)
   - `1` = Female (أنثى)
   - `2` = Other (آخر)

4. **فصائل الدم (Blood Types):**
   - القيم الصالحة: `O+`, `O-`, `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`
   - يتم تخزينها كنص (string) في قاعدة البيانات

5. **معلومات المستشفى والطبيب:**
   - **hospitalName**: اسم المستشفى الذي يتابع فيه المريض
   - **doctorName**: اسم الطبيب المعالج
   - هذه المعلومات مهمة جداً للتواصل في حالات الطوارئ
   - يجب التحقق من صحة هذه المعلومات بانتظام

6. **التواريخ (Dates):**
   - جميع التواريخ بصيغة ISO 8601: `YYYY-MM-DDTHH:mm:ssZ`
   - **dateOfBirth**: تاريخ الميلاد (يُستخدم لحساب العمر)
   - **createdAt**: تاريخ إنشاء السجل في النظام
   - **updatedAt**: تاريخ آخر تحديث للسجل

7. **الأمان والصلاحيات:**
   - يتطلب هذا الـ endpoint مصادقة (JWT Token)
   - تأكد من أن المستخدم لديه صلاحية الوصول لبيانات المرضى
   - سجل جميع عمليات الوصول للبيانات الطبية للمراجعة

8. **الأداء:**
   - هذا الـ endpoint سريع لأنه يسترجع سجل واحد فقط
   - استخدم التخزين المؤقت (Caching) لتقليل الطلبات المتكررة
   - لا تطلب نفس المريض عدة مرات في فترة قصيرة

---

**حالات الاستخدام (Use Cases):**

**1. عرض تفاصيل مريض محدد:**

```javascript
async function displayPatientDetails(patientId) {
  try {
    const response = await fetch(
      `https://api.bloodconnect.com/api/patients/${patientId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    const result = await response.json();
    
    if (result.success) {
      const patient = result.data;
      
      console.log('=== معلومات المريض ===');
      console.log(`الاسم: ${patient.firstName} ${patient.lastName}`);
      console.log(`فصيلة الدم: ${patient.bloodType}`);
      console.log(`رقم الهاتف: ${patient.phoneNumber}`);
      console.log(`البريد الإلكتروني: ${patient.email}`);
      console.log(`المدينة: ${patient.city}`);
      console.log(`المستشفى: ${patient.hospitalName}`);
      console.log(`الطبيب: ${patient.doctorName}`);
      console.log(`التاريخ الطبي: ${patient.medicalHistory}`);
      
      return patient;
    } else {
      console.error('خطأ:', result.message);
      return null;
    }
  } catch (error) {
    console.error('خطأ في جلب بيانات المريض:', error);
    return null;
  }
}

// استخدام
const patient = await displayPatientDetails(1);
```

**2. التحقق من وجود مريض:**

```python
def check_patient_exists(token, patient_id):
    """التحقق من وجود مريض في النظام"""
    
    url = f'https://api.bloodconnect.com/api/patients/{patient_id}'
    headers = {'Authorization': f'Bearer {token}'}
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                print(f"المريض موجود: {result['data']['firstName']} {result['data']['lastName']}")
                return True
        elif response.status_code == 404:
            print(f"المريض غير موجود (ID: {patient_id})")
            return False
        else:
            print(f"خطأ: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"خطأ في الاتصال: {e}")
        return False

# استخدام
exists = check_patient_exists(token, 1)
```

**3. الحصول على معلومات الاتصال بالمريض:**

```javascript
async function getPatientContactInfo(patientId) {
  try {
    const response = await fetch(
      `https://api.bloodconnect.com/api/patients/${patientId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const result = await response.json();
    
    if (result.success) {
      const patient = result.data;
      
      return {
        name: `${patient.firstName} ${patient.lastName}`,
        phone: patient.phoneNumber,
        email: patient.email,
        address: patient.address,
        city: patient.city,
        hospital: patient.hospitalName,
        doctor: patient.doctorName
      };
    }
    
    return null;
  } catch (error) {
    console.error('خطأ:', error);
    return null;
  }
}

// استخدام
const contactInfo = await getPatientContactInfo(1);
console.log('معلومات الاتصال:', contactInfo);
```

**4. مقارنة بيانات مريضين:**

```csharp
public async Task<bool> ComparePatients(string token, int patientId1, int patientId2)
{
    var patient1 = await GetPatientById(token, patientId1);
    var patient2 = await GetPatientById(token, patientId2);
    
    if (patient1 == null || patient2 == null)
    {
        Console.WriteLine("أحد المرضى غير موجود");
        return false;
    }
    
    var p1 = JsonSerializer.Deserialize<ServiceResponse<Patient>>(patient1);
    var p2 = JsonSerializer.Deserialize<ServiceResponse<Patient>>(patient2);
    
    if (p1?.Success == true && p2?.Success == true)
    {
        Console.WriteLine("=== مقارنة المرضى ===");
        Console.WriteLine($"المريض 1: {p1.Data.FirstName} {p1.Data.LastName} - {p1.Data.BloodType}");
        Console.WriteLine($"المريض 2: {p2.Data.FirstName} {p2.Data.LastName} - {p2.Data.BloodType}");
        
        if (p1.Data.BloodType == p2.Data.BloodType)
        {
            Console.WriteLine("✓ نفس فصيلة الدم");
        }
        else
        {
            Console.WriteLine("✗ فصائل دم مختلفة");
        }
        
        if (p1.Data.City == p2.Data.City)
        {
            Console.WriteLine("✓ نفس المدينة");
        }
        else
        {
            Console.WriteLine("✗ مدن مختلفة");
        }
        
        return true;
    }
    
    return false;
}
```

**5. إنشاء ملف تعريف للمريض (Patient Profile):**

```javascript
async function createPatientProfile(patientId) {
  try {
    const response = await fetch(
      `https://api.bloodconnect.com/api/patients/${patientId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const result = await response.json();
    
    if (result.success) {
      const patient = result.data;
      
      // حساب العمر
      const birthDate = new Date(patient.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      // تحديد الجنس
      const genderMap = { 0: 'ذكر', 1: 'أنثى', 2: 'آخر' };
      const genderText = genderMap[patient.gender] || 'غير محدد';
      
      // إنشاء الملف التعريفي
      const profile = {
        personalInfo: {
          fullName: `${patient.firstName} ${patient.lastName}`,
          age: age,
          gender: genderText,
          dateOfBirth: patient.dateOfBirth
        },
        medicalInfo: {
          bloodType: patient.bloodType,
          medicalHistory: patient.medicalHistory,
          hospital: patient.hospitalName,
          doctor: patient.doctorName
        },
        contactInfo: {
          phone: patient.phoneNumber,
          email: patient.email,
          address: patient.address,
          city: patient.city
        },
        systemInfo: {
          patientId: patient.id,
          createdAt: patient.createdAt,
          updatedAt: patient.updatedAt
        }
      };
      
      console.log('=== الملف التعريفي للمريض ===');
      console.log(JSON.stringify(profile, null, 2));
      
      return profile;
    }
    
    return null;
  } catch (error) {
    console.error('خطأ في إنشاء الملف التعريفي:', error);
    return null;
  }
}

// استخدام
const profile = await createPatientProfile(1);
```

**6. معالجة الأخطاء بشكل شامل:**

```python
def get_patient_with_error_handling(token, patient_id):
    """الحصول على بيانات مريض مع معالجة شاملة للأخطاء"""
    
    url = f'https://api.bloodconnect.com/api/patients/{patient_id}'
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                print(f"✓ تم جلب بيانات المريض بنجاح")
                return result['data']
            else:
                print(f"✗ فشل الطلب: {result['message']}")
                return None
                
        elif response.status_code == 401:
            print("✗ خطأ في المصادقة: Token غير صالح أو منتهي الصلاحية")
            print("الحل: قم بتسجيل الدخول مرة أخرى للحصول على Token جديد")
            return None
            
        elif response.status_code == 404:
            print(f"✗ المريض غير موجود (ID: {patient_id})")
            print("الحل: تحقق من صحة معرف المريض")
            return None
            
        elif response.status_code == 500:
            print("✗ خطأ في الخادم")
            print("الحل: حاول مرة أخرى بعد قليل أو تواصل مع الدعم الفني")
            return None
            
        else:
            print(f"✗ خطأ غير متوقع: {response.status_code}")
            return None
            
    except requests.exceptions.Timeout:
        print("✗ انتهت مهلة الاتصال")
        print("الحل: تحقق من اتصالك بالإنترنت وحاول مرة أخرى")
        return None
        
    except requests.exceptions.ConnectionError:
        print("✗ فشل الاتصال بالخادم")
        print("الحل: تحقق من اتصالك بالإنترنت وعنوان API")
        return None
        
    except Exception as e:
        print(f"✗ خطأ غير متوقع: {e}")
        return None

# استخدام
patient = get_patient_with_error_handling(token, 1)
if patient:
    print(f"المريض: {patient['firstName']} {patient['lastName']}")
```

---

**نصائح للمطورين (Developer Tips):**

1. **التحقق من صحة ID:**
   - تحقق من أن ID رقم صحيح موجب قبل إرسال الطلب
   - اعرض رسالة خطأ واضحة إذا كان ID غير صالح
   - لا ترسل طلبات بقيم سالبة أو نصية

2. **التخزين المؤقت (Caching):**
   - خزن بيانات المريض مؤقتاً لتقليل الطلبات
   - حدث الـ Cache عند تعديل بيانات المريض
   - استخدم مدة صلاحية مناسبة (5-10 دقائق)

3. **معالجة الأخطاء:**
   - تعامل مع جميع أكواد الحالة (200، 401، 404، 500)
   - اعرض رسائل خطأ واضحة ومفيدة للمستخدم
   - سجل الأخطاء للمراجعة والتحليل

4. **حماية البيانات:**
   - لا تعرض البيانات الطبية للجميع
   - استخدم صلاحيات مناسبة للوصول
   - سجل عمليات الوصول للبيانات الحساسة
   - استخدم HTTPS دائماً

5. **واجهة المستخدم:**
   - اعرض مؤشر تحميل أثناء جلب البيانات
   - اعرض رسالة واضحة إذا لم يتم العثور على المريض
   - نظم عرض البيانات بشكل منطقي ومرتب

6. **الأداء:**
   - استخدم Lazy Loading لتحميل البيانات عند الحاجة
   - لا تطلب نفس المريض عدة مرات في فترة قصيرة
   - استخدم التخزين المؤقت بذكاء

7. **الاختبار:**
   - اختبر مع IDs موجودة وغير موجودة
   - اختبر مع Token صالح وغير صالح
   - اختبر معالجة الأخطاء المختلفة

8. **التوثيق:**
   - وثق كيفية استخدام هذا الـ endpoint في تطبيقك
   - اشرح للمستخدمين كيفية الوصول لتفاصيل المريض
   - وضح الصلاحيات المطلوبة

---

#### POST /api/patients

**الوصف (Description):**

إنشاء مريض جديد في النظام. يتيح هذا الـ endpoint تسجيل بيانات مريض جديد بما في ذلك المعلومات الشخصية وفصيلة الدم.

**HTTP Method:** `POST`

**URL:** `/api/patients`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Request Body (جسم الطلب):**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `fullName` | string | Yes | الاسم الكامل للمريض | الحد الأقصى: 100 حرف |
| `nationalID` | string | Yes | الرقم الوطني | الحد الأقصى: 20 حرف |
| `gender` | integer | Yes | الجنس (0=أنثى، 1=ذكر) | 0 أو 1 |
| `dateOfBirth` | string | Yes | تاريخ الميلاد (ISO 8601) | صيغة: YYYY-MM-DD |
| `phone` | string | Yes | رقم الهاتف | الحد الأقصى: 15 رقم |
| `city` | string | Yes | المدينة | الحد الأقصى: 50 حرف |
| `bloodTypeID` | integer | Yes | معرف فصيلة الدم | 1-8 |

**Blood Type IDs (معرفات فصائل الدم):**

| ID | Blood Type |
|----|------------|
| 1 | O+ |
| 2 | O- |
| 3 | A+ |
| 4 | A- |
| 5 | B+ |
| 6 | B- |
| 7 | AB+ |
| 8 | AB- |

---

**Response Structure (بنية الاستجابة):**

الاستجابة تتبع بنية `ServiceResponse<Patient>` الموحدة:

```json
{
  "success": true,
  "message": "string",
  "data": {
    "patientID": 0,
    "fullName": "string",
    "nationalID": "string",
    "gender": 0,
    "dateOfBirth": "2024-01-01T00:00:00Z",
    "phone": "string",
    "city": "string",
    "bloodTypeID": 0,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "errors": null
}
```

---

**Status Codes (أكواد الحالة):**

| Code | Status | Description |
|------|--------|-------------|
| 201 | Created | تم إنشاء المريض بنجاح |
| 400 | Bad Request | بيانات غير صحيحة أو مفقودة |
| 401 | Unauthorized | JWT Token مفقود أو غير صالح |
| 500 | Internal Server Error | خطأ في الخادم أثناء معالجة الطلب |

---

**مثال Request (طلب كامل):**

**JSON Body:**

```json
{
  "fullName": "سارة أحمد محمد",
  "nationalID": "1234567890",
  "gender": 0,
  "dateOfBirth": "1988-03-12",
  "phone": "+966501234567",
  "city": "الرياض",
  "bloodTypeID": 3
}
```

**cURL:**

```bash
curl -X POST "https://api.bloodconnect.com/api/patients" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "fullName": "سارة أحمد محمد",
    "nationalID": "1234567890",
    "gender": 0,
    "dateOfBirth": "1988-03-12",
    "phone": "+966501234567",
    "city": "الرياض",
    "bloodTypeID": 3
  }'
```

**JavaScript (Fetch):**

```javascript
const token = 'YOUR_JWT_TOKEN';

const patientData = {
  fullName: 'سارة أحمد محمد',
  nationalID: '1234567890',
  gender: 0,
  dateOfBirth: '1988-03-12',
  phone: '+966501234567',
  city: 'الرياض',
  bloodTypeID: 3
};

fetch('https://api.bloodconnect.com/api/patients', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(patientData)
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Python (Requests):**

```python
import requests

token = 'YOUR_JWT_TOKEN'
url = 'https://api.bloodconnect.com/api/patients'

headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Bearer {token}'
}

patient_data = {
    'fullName': 'سارة أحمد محمد',
    'nationalID': '1234567890',
    'gender': 0,
    'dateOfBirth': '1988-03-12',
    'phone': '+966501234567',
    'city': 'الرياض',
    'bloodTypeID': 3
}

response = requests.post(url, json=patient_data, headers=headers)
data = response.json()
print(data)
```

**C# (.NET):**

```csharp
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public async Task<string> CreatePatient(string token)
{
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = 
        new AuthenticationHeaderValue("Bearer", token);
    
    var patientData = new
    {
        fullName = "سارة أحمد محمد",
        nationalID = "1234567890",
        gender = 0,
        dateOfBirth = "1988-03-12",
        phone = "+966501234567",
        city = "الرياض",
        bloodTypeID = 3
    };
    
    var json = JsonSerializer.Serialize(patientData);
    var content = new StringContent(json, Encoding.UTF8, "application/json");
    
    var response = await client.PostAsync(
        "https://api.bloodconnect.com/api/patients", content);
    
    return await response.Content.ReadAsStringAsync();
}
```

---

**مثال Success Response (201 Created):**

```json
{
  "success": true,
  "message": "تم إنشاء المريض بنجاح",
  "data": {
    "patientID": 45,
    "fullName": "سارة أحمد محمد",
    "nationalID": "1234567890",
    "gender": 0,
    "dateOfBirth": "1988-03-12T00:00:00Z",
    "phone": "+966501234567",
    "city": "الرياض",
    "bloodTypeID": 3,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "errors": null
}
```

---

**مثال Error Response (400 Bad Request - Validation):**

عندما تكون البيانات غير صحيحة أو مفقودة:

```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "data": null,
  "errors": [
    "الاسم الكامل مطلوب",
    "الرقم الوطني مطلوب",
    "فصيلة الدم غير صالحة"
  ]
}
```

---

**مثال Error Response (400 Bad Request - Duplicate):**

عندما يكون الرقم الوطني مسجل مسبقاً:

```json
{
  "success": false,
  "message": "المريض مسجل مسبقاً",
  "data": null,
  "errors": [
    "الرقم الوطني 1234567890 مسجل مسبقاً في النظام"
  ]
}
```

---

**مثال Error Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

---

**ملاحظات مهمة (Important Notes):**

1. **الحقول المطلوبة:**
   - جميع الحقول مطلوبة ولا يمكن تركها فارغة
   - سيتم رفض الطلب إذا كان أي حقل مفقوداً

2. **الرقم الوطني (NationalID):**
   - يجب أن يكون فريداً لكل مريض
   - لا يمكن تسجيل نفس الرقم الوطني مرتين
   - الحد الأقصى: 20 حرف

3. **Gender Enum:**
   - `0` = Female (أنثى)
   - `1` = Male (ذكر)
   - أي قيمة أخرى ستسبب خطأ Validation

4. **تاريخ الميلاد (Date of Birth):**
   - الصيغة المطلوبة: `YYYY-MM-DD` أو `YYYY-MM-DDTHH:mm:ssZ`
   - يجب أن يكون تاريخ صالح في الماضي

5. **Blood Type ID:**
   - القيم الصالحة: 1-8 (راجع جدول معرفات فصائل الدم)
   - أي قيمة خارج هذا النطاق ستسبب خطأ

6. **رقم الهاتف:**
   - يُفضل استخدام الصيغة الدولية (مثل: +966501234567)
   - الحد الأقصى: 15 حرف

7. **Location Header:**
   - عند نجاح الإنشاء، يتم إرجاع `Location` header يحتوي على URL المريض الجديد
   - مثال: `Location: /api/patients/45`

---

**حالات الاستخدام (Use Cases):**

**1. إنشاء مريض جديد:**

```javascript
async function createPatient(patientData) {
  try {
    const response = await fetch('https://api.bloodconnect.com/api/patients', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('تم إنشاء المريض بنجاح');
      console.log('Patient ID:', result.data.patientID);
      return result.data;
    } else {
      console.error('فشل في إنشاء المريض:', result.errors);
      return null;
    }
  } catch (error) {
    console.error('خطأ في الاتصال:', error);
    return null;
  }
}

// استخدام
const newPatient = await createPatient({
  fullName: 'أحمد محمد علي',
  nationalID: '9876543210',
  gender: 1,
  dateOfBirth: '1990-05-20',
  phone: '+966502345678',
  city: 'جدة',
  bloodTypeID: 1
});
```

**2. نموذج تسجيل مريض مع Validation:**

```javascript
function validatePatientData(data) {
  const errors = [];
  
  if (!data.fullName || data.fullName.length > 100) {
    errors.push('الاسم مطلوب ويجب أن لا يتجاوز 100 حرف');
  }
  
  if (!data.nationalID || data.nationalID.length > 20) {
    errors.push('الرقم الوطني مطلوب ويجب أن لا يتجاوز 20 حرف');
  }
  
  if (data.gender !== 0 && data.gender !== 1) {
    errors.push('الجنس يجب أن يكون 0 (أنثى) أو 1 (ذكر)');
  }
  
  if (!data.dateOfBirth) {
    errors.push('تاريخ الميلاد مطلوب');
  }
  
  if (!data.phone || data.phone.length > 15) {
    errors.push('رقم الهاتف مطلوب ويجب أن لا يتجاوز 15 رقم');
  }
  
  if (!data.city || data.city.length > 50) {
    errors.push('المدينة مطلوبة ويجب أن لا تتجاوز 50 حرف');
  }
  
  if (!data.bloodTypeID || data.bloodTypeID < 1 || data.bloodTypeID > 8) {
    errors.push('فصيلة الدم مطلوبة (1-8)');
  }
  
  return errors;
}

async function submitPatientForm(formData) {
  // التحقق من البيانات محلياً أولاً
  const validationErrors = validatePatientData(formData);
  
  if (validationErrors.length > 0) {
    console.error('أخطاء في البيانات:', validationErrors);
    return { success: false, errors: validationErrors };
  }
  
  // إرسال الطلب للـ API
  return await createPatient(formData);
}
```

---

#### PUT /api/patients/{id}

**الوصف (Description):**

تحديث بيانات مريض موجود. يتيح هذا الـ endpoint تعديل بعض البيانات الأساسية للمريض (الاسم، الهاتف، المدينة).

**HTTP Method:** `PUT`

**URL:** `/api/patients/{id}`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Path Parameters (معاملات المسار):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | المعرف الفريد للمريض (Patient ID) |

**Request Body (جسم الطلب):**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `fullName` | string | Yes | الاسم الكامل للمريض | الحد الأقصى: 100 حرف |
| `phone` | string | Yes | رقم الهاتف | الحد الأقصى: 15 رقم |
| `city` | string | Yes | المدينة | الحد الأقصى: 50 حرف |

**ملاحظة:** لا يمكن تعديل الرقم الوطني (NationalID) أو تاريخ الميلاد أو فصيلة الدم بعد الإنشاء.

---

**Response Structure (بنية الاستجابة):**

```json
{
  "success": true,
  "message": "string",
  "data": {
    "patientID": 0,
    "fullName": "string",
    "nationalID": "string",
    "gender": 0,
    "dateOfBirth": "2024-01-01T00:00:00Z",
    "phone": "string",
    "city": "string",
    "bloodTypeID": 0,
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "errors": null
}
```

---

**Status Codes (أكواد الحالة):**

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | تم تحديث المريض بنجاح |
| 400 | Bad Request | بيانات غير صحيحة |
| 401 | Unauthorized | JWT Token مفقود أو غير صالح |
| 404 | Not Found | المريض غير موجود |
| 500 | Internal Server Error | خطأ في الخادم |

---

**مثال Request:**

**cURL:**

```bash
curl -X PUT "https://api.bloodconnect.com/api/patients/45" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "fullName": "سارة أحمد محمد الجديد",
    "phone": "+966509876543",
    "city": "جدة"
  }'
```

**JavaScript:**

```javascript
async function updatePatient(patientId, updateData) {
  const response = await fetch(
    `https://api.bloodconnect.com/api/patients/${patientId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    }
  );
  
  return await response.json();
}

// استخدام
const result = await updatePatient(45, {
  fullName: 'سارة أحمد محمد الجديد',
  phone: '+966509876543',
  city: 'جدة'
});
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم تحديث بيانات المريض بنجاح",
  "data": {
    "patientID": 45,
    "fullName": "سارة أحمد محمد الجديد",
    "nationalID": "1234567890",
    "gender": 0,
    "dateOfBirth": "1988-03-12T00:00:00Z",
    "phone": "+966509876543",
    "city": "جدة",
    "bloodTypeID": 3,
    "updatedAt": "2024-01-16T14:00:00Z"
  },
  "errors": null
}
```

---

**مثال Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "المريض غير موجود",
  "data": null,
  "errors": [
    "لم يتم العثور على مريض بالمعرف: 999"
  ]
}
```

---

#### DELETE /api/patients/{id}

**الوصف (Description):**

حذف مريض من النظام. يتيح هذا الـ endpoint إزالة سجل مريض نهائياً.

**HTTP Method:** `DELETE`

**URL:** `/api/patients/{id}`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Path Parameters (معاملات المسار):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | المعرف الفريد للمريض (Patient ID) |

---

**Status Codes (أكواد الحالة):**

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | تم حذف المريض بنجاح |
| 401 | Unauthorized | JWT Token مفقود أو غير صالح |
| 404 | Not Found | المريض غير موجود |
| 500 | Internal Server Error | خطأ في الخادم |

---

**مثال Request:**

**cURL:**

```bash
curl -X DELETE "https://api.bloodconnect.com/api/patients/45" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**JavaScript:**

```javascript
async function deletePatient(patientId) {
  const response = await fetch(
    `https://api.bloodconnect.com/api/patients/${patientId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return await response.json();
}

// استخدام
const result = await deletePatient(45);
if (result.success) {
  console.log('تم حذف المريض بنجاح');
}
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم حذف المريض بنجاح",
  "data": true,
  "errors": null
}
```

---

**مثال Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "المريض غير موجود",
  "data": null,
  "errors": [
    "لم يتم العثور على مريض بالمعرف: 999"
  ]
}
```

---

**ملاحظات مهمة:**

> [!CAUTION]
> **تحذير:** عملية الحذف نهائية ولا يمكن التراجع عنها. تأكد من تأكيد الحذف مع المستخدم قبل تنفيذ هذا الـ endpoint.

---

#### GET /api/patients/national/{nationalId}

**الوصف (Description):**

البحث عن مريض باستخدام الرقم الوطني.

**HTTP Method:** `GET`

**URL:** `/api/patients/national/{nationalId}`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Path Parameters (معاملات المسار):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nationalId` | string | Yes | الرقم الوطني للمريض |

---

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/patients/national/1234567890" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم العثور على المريض",
  "data": {
    "patientID": 45,
    "fullName": "سارة أحمد محمد",
    "nationalID": "1234567890",
    "gender": 0,
    "dateOfBirth": "1988-03-12T00:00:00Z",
    "phone": "+966501234567",
    "city": "الرياض",
    "bloodTypeID": 3
  },
  "errors": null
}
```

---

#### GET /api/patients/{id}/requests

**الوصف (Description):**

الحصول على بيانات مريض مع جميع طلبات الدم المرتبطة به.

**HTTP Method:** `GET`

**URL:** `/api/patients/{id}/requests`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Path Parameters (معاملات المسار):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | المعرف الفريد للمريض |

---

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/patients/45/requests" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم العثور على المريض مع طلباته",
  "data": {
    "patientID": 45,
    "fullName": "سارة أحمد محمد",
    "nationalID": "1234567890",
    "bloodRequests": [
      {
        "requestID": 1,
        "bloodTypeID": 3,
        "quantity": 2,
        "status": "Pending",
        "requestDate": "2024-01-10T00:00:00Z"
      },
      {
        "requestID": 2,
        "bloodTypeID": 3,
        "quantity": 1,
        "status": "Fulfilled",
        "requestDate": "2024-01-05T00:00:00Z"
      }
    ]
  },
  "errors": null
}
```

---

### Donations Endpoints

نقاط النهاية الخاصة بإدارة التبرعات في النظام.

---

#### GET /api/donations

**الوصف (Description):**

الحصول على قائمة جميع التبرعات مع دعم الترقيم (Pagination).

**HTTP Method:** `GET`

**URL:** `/api/donations`

**Authentication Required:** Yes (يتطلب JWT Token)

---

**Query Parameters (معاملات الاستعلام):**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pageNumber` | integer | No | 1 | رقم الصفحة |
| `pageSize` | integer | No | 10 | عدد العناصر في الصفحة (الحد الأقصى: 100) |

---

**Response Structure (بنية الاستجابة):**

```json
{
  "success": true,
  "message": "string",
  "data": {
    "items": [
      {
        "donationID": 0,
        "donorID": 0,
        "bloodTypeID": 0,
        "donationDate": "2024-01-01T00:00:00Z",
        "quantity": 0,
        "testResult": 0,
        "notes": "string",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "totalCount": 0,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 0,
    "hasPrevious": false,
    "hasNext": false
  },
  "errors": null
}
```

---

**Status Codes:**

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | تم استرجاع التبرعات بنجاح |
| 401 | Unauthorized | JWT Token مفقود أو غير صالح |
| 500 | Internal Server Error | خطأ في الخادم |

---

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/donations?pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم استرجاع التبرعات بنجاح",
  "data": {
    "items": [
      {
        "donationID": 1,
        "donorID": 5,
        "bloodTypeID": 3,
        "donationDate": "2024-01-15T00:00:00Z",
        "quantity": 450,
        "testResult": 1,
        "notes": "تبرع ناجح",
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "donationID": 2,
        "donorID": 8,
        "bloodTypeID": 1,
        "donationDate": "2024-01-14T00:00:00Z",
        "quantity": 450,
        "testResult": 0,
        "notes": null,
        "createdAt": "2024-01-14T09:00:00Z"
      }
    ],
    "totalCount": 50,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 5,
    "hasPrevious": false,
    "hasNext": true
  },
  "errors": null
}
```

**TestResult Enum:**
- `0` = Pending (قيد الانتظار)
- `1` = Approved (مقبول)
- `2` = Rejected (مرفوض)

---

#### GET /api/donations/{id}

**الوصف (Description):**

الحصول على تفاصيل تبرع محدد باستخدام معرفه.

**HTTP Method:** `GET`

**URL:** `/api/donations/{id}`

**Authentication Required:** Yes

---

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | المعرف الفريد للتبرع |

---

**Status Codes:**

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | تم استرجاع التبرع بنجاح |
| 401 | Unauthorized | JWT Token مفقود |
| 404 | Not Found | التبرع غير موجود |
| 500 | Internal Server Error | خطأ في الخادم |

---

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/donations/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم استرجاع التبرع بنجاح",
  "data": {
    "donationID": 1,
    "donorID": 5,
    "bloodTypeID": 3,
    "donationDate": "2024-01-15T00:00:00Z",
    "quantity": 450,
    "testResult": 1,
    "notes": "تبرع ناجح",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "errors": null
}
```

---

#### POST /api/donations

**الوصف (Description):**

تسجيل تبرع جديد في النظام.

**HTTP Method:** `POST`

**URL:** `/api/donations`

**Authentication Required:** Yes

---

**Request Body:**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `donorID` | integer | Yes | معرف المتبرع | >= 1 |
| `bloodTypeID` | integer | Yes | معرف فصيلة الدم | 1-8 |
| `donationDate` | string | Yes | تاريخ التبرع (ISO 8601) | تاريخ صالح |
| `quantity` | integer | Yes | كمية الدم (مل) | 1-1000 |
| `testResult` | integer | No | نتيجة الفحص (افتراضي: 0) | 0-2 |
| `notes` | string | No | ملاحظات إضافية | حد أقصى 500 حرف |

---

**مثال Request:**

```bash
curl -X POST "https://api.bloodconnect.com/api/donations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "donorID": 5,
    "bloodTypeID": 3,
    "donationDate": "2024-01-15",
    "quantity": 450,
    "testResult": 0,
    "notes": "تبرع جديد"
  }'
```

---

**مثال Success Response (201 Created):**

```json
{
  "success": true,
  "message": "تم تسجيل التبرع بنجاح",
  "data": {
    "donationID": 10,
    "donorID": 5,
    "bloodTypeID": 3,
    "donationDate": "2024-01-15T00:00:00Z",
    "quantity": 450,
    "testResult": 0,
    "notes": "تبرع جديد",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "errors": null
}
```

---

**مثال Error Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "data": null,
  "errors": [
    "معرف المتبرع مطلوب",
    "الكمية يجب أن تكون بين 1 و 1000 مل"
  ]
}
```

---

#### PUT /api/donations/{id}/test-result

**الوصف (Description):**

تحديث نتيجة فحص تبرع محدد.

**HTTP Method:** `PUT`

**URL:** `/api/donations/{id}/test-result`

**Authentication Required:** Yes

---

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | معرف التبرع |

**Request Body:**

```json
{
  "testResult": 1
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `testResult` | integer | Yes | نتيجة الفحص (0=Pending, 1=Approved, 2=Rejected) |

---

**مثال Request:**

```bash
curl -X PUT "https://api.bloodconnect.com/api/donations/1/test-result" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"testResult": 1}'
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم تحديث نتيجة الفحص بنجاح",
  "data": {
    "donationID": 1,
    "testResult": 1
  },
  "errors": null
}
```

---

#### DELETE /api/donations/{id}

**الوصف (Description):**

حذف تبرع من النظام.

**HTTP Method:** `DELETE`

**URL:** `/api/donations/{id}`

**Authentication Required:** Yes

---

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | معرف التبرع |

---

**مثال Request:**

```bash
curl -X DELETE "https://api.bloodconnect.com/api/donations/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم حذف التبرع بنجاح",
  "data": true,
  "errors": null
}
```

---

#### GET /api/donations/donor/{donorId}

**الوصف (Description):**

الحصول على جميع تبرعات متبرع محدد.

**HTTP Method:** `GET`

**URL:** `/api/donations/donor/{donorId}`

**Authentication Required:** Yes

---

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `donorId` | integer | Yes | معرف المتبرع |

---

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/donations/donor/5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم استرجاع تبرعات المتبرع بنجاح",
  "data": [
    {
      "donationID": 1,
      "donorID": 5,
      "bloodTypeID": 3,
      "donationDate": "2024-01-15T00:00:00Z",
      "quantity": 450,
      "testResult": 1
    },
    {
      "donationID": 5,
      "donorID": 5,
      "bloodTypeID": 3,
      "donationDate": "2023-10-10T00:00:00Z",
      "quantity": 450,
      "testResult": 1
    }
  ],
  "errors": null
}
```

---

#### GET /api/donations/approved

**الوصف (Description):**

الحصول على جميع التبرعات المقبولة (التي اجتازت الفحص).

**HTTP Method:** `GET`

**URL:** `/api/donations/approved`

**Authentication Required:** Yes

---

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/donations/approved" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**مثال Success Response (200 OK):**

```json
{
  "success": true,
  "message": "تم استرجاع التبرعات المقبولة بنجاح",
  "data": [
    {
      "donationID": 1,
      "donorID": 5,
      "bloodTypeID": 3,
      "donationDate": "2024-01-15T00:00:00Z",
      "quantity": 450,
      "testResult": 1
    }
  ],
  "errors": null
}
```

---



### Blood Requests Endpoints

نقاط النهاية الخاصة بإدارة طلبات الدم في النظام.

---

#### GET /api/bloodrequests

**الوصف (Description):**

الحصول على قائمة جميع طلبات الدم مع دعم الترقيم (Pagination).

**HTTP Method:** `GET`

**URL:** `/api/bloodrequests`

**Authentication Required:** Yes

---

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pageNumber` | integer | No | 1 | رقم الصفحة |
| `pageSize` | integer | No | 10 | عدد العناصر في الصفحة |

---

**Response Structure:**

```json
{
  "success": true,
  "message": "string",
  "data": {
    "items": [
      {
        "requestID": 0,
        "patientID": 0,
        "bloodTypeID": 0,
        "quantity": 0,
        "status": 0,
        "urgencyLevel": 0,
        "notes": "string",
        "requestDate": "2024-01-01T00:00:00Z",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "totalCount": 0,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 0
  },
  "errors": null
}
```

**Status Enum:**
- `0` = Pending (معلق)
- `1` = Approved (موافق عليه)
- `2` = Fulfilled (منفذ)
- `3` = Rejected (مرفوض)
- `4` = Cancelled (ملغي)

**UrgencyLevel Enum:**
- `0` = Low (منخفض)
- `1` = Medium (متوسط)
- `2` = High (عالي)
- `3` = Critical (حرج)

---

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/bloodrequests?pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### GET /api/bloodrequests/{id}

**الوصف:** الحصول على تفاصيل طلب دم محدد.

**HTTP Method:** `GET`

**URL:** `/api/bloodrequests/{id}`

---

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/bloodrequests/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### GET /api/bloodrequests/{id}/details

**الوصف:** الحصول على طلب دم مع التفاصيل الكاملة (بما في ذلك بيانات المريض وفصيلة الدم).

**HTTP Method:** `GET`

**URL:** `/api/bloodrequests/{id}/details`

---

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/bloodrequests/1/details" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### GET /api/bloodrequests/pending

**الوصف:** الحصول على جميع الطلبات المعلقة (Pending).

**HTTP Method:** `GET`

**URL:** `/api/bloodrequests/pending`

---

**مثال Success Response:**

```json
{
  "success": true,
  "message": "تم استرجاع الطلبات المعلقة بنجاح",
  "data": [
    {
      "requestID": 1,
      "patientID": 5,
      "bloodTypeID": 3,
      "quantity": 2,
      "status": 0,
      "urgencyLevel": 2,
      "requestDate": "2024-01-15T00:00:00Z"
    }
  ],
  "errors": null
}
```

---

#### GET /api/bloodrequests/urgent

**الوصف:** الحصول على جميع الطلبات العاجلة (urgencyLevel = High أو Critical).

**HTTP Method:** `GET`

**URL:** `/api/bloodrequests/urgent`

---

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/bloodrequests/urgent" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### POST /api/bloodrequests

**الوصف:** إنشاء طلب دم جديد.

**HTTP Method:** `POST`

**URL:** `/api/bloodrequests`

---

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `patientID` | integer | Yes | معرف المريض |
| `bloodTypeID` | integer | Yes | معرف فصيلة الدم (1-8) |
| `quantity` | integer | Yes | الكمية المطلوبة |
| `urgencyLevel` | integer | No | مستوى الأولوية (0-3) |
| `notes` | string | No | ملاحظات إضافية |

---

**مثال Request:**

```bash
curl -X POST "https://api.bloodconnect.com/api/bloodrequests" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "patientID": 5,
    "bloodTypeID": 3,
    "quantity": 2,
    "urgencyLevel": 2,
    "notes": "حالة طارئة"
  }'
```

---

**مثال Success Response (201 Created):**

```json
{
  "success": true,
  "message": "تم إنشاء طلب الدم بنجاح",
  "data": {
    "requestID": 10,
    "patientID": 5,
    "bloodTypeID": 3,
    "quantity": 2,
    "status": 0,
    "urgencyLevel": 2,
    "notes": "حالة طارئة",
    "requestDate": "2024-01-15T10:30:00Z"
  },
  "errors": null
}
```

---

#### PUT /api/bloodrequests/{id}/status

**الوصف:** تحديث حالة طلب دم.

**HTTP Method:** `PUT`

**URL:** `/api/bloodrequests/{id}/status`

---

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | integer | Yes | الحالة الجديدة (0-4) |
| `notes` | string | No | ملاحظات |

---

**مثال Request:**

```bash
curl -X PUT "https://api.bloodconnect.com/api/bloodrequests/1/status?status=1&notes=تمت الموافقة" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### POST /api/bloodrequests/{id}/fulfill

**الوصف:** تنفيذ طلب دم (ربط التبرع بالطلب).

**HTTP Method:** `POST`

**URL:** `/api/bloodrequests/{id}/fulfill`

---

**Request Body:**

```json
{
  "donationId": 5,
  "quantity": 2
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `donationId` | integer | Yes | معرف التبرع المستخدم |
| `quantity` | integer | Yes | الكمية المقدمة |

---

**مثال Success Response:**

```json
{
  "success": true,
  "message": "تم تنفيذ طلب الدم بنجاح",
  "data": true,
  "errors": null
}
```

---

#### POST /api/bloodrequests/{id}/cancel

**الوصف:** إلغاء طلب دم.

**HTTP Method:** `POST`

**URL:** `/api/bloodrequests/{id}/cancel`

---

**Request Body:**

```json
{
  "reason": "تم إلغاء العملية"
}
```

---

**مثال Request:**

```bash
curl -X POST "https://api.bloodconnect.com/api/bloodrequests/1/cancel" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"reason": "تم إلغاء العملية"}'
```

---



### Inventory Endpoints

نقاط النهاية الخاصة بإدارة مخزون الدم في النظام.

---

#### GET /api/inventory

**الوصف:** الحصول على قائمة جميع عناصر المخزون.

**HTTP Method:** `GET`

**URL:** `/api/inventory`

**Authentication Required:** Yes

---

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/inventory" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**مثال Success Response:**

```json
{
  "success": true,
  "message": "تم استرجاع المخزون بنجاح",
  "data": [
    {
      "inventoryID": 1,
      "bloodTypeID": 1,
      "bloodTypeName": "O+",
      "quantity": 25,
      "lastUpdated": "2024-01-15T10:30:00Z"
    },
    {
      "inventoryID": 2,
      "bloodTypeID": 2,
      "bloodTypeName": "O-",
      "quantity": 10,
      "lastUpdated": "2024-01-15T09:00:00Z"
    }
  ],
  "errors": null
}
```

---

#### GET /api/inventory/blood-type/{bloodTypeId}

**الوصف:** الحصول على مخزون فصيلة دم محددة.

**HTTP Method:** `GET`

**URL:** `/api/inventory/blood-type/{bloodTypeId}`

---

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `bloodTypeId` | integer | Yes | معرف فصيلة الدم (1-8) |

---

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/inventory/blood-type/3" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**مثال Success Response:**

```json
{
  "success": true,
  "message": "تم استرجاع بيانات المخزون بنجاح",
  "data": {
    "inventoryID": 3,
    "bloodTypeID": 3,
    "bloodTypeName": "A+",
    "quantity": 18,
    "lastUpdated": "2024-01-15T10:30:00Z"
  },
  "errors": null
}
```

---

#### GET /api/inventory/low-stock

**الوصف:** الحصول على فصائل الدم ذات المخزون المنخفض.

**HTTP Method:** `GET`

**URL:** `/api/inventory/low-stock`

---

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `threshold` | integer | No | 5 | الحد الأدنى للمخزون |

---

**مثال Request:**

```bash
curl -X GET "https://api.bloodconnect.com/api/inventory/low-stock?threshold=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**مثال Success Response:**

```json
{
  "success": true,
  "message": "تم استرجاع المخزون المنخفض بنجاح",
  "data": [
    {
      "inventoryID": 4,
      "bloodTypeID": 4,
      "bloodTypeName": "A-",
      "quantity": 3,
      "lastUpdated": "2024-01-14T08:00:00Z"
    },
    {
      "inventoryID": 8,
      "bloodTypeID": 8,
      "bloodTypeName": "AB-",
      "quantity": 2,
      "lastUpdated": "2024-01-13T16:00:00Z"
    }
  ],
  "errors": null
}
```

---

#### GET /api/inventory/summary

**الوصف:** الحصول على ملخص المخزون (إجمالي الكميات لكل فصيلة).

**HTTP Method:** `GET`

**URL:** `/api/inventory/summary`

---

**مثال Success Response:**

```json
{
  "success": true,
  "message": "تم استرجاع ملخص المخزون بنجاح",
  "data": {
    "O+": 25,
    "O-": 10,
    "A+": 18,
    "A-": 3,
    "B+": 15,
    "B-": 8,
    "AB+": 12,
    "AB-": 2
  },
  "errors": null
}
```

---

#### PUT /api/inventory/blood-type/{bloodTypeId}

**الوصف:** تحديث كمية المخزون لفصيلة دم محددة.

**HTTP Method:** `PUT`

**URL:** `/api/inventory/blood-type/{bloodTypeId}`

---

**Request Body:**

```json
{
  "quantityChange": 5
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `quantityChange` | integer | Yes | التغيير في الكمية (موجب للإضافة، سالب للخصم) |

---

**مثال Request (إضافة للمخزون):**

```bash
curl -X PUT "https://api.bloodconnect.com/api/inventory/blood-type/3" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"quantityChange": 5}'
```

---

**مثال Success Response:**

```json
{
  "success": true,
  "message": "تم تحديث كمية المخزون بنجاح",
  "data": true,
  "errors": null
}
```

---

## معالجة الأخطاء (Error Handling)

### بنية استجابة الخطأ (Error Response Structure)

جميع استجابات الخطأ تتبع البنية الموحدة:

```json
{
  "success": false,
  "message": "وصف الخطأ",
  "data": null,
  "errors": [
    "تفاصيل الخطأ 1",
    "تفاصيل الخطأ 2"
  ]
}
```

---

### جدول أكواد الحالة (Status Codes)

| Code | Status | الوصف | الأسباب المحتملة |
|------|--------|-------|-----------------|
| 200 | OK | تم تنفيذ الطلب بنجاح | عمليات GET, PUT, DELETE الناجحة |
| 201 | Created | تم إنشاء المورد بنجاح | عمليات POST الناجحة |
| 400 | Bad Request | بيانات الطلب غير صحيحة | Validation errors, بيانات مفقودة، تعارض بيانات |
| 401 | Unauthorized | غير مصرح بالوصول | Token مفقود، Token منتهي الصلاحية، Token غير صالح |
| 403 | Forbidden | الوصول محظور | المستخدم لا يملك الصلاحيات المطلوبة |
| 404 | Not Found | المورد غير موجود | ID غير صحيح، المورد تم حذفه |
| 500 | Internal Server Error | خطأ في الخادم | خطأ في قاعدة البيانات، خطأ غير متوقع |

---

### أمثلة أخطاء شائعة

#### 1. Validation Error (400 Bad Request)

```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "data": null,
  "errors": [
    "الاسم الكامل مطلوب",
    "الرقم الوطني يجب أن لا يتجاوز 20 حرف",
    "فصيلة الدم غير صالحة"
  ]
}
```

#### 2. Unauthorized Error (401)

```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": [
    "Missing or invalid authentication token"
  ]
}
```

#### 3. Not Found Error (404)

```json
{
  "success": false,
  "message": "المريض غير موجود",
  "data": null,
  "errors": [
    "لم يتم العثور على مريض بالمعرف: 999"
  ]
}
```

#### 4. Internal Server Error (500)

```json
{
  "success": false,
  "message": "حدث خطأ أثناء معالجة الطلب",
  "data": null,
  "errors": [
    "Database connection failed",
    "Please try again later"
  ]
}
```

---

## أمثلة الاستخدام (Examples & Use Cases)

### 1. تسجيل متبرع جديد وإضافة تبرع

```javascript
// الخطوة 1: تسجيل الدخول
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@example.com', password: 'password' })
});
const { data: { token } } = await loginResponse.json();

// الخطوة 2: إضافة متبرع جديد
const donorResponse = await fetch('/api/donors', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: 'أحمد محمد',
    nationalID: '1234567890',
    gender: 1,
    dateOfBirth: '1990-01-15',
    phone: '+966501234567',
    city: 'الرياض',
    bloodTypeID: 1
  })
});
const donor = await donorResponse.json();

// الخطوة 3: تسجيل تبرع
const donationResponse = await fetch('/api/donations', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    donorID: donor.data.donorID,
    bloodTypeID: 1,
    donationDate: new Date().toISOString(),
    quantity: 450,
    testResult: 0
  })
});
```

---

### 2. إنشاء طلب دم عاجل

```python
import requests

token = 'YOUR_TOKEN'
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# إنشاء طلب عاجل
request_data = {
    'patientID': 5,
    'bloodTypeID': 1,  # O+
    'quantity': 3,
    'urgencyLevel': 3,  # Critical
    'notes': 'حالة طوارئ - نزيف حاد'
}

response = requests.post(
    'https://api.bloodconnect.com/api/bloodrequests',
    json=request_data,
    headers=headers
)

print(response.json())
```

---

### 3. التحقق من المخزون المتاح

```javascript
async function checkInventory() {
  const response = await fetch('/api/inventory/summary', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('=== ملخص المخزون ===');
    for (const [bloodType, quantity] of Object.entries(result.data)) {
      const status = quantity < 5 ? '⚠️ منخفض' : '✅ جيد';
      console.log(`${bloodType}: ${quantity} وحدة - ${status}`);
    }
  }
}
```

---

### 4. البحث في المتبرعين المؤهلين

```bash
# الحصول على المتبرعين المؤهلين
curl -X GET "https://api.bloodconnect.com/api/donors/eligible" \
  -H "Authorization: Bearer YOUR_TOKEN"

# الحصول على متبرعين بفصيلة O+
curl -X GET "https://api.bloodconnect.com/api/donors/blood-type/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. سير عمل كامل لتنفيذ طلب دم

```javascript
async function fulfillBloodRequest(requestId) {
  // 1. الحصول على تفاصيل الطلب
  const requestDetails = await fetch(`/api/bloodrequests/${requestId}/details`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  
  // 2. التحقق من المخزون
  const inventory = await fetch(`/api/inventory/blood-type/${requestDetails.data.bloodTypeID}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  
  if (inventory.data.quantity < requestDetails.data.quantity) {
    console.error('المخزون غير كافي');
    return;
  }
  
  // 3. الحصول على تبرع مناسب
  const donations = await fetch('/api/donations/approved', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  
  const suitableDonation = donations.data.find(
    d => d.bloodTypeID === requestDetails.data.bloodTypeID
  );
  
  // 4. تنفيذ الطلب
  if (suitableDonation) {
    await fetch(`/api/bloodrequests/${requestId}/fulfill`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        donationId: suitableDonation.donationID,
        quantity: requestDetails.data.quantity
      })
    });
    
    console.log('تم تنفيذ الطلب بنجاح');
  }
}
```

---

---

## الخاتمة

شكراً لاستخدامك BloodConnect API. للمزيد من المعلومات أو الدعم، يرجى التواصل مع فريق التطوير.
