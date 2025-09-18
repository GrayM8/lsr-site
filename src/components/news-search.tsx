"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"

export function NewsSearch({ q }: { q: string }) {
  const [term, setTerm] = React.useState(q)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  React.useEffect(() => setTerm(q), [q])

  // Debounce URL updates
  React.useEffect(() => {
    const id = setTimeout(() => {
      const sp = new URLSearchParams(searchParams ?? undefined)
      if (term.trim()) sp.set("q", term.trim())
      else sp.delete("q")
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
    }, 250)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term])

  return (
      <Input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search articles…"
        className="h-9 w-[260px] bg-transparent"
      />
  )
}
