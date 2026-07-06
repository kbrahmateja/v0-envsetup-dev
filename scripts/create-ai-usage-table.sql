-- Tracks one row per AI assistant conversation *session* (not per message) so we can
-- rate-limit free-tier usage without requiring end-user accounts. Identity is a
-- best-effort combination of IP address and a long-lived browser cookie.
CREATE TABLE IF NOT EXISTS ai_assistant_usage (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(64) UNIQUE NOT NULL,
  ip_address VARCHAR(50),
  cookie_id VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_ip_created ON ai_assistant_usage(ip_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_cookie_created ON ai_assistant_usage(cookie_id, created_at DESC);
