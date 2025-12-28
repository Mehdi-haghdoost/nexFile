import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock dependencies
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/utils/auth/hashPassword', () => ({
  verifyPassword: vi.fn(),
}));

vi.mock('@/utils/auth/tokenManager', () => ({
  generateAccessToken: vi.fn(() => 'mock-access-token'),
  generateRefreshToken: vi.fn(() => 'mock-refresh-token'),
  saveRefreshToken: vi.fn().mockResolvedValue({
    userId: 'mock-user-id',
    token: 'mock-refresh-token',
    expiresAt: new Date(),
  }),
  setAuthCookies: vi.fn((response) => response),
}));

vi.mock('@/models/User', () => ({
  default: {
    findOne: vi.fn(() => ({
      select: vi.fn(),
    })),
  },
}));

// Import after mocks
const { POST } = await import('../route.js');
const User = (await import('@/models/User')).default;
const { verifyPassword } = await import('@/utils/auth/hashPassword');
const connectToDB = (await import('@/lib/mongodb')).default;
const {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  setAuthCookies,
} = await import('@/utils/auth/tokenManager');

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Successful Login', () => {
    it('should login user with correct credentials', async () => {
      // Arrange
      const mockUser = {
        _id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        role: 'user',
        emailVerified: false,
        image: null,
      };

      const mockSelect = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ select: mockSelect });
      verifyPassword.mockResolvedValue(true);

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
          password: 'Test123!@#',
        }),
      };

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.message).toBe('Login successful');
      expect(data.user).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      });
      expect(data.user.password).toBeUndefined();

      expect(connectToDB).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(mockSelect).toHaveBeenCalledWith('+password');
      expect(verifyPassword).toHaveBeenCalledWith('Test123!@#', 'hashed-password');
      expect(generateAccessToken).toHaveBeenCalled();
      expect(generateRefreshToken).toHaveBeenCalled();
      expect(saveRefreshToken).toHaveBeenCalled();
      expect(setAuthCookies).toHaveBeenCalled();
    });

    it('should generate tokens after successful login', async () => {
      const mockUser = {
        _id: 'mock-user-id',
        email: 'john@example.com',
        password: 'hashed-password',
        role: 'user',
      };

      const mockSelect = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ select: mockSelect });
      verifyPassword.mockResolvedValue(true);

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
          password: 'Test123!@#',
        }),
      };

      await POST(mockRequest);

      expect(generateAccessToken).toHaveBeenCalledWith({
        userId: 'mock-user-id',
        email: 'john@example.com',
        role: 'user',
      });
      expect(generateRefreshToken).toHaveBeenCalledWith({
        userId: 'mock-user-id',
        email: 'john@example.com',
      });
      expect(saveRefreshToken).toHaveBeenCalledWith('mock-user-id', 'mock-refresh-token');
    });
  });

  describe('Validation Errors', () => {
    it('should reject login with invalid email format', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'invalid-email',
          password: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input data');
    });

    it('should reject login with missing email', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: '',
          password: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input data');
    });

    it('should reject login with missing password', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
          password: '',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input data');
    });
  });

  describe('Authentication Failures', () => {
    it('should reject login with non-existent user', async () => {
      const mockSelect = vi.fn().mockResolvedValue(null);
      User.findOne.mockReturnValue({ select: mockSelect });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'nonexistent@example.com',
          password: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Invalid email or password');
      expect(verifyPassword).not.toHaveBeenCalled();
    });

    it('should reject login with incorrect password', async () => {
      const mockUser = {
        _id: 'mock-user-id',
        email: 'john@example.com',
        password: 'hashed-password',
      };

      const mockSelect = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ select: mockSelect });
      verifyPassword.mockResolvedValue(false);

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
          password: 'WrongPassword123!',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Invalid email or password');
      expect(verifyPassword).toHaveBeenCalledWith('WrongPassword123!', 'hashed-password');
    });

    it('should reject Google account trying to login with password', async () => {
      const mockUser = {
        _id: 'mock-user-id',
        email: 'john@example.com',
        password: null, // Google user has no password
        role: 'user',
      };

      const mockSelect = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ select: mockSelect });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
          password: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('This account uses Google login. Please sign in with Google.');
      expect(verifyPassword).not.toHaveBeenCalled();
    });

    it('should not reveal which credential is wrong', async () => {
      // Test with wrong email
      const mockSelect1 = vi.fn().mockResolvedValue(null);
      User.findOne.mockReturnValue({ select: mockSelect1 });

      const mockRequest1 = {
        json: vi.fn().mockResolvedValue({
          email: 'wrong@example.com',
          password: 'Test123!@#',
        }),
      };

      const response1 = await POST(mockRequest1);
      const data1 = await response1.json();

      // Test with wrong password
      const mockUser = {
        _id: 'mock-user-id',
        email: 'john@example.com',
        password: 'hashed-password',
      };

      const mockSelect2 = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ select: mockSelect2 });
      verifyPassword.mockResolvedValue(false);

      const mockRequest2 = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
          password: 'WrongPassword!',
        }),
      };

      const response2 = await POST(mockRequest2);
      const data2 = await response2.json();

      // Both should return same message
      expect(data1.message).toBe(data2.message);
      expect(data1.message).toBe('Invalid email or password');
    });
  });

  describe('Database Errors', () => {
    it('should handle database connection errors', async () => {
      connectToDB.mockRejectedValueOnce(new Error('Database connection failed'));

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
          password: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Internal server error');
    });

    it('should handle user lookup errors', async () => {
      const mockSelect = vi.fn().mockRejectedValue(new Error('Database query failed'));
      User.findOne.mockReturnValue({ select: mockSelect });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
          password: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Internal server error');
    });
  });

  describe('Response Structure', () => {
    it('should not return password in response', async () => {
      const mockUser = {
        _id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        role: 'user',
      };

      const mockSelect = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ select: mockSelect });
      verifyPassword.mockResolvedValue(true);

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
          password: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.user).toBeDefined();
      expect(data.user.password).toBeUndefined();
    });

    it('should return correct user fields', async () => {
      const mockUser = {
        _id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        role: 'admin',
        image: 'https://example.com/image.jpg',
      };

      const mockSelect = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ select: mockSelect });
      verifyPassword.mockResolvedValue(true);

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          email: 'john@example.com',
          password: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.user).toHaveProperty('id');
      expect(data.user).toHaveProperty('name', 'John Doe');
      expect(data.user).toHaveProperty('email', 'john@example.com');
      expect(data.user).toHaveProperty('role', 'admin');
      expect(data.user).toHaveProperty('image', 'https://example.com/image.jpg');
    });
  });
});