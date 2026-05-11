import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ResponsesList } from './ResponsesList';
import { useDonorResponses } from '@/hooks/useDonorResponses';
import { DonorResponse, ResponseStatus } from '@/types/donor-response';
import userEvent from '@testing-library/user-event';

// Mock the hook
vi.mock('@/hooks/useDonorResponses');

// Mock ResponseCard component
vi.mock('./ResponseCard', () => ({
  ResponseCard: ({ response, onStatusChange, onCancel, showActions }: any) => (
    <div data-testid={`response-card-${response.responseId}`}>
      <div>{response.donorName}</div>
      <div>{response.patientName}</div>
      <div>{response.status}</div>
      {showActions && <div data-testid="actions-enabled">Actions</div>}
      {onStatusChange && (
        <button onClick={() => onStatusChange(response.responseId, ResponseStatus.Confirmed)}>
          Change Status
        </button>
      )}
      {onCancel && (
        <button onClick={() => onCancel(response.responseId, 'test reason')}>
          Cancel
        </button>
      )}
    </div>
  )
}));

const createMockResponse = (overrides?: Partial<DonorResponse>): DonorResponse => ({
  responseId: 1,
  donorId: 10,
  donorName: 'أحمد محمد',
  donorPhone: '01234567890',
  bloodTypeName: 'A+',
  requestId: 5,
  patientName: 'محمد علي',
  urgencyLevel: 'Urgent',
  status: ResponseStatus.Interested,
  statusDescription: 'مهتم',
  responseDate: '2024-01-15T10:00:00Z',
  createdAt: '2024-01-15T10:00:00Z',
  ...overrides
});

