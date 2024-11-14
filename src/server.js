import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import { errorHandler, logger } from './errorHandler.js';
import { authenticateToken } from './authMiddleware.js';
import { apiLimiter } from './rateLimiter.js';
import config from './config.js';
import userRoutes from './routes/userRoutes.js';
import trackRoutes from './routes/trackRoutes.js';
import analyticsRoutes from './analyticsApi.js';
import subscriptionRoutes from './subscriptionRoutes.js';
import { calculateRoyalties } from './royaltyCalculator.js';
import { generateFinancialReport, forecastRevenue } from './financialReporting.js';
import { distributeRoyalties } from './blockchainService.js';
import './backupScheduler.js';

const app = express();

// Database connection
const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());

// Apply rate limiter to all requests
app.use(apiLimiter);

// Middleware to attach db to request
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tracks', authenticateToken, trackRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Financial reporting route
app.get('/api/financial-report', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await generateFinancialReport(startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Error generating financial report' });
  }
});

// Revenue forecast route
app.get('/api/revenue-forecast', authenticateToken, async (req, res) => {
  try {
    const { months } = req.query;
    const forecast = await forecastRevenue(parseInt(months) || 3);
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: 'Error generating revenue forecast' });
  }
});

// Blockchain royalty distribution route
app.post('/api/distribute-royalties', authenticateToken, async (req, res) => {
  try {
    const { artists, amounts } = req.body;
    const txHash = await distributeRoyalties(artists, amounts);
    res.json({ transactionHash: txHash });
  } catch (error) {
    res.status(500).json({ error: 'Error distributing royalties' });
  }
});

// Error handling
app.use(errorHandler);

const port = config.port;

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

// Schedule royalty calculations (e.g., daily at midnight)
setInterval(calculateRoyalties, 24 * 60 * 60 * 1000);

export { pool };