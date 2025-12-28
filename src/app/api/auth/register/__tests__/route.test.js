import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock dependencies BEFORE importing
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/utils/auth/hashPassword', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed-password'),
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

vi.mock('@/models/User', () => {
  const mockUser = {
    findOne: vi.fn(),
    create: vi.fn(),
  };
  
  return {
    default: mockUser,
  };
});

// Import after mocks
const { POST } = await import('../route.js');
const User = (await import('@/models/User')).default;
const connectToDB = (await import('@/lib/mongodb')).default;
const { hashPassword } = await import('@/utils/auth/hashPassword');
const { 
  generateAccessToken, 
  generateRefreshToken,
  saveRefreshToken,
  setAuthCookies 
} = await import('@/utils/auth/tokenManager');

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Successful Registration', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        role: 'user',
        emailVerified: false,
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.message).toBe('Registration successful');
      expect(data.user).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      });
      expect(data.user.password).toBeUndefined();
      
      expect(connectToDB).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(hashPassword).toHaveBeenCalledWith('Test123!@#');
      expect(User.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        role: 'user',
        emailVerified: false,
      });
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
      expect(setAuthCookies).toHaveBeenCalled();
    });

    it('should hash password before saving', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        role: 'user',
        emailVerified: false,
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      await POST(mockRequest);

      expect(hashPassword).toHaveBeenCalledWith('Test123!@#');
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'hashed-password',
        })
      );
    });

    it('should generate tokens after registration', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        emailVerified: false,
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      await POST(mockRequest);

      expect(generateAccessToken).toHaveBeenCalled();
      expect(generateRefreshToken).toHaveBeenCalled();
      expect(saveRefreshToken).toHaveBeenCalled();
      expect(setAuthCookies).toHaveBeenCalled();
    });
  });

  describe('Validation Errors', () => {
    it('should reject registration with invalid name (too short)', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'Jo',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input data');
      expect(data.errors).toBeDefined();
    });

    it('should reject registration with invalid name (contains numbers)', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John123',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input data');
    });

    it('should reject registration with invalid email', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input data');
    });

    it('should reject registration with weak password', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'weak',
          confirmPassword: 'weak',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input data');
    });

    it('should reject registration with mismatched passwords', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Different123!',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input data');
    });

    it('should reject registration with missing fields', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: '',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid input data');
    });
  });

  describe('Duplicate User', () => {
    it('should reject registration with existing email', async () => {
      User.findOne.mockResolvedValue({
        _id: 'existing-user-id',
        email: 'john@example.com',
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.message).toBe('User with this email already exists');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(User.create).not.toHaveBeenCalled();
    });

    it('should not call hashPassword if user exists', async () => {
      User.findOne.mockResolvedValue({
        _id: 'existing-user-id',
        email: 'john@example.com',
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      await POST(mockRequest);

      expect(hashPassword).not.toHaveBeenCalled();
    });
  });

  describe('Database Errors', () => {
    it('should handle database connection errors', async () => {
      connectToDB.mockRejectedValueOnce(new Error('Database connection failed'));

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Internal server error');
    });

    it('should handle user creation errors', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockRejectedValue(new Error('Database save failed'));

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Internal server error');
    });

    it('should handle token generation errors', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      });
      generateAccessToken.mockImplementationOnce(() => {
        throw new Error('Token generation failed');
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
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
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        role: 'user',
        emailVerified: false,
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.user).toBeDefined();
      expect(data.user.password).toBeUndefined();
    });

    it('should return correct user fields', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        role: 'user',
        emailVerified: false,
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.user).toHaveProperty('id');
      expect(data.user).toHaveProperty('name', 'John Doe');
      expect(data.user).toHaveProperty('email', 'john@example.com');
      expect(data.user).toHaveProperty('role', 'user');
    });

    it('should set default role as user', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        emailVerified: false,
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      await POST(mockRequest);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'user',
        })
      );
    });

    it('should set emailVerified as false by default', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        emailVerified: false,
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#',
        }),
      };

      await POST(mockRequest);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          emailVerified: false,
        })
      );
    });
  });
});