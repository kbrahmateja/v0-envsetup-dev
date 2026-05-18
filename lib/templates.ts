export interface Template {
  id: string
  slug: string
  name: string
  description: string
  tags: string[]
  popular: boolean
  featured: boolean
  category: string
  language: string
  framework: string
  database?: string
  devOps?: string[]
  author: string
  rating: number
  downloads: number
  views: number
  updatedAt: string
}

export const templates: Template[] = [
  // ── JavaScript / TypeScript ──────────────────────────────
  {
    id: "mern", slug: "mern-stack", name: "MERN Stack", category: "Full Stack",
    description: "MongoDB, Express.js, React, Node.js with auth and CRUD.",
    tags: ["JavaScript", "MongoDB", "Express", "React", "Node.js"],
    popular: true, featured: true, language: "javascript", framework: "react", database: "mongodb",
    author: "envsetup.dev", rating: 4.8, downloads: 3200, views: 12400, updatedAt: "2025-01-15",
  },
  {
    id: "mean", slug: "mean-stack", name: "MEAN Stack", category: "Full Stack",
    description: "MongoDB, Express, Angular, Node.js — enterprise-ready full stack.",
    tags: ["JavaScript", "MongoDB", "Express", "Angular", "Node.js"],
    popular: false, featured: false, language: "javascript", framework: "angular", database: "mongodb",
    author: "envsetup.dev", rating: 4.4, downloads: 980, views: 4200, updatedAt: "2025-01-10",
  },
  {
    id: "nextjs-tailwind", slug: "nextjs-tailwind", name: "Next.js + Tailwind", category: "Frontend",
    description: "Modern Next.js with Tailwind CSS, TypeScript, and API routes.",
    tags: ["TypeScript", "Next.js", "Tailwind CSS", "Vercel"],
    popular: true, featured: true, language: "typescript", framework: "nextjs", 
    author: "envsetup.dev", rating: 4.9, downloads: 5100, views: 18200, updatedAt: "2025-01-20",
  },
  {
    id: "nextjs-prisma-pg", slug: "nextjs-prisma-postgres", name: "Next.js + Prisma + PostgreSQL", category: "Full Stack",
    description: "Type-safe full-stack with Next.js, Prisma ORM, and PostgreSQL.",
    tags: ["TypeScript", "Next.js", "Prisma", "PostgreSQL"],
    popular: true, featured: true, language: "typescript", framework: "nextjs", database: "postgres",
    author: "envsetup.dev", rating: 4.9, downloads: 4200, views: 15800, updatedAt: "2025-01-22",
  },
  {
    id: "nextjs-supabase", slug: "nextjs-supabase", name: "Next.js + Supabase", category: "Full Stack",
    description: "Next.js with Supabase as a backend — auth, DB, storage included.",
    tags: ["TypeScript", "Next.js", "Supabase", "PostgreSQL"],
    popular: true, featured: false, language: "typescript", framework: "nextjs", database: "postgres",
    author: "envsetup.dev", rating: 4.8, downloads: 3600, views: 13100, updatedAt: "2025-01-18",
  },
  {
    id: "t3-stack", slug: "t3-stack", name: "T3 Stack", category: "Full Stack",
    description: "Type-safe: Next.js + tRPC + Prisma + NextAuth + Tailwind.",
    tags: ["TypeScript", "Next.js", "tRPC", "Prisma", "NextAuth"],
    popular: true, featured: true, language: "typescript", framework: "nextjs", database: "postgres",
    author: "envsetup.dev", rating: 4.9, downloads: 4800, views: 17600, updatedAt: "2025-01-19",
  },
  {
    id: "remix-pg", slug: "remix-postgres", name: "Remix + PostgreSQL", category: "Full Stack",
    description: "Remix full-stack framework with PostgreSQL and Prisma.",
    tags: ["TypeScript", "Remix", "PostgreSQL", "Prisma"],
    popular: false, featured: false, language: "typescript", framework: "remix", database: "postgres",
    author: "envsetup.dev", rating: 4.5, downloads: 820, views: 3600, updatedAt: "2025-01-12",
  },
  {
    id: "sveltekit-pg", slug: "sveltekit-postgres", name: "SvelteKit + PostgreSQL", category: "Full Stack",
    description: "SvelteKit with PostgreSQL and Prisma for modern web apps.",
    tags: ["TypeScript", "SvelteKit", "PostgreSQL", "Prisma"],
    popular: false, featured: false, language: "typescript", framework: "sveltekit", database: "postgres",
    author: "envsetup.dev", rating: 4.6, downloads: 740, views: 3100, updatedAt: "2025-01-11",
  },
  {
    id: "sveltekit-supabase", slug: "sveltekit-supabase", name: "SvelteKit + Supabase", category: "Full Stack",
    description: "SvelteKit with Supabase — realtime, auth, and database.",
    tags: ["TypeScript", "SvelteKit", "Supabase"],
    popular: false, featured: false, language: "typescript", framework: "sveltekit", database: "postgres",
    author: "envsetup.dev", rating: 4.6, downloads: 690, views: 2900, updatedAt: "2025-01-09",
  },
  {
    id: "nestjs-pg", slug: "nestjs-postgres", name: "NestJS + PostgreSQL", category: "Backend",
    description: "Enterprise Node.js with NestJS, TypeORM, and PostgreSQL.",
    tags: ["TypeScript", "NestJS", "PostgreSQL", "TypeORM"],
    popular: true, featured: false, language: "typescript", framework: "nestjs", database: "postgres",
    author: "envsetup.dev", rating: 4.7, downloads: 2100, views: 8400, updatedAt: "2025-01-14",
  },
  {
    id: "nestjs-mongo", slug: "nestjs-mongodb", name: "NestJS + MongoDB", category: "Backend",
    description: "NestJS with Mongoose ODM and MongoDB.",
    tags: ["TypeScript", "NestJS", "MongoDB", "Mongoose"],
    popular: false, featured: false, language: "typescript", framework: "nestjs", database: "mongodb",
    author: "envsetup.dev", rating: 4.5, downloads: 1100, views: 4600, updatedAt: "2025-01-13",
  },
  {
    id: "express-pg", slug: "express-postgres", name: "Express + PostgreSQL", category: "Backend",
    description: "Express.js REST API with PostgreSQL and Sequelize ORM.",
    tags: ["JavaScript", "Express", "PostgreSQL", "Sequelize"],
    popular: true, featured: false, language: "javascript", framework: "express", database: "postgres",
    author: "envsetup.dev", rating: 4.6, downloads: 2800, views: 9800, updatedAt: "2025-01-16",
  },
  {
    id: "express-mongo", slug: "express-mongodb", name: "Express + MongoDB", category: "Backend",
    description: "Express.js REST API with MongoDB and Mongoose.",
    tags: ["JavaScript", "Express", "MongoDB", "Mongoose"],
    popular: false, featured: false, language: "javascript", framework: "express", database: "mongodb",
    author: "envsetup.dev", rating: 4.5, downloads: 1900, views: 7200, updatedAt: "2025-01-15",
  },
  {
    id: "fastify-pg", slug: "fastify-postgres", name: "Fastify + PostgreSQL", category: "Backend",
    description: "High-performance Fastify API with PostgreSQL.",
    tags: ["JavaScript", "Fastify", "PostgreSQL"],
    popular: false, featured: false, language: "javascript", framework: "fastify", database: "postgres",
    author: "envsetup.dev", rating: 4.5, downloads: 760, views: 3200, updatedAt: "2025-01-10",
  },
  {
    id: "vue-express", slug: "vue-express", name: "Vue + Express + MongoDB", category: "Full Stack",
    description: "Vue.js frontend with Express.js backend and MongoDB.",
    tags: ["JavaScript", "Vue", "Express", "MongoDB"],
    popular: false, featured: false, language: "javascript", framework: "vue", database: "mongodb",
    author: "envsetup.dev", rating: 4.4, downloads: 1200, views: 5100, updatedAt: "2025-01-08",
  },
  {
    id: "nuxt-pg", slug: "nuxt-postgres", name: "Nuxt.js + PostgreSQL", category: "Full Stack",
    description: "Nuxt 3 full-stack with Nitro server and PostgreSQL.",
    tags: ["TypeScript", "Nuxt.js", "PostgreSQL", "Prisma"],
    popular: false, featured: false, language: "typescript", framework: "nuxtjs", database: "postgres",
    author: "envsetup.dev", rating: 4.5, downloads: 880, views: 3800, updatedAt: "2025-01-11",
  },
  {
    id: "astro-pg", slug: "astro-postgres", name: "Astro + PostgreSQL", category: "Full Stack",
    description: "Astro for blazing-fast sites with PostgreSQL backend.",
    tags: ["TypeScript", "Astro", "PostgreSQL"],
    popular: false, featured: false, language: "typescript", framework: "astro", database: "postgres",
    author: "envsetup.dev", rating: 4.4, downloads: 620, views: 2700, updatedAt: "2025-01-07",
  },
  {
    id: "bun-elysia", slug: "bun-elysia-sqlite", name: "Bun + Elysia + SQLite", category: "Backend",
    description: "Ultra-fast Bun runtime with Elysia framework and SQLite.",
    tags: ["TypeScript", "Bun", "Elysia", "SQLite"],
    popular: false, featured: false, language: "typescript", framework: "elysia", database: "sqlite",
    author: "envsetup.dev", rating: 4.6, downloads: 540, views: 2400, updatedAt: "2025-01-06",
  },

  // ── Python ───────────────────────────────────────────────
  {
    id: "fastapi-pg", slug: "fastapi-postgres", name: "FastAPI + PostgreSQL", category: "Backend",
    description: "FastAPI with SQLAlchemy, Alembic migrations, and PostgreSQL.",
    tags: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy"],
    popular: true, featured: true, language: "python", framework: "fastapi", database: "postgres",
    author: "envsetup.dev", rating: 4.9, downloads: 3800, views: 14200, updatedAt: "2025-01-21",
  },
  {
    id: "fastapi-redis", slug: "fastapi-postgres-redis", name: "FastAPI + PostgreSQL + Redis", category: "Backend",
    description: "FastAPI with PostgreSQL, Redis caching, and Celery workers.",
    tags: ["Python", "FastAPI", "PostgreSQL", "Redis", "Celery"],
    popular: true, featured: false, language: "python", framework: "fastapi", database: "postgres",
    author: "envsetup.dev", rating: 4.8, downloads: 2400, views: 9200, updatedAt: "2025-01-17",
  },
  {
    id: "django-pg", slug: "django-postgres", name: "Django + PostgreSQL", category: "Full Stack",
    description: "Django web app with PostgreSQL, auth, and REST API.",
    tags: ["Python", "Django", "PostgreSQL", "REST"],
    popular: true, featured: false, language: "python", framework: "django", database: "postgres",
    author: "envsetup.dev", rating: 4.7, downloads: 2900, views: 10800, updatedAt: "2025-01-16",
  },
  {
    id: "django-celery", slug: "django-celery-redis", name: "Django + Celery + Redis", category: "Full Stack",
    description: "Django with Celery async tasks, Redis broker, and PostgreSQL.",
    tags: ["Python", "Django", "Celery", "Redis", "PostgreSQL"],
    popular: false, featured: false, language: "python", framework: "django", database: "postgres",
    author: "envsetup.dev", rating: 4.6, downloads: 1400, views: 5800, updatedAt: "2025-01-13",
  },
  {
    id: "flask-pg", slug: "flask-postgres", name: "Flask + PostgreSQL", category: "Backend",
    description: "Flask with SQLAlchemy, PostgreSQL, and JWT auth.",
    tags: ["Python", "Flask", "PostgreSQL", "SQLAlchemy"],
    popular: false, featured: false, language: "python", framework: "flask", database: "postgres",
    author: "envsetup.dev", rating: 4.5, downloads: 1800, views: 7200, updatedAt: "2025-01-12",
  },
  {
    id: "flask-mongo", slug: "flask-mongodb", name: "Flask + MongoDB", category: "Backend",
    description: "Flask REST API with MongoDB and PyMongo.",
    tags: ["Python", "Flask", "MongoDB"],
    popular: false, featured: false, language: "python", framework: "flask", database: "mongodb",
    author: "envsetup.dev", rating: 4.4, downloads: 1100, views: 4600, updatedAt: "2025-01-09",
  },

  // ── Java / Kotlin ────────────────────────────────────────
  {
    id: "spring-boot-pg", slug: "spring-boot-postgres", name: "Spring Boot + PostgreSQL", category: "Backend",
    description: "Spring Boot with JPA, Hibernate, PostgreSQL, and Spring Security.",
    tags: ["Java", "Spring Boot", "PostgreSQL", "JPA"],
    popular: true, featured: false, language: "java", framework: "spring-boot", database: "postgres",
    author: "envsetup.dev", rating: 4.7, downloads: 2600, views: 10200, updatedAt: "2025-01-15",
  },
  {
    id: "spring-react", slug: "spring-boot-react", name: "Spring Boot + React", category: "Full Stack",
    description: "Spring Boot REST API backend with React frontend.",
    tags: ["Java", "Spring Boot", "React", "PostgreSQL"],
    popular: false, featured: false, language: "java", framework: "spring-boot", database: "postgres",
    author: "envsetup.dev", rating: 4.5, downloads: 1500, views: 6200, updatedAt: "2025-01-11",
  },
  {
    id: "quarkus-pg", slug: "quarkus-postgres", name: "Quarkus + PostgreSQL", category: "Backend",
    description: "Supersonic Quarkus with Hibernate Panache and PostgreSQL.",
    tags: ["Java", "Quarkus", "PostgreSQL", "Hibernate"],
    popular: false, featured: false, language: "java", framework: "quarkus", database: "postgres",
    author: "envsetup.dev", rating: 4.5, downloads: 680, views: 2900, updatedAt: "2025-01-08",
  },
  {
    id: "kotlin-spring", slug: "kotlin-spring-postgres", name: "Kotlin + Spring Boot", category: "Backend",
    description: "Kotlin Spring Boot with Exposed ORM and PostgreSQL.",
    tags: ["Kotlin", "Spring Boot", "PostgreSQL", "Exposed"],
    popular: false, featured: false, language: "kotlin", framework: "spring-boot", database: "postgres",
    author: "envsetup.dev", rating: 4.6, downloads: 820, views: 3500, updatedAt: "2025-01-10",
  },

  // ── Go ───────────────────────────────────────────────────
  {
    id: "go-gin-pg", slug: "go-gin-postgres", name: "Go + Gin + PostgreSQL", category: "Backend",
    description: "Go with Gin framework, GORM ORM, and PostgreSQL.",
    tags: ["Go", "Gin", "PostgreSQL", "GORM"],
    popular: true, featured: false, language: "go", framework: "gin", database: "postgres",
    author: "envsetup.dev", rating: 4.8, downloads: 2200, views: 8800, updatedAt: "2025-01-17",
  },
  {
    id: "go-fiber-pg", slug: "go-fiber-postgres", name: "Go + Fiber + PostgreSQL", category: "Backend",
    description: "Express-inspired Fiber framework with PostgreSQL and GORM.",
    tags: ["Go", "Fiber", "PostgreSQL", "GORM"],
    popular: false, featured: false, language: "go", framework: "fiber", database: "postgres",
    author: "envsetup.dev", rating: 4.7, downloads: 1600, views: 6400, updatedAt: "2025-01-14",
  },
  {
    id: "go-echo-mongo", slug: "go-echo-mongodb", name: "Go + Echo + MongoDB", category: "Backend",
    description: "Go with Echo framework and MongoDB driver.",
    tags: ["Go", "Echo", "MongoDB"],
    popular: false, featured: false, language: "go", framework: "echo", database: "mongodb",
    author: "envsetup.dev", rating: 4.5, downloads: 780, views: 3200, updatedAt: "2025-01-09",
  },

  // ── Rust ─────────────────────────────────────────────────
  {
    id: "rust-actix-pg", slug: "rust-actix-postgres", name: "Rust + Actix + PostgreSQL", category: "Backend",
    description: "High-performance Actix-web with SQLx and PostgreSQL.",
    tags: ["Rust", "Actix", "PostgreSQL", "SQLx"],
    popular: false, featured: false, language: "rust", framework: "actix", database: "postgres",
    author: "envsetup.dev", rating: 4.7, downloads: 920, views: 4100, updatedAt: "2025-01-13",
  },
  {
    id: "rust-axum-pg", slug: "rust-axum-postgres", name: "Rust + Axum + PostgreSQL", category: "Backend",
    description: "Modern Axum framework with Tokio, SeaORM, and PostgreSQL.",
    tags: ["Rust", "Axum", "PostgreSQL", "SeaORM"],
    popular: false, featured: false, language: "rust", framework: "axum", database: "postgres",
    author: "envsetup.dev", rating: 4.6, downloads: 740, views: 3300, updatedAt: "2025-01-11",
  },

  // ── PHP ──────────────────────────────────────────────────
  {
    id: "laravel-mysql", slug: "laravel-mysql", name: "Laravel + MySQL", category: "Full Stack",
    description: "Laravel with Eloquent ORM, MySQL, and built-in auth.",
    tags: ["PHP", "Laravel", "MySQL", "Eloquent"],
    popular: true, featured: false, language: "php", framework: "laravel", database: "mysql",
    author: "envsetup.dev", rating: 4.7, downloads: 2400, views: 9600, updatedAt: "2025-01-16",
  },
  {
    id: "laravel-pg", slug: "laravel-postgres", name: "Laravel + PostgreSQL", category: "Full Stack",
    description: "Laravel with PostgreSQL, Sanctum API auth, and Livewire.",
    tags: ["PHP", "Laravel", "PostgreSQL", "Livewire"],
    popular: false, featured: false, language: "php", framework: "laravel", database: "postgres",
    author: "envsetup.dev", rating: 4.6, downloads: 1200, views: 5100, updatedAt: "2025-01-12",
  },
  {
    id: "symfony-pg", slug: "symfony-postgres", name: "Symfony + PostgreSQL", category: "Backend",
    description: "Symfony with Doctrine ORM and PostgreSQL.",
    tags: ["PHP", "Symfony", "PostgreSQL", "Doctrine"],
    popular: false, featured: false, language: "php", framework: "symfony", database: "postgres",
    author: "envsetup.dev", rating: 4.5, downloads: 760, views: 3200, updatedAt: "2025-01-09",
  },
  {
    id: "lamp", slug: "lamp-stack", name: "LAMP Stack", category: "Full Stack",
    description: "Classic Linux, Apache, MySQL, PHP stack.",
    tags: ["PHP", "MySQL", "Apache", "Linux"],
    popular: false, featured: false, language: "php", framework: "apache", database: "mysql",
    author: "envsetup.dev", rating: 4.3, downloads: 1100, views: 4800, updatedAt: "2025-01-07",
  },

  // ── Ruby ─────────────────────────────────────────────────
  {
    id: "rails-pg", slug: "rails-postgres", name: "Ruby on Rails + PostgreSQL", category: "Full Stack",
    description: "Rails 7 with PostgreSQL, Active Record, and Hotwire.",
    tags: ["Ruby", "Rails", "PostgreSQL", "Hotwire"],
    popular: true, featured: false, language: "ruby", framework: "rails", database: "postgres",
    author: "envsetup.dev", rating: 4.7, downloads: 1800, views: 7400, updatedAt: "2025-01-15",
  },
  {
    id: "sinatra-pg", slug: "sinatra-postgres", name: "Sinatra + PostgreSQL", category: "Backend",
    description: "Lightweight Sinatra API with ActiveRecord and PostgreSQL.",
    tags: ["Ruby", "Sinatra", "PostgreSQL"],
    popular: false, featured: false, language: "ruby", framework: "sinatra", database: "postgres",
    author: "envsetup.dev", rating: 4.3, downloads: 420, views: 1900, updatedAt: "2025-01-06",
  },

  // ── .NET / C# ────────────────────────────────────────────
  {
    id: "dotnet-pg", slug: "dotnet-postgres", name: ".NET Core + PostgreSQL", category: "Backend",
    description: "ASP.NET Core Web API with Entity Framework and PostgreSQL.",
    tags: ["C#", ".NET Core", "PostgreSQL", "EF Core"],
    popular: true, featured: false, language: "csharp", framework: "aspnet", database: "postgres",
    author: "envsetup.dev", rating: 4.7, downloads: 2100, views: 8600, updatedAt: "2025-01-16",
  },
  {
    id: "dotnet-sqlserver", slug: "dotnet-sqlserver", name: ".NET Core + SQL Server", category: "Backend",
    description: "ASP.NET Core with Entity Framework Core and SQL Server.",
    tags: ["C#", ".NET Core", "SQL Server", "EF Core"],
    popular: false, featured: false, language: "csharp", framework: "aspnet", database: "sqlserver",
    author: "envsetup.dev", rating: 4.6, downloads: 1400, views: 5800, updatedAt: "2025-01-13",
  },

  // ── Elixir ───────────────────────────────────────────────
  {
    id: "phoenix-pg", slug: "phoenix-postgres", name: "Phoenix + PostgreSQL", category: "Full Stack",
    description: "Elixir Phoenix with Ecto, LiveView, and PostgreSQL.",
    tags: ["Elixir", "Phoenix", "PostgreSQL", "Ecto", "LiveView"],
    popular: false, featured: false, language: "elixir", framework: "phoenix", database: "postgres",
    author: "envsetup.dev", rating: 4.8, downloads: 920, views: 4200, updatedAt: "2025-01-14",
  },
]

export function getTemplateById(id: string): Template | undefined {
  return templates.find(t => t.id === id || t.slug === id)
}

export function getTemplatesByCategory(category: string): Template[] {
  return templates.filter(t => t.category === category)
}

export function getPopularTemplates(): Template[] {
  return templates.filter(t => t.popular)
}
