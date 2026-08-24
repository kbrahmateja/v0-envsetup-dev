"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"
import { templates } from "@/lib/templates"

const categories = ["All", "Full Stack", "Backend", "Frontend"]

const languageColors: Record<string, string> = {
  javascript: "bg-yellow-100 text-yellow-800",
  typescript: "bg-blue-100 text-blue-800",
  python: "bg-green-100 text-green-800",
  java: "bg-orange-100 text-orange-800",
  go: "bg-cyan-100 text-cyan-800",
  rust: "bg-red-100 text-red-800",
  php: "bg-purple-100 text-purple-800",
  ruby: "bg-pink-100 text-pink-800",
  csharp: "bg-violet-100 text-violet-800",
  kotlin: "bg-indigo-100 text-indigo-800",
  elixir: "bg-fuchsia-100 text-fuchsia-800",
}

export default function TemplatesPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = templates.filter((t) => {
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
      t.language.toLowerCase().includes(search.toLowerCase()) ||
      (t.framework && t.framework.toLowerCase().includes(search.toLowerCase())) ||
      (t.database && t.database.toLowerCase().includes(search.toLowerCase()))

    const matchCategory = activeCategory === "All" || t.category === activeCategory

    return matchSearch && matchCategory
  })

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Template Library</h1>
        <p className="text-muted-foreground text-lg mb-6">
          {templates.length} pre-built templates across {new Set(templates.map(t => t.language)).size} languages
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by language, framework, database..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 justify-center flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {cat === "All" && (
                <Badge variant="secondary" className="ml-2 text-xs">{templates.length}</Badge>
              )}
              {cat !== "All" && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {templates.filter(t => t.category === cat).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No templates found for &quot;{search}&quot;</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setActiveCategory("All") }}>
            Clear filters
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((template) => (
          <Card key={template.id} className="flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-base leading-tight">{template.name}</CardTitle>
                <div className="flex flex-col gap-1 items-end shrink-0">
                  {template.popular && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-xs">Popular</Badge>
                  )}
                  {template.featured && (
                    <Badge variant="outline" className="text-xs">Featured</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${languageColors[template.language] || "bg-gray-100 text-gray-700"}`}>
                  {template.language.charAt(0).toUpperCase() + template.language.slice(1)}
                </span>
                <span className="text-xs text-muted-foreground">{template.category}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow pb-2">
              <CardDescription className="text-xs leading-relaxed">{template.description}</CardDescription>
              <div className="flex flex-wrap gap-1 mt-3">
                {template.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0">+{template.tags.length - 4}</Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild className="w-full" size="sm">
                <Link href={{ pathname: "/generator", query: { template: JSON.stringify(template) } }}>
                  Use Template <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filtered.length > 0 && (
        <p className="text-center text-muted-foreground text-sm mt-8">
          Showing {filtered.length} of {templates.length} templates
        </p>
      )}
    </div>
  )
}
