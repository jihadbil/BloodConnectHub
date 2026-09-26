import { describe, it, expect } from 'vitest';

// We can extract/import translateApiError or define a copy of it to test, 
// or test the actual function by importing it if it's exported, but it's not exported.
// Wait! Let's export it from Register.tsx and StaffRegister.tsx so we can test it directly!
// Or we can import Register and check its behavior, but testing the pure function is cleaner.
// Let's modify Register.tsx and StaffRegister.tsx to export translateApiError.

import { translateApiError as donorTranslate } from './Register';
import { translateApiError as staffTranslate } from './StaffRegister';

describe('Registration Error Translation Bugfix', () => {
  it('should translate Username already taken errors correctly (donor registration)', () => {
    const error1 = "Username 'masoud' is already taken.";
    const result1 = donorTranslate(error1);
    expect(result1).toBe('اسم المستخدم مسجل مسبقاً، يرجى اختيار اسم آخر');

    const error2 = "Username 'admin' is already taken.";
    const result2 = donorTranslate(error2);
    expect(result2).toBe('اسم المستخدم مسجل مسبقاً، يرجى اختيار اسم آخر');
  });

  it('should translate Email already taken errors correctly (donor registration)', () => {
    const error = "Email 'test@example.com' is already taken.";
    const result = donorTranslate(error);
    expect(result).toBe('البريد الإلكتروني مسجل مسبقاً');
  });

  it('should translate Username already taken errors correctly (staff registration)', () => {
    const error = "Username 'masoud' is already taken.";
    const result = staffTranslate(error);
    expect(result).toBe('اسم المستخدم مسجل مسبقاً، يرجى اختيار اسم آخر');
  });

  it('should translate multiple errors separated by comma (donor registration)', () => {
    const multipleErrors = "Username 'masoud' is already taken., Email 'test@example.com' is already taken.";
    const result = donorTranslate(multipleErrors);
    expect(result).toBe('اسم المستخدم مسجل مسبقاً، يرجى اختيار اسم آخر • البريد الإلكتروني مسجل مسبقاً');
  });
});

// React components rendering and interaction tests
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
import * as useAuthModule from '@/hooks/useAuth';
import { vi } from 'vitest';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    signUp: vi.fn(),
    signIn: vi.fn(),
  }),
}));

// Mock donorsApi to prevent real calls
vi.mock('@/api/donors', () => ({
  donorsApi: {
    create: vi.fn().mockResolvedValue({ isSuccess: true }),
  },
}));

// Mock UI Select with native select for simple testing
vi.mock('@/components/ui/select', () => {
  return {
    Select: ({ children, value, onValueChange }: any) => (
      <select value={value} onChange={(e) => onValueChange(e.target.value)}>
        {children}
      </select>
    ),
    SelectTrigger: ({ children }: any) => <>{children}</>,
    SelectValue: ({ placeholder }: any) => <option value="">{placeholder}</option>,
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  };
});

