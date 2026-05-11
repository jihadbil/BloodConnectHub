# وثيقة التصميم - ميزة الاستجابة لطلب التبرع بالدم
# Design Document - Donor Response to Blood Request Feature

## نظرة عامة / Overview

### الغرض / Purpose

تهدف هذه الميزة إلى تمكين المتبرعين من الاستجابة لطلبات الدم المنشورة في النظام، وتوفير واجهة لإدارة دورة حياة الاستجابة الكاملة من الاهتمام الأولي حتى التبرع الفعلي أو الإلغاء. تتضمن الميزة:

- طبقة API Client للتواصل مع backend endpoints
- React Hooks لإدارة الحالة والعمليات
- مكونات UI للتفاعل مع الاستجابات
- أنواع TypeScript وenums
- State machine للتحقق من انتقالات الحالة
- استراتيجية معالجة الأخطاء والتحقق من الصحة

This feature enables donors to respond to published blood requests in the system and provides an interface for managing the complete response lifecycle from initial interest to actual donation or cancellation.

### النطاق / Scope

**داخل النطاق:**
- إنشاء استجابات جديدة من المتبرعين
- جلب وعرض الاستجابات (حسب الطلب، حسب المتبرع، استجابة واحدة)
- تحديث حالة الاستجابة مع التحقق من صحة الانتقالات
- إلغاء الاستجابات مع تسجيل السبب
- التحقق من توافق فصيلة الدم
- التحقق من أهلية المتبرع
- تحديث حالة طلب الدم تلقائياً
- معالجة الأخطاء الشاملة

**خارج النطاق:**
- إشعارات الوقت الفعلي (Push Notifications)
- جدولة المواعيد التلقائية
- التكامل مع أنظمة المستشفيات الخارجية
- نظام الدفع أو المكافآت

### الأهداف الرئيسية / Key Objectives

1. توفير تجربة مستخدم سلسة للمتبرعين للاستجابة لطلبات الدم
2. ضمان سلامة البيانات من خلال التحقق الشامل
3. تطبيق state machine صارم لانتقالات الحالة
4. توفير معالجة أخطاء واضحة وقابلة للتنفيذ
5. الحفاظ على الاتساق مع البنية الحالية للتطبيق

---

## البنية المعمارية / Architecture

### نظرة عامة على البنية / Architecture Overview

تتبع الميزة بنية ثلاثية الطبقات (Three-tier architecture):

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │ ResponseDialog │  │ ResponsesList  │  │ ResponseCard  │ │
│  │   Component    │  │   Component    │  │   Component   │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Hooks (State Management)             │ │
│  │  ┌──────────────────────┐  ┌──────────────────────┐   │ │
│  │  │ useDonorResponses    │  │ useResponseActions   │   │ │
│  │  └──────────────────────┘  └──────────────────────┘   │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Validation & Business Rules                │ │
│  │  ┌──────────────────────┐  ┌──────────────────────┐   │ │
│  │  │ State Machine        │  │ Validation Utils     │   │ │
│  │  └──────────────────────┘  └──────────────────────┘   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Access Layer                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    API Client                           │ │
│  │  ┌──────────────────────┐  ┌──────────────────────┐   │ │
│  │  │ donorResponsesApi    │  │ apiClient (base)     │   │ │
│  │  └──────────────────────┘  └──────────────────────┘   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Backend API     │
                    │  (ASP.NET Core)  │
                    └──────────────────┘
```

### تدفق البيانات / Data Flow

```
User Action (UI)
    │
    ▼
React Component
    │
    ▼
React Hook (Business Logic)
    │
    ├──► Validation (Client-side)
    │
    ▼
API Client
    │
    ▼
HTTP Request
    │
    ▼
Backend API
    │
    ▼
Database
    │
    ▼
HTTP Response
    │
    ▼
API Client (Transform)
    │
    ▼
React Hook (Update State)
    │
    ▼
React Component (Re-render)
    │
    ▼
UI Update
```

### الأنماط المعمارية / Architectural Patterns

1. **Repository Pattern**: API client يعمل كـ repository للوصول إلى البيانات
2. **Custom Hooks Pattern**: React hooks تغلف منطق الأعمال وإدارة الحالة
3. **State Machine Pattern**: إدارة انتقالات حالة الاستجابة
4. **Error Boundary Pattern**: معالجة الأخطاء على مستويات متعددة
5. **Optimistic Updates**: تحديث UI فوراً مع التراجع عند الفشل

---

## المكونات والواجهات / Components and Interfaces

### 1. API Client Layer

#### donorResponsesApi

طبقة API client توفر واجهة للتواصل مع backend endpoints.

**الموقع:** `src/api/donorResponses.ts`

**الواجهة:**

```typescript
interface DonorResponsesApi {
  // إنشاء استجابة جديدة
  create(data: CreateDonorResponseRequest): Promise<ServiceResponse<DonorResponse>>;
  
