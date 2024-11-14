import jwt from 'jsonwebtoken';
import { logger } from './errorHandler.js';
import { verifyMFA } from './mfaService.js';
import config from './config.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, config.jwtSecret);
    req.user = user;

    // Check if MFA is required
    if (user.mfaRequired) {
      const mfaToken = req.headers['x-mfa-token'];
      if (!mfaToken) {
        return res.status(403).json({ error: 'MFA token required' });
      }

      const mfaVerified = await verifyMFA(user.id, mfaToken);
      if (!mfaVerified) {
        return res.status(403).json({ error: 'Invalid MFA token' });
      }
    }

    next();
  } catch (err) {
    logger.error(`Authentication error: ${err.message}`);
    return res.sendStatus(403);
  }
};

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, mfaRequired: user.mfaEnabled }, config.jwtSecret, { expiresIn: '1h' });
};