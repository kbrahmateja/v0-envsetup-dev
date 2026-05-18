/**
 * Version Compatibility Matrix
 * Maps language + framework → correct versions, Docker images, package managers
 */

export interface VersionInfo {
  languageVersion: string        // e.g. "20.x", "3.11", "17"
  frameworkVersion: string       // e.g. "14.x", "5.0.x", "3.2.x"
  dockerImage: string            // base Docker image
  packageManager: string         // npm, pip, maven, cargo, etc.
  minLanguageVersion: string     // minimum required
  notes?: string
}

export interface DBVersion {
  image: string                  // Docker image for this DB
  version: string
  port: number
  envVars: Record<string, string>
  healthCheck?: string
}

// ─── Language → Framework → VersionInfo ─────────────────────────────────────
export const frameworkVersions: Record<string, Record<string, VersionInfo>> = {

  // JavaScript
  javascript: {
    express:    { languageVersion: "20.x", frameworkVersion: "4.18.x", dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "14.x" },
    fastify:    { languageVersion: "20.x", frameworkVersion: "4.x",    dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "16.x" },
    koa:        { languageVersion: "20.x", frameworkVersion: "2.15.x", dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "14.x" },
    hapi:       { languageVersion: "20.x", frameworkVersion: "21.x",   dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "16.x" },
    hono:       { languageVersion: "20.x", frameworkVersion: "4.x",    dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "16.x" },
    feathers:   { languageVersion: "20.x", frameworkVersion: "5.x",    dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "16.x" },
    adonis:     { languageVersion: "20.x", frameworkVersion: "6.x",    dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "18.x" },
    loopback:   { languageVersion: "20.x", frameworkVersion: "4.x",    dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "16.x" },
    meteor:     { languageVersion: "20.x", frameworkVersion: "3.x",    dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "14.x" },
    strapi:     { languageVersion: "20.x", frameworkVersion: "4.x",    dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "18.x" },
  },

  // TypeScript
  typescript: {
    nextjs:     { languageVersion: "20.x", frameworkVersion: "15.x",   dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "18.17.x",
                  notes: "Next.js 15 requires Node.js 18.17+ and React 19" },
    nestjs:     { languageVersion: "20.x", frameworkVersion: "10.x",   dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "16.x" },
    sveltekit:  { languageVersion: "20.x", frameworkVersion: "2.x",    dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "16.x" },
    nuxtjs:     { languageVersion: "20.x", frameworkVersion: "3.x",    dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "18.x" },
    remix:      { languageVersion: "20.x", frameworkVersion: "2.x",    dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "18.x" },
    astro:      { languageVersion: "20.x", frameworkVersion: "4.x",    dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "18.x" },
    elysia:     { languageVersion: "1.x",  frameworkVersion: "1.x",    dockerImage: "oven/bun:1-alpine", packageManager: "bun", minLanguageVersion: "1.x",
                  notes: "Elysia requires Bun runtime, not Node.js" },
    angular:    { languageVersion: "20.x", frameworkVersion: "17.x",   dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "18.x" },
    fastify:    { languageVersion: "20.x", frameworkVersion: "4.x",    dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "16.x" },
    medusa:     { languageVersion: "20.x", frameworkVersion: "2.x",    dockerImage: "node:20-alpine", packageManager: "npm", minLanguageVersion: "20.x" },
  },

  // Python
  python: {
    fastapi:    { languageVersion: "3.12", frameworkVersion: "0.109.x", dockerImage: "python:3.12-slim", packageManager: "pip", minLanguageVersion: "3.8",
                  notes: "FastAPI 0.100+ requires Python 3.7+ but 3.11+ recommended for performance" },
    django:     { languageVersion: "3.12", frameworkVersion: "5.0.x",   dockerImage: "python:3.12-slim", packageManager: "pip", minLanguageVersion: "3.10",
                  notes: "Django 5.0 requires Python 3.10+" },
    flask:      { languageVersion: "3.12", frameworkVersion: "3.0.x",   dockerImage: "python:3.12-slim", packageManager: "pip", minLanguageVersion: "3.8" },
    litestar:   { languageVersion: "3.12", frameworkVersion: "2.x",     dockerImage: "python:3.12-slim", packageManager: "pip", minLanguageVersion: "3.9" },
    tornado:    { languageVersion: "3.12", frameworkVersion: "6.x",     dockerImage: "python:3.12-slim", packageManager: "pip", minLanguageVersion: "3.8" },
    pyramid:    { languageVersion: "3.11", frameworkVersion: "2.x",     dockerImage: "python:3.11-slim", packageManager: "pip", minLanguageVersion: "3.6" },
    bottle:     { languageVersion: "3.11", frameworkVersion: "0.13.x",  dockerImage: "python:3.11-slim", packageManager: "pip", minLanguageVersion: "3.6" },
    sanic:      { languageVersion: "3.12", frameworkVersion: "23.x",    dockerImage: "python:3.12-slim", packageManager: "pip", minLanguageVersion: "3.8" },
    falcon:     { languageVersion: "3.12", frameworkVersion: "3.x",     dockerImage: "python:3.12-slim", packageManager: "pip", minLanguageVersion: "3.8" },
    starlette:  { languageVersion: "3.12", frameworkVersion: "0.36.x",  dockerImage: "python:3.12-slim", packageManager: "pip", minLanguageVersion: "3.8" },
  },

  // Java
  java: {
    spring_boot:  { languageVersion: "21", frameworkVersion: "3.2.x", dockerImage: "eclipse-temurin:21-jdk-alpine", packageManager: "maven", minLanguageVersion: "17",
                    notes: "Spring Boot 3.x requires Java 17+. Spring Boot 2.7.x supports Java 11+" },
    quarkus:      { languageVersion: "21", frameworkVersion: "3.x",   dockerImage: "eclipse-temurin:21-jdk-alpine", packageManager: "maven", minLanguageVersion: "17" },
    micronaut:    { languageVersion: "21", frameworkVersion: "4.x",   dockerImage: "eclipse-temurin:21-jdk-alpine", packageManager: "maven", minLanguageVersion: "17" },
    vertx:        { languageVersion: "21", frameworkVersion: "4.x",   dockerImage: "eclipse-temurin:21-jdk-alpine", packageManager: "maven", minLanguageVersion: "11" },
    helidon:      { languageVersion: "21", frameworkVersion: "4.x",   dockerImage: "eclipse-temurin:21-jdk-alpine", packageManager: "maven", minLanguageVersion: "21",
                    notes: "Helidon 4.x requires Java 21 for virtual threads" },
    dropwizard:   { languageVersion: "17", frameworkVersion: "4.x",   dockerImage: "eclipse-temurin:17-jdk-alpine", packageManager: "maven", minLanguageVersion: "11" },
    javalin:      { languageVersion: "21", frameworkVersion: "6.x",   dockerImage: "eclipse-temurin:21-jdk-alpine", packageManager: "maven", minLanguageVersion: "11" },
    sparkjava:    { languageVersion: "17", frameworkVersion: "2.9.x", dockerImage: "eclipse-temurin:17-jdk-alpine", packageManager: "maven", minLanguageVersion: "8" },
  },

  // Kotlin
  kotlin: {
    spring_boot:  { languageVersion: "1.9.x", frameworkVersion: "3.2.x", dockerImage: "eclipse-temurin:21-jdk-alpine", packageManager: "gradle", minLanguageVersion: "1.8.x",
                    notes: "Kotlin Spring Boot 3.x requires Kotlin 1.8+ and Java 17+" },
    ktor:         { languageVersion: "1.9.x", frameworkVersion: "2.3.x", dockerImage: "eclipse-temurin:17-jdk-alpine", packageManager: "gradle", minLanguageVersion: "1.7.x" },
    micronaut:    { languageVersion: "1.9.x", frameworkVersion: "4.x",   dockerImage: "eclipse-temurin:21-jdk-alpine", packageManager: "gradle", minLanguageVersion: "1.8.x" },
  },

  // Go
  go: {
    gin:    { languageVersion: "1.22", frameworkVersion: "1.9.x",  dockerImage: "golang:1.22-alpine", packageManager: "go mod", minLanguageVersion: "1.18" },
    fiber:  { languageVersion: "1.22", frameworkVersion: "2.52.x", dockerImage: "golang:1.22-alpine", packageManager: "go mod", minLanguageVersion: "1.20" },
    echo:   { languageVersion: "1.22", frameworkVersion: "4.x",    dockerImage: "golang:1.22-alpine", packageManager: "go mod", minLanguageVersion: "1.18" },
    chi:    { languageVersion: "1.22", frameworkVersion: "5.x",    dockerImage: "golang:1.22-alpine", packageManager: "go mod", minLanguageVersion: "1.18" },
    beego:  { languageVersion: "1.21", frameworkVersion: "2.x",    dockerImage: "golang:1.21-alpine", packageManager: "go mod", minLanguageVersion: "1.16" },
    buffalo:{ languageVersion: "1.21", frameworkVersion: "0.18.x", dockerImage: "golang:1.21-alpine", packageManager: "go mod", minLanguageVersion: "1.18" },
    gorilla:{ languageVersion: "1.22", frameworkVersion: "1.8.x",  dockerImage: "golang:1.22-alpine", packageManager: "go mod", minLanguageVersion: "1.18" },
    iris:   { languageVersion: "1.22", frameworkVersion: "12.x",   dockerImage: "golang:1.22-alpine", packageManager: "go mod", minLanguageVersion: "1.20" },
    mux:    { languageVersion: "1.22", frameworkVersion: "1.8.x",  dockerImage: "golang:1.22-alpine", packageManager: "go mod", minLanguageVersion: "1.18" },
  },

  // Rust
  rust: {
    actix:  { languageVersion: "1.75", frameworkVersion: "4.x",    dockerImage: "rust:1.75-alpine",  packageManager: "cargo", minLanguageVersion: "1.68" },
    axum:   { languageVersion: "1.75", frameworkVersion: "0.7.x",  dockerImage: "rust:1.75-alpine",  packageManager: "cargo", minLanguageVersion: "1.66" },
    rocket: { languageVersion: "1.75", frameworkVersion: "0.5.x",  dockerImage: "rust:1.75-alpine",  packageManager: "cargo", minLanguageVersion: "1.70" },
    tide:   { languageVersion: "1.75", frameworkVersion: "0.17.x", dockerImage: "rust:1.75-alpine",  packageManager: "cargo", minLanguageVersion: "1.60" },
    warp:   { languageVersion: "1.75", frameworkVersion: "0.3.x",  dockerImage: "rust:1.75-alpine",  packageManager: "cargo", minLanguageVersion: "1.60" },
  },

  // PHP
  php: {
    laravel:      { languageVersion: "8.3", frameworkVersion: "11.x",  dockerImage: "php:8.3-fpm-alpine", packageManager: "composer", minLanguageVersion: "8.2",
                    notes: "Laravel 11 requires PHP 8.2+. Laravel 10 supports PHP 8.1+" },
    symfony:      { languageVersion: "8.3", frameworkVersion: "7.x",   dockerImage: "php:8.3-fpm-alpine", packageManager: "composer", minLanguageVersion: "8.2" },
    codeigniter:  { languageVersion: "8.2", frameworkVersion: "4.x",   dockerImage: "php:8.2-fpm-alpine", packageManager: "composer", minLanguageVersion: "7.4" },
    slim:         { languageVersion: "8.3", frameworkVersion: "4.x",   dockerImage: "php:8.3-fpm-alpine", packageManager: "composer", minLanguageVersion: "7.4" },
    yii:          { languageVersion: "8.2", frameworkVersion: "2.x",   dockerImage: "php:8.2-fpm-alpine", packageManager: "composer", minLanguageVersion: "7.4" },
    cakephp:      { languageVersion: "8.3", frameworkVersion: "5.x",   dockerImage: "php:8.3-fpm-alpine", packageManager: "composer", minLanguageVersion: "8.1" },
    phalcon:      { languageVersion: "8.2", frameworkVersion: "5.x",   dockerImage: "php:8.2-fpm-alpine", packageManager: "composer", minLanguageVersion: "8.0" },
  },

  // Ruby
  ruby: {
    rails:   { languageVersion: "3.3", frameworkVersion: "7.1.x",  dockerImage: "ruby:3.3-alpine",  packageManager: "bundler", minLanguageVersion: "3.1",
               notes: "Rails 7.1 requires Ruby 2.7+ but 3.1+ recommended" },
    sinatra: { languageVersion: "3.3", frameworkVersion: "4.x",    dockerImage: "ruby:3.3-alpine",  packageManager: "bundler", minLanguageVersion: "2.7" },
    hanami:  { languageVersion: "3.3", frameworkVersion: "2.x",    dockerImage: "ruby:3.3-alpine",  packageManager: "bundler", minLanguageVersion: "3.1" },
    grape:   { languageVersion: "3.3", frameworkVersion: "2.x",    dockerImage: "ruby:3.3-alpine",  packageManager: "bundler", minLanguageVersion: "2.7" },
    roda:    { languageVersion: "3.3", frameworkVersion: "3.x",    dockerImage: "ruby:3.3-alpine",  packageManager: "bundler", minLanguageVersion: "2.5" },
  },

  // C#
  csharp: {
    aspnet:      { languageVersion: "8.0", frameworkVersion: ".NET 8", dockerImage: "mcr.microsoft.com/dotnet/sdk:8.0-alpine", packageManager: "dotnet", minLanguageVersion: "8.0",
                   notes: ".NET 8 LTS — EOL Nov 2026. .NET 9 is latest non-LTS" },
    blazor:      { languageVersion: "8.0", frameworkVersion: ".NET 8", dockerImage: "mcr.microsoft.com/dotnet/sdk:8.0-alpine", packageManager: "dotnet", minLanguageVersion: "8.0" },
    minimal_api: { languageVersion: "8.0", frameworkVersion: ".NET 8", dockerImage: "mcr.microsoft.com/dotnet/sdk:8.0-alpine", packageManager: "dotnet", minLanguageVersion: "6.0" },
    orleans:     { languageVersion: "8.0", frameworkVersion: "8.x",    dockerImage: "mcr.microsoft.com/dotnet/sdk:8.0-alpine", packageManager: "dotnet", minLanguageVersion: "8.0" },
  },

  // Elixir
  elixir: {
    phoenix: { languageVersion: "1.16", frameworkVersion: "1.7.x", dockerImage: "elixir:1.16-alpine", packageManager: "mix", minLanguageVersion: "1.14",
               notes: "Phoenix 1.7 requires Elixir 1.14+ and Erlang/OTP 24+" },
    plug:    { languageVersion: "1.16", frameworkVersion: "1.16.x",dockerImage: "elixir:1.16-alpine", packageManager: "mix", minLanguageVersion: "1.12" },
  },

  // Swift
  swift: {
    vapor:       { languageVersion: "5.10", frameworkVersion: "4.x", dockerImage: "swift:5.10-slim", packageManager: "spm", minLanguageVersion: "5.5" },
    hummingbird: { languageVersion: "5.10", frameworkVersion: "2.x", dockerImage: "swift:5.10-slim", packageManager: "spm", minLanguageVersion: "5.9" },
  },
}

