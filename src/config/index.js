import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  redisUrl: process.env.REDIS_URL,
  ethereumNodeUrl: process.env.ETHEREUM_NODE_URL,
  ethereumPrivateKey: process.env.ETHEREUM_PRIVATE_KEY,
  royaltyContractAddress: process.env.ROYALTY_CONTRACT_ADDRESS,
};