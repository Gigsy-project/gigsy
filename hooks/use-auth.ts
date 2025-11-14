"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

export type AuthStatus = "authenticated" | "guest" | "unauthenticated" | "loading"
export type RegistrationStep = "basic" | "contact" | "verification" | "complete"

export interface AuthState {
  status: AuthStatus
  isLoggedIn: boolean
  isGuest: boolean
  isLoading: boolean
  registrationStep: RegistrationStep | null
  pendingAction: string | null
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    status: "loading",
    isLoggedIn: false,
    isGuest: false,
    isLoading: true,
    registrationStep: null,
    pendingAction: null,
  })
  const router = useRouter()

  const checkAuth = useCallback(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const isGuest = localStorage.getItem("isGuest") === "true"
    const registrationStep = localStorage.getItem("registrationStep") as RegistrationStep | null
    const pendingAction = localStorage.getItem("pendingAction")

    setAuthState({
      status: isLoggedIn ? "authenticated" : isGuest ? "guest" : "unauthenticated",
      isLoggedIn,
      isGuest,
      isLoading: false,
      registrationStep,
      pendingAction,
    })
  }, [])

  const login = useCallback(() => {
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("isGuest", "false")
    localStorage.removeItem("registrationStep")
    localStorage.removeItem("pendingAction")

    setAuthState({
      status: "authenticated",
      isLoggedIn: true,
      isGuest: false,
      isLoading: false,
      registrationStep: null,
      pendingAction: null,
    })
    window.dispatchEvent(new Event("storage"))
  }, [])

  const logout = useCallback(() => {
    localStorage.setItem("isLoggedIn", "false")
    localStorage.setItem("isGuest", "false")
    localStorage.removeItem("registrationStep")
    localStorage.removeItem("pendingAction")

    setAuthState({
      status: "unauthenticated",
      isLoggedIn: false,
      isGuest: false,
      isLoading: false,
      registrationStep: null,
      pendingAction: null,
    })
    window.dispatchEvent(new Event("storage"))
  }, [])

  const continueAsGuest = useCallback(() => {
    localStorage.setItem("isGuest", "true")
    localStorage.setItem("isLoggedIn", "false")

    setAuthState({
      status: "guest",
      isLoggedIn: false,
      isGuest: true,
      isLoading: false,
      registrationStep: null,
      pendingAction: null,
    })
    window.dispatchEvent(new Event("storage"))
  }, [])

  const startRegistration = useCallback(
    (pendingAction?: string) => {
      localStorage.setItem("registrationStep", "basic")
      if (pendingAction) {
        localStorage.setItem("pendingAction", pendingAction)
      }

      setAuthState((prev) => ({
        ...prev,
        registrationStep: "basic",
        pendingAction: pendingAction || prev.pendingAction,
      }))

      router.push("/register?step=basic")
    },
    [router],
  )

  const updateRegistrationStep = useCallback((step: RegistrationStep) => {
    localStorage.setItem("registrationStep", step)

    setAuthState((prev) => ({
      ...prev,
      registrationStep: step,
    }))
  }, [])

  const completeRegistration = useCallback(() => {
    login()
    const pendingAction = localStorage.getItem("pendingAction")
    localStorage.removeItem("pendingAction")
    localStorage.removeItem("registrationStep")

    if (pendingAction) {
      router.push(pendingAction)
    } else {
      router.push("/browse-services")
    }
  }, [login, router])

  useEffect(() => {
    checkAuth()
    window.addEventListener("storage", checkAuth)
    return () => window.removeEventListener("storage", checkAuth)
  }, [checkAuth])

  return {
    ...authState,
    login,
    logout,
    continueAsGuest,
    startRegistration,
    updateRegistrationStep,
    completeRegistration,
  }
}