  // جلب استجابة واحدة
  getById(id: number): Promise<ServiceResponse<DonorResponse>>;
  
  // جلب استجابات لطلب معين
  getByRequestId(requestId: number): Promise<ServiceResponse<DonorResponse[]>>;
  
  // جلب استجابات لمتبرع معين
  getByDonorId(donorId: number): Promise<ServiceResponse<DonorResponse[]>>;
  
  // تحديث حالة الاستجابة
  updateStatus(
    id: number,
    data: UpdateResponseStatusRequest
  ): Promise<ServiceResponse<DonorResponse>>;
  
  // إلغاء استجابة
  cancel(id: number, reason: string): Promise<ServiceResponse<boolean>>;
}
```

**المسؤوليات:**
- إرسال HTTP requests إلى backend
- تحويل البيانات من تنسيق API إلى تنسيق التطبيق
- معالجة أخطاء الشبكة
- إضافة authentication headers

### 2. React Hooks Layer

#### useDonorResponses

Hook لجلب وإدارة قوائم الاستجابات.

**الموقع:** `src/hooks/useDonorResponses.ts`

**الواجهة:**

```typescript
interface UseDonorResponsesReturn {
  // البيانات
  responses: DonorResponse[] | null;
  isLoading: boolean;
  error: string | null;
  
  // العمليات
  refetch: () => Promise<void>;
}

function useDonorResponses(
  filter: { requestId?: number; donorId?: number }
): UseDonorResponsesReturn;
```

#### useResponseActions

Hook لتنفيذ العمليات على الاستجابات (إنشاء، تحديث، إلغاء).

**الموقع:** `src/hooks/useResponseActions.ts`

**الواجهة:**

```typescript
interface UseResponseActionsReturn {
  // حالة العمليات
  isCreating: boolean;
  isUpdating: boolean;
  isCancelling: boolean;
  
  // العمليات
  createResponse: (data: CreateDonorResponseRequest) => Promise<RespondResult>;
  updateStatus: (id: number, data: UpdateResponseStatusRequest) => Promise<RespondResult>;
  cancelResponse: (id: number, reason: string) => Promise<RespondResult>;
}

function useResponseActions(): UseResponseActionsReturn;
```

### 3. UI Components Layer

#### ResponseDialog

مكون حوار لتأكيد الاستجابة لطلب دم.

**الموقع:** `src/components/blood-requests/ResponseDialog.tsx` (موجود)

**Props:**

```typescript
interface ResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: BloodRequest | null;
  onSuccess: () => void;
}
```

#### ResponsesList

مكون لعرض قائمة الاستجابات.

**الموقع:** `src/components/donor-responses/ResponsesList.tsx` (جديد)

**Props:**

```typescript
interface ResponsesListProps {
  requestId?: number;
  donorId?: number;
  onResponseClick?: (response: DonorResponse) => void;
}
```

#### ResponseCard

مكون لعرض بطاقة استجابة واحدة.

**الموقع:** `src/components/donor-responses/ResponseCard.tsx` (جديد)

**Props:**

```typescript
interface ResponseCardProps {
  response: DonorResponse;
  onStatusChange?: (id: number, newStatus: ResponseStatus) => void;
  onCancel?: (id: number, reason: string) => void;
  showActions?: boolean;
}
```

#### ResponseStatusBadge

مكون لعرض حالة الاستجابة كـ badge.

**الموقع:** `src/components/donor-responses/ResponseStatusBadge.tsx` (جديد)

**Props:**

```typescript
interface ResponseStatusBadgeProps {
  status: ResponseStatus;
  className?: string;
}
```

### 4. Validation & Business Rules

#### State Machine

**الموقع:** `src/lib/responseStateMachine.ts` (جديد)

**الواجهة:**

```typescript
interface StateMachine {
  // التحقق من صحة الانتقال
  isValidTransition(from: ResponseStatus, to: ResponseStatus): boolean;
  
  // الحصول على الانتقالات المسموحة
  getAllowedTransitions(from: ResponseStatus): ResponseStatus[];
  
