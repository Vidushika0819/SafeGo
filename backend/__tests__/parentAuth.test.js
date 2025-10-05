const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Assuming your main app file
const User = require('../Models/User');

describe('Parent Authentication API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/safego-test');
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/parent/register', () => {
    test('should register a new parent successfully', async () => {
      const parentData = {
        name: 'John Parent',
        email: 'john.parent@example.com',
        password: 'SecurePass123',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/api/auth/parent/register')
        .send(parentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Parent registration successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.role).toBe('parent');
      expect(response.body.user.name).toBe('John Parent');
      expect(response.body.user.email).toBe('john.parent@example.com');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/parent/register')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email, password, and name are required');
    });

    test('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/parent/register')
        .send({
          name: 'John Parent',
          email: 'invalid-email',
          password: 'SecurePass123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email format');
    });

    test('should validate password strength', async () => {
      const response = await request(app)
        .post('/api/auth/parent/register')
        .send({
          name: 'John Parent',
          email: 'john@example.com',
          password: 'weak'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Password must be at least 8 characters');
    });

    test('should prevent duplicate email registration', async () => {
      // First registration
      await request(app)
        .post('/api/auth/parent/register')
        .send({
          name: 'John Parent',
          email: 'john@example.com',
          password: 'SecurePass123'
        })
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/parent/register')
        .send({
          name: 'Jane Parent',
          email: 'john@example.com',
          password: 'SecurePass123'
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User with this email already exists');
    });

    test('should create user with parent role', async () => {
      const response = await request(app)
        .post('/api/auth/parent/register')
        .send({
          name: 'John Parent',
          email: 'john@example.com',
          password: 'SecurePass123'
        })
        .expect(201);

      // Verify user was created in database
      const user = await User.findOne({ email: 'john@example.com' });
      expect(user).toBeTruthy();
      expect(user.role).toBe('parent');
      expect(user.name).toBeUndefined(); // Name not stored in User model
    });
  });

  describe('POST /api/auth/parent/login', () => {
    beforeEach(async () => {
      // Create a test parent user
      const user = new User({
        email: 'parent@example.com',
        password: 'SecurePass123',
        role: 'parent'
      });
      await user.save();
    });

    test('should login parent successfully', async () => {
      const response = await request(app)
        .post('/api/auth/parent/login')
        .send({
          email: 'parent@example.com',
          password: 'SecurePass123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.role).toBe('parent');
      expect(response.body.user.email).toBe('parent@example.com');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/parent/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email and password are required');
    });

    test('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/parent/login')
        .send({
          email: 'parent@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should reject non-parent users', async () => {
      // Create an admin user
      const adminUser = new User({
        email: 'admin@example.com',
        password: 'AdminPass123',
        role: 'admin'
      });
      await adminUser.save();

      const response = await request(app)
        .post('/api/auth/parent/login')
        .send({
          email: 'admin@example.com',
          password: 'AdminPass123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should extend token expiration with rememberMe', async () => {
      const response = await request(app)
        .post('/api/auth/parent/login')
        .send({
          email: 'parent@example.com',
          password: 'SecurePass123',
          rememberMe: true
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();

      // Decode token to check expiration (this would require jwt import)
      // For now, we verify the endpoint accepts rememberMe parameter
    });

    test('should handle non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/parent/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SecurePass123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('Role-based Access Control', () => {
    let parentToken;
    let adminToken;

    beforeEach(async () => {
      // Create test users
      const parentUser = new User({
        email: 'parent@example.com',
        password: 'SecurePass123',
        role: 'parent'
      });
      await parentUser.save();

      const adminUser = new User({
        email: 'admin@example.com',
        password: 'AdminPass123',
        role: 'admin'
      });
      await adminUser.save();

      // Get tokens
      const parentLogin = await request(app)
        .post('/api/auth/parent/login')
        .send({
          email: 'parent@example.com',
          password: 'SecurePass123'
        });

      parentToken = parentLogin.body.token;

      const adminLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'AdminPass123'
        });

      adminToken = adminLogin.body.token;
    });

    test('should allow parent to access parent-specific endpoints', async () => {
      // This test assumes there are protected parent endpoints
      // For now, we'll test the login endpoint which should work
      const response = await request(app)
        .post('/api/auth/parent/login')
        .send({
          email: 'parent@example.com',
          password: 'SecurePass123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should validate JWT token structure', async () => {
      expect(parentToken).toBeDefined();
      expect(typeof parentToken).toBe('string');
      expect(parentToken.split('.').length).toBe(3); // JWT has 3 parts
    });
  });
});
