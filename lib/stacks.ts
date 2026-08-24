// Shared language/framework catalog + validation. Used by the generator
// form (components/generator-form.tsx, which re-exports sanitizeLanguage/
// sanitizeFramework for backward compatibility) and by the AI assistant
// (app/api/ai-assistant/route.ts) to turn untrusted input - a URL param, or
// free-text chat - into a language/framework pair the generator actually
// supports.
// The Wizard used to offer far fewer languages/frameworks than the /templates
// catalog (10 languages here vs. 21 in lib/templates.ts) - so the catalog,
// which is meant to be a showcase of common default combinations, was
// actually the more capable surface. The Wizard is the one with version
// selection and per-combo Dockerfile generation, so it should be the more
// complete tool; the catalog is a curated subset of it. This list now covers
// every language/framework the catalog offers (plus Svelte/SolidJS, added
// separately). Two catalog frameworks were deliberately left out: Perfect and
// Kitura (Swift) - both are unmaintained/discontinued (Kitura was
// discontinued by IBM in 2020) and don't belong as live options; Hummingbird
// (actively maintained) is offered instead. MAUI was also dropped from C# -
// it's a native mobile/desktop UI framework, not a web service, so it can't
// be meaningfully Dockerized at all.
export const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "kotlin", label: "Kotlin" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "elixir", label: "Elixir" },
  { value: "scala", label: "Scala" },
  { value: "dart", label: "Dart" },
  { value: "crystal", label: "Crystal" },
  { value: "perl", label: "Perl" },
  { value: "r", label: "R" },
  { value: "julia", label: "Julia" },
  { value: "clojure", label: "Clojure" },
  { value: "haskell", label: "Haskell" },
  { value: "zig", label: "Zig" },
]

export const frameworks: Record<string, string[]> = {
  javascript: [
    "React", "Vue", "Angular", "Svelte", "SolidJS", "Preact", "Lit", "Qwik", "jQuery", "AlpineJS", "htmx",
    "Express", "Next.js", "Nuxt.js",
    "Fastify", "Koa", "Hapi", "Hono", "Feathers", "AdonisJS", "LoopBack", "Meteor", "Strapi", "SailsJS",
  ],
  typescript: [
    "React", "Vue", "Angular", "Svelte", "SolidJS", "Preact", "Lit", "Qwik",
    "Express", "Next.js", "NestJS",
    "Nuxtjs", "Remix", "SvelteKit", "Astro", "Fastify", "Hono", "Elysia", "Medusa",
    "Encore", "Nest GraphQL", "Nextjs Drizzle", "tRPC Nextjs",
  ],
  python: [
    "Django", "Flask", "FastAPI", "Streamlit", "Jupyter",
    "Starlette", "Litestar", "Tornado", "Pyramid", "Bottle", "Sanic", "Falcon", "BlackSheep",
  ],
  java: [
    "Spring Boot", "Spring MVC", "Quarkus", "Micronaut",
    "Vertx", "Helidon", "Dropwizard", "Javalin", "SparkJava",
  ],
  kotlin: ["Spring Boot", "Ktor", "Micronaut"],
  csharp: [".NET Core", "ASP.NET", "Blazor", "Minimal API", "Orleans"],
  go: ["Gin", "Echo", "Fiber", "Chi", "Beego", "Buffalo", "Gorilla", "Iris", "Mux"],
  rust: ["Actix", "Rocket", "Warp", "Axum", "Tide"],
  php: ["Laravel", "Symfony", "CodeIgniter", "Slim", "Yii", "CakePHP", "Phalcon"],
  ruby: ["Rails", "Sinatra", "Hanami", "Grape", "Roda"],
  swift: ["Vapor", "Hummingbird"],
  elixir: ["Phoenix", "Plug"],
  scala: ["Play Framework", "Akka HTTP", "ZIO HTTP"],
  dart: ["Shelf", "Angel3", "Serverpod"],
  crystal: ["Kemal", "Lucky"],
  perl: ["Mojolicious", "Dancer2"],
  r: ["Plumber"],
  julia: ["GenieJL"],
  clojure: ["Ring", "Pedestal"],
  haskell: ["Servant", "Yesod"],
  zig: ["Zap"],
}

