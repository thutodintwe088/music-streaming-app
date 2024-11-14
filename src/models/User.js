import { pool } from '../utils/db.js';
import bcrypt from 'bcrypt';

export class User {
  static async create({ username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email';
    const values = [username, email, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, username, email FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateMfaSecret(userId, mfaSecret) {
    const query = 'UPDATE users SET mfa_secret = $1 WHERE id = $2';
    await pool.query(query, [mfaSecret, userId]);
  }
}