import { Track } from '../models/Track.js';
import { UserActivity } from '../models/UserActivity.js';

export const createTrack = async (req, res) => {
  try {
    const { title, artist, genre, duration } = req.body;
    const track = await Track.create({ title, artist, genre, duration });
    res.status(201).json(track);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTrack = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (track) {
      res.json(track);
    } else {
      res.status(404).json({ message: 'Track not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllTracks = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const tracks = await Track.findAll(parseInt(limit), parseInt(offset));
    res.json(tracks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const playTrack = async (req, res) => {
  try {
    const trackId = req.params.id;
    const userId = req.user.id;
    await UserActivity.log(userId, trackId, 'play');
    const newPlayCount = await Track.incrementPlayCount(trackId);
    res.json({ message: 'Play logged successfully', newPlayCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};