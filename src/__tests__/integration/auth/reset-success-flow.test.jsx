import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetSuccess from '@/components/templates/login-register/ResetSuccess';

describe('Integration: Reset Success Flow', () => {
  it('should show success and navigate', async () => {
    const mockGoto = vi.fn();
    const user = userEvent.setup();

    render(<ResetSuccess goto={mockGoto} />);

    expect(screen.getByText('Reset password Successfully')).toBeInTheDocument();
    
    await user.click(screen.getByRole('button', { name: /back to login/i }));
    expect(mockGoto).toHaveBeenCalledWith('login');
  });
});