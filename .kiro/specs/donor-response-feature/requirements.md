# وثيقة المتطلبات - ميزة الاستجابة لطلب التبرع بالدم
# Requirements Document - Donor Response to Blood Request Feature

## المقدمة / Introduction

هذه الوثيقة تحدد المتطلبات الوظيفية لميزة الاستجابة لطلب التبرع بالدم (Donor Response to Blood Request). الميزة تسمح للمتبرعين بالاستجابة لطلبات الدم المنشورة، وتمكّن الموظفين من إدارة هذه الاستجابات عبر دورة حياة كاملة من الاهتمام الأولي حتى التبرع الفعلي أو الإلغاء.

This document defines the functional requirements for the Donor Response to Blood Request feature. The feature allows donors to respond to published blood requests and enables staff to manage these responses through a complete lifecycle from initial interest to actual donation or cancellation.

---

## المصطلحات / Glossary

- **Donor_Response_System**: النظام المسؤول عن إدارة استجابات المتبرعين لطلبات الدم
- **Donor**: المتبرع المسجل في النظام الذي يمكنه الاستجابة لطلبات الدم
- **Blood_Request**: طلب دم منشور يحتاج إلى متبرعين
- **Response_Status**: حالة الاستجابة الحالية (Interested, Confirmed, Donated, Rejected, NoShow, Cancelled)
- **Blood_Type_Compatibility**: توافق فصيلة دم المتبرع مع فصيلة الدم المطلوبة
- **Donor_Eligibility**: أهلية المتبرع للتبرع (نشط في النظام)
- **State_Transition**: الانتقال من حالة استجابة إلى أخرى
- **Donation_Record**: سجل التبرع الفعلي المرتبط بالاستجابة
- **Request_Fulfillment**: حالة اكتمال طلب الدم بناءً على عدد التبرعات

---

## المتطلبات / Requirements

### Requirement 1: تسجيل استجابة جديدة من متبرع

**User Story:** As a donor, I want to register my interest in responding to a blood request, so that the staff can contact me to arrange a donation.

#### Acceptance Criteria

1. WHEN a Donor submits a response with valid DonorID and RequestID, THE Donor_Response_System SHALL create a new response record with status "Interested"

2. IF the Blood_Request does not exist, THEN THE Donor_Response_System SHALL reject the response with error message "طلب الدم غير موجود"

3. IF the Blood_Request status is "Fulfilled" or "Cancelled", THEN THE Donor_Response_System SHALL reject the response with error message indicating the current request status

4. IF the Donor does not exist, THEN THE Donor_Response_System SHALL reject the response with error message "المتبرع غير موجود"

5. IF the Donor is not active (IsActive = false), THEN THE Donor_Response_System SHALL reject the response with error message "المتبرع غير نشط ولا يمكنه الاستجابة"

6. WHEN validating Blood_Type_Compatibility, THE Donor_Response_System SHALL verify that Donor.BloodTypeID equals Blood_Request.BloodTypeID

7. IF Blood_Type_Compatibility check fails, THEN THE Donor_Response_System SHALL reject the response with error message "فصيلة دم المتبرع لا تتوافق مع فصيلة الدم المطلوبة"

8. IF the Donor has an existing response for the same Blood_Request with status "Interested" or "Confirmed", THEN THE Donor_Response_System SHALL reject the new response with error message "لديك استجابة نشطة مسبقاً لهذا الطلب"

9. WHEN a response is successfully created, THE Donor_Response_System SHALL set responseDate to current UTC timestamp

10. WHEN a response is successfully created, THE Donor_Response_System SHALL return HTTP status 201 with success message "تم تسجيل استجابتك بنجاح. سيتواصل معك الفريق قريباً"

---

### Requirement 2: جلب تفاصيل استجابة واحدة

**User Story:** As a staff member, I want to retrieve details of a specific donor response, so that I can review the response information and take appropriate action.

#### Acceptance Criteria

1. WHEN a valid ResponseID is provided, THE Donor_Response_System SHALL return the complete DonorResponseDto object

2. THE Donor_Response_System SHALL include donor information (name, phone, blood type) in the response

3. THE Donor_Response_System SHALL include blood request information (patient name, urgency level) in the response

4. THE Donor_Response_System SHALL include all timestamps (responseDate, confirmedAt, createdAt, updatedAt) in ISO 8601 UTC format

5. IF the ResponseID does not exist, THEN THE Donor_Response_System SHALL return HTTP status 404 with error message "الاستجابة غير موجودة"

