// React Query hooks for Authentication API
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import type { LoginRequest, RegisterRequest, ChangePasswordRequest, ApiUser } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

// Extended type for auth response (includes token if provided by backend)
export interface AuthResponse extends ApiUser {
    token?: string;
}

// Query keys
export const authKeys = {
    all: ['auth'] as const,
    user: () => [...authKeys.all, 'user'] as const,
};

/**
 * تسجيل الدخول
 */
export function useLogin() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
        onSuccess: (response) => {
            if (response.success && response.data) {
                // Store user data in localStorage
                localStorage.setItem('api_user', JSON.stringify(response.data));

                // If the API returns a token, store it
                const authResponse = response.data as AuthResponse;
                if (authResponse.token) {
                    localStorage.setItem('api_token', authResponse.token);
                }

                queryClient.setQueryData(authKeys.user(), response.data);
                toast({
                    title: 'تم تسجيل الدخول',
                    description: `مرحباً ${response.data.fullName}`,
                });
            } else {
                toast({
                    title: 'خطأ في تسجيل الدخول',
                    description: response.message || 'البيانات غير صحيحة',
                    variant: 'destructive',
                });
            }
        },
        onError: (error: Error) => {
            toast({
                title: 'خطأ',
                description: error.message || 'فشل الاتصال بالخادم',
                variant: 'destructive',
            });
        },
    });
}

/**
 * إنشاء حساب جديد
 */
export function useRegister() {
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: RegisterRequest) => authApi.register(data),
        onSuccess: (response) => {
            if (response.success && response.data) {
                // Store user data
                localStorage.setItem('api_user', JSON.stringify(response.data));

                const authResponse = response.data as AuthResponse;
                if (authResponse.token) {
                    localStorage.setItem('api_token', authResponse.token);
                }

                toast({
                    title: 'تم التسجيل بنجاح',
                    description: 'مرحباً بك في Blood Connect',
                });
            } else {
                toast({
                    title: 'خطأ في التسجيل',
                    description: response.message || 'فشل في إنشاء الحساب',
                    variant: 'destructive',
                });
            }
        },
        onError: (error: Error) => {
            toast({
                title: 'خطأ',
                description: error.message || 'فشل الاتصال بالخادم',
                variant: 'destructive',
            });
        },
    });
}

/**
 * تغيير كلمة المرور
 */
export function useChangePassword() {
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
        onSuccess: (response) => {
            if (response.success) {
                toast({
                    title: 'تم بنجاح',
                    description: 'تم تغيير كلمة المرور',
                });
            } else {
                toast({
                    title: 'خطأ',
                    description: response.message || 'فشل في تغيير كلمة المرور',
                    variant: 'destructive',
                });
            }
        },
        onError: (error: Error) => {
            toast({
                title: 'خطأ',
                description: error.message || 'فشل الاتصال بالخادم',
                variant: 'destructive',
            });
        },
    });
}

/**
 * تسجيل الخروج
 */
export function useLogout() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async () => {
            // Clear local storage
            localStorage.removeItem('api_user');
            localStorage.removeItem('api_token');
            return { success: true };
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: authKeys.user() });
            toast({
                title: 'تسجيل الخروج',
                description: 'تم تسجيل الخروج بنجاح',
            });
        },
    });
}

/**
 * Get stored API user
 */
export function getStoredApiUser(): ApiUser | null {
    const stored = localStorage.getItem('api_user');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    }
    return null;
}

/**
 * Get stored API token
 */
export function getStoredApiToken(): string | null {
    return localStorage.getItem('api_token');
}

/**
 * Check if user is logged in via API
 */
export function isApiAuthenticated(): boolean {
    return !!getStoredApiUser();
}
