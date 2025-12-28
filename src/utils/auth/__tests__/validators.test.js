import { describe, it, expect } from 'vitest';
import {
    validateEmail,
    validatePassword,
    validateField,
    getPasswordStrength,
    loginSchema,
    registerSchemaFrontend,
    forgetPasswordSchema,
    resetPasswordSchema,
} from '../validators';

describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
        expect(validateEmail('test@gmail.com')).toBe(true);
        expect(validateEmail('user.name@example.com')).toBe(true);
        expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
        expect(validateEmail('invalid')).toBe(false);
        expect(validateEmail('test@')).toBe(false);
        expect(validateEmail('@example.com')).toBe(false);
        expect(validateEmail('test@domain')).toBe(false);
        expect(validateEmail('test @domain.com')).toBe(false);
    });

    it('should reject emails without TLD', () => {
        expect(validateEmail('test@domain')).toBe(false);
    });

    it('should reject empty or null values', () => {
        expect(validateEmail('')).toBe(false);
        expect(validateEmail(null)).toBe(false);
        expect(validateEmail(undefined)).toBe(false);
    });
});

describe('validatePassword', () => {
    it('should validate strong passwords', () => {
        const result = validatePassword('Test123!@#');
        expect(result.isValid).toBe(true);
        expect(result.checks.minLength).toBe(true);
        expect(result.checks.uppercase).toBe(true);
        expect(result.checks.lowercase).toBe(true);
        expect(result.checks.number).toBe(true);
        expect(result.checks.specialChar).toBe(true);
    });

    it('should fail for passwords without uppercase', () => {
        const result = validatePassword('test123!@#');
        expect(result.isValid).toBe(false);
        expect(result.checks.uppercase).toBe(false);
    });

    it('should fail for passwords without lowercase', () => {
        const result = validatePassword('TEST123!@#');
        expect(result.isValid).toBe(false);
        expect(result.checks.lowercase).toBe(false);
    });

    it('should fail for passwords without numbers', () => {
        const result = validatePassword('TestAbc!@#');
        expect(result.isValid).toBe(false);
        expect(result.checks.number).toBe(false);
    });

    it('should fail for passwords without special characters', () => {
        const result = validatePassword('Test123abc');
        expect(result.isValid).toBe(false);
        expect(result.checks.specialChar).toBe(false);
    });

    it('should fail for short passwords', () => {
        const result = validatePassword('Ts1!');
        expect(result.isValid).toBe(false);
        expect(result.checks.minLength).toBe(false);
    });
});

describe('getPasswordStrength', () => {
    it('should return "none" for empty password', () => {
        const result = getPasswordStrength('');
        expect(result.strength).toBe('none');
        expect(result.percentage).toBe(0);
    });

    it('should return "weak" for passwords with 1-2 criteria', () => {
        const result = getPasswordStrength('test');
        expect(result.strength).toBe('weak');
        expect(result.percentage).toBe(40);
    });

    it('should return "medium" for passwords with 3 criteria', () => {
        const result = getPasswordStrength('Test123');
        expect(result.strength).toBe('medium');
        expect(result.percentage).toBe(60);
    });

    it('should return "good" for passwords with 4 criteria', () => {
        // Password with only 4 criteria (no special char)
        const result = getPasswordStrength('Test1234');
        expect(result.strength).toBe('good');
        expect(result.percentage).toBe(80);
    });

    it('should return "strong" for passwords with all 5 criteria', () => {
        const result = getPasswordStrength('Test123!@#');
        expect(result.strength).toBe('strong');
        expect(result.percentage).toBe(100);
    });
});

