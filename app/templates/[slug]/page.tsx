import { notFound } from "next/navigation"
import { templates } from "@/lib/templates"
import TemplateDetail from "@/components/template-detail"

interface TemplatePageProps {
  params: {
    slug: string
  }
}

export default function TemplatePage({ params }: TemplatePageProps) {
  const template = templates.find((t) => t.slug === params.slug)

  if (!template) {
    notFound()
  }

  return <TemplateDetail template={template} />
}

export function generateStaticParams() {
  return templates.map((template) => ({
    slug: template.slug,
  }))
}
