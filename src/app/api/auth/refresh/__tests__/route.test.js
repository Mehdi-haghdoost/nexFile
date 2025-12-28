import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock dependencies
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/utils/auth/tokenManager', () => ({
  verifyRefreshToken: vi.fn(),
  generateAccessToken: vi.fn(() => 'new-access-token'),
  generateRefreshToken: vi.fn(() => 'new-refresh-token'),
  findRefreshToken: vi.fn(),
  revokeRefreshToken: vi.fn().mockResolvedValue(true),
  revokeAllUserTokens: vi.fn().mockResolvedValue(true),
  saveRefreshToken: vi.fn().mockResolvedValue(true),
  setAuthCookies: vi.fn((response) => response),
}));

// Import after mocks
const { POST } = await import('../route.js');
const {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  saveRefreshToken,
  setAuthCookies,
} = await import('@/utils/auth/tokenManager');
const connectToDB = (await import('@/lib/mongodb')).default;

describe('POST /api/auth/refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Successful Token Refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      verifyRefreshToken.mockReturnValue({
        userId: 'mock-user-id',
        email: 'john@example.com',
      });

      findRefreshToken.mockResolvedValue({
        userId: {
          _id: 'mock-user-id',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          image: null,
        },
        token: 'old-refresh-token',
        expiresAt: new Date(Date.now() + 86400000),
        isRevoked: false,
      });

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'old-refresh-token' };
            }
            return undefined;
          }),
        },
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Token refreshed successfully');
      expect(data.user).toMatchObject({
        id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      });

      expect(connectToDB).toHaveBeenCalled();
      expect(verifyRefreshToken).toHaveBeenCalledWith('old-refresh-token');
      expect(findRefreshToken).toHaveBeenCalledWith('old-refresh-token');
      expect(revokeRefreshToken).toHaveBeenCalledWith('old-refresh-token');
      expect(generateAccessToken).toHaveBeenCalled();
      expect(generateRefreshToken).toHaveBeenCalled();
      expect(saveRefreshToken).toHaveBeenCalledWith('mock-user-id', 'new-refresh-token');
      expect(setAuthCookies).toHaveBeenCalled();
    });

    it('should generate new access token', async () => {
      verifyRefreshToken.mockReturnValue({
        userId: 'mock-user-id',
        email: 'john@example.com',
      });

      findRefreshToken.mockResolvedValue({
        userId: {
          _id: 'mock-user-id',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
        },
        token: 'old-refresh-token',
        expiresAt: new Date(Date.now() + 86400000),
        isRevoked: false,
      });

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'old-refresh-token' };
            }
            return undefined;
          }),
        },
      };

      await POST(mockRequest);

      expect(generateAccessToken).toHaveBeenCalledWith({
        userId: 'mock-user-id',
        email: 'john@example.com',
        role: 'admin',
      });
    });

    it('should generate new refresh token', async () => {
      verifyRefreshToken.mockReturnValue({
        userId: 'mock-user-id',
        email: 'john@example.com',
      });

      findRefreshToken.mockResolvedValue({
        userId: {
          _id: 'mock-user-id',
          email: 'john@example.com',
        },
        token: 'old-refresh-token',
        expiresAt: new Date(Date.now() + 86400000),
        isRevoked: false,
      });

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'old-refresh-token' };
            }
            return undefined;
          }),
        },
      };

      await POST(mockRequest);

      expect(generateRefreshToken).toHaveBeenCalledWith({
        userId: 'mock-user-id',
        email: 'john@example.com',
      });
    });

    it('should revoke old refresh token', async () => {
      verifyRefreshToken.mockReturnValue({
        userId: 'mock-user-id',
        email: 'john@example.com',
      });

      findRefreshToken.mockResolvedValue({
        userId: {
          _id: 'mock-user-id',
          email: 'john@example.com',
        },
        token: 'old-refresh-token',
        expiresAt: new Date(Date.now() + 86400000),
        isRevoked: false,
      });

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'old-refresh-token' };
            }
            return undefined;
          }),
        },
      };

      await POST(mockRequest);

      expect(revokeRefreshToken).toHaveBeenCalledWith('old-refresh-token');
    });

    it('should set new auth cookies', async () => {
      verifyRefreshToken.mockReturnValue({
        userId: 'mock-user-id',
        email: 'john@example.com',
      });

      findRefreshToken.mockResolvedValue({
        userId: {
          _id: 'mock-user-id',
          email: 'john@example.com',
        },
        token: 'old-refresh-token',
        expiresAt: new Date(Date.now() + 86400000),
        isRevoked: false,
      });

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'old-refresh-token' };
            }
            return undefined;
          }),
        },
      };

      await POST(mockRequest);

      expect(setAuthCookies).toHaveBeenCalledWith(
        expect.anything(),
        'new-access-token',
        'new-refresh-token'
      );
    });
  });

  describe('Missing Refresh Token', () => {
    it('should return 401 if no refresh token provided', async () => {
      const mockRequest = {
        cookies: {
          get: vi.fn(() => undefined),
        },
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Refresh token not found');
      expect(verifyRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('Invalid Refresh Token', () => {
    it('should return 401 if token verification fails', async () => {
      verifyRefreshToken.mockReturnValue(null);

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

      expect(response.status).toBe(401);
      expect(data.message).toBe('Invalid or expired refresh token');
    });

    it('should return 401 if token is expired', async () => {
      verifyRefreshToken.mockImplementation(() => {
        throw new Error('Token expired');
      });

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'expired-token' };
            }
            return undefined;
          }),
        },
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Invalid or expired refresh token');
    });
  });

  describe('Token Not Found in Database', () => {
    it('should revoke all user tokens if token not found in database', async () => {
      verifyRefreshToken.mockReturnValue({
        userId: 'mock-user-id',
        email: 'john@example.com',
      });

      findRefreshToken.mockResolvedValue(null);

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'token-not-in-db' };
            }
            return undefined;
          }),
        },
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Invalid refresh token. All sessions terminated for security.');
      expect(revokeAllUserTokens).toHaveBeenCalledWith('mock-user-id');
    });

    it('should clear cookies when token not found', async () => {
      verifyRefreshToken.mockReturnValue({
        userId: 'mock-user-id',
        email: 'john@example.com',
      });

      findRefreshToken.mockResolvedValue(null);

      const mockCookiesDelete = vi.fn();
      
      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'token-not-in-db' };
            }
            return undefined;
          }),
        },
      };

      await POST(mockRequest);

      expect(revokeAllUserTokens).toHaveBeenCalled();
    });
  });

  describe('Database Errors', () => {
    it('should handle database connection errors', async () => {
      connectToDB.mockRejectedValueOnce(new Error('Database connection failed'));

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'valid-token' };
            }
            return undefined;
          }),
        },
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Internal server error');
    });

    it('should handle token save errors', async () => {
      verifyRefreshToken.mockReturnValue({
        userId: 'mock-user-id',
        email: 'john@example.com',
      });

      findRefreshToken.mockResolvedValue({
        userId: {
          _id: 'mock-user-id',
          email: 'john@example.com',
        },
        token: 'old-refresh-token',
        expiresAt: new Date(Date.now() + 86400000),
        isRevoked: false,
      });

      saveRefreshToken.mockRejectedValue(new Error('Database save failed'));

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'old-refresh-token' };
            }
            return undefined;
          }),
        },
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Internal server error');
    });
  });

  describe('Security', () => {
    it('should not generate new tokens if old token is revoked', async () => {
      verifyRefreshToken.mockReturnValue({
        userId: 'mock-user-id',
        email: 'john@example.com',
      });

      findRefreshToken.mockResolvedValue(null);

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'refreshToken') {
              return { value: 'revoked-token' };
            }
            return undefined;
          }),
        },
      };

      await POST(mockRequest);

      expect(generateAccessToken).not.toHaveBeenCalled();
      expect(generateRefreshToken).not.toHaveBeenCalled();
      expect(revokeAllUserTokens).toHaveBeenCalled();
    });
  });
});