describe('validateField', () => {
    describe('name validation', () => {
        it('should accept valid names', () => {
            expect(validateField('name', 'John Doe')).toBe(null);
            expect(validateField('name', 'Alice Smith')).toBe(null);
        });

        it('should reject names shorter than 5 characters', () => {
            expect(validateField('name', 'John')).toBe('Name must be at least 5 characters');
        });

        it('should reject names with numbers', () => {
            expect(validateField('name', 'John123')).toBe('Name can only contain letters and spaces');
        });

        it('should reject names with special characters', () => {
            expect(validateField('name', 'John@Doe')).toBe('Name can only contain letters and spaces');
        });

        it('should reject empty names', () => {
            expect(validateField('name', '')).toBe('Name is required');
        });
    });

    describe('email validation', () => {
        it('should accept valid emails', () => {
            expect(validateField('email', 'test@gmail.com')).toBe(null);
        });

        it('should reject invalid emails', () => {
            expect(validateField('email', 'invalid')).toBeTruthy();
        });

        it('should reject empty emails', () => {
            expect(validateField('email', '')).toBe('Email is required');
        });
    });

    describe('password validation', () => {
        it('should accept valid passwords', () => {
            expect(validateField('password', 'Test123!@#')).toBe(null);
        });

        it('should reject weak passwords', () => {
            expect(validateField('password', 'test')).toBeTruthy();
        });

        it('should reject empty passwords', () => {
            expect(validateField('password', '')).toBe('Password is required');
        });
    });

    describe('confirmPassword validation', () => {
        it('should accept matching passwords', () => {
            expect(validateField('confirmPassword', 'Test123!', { password: 'Test123!' })).toBe(null);
        });

        it('should reject non-matching passwords', () => {
            expect(validateField('confirmPassword', 'Test456!', { password: 'Test123!' })).toBe('Passwords do not match');
        });

        it('should reject empty confirmPassword', () => {
            expect(validateField('confirmPassword', '')).toBe('Please confirm your password');
        });
    });

    describe('terms validation', () => {
        it('should accept true value', () => {
            expect(validateField('terms', true)).toBe(null);
        });

        it('should reject false value', () => {
            expect(validateField('terms', false)).toBe('You must accept the terms and conditions');
        });
    });
});

describe('Zod Schemas', () => {
    describe('loginSchema', () => {
        it('should validate correct login data', () => {
            const result = loginSchema.safeParse({
                email: 'test@gmail.com',
                password: 'Test123!@#',
            });
            expect(result.success).toBe(true);
        });

        it('should reject invalid email', () => {
            const result = loginSchema.safeParse({
                email: 'invalid',
                password: 'Test123!@#',
            });
            expect(result.success).toBe(false);
        });

        it('should reject missing password', () => {
            const result = loginSchema.safeParse({
                email: 'test@gmail.com',
                password: '',
            });
            expect(result.success).toBe(false);
        });
    });

    describe('registerSchemaFrontend', () => {
        it('should validate correct registration data', () => {
            const result = registerSchemaFrontend.safeParse({
                name: 'John Doe',
                email: 'test@gmail.com',
                password: 'Test123!@#',
                confirmPassword: 'Test123!@#',
                terms: true,
            });
            expect(result.success).toBe(true);
        });

        it('should reject mismatched passwords', () => {
            const result = registerSchemaFrontend.safeParse({
                name: 'John Doe',
                email: 'test@gmail.com',
                password: 'Test123!@#',
                confirmPassword: 'Different123!',
                terms: true,
            });
            expect(result.success).toBe(false);
        });

        it('should reject if terms not accepted', () => {
            const result = registerSchemaFrontend.safeParse({
                name: 'John Doe',
                email: 'test@gmail.com',
                password: 'Test123!@#',
                confirmPassword: 'Test123!@#',
                terms: false,
            });
            expect(result.success).toBe(false);
        });
    });

    describe('forgetPasswordSchema', () => {
        it('should validate correct email', () => {
            const result = forgetPasswordSchema.safeParse({
                email: 'test@gmail.com',
            });
            expect(result.success).toBe(true);
        });

        it('should reject invalid email', () => {
            const result = forgetPasswordSchema.safeParse({
                email: 'invalid',
            });
            expect(result.success).toBe(false);
        });
    });

    describe('resetPasswordSchema', () => {
        it('should validate correct reset data', () => {
            const result = resetPasswordSchema.safeParse({
                token: 'valid-token-here',
                password: 'Test123!@#',
                confirmPassword: 'Test123!@#',
            });
            expect(result.success).toBe(true);
        });

        it('should reject without token', () => {
            const result = resetPasswordSchema.safeParse({
                token: '',
                password: 'Test123!@#',
                confirmPassword: 'Test123!@#',
            });
            expect(result.success).toBe(false);
        });

        it('should reject mismatched passwords', () => {
            const result = resetPasswordSchema.safeParse({
                token: 'valid-token-here',
                password: 'Test123!@#',
                confirmPassword: 'Different123!',
            });
            expect(result.success).toBe(false);
        });
    });
});