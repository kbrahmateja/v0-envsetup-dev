-- Add template column to newsletters table to track which email template is used
ALTER TABLE newsletters 
ADD COLUMN IF NOT EXISTS template VARCHAR(100) DEFAULT 'simple-update';

-- Update existing newsletters to have default template
UPDATE newsletters 
SET template = 'simple-update' 
WHERE template IS NULL;
