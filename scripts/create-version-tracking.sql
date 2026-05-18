-- Version tracking table
CREATE TABLE IF NOT EXISTS version_tracking (
  id SERIAL PRIMARY KEY,
  ecosystem VARCHAR(50) NOT NULL,      -- 'npm', 'pypi', 'crates', 'go', 'maven', 'docker'
  package_name VARCHAR(200) NOT NULL,  -- 'next', 'fastapi', 'actix-web', etc.
  display_name VARCHAR(200) NOT NULL,  -- 'Next.js', 'FastAPI', etc.
  language VARCHAR(50) NOT NULL,
  current_version VARCHAR(50),         -- version we currently track
  latest_version VARCHAR(50),          -- latest available
  is_new BOOLEAN DEFAULT false,        -- true if newer than current_version
  changelog_url TEXT,
  release_date TIMESTAMPTZ,
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ecosystem, package_name)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_version_tracking_new ON version_tracking(is_new) WHERE is_new = true;
CREATE INDEX IF NOT EXISTS idx_version_tracking_lang ON version_tracking(language);

-- Seed with packages we want to track
INSERT INTO version_tracking (ecosystem, package_name, display_name, language, current_version, changelog_url)
VALUES
  -- JavaScript/TypeScript
  ('npm', 'next',              'Next.js',        'typescript',  '15.0.0',  'https://github.com/vercel/next.js/releases'),
  ('npm', '@nestjs/core',      'NestJS',         'typescript',  '10.0.0',  'https://github.com/nestjs/nest/releases'),
  ('npm', 'svelte',            'SvelteKit',      'typescript',  '4.0.0',   'https://github.com/sveltejs/svelte/releases'),
  ('npm', 'nuxt',              'Nuxt.js',        'typescript',  '3.0.0',   'https://github.com/nuxt/nuxt/releases'),
  ('npm', '@remix-run/node',   'Remix',          'typescript',  '2.0.0',   'https://github.com/remix-run/remix/releases'),
  ('npm', 'astro',             'Astro',          'typescript',  '4.0.0',   'https://github.com/withastro/astro/releases'),
  ('npm', 'elysia',            'Elysia',         'typescript',  '1.0.0',   'https://github.com/elysiajs/elysia/releases'),
  ('npm', 'hono',              'Hono',           'typescript',  '4.0.0',   'https://github.com/honojs/hono/releases'),
  ('npm', 'express',           'Express.js',     'javascript',  '4.18.0',  'https://github.com/expressjs/express/releases'),
  ('npm', 'fastify',           'Fastify',        'javascript',  '4.0.0',   'https://github.com/fastify/fastify/releases'),
  -- Python
  ('pypi', 'fastapi',          'FastAPI',        'python',      '0.109.0', 'https://github.com/tiangolo/fastapi/releases'),
  ('pypi', 'django',           'Django',         'python',      '5.0.0',   'https://docs.djangoproject.com/en/stable/releases/'),
  ('pypi', 'flask',            'Flask',          'python',      '3.0.0',   'https://flask.palletsprojects.com/en/stable/changes/'),
  ('pypi', 'litestar',         'Litestar',       'python',      '2.0.0',   'https://github.com/litestar-org/litestar/releases'),
  -- Go
  ('go', 'github.com/gin-gonic/gin',        'Gin',    'go', 'v1.9.0',  'https://github.com/gin-gonic/gin/releases'),
  ('go', 'github.com/gofiber/fiber/v2',     'Fiber',  'go', 'v2.52.0', 'https://github.com/gofiber/fiber/releases'),
  ('go', 'github.com/labstack/echo/v4',     'Echo',   'go', 'v4.11.0', 'https://github.com/labstack/echo/releases'),
  -- Rust
  ('crates', 'actix-web',      'Actix',          'rust',        '4.4.0',   'https://github.com/actix/actix-web/releases'),
  ('crates', 'axum',           'Axum',           'rust',        '0.7.0',   'https://github.com/tokio-rs/axum/releases'),
  ('crates', 'rocket',         'Rocket',         'rust',        '0.5.0',   'https://rocket.rs/news/'),
  -- PHP
  ('packagist', 'laravel/framework', 'Laravel',  'php',         '11.0.0',  'https://laravel.com/docs/releases'),
  ('packagist', 'symfony/symfony',   'Symfony',  'php',         '7.0.0',   'https://symfony.com/releases'),
  -- Ruby
  ('rubygems', 'rails',         'Rails',          'ruby',        '7.1.0',   'https://rubyonrails.org/2023/11/10/Rails-7-1-0-has-been-released'),
  -- Docker base images
  ('docker', 'node',            'Node.js',        'javascript',  '20',      'https://nodejs.org/en/blog/release/'),
  ('docker', 'python',          'Python',         'python',      '3.12',    'https://www.python.org/downloads/'),
  ('docker', 'golang',          'Go',             'go',          '1.22',    'https://go.dev/doc/devel/release'),
  ('docker', 'rust',            'Rust',           'rust',        '1.75',    'https://blog.rust-lang.org/'),
  ('docker', 'ruby',            'Ruby',           'ruby',        '3.3',     'https://www.ruby-lang.org/en/news/')
ON CONFLICT (ecosystem, package_name) DO NOTHING;
