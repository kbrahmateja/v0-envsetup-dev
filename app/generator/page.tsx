import { GeneratorForm } from "@/components/generator-form"

export default function GeneratorPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Environment Generator</h1>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Configure your development environment by selecting your tech stack and preferences.
          </p>
        </div>
        <GeneratorForm />
      </div>
    </div>
  )
}
