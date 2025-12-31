import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgetPassword from '@/components/templates/login-register/ForgetPassword';
import { useForgetPassword } from '@/hooks/auth/useForgetPassword';

vi.mock('@/hooks/auth/useForgetPassword');

describe('Integration: Forgot Password Flow', () => {
  const mockGoto = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    useForgetPassword.mockReturnValue({
      sendResetLink: vi.fn().mockResolvedValue({ success: true, data: {} }),
      validationErrors: {},
      isLoading: false,
    });
  });

  it('should send reset link', async () => {
    const user = userEvent.setup();

    render(<ForgetPassword goto={mockGoto} />);

    await user.type(screen.getByPlaceholderText('john@example.com'), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText('Check your email')).toBeInTheDocument();
    });
  });
});