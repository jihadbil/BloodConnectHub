import { useState } from 'react';
import { useAuth } from './useAuth';
import type { RespondResult } from '@/types/blood-request-response';
import type { CreateDonationRequest } from '@/types/api';
import { canDonateToPatient } from '@/lib/bloodCompatibility';
import { donorsApi } from '@/api/donors';
import { donationsApi } from '@/api/donations';
import { bloodRequestsApi } from '@/api/bloodRequests';
import { checkDonationEligibility as checkEligibility } from '@/lib/donorEligibility';

// Blood type mapping for compatibility module
// التفسير الصحيح من API - يطابق BLOOD_TYPE_MAP في api.ts
const COMPATIBILITY_BLOOD_TYPE_MAP: Record<number, string> = {
  1: 'A+',
  2: 'A-',
  3: 'B+',
  4: 'B-',
  5: 'AB+',
  6: 'AB-',
  7: 'O+',
  8: 'O-',
};

/**
 * Hook مخصص للتعامل مع الاستجابة لطلبات الدم
 * 
 * يوفر هذا الـ hook الوظائف اللازمة للتحقق من أهلية المتبرع
 * والتوافق الدموي وتسجيل الاستجابة في النظام
 */
export function useBloodRequestResponse() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, userRole } = useAuth();

  /**
   * التحقق من المصادقة ودور المستخدم
   * 
   * @returns نتيجة التحقق - null إذا كان المستخدم مصادق عليه ولديه دور متبرع، وإلا RespondResult مع الخطأ
   */
  const checkAuthentication = (): RespondResult | null => {
    // التحقق من تسجيل الدخول
    if (!isAuthenticated || !user) {
      return {
        success: false,
        error: 'يجب تسجيل الدخول للاستجابة لطلبات الدم',
        errorType: 'auth',
      };
    }

    // التحقق من دور المستخدم
    if (userRole !== 'donor') {
      return {
        success: false,
        error: 'هذه الميزة متاحة للمتبرعين فقط',
        errorType: 'auth',
      };
    }

    return null;
  };

  /**
   * التحقق من توافق فصيلة الدم
   * 
   * @param requestBloodTypeId - معرف فصيلة الدم المطلوبة
   * @returns نتيجة التحقق - null إذا كانت فصيلة الدم متوافقة، وإلا RespondResult مع الخطأ
   */
  const checkBloodCompatibility = async (requestBloodTypeId: number): Promise<RespondResult | null> => {
    try {
      // Debug: Log user data and request blood type
      console.log("User data in checkBloodCompatibility:", user);
      console.log("Request bloodTypeId:", requestBloodTypeId);
      
      // الحصول على donorID من المستخدم مباشرة
      let donorID = ('donorID' in user! && user!.donorID) || null;
      
      // إذا لم يكن donorID موجود، نحاول الحصول عليه من userId أو userID
      if (!donorID) {
        const userIdToSearch = (user as any)?.userID || (user as any)?.userId || null;
        console.log("Extracted userID from user data:", userIdToSearch);
        
        if (!userIdToSearch) {
          return {
            success: false,
            error: 'لم يتم العثور على معلومات المستخدم. يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى.',
            errorType: 'compatibility',
          };
        }
        
        console.log("donorID not found in user data, fetching all donors to find match...");
        try {
          // جلب جميع المتبرعين والبحث عن المتبرع المرتبط بهذا المستخدم
          const allDonorsResponse = await donorsApi.getAll(1, 1000);
          if (allDonorsResponse.success && allDonorsResponse.data?.items) {
            const matchingDonor = allDonorsResponse.data.items.find(
              (d: any) => d.userID === userIdToSearch
            );
            if (matchingDonor) {
              donorID = matchingDonor.donorID || matchingDonor.donorId;
              console.log("Found matching donor:", matchingDonor);
            }
          }
        } catch (err) {
          console.error("Error fetching donors:", err);
        }
      }
      
      console.log("Final donorID:", donorID);
      
      if (!donorID) {
        return {
          success: false,
          error: 'لم يتم العثور على معلومات المتبرع المرتبطة بحسابك. يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى.',
          errorType: 'compatibility',
        };
      }
      
      // جلب معلومات المتبرع باستخدام donorID
      console.log("Fetching donor with ID:", donorID);
      const donorResponse = await donorsApi.getById(donorID);
      
      if (!donorResponse.success || !donorResponse.data) {
        return {
          success: false,
          error: 'فشل في جلب معلومات المتبرع',
          errorType: 'compatibility',
        };
      }

      const donor = donorResponse.data;
      const donorBloodTypeId = donor.bloodTypeID || donor.bloodTypeId || 0;
      
      console.log("Donor blood type ID:", donorBloodTypeId);
      console.log("Request blood type ID:", requestBloodTypeId);

      // التحقق من التوافق باستخدام دالة canDonateToPatient
      const isCompatible = canDonateToPatient(donorBloodTypeId, requestBloodTypeId);
      
      console.log("Is compatible:", isCompatible);

      if (!isCompatible) {
        const donorBloodType = COMPATIBILITY_BLOOD_TYPE_MAP[donorBloodTypeId] || 'غير معروف';
        const requestBloodType = COMPATIBILITY_BLOOD_TYPE_MAP[requestBloodTypeId] || 'غير معروف';
        
        console.log("Donor blood type name:", donorBloodType);
        console.log("Request blood type name:", requestBloodType);
        
        return {
          success: false,
          error: `عذراً، فصيلة دمك (${donorBloodType}) غير متوافقة مع الفصيلة المطلوبة (${requestBloodType})`,
          errorType: 'compatibility',
        };
      }

      return null;
    } catch (err) {
      console.error("Error in checkBloodCompatibility:", err);
      return {
        success: false,
        error: 'حدث خطأ أثناء التحقق من توافق فصيلة الدم',
        errorType: 'compatibility',
      };
    }
  };

  /**
   * التحقق من أهلية المتبرع للتبرع
   * 
   * @returns نتيجة التحقق - null إذا كان المتبرع مؤهلاً، وإلا RespondResult مع الخطأ
   */
  const checkDonationEligibility = async (): Promise<RespondResult | null> => {
    try {
      // الحصول على donorID من المستخدم مباشرة
      let donorID = ('donorID' in user! && user!.donorID) || null;
      
      // إذا لم يكن donorID موجود، نحاول الحصول عليه من userId أو userID
      if (!donorID) {
        const userIdToSearch = (user as any)?.userID || (user as any)?.userId || null;
        
        if (!userIdToSearch) {
          return {
            success: false,
            error: 'لم يتم العثور على معلومات المستخدم',
            errorType: 'eligibility',
          };
        }
        
        try {
          const allDonorsResponse = await donorsApi.getAll(1, 1000);
          if (allDonorsResponse.success && allDonorsResponse.data?.items) {
            const matchingDonor = allDonorsResponse.data.items.find(
              (d: any) => d.userID === userIdToSearch
            );
            if (matchingDonor) {
              donorID = matchingDonor.donorID || matchingDonor.donorId;
            }
          }
        } catch (err) {
          console.error("Error fetching donors:", err);
        }
      }
      
      if (!donorID) {
        return {
          success: false,
          error: 'لم يتم العثور على معلومات المتبرع المرتبطة بحسابك',
          errorType: 'eligibility',
        };
      }
      
      // جلب معلومات المتبرع باستخدام donorID
      const donorResponse = await donorsApi.getById(donorID);
      
      if (!donorResponse.success || !donorResponse.data) {
        return {
          success: false,
          error: 'فشل في جلب معلومات المتبرع',
          errorType: 'eligibility',
        };
      }

      const donor = donorResponse.data;
      const lastDonationDateStr = donor.lastDonationDate;

      // تحويل تاريخ آخر تبرع من string إلى Date
      const lastDonationDate = lastDonationDateStr ? new Date(lastDonationDateStr) : null;

      // التحقق من الأهلية باستخدام دالة checkDonationEligibility
      const eligibility = checkEligibility(lastDonationDate);

      if (!eligibility.isEligible) {
        // تنسيق التواريخ للعرض
        const lastDonationDateStr = eligibility.lastDonationDate 
          ? eligibility.lastDonationDate.toLocaleDateString('ar-LY')
          : '';
        const nextEligibleDateStr = eligibility.nextEligibleDate 
          ? eligibility.nextEligibleDate.toLocaleDateString('ar-LY')
          : '';
        
        return {
          success: false,
          error: `عذراً، آخر تبرع لك كان في ${lastDonationDateStr}. يمكنك التبرع مرة أخرى في ${nextEligibleDateStr} (بعد ${eligibility.daysUntilEligible} يوم)`,
          errorType: 'eligibility',
        };
      }

      return null;
    } catch (err) {
      console.error("Error in checkDonationEligibility:", err);
      return {
        success: false,
        error: 'حدث خطأ أثناء التحقق من أهلية التبرع',
        errorType: 'eligibility',
      };
    }
  };

  /**
   * الاستجابة لطلب دم
   * 
   * @param requestId - معرف طلب الدم
   * @param requestBloodTypeId - معرف فصيلة الدم المطلوبة
   * @param quantityNeeded - الكمية المطلوبة بالوحدات
   * @returns نتيجة الاستجابة تحتوي على حالة النجاح ومعرف التبرع أو رسالة الخطأ
   */
  const respondToRequest = async (
    requestId: number,
    requestBloodTypeId: number,
    quantityNeeded: number
  ): Promise<RespondResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Task 4.2: Implement authentication checks
      const authError = checkAuthentication();
      if (authError) {
        setError(authError.error || null);
        return authError;
      }

      // Task 4.5: Implement blood compatibility check
      const compatibilityError = await checkBloodCompatibility(requestBloodTypeId);
      if (compatibilityError) {
        setError(compatibilityError.error || null);
        return compatibilityError;
      }

      // Task 4.8: Implement eligibility check
      const eligibilityError = await checkDonationEligibility();
      if (eligibilityError) {
        setError(eligibilityError.error || null);
        return eligibilityError;
      }

      // Task 4.10: Implement donation creation
      try {
        // Get donorID from user directly
        let donorID = ('donorID' in user! && user!.donorID) || null;
        
        // إذا لم يكن donorID موجود، نحاول الحصول عليه من userId أو userID
        if (!donorID) {
          const userIdToSearch = (user as any)?.userID || (user as any)?.userId || null;
          
          if (!userIdToSearch) {
            return {
              success: false,
              error: 'لم يتم العثور على معلومات المستخدم',
              errorType: 'api',
            };
          }
          
          try {
            const allDonorsResponse = await donorsApi.getAll(1, 1000);
            if (allDonorsResponse.success && allDonorsResponse.data?.items) {
              const matchingDonor = allDonorsResponse.data.items.find(
                (d: any) => d.userID === userIdToSearch
              );
              if (matchingDonor) {
                donorID = matchingDonor.donorID || matchingDonor.donorId;
              }
            }
          } catch (err) {
            console.error("Error fetching donors:", err);
          }
        }
        
        if (!donorID) {
          return {
            success: false,
            error: 'لم يتم العثور على معلومات المتبرع المرتبطة بحسابك',
            errorType: 'api',
          };
        }
        
        // Fetch donor information to get complete donor data
        const donorResponse = await donorsApi.getById(donorID);
        
        if (!donorResponse.success || !donorResponse.data) {
          return {
            success: false,
            error: 'فشل في جلب معلومات المتبرع',
            errorType: 'api',
          };
        }

        const donor = donorResponse.data;

        // Build DonationResponse payload with all required fields
        const donationPayload: CreateDonationRequest = {
          donorID: donor.donorID || donor.donorId || 0,
          bloodTypeID: requestBloodTypeId,
          donationDate: new Date().toISOString(),
          quantity: quantityNeeded,
          testResult: 0, // Pending
          notes: `Response to request #${requestId}`,
        };

        // Call POST /api/donations endpoint
        const donationResponse = await donationsApi.create(donationPayload);

        if (!donationResponse.success || !donationResponse.data) {
          return {
            success: false,
            error: donationResponse.message || 'فشل في تسجيل التبرع',
            errorType: 'api',
          };
        }

        const donationId = donationResponse.data.donationId;

        // Task 4.12: Implement request fulfillment
        try {
          const fulfillPayload = {
            donationId,
            quantity: quantityNeeded,
          };

          const fulfillResponse = await bloodRequestsApi.fulfill(requestId, fulfillPayload);

          if (!fulfillResponse.success) {
            return {
              success: false,
              error: fulfillResponse.message || 'فشل في ربط التبرع بالطلب',
              errorType: 'api',
            };
          }

          return {
            success: true,
            donationId,
          };
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء ربط التبرع بالطلب';
          return {
            success: false,
            error: errorMessage,
            errorType: 'api',
          };
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء تسجيل التبرع';
        return {
          success: false,
          error: errorMessage,
          errorType: 'api',
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        errorType: 'unknown',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    respondToRequest,
    isLoading,
    error,
  };
}
