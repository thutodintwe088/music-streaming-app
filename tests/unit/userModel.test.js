import { User } from '../../src/models/User.js';
import { pool } from '../../src/utils/db.js';
import bcrypt from 'bcrypt';

jest.mock('../../src/utils/db.js');
jest.mock('bcrypt');

describe('User Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('create user', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
    pool.query.mockResolvedValue({ rows: [mockUser] });
    bcrypt.hash.mockResolvedValue('hashedpassword');

    const result = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });

    expect(result).toEqual(mockUser);
    expect(pool.query).toHaveBeenCalledWith(
      expect.any(String),
      ['testuser', 'test@example.com', 'hashedpassword']
    );
  });

  test('find user by email', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
    pool.query.mockResolvedValue({ rows: [mockUser] });

    const result = await User.findByEmail('test@example.com');

    expect(result).toEqual(mockUser);
    expect(pool.query).toHaveBeenCalledWith(
      expect.any(String),
      ['test@example.com']
    );
  });
});