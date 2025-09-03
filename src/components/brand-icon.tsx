import type { SimpleIcon } from "simple-icons"

/**
 * Small wrapper so Simple Icons behave like your Lucide icons.
 * Inherits the current text color (set with Tailwind).
 */
export function BrandIcon({
                            icon,
                            label,
                            className,
                          }: {
  icon: SimpleIcon
  label?: string
  className?: string
}) {
  return (
    <svg
      role="img"
      aria-label={label ?? icon.title}
      viewBox="0 0 24 24"
      className={className}
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  )
}
