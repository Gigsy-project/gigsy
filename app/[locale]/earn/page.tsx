"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, User, MapPin, CreditCard } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function EarnPage() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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

  const days = [
    { id: "monday", label: t("days.monday") },
    { id: "tuesday", label: t("days.tuesday") },
    { id: "wednesday", label: t("days.wednesday") },
    { id: "thursday", label: t("days.thursday") },
    { id: "friday", label: t("days.friday") },
    { id: "saturday", label: t("days.saturday") },
    { id: "sunday", label: t("days.sunday") },
  ]

  const stepTitles = ["Cuéntanos sobre ti", "Tu ubicación y disponibilidad", "Información de pago"]

  return (
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
                  <h2 className="text-lg font-semibold mb-4">Ofrecer servicios</h2>
                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-3 p-2 rounded ${currentStep === 1 ? "bg-primary text-white" : "text-muted-foreground"}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 1 ? "bg-white text-primary" : "bg-muted"}`}
                      >
                        <User className="h-3 w-3" />
                      </div>
                      <span className="text-sm">Perfil</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 p-2 rounded ${currentStep === 2 ? "bg-primary text-white" : "text-muted-foreground"}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 2 ? "bg-white text-primary" : "bg-muted"}`}
                      >
                        <MapPin className="h-3 w-3" />
                      </div>
                      <span className="text-sm">Ubicación</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 p-2 rounded ${currentStep === 3 ? "bg-primary text-white" : "text-muted-foreground"}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 3 ? "bg-white text-primary" : "bg-muted"}`}
                      >
                        <CreditCard className="h-3 w-3" />
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
                    {/* Step 1: Profile */}
                    {currentStep === 1 && (
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">¿Qué servicios ofreces?</h2>
                          <p className="text-muted-foreground">Describe los servicios que puedes proporcionar</p>
                          <Textarea
                            placeholder="ej. Plomería, electricidad, limpieza, jardinería, mudanzas..."
                            className="min-h-[150px] text-base p-4"
                          />
                        </div>

                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">Cuéntanos sobre tu experiencia</h2>
                          <Textarea
                            placeholder="Describe tu experiencia, habilidades y cualquier certificación relevante..."
                            className="min-h-[120px] text-base p-4"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 2: Location & Availability */}
                    {currentStep === 2 && (
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">¿En qué área trabajas?</h2>
                          <Input
                            placeholder="ej. Santiago Centro, Providencia, Las Condes..."
                            className="text-base p-4 h-12"
                          />
                        </div>

                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">¿Cuándo estás disponible?</h2>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {days.map((day) => (
                              <Button key={day.id} variant="outline" className="justify-start h-12" type="button">
                                {day.label}
                              </Button>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-6 mt-6">
                            <div className="space-y-2">
                              <Label>Hora de inicio</Label>
                              <Select>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((hour) => (
                                    <SelectItem key={hour} value={hour.toString()}>
                                      {hour}:00
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Hora de fin</Label>
                              <Select>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((hour) => (
                                    <SelectItem key={hour} value={hour.toString()}>
                                      {hour}:00
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Payment */}
                    {currentStep === 3 && (
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">Información bancaria</h2>
                          <p className="text-muted-foreground">Para recibir tus pagos de forma segura</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label>Banco</Label>
                              <Select>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Seleccionar banco" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="santander">Santander</SelectItem>
                                  <SelectItem value="estado">Banco Estado</SelectItem>
                                  <SelectItem value="chile">Banco de Chile</SelectItem>
                                  <SelectItem value="bci">BCI</SelectItem>
                                  <SelectItem value="scotiabank">Scotiabank</SelectItem>
                                  <SelectItem value="itau">Itaú</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Tipo de cuenta</Label>
                              <Select>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="corriente">Cuenta Corriente</SelectItem>
                                  <SelectItem value="vista">Cuenta Vista</SelectItem>
                                  <SelectItem value="ahorro">Cuenta de Ahorro</SelectItem>
                                  <SelectItem value="rut">Cuenta RUT</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Número de cuenta</Label>
                              <Input placeholder="ej. 123456789" className="h-12" />
                            </div>
                            <div className="space-y-2">
                              <Label>RUT</Label>
                              <Input placeholder="ej. 12.345.678-9" className="h-12" />
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
                          Crear perfil
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
              <h2 className="text-2xl font-bold mb-4">{t("success.earn")}</h2>
              <p className="text-muted-foreground">
                Mientras tanto, puedes completar tu perfil y configurar tus preferencias para recibir notificaciones de
                trabajos que se ajusten a tus habilidades.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <a href="/profile">{t("button.complete")}</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
