import express from 'express';
import { authenticateToken } from './authMiddleware.js';
import { createPaymentIntent } from './paymentService.js';
import { logger } from './errorHandler.js';

const router = express.Router();

router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { plan } = req.body;
    let amount;
    switch (plan) {
      case 'basic':
        amount = 999; // $9.99
        break;
      case 'premium':
        amount = 1999; // $19.99
        break;
      default:
        return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const paymentIntent = await createPaymentIntent(amount);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    logger.error(`Error in subscription route: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;