"use client"

import { ChevronLeft, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EditorHeader() {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
        <Link href="/">
        ohMyLink
        </Link>
          <h1 className="text-lg font-semibold text-foreground">UserName</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
