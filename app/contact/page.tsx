import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Github, Terminal } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground text-lg">Questions, feedback, or enterprise plans? We'd love to hear from you.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Email</CardTitle>
            <CardDescription>For general inquiries and support</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="mailto:hello@envsetup.dev" className="text-primary hover:underline font-medium">
              hello@envsetup.dev
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Github className="h-5 w-5" /> GitHub</CardTitle>
            <CardDescription>Report bugs or contribute</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="https://github.com/kbrahmateja/v0-envsetup-dev" target="_blank"
              className="text-primary hover:underline font-medium">
              github.com/kbrahmateja/v0-envsetup-dev
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Terminal className="h-5 w-5" /> CLI Issues</CardTitle>
            <CardDescription>Problems with @envsetup/cli</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="https://www.npmjs.com/package/@envsetup/cli" target="_blank"
              className="text-primary hover:underline font-medium">
              npm: @envsetup/cli
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
