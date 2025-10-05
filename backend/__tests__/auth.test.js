const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const User = require('../Models/User');
const authRoutes = require('../Routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/test-safego-auth', {
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

  describe('POST /api/auth/register', () => {
    test('should successfully register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123',
        role: 'admin'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Registration successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.role).toBe('admin');
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should return error for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email, password, and role are required');
    });

    test('should return error for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Password123',
        role: 'admin'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email format');
    });

    test('should return error for weak password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'weak',
        role: 'admin'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Password must be at least 8 characters');
    });

    test('should return error for invalid role', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123',
        role: 'invalid'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid role. Must be admin, coordinator, or driver');
    });

    test('should return error for duplicate email', async () => {
      // Create first user
      await User.create({
        email: 'test@example.com',
        password: 'Password123',
        role: 'admin'
      });

      // Try to register with same email
      const userData = {
        email: 'test@example.com',
        password: 'Password456',
        role: 'coordinator'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User with this email already exists');
    });

    test('should register users with different valid roles', async () => {
      const roles = ['admin', 'coordinator', 'driver'];

      for (const role of roles) {
        const userData = {
          email: `test${role}@example.com`,
          password: 'Password123',
          role: role
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.user.role).toBe(role);
      }
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await User.create({
        email: 'test@example.com',
        password: 'Password123',
        role: 'admin'
      });
    });

    test('should successfully login with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.role).toBe('admin');
    });

    test('should return error for incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should return error for non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should return error for missing email or password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email and password are required');
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should successfully logout', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully');
    });
  });
});
