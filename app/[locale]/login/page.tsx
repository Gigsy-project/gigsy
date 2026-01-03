"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from 'next-intl';
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from '@/i18n/navigation';
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { GoogleIcon } from "@/components/icons/google-icon"
import { AppleIcon } from "@/components/icons/apple-icon"
import { authClient } from "@/lib/auth-client";

const { signIn } = authClient;

export default function LoginPage() {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams();
  const { useSession } = authClient;
  const { data: session, isPending } = useSession();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  // Get redirect URL from query params or default to /browse-services
  const redirectTo = searchParams.get("redirect") || "/browse-services"

  // Si hay sesión, no mostrar nada (se está redirigiendo)
  if (session?.user) {
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const result = await signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: rememberMe,
      })

      if (result.error) {
        console.error("Sign in error:", result.error)
        setErrors({
          general:
            "Credenciales inválidas. Por favor verifica tu email y contraseña.",
        })
      } else {
        // Login exitoso, redirigir a la página solicitada
        router.push(redirectTo)
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setErrors({ general: "Error al iniciar sesión. Inténtalo de nuevo." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: "google" | "apple") => {
    // Simulate social login - aquí puedes implementar la lógica de social login de better-auth
    console.log(`Login with ${provider}`)
    // TODO: Implementar social login con better-auth
    localStorage.setItem("isLoggedIn", "true")
    window.dispatchEvent(new Event("storage"))
    router.push(redirectTo)
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  // Loading state while checking session
  if (isPending) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="container max-w-md mx-auto w-full">
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="container max-w-md mx-auto w-full">
        <Card>
          <CardHeader className="space-y-1 flex justify-center">
            <Logo width={60} height={60} />
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              {errors.general && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {errors.general}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t("form.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isLoading}
                  required
                  className={cn(
                    errors.email && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("form.password")}</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="********"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    disabled={isLoading}
                    required
                    className={cn(
                      "pr-10",
                      errors.password && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember-me" className="text-sm">
                  Recordarme
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  t("button.login")
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {t("login.orContinueWithSocial")}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
              >
                <GoogleIcon className="h-5 w-5" />
                {t("login.continueWithGoogle")}
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin("apple")}
                disabled={isLoading}
              >
                <AppleIcon className="h-5 w-5" />
                {t("login.continueWithApple")}
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              {t("login.noAccount")}{" "}
              <Link href="/register" className="text-primary hover:underline">
                {t("button.register")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
