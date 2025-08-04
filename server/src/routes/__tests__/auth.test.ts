import request from 'supertest';
import express from 'express';
import authRouter from '../auth';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes', () => {
  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@test.com',
        password: 'password123',
        role: 'user'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.token).toBeDefined();

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user?.name).toBe(userData.name);
    });

    it('should not register user with existing email', async () => {
      // Create a user first
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Existing User',
        email: 'existing@test.com',
        password: hashedPassword,
        role: 'user'
      });

      const userData = {
        name: 'New User',
        email: 'existing@test.com',
        password: 'newpassword123',
        role: 'user'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User with this email already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ name: 'John', email: 'john@test.com' }) // missing password
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Name, email, and password are required');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Test User',
        email: 'test@test.com',
        password: hashedPassword,
        role: 'user'
      });
    });

    it('should login user with correct credentials', async () => {
      const loginData = {
        email: 'test@test.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.user.token).toBeDefined();
    });

    it('should not login with incorrect password', async () => {
      const loginData = {
        email: 'test@test.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should not login with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@test.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
