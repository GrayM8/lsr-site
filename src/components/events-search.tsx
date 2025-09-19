"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"

export function EventsSearch({ q }: { q: string }) {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("q", term)
    } else {
      params.delete("q")
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <Input
      type="search"
      placeholder="Search events..."
      className="md:w-[250px] bg-white/5 border-white/10 placeholder:text-white/60"
      defaultValue={q}
      onChange={(e) => handleSearch(e.target.value)}
    />
  )
}
