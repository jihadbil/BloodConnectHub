// Blood type compatibility utility
// Based on standard blood donation compatibility rules

export type BloodTypeCompatibility = {
    [key: string]: number[]; // Maps blood type ID to compatible donor blood type IDs
};

// Blood Type IDs (التفسير الصحيح من API):
// 1: A+, 2: A-, 3: B+, 4: B-, 5: AB+, 6: AB-, 7: O+, 8: O-

/**
 * فصائل الدم التي يمكن للمتبرع التبرع لها
 * مثال: O- يمكنه التبرع للجميع
 */
export const DONOR_COMPATIBILITY: BloodTypeCompatibility = {
    1: [1, 5],                    // A+ يعطي A+ و AB+
    2: [1, 2, 5, 6],              // A- يعطي A و AB
    3: [3, 5],                    // B+ يعطي B+ و AB+
    4: [3, 4, 5, 6],              // B- يعطي B و AB
    5: [5],                       // AB+ يعطي AB+ فقط
    6: [5, 6],                    // AB- يعطي AB فقط
    7: [1, 3, 5, 7],              // O+ يعطي الإيجابية
    8: [1, 2, 3, 4, 5, 6, 7, 8],  // O- يعطي الجميع (Universal Donor)
};

/**
 * فصائل الدم التي يمكن للمريض استقبالها
 * مثال: AB+ يمكنه استقبال من الجميع
 */
export const RECIPIENT_COMPATIBILITY: BloodTypeCompatibility = {
    1: [1, 2, 7, 8],              // A+ يستقبل من A و O
    2: [2, 8],                    // A- يستقبل من A- و O-
    3: [3, 4, 7, 8],              // B+ يستقبل من B و O
    4: [4, 8],                    // B- يستقبل من B- و O-
    5: [1, 2, 3, 4, 5, 6, 7, 8],  // AB+ يستقبل من الجميع (Universal Recipient)
    6: [2, 4, 6, 8],              // AB- يستقبل من السالبة
    7: [7, 8],                    // O+ يستقبل من O
    8: [8],                       // O- يستقبل من O- فقط
};

/**
 * التحقق من توافق فصيلة دم المتبرع مع فصيلة دم المريض
 * @param donorBloodTypeId - رقم فصيلة دم المتبرع
 * @param patientBloodTypeId - رقم فصيلة دم المريض
 * @returns true إذا كان المتبرع يمكنه التبرع للمريض
 */
export function canDonateToPatient(donorBloodTypeId: number, patientBloodTypeId: number): boolean {
    const compatibleRecipients = DONOR_COMPATIBILITY[donorBloodTypeId];
    return compatibleRecipients?.includes(patientBloodTypeId) || false;
}

/**
 * التحقق من توافق فصيلة دم المريض مع فصيلة دم المتبرع
 * @param patientBloodTypeId - رقم فصيلة دم المريض
 * @param donorBloodTypeId - رقم فصيلة دم المتبرع
 * @returns true إذا كان المريض يمكنه استقبال من المتبرع
 */
export function canReceiveFromDonor(patientBloodTypeId: number, donorBloodTypeId: number): boolean {
    const compatibleDonors = RECIPIENT_COMPATIBILITY[patientBloodTypeId];
    return compatibleDonors?.includes(donorBloodTypeId) || false;
}
