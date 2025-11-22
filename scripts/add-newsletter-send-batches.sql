-- Create newsletter send batches to track each send action
CREATE TABLE IF NOT EXISTS newsletter_send_batches (
  id SERIAL PRIMARY KEY,
  newsletter_id INTEGER REFERENCES newsletters(id) ON DELETE CASCADE,
  total_recipients INTEGER NOT NULL,
  successful_sends INTEGER DEFAULT 0,
  failed_sends INTEGER DEFAULT 0,
  mail_service VARCHAR(50) DEFAULT 'brevo',
  recipient_mode VARCHAR(50) DEFAULT 'all',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_by VARCHAR(255)
);

-- Update newsletter_sends to reference batch
ALTER TABLE newsletter_sends ADD COLUMN IF NOT EXISTS batch_id INTEGER REFERENCES newsletter_send_batches(id) ON DELETE CASCADE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_send_batches_newsletter_id ON newsletter_send_batches(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_send_batches_sent_at ON newsletter_send_batches(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_batch_id ON newsletter_sends(batch_id);