describe('Register Component - National ID Validation', () => {
  const renderRegister = () => {
    return render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  };

  it('should show error when first digit is not 1 or 2', async () => {
    const { container } = renderRegister();

    // Fill standard fields
    fireEvent.change(screen.getByPlaceholderText('أدخل اسم المستخدم'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('أدخل البريد الإلكتروني'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('أدخل الاسم الكامل'), { target: { value: 'مستحدم تجريبي' } });
    fireEvent.change(container.querySelector('#password')!, { target: { value: '1234' } });
    fireEvent.change(container.querySelector('#confirmPassword')!, { target: { value: '1234' } });
    fireEvent.change(screen.getByPlaceholderText('09xxxxxxxx'), { target: { value: '0912345678' } });
    
    // Select gender - Male (first select element)
    const selects = container.querySelectorAll('select');
    fireEvent.change(selects[0], { target: { value: 'Male' } });
    
    // Select Blood type (second select element)
    fireEvent.change(selects[1], { target: { value: 'A+' } });

    // Fill incorrect National ID (starts with 3)
    fireEvent.change(screen.getByPlaceholderText('أدخل الرقم الوطني'), { target: { value: '319951234567' } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'تسجيل كمتبرع' }));

    expect(await screen.findByText('الرقم الوطني يجب أن يبدأ بالرقم 1 (للذكور) أو 2 (للإناث)')).toBeInTheDocument();
  });

  it('should show error when gender is Male but first digit is 2 (Female)', async () => {
    const { container } = renderRegister();

    // Fill standard fields
    fireEvent.change(screen.getByPlaceholderText('أدخل اسم المستخدم'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('أدخل البريد الإلكتروني'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('أدخل الاسم الكامل'), { target: { value: 'مستحدم تجريبي' } });
    fireEvent.change(container.querySelector('#password')!, { target: { value: '1234' } });
    fireEvent.change(container.querySelector('#confirmPassword')!, { target: { value: '1234' } });
    fireEvent.change(screen.getByPlaceholderText('09xxxxxxxx'), { target: { value: '0912345678' } });
    
    // Select gender - Male (first select element)
    const selects = container.querySelectorAll('select');
    fireEvent.change(selects[0], { target: { value: 'Male' } });
    
    // Select Blood type (second select element)
    fireEvent.change(selects[1], { target: { value: 'A+' } });

    // Fill incorrect National ID (starts with 2 = Female)
    fireEvent.change(screen.getByPlaceholderText('أدخل الرقم الوطني'), { target: { value: '219951234567' } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'تسجيل كمتبرع' }));

    expect(await screen.findByText('تضارب في البيانات: الرقم الوطني يبدأ بـ 2 (أنثى) ولكن الجنس المختار هو ذكر')).toBeInTheDocument();
  });

  it('should show error when gender is Female but first digit is 1 (Male)', async () => {
    const { container } = renderRegister();

    // Fill standard fields
    fireEvent.change(screen.getByPlaceholderText('أدخل اسم المستخدم'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('أدخل البريد الإلكتروني'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('أدخل الاسم الكامل'), { target: { value: 'مستحدم تجريبي' } });
    fireEvent.change(container.querySelector('#password')!, { target: { value: '1234' } });
    fireEvent.change(container.querySelector('#confirmPassword')!, { target: { value: '1234' } });
    fireEvent.change(screen.getByPlaceholderText('09xxxxxxxx'), { target: { value: '0912345678' } });
    
    // Select gender - Female (first select element)
    const selects = container.querySelectorAll('select');
    fireEvent.change(selects[0], { target: { value: 'Female' } });
    
    // Select Blood type (second select element)
    fireEvent.change(selects[1], { target: { value: 'A+' } });

    // Fill incorrect National ID (starts with 1 = Male)
    fireEvent.change(screen.getByPlaceholderText('أدخل الرقم الوطني'), { target: { value: '119951234567' } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'تسجيل كمتبرع' }));

    expect(await screen.findByText('تضارب في البيانات: الرقم الوطني يبدأ بـ 1 (ذكر) ولكن الجنس المختار هو أنثى')).toBeInTheDocument();
  });

  it('should show error when birth year in National ID does not match dateOfBirth year', async () => {
    const { container } = renderRegister();

    // Fill standard fields
    fireEvent.change(screen.getByPlaceholderText('أدخل اسم المستخدم'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('أدخل البريد الإلكتروني'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('أدخل الاسم الكامل'), { target: { value: 'مستحدم تجريبي' } });
    fireEvent.change(container.querySelector('#password')!, { target: { value: '1234' } });
    fireEvent.change(container.querySelector('#confirmPassword')!, { target: { value: '1234' } });
    fireEvent.change(screen.getByPlaceholderText('09xxxxxxxx'), { target: { value: '0912345678' } });
    
    // Select gender - Male (first select element)
    const selects = container.querySelectorAll('select');
    fireEvent.change(selects[0], { target: { value: 'Male' } });
    
    // Select Blood type (second select element)
    fireEvent.change(selects[1], { target: { value: 'A+' } });

    // Fill correct gender (starts with 1) but year 1995
    fireEvent.change(screen.getByPlaceholderText('أدخل الرقم الوطني'), { target: { value: '119951234567' } });

    // Set date of birth to 1990-05-15 (mismatch with 1995)
    const dobInput = container.querySelector('#dateOfBirth')!;
    fireEvent.change(dobInput, { target: { value: '1990-05-15' } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'تسجيل كمتبرع' }));

    expect(await screen.findByText('تضارب في البيانات: سنة الميلاد في الرقم الوطني (1995) لا تطابق سنة الميلاد في تاريخ الميلاد المحدد (1990)')).toBeInTheDocument();
  });
});
