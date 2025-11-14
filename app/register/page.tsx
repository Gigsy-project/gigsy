"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ExternalLink, Upload, ArrowLeft, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GoogleIcon } from "@/components/icons/google-icon"
import { AppleIcon } from "@/components/icons/apple-icon"
import { useAuth, type RegistrationStep } from "@/hooks/use-auth"

export default function RegisterPage() {
  const { t } = useLanguage()
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">{t("register.title")}</h1>
          <p className="text-center text-muted-foreground mb-8">
            {pendingAction ? "Complete su registro para continuar" : t("register.subtitle")}
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
                <span className="text-xs">Información básica</span>
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
                <span className="text-xs">Contacto</span>
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
                <span className="text-xs">Verificación</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">O regístrate con</span>
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
                      Continuar con Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => handleSocialRegister("apple")}
                    >
                      <AppleIcon className="h-5 w-5" />
                      Continuar con Apple
                    </Button>
                  </div>

                  <div className="flex justify-between mt-6">
                    {pendingAction && (
                      <Button type="button" variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                      </Button>
                    )}
                    <div className="ml-auto">
                      <Button type="button" onClick={handleNext}>
                        Continuar
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
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        placeholder="Tu nombre"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        placeholder="Tu apellido"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        placeholder="Tu dirección"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        placeholder="Tu ciudad"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={handlePrevious}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Atrás
                    </Button>
                    <Button type="button" onClick={handleNext}>
                      Continuar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {/* Foto de perfil */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Foto de perfil</Label>
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-24 h-24 border-2 border-dashed border-muted rounded-full flex items-center justify-center bg-muted/10">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <Button type="button" variant="outline" size="sm">
                        Subir foto
                      </Button>
                    </div>
                  </div>

                  {/* Foto de cédula (frente) */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Cédula de identidad (frente)</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center bg-muted/10">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Haz clic para subir o arrastra y suelta</p>
                    </div>
                  </div>

                  {/* Foto de cédula (reverso) */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Cédula de identidad (reverso)</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center bg-muted/10">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Haz clic para subir o arrastra y suelta</p>
                    </div>
                  </div>

                  {/* Certificado de antecedentes */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Certificado de antecedentes penales</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center bg-muted/10">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Subir archivo</p>
                      <p className="text-xs text-muted-foreground">
                        Arrastra y suelta un archivo aquí o haz clic para seleccionar
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
                          Obtén tu certificado de antecedentes gratis aquí
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={handlePrevious}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Atrás
                    </Button>
                    <Button type="submit">{pendingAction ? "Completar y continuar" : "Crear cuenta"}</Button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-6 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
