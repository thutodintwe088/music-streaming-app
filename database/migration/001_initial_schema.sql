CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  mfa_secret VARCHAR(255),
  subscription_type VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tracks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  genre VARCHAR(50),
  duration INTEGER NOT NULL,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_activity (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  track_id INTEGER REFERENCES tracks(id),
  action VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_track_id ON user_activity(track_id);
CREATE INDEX idx_user_activity_timestamp ON user_activity(timestamp);

CREATE INDEX idx_tracks_title ON tracks(title);
CREATE INDEX idx_tracks_artist ON tracks(artist);
CREATE INDEX idx_tracks_genre ON tracks(genre);