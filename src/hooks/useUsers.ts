// React Query hooks for Users API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import { useToast } from '@/hooks/use-toast';
import type { UpdateApplicationUserDto } from '@/types/api';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, searchTerm?: string) => [...userKeys.lists(), { page, pageSize, searchTerm }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  roles: (id: string) => [...userKeys.detail(id), 'roles'] as const,
};

export function useUsers(page = 1, pageSize = 10, searchTerm?: string) {
  return useQuery({
    queryKey: userKeys.list(page, pageSize, searchTerm),
    queryFn: () => usersApi.getAll(page, pageSize, searchTerm),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

export function useUserWithDonor(id: string) {
  return useQuery({
    queryKey: [...userKeys.detail(id), 'withDonor'],
    queryFn: () => usersApi.getWithDonor(id),
    enabled: !!id,
  });
}

export function useUserRoles(id: string) {
  return useQuery({
    queryKey: userKeys.roles(id),
    queryFn: () => usersApi.getRoles(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationUserDto }) =>
      usersApi.update(id, data),
    onSuccess: (response, { id }) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم تحديث بيانات المستخدم',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في تحديث بيانات المستخدم',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'خطأ في التحديث',
        description: 'فشل في تحديث بيانات المستخدم، تحقق من الاتصال بالخادم',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: (response) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم حذف المستخدم',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في حذف المستخدم',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'خطأ في الحذف',
        description: 'فشل في حذف المستخدم، تحقق من الاتصال بالخادم',
        variant: 'destructive',
      });
    },
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => usersApi.toggleActive(id),
    onSuccess: (response, id) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم تحديث حالة الحساب',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في تحديث حالة الحساب',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث حالة الحساب، تحقق من الاتصال بالخادم',
        variant: 'destructive',
      });
    },
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, roleName }: { userId: string; roleName: string }) =>
      usersApi.assignRole(userId, roleName),
    onSuccess: (response, { userId }) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
        queryClient.invalidateQueries({ queryKey: userKeys.roles(userId) });
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم تعيين الدور بنجاح',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في تعيين الدور',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'خطأ في تعيين الدور',
        description: 'فشل في تعيين الدور، تحقق من الاتصال بالخادم',
        variant: 'destructive',
      });
    },
  });
}

export function useRemoveRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, roleName }: { userId: string; roleName: string }) =>
      usersApi.removeRole(userId, roleName),
    onSuccess: (response, { userId }) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
        queryClient.invalidateQueries({ queryKey: userKeys.roles(userId) });
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم إزالة الدور بنجاح',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في إزالة الدور',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'خطأ في إزالة الدور',
        description: 'فشل في إزالة الدور، تحقق من الاتصال بالخادم',
        variant: 'destructive',
      });
    },
  });
}
