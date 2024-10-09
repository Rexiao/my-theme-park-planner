import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>
      <Link
        href="/itineraries"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Itineraries
      </Link>
      <Link
        href="/login"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Login
      </Link>
    </nav>
  )
}
