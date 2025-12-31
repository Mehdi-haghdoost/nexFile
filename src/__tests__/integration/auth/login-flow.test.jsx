import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/components/templates/login-register/Login';
import { useLogin } from '@/hooks/auth/useLogin';
import { showErrorToast } from '@/lib/toast';
import { signIn } from 'next-auth/react';

vi.mock('@/hooks/auth/useLogin');
vi.mock('@/lib/toast');
vi.mock('next-auth/react');

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('Integration: Login Flow', () => {
  const mockGoto = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    useLogin.mockReturnValue({
      login: vi.fn().mockResolvedValue({ success: true }),
      validationErrors: {},
      isLoading: false,
    });

    showErrorToast.mockImplementation(() => {});
    signIn.mockResolvedValue({ error: null });
  });

  it('should complete login successfully', async () => {
    const user = userEvent.setup();

    render(<Login goto={mockGoto} />);

    await user.type(screen.getByPlaceholderText('john@example.com'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'Test123!@#');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(useLogin().login).toHaveBeenCalled();
    });
  });
});