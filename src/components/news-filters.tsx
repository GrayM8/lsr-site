"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

type Props = { 
  allTags: string[],
  selectedTags: string[]
}

export function NewsFilters({ allTags, selectedTags }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const toggleTag = (tag: string, checked: boolean) => {
    const sp = new URLSearchParams(searchParams ?? undefined)
    const current = (sp.getAll("tag") as string[]).filter(Boolean)
    const next = new Set<string>(current)
    if (checked) next.add(tag)
    else next.delete(tag)
    sp.delete("tag")
    ;[...next].forEach((t) => sp.append("tag", t))
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
  }

  const clearFilters = () => {
    const sp = new URLSearchParams(searchParams ?? undefined)
    sp.delete("tag")
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
  }

  const active = selectedTags.length > 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant={active ? "default" : "outline"}
          aria-label="Filters"
          title="Filters"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Tags</DropdownMenuLabel>

        <div className="px-1 py-2">
          {allTags.map((tag) => (
            <DropdownMenuCheckboxItem
              key={tag}
              checked={selectedTags.includes(tag)}
              onCheckedChange={(v) => toggleTag(tag, Boolean(v))}
              className="capitalize"
            >
              {tag}
            </DropdownMenuCheckboxItem>
          ))}
        </div>

        {active && <>
          <DropdownMenuSeparator />
          <div className="p-2">
            <Button variant="ghost" size="sm" className="w-full" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear filters
            </Button>
          </div>
        </>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}