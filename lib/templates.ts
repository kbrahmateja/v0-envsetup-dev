export interface Template {
  id: string
  name: string
  description: string
  tags: string[]
  popular: boolean
  language: string
  framework: string
  database?: string
  devOps?: string[]
  slug: string
  author: string
  featured: boolean
  category: string
  rating: number
  downloads: number
  views: number
  updatedAt: string
}

export const templates: Template[] = [
  {
    id: "mern",
    slug: "mern-stack",
    name: "MERN Stack",
    description: "MongoDB, Express.js, React, and Node.js stack with authentication and basic CRUD operations.",
    tags: ["JavaScript", "MongoDB", "Express", "React", "Node.js"],
    popular: true,
    featured: true,
    category: "Full Stack",
    language: "javascript",
    framework: "react",
    database: "mongodb",
    author: "envsetup.dev",
    rating: 4.8,
    downloads: 1240,
    views: 5400,
    updatedAt: "2025-01-15",
  },
  {
    id: "nextjs-tailwind",
    slug: "nextjs-tailwind",
    name: "Next.js + Tailwind",
    description: "Modern Next.js application with Tailwind CSS, TypeScript, and API routes.",
    tags: ["TypeScript", "Next.js", "Tailwind CSS", "Vercel"],
    popular: true,
    featured: true,
    category: "Frontend",
    language: "typescript",
    framework: "next",
    author: "envsetup.dev",
    rating: 4.9,
    downloads: 2100,
    views: 8200,
    updatedAt: "2025-01-20",
  },
  {
    id: "django-postgres",
    slug: "django-postgres",
    name: "Django + PostgreSQL",
    description: "Django web application with PostgreSQL database, user authentication, and REST API.",
    tags: ["Python", "Django", "PostgreSQL", "REST"],
    popular: false,
    featured: false,
    category: "Backend",
    language: "python",
    framework: "django",
    database: "postgres",
    author: "envsetup.dev",
    rating: 4.6,
    downloads: 780,
    views: 3100,
    updatedAt: "2025-01-10",
  },
  {
    id: "t3-stack",
    slug: "t3-stack",
    name: "T3 Stack",
    description: "Type-safe full-stack application with Next.js, tRPC, Prisma, and NextAuth.",
    tags: ["TypeScript", "Next.js", "tRPC", "Prisma", "NextAuth"],
    popular: true,
    featured: true,
    category: "Full Stack",
    language: "typescript",
    framework: "next",
    database: "postgres",
    author: "envsetup.dev",
    rating: 4.9,
    downloads: 1650,
    views: 6800,
    updatedAt: "2025-01-18",
  },
  {
    id: "fastapi",
    slug: "fastapi-postgres",
    name: "FastAPI + PostgreSQL",
    description: "FastAPI backend with PostgreSQL, SQLAlchemy, and async support.",
    tags: ["Python", "FastAPI", "PostgreSQL", "async"],
    popular: true,
    featured: false,
    category: "Backend",
    language: "python",
    framework: "fastapi",
    database: "postgres",
    author: "envsetup.dev",
    rating: 4.7,
    downloads: 920,
    views: 4100,
    updatedAt: "2025-01-12",
  },
  {
    id: "go-fiber",
    slug: "go-fiber-gorm",
    name: "Go + Fiber + GORM",
    description: "Go web application with Fiber framework and GORM ORM.",
    tags: ["Go", "Fiber", "GORM", "PostgreSQL"],
    popular: false,
    featured: false,
    category: "Backend",
    language: "go",
    framework: "fiber",
    database: "postgres",
    author: "envsetup.dev",
    rating: 4.5,
    downloads: 430,
    views: 1900,
    updatedAt: "2025-01-08",
  },
]
