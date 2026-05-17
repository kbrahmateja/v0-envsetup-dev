"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Github, Star, Eye, Calendar, User } from "lucide-react"
import type { Template } from "@/lib/templates"
import { trackTemplateView, trackDownload } from "@/lib/gtag"
import { useEffect } from "react"

interface TemplateDetailProps {
  template: Template
}

export default function TemplateDetail({ template }: TemplateDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    trackTemplateView(template.name)
  }, [template.name])

  const handleDownload = (type: "zip" | "github" | "cli") => {
    trackDownload(type, template.slug)

    // Simulate download/action
    if (type === "zip") {
      console.log("Downloading template ZIP...")
    } else if (type === "github") {
      console.log("Creating GitHub repository from template...")
    } else if (type === "cli") {
      console.log("Showing CLI instructions...")
    }
  }

  const generateFileStructure = () => {
    // This would be dynamically generated based on the template
    return `${template.name.toLowerCase().replace(/\s+/g, "-")}/
├── README.md
├── .gitignore
├── package.json
├── src/
│   ├── components/
│   │   └── index.ts
│   ├── utils/
│   │   └── helpers.ts
│   └── index.${template.language === "typescript" ? "ts" : "js"}
├── tests/
│   └── example.test.${template.language === "typescript" ? "ts" : "js"}
└── docs/
    └── setup.md`
  }

  const generateReadme = () => {
    return `# ${template.name}

${template.description}

## Features

${template.tags.map((tag) => `- ${tag.charAt(0).toUpperCase() + tag.slice(1)}`).join("\n")}

## Getting Started

1. Clone this repository
2. Install dependencies: \`npm install\`
3. Start development server: \`npm run dev\`

## Technologies Used

- **Language**: ${template.language.charAt(0).toUpperCase() + template.language.slice(1)}
${template.framework ? `- **Framework**: ${template.framework}` : ""}
- **Tools**: ${template.tags.join(", ")}

## Author

Created by ${template.author}

## License

MIT License - feel free to use this template for your projects!

---

Generated with ❤️ by [EnvSetup.dev](https://envsetup.dev)`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/templates">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Link>
        </Button>

        {/* Template Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">{template.name}</h1>
                {template.featured && <Badge className="bg-yellow-500 text-yellow-50">Featured</Badge>}
              </div>

              <p className="text-xl text-muted-foreground max-w-2xl">{template.description}</p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{template.language}</Badge>
                {template.framework && <Badge variant="outline">{template.framework}</Badge>}
                <Badge variant="outline">{template.category}</Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats */}
            <Card className="lg:w-80">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center text-2xl font-bold text-primary mb-1">
                      <Star className="w-5 h-5 mr-1" />
                      {template.rating}
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center text-2xl font-bold text-primary mb-1">
                      <Download className="w-5 h-5 mr-1" />
                      {template.downloads.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Downloads</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center text-2xl font-bold text-primary mb-1">
                      <Eye className="w-5 h-5 mr-1" />
                      {template.views.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Views</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center text-2xl font-bold text-primary mb-1">
                      <User className="w-5 h-5 mr-1" />
                    </div>
                    <div className="text-sm text-muted-foreground">{template.author}</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Updated {new Date(template.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Download Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Get This Template</CardTitle>
            <CardDescription>Choose how you'd like to use this template in your project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={() => handleDownload("zip")} className="h-auto p-4 flex flex-col items-center gap-2">
                <Download className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">Download ZIP</div>
                  <div className="text-xs opacity-75">Get all files in a ZIP archive</div>
                </div>
              </Button>

              <Button
                onClick={() => handleDownload("github")}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Github className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">Use Template</div>
                  <div className="text-xs opacity-75">Create repository from template</div>
                </div>
              </Button>

              <Button
                onClick={() => handleDownload("cli")}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Download className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">CLI Command</div>
                  <div className="text-xs opacity-75">Use our CLI tool</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Template Details */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="structure">File Structure</TabsTrigger>
            <TabsTrigger value="readme">README</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      Complete project structure
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      Pre-configured development tools
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      Best practices and conventions
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      Documentation and examples
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      Testing setup
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full mr-3" />
                      Node.js 18+ (for JavaScript/TypeScript projects)
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full mr-3" />
                      Git for version control
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full mr-3" />
                      Code editor (VS Code recommended)
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full mr-3" />
                      Basic knowledge of {template.language}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="structure" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Structure</CardTitle>
                <CardDescription>Overview of the files and folders included in this template</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{generateFileStructure()}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="readme" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>README.md</CardTitle>
                <CardDescription>Documentation that comes with this template</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                  <code>{generateReadme()}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
