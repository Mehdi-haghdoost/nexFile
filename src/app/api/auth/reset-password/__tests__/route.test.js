import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock dependencies
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/utils/auth/hashPassword', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed-new-password'),
}));

vi.mock('@/models/User', () => ({
  default: {
    findById: vi.fn(),
  },
}));

vi.mock('@/models/PasswordReset', () => ({
  default: {
    findOne: vi.fn(),
    deleteMany: vi.fn().mockResolvedValue({ deletedCount: 0 }),
  },
}));

// Import after mocks
const { POST } = await import('../route.js');
const User = (await import('@/models/User')).default;
const PasswordReset = (await import('@/models/PasswordReset')).default;
const { hashPassword } = await import('@/utils/auth/hashPassword');
const connectToDB = (await import('@/lib/mongodb')).default;

describe('POST /api/auth/reset-password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Successful Password Reset', () => {
    it('should reset password with valid token', async () => {
      const mockUser = {
        _id: 'mock-user-id',
        email: 'john@example.com',
        password: 'old-hashed-password',
        save: vi.fn().mockResolvedValue(true),
      };

      const mockPasswordReset = {
        _id: 'mock-reset-id',
        userId: 'mock-user-id',
        token: 'valid-reset-token',
        expiresAt: new Date(Date.now() + 3600000),
        isUsed: false,
        save: vi.fn().mockResolvedValue(true),
      };

      PasswordReset.findOne.mockResolvedValue(mockPasswordReset);
      User.findById.mockResolvedValue(mockUser);

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          token: 'valid-reset-token',
          password: 'NewPass123!',
          confirmPassword: 'NewPass123!',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Password reset successful');
      
      expect(hashPassword).toHaveBeenCalledWith('NewPass123!');
      expect(mockUser.password).toBe('hashed-new-password');
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockPasswordReset.isUsed).toBe(true);
      expect(mockPasswordReset.save).toHaveBeenCalled();
    });

    it('should delete other reset tokens after successful reset', async () => {
      const mockUser = {
        _id: 'mock-user-id',
        save: vi.fn().mockResolvedValue(true),
      };

      const mockPasswordReset = {
        _id: 'mock-reset-id',
        userId: 'mock-user-id',
        token: 'valid-reset-token',
        expiresAt: new Date(Date.now() + 3600000),
        isUsed: false,
        save: vi.fn().mockResolvedValue(true),
      };

      PasswordReset.findOne.mockResolvedValue(mockPasswordReset);
      User.findById.mockResolvedValue(mockUser);

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          token: 'valid-reset-token',
          password: 'NewPass123!',
          confirmPassword: 'NewPass123!',
        }),
      };

      await POST(mockRequest);

      expect(PasswordReset.deleteMany).toHaveBeenCalledWith({
        userId: 'mock-user-id',
        _id: { $ne: 'mock-reset-id' },
      });
    });

    it('should mark token as used', async () => {
      const mockUser = {
        _id: 'mock-user-id',
        save: vi.fn().mockResolvedValue(true),
      };

      const mockPasswordReset = {
        userId: 'mock-user-id',
        token: 'valid-reset-token',
        expiresAt: new Date(Date.now() + 3600000),
        isUsed: false,
        save: vi.fn().mockResolvedValue(true),
      };

      PasswordReset.findOne.mockResolvedValue(mockPasswordReset);
      User.findById.mockResolvedValue(mockUser);

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          token: 'valid-reset-token',
          password: 'NewPass123!',
          confirmPassword: 'NewPass123!',
        }),
      };

      await POST(mockRequest);

      expect(mockPasswordReset.isUsed).toBe(true);
      expect(mockPasswordReset.save).toHaveBeenCalled();
    });
  });

  describe('Invalid Token', () => {
    it('should reject expired token', async () => {
      PasswordReset.findOne.mockResolvedValue(null);

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          token: 'expired-token',
          password: 'NewPass123!',
          confirmPassword: 'NewPass123!',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid or expired reset token');
    });

    it('should reject already used token', async () => {
      PasswordReset.findOne.mockResolvedValue(null);

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          token: 'used-token',
          password: 'NewPass123!',
          confirmPassword: 'NewPass123!',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid or expired reset token');
    });

    it('should reject invalid token', async () => {
      PasswordReset.findOne.mockResolvedValue(null);

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          token: 'invalid-token',
          password: 'NewPass123!',
          confirmPassword: 'NewPass123!',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid or expired reset token');
    });
  });

  describe('User Not Found', () => {
    it('should return error if user not found', async () => {
      const mockPasswordReset = {
        userId: 'non-existent-user-id',
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 3600000),
        isUsed: false,
      };

      PasswordReset.findOne.mockResolvedValue(mockPasswordReset);
      User.findById.mockResolvedValue(null);

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          token: 'valid-token',
          password: 'NewPass123!',
          confirmPassword: 'NewPass123!',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe('User not found');
    });
  });

  describe('Validation Errors', () => {
    it('should reject weak password', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          token: 'valid-token',
          password: 'weak',
          confirmPassword: 'weak',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input data');
    });

    it('should reject mismatched passwords', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          token: 'valid-token',
          password: 'NewPass123!',
          confirmPassword: 'DifferentPass123!',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input data');
    });

    it('should reject missing token', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          token: '',
          password: 'NewPass123!',
          confirmPassword: 'NewPass123!',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input data');
    });
  });

  describe('Database Errors', () => {
    it('should handle database connection errors', async () => {
      connectToDB.mockRejectedValueOnce(new Error('Database connection failed'));

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          token: 'valid-token',
          password: 'NewPass123!',
          confirmPassword: 'NewPass123!',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Internal server error');
    });
  });
});