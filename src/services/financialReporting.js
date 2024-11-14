import { pool } from './server.js';
import { logger } from './errorHandler.js';

export const generateFinancialReport = async (startDate, endDate) => {
  try {
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('day', timestamp) as date,
        COUNT(*) as total_plays,
        COUNT(DISTINCT user_id) as unique_listeners,
        SUM(CASE WHEN ua.user_id IN (SELECT id FROM users WHERE subscription_type = 'premium') THEN 1 ELSE 0 END) as premium_plays
      FROM user_activity ua
      WHERE action = 'play' AND timestamp BETWEEN $1 AND $2
      GROUP BY DATE_TRUNC('day', timestamp)
      ORDER BY date
    `, [startDate, endDate]);

    return result.rows;
  } catch (error) {
    logger.error(`Error generating financial report: ${error.message}`);
    throw error;
  }
};

export const forecastRevenue = async (months = 3) => {
  try {
    const historicalData = await pool.query(`
      SELECT 
        DATE_TRUNC('month', timestamp) as month,
        COUNT(DISTINCT user_id) as monthly_active_users,
        SUM(CASE WHEN u.subscription_type = 'premium' THEN 19.99 ELSE 0 END) as revenue
      FROM user_activity ua
      JOIN users u ON ua.user_id = u.id
      WHERE timestamp > NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', timestamp)
      ORDER BY month
    `);

    // Simple linear regression for forecasting
    const xValues = historicalData.rows.map((row, index) => index);
    const yValues = historicalData.rows.map(row => parseFloat(row.revenue));
    const n = xValues.length;
    const sum_x = xValues.reduce((a, b) => a + b, 0);
    const sum_y = yValues.reduce((a, b) => a + b, 0);
    const sum_xy = xValues.reduce((total, x, i) => total + x * yValues[i], 0);
    const sum_xx = xValues.reduce((total, x) => total + x * x, 0);
    
    const slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    const intercept = (sum_y - slope * sum_x) / n;

    const forecast = [];
    for (let i = 1; i <= months; i++) {
      forecast.push({
        month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
        forecasted_revenue: slope * (n + i) + intercept
      });
    }

    return forecast;
  } catch (error) {
    logger.error(`Error forecasting revenue: ${error.message}`);
    throw error;
  }
};