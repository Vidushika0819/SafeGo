const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/test-safego', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clean up and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  describe('Password Hashing', () => {
    test('should hash password before saving', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        role: 'admin'
      });

      await user.save();

      // Password should be hashed
      expect(user.password).not.toBe('password123');
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash pattern
    });

    test('should not rehash password if not modified', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        role: 'admin'
      });

      await user.save();
      const firstHash = user.password;

      // Update non-password field
      user.role = 'coordinator';
      await user.save();

      // Password hash should remain the same
      expect(user.password).toBe(firstHash);
    });
  });

  describe('Password Comparison', () => {
    test('should correctly compare passwords', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        role: 'admin'
      });

      await user.save();

      // Should return true for correct password
      const isValid = await user.comparePassword('password123');
      expect(isValid).toBe(true);

      // Should return false for incorrect password
      const isInvalid = await user.comparePassword('wrongpassword');
      expect(isInvalid).toBe(false);
    });
  });

  describe('Email Uniqueness', () => {
    test('should prevent duplicate emails', async () => {
      // Create first user
      const user1 = new User({
        email: 'test@example.com',
        password: 'password123',
        role: 'admin'
      });
      await user1.save();

      // Try to create second user with same email
      const user2 = new User({
        email: 'test@example.com',
        password: 'password456',
        role: 'coordinator'
      });

      await expect(user2.save()).rejects.toThrow(/duplicate key/);
    });

    test('should allow different emails', async () => {
      const user1 = new User({
        email: 'test1@example.com',
        password: 'password123',
        role: 'admin'
      });
      await user1.save();

      const user2 = new User({
        email: 'test2@example.com',
        password: 'password456',
        role: 'coordinator'
      });
      await user2.save();

      // Both should exist
      const users = await User.find({});
      expect(users).toHaveLength(2);
    });
  });

  describe('Role Validation', () => {
    test('should accept valid roles', async () => {
      const validRoles = ['admin', 'coordinator', 'driver'];

      for (const role of validRoles) {
        const user = new User({
          email: `test${role}@example.com`,
          password: 'password123',
          role: role
        });
        await expect(user.save()).resolves.toBeDefined();
      }
    });

    test('should reject invalid roles', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        role: 'invalid'
      });

      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('JSON Serialization', () => {
    test('should exclude password from JSON output', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        role: 'admin'
      });

      await user.save();

      const userJSON = user.toJSON();
      expect(userJSON.password).toBeUndefined();
      expect(userJSON.email).toBe('test@example.com');
      expect(userJSON.role).toBe('admin');
    });
  });

  describe('JWT Token Generation', () => {
    test('should generate JWT token with user role', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        role: 'admin'
      });

      await user.save();

      // Generate token (simulating auth controller logic)
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role
        },
        'test-secret',
        { expiresIn: '24h' }
      );

      expect(token).toBeDefined();

      // Verify token contains correct data
      const decoded = jwt.verify(token, 'test-secret');
      expect(decoded.id).toBe(user._id.toString());
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.role).toBe('admin');
    });

    test('should include role in token for different user types', async () => {
      const roles = ['admin', 'coordinator', 'driver'];

      for (const role of roles) {
        const user = new User({
          email: `test${role}@example.com`,
          password: 'password123',
          role: role
        });

        await user.save();

        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            role: user.role
          },
          'test-secret',
          { expiresIn: '24h' }
        );

        const decoded = jwt.verify(token, 'test-secret');
        expect(decoded.role).toBe(role);
      }
    });
  });

  describe('Required Fields', () => {
    test('should require email', async () => {
      const user = new User({
        password: 'password123',
        role: 'admin'
      });

      await expect(user.save()).rejects.toThrow();
    });

    test('should require password', async () => {
      const user = new User({
        email: 'test@example.com',
        role: 'admin'
      });

      await expect(user.save()).rejects.toThrow();
    });

    test('should require role', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });

      await expect(user.save()).rejects.toThrow();
    });
  });
});
