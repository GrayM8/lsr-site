"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Filter, X } from "lucide-react"
import { ROLE_LABEL, type RoleCode } from "@/lib/roles"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

type Props = { selectedRoles: RoleCode[] }

const ALL_ROLES = Object.keys(ROLE_LABEL) as RoleCode[]

export function DriversFilters({ selectedRoles }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const toggleRole = (role: RoleCode, checked: boolean) => {
    const sp = new URLSearchParams(searchParams ?? undefined)
    const current = (sp.getAll("role") as string[]).filter(Boolean) as RoleCode[]
    const next = new Set<RoleCode>(current)
    if (checked) next.add(role)
    else next.delete(role)
    sp.delete("role")
    ;[...next].forEach((r) => sp.append("role", r))
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
  }

  const clearFilters = () => {
    const sp = new URLSearchParams(searchParams ?? undefined)
    sp.delete("role")            // keep `q` intact
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-white/10 bg-transparent hover:bg-white/10"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Roles</DropdownMenuLabel>

        <div className="px-1 py-2">
          {ALL_ROLES.map((role) => (
            <DropdownMenuCheckboxItem
              key={role}
              checked={selectedRoles.includes(role)}
              onCheckedChange={(v) => toggleRole(role, Boolean(v))}
              className="capitalize"
            >
              {ROLE_LABEL[role]}
            </DropdownMenuCheckboxItem>
          ))}
        </div>

        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
