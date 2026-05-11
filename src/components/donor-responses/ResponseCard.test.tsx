import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResponseCard } from './ResponseCard';
import { DonorResponse, ResponseStatus } from '@/types/donor-response';

// Mock response data factory
const createMockResponse = (overrides?: Partial<DonorResponse>): DonorResponse => ({
  responseId: 1,
  donorId: 10,
  donorName: 'أحمد محمد',
  donorPhone: '0912345678',
  bloodTypeName: 'A+',
  requestId: 5,
  patientName: 'فاطمة علي',
  urgencyLevel: 'Urgent',
  status: ResponseStatus.Interested,
  statusDescription: 'مهتم',
  responseDate: '2024-01-15T10:00:00Z',
  createdAt: '2024-01-15T10:00:00Z',
  ...overrides
});

describe('ResponseCard', () => {
  describe('Display Requirements', () => {
    it('should display donor information (name, phone, blood type)', () => {
      const response = createMockResponse();
      render(<ResponseCard response={response} />);

      // Validates: Requirement 2.2 - donor information
      expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
      expect(screen.getByText('0912345678')).toBeInTheDocument();
      expect(screen.getByText('A+')).toBeInTheDocument();
    });

    it('should display request information (patient name, urgency level)', () => {
      const response = createMockResponse();
      render(<ResponseCard response={response} />);

      // Validates: Requirement 2.3 - request information
      expect(screen.getByText(/فاطمة علي/)).toBeInTheDocument();
      expect(screen.getByText('عاجل')).toBeInTheDocument(); // Urgent in Arabic
    });

    it('should display ResponseStatusBadge', () => {
      const response = createMockResponse();
      render(<ResponseCard response={response} />);

      // Validates: Requirement 2.1 - status badge
      expect(screen.getByText('مهتم')).toBeInTheDocument(); // Interested status
    });

    it('should display notes when present', () => {
      const response = createMockResponse({
        notes: 'يمكنني الحضور يوم الأحد'
      });
      render(<ResponseCard response={response} />);

      expect(screen.getByText('ملاحظات:')).toBeInTheDocument();
      expect(screen.getByText('يمكنني الحضور يوم الأحد')).toBeInTheDocument();
    });

    it('should display rejection reason when present', () => {
      const response = createMockResponse({
        status: ResponseStatus.Rejected,
        rejectionReason: 'غير متاح في الوقت الحالي'
      });
      render(<ResponseCard response={response} />);

      expect(screen.getByText('سبب الرفض/الإلغاء:')).toBeInTheDocument();
      expect(screen.getByText('غير متاح في الوقت الحالي')).toBeInTheDocument();
    });

    it('should display timestamps in local format', () => {
      const response = createMockResponse({
        responseDate: '2024-01-15T10:00:00Z',
        confirmedAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z'
      });
      render(<ResponseCard response={response} />);

      // Validates: Requirement 2.4, 10.5 - timestamps in ISO 8601 format
      expect(screen.getByText(/تاريخ الاستجابة:/)).toBeInTheDocument();
      expect(screen.getByText(/تاريخ التأكيد:/)).toBeInTheDocument();
      expect(screen.getByText(/آخر تحديث:/)).toBeInTheDocument();
    });

    it('should not display confirmedAt if not set', () => {
      const response = createMockResponse({
        confirmedAt: undefined
      });
      render(<ResponseCard response={response} />);

      expect(screen.queryByText(/تاريخ التأكيد:/)).not.toBeInTheDocument();
    });

    it('should not display updatedAt if not set', () => {
      const response = createMockResponse({
        updatedAt: undefined
      });
      render(<ResponseCard response={response} />);

      expect(screen.queryByText(/آخر تحديث:/)).not.toBeInTheDocument();
    });
  });

  describe('Urgency Level Display', () => {
    it('should display Emergency urgency with correct styling', () => {
      const response = createMockResponse({
        urgencyLevel: 'Emergency'
      });
      render(<ResponseCard response={response} />);

      const urgencyBadge = screen.getByText('طارئ');
      expect(urgencyBadge).toBeInTheDocument();
      expect(urgencyBadge).toHaveClass('text-red-600');
    });

    it('should display Urgent urgency with correct styling', () => {
      const response = createMockResponse({
        urgencyLevel: 'Urgent'
      });
      render(<ResponseCard response={response} />);

      const urgencyBadge = screen.getByText('عاجل');
      expect(urgencyBadge).toBeInTheDocument();
      expect(urgencyBadge).toHaveClass('text-orange-600');
    });

    it('should display Normal urgency with correct styling', () => {
      const response = createMockResponse({
        urgencyLevel: 'Normal'
      });
      render(<ResponseCard response={response} />);

      const urgencyBadge = screen.getByText('عادي');
      expect(urgencyBadge).toBeInTheDocument();
      expect(urgencyBadge).toHaveClass('text-blue-600');
    });
  });

  describe('Action Buttons - Interested Status', () => {
    it('should show confirm and reject buttons when status is Interested and showActions=true', () => {
      const response = createMockResponse({
        status: ResponseStatus.Interested
      });
      render(<ResponseCard response={response} showActions={true} />);

      // Validates: Requirement 5.1 - state transitions from Interested
      expect(screen.getByText('تأكيد')).toBeInTheDocument();
      expect(screen.getByText('رفض')).toBeInTheDocument();
      expect(screen.getByText('إلغاء')).toBeInTheDocument();
    });

    it('should call onStatusChange with Confirmed when confirm button clicked', () => {
      const onStatusChange = vi.fn();
      const response = createMockResponse({
        status: ResponseStatus.Interested
      });
      render(
        <ResponseCard 
          response={response} 
          showActions={true} 
          onStatusChange={onStatusChange}
        />
      );

      fireEvent.click(screen.getByText('تأكيد'));
      expect(onStatusChange).toHaveBeenCalledWith(1, ResponseStatus.Confirmed);
    });

    it('should call onStatusChange with Rejected when reject button clicked', () => {
      const onStatusChange = vi.fn();
      const response = createMockResponse({
        status: ResponseStatus.Interested
      });
      render(
        <ResponseCard 
          response={response} 
          showActions={true} 
          onStatusChange={onStatusChange}
        />
      );

      fireEvent.click(screen.getByText('رفض'));
      expect(onStatusChange).toHaveBeenCalledWith(1, ResponseStatus.Rejected);
    });
  });

  describe('Action Buttons - Confirmed Status', () => {
    it('should show donated and no-show buttons when status is Confirmed and showActions=true', () => {
      const response = createMockResponse({
        status: ResponseStatus.Confirmed
      });
      render(<ResponseCard response={response} showActions={true} />);

      // Validates: Requirement 5.1 - state transitions from Confirmed
      expect(screen.getByText('تم التبرع')).toBeInTheDocument();
      expect(screen.getByText('لم يحضر')).toBeInTheDocument();
      expect(screen.getByText('إلغاء')).toBeInTheDocument();
    });

    it('should call onStatusChange with Donated when donated button clicked', () => {
      const onStatusChange = vi.fn();
      const response = createMockResponse({
        status: ResponseStatus.Confirmed
      });
      render(
        <ResponseCard 
          response={response} 
          showActions={true} 
          onStatusChange={onStatusChange}
        />
      );

      fireEvent.click(screen.getByText('تم التبرع'));
      expect(onStatusChange).toHaveBeenCalledWith(1, ResponseStatus.Donated);
    });

    it('should call onStatusChange with NoShow when no-show button clicked', () => {
      const onStatusChange = vi.fn();
      const response = createMockResponse({
        status: ResponseStatus.Confirmed
      });
      render(
        <ResponseCard 
          response={response} 
          showActions={true} 
          onStatusChange={onStatusChange}
        />
      );

      fireEvent.click(screen.getByText('لم يحضر'));
      expect(onStatusChange).toHaveBeenCalledWith(1, ResponseStatus.NoShow);
    });
  });

  describe('Action Buttons - NoShow Status', () => {
    it('should show re-confirm button when status is NoShow and showActions=true', () => {
      const response = createMockResponse({
        status: ResponseStatus.NoShow
      });
      render(<ResponseCard response={response} showActions={true} />);

      // Validates: Requirement 5.1 - state transitions from NoShow
      expect(screen.getByText('إعادة التأكيد')).toBeInTheDocument();
      expect(screen.getByText('إلغاء')).toBeInTheDocument();
    });

    it('should call onStatusChange with Confirmed when re-confirm button clicked', () => {
      const onStatusChange = vi.fn();
      const response = createMockResponse({
        status: ResponseStatus.NoShow
      });
      render(
        <ResponseCard 
          response={response} 
          showActions={true} 
          onStatusChange={onStatusChange}
        />
      );

      fireEvent.click(screen.getByText('إعادة التأكيد'));
      expect(onStatusChange).toHaveBeenCalledWith(1, ResponseStatus.Confirmed);
    });
  });

  describe('Action Buttons - Terminal States', () => {
    it('should not show any action buttons when status is Donated', () => {
      const response = createMockResponse({
        status: ResponseStatus.Donated
      });
      render(<ResponseCard response={response} showActions={true} />);

      // Validates: Requirement 5.6 - terminal state protection
      expect(screen.queryByText('تأكيد')).not.toBeInTheDocument();
      expect(screen.queryByText('رفض')).not.toBeInTheDocument();
      expect(screen.queryByText('إلغاء')).not.toBeInTheDocument();
    });

    it('should not show any action buttons when status is Cancelled', () => {
      const response = createMockResponse({
        status: ResponseStatus.Cancelled
      });
      render(<ResponseCard response={response} showActions={true} />);

      // Validates: Requirement 5.7 - terminal state protection
      expect(screen.queryByText('تأكيد')).not.toBeInTheDocument();
      expect(screen.queryByText('رفض')).not.toBeInTheDocument();
      expect(screen.queryByText('إلغاء')).not.toBeInTheDocument();
    });
  });

  describe('Cancel Button', () => {
    it('should show cancel button for non-terminal states', () => {
      const statuses = [
        ResponseStatus.Interested,
        ResponseStatus.Confirmed,
        ResponseStatus.Rejected,
        ResponseStatus.NoShow
      ];

      statuses.forEach(status => {
        const { unmount } = render(
          <ResponseCard 
            response={createMockResponse({ status })} 
            showActions={true} 
          />
        );
        expect(screen.getByText('إلغاء')).toBeInTheDocument();
        unmount();
      });
    });

    it('should call onCancel with reason when cancel button clicked and reason provided', () => {
      const onCancel = vi.fn();
      const response = createMockResponse({
        status: ResponseStatus.Interested
      });

      // Mock window.prompt
      vi.spyOn(window, 'prompt').mockReturnValue('لا أستطيع الحضور');

      render(
        <ResponseCard 
          response={response} 
          showActions={true} 
          onCancel={onCancel}
        />
      );

      fireEvent.click(screen.getByText('إلغاء'));
      
      // Validates: Requirement 6.1, 6.2 - cancellation requires reason
      expect(onCancel).toHaveBeenCalledWith(1, 'لا أستطيع الحضور');
    });

    it('should not call onCancel when cancel button clicked but no reason provided', () => {
      const onCancel = vi.fn();
      const response = createMockResponse({
        status: ResponseStatus.Interested
      });

      // Mock window.prompt to return null (user cancelled)
      vi.spyOn(window, 'prompt').mockReturnValue(null);

      render(
        <ResponseCard 
          response={response} 
          showActions={true} 
          onCancel={onCancel}
        />
      );

      fireEvent.click(screen.getByText('إلغاء'));
      expect(onCancel).not.toHaveBeenCalled();
    });

    it('should not call onCancel when empty reason provided', () => {
      const onCancel = vi.fn();
      const response = createMockResponse({
        status: ResponseStatus.Interested
      });

      // Mock window.prompt to return empty string
      vi.spyOn(window, 'prompt').mockReturnValue('   ');

      render(
        <ResponseCard 
          response={response} 
          showActions={true} 
          onCancel={onCancel}
        />
      );

      fireEvent.click(screen.getByText('إلغاء'));
      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('showActions Prop', () => {
    it('should not show action buttons when showActions is false', () => {
      const response = createMockResponse({
        status: ResponseStatus.Interested
      });
      render(<ResponseCard response={response} showActions={false} />);

      expect(screen.queryByText('تأكيد')).not.toBeInTheDocument();
      expect(screen.queryByText('رفض')).not.toBeInTheDocument();
      expect(screen.queryByText('إلغاء')).not.toBeInTheDocument();
    });

    it('should not show action buttons when showActions is undefined (default)', () => {
      const response = createMockResponse({
        status: ResponseStatus.Interested
      });
      render(<ResponseCard response={response} />);

      expect(screen.queryByText('تأكيد')).not.toBeInTheDocument();
      expect(screen.queryByText('رفض')).not.toBeInTheDocument();
      expect(screen.queryByText('إلغاء')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing optional fields gracefully', () => {
      const response = createMockResponse({
        notes: undefined,
        rejectionReason: undefined,
        confirmedAt: undefined,
        updatedAt: undefined
      });
      
      render(<ResponseCard response={response} />);

      // Should still render without errors
      expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
      expect(screen.queryByText('ملاحظات:')).not.toBeInTheDocument();
      expect(screen.queryByText('سبب الرفض/الإلغاء:')).not.toBeInTheDocument();
    });

    it('should handle long text content without breaking layout', () => {
      const longNote = 'هذا نص طويل جداً '.repeat(20);
      const response = createMockResponse({
        notes: longNote
      });
      
      const { container } = render(<ResponseCard response={response} />);
      // Use a more flexible matcher since long text may be split across elements
      expect(container.textContent).toContain('هذا نص طويل جداً');
    });

    it('should handle special characters in phone number', () => {
      const response = createMockResponse({
        donorPhone: '+218-91-234-5678'
      });
      
      render(<ResponseCard response={response} />);
      expect(screen.getByText('+218-91-234-5678')).toBeInTheDocument();
    });
  });
});
