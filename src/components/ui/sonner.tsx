"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-lsr-charcoal group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg group-[.toaster]:font-sans",
          title: "group-[.toast]:font-bold",
          description: "group-[.toast]:text-white/60",
          actionButton:
            "group-[.toast]:bg-lsr-orange group-[.toast]:text-white group-[.toast]:font-bold",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-white/60",
          success: "group-[.toaster]:border-green-500/50",
          error: "group-[.toaster]:border-red-500/50",
        },
      }}
      {...props}
    />
  );
}
