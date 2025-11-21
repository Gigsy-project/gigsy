"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/file-upload";
import { es } from "date-fns/locale";
import {
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Sun,
  Clock,
  Sunset,
  Moon,
  Calendar,
  MapPin,
  Monitor,
  Shield,
  Check,
  DollarSign,
  FileText,
  Camera,
  Star,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/date-picker";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AuthGuard } from "@/components/auth-guard";

export default function RequestServicePage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { status, isLoggedIn, isGuest, startRegistration } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [exactDate, setExactDate] = useState<Date>();
  const [beforeDate, setBeforeDate] = useState<Date>();
  const [datePreference, setDatePreference] = useState<
    "exact" | "before" | "flexible"
  >("flexible");
  const [submitted, setSubmitted] = useState(false);
  const [locationType, setLocationType] = useState<"presencial" | "online">(
    "presencial",
  );
  const [timePreference, setTimePreference] = useState<string>("");
  const [needSpecificTime, setNeedSpecificTime] = useState(false);

  // Redirect to registration if not logged in and not guest
  useEffect(() => {
    if (status !== "loading" && !isLoggedIn && !isGuest) {
      startRegistration("/request-service");
    }
  }, [status, isLoggedIn, isGuest, startRegistration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If guest, redirect to complete registration
    if (isGuest) {
      startRegistration("/request-service");
      return;
    }

    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get locale for date formatting based on selected language
  const getLocale = () => {
    switch (language) {
      case "en":
        return undefined; // Default locale
      case "es":
        return es;
      case "pt":
        return undefined; // Use default for now, add Portuguese locale if needed
      default:
        return undefined;
    }
  };

  const timeOptions = [
    { id: "morning", label: "Mañana", subtitle: "Antes de 10am", icon: Sun },
    { id: "midday", label: "Mediodía", subtitle: "10am - 2pm", icon: Clock },
    { id: "afternoon", label: "Tarde", subtitle: "2pm - 6pm", icon: Sunset },
    { id: "evening", label: "Noche", subtitle: "Después de 6pm", icon: Moon },
  ];

  const stepTitles = [
    "Comencemos con lo básico",
    "Presupuesto y descripción",
    "Pago seguro",
  ];

  // Show loading state while checking auth
  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div>Cargando...</div>
        </main>
      </div>
    );
  }

  return (
    <AuthGuard allowGuest={true}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 py-8">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Link>
            </div>

            {!submitted ? (
              <div className="flex gap-8">
                {/* Left Sidebar - Steps Navigation */}
                <div className="w-72 flex-shrink-0">
                  <div className="bg-card border rounded-lg p-6 sticky top-8">
                    <h2 className="text-xl font-semibold mb-6 text-foreground">
                      Publicar una tarea
                    </h2>
                    <div className="space-y-3">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                            currentStep === step
                              ? "bg-primary text-primary-foreground"
                              : currentStep > step
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted/50"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                              currentStep === step
                                ? "bg-primary-foreground text-primary"
                                : currentStep > step
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {currentStep > step ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              step
                            )}
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">
                              {step === 1 && "Información básica"}
                              {step === 2 && "Detalles del proyecto"}
                              {step === 3 && "Pago y confirmación"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  <div className="bg-card border rounded-lg p-8">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-semibold mb-2 text-foreground">
                        {stepTitles[currentStep - 1]}
                      </h1>
                      <div className="w-12 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Step 1: Basics */}
                      {currentStep === 1 && (
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <FileText className="h-5 w-5 text-primary" />
                              <h3 className="text-lg font-medium text-foreground">
                                ¿Qué necesitas que se haga?
                              </h3>
                            </div>
                            <p className="text-muted-foreground">
                              Describe tu tarea en pocas palabras para que los
                              proveedores puedan entender rápidamente qué
                              necesitas.
                            </p>
                            <Input
                              placeholder="ej. Ayuda para mover mi sofá desde el segundo piso"
                              className="h-12 text-base"
                            />
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <Calendar className="h-5 w-5 text-primary" />
                              <h3 className="text-lg font-medium text-foreground">
                                ¿Cuándo necesitas que se haga?
                              </h3>
                            </div>
                            <p className="text-muted-foreground mb-6">
                              Elige la opción que mejor se adapte a tu
                              disponibilidad.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                {
                                  id: "exact",
                                  label: "Fecha específica",
                                  desc: "Necesito que sea un día concreto",
                                },
                                {
                                  id: "before",
                                  label: "Antes de fecha",
                                  desc: "Tengo una fecha límite",
                                },
                                {
                                  id: "flexible",
                                  label: "Soy flexible",
                                  desc: "Podemos coordinar juntos",
                                },
                              ].map((option) => (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() =>
                                    setDatePreference(option.id as any)
                                  }
                                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                                    datePreference === option.id
                                      ? "border-primary bg-primary/5 text-foreground"
                                      : "border-border bg-card hover:border-primary/30"
                                  }`}
                                >
                                  <div className="font-medium mb-1">
                                    {option.label}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {option.desc}
                                  </div>
                                </button>
                              ))}
                            </div>

                            {/* Date Picker based on selection */}
                            {datePreference === "exact" && (
                              <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
                                <DatePicker
                                  label="Selecciona la fecha específica"
                                  placeholder="¿Qué día necesitas el servicio?"
                                  value={exactDate}
                                  onChange={setExactDate}
                                  size="lg"
                                  locale="es"
                                />
                              </div>
                            )}

                            {datePreference === "before" && (
                              <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
                                <DatePicker
                                  label="Fecha límite para completar"
                                  placeholder="¿Antes de qué fecha necesitas que esté listo?"
                                  value={beforeDate}
                                  onChange={setBeforeDate}
                                  size="lg"
                                  locale="es"
                                />
                              </div>
                            )}

                            {datePreference === "flexible" && (
                              <div className="mt-6 p-4 bg-secondary/20 border border-secondary/30 rounded-lg">
                                <div className="flex items-start gap-3">
                                  <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="h-3 w-3 text-secondary-foreground" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-foreground mb-1">
                                      ¡Excelente elección!
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      Al ser flexible con las fechas, es más
                                      probable que recibas propuestas de
                                      proveedores y puedas negociar mejores
                                      precios.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="specific-time"
                                checked={needSpecificTime}
                                onChange={(e) =>
                                  setNeedSpecificTime(e.target.checked)
                                }
                                className="w-4 h-4 text-primary rounded focus:ring-primary border-border"
                              />
                              <Label
                                htmlFor="specific-time"
                                className="text-foreground"
                              >
                                Necesito una hora específica del día
                              </Label>
                            </div>

                            {needSpecificTime && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                                {timeOptions.map((option) => {
                                  const IconComponent = option.icon;
                                  return (
                                    <button
                                      key={option.id}
                                      type="button"
                                      onClick={() =>
                                        setTimePreference(option.id)
                                      }
                                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                                        timePreference === option.id
                                          ? "border-primary bg-primary/5 text-foreground"
                                          : "border-border bg-card hover:border-primary/30"
                                      }`}
                                    >
                                      <IconComponent className="h-6 w-6 mx-auto mb-2 text-primary" />
                                      <div className="font-medium text-sm mb-1">
                                        {option.label}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {option.subtitle}
                                      </div>
                                    </button>
                                  );
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
                            <div className="flex items-center gap-2 mb-4">
                              <DollarSign className="h-5 w-5 text-primary" />
                              <h3 className="text-lg font-medium text-foreground">
                                ¿Cuál es tu presupuesto?
                              </h3>
                            </div>
                            <p className="text-muted-foreground mb-6">
                              Indica un presupuesto aproximado. Recuerda que
                              siempre puedes negociar el precio final con el
                              proveedor.
                            </p>
                            <div className="max-w-sm">
                              <Label className="text-sm font-medium text-foreground mb-2 block">
                                Presupuesto estimado (CLP)
                              </Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-primary">
                                  $
                                </span>
                                <Input
                                  type="number"
                                  className="pl-8 h-12 text-lg font-medium"
                                  placeholder="50,000"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Los proveedores podrán hacer contraofertas
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <FileText className="h-5 w-5 text-primary" />
                              <h3 className="text-lg font-medium text-foreground">
                                Describe tu proyecto
                              </h3>
                            </div>
                            <p className="text-muted-foreground mb-4">
                              Proporciona todos los detalles importantes para
                              que los proveedores entiendan exactamente qué
                              necesitas.
                            </p>
                            <Textarea
                              placeholder="Por ejemplo: Necesito ayuda para mover un sofá de 3 cuerpos desde mi apartamento en el segundo piso hasta mi nueva casa. El sofá pesa aproximadamente 80kg y necesito que lo muevan el sábado por la mañana..."
                              className="min-h-[150px] text-base resize-none"
                            />
                            <div className="flex flex-wrap gap-2 mt-3">
                              {[
                                "Incluye dimensiones si aplica",
                                "Menciona peso o dificultad",
                                "Especifica duración estimada",
                              ].map((tip, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground"
                                >
                                  {tip}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <MapPin className="h-5 w-5 text-primary" />
                              <h3 className="text-lg font-medium text-foreground">
                                ¿Dónde se realizará el trabajo?
                              </h3>
                            </div>
                            <p className="text-muted-foreground mb-4">
                              Selecciona si necesitas que el proveedor vaya a
                              una ubicación específica o si el trabajo se puede
                              hacer en línea.
                            </p>
                            <RadioGroup
                              value={locationType}
                              onValueChange={(value) =>
                                setLocationType(
                                  value as "presencial" | "online",
                                )
                              }
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <div
                                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                  locationType === "presencial"
                                    ? "border-primary bg-primary/5 text-foreground"
                                    : "border-border bg-card hover:border-primary/30"
                                }`}
                              >
                                <RadioGroupItem
                                  value="presencial"
                                  id="presencial"
                                  className="sr-only"
                                />
                                <Label
                                  htmlFor="presencial"
                                  className="cursor-pointer block"
                                >
                                  <div className="flex items-center gap-3 mb-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <span className="font-medium">
                                      Presencial
                                    </span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    El proveedor debe ir a una ubicación
                                    específica
                                  </div>
                                </Label>
                              </div>
                              <div
                                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                  locationType === "online"
                                    ? "border-primary bg-primary/5 text-foreground"
                                    : "border-border bg-card hover:border-primary/30"
                                }`}
                              >
                                <RadioGroupItem
                                  value="online"
                                  id="online"
                                  className="sr-only"
                                />
                                <Label
                                  htmlFor="online"
                                  className="cursor-pointer block"
                                >
                                  <div className="flex items-center gap-3 mb-2">
                                    <Monitor className="h-5 w-5 text-primary" />
                                    <span className="font-medium">
                                      En línea
                                    </span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    El trabajo se puede hacer remotamente
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>

                            {locationType === "presencial" && (
                              <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
                                <Label
                                  htmlFor="address"
                                  className="text-sm font-medium text-foreground mb-2 block"
                                >
                                  Dirección donde se realizará el trabajo
                                </Label>
                                <Input
                                  id="address"
                                  placeholder="ej. Av. Providencia 1234, Providencia, Santiago"
                                  className="h-11"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Esta información solo se compartirá con
                                  proveedores seleccionados
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <Camera className="h-5 w-5 text-primary" />
                              <h3 className="text-lg font-medium text-foreground">
                                Agregar imágenes
                              </h3>
                              <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                                Opcional
                              </span>
                            </div>
                            <p className="text-muted-foreground mb-4">
                              Las imágenes ayudan a los proveedores a entender
                              mejor tu proyecto y hacer propuestas más precisas.
                            </p>
                            <div className="border-2 border-dashed border-border rounded-lg p-6">
                              <FileUpload
                                label=""
                                multiple={true}
                                accept="image/*,video/*"
                                onChange={() => {}}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Payment */}
                      {currentStep === 3 && (
                        <div className="space-y-8">
                          <div className="text-center">
                            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                              <CreditCard className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-semibold text-foreground mb-3">
                              Pago seguro y protegido
                            </h2>
                            <p className="text-muted-foreground max-w-xl mx-auto">
                              Tu solicitud será publicada inmediatamente después
                              de confirmar el pago.
                              <span className="font-medium text-foreground">
                                {" "}
                                Solo pagas cuando el trabajo esté completado a
                                tu satisfacción.
                              </span>
                            </p>
                          </div>

                          <div className="bg-muted/30 rounded-lg p-6 border">
                            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                              Resumen de tu pedido
                            </h3>
                            <div className="bg-card rounded-lg p-4 space-y-3 border">
                              <div className="flex justify-between items-center">
                                <span className="text-foreground font-medium">
                                  Costo de publicación
                                </span>
                                <span className="text-2xl font-bold text-foreground">
                                  $2.990
                                </span>
                              </div>
                              <div className="border-t pt-3">
                                <div className="flex justify-between items-center text-primary">
                                  <span className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Protección de pago incluida
                                  </span>
                                  <span className="font-semibold">Gratis</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <CreditCard className="h-5 w-5 text-primary" />
                              <h3 className="text-lg font-medium text-foreground">
                                Elige tu método de pago
                              </h3>
                            </div>

                            <div className="grid gap-3">
                              <button
                                type="button"
                                className="p-4 border-2 border-primary bg-primary/5 rounded-lg flex items-center gap-4 transition-colors"
                              >
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                  <CreditCard className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div className="text-left flex-1">
                                  <div className="font-medium text-foreground">
                                    Tarjeta de crédito/débito
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Visa, Mastercard, American Express
                                  </div>
                                </div>
                                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                </div>
                              </button>

                              <button
                                type="button"
                                className="p-4 border-2 border-border bg-card rounded-lg flex items-center gap-4 hover:border-primary/30 transition-colors"
                              >
                                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                  <div className="w-6 h-6 bg-muted-foreground rounded text-background text-xs font-bold flex items-center justify-center">
                                    T
                                  </div>
                                </div>
                                <div className="text-left flex-1">
                                  <div className="font-medium text-foreground">
                                    Transferencia bancaria
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Pago directo desde tu cuenta
                                  </div>
                                </div>
                              </button>
                            </div>
                          </div>

                          <div className="bg-secondary/20 rounded-lg p-6 border border-secondary/30">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                <Shield className="h-5 w-5 text-secondary-foreground" />
                              </div>
                              <div>
                                <div className="font-semibold text-lg text-foreground mb-2">
                                  Pago 100% protegido
                                </div>
                                <div className="text-muted-foreground mb-4">
                                  Tu dinero está completamente seguro con
                                  nosotros. Mantenemos tu pago en custodia y
                                  solo lo liberamos al proveedor cuando
                                  confirmes que el trabajo ha sido completado
                                  satisfactoriamente.
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  {[
                                    { icon: Shield, label: "Pago seguro" },
                                    {
                                      icon: Check,
                                      label: "Reembolso garantizado",
                                    },
                                    { icon: Star, label: "Soporte 24/7" },
                                  ].map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 text-secondary"
                                    >
                                      <item.icon className="h-4 w-4" />
                                      <span className="text-sm font-medium">
                                        {item.label}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex justify-between items-center pt-6 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentStep === 1}
                          className="flex items-center gap-2 h-11 px-6"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Anterior
                        </Button>

                        {currentStep < 3 ? (
                          <Button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2 h-11 px-6"
                          >
                            Siguiente
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="flex items-center gap-2 h-11 px-6 font-semibold"
                          >
                            {isGuest
                              ? "Completar registro para publicar"
                              : "Publicar mi tarea"}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border p-12 text-center">
                <div className="mb-6 mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-semibold mb-4 text-foreground">
                  ¡Solicitud enviada con éxito!
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Tu tarea ha sido publicada y pronto comenzarás a recibir
                  propuestas de proveedores calificados.
                </p>
                <div className="mt-8 p-6 border rounded-lg bg-secondary/10 border-secondary/20">
                  <h3 className="text-xl font-semibold mb-6 text-foreground">
                    Próximos pasos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                      {
                        icon: FileText,
                        title: "Recibe propuestas",
                        desc: "Los proveedores comenzarán a enviar sus ofertas",
                      },
                      {
                        icon: Monitor,
                        title: "Compara y chatea",
                        desc: "Revisa perfiles y habla con los candidatos",
                      },
                      {
                        icon: Check,
                        title: "Elige y confirma",
                        desc: "Selecciona el mejor proveedor y programa el trabajo",
                      },
                    ].map((step, index) => (
                      <div key={index} className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <step.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-medium text-foreground mb-2">
                          {step.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full max-w-md mx-auto h-12 text-base font-medium">
                    Ver mis tareas activas
                  </Button>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Tu pago está protegido hasta que el trabajo esté completado
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
