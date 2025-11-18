"use client"

import type React from "react"

import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { GoogleIcon } from "@/components/icons/google-icon"
import { AppleIcon } from "@/components/icons/apple-icon"

export default function LoginPage() {
  const t = useTranslations()
  const router = useRouter()

  const handleSocialLogin = (provider: "google" | "apple") => {
    // Simulate social login
    console.log(`Login with ${provider}`)
    localStorage.setItem("isLoggedIn", "true")
    window.dispatchEvent(new Event("storage"))
    router.push("/")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("isLoggedIn", "true")
    window.dispatchEvent(new Event("storage"))
    router.push("/")
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="container max-w-md mx-auto w-full">
        <Card>
          <CardHeader className="space-y-1 flex justify-center">
            <Logo width={60} height={60} />
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("form.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  required
                />
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
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {t("button.login")}
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
              >
                <GoogleIcon className="h-5 w-5" />
                {t("login.continueWithGoogle")}
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin("apple")}
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
  );
}
