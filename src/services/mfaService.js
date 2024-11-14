import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { pool } from './server.js';
import { logger } from './errorHandler.js';

export const setupMFA = async (userId) => {
  try {
    const secret = speakeasy.generateSecret({ name: 'Music Streaming App' });
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: 'Music Streaming App',
      issuer: 'Your Company Name'
    });

    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

    await pool.query('UPDATE users SET mfa_secret = $1 WHERE id = $2', [secret.base32, userId]);

    return { secret: secret.base32, qrCodeDataUrl };
  } catch (error) {
    logger.error(`Error setting up MFA: ${error.message}`);
    throw error;
  }
};

export const verifyMFA = async (userId, token) => {
  try {
    const result = await pool.query('SELECT mfa_secret FROM users WHERE id = $1', [userId]);
    const secret = result.rows[0].mfa_secret;

    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token
    });

    return verified;
  } catch (error) {
    logger.error(`Error verifying MFA: ${error.message}`);
    throw error;
  }
};