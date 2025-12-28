import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock dependencies
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/utils/auth/tokenManager', () => ({
  verifyRefreshToken: vi.fn(),
  revokeRefreshToken: vi.fn().mockResolvedValue(true),
  clearAuthCookies: vi.fn((response) => {
    response.cookies.set('accessToken', '', { maxAge: 0 });
    response.cookies.set('refreshToken', '', { maxAge: 0 });
    return response;
  }),
}));

// Import after mocks
const { POST } = await import('../route.js');
const { verifyRefreshToken, revokeRefreshToken, clearAuthCookies } = await import('@/utils/auth/tokenManager');
const connectToDB = (await import('@/lib/mongodb')).default;

describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Successful Logout', () => {
    it('should logout user with valid refresh token', async () => {
      verifyRefreshToken.mockReturnValue({
        userId: 'mock-user-id',
        email: 'john@example.com',
      });

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'valid-refresh-token' };
            }
            return undefined;
          }),
        },
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Logout successful');
      
      expect(connectToDB).toHaveBeenCalled();
      expect(verifyRefreshToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(revokeRefreshToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(clearAuthCookies).toHaveBeenCalled();
    });

    it('should clear auth cookies', async () => {
      verifyRefreshToken.mockReturnValue({
        userId: 'mock-user-id',
        email: 'john@example.com',
      });

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'valid-refresh-token' };
            }
            return undefined;
          }),
        },
      };

      const response = await POST(mockRequest);

      expect(clearAuthCookies).toHaveBeenCalled();
    });
  });

  describe('Logout Without Token', () => {
    it('should still logout successfully if no refresh token', async () => {
      const mockRequest = {
        cookies: {
          get: vi.fn(() => undefined),
        },
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Logout successful');
      expect(revokeRefreshToken).not.toHaveBeenCalled();
      expect(clearAuthCookies).toHaveBeenCalled();
    });

    it('should clear cookies even without token', async () => {
      const mockRequest = {
        cookies: {
          get: vi.fn(() => undefined),
        },
      };

      await POST(mockRequest);

      expect(clearAuthCookies).toHaveBeenCalled();
    });
  });

  describe('Invalid Token', () => {
    it('should still logout successfully with invalid token', async () => {
      verifyRefreshToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'invalid-token' };
            }
            return undefined;
          }),
        },
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Logout successful');
      expect(clearAuthCookies).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should still logout even if token revocation fails', async () => {
      verifyRefreshToken.mockReturnValue({
        userId: 'mock-user-id',
      });
      revokeRefreshToken.mockRejectedValue(new Error('Database error'));

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'valid-refresh-token' };
            }
            return undefined;
          }),
        },
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Logout successful');
      expect(clearAuthCookies).toHaveBeenCalled();
    });
  });
});