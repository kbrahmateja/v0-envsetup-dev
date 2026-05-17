-- Add state/region column to visitors table for more detailed location tracking
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS state VARCHAR(100);

-- Add index for faster location-based queries
CREATE INDEX IF NOT EXISTS idx_visitors_country ON visitors(country);
CREATE INDEX IF NOT EXISTS idx_visitors_city ON visitors(city);
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at DESC);