// ─── Database Docker Images & Versions ──────────────────────────────────────
export const dbVersions: Record<string, DBVersion> = {
  postgres: {
    image: "postgres:16-alpine", version: "16", port: 5432,
    envVars: { POSTGRES_PASSWORD: "password", POSTGRES_DB: "${PROJECT_NAME}", POSTGRES_USER: "postgres" },
    healthCheck: "pg_isready -U postgres",
  },
  mysql: {
    image: "mysql:8.3", version: "8.3", port: 3306,
    envVars: { MYSQL_ROOT_PASSWORD: "password", MYSQL_DATABASE: "${PROJECT_NAME}", MYSQL_USER: "app", MYSQL_PASSWORD: "password" },
    healthCheck: "mysqladmin ping -h localhost",
  },
  mongodb: {
    image: "mongo:7.0", version: "7.0", port: 27017,
    envVars: { MONGO_INITDB_ROOT_USERNAME: "root", MONGO_INITDB_ROOT_PASSWORD: "password" },
    healthCheck: "mongosh --eval 'db.runCommand({ ping: 1 })'",
  },
  redis: {
    image: "redis:7.2-alpine", version: "7.2", port: 6379,
    envVars: {},
    healthCheck: "redis-cli ping",
  },
  sqlite: {
    image: "", version: "3.x", port: 0, // embedded, no Docker image
    envVars: {},
  },
  supabase: {
    image: "supabase/postgres:15.1.0.147", version: "15", port: 5432,
    envVars: { POSTGRES_PASSWORD: "password" },
  },
  h2: {
    image: "", version: "2.x", port: 0, // embedded
    envVars: {},
  },
  sqlserver: {
    image: "mcr.microsoft.com/mssql/server:2022-latest", version: "2022", port: 1433,
    envVars: { ACCEPT_EULA: "Y", MSSQL_SA_PASSWORD: "Password123!" },
  },
  cassandra: {
    image: "cassandra:4.1", version: "4.1", port: 9042,
    envVars: {},
    healthCheck: "cqlsh -e 'describe cluster'",
  },
}

