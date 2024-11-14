import request from 'supertest';
import app from '../../src/server.js';
import { User } from '../../src/models/User.js';

jest.mock('../../src/models/User.js');

describe('Authentication Endpoints', () => {
  test('POST /api/users/register', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
    User.create.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/users/login', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', password: 'hashedpassword' };
    User.findByEmail.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
  });
});