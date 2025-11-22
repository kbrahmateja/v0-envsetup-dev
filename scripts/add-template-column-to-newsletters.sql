-- Add template column to newsletters table
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS template VARCHAR(100) DEFAULT 'simple-update';

-- Add index for faster template filtering
CREATE INDEX IF NOT EXISTS idx_newsletters_template ON newsletters(template);
