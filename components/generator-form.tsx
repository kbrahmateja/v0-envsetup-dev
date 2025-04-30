"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  language: z.string({
    required_error: "Please select a programming language.",
  }),
  framework: z.string({
    required_error: "Please select a framework.",
  }),
  packageManager: z.string({
    required_error: "Please select a package manager.",
  }),
  dependencies: z.array(z.string()).optional(),
  environment: z.string({
    required_error: "Please select an environment type.",
  }),
  devOps: z.array(z.string()).optional(),
})

export function GeneratorForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "",
      framework: "",
      packageManager: "",
      dependencies: [],
      environment: "docker",
      devOps: [],
    },
  })

  const selectedLanguage = form.watch("language")

  // Dynamic options based on selected language
  const frameworkOptions = {
    javascript: ["React", "Vue", "Angular", "Next.js", "Nuxt.js", "Express"],
    typescript: ["React", "Vue", "Angular", "Next.js", "Nuxt.js", "NestJS"],
    python: ["Django", "Flask", "FastAPI", "Pyramid"],
    java: ["Spring Boot", "Quarkus", "Micronaut"],
    go: ["Gin", "Echo", "Fiber"],
    ruby: ["Rails", "Sinatra"],
    php: ["Laravel", "Symfony", "CodeIgniter"],
  }

  const packageManagerOptions = {
    javascript: ["npm", "yarn", "pnpm"],
    typescript: ["npm", "yarn", "pnpm"],
    python: ["pip", "poetry", "pipenv"],
    java: ["Maven", "Gradle"],
    go: ["Go Modules"],
    ruby: ["Bundler"],
    php: ["Composer"],
  }

  const dependencyOptions = {
    javascript: [
      { id: "redux", label: "Redux" },
      { id: "tailwindcss", label: "Tailwind CSS" },
      { id: "axios", label: "Axios" },
      { id: "lodash", label: "Lodash" },
      { id: "styled-components", label: "Styled Components" },
    ],
    typescript: [
      { id: "redux", label: "Redux" },
      { id: "tailwindcss", label: "Tailwind CSS" },
      { id: "axios", label: "Axios" },
      { id: "zod", label: "Zod" },
      { id: "react-query", label: "React Query" },
    ],
    python: [
      { id: "requests", label: "Requests" },
      { id: "sqlalchemy", label: "SQLAlchemy" },
      { id: "pytest", label: "Pytest" },
      { id: "pandas", label: "Pandas" },
      { id: "celery", label: "Celery" },
    ],
    java: [
      { id: "lombok", label: "Lombok" },
      { id: "jackson", label: "Jackson" },
      { id: "junit", label: "JUnit" },
      { id: "hibernate", label: "Hibernate" },
      { id: "spring-security", label: "Spring Security" },
    ],
    go: [
      { id: "gorm", label: "GORM" },
      { id: "jwt-go", label: "JWT Go" },
      { id: "testify", label: "Testify" },
      { id: "viper", label: "Viper" },
      { id: "cobra", label: "Cobra" },
    ],
    ruby: [
      { id: "devise", label: "Devise" },
      { id: "rspec", label: "RSpec" },
      { id: "sidekiq", label: "Sidekiq" },
      { id: "pundit", label: "Pundit" },
      { id: "faraday", label: "Faraday" },
    ],
    php: [
      { id: "guzzle", label: "Guzzle" },
      { id: "phpunit", label: "PHPUnit" },
      { id: "carbon", label: "Carbon" },
      { id: "passport", label: "Passport" },
      { id: "sanctum", label: "Sanctum" },
    ],
  }

  const devOpsOptions = [
    { id: "github-actions", label: "GitHub Actions" },
    { id: "gitlab-ci", label: "GitLab CI" },
    { id: "circle-ci", label: "CircleCI" },
    { id: "vercel", label: "Vercel Deployment" },
    { id: "netlify", label: "Netlify Deployment" },
    { id: "aws", label: "AWS Deployment" },
    { id: "docker-compose", label: "Docker Compose" },
    { id: "kubernetes", label: "Kubernetes" },
  ]

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    console.log(values)

    // Simulate API call to generate environment
    setTimeout(() => {
      setIsSubmitting(false)
      // Navigate to results page with form data
      router.push(`/generator/results?data=${encodeURIComponent(JSON.stringify(values))}`)
    }, 2000)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Setup</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
              <TabsContent value="basic" className="space-y-6">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Programming Language</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          // Reset dependent fields when language changes
                          form.setValue("framework", "")
                          form.setValue("packageManager", "")
                          form.setValue("dependencies", [])
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                          <SelectItem value="ruby">Ruby</SelectItem>
                          <SelectItem value="php">PHP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>The primary programming language for your project.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedLanguage && (
                  <FormField
                    control={form.control}
                    name="framework"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Framework</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a framework" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {frameworkOptions[selectedLanguage as keyof typeof frameworkOptions]?.map((framework) => (
                              <SelectItem key={framework} value={framework.toLowerCase()}>
                                {framework}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>The framework you want to use with your language.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedLanguage && (
                  <FormField
                    control={form.control}
                    name="packageManager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Manager</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a package manager" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {packageManagerOptions[selectedLanguage as keyof typeof packageManagerOptions]?.map(
                              (manager) => (
                                <SelectItem key={manager} value={manager.toLowerCase()}>
                                  {manager}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>The package manager to use for dependency management.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="environment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select environment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="docker">Docker</SelectItem>
                          <SelectItem value="devcontainer">VS Code Dev Container</SelectItem>
                          <SelectItem value="gitpod">GitPod</SelectItem>
                          <SelectItem value="local">Local Setup Script</SelectItem>
                          <SelectItem value="cloud">Cloud-hosted Devbox</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>How you want your environment to be packaged.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("dependencies")}>
                    Next: Dependencies
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="dependencies" className="space-y-6">
                {selectedLanguage && (
                  <FormField
                    control={form.control}
                    name="dependencies"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Dependencies</FormLabel>
                          <FormDescription>Select the libraries and packages you want to include.</FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dependencyOptions[selectedLanguage as keyof typeof dependencyOptions]?.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="dependencies"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(field.value?.filter((value) => value !== item.id))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                    Back: Basic Setup
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("deployment")}>
                    Next: Deployment
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="deployment" className="space-y-6">
                <FormField
                  control={form.control}
                  name="devOps"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>DevOps & Deployment</FormLabel>
                        <FormDescription>Select CI/CD and deployment options to include.</FormDescription>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {devOpsOptions.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="devOps"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.id])
                                          : field.onChange(field.value?.filter((value) => value !== item.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{item.label}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("dependencies")}>
                    Back: Dependencies
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Environment"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  )
}
