-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  html_content TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255)
);

-- Create visitors table for tracking
CREATE TABLE IF NOT EXISTS visitors (
  id SERIAL PRIMARY KEY,
  ip_address VARCHAR(50),
  user_agent TEXT,
  page_url VARCHAR(500),
  referrer VARCHAR(500),
  country VARCHAR(100),
  city VARCHAR(100),
  visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create newsletter sends tracking
CREATE TABLE IF NOT EXISTS newsletter_sends (
  id SERIAL PRIMARY KEY,
  newsletter_id INTEGER REFERENCES newsletters(id) ON DELETE CASCADE,
  subscriber_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP,
  error_message TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status);
CREATE INDEX IF NOT EXISTS idx_newsletters_created_at ON newsletters(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_page_url ON visitors(page_url);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_newsletter_id ON newsletter_sends(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_status ON newsletter_sends(status);
