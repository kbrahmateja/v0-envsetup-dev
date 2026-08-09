-- Create suggestions table to store user feedback/suggestions submitted
-- via the site-wide feedback widget (see components/feedback-widget.tsx).
CREATE TABLE IF NOT EXISTS suggestions (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  email VARCHAR(255),
  page_url VARCHAR(500),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_suggestions_submitted_at ON suggestions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status);
