-- Add state column if it doesn't exist
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS state VARCHAR(100);

-- Update the index
CREATE INDEX IF NOT EXISTS idx_visitors_country ON visitors(country);
CREATE INDEX IF NOT EXISTS idx_visitors_city ON visitors(city);
