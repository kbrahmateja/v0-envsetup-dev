export const dynamic = "force-dynamic"

import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { NewsletterList } from "@/components/admin/newsletter-list"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewslettersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Newsletters</h1>
          <p className="text-muted-foreground">Manage and send newsletters to subscribers</p>
        </div>
        <Link href="/admin/newsletters/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Newsletter
          </Button>
        </Link>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <NewsletterList />
      </Suspense>
    </div>
  )
}
