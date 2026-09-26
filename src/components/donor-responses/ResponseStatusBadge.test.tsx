import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResponseStatusBadge } from './ResponseStatusBadge';
import { ResponseStatus } from '@/types/donor-response';

describe('ResponseStatusBadge', () => {
  it('renders Interested status with correct label and color', () => {
    const { container } = render(<ResponseStatusBadge status={ResponseStatus.Interested} />);
    expect(screen.getByText('مهتم بالتبرع')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('renders Confirmed status with correct label and color', () => {
    const { container } = render(<ResponseStatusBadge status={ResponseStatus.Confirmed} />);
    expect(screen.getByText('تم التأكيد')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-purple-100', 'text-purple-800');
  });

  it('renders Donated status with correct label and color', () => {
    const { container } = render(<ResponseStatusBadge status={ResponseStatus.Donated} />);
    expect(screen.getByText('تم التبرع')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('renders Rejected status with correct label and color', () => {
    const { container } = render(<ResponseStatusBadge status={ResponseStatus.Rejected} />);
    expect(screen.getByText('مرفوض')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('renders NoShow status with correct label and color', () => {
    const { container } = render(<ResponseStatusBadge status={ResponseStatus.NoShow} />);
    expect(screen.getByText('لم يحضر')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-orange-100', 'text-orange-800');
  });

  it('renders Cancelled status with correct label and color', () => {
    const { container } = render(<ResponseStatusBadge status={ResponseStatus.Cancelled} />);
    expect(screen.getByText('ملغى')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('applies custom className', () => {
    const { container } = render(
      <ResponseStatusBadge status={ResponseStatus.Donated} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