describe('ResponsesList', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderWithQuery = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  describe('Loading State', () => {
    it('should display loading skeletons when data is loading', () => {
      vi.mocked(useDonorResponses).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      const { container } = renderWithQuery(<ResponsesList requestId={5} />);

      // Should show skeleton loaders with animate-pulse class
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should call useDonorResponses with requestId filter', () => {
      vi.mocked(useDonorResponses).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      renderWithQuery(<ResponsesList requestId={5} />);

      expect(useDonorResponses).toHaveBeenCalledWith({
        requestId: 5,
        donorId: undefined
      });
    });

    it('should call useDonorResponses with donorId filter', () => {
      vi.mocked(useDonorResponses).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      renderWithQuery(<ResponsesList donorId={10} />);

      expect(useDonorResponses).toHaveBeenCalledWith({
        requestId: undefined,
        donorId: 10
      });
    });
  });

  describe('Error State', () => {
    it('should display error message when fetch fails', () => {
      const errorMessage = 'فشل في جلب الاستجابات';
      vi.mocked(useDonorResponses).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error(errorMessage),
      } as any);

      renderWithQuery(<ResponsesList requestId={5} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should display generic error message for non-Error objects', () => {
      vi.mocked(useDonorResponses).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: 'string error',
      } as any);

      renderWithQuery(<ResponsesList requestId={5} />);

      expect(screen.getByText('حدث خطأ أثناء تحميل الاستجابات')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display empty message when no responses for requestId', () => {
      vi.mocked(useDonorResponses).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(<ResponsesList requestId={5} />);

      expect(screen.getByText('لا توجد استجابات')).toBeInTheDocument();
      expect(screen.getByText('لم يتم العثور على استجابات لهذا الطلب')).toBeInTheDocument();
    });

    it('should display empty message when no responses for donorId', () => {
      vi.mocked(useDonorResponses).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(<ResponsesList donorId={10} />);

      expect(screen.getByText('لا توجد استجابات')).toBeInTheDocument();
      expect(screen.getByText('لم يتم العثور على استجابات لهذا المتبرع')).toBeInTheDocument();
    });

    it('should display generic empty message when no filter provided', () => {
      vi.mocked(useDonorResponses).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(<ResponsesList />);

      expect(screen.getByText('لا توجد استجابات')).toBeInTheDocument();
      expect(screen.getByText('لا توجد استجابات متاحة')).toBeInTheDocument();
    });

    it('should handle undefined responses as empty', () => {
      vi.mocked(useDonorResponses).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(<ResponsesList requestId={5} />);

      expect(screen.getByText('لا توجد استجابات')).toBeInTheDocument();
    });
  });

  describe('Success State - Rendering Responses', () => {
    it('should render list of responses', () => {
      const mockResponses = [
        createMockResponse({ responseId: 1, donorName: 'أحمد محمد' }),
        createMockResponse({ responseId: 2, donorName: 'فاطمة علي' }),
        createMockResponse({ responseId: 3, donorName: 'محمود حسن' })
      ];

      vi.mocked(useDonorResponses).mockReturnValue({
        data: mockResponses,
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(<ResponsesList requestId={5} />);

      expect(screen.getByTestId('response-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('response-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('response-card-3')).toBeInTheDocument();
      expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
      expect(screen.getByText('فاطمة علي')).toBeInTheDocument();
      expect(screen.getByText('محمود حسن')).toBeInTheDocument();
    });

    it('should render single response', () => {
      const mockResponse = createMockResponse({ responseId: 1, donorName: 'أحمد محمد' });

      vi.mocked(useDonorResponses).mockReturnValue({
        data: [mockResponse],
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(<ResponsesList requestId={5} />);

      expect(screen.getByTestId('response-card-1')).toBeInTheDocument();
      expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
    });
  });

  describe('Response Click Interaction', () => {
    it('should call onResponseClick when response is clicked', async () => {
      const user = userEvent.setup();
      const mockResponse = createMockResponse({ responseId: 1 });
      const onResponseClick = vi.fn();

      vi.mocked(useDonorResponses).mockReturnValue({
        data: [mockResponse],
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(
        <ResponsesList requestId={5} onResponseClick={onResponseClick} />
      );

      const card = screen.getByTestId('response-card-1');
      await user.click(card);

      expect(onResponseClick).toHaveBeenCalledWith(mockResponse);
      expect(onResponseClick).toHaveBeenCalledTimes(1);
    });

    it('should add cursor-pointer class when onResponseClick is provided', () => {
      const mockResponse = createMockResponse({ responseId: 1 });
      const onResponseClick = vi.fn();

      vi.mocked(useDonorResponses).mockReturnValue({
        data: [mockResponse],
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(
        <ResponsesList requestId={5} onResponseClick={onResponseClick} />
      );

      const wrapper = screen.getByTestId('response-card-1').parentElement;
      expect(wrapper).toHaveClass('cursor-pointer');
    });

    it('should not add cursor-pointer class when onResponseClick is not provided', () => {
      const mockResponse = createMockResponse({ responseId: 1 });

      vi.mocked(useDonorResponses).mockReturnValue({
        data: [mockResponse],
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(<ResponsesList requestId={5} />);

      const wrapper = screen.getByTestId('response-card-1').parentElement;
      expect(wrapper).not.toHaveClass('cursor-pointer');
    });
  });

  describe('Action Handlers', () => {
    it('should pass onStatusChange to ResponseCard', async () => {
      const user = userEvent.setup();
      const mockResponse = createMockResponse({ responseId: 1 });
      const onStatusChange = vi.fn();

      vi.mocked(useDonorResponses).mockReturnValue({
        data: [mockResponse],
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(
        <ResponsesList 
          requestId={5} 
          onStatusChange={onStatusChange}
          showActions={true}
        />
      );

      const button = screen.getByText('Change Status');
      await user.click(button);

      expect(onStatusChange).toHaveBeenCalledWith(1, ResponseStatus.Confirmed);
    });

    it('should pass onCancel to ResponseCard', async () => {
      const user = userEvent.setup();
      const mockResponse = createMockResponse({ responseId: 1 });
      const onCancel = vi.fn();

      vi.mocked(useDonorResponses).mockReturnValue({
        data: [mockResponse],
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(
        <ResponsesList 
          requestId={5} 
          onCancel={onCancel}
          showActions={true}
        />
      );

      const button = screen.getByText('Cancel');
      await user.click(button);

      expect(onCancel).toHaveBeenCalledWith(1, 'test reason');
    });

    it('should pass showActions prop to ResponseCard', () => {
      const mockResponse = createMockResponse({ responseId: 1 });

      vi.mocked(useDonorResponses).mockReturnValue({
        data: [mockResponse],
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(
        <ResponsesList requestId={5} showActions={true} />
      );

      expect(screen.getByTestId('actions-enabled')).toBeInTheDocument();
    });

    it('should not show actions when showActions is false', () => {
      const mockResponse = createMockResponse({ responseId: 1 });

      vi.mocked(useDonorResponses).mockReturnValue({
        data: [mockResponse],
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(
        <ResponsesList requestId={5} showActions={false} />
      );

      expect(screen.queryByTestId('actions-enabled')).not.toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('should filter by requestId', () => {
      const mockResponses = [
        createMockResponse({ responseId: 1, requestId: 5 }),
        createMockResponse({ responseId: 2, requestId: 5 })
      ];

      vi.mocked(useDonorResponses).mockReturnValue({
        data: mockResponses,
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(<ResponsesList requestId={5} />);

      expect(useDonorResponses).toHaveBeenCalledWith({
        requestId: 5,
        donorId: undefined
      });
      expect(screen.getByTestId('response-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('response-card-2')).toBeInTheDocument();
    });

    it('should filter by donorId', () => {
      const mockResponses = [
        createMockResponse({ responseId: 1, donorId: 10 }),
        createMockResponse({ responseId: 2, donorId: 10 })
      ];

      vi.mocked(useDonorResponses).mockReturnValue({
        data: mockResponses,
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(<ResponsesList donorId={10} />);

      expect(useDonorResponses).toHaveBeenCalledWith({
        requestId: undefined,
        donorId: 10
      });
      expect(screen.getByTestId('response-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('response-card-2')).toBeInTheDocument();
    });

    it('should handle both filters being undefined', () => {
      vi.mocked(useDonorResponses).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any);

      renderWithQuery(<ResponsesList />);

      expect(useDonorResponses).toHaveBeenCalledWith({
        requestId: undefined,
        donorId: undefined
      });
    });
  });
});
