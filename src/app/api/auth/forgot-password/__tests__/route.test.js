import { describe, it, expect, beforeEach, vi } from 'vitest';
import crypto from 'crypto';

// Mock dependencies
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/emailService', () => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock('crypto', () => ({
  default: {
    randomBytes: vi.fn(() => ({
      toString: vi.fn(() => 'mock-reset-token-123'),
    })),
  },
}));

vi.mock('@/models/User', () => ({
  default: {
    findOne: vi.fn(),
  },
}));

vi.mock('@/models/PasswordReset', () => ({
  default: {
    deleteMany: vi.fn().mockResolvedValue({ deletedCount: 0 }),
    create: vi.fn().mockResolvedValue({
      userId: 'mock-user-id',
      token: 'mock-reset-token-123',
      expiresAt: new Date(),
      isUsed: false,
    }),
  },
}));

// Import after mocks
const { POST } = await import('../route.js');
const User = (await import('@/models/User')).default;
const PasswordReset = (await import('@/models/PasswordReset')).default;
const { sendPasswordResetEmail } = await import('@/lib/emailService');
const connectToDB = (await import('@/lib/mongodb')).default;

describe('POST /api/auth/forgot-password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_ENV = 'test';
  });

  describe('Successful Password Reset Request', () => {
    it('should send reset email for existing user', async () => {
      User.findOne.mockResolvedValue({
        _id: 'mock-user-id',
        email: 'john@example.com',
        name: 'John Doe',
      });
      sendPasswordResetEmail.mockResolvedValue({ success: true });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('If an account exists with this email, you will receive a password reset link.');
      
      expect(connectToDB).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(PasswordReset.deleteMany).toHaveBeenCalledWith({ userId: 'mock-user-id' });
      expect(PasswordReset.create).toHaveBeenCalledWith({
        userId: 'mock-user-id',
        token: 'mock-reset-token-123',
        expiresAt: expect.any(Date),
        isUsed: false,
      });
      expect(sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('should delete old reset tokens before creating new one', async () => {
      User.findOne.mockResolvedValue({
        _id: 'mock-user-id',
        email: 'john@example.com',
      });
      sendPasswordResetEmail.mockResolvedValue({ success: true });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
        }),
      };

      await POST(mockRequest);

      expect(PasswordReset.deleteMany).toHaveBeenCalledWith({ userId: 'mock-user-id' });
      expect(PasswordReset.create).toHaveBeenCalled();
    });

    it('should set token expiration to 1 hour', async () => {
      User.findOne.mockResolvedValue({
        _id: 'mock-user-id',
        email: 'john@example.com',
      });
      sendPasswordResetEmail.mockResolvedValue({ success: true });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
        }),
      };

      const beforeTime = new Date();
      await POST(mockRequest);
      const afterTime = new Date();

      const createCall = PasswordReset.create.mock.calls[0][0];
      const expiresAt = createCall.expiresAt;

      const oneHourInMs = 60 * 60 * 1000;
      const minExpiry = new Date(beforeTime.getTime() + oneHourInMs);
      const maxExpiry = new Date(afterTime.getTime() + oneHourInMs + 1000);

      expect(expiresAt.getTime()).toBeGreaterThanOrEqual(minExpiry.getTime());
      expect(expiresAt.getTime()).toBeLessThanOrEqual(maxExpiry.getTime());
    });
  });

  describe('Security - Non-existent User', () => {
    it('should return success message even if user does not exist', async () => {
      User.findOne.mockResolvedValue(null);

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'nonexistent@example.com',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('If an account exists with this email, you will receive a password reset link.');
      expect(PasswordReset.create).not.toHaveBeenCalled();
      expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('should not reveal whether email exists', async () => {
      // Test with existing user
      User.findOne.mockResolvedValue({
        _id: 'mock-user-id',
        email: 'john@example.com',
      });
      sendPasswordResetEmail.mockResolvedValue({ success: true });

      const mockRequest1 = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
        }),
      };

      const response1 = await POST(mockRequest1);
      const data1 = await response1.json();

      // Test with non-existent user
      User.findOne.mockResolvedValue(null);

      const mockRequest2 = {
        json: vi.fn().mockResolvedValue({
          email: 'nonexistent@example.com',
        }),
      };

      const response2 = await POST(mockRequest2);
      const data2 = await response2.json();

      // Both should return same message
      expect(data1.message).toBe(data2.message);
      expect(response1.status).toBe(response2.status);
    });
  });

  describe('Validation Errors', () => {
    it('should reject invalid email format', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'invalid-email',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input data');
    });

    it('should reject missing email', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: '',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input data');
    });
  });

  describe('Development Mode', () => {
    it('should include resetUrl in response when email fails in dev mode', async () => {
      process.env.NODE_ENV = 'development';
      
      User.findOne.mockResolvedValue({
        _id: 'mock-user-id',
        email: 'john@example.com',
      });
      sendPasswordResetEmail.mockResolvedValue({ success: false, error: 'SMTP error' });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.resetUrl).toBeDefined();
      expect(data.resetUrl).toContain('mock-reset-token-123');
    });
  });

  describe('Database Errors', () => {
    it('should handle database connection errors', async () => {
      connectToDB.mockRejectedValueOnce(new Error('Database connection failed'));

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Internal server error');
    });

    it('should handle token creation errors', async () => {
      User.findOne.mockResolvedValue({
        _id: 'mock-user-id',
        email: 'john@example.com',
      });
      PasswordReset.create.mockRejectedValue(new Error('Database error'));

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Internal server error');
    });
  });
});