const languageValues = new Set(languages.map((l) => l.value))

// URL params (from the templates page, the AI assistant, or a hand-typed
// link) are untrusted input -- e.g. ?language=java&framework=Angular would
// previously be assigned straight into form state with no cross-check,
// producing a selected language whose framework dropdown doesn't actually
// offer "Angular" and a downstream generation with a nonsensical combo.
// Only accept values that are actually valid for the generator.
export function sanitizeLanguage(value: string | null | undefined): string {
  const normalized = (value || "").trim().toLowerCase()
  return languageValues.has(normalized) ? normalized : ""
}

export function sanitizeFramework(language: string, value: string | null | undefined): string {
  const validFrameworks = frameworks[language as keyof typeof frameworks]
  if (!validFrameworks) return ""
  const normalized = (value || "").trim().toLowerCase()
  return validFrameworks.some((f) => f.toLowerCase() === normalized) ? normalized : ""
}

// Keyword-based stack detection for the AI assistant's free-text chat.
// Deliberately simple and deterministic - the same category keywords
// smartFallback() in app/api/ai-assistant/route.ts already matches on - so
// the "download detected stack" card always agrees with what the assistant
// just talked about, instead of the LLM trying (and sometimes failing) to
// state a clean machine-readable stack. Every match is re-validated through
// sanitizeLanguage/sanitizeFramework, so this can never hand the generator
// a combination it doesn't actually support. Returns null when nothing
// recognizable was mentioned.
const DETECTION_RULES: { pattern: RegExp; language: string; framework?: string }[] = [
  { pattern: /spring\s*boot/i, language: "java", framework: "Spring Boot" },
  { pattern: /\bjava\b|\bjvm\b/i, language: "java" },
  { pattern: /fastapi/i, language: "python", framework: "FastAPI" },
  { pattern: /\bdjango\b/i, language: "python", framework: "Django" },
  { pattern: /\bflask\b/i, language: "python", framework: "Flask" },
  { pattern: /\bpython\b/i, language: "python" },
  { pattern: /\bgin\b/i, language: "go", framework: "Gin" },
  { pattern: /\becho\b/i, language: "go", framework: "Echo" },
  { pattern: /\bgo\b|\bgolang\b/i, language: "go" },
  { pattern: /\bactix\b/i, language: "rust", framework: "Actix" },
  { pattern: /\brust\b/i, language: "rust" },
  { pattern: /next\.?js|nextjs/i, language: "typescript", framework: "Next.js" },
  { pattern: /\bnestjs\b/i, language: "typescript", framework: "NestJS" },
  { pattern: /\bexpress\b/i, language: "javascript", framework: "Express" },
  { pattern: /\bnode(\.js)?\b/i, language: "javascript" },
  { pattern: /\btypescript\b/i, language: "typescript" },
  { pattern: /laravel/i, language: "php", framework: "Laravel" },
  { pattern: /\bphp\b/i, language: "php" },
  { pattern: /\brails\b|ruby\s*on\s*rails/i, language: "ruby", framework: "Rails" },
  { pattern: /\bruby\b/i, language: "ruby" },
  { pattern: /\bktor\b/i, language: "kotlin", framework: "Ktor" },
  { pattern: /\bkotlin\b/i, language: "kotlin" },
  { pattern: /\bphoenix\b/i, language: "elixir", framework: "Phoenix" },
  { pattern: /\belixir\b/i, language: "elixir" },
  { pattern: /\bvapor\b/i, language: "swift", framework: "Vapor" },
  { pattern: /\bswift\b/i, language: "swift" },
  { pattern: /\bscala\b/i, language: "scala" },
  { pattern: /\.net|dotnet|asp\.?net/i, language: "csharp" },
]

export function detectStackFromText(text: string): { language: string; framework?: string } | null {
  for (const rule of DETECTION_RULES) {
    if (rule.pattern.test(text)) {
      const language = sanitizeLanguage(rule.language)
      if (!language) continue
      const framework = rule.framework ? sanitizeFramework(language, rule.framework) : ""
      return { language, framework: framework || undefined }
    }
  }
  return null
}
