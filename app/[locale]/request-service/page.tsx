"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/file-upload"
import { es } from "date-fns/locale"
import { CreditCard, ArrowLeft, ArrowRight, Sun, Clock, Sunset, Moon } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth-guard"

export default function RequestServicePage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const { status, isLoggedIn, isGuest, startRegistration } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [date, setDate] = useState<Date>()
  const [submitted, setSubmitted] = useState(false)
  const [locationType, setLocationType] = useState<"presencial" | "online">("presencial")
  const [timePreference, setTimePreference] = useState<string>("")
  const [needSpecificTime, setNeedSpecificTime] = useState(false)

  // Redirect to registration if not logged in and not guest
  useEffect(() => {
    if (status !== "loading" && !isLoggedIn && !isGuest) {
      startRegistration("/request-service")
    }
  }, [status, isLoggedIn, isGuest, startRegistration])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // If guest, redirect to complete registration
    if (isGuest) {
      startRegistration("/request-service")
      return
    }

    setSubmitted(true)
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Get locale for date formatting based on selected language
  const getLocale = () => {
    switch (language) {
      case "en":
        return undefined // Default locale
      case "es":
        return es
      case "pt":
        return undefined // Use default for now, add Portuguese locale if needed
      default:
        return undefined
    }
  }

  const timeOptions = [
    { id: "morning", label: "Mañana", subtitle: "Antes de 10am", icon: Sun },
    { id: "midday", label: "Mediodía", subtitle: "10am - 2pm", icon: Clock },
    { id: "afternoon", label: "Tarde", subtitle: "2pm - 6pm", icon: Sunset },
    { id: "evening", label: "Noche", subtitle: "Después de 6pm", icon: Moon },
  ]

  const stepTitles = ["Comencemos con lo básico", "Presupuesto y descripción", "Pago seguro"]

  // Show loading state while checking auth
  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <AuthGuard allowGuest={true}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container max-w-4xl">
            <div className="mb-6">
              <Link href="/" className="flex items-center text-primary hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("nav.home")}
              </Link>
            </div>

            {!submitted ? (
              <div className="flex gap-8">
                {/* Left Sidebar - Steps Navigation */}
                <div className="w-64 flex-shrink-0">
                  <div className="bg-white rounded-lg border p-4">
                    <h2 className="text-lg font-semibold mb-4">Publicar una tarea</h2>
                    <div className="space-y-3">
                      <div
                        className={`flex items-center gap-3 p-2 rounded ${currentStep === 1 ? "bg-primary text-white" : "text-muted-foreground"}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 1 ? "bg-white text-primary" : "bg-muted"}`}
                        >
                          1
                        </div>
                        <span className="text-sm">Título y Fecha</span>
                      </div>
                      <div
                        className={`flex items-center gap-3 p-2 rounded ${currentStep === 2 ? "bg-primary text-white" : "text-muted-foreground"}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 2 ? "bg-white text-primary" : "bg-muted"}`}
                        >
                          2
                        </div>
                        <span className="text-sm">Presupuesto y descripción</span>
                      </div>
                      <div
                        className={`flex items-center gap-3 p-2 rounded ${currentStep === 3 ? "bg-primary text-white" : "text-muted-foreground"}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 3 ? "bg-white text-primary" : "bg-muted"}`}
                        >
                          3
                        </div>
                        <span className="text-sm">Pago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  <div className="bg-white rounded-lg border p-8">
                    <h1 className="text-3xl font-bold text-center mb-8 text-primary">{stepTitles[currentStep - 1]}</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Step 1: Basics */}
                      {currentStep === 1 && (
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <h2 className="text-xl font-semibold">En pocas palabras, ¿qué necesitas que se haga?</h2>
                            <Input placeholder="ej. Ayuda para mover mi sofá" className="text-lg p-4 h-14" />
                          </div>

                          <div className="space-y-4">
                            <h2 className="text-xl font-semibold">¿Cuándo necesitas que se haga esto?</h2>
                            <div className="flex gap-4">
                              <Button type="button" variant="outline" className="rounded-full px-6">
                                En fecha ▼
                              </Button>
                              <Button type="button" variant="outline" className="rounded-full px-6">
                                Antes de fecha ▼
                              </Button>
                              <Button type="button" variant="default" className="rounded-full px-6 bg-primary">
                                Soy flexible
                              </Button>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                              <input
                                type="checkbox"
                                id="specific-time"
                                checked={needSpecificTime}
                                onChange={(e) => setNeedSpecificTime(e.target.checked)}
                                className="w-4 h-4 text-primary"
                              />
                              <Label htmlFor="specific-time">Necesito una hora específica del día</Label>
                            </div>

                            {needSpecificTime && (
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                                {timeOptions.map((option) => {
                                  const IconComponent = option.icon
                                  return (
                                    <button
                                      key={option.id}
                                      type="button"
                                      onClick={() => setTimePreference(option.id)}
                                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                                        timePreference === option.id
                                          ? "border-primary bg-primary text-white"
                                          : "border-gray-200 hover:border-gray-300"
                                      }`}
                                    >
                                      <IconComponent className="h-8 w-8 mx-auto mb-2" />
                                      <div className="font-medium">{option.label}</div>
                                      <div className="text-sm opacity-75">{option.subtitle}</div>
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Step 2: Budget + Description */}
                      {currentStep === 2 && (
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <h2 className="text-xl font-semibold">¿Cuál es tu presupuesto?</h2>
                            <p className="text-muted-foreground">Siempre puedes negociar el precio final.</p>
                            <div className="relative max-w-md">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-medium">$</span>
                              <Input type="number" className="pl-12 text-xl p-4 h-14" placeholder="5" />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Describe lo que necesitas</h2>
                            <Textarea
                              placeholder="Describe con detalle qué necesitas, incluye toda la información relevante para que puedan ayudarte mejor."
                              className="min-h-[200px] text-base p-4"
                            />
                          </div>

                          <div className="space-y-4">
                            <Label>{t("request.place")}</Label>
                            <RadioGroup
                              value={locationType}
                              onValueChange={(value) => setLocationType(value as "presencial" | "online")}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="presencial" id="presencial" />
                                <Label htmlFor="presencial">{t("request.presential")}</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="online" id="online" />
                                <Label htmlFor="online">{t("request.online")}</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {locationType === "presencial" && (
                            <div className="space-y-2">
                              <Label htmlFor="address">{t("form.address")}</Label>
                              <Input id="address" placeholder="Calle, número, comuna, ciudad" />
                            </div>
                          )}

                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Agregar imágenes <span className="text-muted-foreground">(opcional)</span>
                            </h3>
                            <FileUpload label="" multiple={true} accept="image/*,video/*" onChange={() => {}} />
                          </div>
                        </div>
                      )}

                      {/* Step 3: Payment */}
                      {currentStep === 3 && (
                        <div className="space-y-8">
                          <div className="text-center space-y-4">
                            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                              <CreditCard className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-semibold">Pago seguro</h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                              Tu solicitud será publicada después de confirmar el pago. Solo pagarás cuando el trabajo
                              esté completado.
                            </p>
                          </div>

                          <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Costo de publicación</span>
                              <span className="text-xl font-bold">$2.990</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <span>Incluye comisión de servicio</span>
                              <span>IVA incluido</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="font-medium">Método de pago</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <button className="p-4 border-2 border-primary bg-primary/5 rounded-lg flex items-center gap-3">
                                <CreditCard className="h-6 w-6 text-primary" />
                                <div className="text-left">
                                  <div className="font-medium">Tarjeta de crédito/débito</div>
                                  <div className="text-sm text-muted-foreground">Visa, Mastercard, etc.</div>
                                </div>
                              </button>
                              <button className="p-4 border-2 border-gray-200 rounded-lg flex items-center gap-3 hover:border-gray-300">
                                <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                  T
                                </div>
                                <div className="text-left">
                                  <div className="font-medium">Transferencia bancaria</div>
                                  <div className="text-sm text-muted-foreground">Pago directo</div>
                                </div>
                              </button>
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex gap-3">
                              <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium text-blue-900">Pago protegido</div>
                                <div className="text-blue-700">
                                  Tu dinero está seguro. Solo pagas cuando el trabajo esté completado a tu satisfacción.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex justify-between pt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentStep === 1}
                          className="flex items-center gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Anterior
                        </Button>

                        {currentStep < 3 ? (
                          <Button type="button" onClick={handleNext} className="flex items-center gap-2">
                            Siguiente
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button type="submit" className="flex items-center gap-2">
                            {isGuest ? "Completar registro para publicar" : "Publicar tarea"}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="mb-6 mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">{t("success.help")}</h2>
                <div className="mt-8 p-6 border rounded-lg bg-muted/30">
                  <h3 className="text-lg font-medium mb-4">{t("payment.title")}</h3>
                  <Button className="w-full flex items-center justify-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {t("payment.button")}
                  </Button>
                  <p className="mt-4 text-sm text-muted-foreground">{t("payment.secure")}</p>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  )
}
