import fs from 'fs/promises';
import { pool } from '../src/utils/db.js';
import logger from '../src/utils/logger.js';

async function generateAnalytics() {
  try {
    const client = await pool.connect();
    
    const userActivityQuery = `
      SELECT 
        DATE_TRUNC('day', timestamp) as date,
        COUNT(*) as total_plays,
        COUNT(DISTINCT user_id) as unique_listeners
      FROM user_activity
      WHERE action = 'play' AND timestamp > NOW() - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', timestamp)
      ORDER BY date
    `;
    
    const topTracksQuery = `
      SELECT 
        t.title,
        t.artist,
        COUNT(*) as play_count
      FROM user_activity ua
      JOIN tracks t ON ua.track_id = t.id
      WHERE ua.action = 'play' AND ua.timestamp > NOW() - INTERVAL '30 days'
      GROUP BY t.id
      ORDER BY play_count DESC
      LIMIT 10
    `;

    const [userActivityResult, topTracksResult] = await Promise.all([
      client.query(userActivityQuery),
      client.query(topTracksQuery)
    ]);

    const analyticsData = {
      userActivity: userActivityResult.rows,
      topTracks: topTracksResult.rows,
      generatedAt: new Date().toISOString()
    };

    await fs.writeFile('analytics.json', JSON.stringify(analyticsData, null, 2));
    logger.info('Analytics data generated and saved to analytics.json');

    client.release();
  } catch (error) {
    logger.error('Error generating analytics:', error);
  }
}

generateAnalytics();