---

### Requirement 3: جلب جميع الاستجابات لطلب دم معين

**User Story:** As a staff member, I want to view all donor responses for a specific blood request, so that I can identify available donors and manage the fulfillment process.

#### Acceptance Criteria

1. WHEN a valid RequestID is provided, THE Donor_Response_System SHALL return all responses associated with that blood request

2. THE Donor_Response_System SHALL sort the responses by responseDate in descending order (newest first)

3. IF no responses exist for the RequestID, THE Donor_Response_System SHALL return an empty array with success status

4. IF the RequestID does not exist, THEN THE Donor_Response_System SHALL return HTTP status 404

---

### Requirement 4: جلب جميع استجابات متبرع معين

**User Story:** As a donor or staff member, I want to view all responses submitted by a specific donor, so that I can track the donor's response history.

#### Acceptance Criteria

1. WHEN a valid DonorID is provided, THE Donor_Response_System SHALL return all responses submitted by that donor

2. THE Donor_Response_System SHALL sort the responses by responseDate in descending order (newest first)

3. IF no responses exist for the DonorID, THE Donor_Response_System SHALL return an empty array with success status

---

### Requirement 5: تحديث حالة الاستجابة

**User Story:** As a staff member, I want to update the status of a donor response, so that I can track the progress from initial interest to actual donation.

#### Acceptance Criteria

1. WHEN a valid ResponseID and new status are provided, THE Donor_Response_System SHALL validate the state transition

2. THE Donor_Response_System SHALL allow transition from "Interested" to "Confirmed", "Rejected", or "Cancelled"

3. THE Donor_Response_System SHALL allow transition from "Confirmed" to "Donated", "NoShow", or "Cancelled"

4. THE Donor_Response_System SHALL allow transition from "Rejected" to "Cancelled"

5. THE Donor_Response_System SHALL allow transition from "NoShow" to "Confirmed" or "Cancelled"

6. IF the current status is "Donated", THEN THE Donor_Response_System SHALL reject any status change with error message "لا يمكن تغيير حالة استجابة تم التبرع بها مسبقاً"

7. IF the current status is "Cancelled", THEN THE Donor_Response_System SHALL reject any status change with error message "لا يمكن تغيير حالة استجابة ملغاة"

8. IF an invalid state transition is attempted, THEN THE Donor_Response_System SHALL reject the update with error message indicating the invalid transition

9. WHEN status is updated to "Confirmed", THE Donor_Response_System SHALL set confirmedAt to current UTC timestamp

10. WHEN status is updated to "Donated", THE Donor_Response_System SHALL require a valid DonationID

11. IF status is "Donated" and DonationID is not provided, THEN THE Donor_Response_System SHALL reject the update with error message "يجب تحديد معرف التبرع عند تسجيل حالة 'تم التبرع'"

12. IF status is "Donated" and DonationID does not exist in the system, THEN THE Donor_Response_System SHALL reject the update with error message "التبرع برقم X غير موجود"

13. WHEN a status update is successful, THE Donor_Response_System SHALL update the updatedAt timestamp to current UTC time

14. WHEN a status update is successful, THE Donor_Response_System SHALL return the updated DonorResponseDto object

---

### Requirement 6: إلغاء استجابة

**User Story:** As a donor or staff member, I want to cancel a response, so that I can indicate that the donor is no longer available or interested.

#### Acceptance Criteria

1. WHEN a cancel request is submitted with a valid ResponseID and cancellation reason, THE Donor_Response_System SHALL update the status to "Cancelled"

2. THE Donor_Response_System SHALL require a non-empty cancellation reason

3. IF the cancellation reason is empty or null, THEN THE Donor_Response_System SHALL reject the request with error message "يجب ذكر سبب الإلغاء"

4. THE Donor_Response_System SHALL store the cancellation reason in the rejectionReason field

5. IF the current status is "Donated", THEN THE Donor_Response_System SHALL reject the cancellation with error message "لا يمكن إلغاء الاستجابة — حالتها الحالية: Donated"

6. IF the current status is already "Cancelled", THEN THE Donor_Response_System SHALL reject the cancellation with error message indicating the response is already cancelled

7. WHEN cancellation is successful, THE Donor_Response_System SHALL return success status with message "تم إلغاء الاستجابة بنجاح"

---

### Requirement 7: تحديث حالة طلب الدم تلقائياً

**User Story:** As a system administrator, I want the blood request status to be automatically updated when donations are completed, so that the request fulfillment is accurately tracked.

