'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect } from "react"

export default function TemplatesPage() {
  // Add specific templates page tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('Templates Page Visit')
    }
  }, [])

  // Function to track template selection
  const trackTemplateSelection = (templateName: string) => {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('Template Selected', {
        props: {
          templateName: templateName
        }
      })
    }
  }

  const templates = [
    {
      name: "MERN Stack",
      description: "MongoDB, Express.js, React, and Node.js stack with authentication and basic CRUD operations.",
      tags: ["JavaScript", "MongoDB", "Express", "React", "Node.js"],
      popular: true,
    },
    {
      name: "Next.js + Tailwind",
      description: "Modern Next.js application with Tailwind CSS, TypeScript, and API routes.",
      tags: ["TypeScript", "Next.js", "Tailwind CSS", "Vercel"],
      popular: true,
    },
    {
      name: "Django + PostgreSQL",
      description: "Django web application with PostgreSQL database, user authentication, and REST API.",
      tags: ["Python", "Django", "PostgreSQL", "REST"],
      popular: false,
    },
    {
      name: "Spring Boot + React",
      description: "Full-stack application with Spring Boot backend and React frontend.",
      tags: ["Java", "Spring Boot", "React", "Maven"],
      popular: false,
    },
    {
      name: "Flask + SQLAlchemy",
      description: "Python Flask application with SQLAlchemy ORM, Jinja templates, and user authentication.",
      tags: ["Python", "Flask", "SQLAlchemy", "SQLite"],
      popular: false,
    },
    {
      name: "T3 Stack",
      description: "Type-safe full-stack application with Next.js, tRPC, Prisma, and NextAuth.",
      tags: ["TypeScript", "Next.js", "tRPC", "Prisma", "NextAuth"],
      popular: true,
    },
    {
      name: "LAMP Stack",
      description: "Linux, Apache, MySQL, and PHP stack with basic CRUD operations.",
      tags: ["PHP", "MySQL", "Apache", "Linux"],
      popular: false,
    },
    {
      name: "Go + Fiber + GORM",
      description: "Go web application with Fiber framework and GORM ORM.",
      tags: ["Go", "Fiber", "GORM", "PostgreSQL"],
      popular: false,
    },
    {
      name: "Vue + Express",
      description: "Vue.js frontend with Express.js backend and MongoDB database.",
      tags: ["JavaScript", "Vue", "Express", "MongoDB"],
      popular: false,
    },
  ]

  return (
    <div className="container py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Template Library</h1>
        <p className="mt-4 text-muted-foreground md:text-xl">
          Choose from our pre-built templates to jumpstart your development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <Card
            key={index}
            className="flex flex-col h-full border-2 transition-all hover:border-primary/20 hover:shadow-md"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{template.name}</CardTitle>
                {template.popular && (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    Popular
                  </Badge>
                )}
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" onClick={() => trackTemplateSelection(template.name)}>
                <Link
                  href={{
                    pathname: "/generator",
                    query: {
                      template: JSON.stringify(template),
                      result: "true", // Add the result query parameter
                    },
                  }}
                >
                  Use Template
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
