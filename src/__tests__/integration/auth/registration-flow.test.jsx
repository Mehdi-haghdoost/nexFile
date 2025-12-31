import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '@/components/templates/login-register/Register';
import { useRegister } from '@/hooks/auth/useRegister';
import { showErrorToast } from '@/lib/toast';

vi.mock('@/hooks/auth/useRegister');
vi.mock('@/lib/toast');

describe('Integration: Complete Registration Flow', () => {
  const mockGoto = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    useRegister.mockReturnValue({
      register: vi.fn().mockResolvedValue({ success: true }),
      validationErrors: {},
      isLoading: false,
    });

    showErrorToast.mockImplementation(() => {});
  });

  it('should complete full registration journey', async () => {
    const user = userEvent.setup();

    render(<Register goto={mockGoto} />);

    expect(screen.getByText('Create an account')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe Test');
    await user.type(screen.getByPlaceholderText('john@example.com'), 'john@example.com');
    
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'Test123!@#');
    await user.type(passwordInputs[1], 'Test123!@#');
    
    await user.click(screen.getByRole('checkbox', { name: /i agree/i }));
    await user.click(screen.getByRole('button', { name: /^register$/i }));

    await waitFor(() => {
      expect(useRegister().register).toHaveBeenCalledWith({
        name: 'John Doe Test',
        email: 'john@example.com',
        password: 'Test123!@#',
        confirmPassword: 'Test123!@#',
        terms: true,
      });
    });
  });

  it('should show validation errors', async () => {
    const user = userEvent.setup();
    render(<Register goto={mockGoto} />);

    await user.type(screen.getByPlaceholderText('John Doe'), 'Jo');
    await user.tab();

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalled();
    });
  });
});