#### Acceptance Criteria

1. WHEN a response status is updated to "Donated", THE Donor_Response_System SHALL count all responses with status "Donated" for the associated Blood_Request

2. IF the count of donated responses is greater than or equal to Blood_Request.QuantityNeeded, THEN THE Donor_Response_System SHALL update Blood_Request.Status to "Fulfilled"

3. IF the count of donated responses is greater than zero and less than Blood_Request.QuantityNeeded, THEN THE Donor_Response_System SHALL update Blood_Request.Status to "PartiallyFulfilled"

4. THE Donor_Response_System SHALL perform this update atomically with the response status update

---

### Requirement 8: التحقق من صحة البيانات المدخلة

**User Story:** As a system administrator, I want all input data to be validated, so that data integrity is maintained.

#### Acceptance Criteria

1. WHEN notes field is provided, THE Donor_Response_System SHALL enforce a maximum length of 500 characters

2. WHEN rejectionReason field is provided, THE Donor_Response_System SHALL enforce a maximum length of 500 characters

3. THE Donor_Response_System SHALL validate that DonorID is a positive integer

4. THE Donor_Response_System SHALL validate that RequestID is a positive integer

5. THE Donor_Response_System SHALL validate that status value is between 1 and 6 (valid ResponseStatus enum)

6. IF validation fails, THEN THE Donor_Response_System SHALL return HTTP status 400 with detailed error messages in the errors array

---

### Requirement 9: تنسيق الاستجابة الموحد

**User Story:** As a frontend developer, I want all API responses to follow a consistent format, so that I can handle responses uniformly.

#### Acceptance Criteria

1. THE Donor_Response_System SHALL return all responses in the format: {success, message, data, errors}

2. WHEN an operation succeeds, THE Donor_Response_System SHALL set success to true and errors to null

3. WHEN an operation fails, THE Donor_Response_System SHALL set success to false and data to null

4. THE Donor_Response_System SHALL always include a descriptive message in Arabic

5. WHEN validation errors occur, THE Donor_Response_System SHALL populate the errors array with specific error messages

6. THE Donor_Response_System SHALL use HTTP status codes appropriately (200 for success, 201 for creation, 400 for validation errors, 404 for not found, 500 for server errors)

---

### Requirement 10: إدارة الطوابع الزمنية

**User Story:** As a system administrator, I want all timestamps to be recorded accurately, so that I can track the timeline of each response.

#### Acceptance Criteria

1. WHEN a response is created, THE Donor_Response_System SHALL set createdAt to current UTC timestamp

2. WHEN a response is created, THE Donor_Response_System SHALL set responseDate to current UTC timestamp

3. WHEN a response is updated, THE Donor_Response_System SHALL set updatedAt to current UTC timestamp

4. WHEN a response status changes to "Confirmed", THE Donor_Response_System SHALL set confirmedAt to current UTC timestamp

5. THE Donor_Response_System SHALL format all timestamps in ISO 8601 format with UTC timezone indicator (Z suffix)

6. THE Donor_Response_System SHALL keep confirmedAt as null until the status is updated to "Confirmed"

7. THE Donor_Response_System SHALL keep donationID as null until the status is updated to "Donated"

---

## ملاحظات إضافية / Additional Notes

### State Machine Transitions

الانتقالات المسموحة بين الحالات:
- Interested → Confirmed, Rejected, Cancelled
- Confirmed → Donated, NoShow, Cancelled
- Rejected → Cancelled
- NoShow → Confirmed, Cancelled
- Donated → (لا يمكن التغيير)
- Cancelled → (لا يمكن التغيير)

### Blood Type Compatibility

التحقق من التوافق يتطلب تطابق تام بين `Donor.BloodTypeID` و `Blood_Request.BloodTypeID`. لا يتم تطبيق قواعد التوافق المعقدة (مثل O- يمكن أن يتبرع لجميع الفصائل) في هذه المرحلة.

### Performance Considerations

- جلب الاستجابات لطلب معين يجب أن يكون محسّناً لأن هذا الـ endpoint سيُستخدم بشكل متكرر
- الفرز حسب التاريخ يجب أن يتم على مستوى قاعدة البيانات وليس في الكود

### Security Considerations

- حالياً لا يوجد متطلب للمصادقة (Authentication) لكن يُنصح بإضافته في المستقبل
- يجب التحقق من صلاحيات المستخدم قبل السماح بتحديث الحالات (خاصة Confirmed و Donated)
