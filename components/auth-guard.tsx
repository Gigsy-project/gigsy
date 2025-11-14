"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, usePathname } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  allowGuest?: boolean
}

export function AuthGuard({ children, requireAuth = true, redirectTo = "/login", allowGuest = false }: AuthGuardProps) {
  const { status, isLoggedIn, isGuest } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "loading") return

    if (requireAuth && !isLoggedIn && (!allowGuest || !isGuest)) {
      router.push(`${redirectTo}?returnUrl=${encodeURIComponent(pathname)}`)
    }
  }, [status, isLoggedIn, isGuest, requireAuth, redirectTo, router, pathname, allowGuest])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (requireAuth && !isLoggedIn && (!allowGuest || !isGuest)) {
    return null
  }

  return <>{children}</>
}
