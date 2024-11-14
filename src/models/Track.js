import { pool } from '../utils/db.js';

export class Track {
  static async create({ title, artist, genre, duration }) {
    const query = 'INSERT INTO tracks (title, artist, genre, duration) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [title, artist, genre, duration];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM tracks WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(limit = 20, offset = 0) {
    const query = 'SELECT * FROM tracks ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async incrementPlayCount(id) {
    const query = 'UPDATE tracks SET play_count = play_count + 1 WHERE id = $1 RETURNING play_count';
    const result = await pool.query(query, [id]);
    return result.rows[0].play_count;
  }
}