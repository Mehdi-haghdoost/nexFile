import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '@/components/templates/login-register/Register';
import Login from '@/components/templates/login-register/Login';
import { useRegister } from '@/hooks/auth/useRegister';
import { useLogin } from '@/hooks/auth/useLogin';

vi.mock('@/hooks/auth/useRegister');
vi.mock('@/hooks/auth/useLogin');
vi.mock('next-auth/react');

global.localStorage = { getItem: vi.fn(), setItem: vi.fn(), clear: vi.fn() };

describe('Integration: Complete Auth Journey', () => {
  const mockGoto = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    useRegister.mockReturnValue({
      register: vi.fn().mockResolvedValue({ success: true }),
      validationErrors: {},
      isLoading: false,
    });

    useLogin.mockReturnValue({
      login: vi.fn().mockResolvedValue({ success: true }),
      validationErrors: {},
      isLoading: false,
    });
  });

  it('should complete registration and login journey', async () => {
    const user = userEvent.setup({ delay: null });

    const { unmount } = render(<Register goto={mockGoto} />);

    await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe');
    await user.type(screen.getByPlaceholderText('john@example.com'), 'john@example.com');
    
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'Test123!@#');
    await user.type(passwordInputs[1], 'Test123!@#');
    
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(useRegister().register).toHaveBeenCalled();
    });

    unmount();

    render(<Login goto={mockGoto} />);

    await user.type(screen.getByPlaceholderText('john@example.com'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'Test123!@#');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(useLogin().login).toHaveBeenCalled();
    });
  });
});