  // التحقق من الحالة النهائية
  isTerminalState(status: ResponseStatus): boolean;
}
```

#### Validation Utils

**الموقع:** `src/lib/responseValidation.ts` (جديد)

**الواجهة:**

```typescript
interface ValidationUtils {
  // التحقق من صحة البيانات المدخلة
  validateCreateRequest(data: CreateDonorResponseRequest): ValidationResult;
  validateUpdateRequest(data: UpdateResponseStatusRequest): ValidationResult;
  validateCancelRequest(reason: string): ValidationResult;
  
  // التحقق من قواعد الأعمال
  validateBloodTypeCompatibility(donorTypeId: number, requestTypeId: number): boolean;
  validateDonorEligibility(donor: Donor): EligibilityResult;
  validateNoDuplicateResponse(donorId: number, requestId: number): Promise<boolean>;
}
```

---

## نماذج البيانات / Data Models

### TypeScript Types & Enums

#### ResponseStatus Enum

```typescript
enum ResponseStatus {
  Interested = 1,
  Confirmed = 2,
  Donated = 3,
  Rejected = 4,
  NoShow = 5,
  Cancelled = 6
}

// String mapping for display
const ResponseStatusLabels: Record<ResponseStatus, string> = {
  [ResponseStatus.Interested]: 'مهتم',
  [ResponseStatus.Confirmed]: 'مؤكد',
  [ResponseStatus.Donated]: 'تم التبرع',
  [ResponseStatus.Rejected]: 'مرفوض',
  [ResponseStatus.NoShow]: 'لم يحضر',
  [ResponseStatus.Cancelled]: 'ملغى'
};
```

#### DonorResponse Interface

```typescript
interface DonorResponse {
  responseId: number;
  donorId: number;
  donorName: string;
  donorPhone: string;
  bloodTypeName: string;
  requestId: number;
  patientName: string;
  urgencyLevel: UrgencyLevel;
  status: ResponseStatus;
  statusDescription: string;
  notes?: string;
  rejectionReason?: string;
  responseDate: string; // ISO 8601
  confirmedAt?: string; // ISO 8601
  donationId?: number;
  createdAt: string; // ISO 8601
  updatedAt?: string; // ISO 8601
}
```

#### CreateDonorResponseRequest

```typescript
interface CreateDonorResponseRequest {
  donorId: number;
  requestId: number;
  notes?: string;
}
```

#### UpdateResponseStatusRequest

```typescript
interface UpdateResponseStatusRequest {
  status: ResponseStatus;
  notes?: string;
  donationId?: number; // Required when status = Donated
}
```

#### API Response من Backend

```typescript
// ما يأتي من الـ API
interface ApiDonorResponse {
  responseID: number;
  donorID: number;
  donorName: string;
  donorPhone: string;
  bloodTypeName: string;
  requestID: number;
  patientName: string;
  urgencyLevel: number; // 1=Normal, 2=Urgent, 3=Emergency
  status: number; // 1-6
  statusDescription: string;
  notes?: string;
  rejectionReason?: string;
  responseDate: string;
  confirmedAt?: string;
  donationID?: number;
  createdAt: string;
  updatedAt?: string;
}
```

### Data Transformation

يجب تحويل البيانات من تنسيق API (PascalCase, أرقام) إلى تنسيق التطبيق (camelCase, enums):

```typescript
function transformApiDonorResponse(api: ApiDonorResponse): DonorResponse {
  return {
    responseId: api.responseID,
    donorId: api.donorID,
    donorName: api.donorName,
    donorPhone: api.donorPhone,
    bloodTypeName: api.bloodTypeName,
    requestId: api.requestID,
    patientName: api.patientName,
    urgencyLevel: mapUrgencyLevelFromApi(api.urgencyLevel),
    status: api.status as ResponseStatus,
    statusDescription: api.statusDescription,
    notes: api.notes,
    rejectionReason: api.rejectionReason,
    responseDate: api.responseDate,
    confirmedAt: api.confirmedAt,
    donationId: api.donationID,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt
  };
}
```

---

## الخصائص الصحيحة / Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Response Creation with Valid Data

*For any* valid donor ID and request ID where the donor is active, the blood types match, and no active response exists, creating a response should succeed and return a response with status "Interested" and responseDate set to current UTC time.

**Validates: Requirements 1.1, 1.6, 1.8, 1.9**

### Property 2: Response Data Completeness

*For any* valid response ID, retrieving the response should return a complete DonorResponse object containing all required fields: donor information (name, phone, blood type), request information (patient name, urgency level), and all timestamps in ISO 8601 UTC format.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 3: Response List Ordering

*For any* valid request ID or donor ID, retrieving the list of responses should return results sorted by responseDate in descending order (newest first).

**Validates: Requirements 3.2, 4.2**

### Property 4: State Transition Validation

*For any* response with a non-terminal status (not Donated or Cancelled), attempting to update to an invalid next state should be rejected with an appropriate error message.

**Validates: Requirements 5.1, 5.8**

### Property 5: Terminal State Protection

*For any* response with status "Donated" or "Cancelled", attempting any status change should be rejected with an error message indicating the response is in a terminal state.

**Validates: Requirements 5.6, 5.7**

### Property 6: Confirmed Status Timestamp

*For any* response being updated to status "Confirmed", the system should set confirmedAt to the current UTC timestamp.

**Validates: Requirements 5.9, 10.4**

### Property 7: Donated Status Requires Donation ID

*For any* response being updated to status "Donated", if donationId is not provided or does not exist in the system, the update should be rejected with an appropriate error message.

**Validates: Requirements 5.10, 5.11, 5.12**

### Property 8: Update Timestamp Maintenance

*For any* successful response update operation, the updatedAt field should be set to the current UTC timestamp.

**Validates: Requirements 5.13, 10.3**

### Property 9: Cancellation Requires Reason

*For any* cancellation request, if the reason is empty or null, the system should reject the request with error message "يجب ذكر سبب الإلغاء", and if valid, should store the reason in rejectionReason field and update status to "Cancelled".

**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

### Property 10: Automatic Request Status Update

*For any* response being updated to status "Donated", the system should count all donated responses for the associated blood request and update the request status to "Fulfilled" if count >= quantityNeeded, or "PartiallyFulfilled" if 0 < count < quantityNeeded.

**Validates: Requirements 7.1, 7.2, 7.3**

### Property 11: Field Length Validation

*For any* request containing notes or rejectionReason fields, the system should enforce a maximum length of 500 characters and reject requests exceeding this limit.

**Validates: Requirements 8.1, 8.2**

### Property 12: ID Validation

*For any* request containing donorId or requestId fields, the system should validate that these are positive integers and reject invalid values.

**Validates: Requirements 8.3, 8.4**

### Property 13: Status Enum Validation

*For any* request containing a status field, the system should validate that the value is between 1 and 6 (valid ResponseStatus enum) and reject invalid values.

**Validates: Requirements 8.5**

### Property 14: Unified Response Format

*For all* API responses, the system should return data in the format {success, message, data, errors}, where success operations have success=true and errors=null, while failed operations have success=false and data=null.

**Validates: Requirements 9.1, 9.2, 9.3**

### Property 15: Arabic Message Presence

*For all* API responses, the system should include a descriptive message in Arabic.

**Validates: Requirements 9.4**

### Property 16: Validation Error Details

*For any* validation failure, the system should return HTTP status 400 and populate the errors array with specific error messages.

**Validates: Requirements 9.5, 8.6**

### Property 17: HTTP Status Code Appropriateness

*For all* API operations, the system should use appropriate HTTP status codes: 200 for success, 201 for creation, 400 for validation errors, 404 for not found, 500 for server errors.

**Validates: Requirements 9.6**

### Property 18: Timestamp Initialization

*For any* newly created response, the system should set both createdAt and responseDate to the current UTC timestamp, and keep confirmedAt and donationId as null.

**Validates: Requirements 10.1, 10.2, 10.6, 10.7**

### Property 19: ISO 8601 Timestamp Format

*For any* response object, all timestamp fields should be formatted in ISO 8601 format with UTC timezone indicator (Z suffix), and parsing then formatting should preserve the value.

**Validates: Requirements 10.5**

---

## معالجة الأخطاء / Error Handling

### استراتيجية معالجة الأخطاء / Error Handling Strategy

تتبع الميزة نهجاً متعدد المستويات لمعالجة الأخطاء:

#### 1. Client-Side Validation (المستوى الأول)

التحقق من صحة البيانات قبل إرسالها إلى الخادم:

```typescript
// مثال: التحقق من البيانات المدخلة
function validateCreateRequest(data: CreateDonorResponseRequest): ValidationResult {
  const errors: string[] = [];
  
  if (!data.donorId || data.donorId <= 0) {
    errors.push('معرف المتبرع غير صحيح');
  }
  
  if (!data.requestId || data.requestId <= 0) {
    errors.push('معرف الطلب غير صحيح');
  }
  
  if (data.notes && data.notes.length > 500) {
    errors.push('الملاحظات يجب ألا تتجاوز 500 حرف');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

#### 2. API Client Error Handling (المستوى الثاني)

معالجة أخطاء الشبكة والاستجابات غير الناجحة:

```typescript
async function handleApiError(error: unknown): Promise<ServiceResponse<null>> {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      success: false,
      message: 'فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت',
      data: null,
      errors: ['NETWORK_ERROR']
    };
  }
  
  if (error instanceof Response) {
    const data = await error.json();
    return {
      success: false,
      message: data.message || 'حدث خطأ غير متوقع',
      data: null,
      errors: data.errors || ['UNKNOWN_ERROR']
    };
  }
  
  return {
    success: false,
    message: 'حدث خطأ غير متوقع',
    data: null,
    errors: ['UNKNOWN_ERROR']
  };
}
```

#### 3. Business Logic Error Handling (المستوى الثالث)

معالجة أخطاء قواعد الأعمال:

```typescript
// أنواع الأخطاء
type ErrorType = 
  | 'auth'           // خطأ في المصادقة
  | 'compatibility'  // عدم توافق فصيلة الدم
  | 'eligibility'    // عدم أهلية المتبرع
  | 'validation'     // خطأ في التحقق من الصحة
  | 'state'          // خطأ في انتقال الحالة
  | 'api'            // خطأ من الخادم
  | 'unknown';       // خطأ غير معروف

interface ErrorHandlingStrategy {
  errorType: ErrorType;
  userMessage: string;
  action: 'retry' | 'redirect' | 'dismiss' | 'contact';
  logLevel: 'error' | 'warn' | 'info';
}

function getErrorStrategy(errorType: ErrorType): ErrorHandlingStrategy {
  switch (errorType) {
    case 'auth':
      return {
        errorType,
        userMessage: 'يجب تسجيل الدخول للمتابعة',
        action: 'redirect',
        logLevel: 'info'
      };
    
    case 'compatibility':
      return {
        errorType,
        userMessage: 'فصيلة دمك غير متوافقة مع الفصيلة المطلوبة',
        action: 'dismiss',
        logLevel: 'info'
      };
    
    case 'eligibility':
      return {
        errorType,
        userMessage: 'لا يمكنك التبرع حالياً. يرجى الانتظار حتى الموعد المحدد',
        action: 'dismiss',
        logLevel: 'info'
      };
    
    case 'validation':
      return {
        errorType,
        userMessage: 'البيانات المدخلة غير صحيحة',
        action: 'dismiss',
        logLevel: 'warn'
      };
    
    case 'state':
      return {
        errorType,
        userMessage: 'لا يمكن تنفيذ هذا الإجراء في الحالة الحالية',
        action: 'dismiss',
        logLevel: 'warn'
      };
    
    case 'api':
      return {
        errorType,
        userMessage: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى',
        action: 'retry',
        logLevel: 'error'
      };
    
    case 'unknown':
    default:
      return {
        errorType,
        userMessage: 'حدث خطأ غير متوقع. يرجى التواصل مع الدعم الفني',
        action: 'contact',
        logLevel: 'error'
      };
  }
}
```

#### 4. UI Error Display

عرض الأخطاء للمستخدم بطريقة واضحة:

```typescript
// في المكون
{error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>خطأ</AlertTitle>
    <AlertDescription>
      <p>{error}</p>
      {errorAction === 'retry' && (
        <Button onClick={handleRetry} size="sm" className="mt-2">
          إعادة المحاولة
        </Button>
      )}
      {errorAction === 'contact' && (
        <p className="text-xs mt-2">
          إذا استمرت المشكلة، يرجى التواصل مع مستشفى غريان المركزي
        </p>
      )}
    </AlertDescription>
  </Alert>
)}
```

### Error Recovery Strategies

| نوع الخطأ | استراتيجية التعافي |
|-----------|-------------------|
| Network Error | إعادة المحاولة التلقائية (3 مرات) مع exponential backoff |
| 401 Unauthorized | إعادة توجيه إلى صفحة تسجيل الدخول |
| 400 Validation Error | عرض رسائل الخطأ التفصيلية للمستخدم |
| 404 Not Found | عرض رسالة "البيانات غير موجودة" |
| 500 Server Error | عرض رسالة خطأ عامة مع خيار إعادة المحاولة |
| State Machine Error | منع الإجراء وعرض الانتقالات المسموحة |

---

## استراتيجية الاختبار / Testing Strategy

### نهج الاختبار المزدوج / Dual Testing Approach

تتبع الميزة نهج اختبار مزدوج يجمع بين:

1. **Unit Tests**: للتحقق من أمثلة محددة، حالات حدية، وشروط الخطأ
2. **Property-Based Tests**: للتحقق من الخصائص العامة عبر جميع المدخلات

كلا النوعين ضروريان ومكملان لبعضهما:
- Unit tests تكتشف الأخطاء المحددة والحالات الحدية
- Property tests تتحقق من الصحة العامة عبر مدخلات عشوائية متعددة

### Property-Based Testing Configuration

**المكتبة المستخدمة:** `fast-check` (لـ TypeScript/JavaScript)

**التكوين:**
- عدد التكرارات: 100 iteration كحد أدنى لكل property test
- كل property test يجب أن يشير إلى الخاصية في وثيقة التصميم
- صيغة التعليق: `// Feature: donor-response-feature, Property {number}: {property_text}`

**مثال على Property Test:**

```typescript
import fc from 'fast-check';
import { describe, it, expect } from 'vitest';

describe('Donor Response Properties', () => {
  // Feature: donor-response-feature, Property 1: Response Creation with Valid Data
  it('should create response with Interested status for valid inputs', () => {
    fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 1000 }), // donorId
        fc.integer({ min: 1, max: 1000 }), // requestId
        fc.option(fc.string({ maxLength: 500 })), // notes
        async (donorId, requestId, notes) => {
          // Setup: ensure donor is active and blood types match
          const donor = await setupActiveDonor(donorId);
          const request = await setupMatchingRequest(requestId, donor.bloodTypeId);
          
          // Act
          const result = await donorResponsesApi.create({
            donorId,
            requestId,
            notes: notes || undefined
          });
          
          // Assert
          expect(result.success).toBe(true);
          expect(result.data?.status).toBe(ResponseStatus.Interested);
          expect(result.data?.responseDate).toBeDefined();
          expect(new Date(result.data!.responseDate).getTime())
            .toBeCloseTo(Date.now(), -2); // within 100ms
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: donor-response-feature, Property 3: Response List Ordering
  it('should return responses sorted by responseDate descending', () => {
    fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }), // requestId
        fc.array(fc.date(), { minLength: 2, maxLength: 10 }), // response dates
        async (requestId, dates) => {
          // Setup: create responses with specific dates
          await setupResponsesWithDates(requestId, dates);
          
          // Act
          const result = await donorResponsesApi.getByRequestId(requestId);
          
          // Assert
          expect(result.success).toBe(true);
          const responses = result.data!;
          
          for (let i = 0; i < responses.length - 1; i++) {
            const current = new Date(responses[i].responseDate);
            const next = new Date(responses[i + 1].responseDate);
            expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: donor-response-feature, Property 4: State Transition Validation
  it('should reject invalid state transitions', () => {
    fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...Object.values(ResponseStatus).filter(s => typeof s === 'number')),
        fc.constantFrom(...Object.values(ResponseStatus).filter(s => typeof s === 'number')),
        async (fromStatus, toStatus) => {
          // Skip if it's a valid transition
          if (isValidTransition(fromStatus as ResponseStatus, toStatus as ResponseStatus)) {
            return true;
          }
          
          // Setup: create response with fromStatus
          const response = await setupResponseWithStatus(fromStatus as ResponseStatus);
          
          // Act
          const result = await donorResponsesApi.updateStatus(response.responseId, {
            status: toStatus as ResponseStatus
          });
          
          // Assert
          expect(result.success).toBe(false);
          expect(result.message).toContain('غير مسموح');
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing Strategy

**المكتبة المستخدمة:** `vitest` + `@testing-library/react`

**مجالات التركيز:**

#### 1. API Client Tests

```typescript
describe('donorResponsesApi', () => {
  it('should handle non-existent request ID', async () => {
    const result = await donorResponsesApi.create({
      donorId: 1,
      requestId: 99999,
      notes: 'test'
    });
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('طلب الدم غير موجود');
  });

  it('should reject response to fulfilled request', async () => {
    const fulfilledRequest = await setupFulfilledRequest();
    
    const result = await donorResponsesApi.create({
      donorId: 1,
      requestId: fulfilledRequest.requestId
    });
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('Fulfilled');
  });

  it('should reject inactive donor', async () => {
    const inactiveDonor = await setupInactiveDonor();
    
    const result = await donorResponsesApi.create({
      donorId: inactiveDonor.donorId,
      requestId: 1
    });
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('المتبرع غير نشط ولا يمكنه الاستجابة');
  });

  it('should reject incompatible blood type', async () => {
    const result = await donorResponsesApi.create({
      donorId: 1, // A+
      requestId: 2 // B+
    });
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('فصيلة دم المتبرع لا تتوافق');
  });
});
```

#### 2. State Machine Tests

```typescript
describe('responseStateMachine', () => {
  it('should allow Interested -> Confirmed', () => {
    expect(isValidTransition(ResponseStatus.Interested, ResponseStatus.Confirmed))
      .toBe(true);
  });

  it('should allow Interested -> Rejected', () => {
    expect(isValidTransition(ResponseStatus.Interested, ResponseStatus.Rejected))
      .toBe(true);
  });

  it('should reject Interested -> Donated', () => {
    expect(isValidTransition(ResponseStatus.Interested, ResponseStatus.Donated))
      .toBe(false);
  });

  it('should reject any transition from Donated', () => {
    const allStatuses = Object.values(ResponseStatus).filter(s => typeof s === 'number');
    
    allStatuses.forEach(status => {
      if (status !== ResponseStatus.Donated) {
        expect(isValidTransition(ResponseStatus.Donated, status as ResponseStatus))
          .toBe(false);
      }
    });
  });

  it('should identify terminal states', () => {
    expect(isTerminalState(ResponseStatus.Donated)).toBe(true);
    expect(isTerminalState(ResponseStatus.Cancelled)).toBe(true);
    expect(isTerminalState(ResponseStatus.Interested)).toBe(false);
  });
});
```

#### 3. React Hooks Tests

```typescript
describe('useDonorResponses', () => {
  it('should fetch responses for request', async () => {
    const { result } = renderHook(() => useDonorResponses({ requestId: 1 }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.responses).toBeDefined();
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    mockApiError();
    
    const { result } = renderHook(() => useDonorResponses({ requestId: 1 }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.responses).toBeNull();
    expect(result.current.error).toBeDefined();
  });
});

describe('useResponseActions', () => {
  it('should create response successfully', async () => {
    const { result } = renderHook(() => useResponseActions());
    
    const response = await result.current.createResponse({
      donorId: 1,
      requestId: 1
    });
    
    expect(response.success).toBe(true);
    expect(response.donationId).toBeDefined();
  });

  it('should handle validation error', async () => {
    const { result } = renderHook(() => useResponseActions());
    
    const response = await result.current.createResponse({
      donorId: -1, // invalid
      requestId: 1
    });
    
    expect(response.success).toBe(false);
    expect(response.errorType).toBe('validation');
  });
});
```

#### 4. Component Tests

```typescript
describe('ResponseDialog', () => {
  it('should display request details', () => {
    const request = mockBloodRequest();
    
    render(
      <ResponseDialog
        open={true}
        onOpenChange={() => {}}
        request={request}
        onSuccess={() => {}}
      />
    );
    
    expect(screen.getByText(request.bloodType!.typeName)).toBeInTheDocument();
    expect(screen.getByText(`${request.quantityNeeded} وحدة`)).toBeInTheDocument();
  });

  it('should show error for incompatible blood type', async () => {
    const request = mockBloodRequest({ bloodTypeId: 2 }); // B+
    mockDonor({ bloodTypeId: 1 }); // A+
    
    render(
      <ResponseDialog
        open={true}
        onOpenChange={() => {}}
        request={request}
        onSuccess={() => {}}
      />
    );
    
    const confirmButton = screen.getByText('تأكيد الاستجابة');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.getByText(/فصيلة دمك غير متوافقة/)).toBeInTheDocument();
    });
  });

  it('should show success message after confirmation', async () => {
    const request = mockBloodRequest();
    const onSuccess = vi.fn();
    
    render(
      <ResponseDialog
        open={true}
        onOpenChange={() => {}}
        request={request}
        onSuccess={onSuccess}
      />
    );
    
    const confirmButton = screen.getByText('تأكيد الاستجابة');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.getByText(/تم تسجيل استجابتك بنجاح/)).toBeInTheDocument();
    });
    
    // Should auto-close after 3 seconds
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    }, { timeout: 4000 });
  });
});
```

### Integration Testing

اختبارات التكامل للتحقق من التفاعل بين المكونات:

```typescript
describe('Donor Response Flow Integration', () => {
  it('should complete full response lifecycle', async () => {
    // 1. Create response
    const createResult = await donorResponsesApi.create({
      donorId: 1,
      requestId: 1
    });
    expect(createResult.success).toBe(true);
    const responseId = createResult.data!.responseId;
    
    // 2. Confirm response
    const confirmResult = await donorResponsesApi.updateStatus(responseId, {
      status: ResponseStatus.Confirmed,
      notes: 'موعد يوم الأحد'
    });
    expect(confirmResult.success).toBe(true);
    expect(confirmResult.data!.confirmedAt).toBeDefined();
    
    // 3. Mark as donated
    const donation = await createDonation();
    const donateResult = await donorResponsesApi.updateStatus(responseId, {
      status: ResponseStatus.Donated,
      donationId: donation.donationId
    });
    expect(donateResult.success).toBe(true);
    
    // 4. Verify request status updated
    const request = await bloodRequestsApi.getById(1);
    expect(request.data!.status).toBe('Fulfilled');
  });
});
```

### Test Coverage Goals

| المكون | الهدف |
|--------|-------|
| API Client | 90%+ |
| State Machine | 100% |
| Validation Utils | 95%+ |
| React Hooks | 85%+ |
| UI Components | 80%+ |
| Integration Tests | Key flows covered |

### Continuous Testing

- تشغيل الاختبارات تلقائياً عند كل commit (pre-commit hook)
- تشغيل property tests في CI/CD pipeline
- مراقبة test coverage وإنشاء تقارير

---

## الاعتبارات الأمنية / Security Considerations

### Authentication & Authorization

1. **Token-Based Authentication**: استخدام JWT tokens للمصادقة
2. **Role-Based Access Control**: التحقق من دور المستخدم قبل السماح بالعمليات
3. **Token Expiration**: معالجة انتهاء صلاحية الـ token وإعادة التوجيه

### Input Validation

1. **Client-Side Validation**: التحقق الأولي من البيانات
2. **Server-Side Validation**: التحقق النهائي على الخادم (لا يمكن تجاوزه)
3. **Sanitization**: تنظيف المدخلات من أي محتوى ضار

### Data Protection

1. **HTTPS Only**: جميع الاتصالات عبر HTTPS
2. **Sensitive Data**: عدم تخزين بيانات حساسة في localStorage
3. **CORS Configuration**: تكوين CORS بشكل صحيح

---

## اعتبارات الأداء / Performance Considerations

### Optimization Strategies

1. **React Query Caching**: استخدام React Query للتخزين المؤقت
2. **Optimistic Updates**: تحديث UI فوراً قبل استجابة الخادم
3. **Debouncing**: تأخير الطلبات المتكررة (للبحث مثلاً)
4. **Pagination**: تقسيم القوائم الطويلة إلى صفحات
5. **Lazy Loading**: تحميل المكونات عند الحاجة

### Caching Strategy

```typescript
// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 3
    }
  }
});
```

---

## خطة التنفيذ / Implementation Plan

### المرحلة 1: البنية التحتية (Infrastructure)

1. إنشاء TypeScript types وenums
2. إنشاء API client layer
3. إنشاء state machine
4. إنشاء validation utilities

### المرحلة 2: React Hooks

1. تطوير useDonorResponses hook
2. تطوير useResponseActions hook
3. كتابة unit tests للـ hooks

### المرحلة 3: UI Components

1. تطوير ResponsesList component
2. تطوير ResponseCard component
3. تطوير ResponseStatusBadge component
4. تحديث ResponseDialog component (إذا لزم الأمر)

### المرحلة 4: Testing

1. كتابة property-based tests
2. كتابة integration tests
3. إجراء اختبارات يدوية شاملة

### المرحلة 5: Documentation & Deployment

1. توثيق الكود
2. إنشاء usage examples
3. مراجعة الكود
4. النشر إلى الإنتاج

---

## التبعيات / Dependencies

### مكتبات خارجية مطلوبة:

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.x",
    "react": "^18.x",
    "react-dom": "^18.x"
  },
  "devDependencies": {
    "vitest": "^1.x",
    "@testing-library/react": "^14.x",
    "@testing-library/user-event": "^14.x",
    "fast-check": "^3.x",
    "@vitest/coverage-v8": "^1.x"
  }
}
```

### مكتبات داخلية (موجودة):

- `@/components/ui/*`: مكونات UI من shadcn/ui
- `@/hooks/use-toast`: hook للإشعارات
- `@/lib/utils`: دوال مساعدة
- `@/lib/bloodCompatibility`: التحقق من توافق فصائل الدم
- `@/lib/donorEligibility`: التحقق من أهلية المتبرع

---

## الخلاصة / Conclusion

تم تصميم ميزة الاستجابة لطلب التبرع بالدم بعناية لتوفير تجربة مستخدم سلسة مع ضمان سلامة البيانات والأمان. التصميم يتبع أفضل الممارسات في:

- **البنية المعمارية**: فصل واضح بين الطبقات
- **إدارة الحالة**: استخدام React Query وstate machine
- **معالجة الأخطاء**: نهج متعدد المستويات
- **الاختبار**: جمع بين unit tests وproperty-based tests
- **الأداء**: تحسينات متعددة للأداء

الميزة جاهزة للتنفيذ وفقاً للخطة الموضحة أعلاه.

