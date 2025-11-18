"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ExternalLink, Upload, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GoogleIcon } from "@/components/icons/google-icon"
import { AppleIcon } from "@/components/icons/apple-icon"
import { useAuth, type RegistrationStep } from "@/hooks/use-auth"

export default function RegisterPage() {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updateRegistrationStep, completeRegistration, registrationStep: savedStep, pendingAction } = useAuth()

  // Get step from URL or from auth state
  const stepParam = searchParams.get("step") as RegistrationStep | null
  const [step, setStep] = useState<number>(
    stepParam === "basic"
      ? 1
      : stepParam === "contact"
        ? 2
        : stepParam === "verification"
          ? 3
          : savedStep === "basic"
            ? 1
            : savedStep === "contact"
              ? 2
              : savedStep === "verification"
                ? 3
                : 1,
  )

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    profilePhoto: null,
    idFront: null,
    idBack: null,
    backgroundCheck: null,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSocialRegister = (provider: "google" | "apple") => {
    console.log(`Register with ${provider}`)
    updateRegistrationStep("contact")
    setStep(2)
  }

  const handleNext = () => {
    if (step === 1) {
      updateRegistrationStep("contact")
    } else if (step === 2) {
      updateRegistrationStep("verification")
    }

    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    if (step === 2) {
      updateRegistrationStep("basic")
    } else if (step === 3) {
      updateRegistrationStep("contact")
    }

    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    completeRegistration()
  }

  // Update URL when step changes
  useEffect(() => {
    const stepName = step === 1 ? "basic" : step === 2 ? "contact" : "verification"
    const url = `/register?step=${stepName}`
    window.history.replaceState({}, "", url)
  }, [step])

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="container max-w-md mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">{t("register.title")}</h1>
        <p className="text-center text-muted-foreground mb-8">
          {pendingAction ? t("register.completeToContinue") : t("register.subtitle")}
        </p>

        <div className="bg-card rounded-lg shadow-sm border p-6">
            <div className="flex justify-between mb-8">
              <div className={cn("flex flex-col items-center", step >= 1 ? "text-primary" : "text-muted-foreground")}>
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center mb-2 border-2",
                    step >= 1 ? "border-primary bg-primary text-primary-foreground" : "border-muted",
                  )}
                >
                  1
                </div>
                <span className="text-xs">{t("register.step1")}</span>
              </div>
              <div className="flex-1 flex items-center justify-center px-2">
                <div className={cn("h-0.5 w-full", step >= 2 ? "bg-primary" : "bg-muted")} />
              </div>
              <div className={cn("flex flex-col items-center", step >= 2 ? "text-primary" : "text-muted-foreground")}>
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center mb-2 border-2",
                    step >= 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted",
                  )}
                >
                  2
                </div>
                <span className="text-xs">{t("register.step2")}</span>
              </div>
              <div className="flex-1 flex items-center justify-center px-2">
                <div className={cn("h-0.5 w-full", step >= 3 ? "bg-primary" : "bg-muted")} />
              </div>
              <div className={cn("flex flex-col items-center", step >= 3 ? "text-primary" : "text-muted-foreground")}>
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center mb-2 border-2",
                    step >= 3 ? "border-primary bg-primary text-primary-foreground" : "border-muted",
                  )}
                >
                  3
                </div>
                <span className="text-xs">{t("register.step3")}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("form.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("register.emailPlaceholder")}
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">{t("form.password")}</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t("form.confirmPassword")}</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="********"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">{t("register.orSignUpWithSocial")}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => handleSocialRegister("google")}
                    >
                      <GoogleIcon className="h-5 w-5" />
                      {t("register.continueWithGoogle")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => handleSocialRegister("apple")}
                    >
                      <AppleIcon className="h-5 w-5" />
                      {t("register.continueWithApple")}
                    </Button>
                  </div>

                  <div className="flex justify-between mt-6">
                    {pendingAction && (
                      <Button type="button" variant="ghost" onClick={() => router.push("/")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t("button.back")}
                      </Button>
                    )}
                    <div className="ml-auto">
                      <Button type="button" onClick={handleNext}>
                        {t("button.continue")}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t("register.firstName")}</Label>
                      <Input
                        id="firstName"
                        placeholder={t("register.firstNamePlaceholder")}
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t("register.lastName")}</Label>
                      <Input
                        id="lastName"
                        placeholder={t("register.lastNamePlaceholder")}
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("form.phone")}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={t("register.phonePlaceholder")}
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">{t("form.address")}</Label>
                      <Input
                        id="address"
                        placeholder={t("register.addressPlaceholder")}
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">{t("register.city")}</Label>
                      <Input
                        id="city"
                        placeholder={t("register.cityPlaceholder")}
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={handlePrevious}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t("button.back")}
                    </Button>
                    <Button type="button" onClick={handleNext}>
                      {t("button.continue")}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {/* Foto de perfil */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">{t("form.profile")}</Label>
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-24 h-24 border-2 border-dashed border-muted rounded-full flex items-center justify-center bg-muted/10">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <Button type="button" variant="outline" size="sm">
                        {t("register.uploadPhoto")}
                      </Button>
                    </div>
                  </div>

                  {/* Foto de cédula (frente) */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">{t("register.idFront")}</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center bg-muted/10">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{t("register.uploadClickOrDrag")}</p>
                    </div>
                  </div>

                  {/* Foto de cédula (reverso) */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">{t("register.idBack")}</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center bg-muted/10">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{t("register.uploadClickOrDrag")}</p>
                    </div>
                  </div>

                  {/* Certificado de antecedentes */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">{t("form.criminal")}</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center bg-muted/10">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">{t("register.uploadFile")}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("register.uploadDragOrClick")}
                      </p>
                    </div>
                    <Alert>
                      <AlertDescription>
                        <Link
                          href="https://www.chileatiende.gob.cl/fichas/3442-certificado-de-antecedentes"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-primary hover:underline"
                        >
                          {t("register.getCertificateLink")}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={handlePrevious}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t("button.back")}
                    </Button>
                    <Button type="submit">{pendingAction ? t("register.completeAndContinue") : t("register.createAccount")}</Button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-6 text-center text-sm">
              {t("register.alreadyHaveAccount")}{" "}
              <Link href="/login" className="text-primary hover:underline">
                {t("button.login")}
              </Link>
            </div>
          </div>
        </div>
    </main>
  )
}
