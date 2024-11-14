import { User } from '../models/User.js';
import { generateToken } from '../middleware/authMiddleware.js';
import { setupMFA, verifyMFA } from '../services/mfaService.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user);
      res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const setupUserMFA = async (req, res) => {
  try {
    const userId = req.user.id;
    const { secret, qrCodeDataUrl } = await setupMFA(userId);
    res.json({ secret, qrCodeDataUrl });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyUserMFA = async (req, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;
    const isValid = await verifyMFA(userId, token);
    if (isValid) {
      res.json({ message: 'MFA verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid MFA token' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};