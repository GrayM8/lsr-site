"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Activity, Loader2 } from "lucide-react"

export function LiveTailButton() {
  const [isLive, setIsLive] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      router.refresh()
      setLastRefreshed(new Date())
    }, 3000) // 3 seconds poll

    return () => clearInterval(interval)
  }, [isLive, router])

  return (
    <div className="flex items-center gap-2">
        {isLive && lastRefreshed && (
            <span className="text-xs text-muted-foreground animate-pulse">
                Updated {lastRefreshed.toLocaleTimeString()}
            </span>
        )}
        <Button
          variant={isLive ? "destructive" : "outline"}
          onClick={() => setIsLive(!isLive)}
          className={isLive ? "animate-pulse" : ""}
        >
          {isLive ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity className="mr-2 h-4 w-4" />}
          {isLive ? "Live" : "Go Live"}
        </Button>
    </div>
  )
}
