import { sql } from "@/lib/db"

export const maxDuration = 30

export async function GET() {
  try {
    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS version_tracking (
        id SERIAL PRIMARY KEY,
        ecosystem VARCHAR(50) NOT NULL,
        package_name VARCHAR(200) NOT NULL,
        display_name VARCHAR(200) NOT NULL,
        language VARCHAR(50) NOT NULL,
        current_version VARCHAR(50),
        latest_version VARCHAR(50),
        is_new BOOLEAN DEFAULT false,
        changelog_url TEXT,
        checked_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(ecosystem, package_name)
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_vt_new ON version_tracking(is_new) WHERE is_new = true`

    // Seed packages
    const packages = [
      ['npm', 'next', 'Next.js', 'typescript', '15.0.0', 'https://github.com/vercel/next.js/releases'],
      ['npm', '@nestjs/core', 'NestJS', 'typescript', '10.0.0', 'https://github.com/nestjs/nest/releases'],
      ['npm', 'express', 'Express.js', 'javascript', '4.18.0', 'https://github.com/expressjs/express/releases'],
      ['npm', 'fastify', 'Fastify', 'javascript', '4.0.0', 'https://github.com/fastify/fastify/releases'],
      ['npm', 'hono', 'Hono', 'typescript', '4.0.0', 'https://github.com/honojs/hono/releases'],
      ['npm', 'svelte', 'SvelteKit', 'typescript', '4.0.0', 'https://github.com/sveltejs/svelte/releases'],
      ['npm', 'nuxt', 'Nuxt.js', 'typescript', '3.0.0', 'https://github.com/nuxt/nuxt/releases'],
      ['npm', 'elysia', 'Elysia', 'typescript', '1.0.0', 'https://github.com/elysiajs/elysia/releases'],
      ['pypi', 'fastapi', 'FastAPI', 'python', '0.109.0', 'https://github.com/tiangolo/fastapi/releases'],
      ['pypi', 'django', 'Django', 'python', '5.0.0', 'https://github.com/django/django/releases'],
      ['pypi', 'flask', 'Flask', 'python', '3.0.0', 'https://github.com/pallets/flask/releases'],
      ['go', 'github.com/gin-gonic/gin', 'Gin', 'go', 'v1.9.0', 'https://github.com/gin-gonic/gin/releases'],
      ['go', 'github.com/gofiber/fiber/v2', 'Fiber', 'go', 'v2.52.0', 'https://github.com/gofiber/fiber/releases'],
      ['crates', 'actix-web', 'Actix Web', 'rust', '4.4.0', 'https://github.com/actix/actix-web/releases'],
      ['crates', 'axum', 'Axum', 'rust', '0.7.0', 'https://github.com/tokio-rs/axum/releases'],
      ['packagist', 'laravel/framework', 'Laravel', 'php', '11.0.0', 'https://laravel.com/docs/releases'],
      ['rubygems', 'rails', 'Ruby on Rails', 'ruby', '7.1.0', 'https://rubyonrails.org/releases'],
    ]

    let seeded = 0
    for (const [ecosystem, pkg, display, lang, version, url] of packages) {
      await sql`
        INSERT INTO version_tracking (ecosystem, package_name, display_name, language, current_version, changelog_url)
        VALUES (${ecosystem}, ${pkg}, ${display}, ${lang}, ${version}, ${url})
        ON CONFLICT (ecosystem, package_name) DO NOTHING
      `
      seeded++
    }

    const count = await sql`SELECT COUNT(*) as total FROM version_tracking`
    return Response.json({ success: true, total: (count as any[])[0]?.total, seeded })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
