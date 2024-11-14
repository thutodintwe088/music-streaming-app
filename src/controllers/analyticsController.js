import { UserActivity } from '../models/UserActivity.js';
import { generateFinancialReport, forecastRevenue } from '../services/financialReporting.js';

export const getUserListeningHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;
    const history = await UserActivity.getUserListeningHistory(userId, parseInt(limit), parseInt(offset));
    res.json(history);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMostPlayedTracks = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const tracks = await UserActivity.getMostPlayedTracks(parseInt(limit));
    res.json(tracks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await generateFinancialReport(new Date(startDate), new Date(endDate));
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRevenueForecast = async (req, res) => {
  try {
    const { months = 3 } = req.query;
    const forecast = await forecastRevenue(parseInt(months));
    res.json(forecast);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};