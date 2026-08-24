// Shared language/framework catalog + validation. Used by the generator
// form (components/generator-form.tsx, which re-exports sanitizeLanguage/
// sanitizeFramework for backward compatibility) and by the AI assistant
// (app/api/ai-assistant/route.ts) to turn untrusted input - a URL param, or
// free-text chat - into a language/framework pair the generator actually
// supports.
export const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
]

export const frameworks: Record<string, string[]> = {
  javascript: ["React", "Vue", "Angular", "Svelte", "SolidJS", "Express", "Next.js", "Nuxt.js"],
  typescript: ["React", "Vue", "Angular", "Svelte", "SolidJS", "Express", "Next.js", "NestJS"],
  python: ["Django", "Flask", "FastAPI", "Streamlit", "Jupyter"],
  java: ["Spring Boot", "Spring MVC", "Quarkus", "Micronaut"],
  csharp: [".NET Core", "ASP.NET", "Blazor", "MAUI"],
  go: ["Gin", "Echo", "Fiber", "Chi"],
  rust: ["Actix", "Rocket", "Warp", "Axum"],
  php: ["Laravel", "Symfony", "CodeIgniter", "Slim"],
  ruby: ["Rails", "Sinatra", "Hanami"],
  swift: ["Vapor", "Perfect", "Kitura"],
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
