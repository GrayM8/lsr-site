"use client"

import { Button } from "@/components/ui/button"

export function ConfirmSubmitButton({
                                      message,
                                      children,
                                      ...props
                                    }: {
  message: string
  children: React.ReactNode
} & React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      onClick={(e) => {
        if (!confirm(message)) {
          e.preventDefault()
        }
      }}
    >
      {children}
    </Button>
  )
}
