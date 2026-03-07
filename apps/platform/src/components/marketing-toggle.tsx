"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"

export function MarketingToggle({
                                  name,
                                  defaultChecked,
                                }: {
  name: string
  defaultChecked: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <>
      {/* server action reads this field */}
      <input type="hidden" name={name} value={checked ? "on" : ""} />
      <Switch checked={checked} onCheckedChange={setChecked} />
    </>
  )
}