// ─── Helper: Get version info for a language+framework combo ────────────────
export function getVersionInfo(language: string, framework: string): VersionInfo | null {
  const lang = language.toLowerCase()
  const fw = framework.toLowerCase().replace(/[^a-z0-9]/g, "_")
  return frameworkVersions[lang]?.[fw] ?? null
}

// ─── Helper: Check if two versions are compatible ───────────────────────────
export function isCompatible(language: string, framework: string, langVersion: string): boolean {
  const info = getVersionInfo(language, framework)
  if (!info) return true // unknown = assume compatible
  const min = parseFloat(info.minLanguageVersion)
  const current = parseFloat(langVersion)
  return !isNaN(min) && !isNaN(current) ? current >= min : true
}

// ─── Helper: Get Docker base image for a language+framework ─────────────────
export function getDockerImage(language: string, framework: string): string {
  const info = getVersionInfo(language, framework)
  if (info) return info.dockerImage
  // Fallbacks per language
  const fallbacks: Record<string, string> = {
    javascript: "node:20-alpine",
    typescript: "node:20-alpine",
    python: "python:3.12-slim",
    java: "eclipse-temurin:21-jdk-alpine",
    kotlin: "eclipse-temurin:21-jdk-alpine",
    go: "golang:1.22-alpine",
    rust: "rust:1.75-alpine",
    php: "php:8.3-fpm-alpine",
    ruby: "ruby:3.3-alpine",
    csharp: "mcr.microsoft.com/dotnet/sdk:8.0-alpine",
    elixir: "elixir:1.16-alpine",
    swift: "swift:5.10-slim",
    dart: "dart:3.3-alpine",
    scala: "eclipse-temurin:21-jdk-alpine",
  }
  return fallbacks[language.toLowerCase()] ?? "ubuntu:22.04"
}

// ─── Helper: Get package manager for a language+framework ───────────────────
export function getPackageManager(language: string, framework: string): string {
  const info = getVersionInfo(language, framework)
  if (info) return info.packageManager
  const fallbacks: Record<string, string> = {
    javascript: "npm", typescript: "npm", python: "pip",
    java: "maven", kotlin: "gradle", go: "go mod",
    rust: "cargo", php: "composer", ruby: "bundler",
    csharp: "dotnet", elixir: "mix", swift: "spm",
  }
  return fallbacks[language.toLowerCase()] ?? "npm"
}
