"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Provider } from "@/lib/types" // Import the shared Provider type

interface ServiceBookingModalProps {
  provider: Provider // Use the shared Provider type
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ServiceBookingModal({ provider, isOpen, onClose, onSuccess }: ServiceBookingModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [bookingData, setBookingData] = useState({
    serviceType: "",
    customService: "",
    description: "",
    date: "",
    time: "",
    timePreference: "",
    location: "",
    address: "",
    budget: "",
    duration: "",
    urgency: "normal",
    contactPhone: "",
    additionalNotes: "",
    agreedToTerms: false,
  })

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ]

  const timePreferences = [
    { value: "morning", label: "Mañana (8:00 - 12:00)", icon: "🌅" },
    { value: "afternoon", label: "Tarde (12:00 - 18:00)", icon: "☀️" },
    { value: "evening", label: "Noche (18:00 - 22:00)", icon: "🌙" },
    { value: "flexible", label: "Flexible", icon: "⏰" },
  ]

  const urgencyLevels = [
    { value: "low", label: "No es urgente", description: "Puedo esperar varios días" },
    { value: "normal", label: "Normal", description: "En los próximos 2-3 días" },
    { value: "high", label: "Urgente", description: "Necesito el servicio hoy o mañana" },
  ]

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    if (!bookingData.agreedToTerms) {
      alert("Debes aceptar los términos y condiciones")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would send the booking data to the backend
      console.log("Booking submitted:", {
        providerId: provider.id,
        providerName: provider.name,
        ...bookingData,
        selectedDate: selectedDate?.toISOString(),
      })

      alert("¡Reserva enviada exitosamente! El proveedor recibirá tu solicitud y te contactará pronto.")
      onSuccess()
    } catch (error) {
      alert("Error al enviar la reserva. Intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStep1Valid = bookingData.serviceType && bookingData.description
  const isStep2Valid = selectedDate && (bookingData.time || bookingData.timePreference) && bookingData.location
  const isStep3Valid = bookingData.budget && bookingData.contactPhone && bookingData.agreedToTerms

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reservar servicio con {provider.name}
          </DialogTitle>
          <DialogDescription>Completa los siguientes pasos para solicitar un servicio</DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  step >= stepNumber ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && <div className={cn("w-16 h-1 mx-2", step > stepNumber ? "bg-primary" : "bg-muted")} />}
            </div>
          ))}
        </div>

        {/* Step 1: Service Details */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">¿Qué servicio necesitas?</h3>
              <p className="text-muted-foreground">Describe el trabajo que necesitas realizar</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="service-type">Tipo de servicio *</Label>
                <Select
                  value={bookingData.serviceType}
                  onValueChange={(value) => setBookingData((prev) => ({ ...prev, serviceType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {provider.services.map((service, index) => (
                      <SelectItem key={index} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Otro servicio personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {bookingData.serviceType === "custom" && (
                <div>
                  <Label htmlFor="custom-service">Especifica el servicio *</Label>
                  <Input
                    id="custom-service"
                    placeholder="Ej: Instalación de estanterías"
                    value={bookingData.customService}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, customService: e.target.value }))}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="description">Descripción detallada *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe específicamente qué necesitas, materiales requeridos, tamaño del trabajo, etc."
                  className="min-h-[120px]"
                  value={bookingData.description}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="duration">Duración estimada</Label>
                <Select
                  value={bookingData.duration}
                  onValueChange={(value) => setBookingData((prev) => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="¿Cuánto tiempo crees que tomará?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2h">1-2 horas</SelectItem>
                    <SelectItem value="2-4h">2-4 horas</SelectItem>
                    <SelectItem value="4-8h">4-8 horas (día completo)</SelectItem>
                    <SelectItem value="multiple">Varios días</SelectItem>
                    <SelectItem value="unknown">No estoy seguro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Date, Time & Location */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">¿Cuándo y dónde?</h3>
              <p className="text-muted-foreground">Selecciona fecha, hora y ubicación</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Selection */}
              <div className="space-y-4">
                <div>
                  <Label>Fecha preferida *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Selecciona una fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Hora específica</Label>
                  <Select
                    value={bookingData.time}
                    onValueChange={(value) => setBookingData((prev) => ({ ...prev, time: value, timePreference: "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-center text-sm text-muted-foreground">o</div>

                <div>
                  <Label>Preferencia de horario</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {timePreferences.map((pref) => (
                      <Button
                        key={pref.value}
                        variant={bookingData.timePreference === pref.value ? "default" : "outline"}
                        className="justify-start h-auto p-3"
                        onClick={() =>
                          setBookingData((prev) => ({
                            ...prev,
                            timePreference: pref.value,
                            time: "",
                          }))
                        }
                      >
                        <span className="mr-2">{pref.icon}</span>
                        <div className="text-left">
                          <div className="font-medium">{pref.label}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="location">Ubicación del servicio *</Label>
                  <Select
                    value={bookingData.location}
                    onValueChange={(value) => setBookingData((prev) => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="¿Dónde se realizará?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="my-place">En mi domicilio</SelectItem>
                      <SelectItem value="provider-place">En el local del proveedor</SelectItem>
                      <SelectItem value="other">Otra ubicación</SelectItem>
                      <SelectItem value="remote">Servicio remoto/online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(bookingData.location === "my-place" || bookingData.location === "other") && (
                  <div>
                    <Label htmlFor="address">Dirección específica *</Label>
                    <Textarea
                      id="address"
                      placeholder="Ingresa la dirección completa, referencias, número de departamento, etc."
                      value={bookingData.address}
                      onChange={(e) => setBookingData((prev) => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                )}

                <div>
                  <Label>Urgencia del servicio</Label>
                  <div className="space-y-2 mt-2">
                    {urgencyLevels.map((level) => (
                      <Button
                        key={level.value}
                        variant={bookingData.urgency === level.value ? "default" : "outline"}
                        className="w-full justify-start h-auto p-3"
                        onClick={() => setBookingData((prev) => ({ ...prev, urgency: level.value }))}
                      >
                        <div className="text-left">
                          <div className="font-medium">{level.label}</div>
                          <div className="text-sm opacity-70">{level.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Budget & Contact */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Presupuesto y contacto</h3>
              <p className="text-muted-foreground">Información final para completar tu solicitud</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget">Presupuesto estimado (CLP) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input
                      id="budget"
                      type="number"
                      className="pl-8"
                      placeholder="25000"
                      value={bookingData.budget}
                      onChange={(e) => setBookingData((prev) => ({ ...prev, budget: e.target.value }))}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Este es un presupuesto inicial. El precio final se acordará con el proveedor.
                  </p>
                </div>

                <div>
                  <Label htmlFor="contact-phone">Teléfono de contacto *</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="+56 9 1234 5678"
                    value={bookingData.contactPhone}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="additional-notes">Notas adicionales</Label>
                  <Textarea
                    id="additional-notes"
                    placeholder="Cualquier información adicional que consideres importante..."
                    value={bookingData.additionalNotes}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                  />
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Resumen de tu solicitud:</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Servicio:</strong>{" "}
                      {bookingData.serviceType === "custom" ? bookingData.customService : bookingData.serviceType}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "No seleccionada"}
                    </p>
                    <p>
                      <strong>Hora:</strong> {bookingData.time || bookingData.timePreference || "No especificada"}
                    </p>
                    <p>
                      <strong>Ubicación:</strong> {bookingData.location || "No especificada"}
                    </p>
                    <p>
                      <strong>Presupuesto:</strong> ${bookingData.budget} CLP
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <Checkbox
                id="terms"
                checked={bookingData.agreedToTerms}
                onCheckedChange={(checked) =>
                  setBookingData((prev) => ({ ...prev, agreedToTerms: checked as boolean }))
                }
              />
              <Label htmlFor="terms" className="text-sm">
                Acepto los términos y condiciones de AidMarkt y autorizo el procesamiento de mis datos personales
              </Label>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Anterior
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            {step < 3 ? (
              <Button onClick={handleNext} disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}>
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!isStep3Valid || isSubmitting}>
                {isSubmitting ? "Enviando solicitud..." : "Enviar solicitud"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
