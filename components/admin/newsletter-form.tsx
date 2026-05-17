"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { emailTemplates, generateEmailHTML } from "@/lib/email-templates"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function NewsletterForm({ newsletter }: { newsletter?: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(newsletter?.template || "simple-update")
  const [formData, setFormData] = useState({
    title: newsletter?.title || "",
    subject: newsletter?.subject || "",
    content: newsletter?.content || "",
  })

  const handleSubmit = async (e: React.FormEvent, status = "draft") => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const htmlContent = generateEmailHTML(selectedTemplate, formData.subject, formData.content)

      const response = await fetch("/api/admin/newsletters", {
        method: newsletter ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          html_content: htmlContent,
          template: selectedTemplate,
          status,
          id: newsletter?.id,
        }),
      })

      if (!response.ok) throw new Error("Failed to save newsletter")

      toast.success(status === "draft" ? "Newsletter saved as draft" : "Newsletter created successfully")
      router.push("/admin/newsletters")
      router.refresh()
    } catch (error) {
      toast.error("Failed to save newsletter")
    } finally {
      setIsSubmitting(false)
    }
  }

  const previewHTML = generateEmailHTML(
    selectedTemplate,
    formData.subject,
    formData.content || "Your content will appear here...",
  )

  return (
    <form onSubmit={(e) => handleSubmit(e, "draft")} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choose Email Template</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emailTemplates.map((template) => (
                <label
                  key={template.id}
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary ${
                    selectedTemplate === template.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <RadioGroupItem value={template.id} id={template.id} />
                  <div className="flex-1">
                    <div className="font-semibold">{template.name}</div>
                    <div className="text-sm text-muted-foreground">{template.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">{template.preview}</div>
                  </div>
                </label>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Newsletter Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Internal title for this newsletter"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              placeholder="Subject line that subscribers will see"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your newsletter content here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              required
            />
            <p className="text-xs text-muted-foreground">
              Your content will be automatically formatted based on the selected template.
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" className="w-full bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                Preview Email
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Email Preview</DialogTitle>
              </DialogHeader>
              <div className="border rounded-lg overflow-hidden">
                <iframe srcDoc={previewHTML} className="w-full h-[600px] border-0" title="Email Preview" />
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              Save as Draft
            </Button>
            <Button type="button" variant="default" onClick={(e) => handleSubmit(e, "ready")} disabled={isSubmitting}>
              Save & Mark Ready
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
