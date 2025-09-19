"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"

export function EventsFilters({ allTypes, selectedTypes }: {
  allTypes: string[],
  selectedTypes: string[]
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const handleSelect = (type: string) => {
    const params = new URLSearchParams(searchParams)
    const currentTypes = params.getAll("type")

    if (currentTypes.includes(type)) {
      params.delete("type")
      currentTypes.filter(t => t !== type).forEach(t => params.append("type", t))
    } else {
      params.append("type", type)
    }

    router.replace(`${pathname}?${params.toString()}`)
  }
  
  const clearFilters = () => {
    const sp = new URLSearchParams(searchParams ?? undefined)
    sp.delete("type")
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
  }
  
  const active = selectedTypes.length > 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-white/10 bg-transparent hover:bg-white/10">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by event type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allTypes.map(type => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={selectedTypes.includes(type.toLowerCase())}
            onCheckedChange={() => handleSelect(type.toLowerCase())}
          >
            {type}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full" onClick={clearFilters} disabled={!active}>
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
