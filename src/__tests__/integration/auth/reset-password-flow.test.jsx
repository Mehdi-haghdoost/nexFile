import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetPassword from '@/components/templates/login-register/ResetPassword';
import { useResetPassword } from '@/hooks/auth/useResetPassword';
import { useSearchParams } from 'next/navigation';

vi.mock('@/hooks/auth/useResetPassword');
vi.mock('next/navigation');

describe('Integration: Reset Password Flow', () => {
  const mockGoto = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    useResetPassword.mockReturnValue({
      resetPassword: vi.fn().mockResolvedValue({ success: true }),
      validationErrors: {},
      isLoading: false,
    });

    useSearchParams.mockReturnValue({
      get: vi.fn((key) => key === 'token' ? 'test-token' : null),
    });
  });

  it('should reset password', async () => {
    const user = userEvent.setup({ delay: null });

    render(<ResetPassword goto={mockGoto} />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0], 'NewPass123!@#');
    await user.type(inputs[1], 'NewPass123!@#');
    
    const resetButton = screen.getByRole('button', { name: /^reset password$/i });
    await user.click(resetButton);

    await waitFor(() => {
      expect(useResetPassword().resetPassword).toHaveBeenCalledWith({
        token: 'test-token',
        password: 'NewPass123!@#',
        confirmPassword: 'NewPass123!@#',
      });
    }, { timeout: 5000 });
  });
});