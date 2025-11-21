export interface Template {
  id: string
  slug: string
  name: string
  description: string
  language: string
  framework?: string
  category: string
  tags: string[]
  rating: number
  downloads: number
  views: number
  author: string
  createdAt: string
  updatedAt: string
  featured: boolean
  popular?: boolean
  difficulty?: "Beginner" | "Intermediate" | "Advanced"
  estimatedSetupTime?: string
  packageManager?: string
  dependencies?: string[]
  devOps?: string[]
  features?: string[]
  useCases?: string[]
  requirements?: string[]
  architecture?: {
    frontend?: string
    backend?: string
    database?: string
    authentication?: string
    deployment?: string
  }
  fileStructure?: string
  setupSteps?: string[]
  environmentVariables?: { name: string; description: string; required: boolean }[]
  ports?: { port: number; service: string; description: string }[]
  documentation?: {
    title: string
    content: string
  }[]
}

export const templates: Template[] = [
  {
    id: "1",
    slug: "react-typescript-starter",
    name: "React TypeScript Starter",
    description: "A modern React application with TypeScript, Vite, and essential development tools",
    language: "typescript",
    framework: "react",
    category: "frontend",
    tags: ["react", "typescript", "vite", "eslint", "prettier"],
    rating: 4.8,
    downloads: 15420,
    views: 32100,
    author: "EnvSetup Team",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    featured: true,
  },
  {
    id: "2",
    slug: "nextjs-fullstack",
    name: "Next.js Full-Stack",
    description: "Complete Next.js application with API routes, database integration, and authentication",
    language: "typescript",
    framework: "nextjs",
    category: "fullstack",
    tags: ["nextjs", "typescript", "prisma", "tailwind", "auth"],
    rating: 4.9,
    downloads: 12800,
    views: 28500,
    author: "EnvSetup Team",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    featured: true,
  },
  {
    id: "3",
    slug: "python-fastapi",
    name: "Python FastAPI",
    description: "High-performance Python API with FastAPI, SQLAlchemy, and automatic documentation",
    language: "python",
    framework: "fastapi",
    category: "backend",
    tags: ["python", "fastapi", "sqlalchemy", "pydantic", "uvicorn"],
    rating: 4.7,
    downloads: 9200,
    views: 18700,
    author: "EnvSetup Team",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19",
    featured: false,
  },
  {
    id: "4",
    slug: "vue-composition-api",
    name: "Vue 3 Composition API",
    description: "Modern Vue 3 application using Composition API with TypeScript and Pinia",
    language: "typescript",
    framework: "vue",
    category: "frontend",
    tags: ["vue", "typescript", "composition-api", "pinia", "vite"],
    rating: 4.6,
    downloads: 7800,
    views: 15200,
    author: "EnvSetup Team",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16",
    featured: false,
  },
  {
    id: "5",
    slug: "django-rest-api",
    name: "Django REST API",
    description: "Robust Django REST API with authentication, permissions, and comprehensive testing",
    language: "python",
    framework: "django",
    category: "backend",
    tags: ["python", "django", "rest-framework", "postgresql", "redis"],
    rating: 4.8,
    downloads: 11500,
    views: 22300,
    author: "EnvSetup Team",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-17",
    featured: true,
  },
  {
    id: "6",
    slug: "express-mongodb",
    name: "Express + MongoDB",
    description: "Node.js REST API with Express, MongoDB, and comprehensive middleware setup",
    language: "javascript",
    framework: "express",
    category: "backend",
    tags: ["nodejs", "express", "mongodb", "mongoose", "jwt"],
    rating: 4.5,
    downloads: 13200,
    views: 25800,
    author: "EnvSetup Team",
    createdAt: "2024-01-03",
    updatedAt: "2024-01-15",
    featured: false,
  },
  {
    id: "7",
    slug: "spring-boot-microservice",
    name: "Spring Boot Microservice",
    description: "Production-ready Spring Boot microservice with Docker and Kubernetes configuration",
    language: "java",
    framework: "spring-boot",
    category: "backend",
    tags: ["java", "spring-boot", "docker", "kubernetes", "postgresql"],
    rating: 4.7,
    downloads: 8900,
    views: 17400,
    author: "EnvSetup Team",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-14",
    featured: false,
  },
  {
    id: "8",
    slug: "flutter-mobile-app",
    name: "Flutter Mobile App",
    description: "Cross-platform mobile application with Flutter, state management, and native features",
    language: "dart",
    framework: "flutter",
    category: "mobile",
    tags: ["flutter", "dart", "bloc", "firebase", "material-design"],
    rating: 4.6,
    downloads: 6700,
    views: 13900,
    author: "EnvSetup Team",
    createdAt: "2023-12-28",
    updatedAt: "2024-01-12",
    featured: false,
  },
  {
    id: "mern-stack",
    name: "MERN Stack",
    description: "MongoDB, Express.js, React, and Node.js stack with authentication and basic CRUD operations.",
    language: "javascript",
    framework: "react",
    category: "fullstack",
    tags: ["JavaScript", "MongoDB", "Express", "React", "Node.js"],
    rating: 4.5,
    downloads: 8000,
    views: 12000,
    author: "EnvSetup Team",
    createdAt: "2023-12-01",
    updatedAt: "2023-12-10",
    featured: false,
    popular: true,
    difficulty: "Intermediate",
    estimatedSetupTime: "10-15 minutes",
    packageManager: "npm",
    dependencies: ["express", "mongoose", "jsonwebtoken", "bcryptjs", "cors", "dotenv", "axios", "react-router-dom"],
    devOps: ["github-actions", "docker"],
    features: [
      "User authentication with JWT",
      "RESTful API with Express.js",
      "MongoDB database integration",
      "React frontend with routing",
      "Password hashing with bcrypt",
      "CORS configuration",
      "Environment variable management",
      "Error handling middleware",
      "Input validation",
      "Responsive design",
    ],
    useCases: [
      "Social media applications",
      "E-commerce platforms",
      "Content management systems",
      "Task management apps",
      "Blog platforms",
      "Real-time chat applications",
    ],
    requirements: ["Node.js 16+", "MongoDB 4.4+", "npm or yarn", "Git"],
    architecture: {
      frontend: "React with React Router for SPA navigation",
      backend: "Express.js REST API with middleware",
      database: "MongoDB with Mongoose ODM",
      authentication: "JWT-based authentication",
      deployment: "Docker containers with docker-compose",
    },
    fileStructure: `
📁 mern-app/
├── 📁 client/
│   ├── 📁 public/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   ├── 📁 pages/
│   │   ├── 📁 hooks/
│   │   ├── 📁 services/
│   │   └── 📄 App.js
│   └── 📄 package.json
├── 📁 server/
│   ├── 📁 controllers/
│   ├── 📁 models/
│   ├── 📁 routes/
│   ├── 📁 middleware/
│   ├── 📄 server.js
│   └── 📄 package.json
├── 📄 docker-compose.yml
├── 📄 .env.example
└── 📄 README.md`,
    setupSteps: [
      "Clone the repository to your local machine",
      "Install dependencies for both client and server: npm install",
      "Copy .env.example to .env and configure your environment variables",
      "Start MongoDB service (or use MongoDB Atlas)",
      "Run the development servers: npm run dev",
      "Access the application at http://localhost:3000",
    ],
    environmentVariables: [
      { name: "MONGODB_URI", description: "MongoDB connection string", required: true },
      { name: "JWT_SECRET", description: "Secret key for JWT token signing", required: true },
      { name: "PORT", description: "Server port (default: 5000)", required: false },
      { name: "NODE_ENV", description: "Environment mode (development/production)", required: false },
    ],
    ports: [
      { port: 3000, service: "React Frontend", description: "Main application interface" },
      { port: 5000, service: "Express API", description: "Backend API server" },
      { port: 27017, service: "MongoDB", description: "Database server" },
    ],
    documentation: [
      {
        title: "API Endpoints",
        content: `
**Authentication:**
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile (protected)

**Users:**
- GET /api/users - Get all users (protected)
- PUT /api/users/:id - Update user (protected)
- DELETE /api/users/:id - Delete user (protected)
        `,
      },
      {
        title: "Frontend Components",
        content: `
**Main Components:**
- Header: Navigation and user menu
- LoginForm: User authentication form
- Dashboard: Main application interface
- UserList: Display and manage users
- ProtectedRoute: Route protection wrapper
        `,
      },
    ],
  },
  {
    id: "nextjs-tailwind",
    name: "Next.js + Tailwind",
    description: "Modern Next.js application with Tailwind CSS, TypeScript, and API routes.",
    language: "typescript",
    framework: "next.js",
    category: "fullstack",
    tags: ["TypeScript", "Next.js", "Tailwind CSS", "Vercel"],
    rating: 4.4,
    downloads: 9500,
    views: 14300,
    author: "EnvSetup Team",
    createdAt: "2023-11-25",
    updatedAt: "2023-12-05",
    featured: false,
    popular: true,
    difficulty: "Beginner",
    estimatedSetupTime: "5-10 minutes",
    packageManager: "npm",
    dependencies: [
      "next",
      "react",
      "react-dom",
      "typescript",
      "tailwindcss",
      "autoprefixer",
      "postcss",
      "@types/react",
      "@types/node",
    ],
    devOps: ["vercel", "github-actions"],
    features: [
      "TypeScript for type safety",
      "Tailwind CSS for styling",
      "App Router with layouts",
      "API routes for backend logic",
      "Server-side rendering (SSR)",
      "Static site generation (SSG)",
      "Image optimization",
      "Font optimization",
      "SEO optimization",
      "Dark mode support",
    ],
    useCases: [
      "Marketing websites",
      "E-commerce stores",
      "SaaS applications",
      "Blogs and content sites",
      "Portfolio websites",
      "Documentation sites",
    ],
    requirements: ["Node.js 18+", "npm, yarn, or pnpm", "Git"],
    architecture: {
      frontend: "Next.js with App Router and React Server Components",
      backend: "Next.js API routes with serverless functions",
      database: "Flexible - supports any database via API routes",
      authentication: "NextAuth.js integration ready",
      deployment: "Optimized for Vercel deployment",
    },
    fileStructure: `
📁 nextjs-app/
├── 📁 app/
│   ├── 📁 api/
│   │   └── 📁 auth/
│   ├── 📁 components/
│   ├── 📁 lib/
│   ├── 📄 layout.tsx
│   ├── 📄 page.tsx
│   └── 📄 globals.css
├── 📁 public/
├── 📁 components/
│   └── 📁 ui/
├── 📄 next.config.js
├── 📄 tailwind.config.js
├── 📄 tsconfig.json
└── 📄 package.json`,
    setupSteps: [
      "Clone the repository to your local machine",
      "Install dependencies: npm install",
      "Copy .env.example to .env.local and configure variables",
      "Run the development server: npm run dev",
      "Open http://localhost:3000 in your browser",
      "Start building your application!",
    ],
    environmentVariables: [
      { name: "NEXTAUTH_SECRET", description: "Secret for NextAuth.js", required: false },
      { name: "NEXTAUTH_URL", description: "Base URL for authentication", required: false },
      { name: "DATABASE_URL", description: "Database connection string", required: false },
    ],
    ports: [{ port: 3000, service: "Next.js App", description: "Main application server" }],
    documentation: [
      {
        title: "Project Structure",
        content: `
**App Directory:**
- layout.tsx: Root layout component
- page.tsx: Home page component
- api/: API routes for backend functionality

**Components:**
- Reusable UI components with TypeScript
- Styled with Tailwind CSS classes
        `,
      },
      {
        title: "Styling Guide",
        content: `
**Tailwind CSS:**
- Utility-first CSS framework
- Responsive design utilities
- Dark mode support built-in
- Custom color palette in tailwind.config.js
        `,
      },
    ],
  },
  {
    id: "django-postgresql",
    name: "Django + PostgreSQL",
    description: "Django web application with PostgreSQL database, user authentication, and REST API.",
    language: "python",
    framework: "django",
    category: "fullstack",
    tags: ["Python", "Django", "PostgreSQL", "REST"],
    rating: 4.6,
    downloads: 7200,
    views: 11800,
    author: "EnvSetup Team",
    createdAt: "2023-11-20",
    updatedAt: "2023-11-30",
    featured: false,
    popular: false,
    difficulty: "Intermediate",
    estimatedSetupTime: "15-20 minutes",
    packageManager: "pip",
    dependencies: [
      "django",
      "djangorestframework",
      "psycopg2-binary",
      "python-decouple",
      "django-cors-headers",
      "pillow",
    ],
    devOps: ["github-actions", "docker"],
    features: [
      "Django REST Framework",
      "PostgreSQL database",
      "Custom user authentication",
      "Admin interface",
      "CORS handling",
      "Environment configuration",
      "Media file handling",
      "Database migrations",
      "Unit testing setup",
      "Production settings",
    ],
    useCases: [
      "Web applications",
      "REST APIs",
      "Content management systems",
      "E-commerce backends",
      "Data-driven applications",
      "Enterprise applications",
    ],
    requirements: ["Python 3.8+", "PostgreSQL 12+", "pip or pipenv", "Git"],
    architecture: {
      frontend: "Django templates or separate frontend framework",
      backend: "Django with Django REST Framework",
      database: "PostgreSQL with Django ORM",
      authentication: "Django's built-in authentication system",
      deployment: "Docker with gunicorn and nginx",
    },
    fileStructure: `
📁 django-app/
├── 📁 project_name/
│   ├── 📄 settings.py
│   ├── 📄 urls.py
│   └── 📄 wsgi.py
├── 📁 apps/
│   ├── 📁 users/
│   ├── 📁 api/
│   └── 📁 core/
├── 📁 static/
├── 📁 media/
├── 📁 templates/
├── 📄 manage.py
├── 📄 requirements.txt
└── 📄 Dockerfile`,
    setupSteps: [
      "Clone the repository to your local machine",
      "Create a virtual environment: python -m venv venv",
      "Activate virtual environment: source venv/bin/activate (Linux/Mac) or venv\\Scripts\\activate (Windows)",
      "Install dependencies: pip install -r requirements.txt",
      "Copy .env.example to .env and configure database settings",
      "Run migrations: python manage.py migrate",
      "Create superuser: python manage.py createsuperuser",
      "Start development server: python manage.py runserver",
    ],
    environmentVariables: [
      { name: "SECRET_KEY", description: "Django secret key", required: true },
      { name: "DEBUG", description: "Debug mode (True/False)", required: true },
      { name: "DATABASE_URL", description: "PostgreSQL connection string", required: true },
      { name: "ALLOWED_HOSTS", description: "Comma-separated list of allowed hosts", required: false },
    ],
    ports: [
      { port: 8000, service: "Django App", description: "Main application server" },
      { port: 5432, service: "PostgreSQL", description: "Database server" },
    ],
    documentation: [
      {
        title: "API Endpoints",
        content: `
**Authentication:**
- POST /api/auth/login/ - User login
- POST /api/auth/logout/ - User logout
- POST /api/auth/register/ - User registration

**Users:**
- GET /api/users/ - List users
- GET /api/users/{id}/ - Get user details
- PUT /api/users/{id}/ - Update user
        `,
      },
      {
        title: "Django Apps",
        content: `
**Core Apps:**
- users: Custom user model and authentication
- api: REST API endpoints
- core: Shared utilities and base classes
        `,
      },
    ],
  },
  {
    id: "spring-boot-react",
    name: "Spring Boot + React",
    description: "Full-stack application with Spring Boot backend and React frontend.",
    language: "java",
    framework: "spring-boot",
    category: "fullstack",
    tags: ["Java", "Spring Boot", "React", "Maven"],
    rating: 4.9,
    downloads: 10800,
    views: 19600,
    author: "EnvSetup Team",
    createdAt: "2023-11-15",
    updatedAt: "2023-11-25",
    featured: false,
    popular: false,
    difficulty: "Advanced",
    estimatedSetupTime: "20-25 minutes",
    packageManager: "maven",
    dependencies: [
      "spring-boot-starter-web",
      "spring-boot-starter-data-jpa",
      "spring-boot-starter-security",
      "postgresql",
    ],
    devOps: ["github-actions", "docker"],
    features: [
      "Spring Boot REST API",
      "Spring Security authentication",
      "JPA/Hibernate ORM",
      "React frontend with TypeScript",
      "JWT token authentication",
      "Database migrations with Flyway",
      "Unit and integration testing",
      "API documentation with Swagger",
      "CORS configuration",
      "Production-ready configuration",
    ],
    useCases: [
      "Enterprise applications",
      "Microservices architecture",
      "E-commerce platforms",
      "Financial applications",
      "Healthcare systems",
      "Government applications",
    ],
    requirements: ["Java 17+", "Maven 3.6+", "Node.js 16+ (for frontend)", "PostgreSQL 12+", "Git"],
    architecture: {
      frontend: "React with TypeScript and Axios for API calls",
      backend: "Spring Boot with Spring MVC and Spring Data JPA",
      database: "PostgreSQL with JPA/Hibernate",
      authentication: "Spring Security with JWT tokens",
      deployment: "Docker multi-stage build",
    },
    fileStructure: `
📁 spring-react-app/
├── 📁 backend/
│   ├── 📁 src/main/java/
│   │   └── 📁 com/example/app/
│   │       ├── 📁 controller/
│   │       ├── 📁 service/
│   │       ├── 📁 repository/
│   │       ├── 📁 model/
│   │       └── 📁 config/
│   ├── 📁 src/main/resources/
│   └── 📄 pom.xml
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   ├── 📁 services/
│   │   └── 📁 types/
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
└── 📄 docker-compose.yml`,
    setupSteps: [
      "Clone the repository to your local machine",
      "Navigate to backend directory and run: mvn clean install",
      "Navigate to frontend directory and run: npm install",
      "Copy .env.example to .env and configure database settings",
      "Start PostgreSQL database",
      "Run backend: mvn spring-boot:run",
      "In another terminal, run frontend: npm start",
      "Access application at http://localhost:3000",
    ],
    environmentVariables: [
      { name: "SPRING_DATASOURCE_URL", description: "Database connection URL", required: true },
      { name: "SPRING_DATASOURCE_USERNAME", description: "Database username", required: true },
      { name: "SPRING_DATASOURCE_PASSWORD", description: "Database password", required: true },
      { name: "JWT_SECRET", description: "JWT signing secret", required: true },
    ],
    ports: [
      { port: 3000, service: "React Frontend", description: "Frontend development server" },
      { port: 8080, service: "Spring Boot API", description: "Backend API server" },
      { port: 5432, service: "PostgreSQL", description: "Database server" },
    ],
    documentation: [
      {
        title: "API Documentation",
        content: `
**Authentication:**
- POST /api/auth/login - User authentication
- POST /api/auth/register - User registration
- GET /api/auth/profile - Get user profile

**Swagger UI:**
- Available at http://localhost:8080/swagger-ui.html
        `,
      },
      {
        title: "Frontend Architecture",
        content: `
**React Components:**
- TypeScript for type safety
- Axios for API communication
- React Router for navigation
- Context API for state management
        `,
      },
    ],
  },
  {
    id: "flask-sqlalchemy",
    name: "Flask + SQLAlchemy",
    description: "Python Flask application with SQLAlchemy ORM, Jinja templates, and user authentication.",
    language: "python",
    framework: "flask",
    category: "backend",
    tags: ["Python", "Flask", "SQLAlchemy", "SQLite"],
    rating: 4.7,
    downloads: 8400,
    views: 16900,
    author: "EnvSetup Team",
    createdAt: "2023-11-10",
    updatedAt: "2023-11-20",
    featured: false,
    popular: false,
    difficulty: "Beginner",
    estimatedSetupTime: "10-15 minutes",
    packageManager: "pip",
    dependencies: ["flask", "flask-sqlalchemy", "flask-login", "flask-wtf", "werkzeug", "python-dotenv"],
    devOps: ["github-actions"],
    features: [
      "Flask web framework",
      "SQLAlchemy ORM",
      "User authentication with Flask-Login",
      "Form handling with Flask-WTF",
      "Jinja2 templating",
      "Blueprint organization",
      "Database migrations",
      "Session management",
      "CSRF protection",
      "Environment configuration",
    ],
    useCases: [
      "Rapid prototyping",
      "Small web applications",
      "API development",
      "Educational projects",
      "Personal websites",
      "Microservices",
    ],
    requirements: ["Python 3.7+", "pip or pipenv", "Git"],
    architecture: {
      frontend: "Jinja2 templates with HTML/CSS/JavaScript",
      backend: "Flask with Blueprint organization",
      database: "SQLite with SQLAlchemy ORM (easily configurable for PostgreSQL/MySQL)",
      authentication: "Flask-Login with session management",
      deployment: "Gunicorn WSGI server",
    },
    fileStructure: `
📁 flask-app/
├── 📁 app/
│   ├── 📁 auth/
│   ├── 📁 main/
│   ├── 📁 models/
│   ├── 📁 static/
│   ├── 📁 templates/
│   └── 📄 __init__.py
├── 📁 migrations/
├── 📄 app.py
├── 📄 config.py
├── 📄 requirements.txt
└── 📄 .env.example`,
    setupSteps: [
      "Clone the repository to your local machine",
      "Create virtual environment: python -m venv venv",
      "Activate virtual environment: source venv/bin/activate",
      "Install dependencies: pip install -r requirements.txt",
      "Copy .env.example to .env and configure settings",
      "Initialize database: flask db upgrade",
      "Run the application: flask run",
      "Access at http://localhost:5000",
    ],
    environmentVariables: [
      { name: "SECRET_KEY", description: "Flask secret key for sessions", required: true },
      { name: "DATABASE_URL", description: "Database connection string", required: false },
      { name: "FLASK_ENV", description: "Flask environment (development/production)", required: false },
    ],
    ports: [{ port: 5000, service: "Flask App", description: "Main application server" }],
    documentation: [
      {
        title: "Application Structure",
        content: `
**Blueprints:**
- auth: User authentication routes
- main: Main application routes
- models: Database models

**Templates:**
- base.html: Base template with navigation
- auth/: Authentication templates
- main/: Main application templates
        `,
      },
      {
        title: "Database Models",
        content: `
**User Model:**
- id: Primary key
- username: Unique username
- email: User email
- password_hash: Hashed password
        `,
      },
    ],
  },
  {
    id: "t3-stack",
    name: "T3 Stack",
    description: "Type-safe full-stack application with Next.js, tRPC, Prisma, and NextAuth.",
    language: "typescript",
    framework: "next.js",
    category: "fullstack",
    tags: ["TypeScript", "Next.js", "tRPC", "Prisma", "NextAuth"],
    rating: 4.8,
    downloads: 9700,
    views: 18400,
    author: "EnvSetup Team",
    createdAt: "2023-11-05",
    updatedAt: "2023-11-15",
    featured: false,
    popular: true,
    difficulty: "Advanced",
    estimatedSetupTime: "15-20 minutes",
    packageManager: "npm",
    dependencies: ["next", "react", "typescript", "@trpc/server", "@trpc/client", "prisma", "next-auth", "zod"],
    devOps: ["vercel", "github-actions"],
    features: [
      "End-to-end type safety with tRPC",
      "Database ORM with Prisma",
      "Authentication with NextAuth.js",
      "Input validation with Zod",
      "Server-side rendering with Next.js",
      "API routes with type safety",
      "Database migrations",
      "Multiple auth providers",
      "Optimistic updates",
      "React Query integration",
    ],
    useCases: [
      "SaaS applications",
      "E-commerce platforms",
      "Social media apps",
      "Dashboard applications",
      "Content management systems",
      "Real-time applications",
    ],
    requirements: ["Node.js 18+", "npm, yarn, or pnpm", "Database (PostgreSQL, MySQL, or SQLite)", "Git"],
    architecture: {
      frontend: "Next.js with React and TypeScript",
      backend: "Next.js API routes with tRPC",
      database: "Any SQL database with Prisma ORM",
      authentication: "NextAuth.js with multiple providers",
      deployment: "Vercel or any Node.js hosting platform",
    },
    fileStructure: `
📁 t3-app/
├── 📁 src/
│   ├── 📁 components/
│   ├── 📁 pages/
│   │   ├── 📁 api/
│   │   │   ├── 📁 auth/
│   │   │   └── 📁 trpc/
│   │   └── 📄 _app.tsx
│   ├── 📁 server/
│   │   ├── 📁 api/
│   │   └── 📄 db.ts
│   ├── 📁 utils/
│   └── 📁 styles/
├── 📁 prisma/
│   ├── 📄 schema.prisma
│   └── 📁 migrations/
├── 📄 next.config.mjs
└── 📄 package.json`,
    setupSteps: [
      "Clone the repository to your local machine",
      "Install dependencies: npm install",
      "Copy .env.example to .env and configure environment variables",
      "Set up your database connection in .env",
      "Run database migrations: npx prisma db push",
      "Generate Prisma client: npx prisma generate",
      "Start development server: npm run dev",
      "Access application at http://localhost:3000",
    ],
    environmentVariables: [
      { name: "DATABASE_URL", description: "Database connection string", required: true },
      { name: "NEXTAUTH_SECRET", description: "NextAuth.js secret", required: true },
      { name: "NEXTAUTH_URL", description: "Base URL for authentication", required: true },
      { name: "DISCORD_CLIENT_ID", description: "Discord OAuth client ID", required: false },
      { name: "DISCORD_CLIENT_SECRET", description: "Discord OAuth client secret", required: false },
    ],
    ports: [{ port: 3000, service: "Next.js App", description: "Main application server" }],
    documentation: [
      {
        title: "tRPC Procedures",
        content: `
**Type-safe API:**
- All API calls are fully type-safe
- Automatic TypeScript inference
- Runtime validation with Zod
- Optimistic updates support
        `,
      },
      {
        title: "Database Schema",
        content: `
**Prisma Models:**
- User: Authentication and profile data
- Account: OAuth account linking
- Session: User session management
- Custom models as needed
        `,
      },
    ],
  },
  {
    id: "lamp-stack",
    name: "LAMP Stack",
    description: "Linux, Apache, MySQL, and PHP stack with basic CRUD operations.",
    language: "php",
    framework: "vanilla",
    category: "backend",
    tags: ["PHP", "MySQL", "Apache", "Linux"],
    rating: 4.5,
    downloads: 8100,
    views: 16200,
    author: "EnvSetup Team",
    createdAt: "2023-11-01",
    updatedAt: "2023-11-10",
    featured: false,
    popular: false,
    difficulty: "Beginner",
    estimatedSetupTime: "15-20 minutes",
    packageManager: "composer",
    dependencies: ["php", "mysql", "apache2"],
    devOps: ["docker"],
    features: [
      "Apache web server configuration",
      "MySQL database integration",
      "PHP 8+ with modern features",
      "User authentication system",
      "CRUD operations example",
      "Session management",
      "Form validation",
      "SQL injection prevention",
      "Bootstrap UI framework",
      "Database migrations",
    ],
    useCases: [
      "Traditional web applications",
      "Content management systems",
      "E-commerce websites",
      "Educational projects",
      "Legacy system maintenance",
      "Rapid prototyping",
    ],
    requirements: [
      "Docker and Docker Compose",
      "Or: Apache 2.4+, PHP 8+, MySQL 8+",
      "Composer (PHP package manager)",
      "Git",
    ],
    architecture: {
      frontend: "HTML, CSS, JavaScript with Bootstrap",
      backend: "PHP with procedural and OOP patterns",
      database: "MySQL with PDO for database access",
      authentication: "Session-based authentication",
      deployment: "Apache virtual host configuration",
    },
    fileStructure: `
📁 lamp-app/
├── 📁 public/
│   ├── 📁 css/
│   ├── 📁 js/
│   ├── 📁 images/
│   ├── 📄 index.php
│   └── 📄 .htaccess
├── 📁 src/
│   ├── 📁 classes/
│   ├── 📁 includes/
│   └── 📁 config/
├── 📁 database/
│   └── 📄 schema.sql
├── 📄 docker-compose.yml
└── 📄 composer.json`,
    setupSteps: [
      "Clone the repository to your local machine",
      "Start services with Docker: docker-compose up -d",
      "Access phpMyAdmin at http://localhost:8080",
      "Import database schema from database/schema.sql",
      "Configure database connection in src/config/database.php",
      "Access application at http://localhost",
      "Use admin/admin for initial login",
    ],
    environmentVariables: [
      { name: "MYSQL_ROOT_PASSWORD", description: "MySQL root password", required: true },
      { name: "MYSQL_DATABASE", description: "Default database name", required: true },
      { name: "MYSQL_USER", description: "MySQL user", required: true },
      { name: "MYSQL_PASSWORD", description: "MySQL user password", required: true },
    ],
    ports: [
      { port: 80, service: "Apache Web Server", description: "Main web application" },
      { port: 3306, service: "MySQL", description: "Database server" },
      { port: 8080, service: "phpMyAdmin", description: "Database administration" },
    ],
    documentation: [
      {
        title: "PHP Classes",
        content: `
**Core Classes:**
- Database: PDO database connection wrapper
- User: User management and authentication
- Validator: Input validation and sanitization
- Router: Simple routing system
        `,
      },
      {
        title: "Security Features",
        content: `
**Security Measures:**
- Prepared statements for SQL queries
- Password hashing with PHP's password_hash()
- CSRF token protection
- Input sanitization and validation
        `,
      },
    ],
  },
  {
    id: "go-fiber-gorm",
    name: "Go + Fiber + GORM",
    description: "Go web application with Fiber framework and GORM ORM.",
    language: "go",
    framework: "fiber",
    category: "backend",
    tags: ["Go", "Fiber", "GORM", "PostgreSQL"],
    rating: 4.7,
    downloads: 7900,
    views: 15900,
    author: "EnvSetup Team",
    createdAt: "2023-10-25",
    updatedAt: "2023-11-05",
    featured: false,
    popular: false,
    difficulty: "Intermediate",
    estimatedSetupTime: "15-20 minutes",
    packageManager: "go-modules",
    dependencies: ["github.com/gofiber/fiber/v2", "gorm.io/gorm", "github.com/golang-jwt/jwt/v4"],
    devOps: ["github-actions", "docker"],
    features: [
      "Fiber web framework",
      "GORM ORM for database operations",
      "JWT authentication middleware",
      "Clean architecture structure",
      "Database migrations",
      "Input validation",
      "Error handling middleware",
      "CORS support",
      "Rate limiting",
      "Swagger documentation",
    ],
    useCases: [
      "REST APIs",
      "Microservices",
      "High-performance web services",
      "Real-time applications",
      "Backend for mobile apps",
      "IoT applications",
    ],
    requirements: ["Go 1.19+", "PostgreSQL 12+", "Git"],
    architecture: {
      frontend: "API-only (can be consumed by any frontend)",
      backend: "Go with Fiber framework and clean architecture",
      database: "PostgreSQL with GORM ORM",
      authentication: "JWT-based authentication",
      deployment: "Docker container with multi-stage build",
    },
    fileStructure: `
📁 go-fiber-app/
├── 📁 cmd/
│   └── 📄 main.go
├── 📁 internal/
│   ├── 📁 handlers/
│   ├── 📁 models/
│   ├── 📁 middleware/
│   ├── 📁 services/
│   └── 📁 database/
├── 📁 pkg/
│   └── 📁 utils/
├── 📁 migrations/
├── 📄 go.mod
├── 📄 go.sum
└── 📄 Dockerfile`,
    setupSteps: [
      "Clone the repository to your local machine",
      "Install Go dependencies: go mod download",
      "Copy .env.example to .env and configure database",
      "Start PostgreSQL database",
      "Run database migrations: go run cmd/migrate/main.go",
      "Start the application: go run cmd/main.go",
      "Access API at http://localhost:8080",
    ],
    environmentVariables: [
      { name: "DATABASE_URL", description: "PostgreSQL connection string", required: true },
      { name: "JWT_SECRET", description: "JWT signing secret", required: true },
      { name: "PORT", description: "Server port (default: 8080)", required: false },
      { name: "ENV", description: "Environment (development/production)", required: false },
    ],
    ports: [
      { port: 8080, service: "Fiber API", description: "Main API server" },
      { port: 5432, service: "PostgreSQL", description: "Database server" },
    ],
    documentation: [
      {
        title: "API Endpoints",
        content: `
**Authentication:**
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile

**Health Check:**
- GET /api/health - Service health status
        `,
      },
      {
        title: "Architecture",
        content: `
**Clean Architecture:**
- handlers: HTTP request handlers
- services: Business logic layer
- models: Data models and database entities
- middleware: HTTP middleware functions
        `,
      },
    ],
  },
  {
    id: "vue-express",
    name: "Vue + Express",
    description: "Vue.js frontend with Express.js backend and MongoDB database.",
    language: "javascript",
    framework: "vue",
    category: "fullstack",
    tags: ["JavaScript", "Vue", "Express", "MongoDB"],
    rating: 4.6,
    downloads: 7600,
    views: 15300,
    author: "EnvSetup Team",
    createdAt: "2023-10-20",
    updatedAt: "2023-10-30",
    featured: false,
    popular: false,
    difficulty: "Intermediate",
    estimatedSetupTime: "15-20 minutes",
    packageManager: "npm",
    dependencies: ["vue", "vue-router", "vuex", "axios", "express", "mongoose", "cors", "dotenv"],
    devOps: ["github-actions", "docker"],
    features: [
      "Vue.js 3 SPA with Vue Router and Vuex",
      "Express.js REST API with middleware",
      "MongoDB with Mongoose ODM",
      "JWT authentication",
      "CORS configuration",
      "File upload support",
      "Real-time updates",
      "Responsive design",
    ],
    useCases: [
      "Single-page applications",
      "Dashboard applications",
      "E-commerce frontends",
      "Content management interfaces",
      "Real-time chat applications",
      "Progressive web apps",
    ],
    requirements: ["Node.js 16+", "MongoDB 4.4+", "npm or yarn", "Git"],
    architecture: {
      frontend: "Vue.js 3 SPA with Vue Router and Vuex",
      backend: "Express.js REST API with middleware",
      database: "MongoDB with Mongoose ODM",
      authentication: "JWT-based authentication",
      deployment: "Docker containers with nginx proxy",
    },
    fileStructure: `
📁 vue-express-app/
├── 📁 client/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   ├── 📁 views/
│   │   ├── 📁 store/
│   │   ├── 📁 router/
│   │   └── 📄 main.js
│   ├── 📄 package.json
│   └── 📄 vue.config.js
├── 📁 server/
│   ├── 📁 controllers/
│   ├── 📁 models/
│   ├── 📁 routes/
│   ├── 📁 middleware/
│   └── 📄 server.js
├── 📄 docker-compose.yml
└── 📄 README.md`,
    setupSteps: [
      "Clone the repository to your local machine",
      "Install client dependencies: cd client && npm install",
      "Install server dependencies: cd server && npm install",
      "Copy .env.example to .env and configure MongoDB",
      "Start MongoDB service",
      "Start backend server: cd server && npm run dev",
      "Start frontend development server: cd client && npm run serve",
      "Access application at http://localhost:8080",
    ],
    environmentVariables: [
      { name: "MONGODB_URI", description: "MongoDB connection string", required: true },
      { name: "JWT_SECRET", description: "JWT signing secret", required: true },
      { name: "PORT", description: "Server port (default: 3000)", required: false },
      { name: "NODE_ENV", description: "Environment mode", required: false },
    ],
    ports: [
      { port: 8080, service: "Vue Frontend", description: "Frontend development server" },
      { port: 3000, service: "Express API", description: "Backend API server" },
      { port: 27017, service: "MongoDB", description: "Database server" },
    ],
    documentation: [
      {
        title: "Vue Components",
        content: `
**Main Components:**
- AppHeader: Navigation and user menu
- LoginForm: User authentication
- Dashboard: Main application interface
- UserProfile: User profile management
        `,
      },
      {
        title: "Vuex Store",
        content: `
**Store Modules:**
- auth: Authentication state and actions
- users: User management
- notifications: App notifications
        `,
      },
    ],
  },
]

export function getTemplateById(id: string): Template | undefined {
  return templates.find((template) => template.id === id)
}

export function getTemplateBySlug(slug: string): Template | undefined {
  return templates.find((template) => template.slug === slug)
}

export function getTemplateByName(name: string): Template | undefined {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
  return getTemplateBySlug(slug)
}
