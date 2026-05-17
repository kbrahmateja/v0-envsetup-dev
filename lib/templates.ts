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
}

export const templates: Template[] = [
  {
    id: "mern",
    name: "MERN Stack",
    description: "MongoDB, Express.js, React, and Node.js stack with authentication and basic CRUD operations.",
    tags: ["JavaScript", "MongoDB", "Express", "React", "Node.js"],
    popular: true,
    language: "javascript",
    framework: "react",
    database: "mongodb",
  },
  {
    id: "nextjs-tailwind",
    name: "Next.js + Tailwind",
    description: "Modern Next.js application with Tailwind CSS, TypeScript, and API routes.",
    tags: ["TypeScript", "Next.js", "Tailwind CSS", "Vercel"],
    popular: true,
    language: "typescript",
    framework: "next",
  },
  {
    id: "django-postgres",
    name: "Django + PostgreSQL",
    description: "Django web application with PostgreSQL database, user authentication, and REST API.",
    tags: ["Python", "Django", "PostgreSQL", "REST"],
    popular: false,
    language: "python",
    framework: "django",
    database: "postgres",
  },
  {
    id: "t3-stack",
    name: "T3 Stack",
    description: "Type-safe full-stack application with Next.js, tRPC, Prisma, and NextAuth.",
    tags: ["TypeScript", "Next.js", "tRPC", "Prisma", "NextAuth"],
    popular: true,
    language: "typescript",
    framework: "next",
    database: "postgres",
  },
  {
    id: "fastapi",
    name: "FastAPI + PostgreSQL",
    description: "FastAPI backend with PostgreSQL, SQLAlchemy, and async support.",
    tags: ["Python", "FastAPI", "PostgreSQL", "async"],
    popular: true,
    language: "python",
    framework: "fastapi",
    database: "postgres",
  },
  {
    id: "go-fiber",
    name: "Go + Fiber + GORM",
    description: "Go web application with Fiber framework and GORM ORM.",
    tags: ["Go", "Fiber", "GORM", "PostgreSQL"],
    popular: false,
    language: "go",
    framework: "fiber",
    database: "postgres",
  },
]
