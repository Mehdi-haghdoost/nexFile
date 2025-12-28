import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock jose
vi.mock('jose', () => ({
  jwtVerify: vi.fn(),
}));

// Mock dependencies
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/models/User', () => ({
  default: {
    findById: vi.fn(),
  },
}));

// Import after mocks
const { GET } = await import('../route.js');
const { jwtVerify } = await import('jose');
const User = (await import('@/models/User')).default;
const connectToDB = (await import('@/lib/mongodb')).default;

describe('GET /api/auth/me', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Successful User Retrieval', () => {
    it('should return current user with valid token', async () => {
      jwtVerify.mockResolvedValue({
        payload: {
          userId: 'mock-user-id',
          email: 'john@example.com',
          role: 'user',
        },
      });

      User.findById.mockResolvedValue({
        _id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        image: null,
        emailVerified: false,
      });

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'token') {
              return { value: 'valid-access-token' };
            }
            return undefined;
          }),
        },
      };

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toMatchObject({
        id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        emailVerified: false,
      });
      
      expect(connectToDB).toHaveBeenCalled();
      expect(jwtVerify).toHaveBeenCalled();
      expect(User.findById).toHaveBeenCalledWith('mock-user-id');
    });

    it('should not return password field', async () => {
      jwtVerify.mockResolvedValue({
        payload: {
          userId: 'mock-user-id',
        },
      });

      User.findById.mockResolvedValue({
        _id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        role: 'user',
      });

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'token') {
              return { value: 'valid-access-token' };
            }
            return undefined;
          }),
        },
      };

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(data.user.password).toBeUndefined();
    });
  });

  describe('Authentication Errors', () => {
    it('should return 401 if no token provided', async () => {
      const mockRequest = {
        cookies: {
          get: vi.fn(() => undefined),
        },
      };

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Unauthorized');
      expect(User.findById).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      jwtVerify.mockRejectedValue(new Error('Invalid token'));

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'token') {
              return { value: 'invalid-token' };
            }
            return undefined;
          }),
        },
      };

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Invalid token');
    });

    it('should return 401 if token verification fails', async () => {
      jwtVerify.mockResolvedValue(null);

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'token') {
              return { value: 'expired-token' };
            }
            return undefined;
          }),
        },
      };

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Invalid token');
    });
  });

  describe('User Not Found', () => {
    it('should return 404 if user does not exist', async () => {
      jwtVerify.mockResolvedValue({
        payload: {
          userId: 'non-existent-user-id',
        },
      });

      User.findById.mockResolvedValue(null);

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'token') {
              return { value: 'valid-token' };
            }
            return undefined;
          }),
        },
      };

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe('User not found');
    });
  });

  describe('Database Errors', () => {
    it('should handle database errors', async () => {
      jwtVerify.mockResolvedValue({
        payload: {
          userId: 'mock-user-id',
        },
      });

      User.findById.mockRejectedValue(new Error('Database error'));

      const mockRequest = {
        cookies: {
          get: vi.fn((name) => {
            if (name === 'token') {
              return { value: 'valid-token' };
            }
            return undefined;
          }),
        },
      };

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Internal server error');
    });
  });
});