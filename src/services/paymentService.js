import Stripe from 'stripe';
import { logger } from './errorHandler.js';
import config from './config.js';

const stripe = new Stripe(config.stripeSecretKey);

export const createPaymentIntent = async (amount, currency = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    return paymentIntent;
  } catch (error) {
    logger.error(`Error creating payment intent: ${error.message}`);
    throw error;
  }
};

export const processArtistPayout = async (artistId, amount) => {
  try {
    const transfer = await stripe.transfers.create({
      amount,
      currency: 'usd',
      destination: artistId, // Assuming artistId is the Stripe account ID
    });
    return transfer;
  } catch (error) {
    logger.error(`Error processing artist payout: ${error.message}`);
    throw error;
  }
};