import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicalDocumentsApi } from '@/api';
import type { VerifyMedicalDocumentDto } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export const documentKeys = {
  all: ['medicalDocuments'] as const,
  byDonor: (donorId: number) => [...documentKeys.all, 'donor', donorId] as const,
};

export function useDonorDocuments(donorId: number) {
  return useQuery({
    queryKey: documentKeys.byDonor(donorId),
    queryFn: () => medicalDocumentsApi.getByDonor(donorId),
    enabled: !!donorId,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ donorId, documentType, file }: { donorId: number; documentType: string; file: File }) =>
      medicalDocumentsApi.upload(donorId, documentType, file),
    onSuccess: (response, { donorId }) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: documentKeys.byDonor(donorId) });
        queryClient.invalidateQueries({ queryKey: ['donors'] });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم رفع الوثيقة بنجاح',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في رفع الوثيقة',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'فشل الاتصال بالخادم',
        variant: 'destructive',
      });
    },
  });
}

export function useVerifyDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: VerifyMedicalDocumentDto }) =>
      medicalDocumentsApi.verify(id, data),
    onSuccess: (response) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: documentKeys.all });
        queryClient.invalidateQueries({ queryKey: ['donors'] });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم تحديث حالة الوثيقة',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في تحديث حالة الوثيقة',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'فشل الاتصال بالخادم',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => medicalDocumentsApi.delete(id),
    onSuccess: (response) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: documentKeys.all });
        queryClient.invalidateQueries({ queryKey: ['donors'] });
        toast({
          title: 'تم بنجاح',
          description: response.message || 'تم حذف الوثيقة',
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.message || 'فشل في حذف الوثيقة',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'فشل الاتصال بالخادم',
        variant: 'destructive',
      });
    },
  });
}
