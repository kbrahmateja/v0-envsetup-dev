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

export function NewsletterForm({ newsletter }: { newsletter?: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: newsletter?.title || "",
    subject: newsletter?.subject || "",
    content: newsletter?.content || "",
  })

  const handleSubmit = async (e: React.FormEvent, status = "draft") => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/newsletters", {
        method: newsletter ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
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

  return (
    <form onSubmit={(e) => handleSubmit(e, "draft")}>
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
              Tip: Use simple formatting. HTML will be generated automatically.
            </p>
          </div>

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
