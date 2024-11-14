import { createPaymentIntent } from '../services/paymentService.js';
import { User } from '../models/User.js';

export const createSubscription = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.id;

    let amount;
    switch (plan) {
      case 'basic':
        amount = 999; // $9.99
        break;
      case 'premium':
        amount = 1999; // $19.99
        break;
      default:
        return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const paymentIntent = await createPaymentIntent(amount);
    
    // Update user's subscription status (you might want to wait for webhook confirmation in production)
    await User.updateSubscription(userId, plan);

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.updateSubscription(userId, null);
    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};