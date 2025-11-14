"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Shield, Star, Zap, ShieldCheck, ArrowRight, CheckCircle, MapPin, Clock, ChevronDown, Send } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const features = [
  {
    icon: Shield,
    title: "Verificados",
    description: "Proveedores con verificación completa",
  },
  {
    icon: Star,
    title: "Calidad",
    description: "Sistema de calificaciones confiable",
  },
  {
    icon: Zap,
    title: "Rápido",
    description: "Conexión inmediata con proveedores",
  },
  {
    icon: ShieldCheck,
    title: "Protegido",
    description: "Cobertura ante imprevistos para tu tranquilidad",
  },
]

const benefits = [
  "Proveedores verificados y confiables",
  "Precios transparentes sin sorpresas",
  "Comunicación directa y segura",
  "Pagos protegidos y garantizados",
]

export default function HomePage() {
  const { status, isLoggedIn, isLoading, continueAsGuest } = useAuth()
  const router = useRouter()

  // Redirect logged-in users to browse services
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push("/browse-services")
    }
  }, [isLoggedIn, isLoading, router])

  // Show loading state while checking auth
  if (isLoading) {
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

  // Don't render the landing page if user is logged in (they'll be redirected)
  if (isLoggedIn) {
    return null
  }

  const handleContinueAsGuest = () => {
    continueAsGuest()
    router.push("/browse-services")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Only for non-logged users */}
        <section className="relative overflow-hidden bg-background">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] lg:min-h-[700px] py-12 lg:py-16">
              {/* Left Section - Content and Form */}
              <div className="space-y-6">
                {/* Location Indicator */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Santiago, CL</span>
                  <Link href="#" className="text-primary hover:underline ml-2">
                    Cambiar ciudad
                  </Link>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
                  Encuentra cualquier servicio
                  <span className="block text-primary">en tu comunidad</span>
                </h1>

                {/* Service Request Form */}
                <div className="space-y-4 pt-4">
                  {/* Action Type Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between h-12 text-base">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Buscar servicio ahora</span>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuItem onClick={() => router.push("/browse-services")}>
                        Buscar servicio ahora
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/request-service")}>
                        Publicar tarea
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Service Input */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <div className="h-3 w-3 rounded-full bg-foreground" />
                    </div>
                    <Input
                      placeholder="¿Qué servicio necesitas?"
                      className="pl-12 pr-12 h-14 text-base"
                      onFocus={() => router.push("/browse-services")}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10"
                      onClick={() => router.push("/browse-services")}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Location Input */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <div className="h-3 w-3 border-2 border-foreground rounded-sm" />
                    </div>
                    <Input
                      placeholder="Ubicación"
                      className="pl-12 h-14 text-base"
                      defaultValue="Santiago, Chile"
                      onFocus={() => router.push("/browse-services")}
                    />
                  </div>

                  {/* Action Button */}
                  <Button
                    size="lg"
                    className="w-full h-14 text-base font-semibold"
                    onClick={() => router.push("/browse-services")}
                  >
                    Buscar servicios
                  </Button>

                  {/* Login Prompt */}
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    <Link href="/login" className="text-primary hover:underline">
                      Inicia sesión
                    </Link>{" "}
                    para ver tu actividad reciente
                  </p>
                </div>
              </div>

              {/* Right Section - Illustration */}
              <div className="hidden lg:block relative h-full min-h-[500px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Service-themed illustration using SVG */}
                  <svg
                    viewBox="0 0 600 500"
                    className="w-full h-full max-w-[600px] max-h-[500px]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Sky gradient background */}
                    <defs>
                      <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="600" height="500" fill="url(#skyGradient)" />

                    {/* Background buildings with varying heights */}
                    <rect x="50" y="200" width="70" height="200" fill="hsl(var(--muted))" rx="4" opacity="0.8" />
                    <rect x="140" y="150" width="70" height="250" fill="hsl(var(--muted))" rx="4" opacity="0.8" />
                    <rect x="230" y="180" width="70" height="220" fill="hsl(var(--muted))" rx="4" opacity="0.8" />
                    <rect x="320" y="160" width="70" height="240" fill="hsl(var(--muted))" rx="4" opacity="0.8" />
                    <rect x="410" y="190" width="70" height="210" fill="hsl(var(--muted))" rx="4" opacity="0.8" />
                    <rect x="500" y="170" width="70" height="230" fill="hsl(var(--muted))" rx="4" opacity="0.8" />

                    {/* Building windows with primary color */}
                    <rect x="60" y="220" width="10" height="10" fill="hsl(var(--primary))" opacity="0.5" rx="1" />
                    <rect x="80" y="220" width="10" height="10" fill="hsl(var(--primary))" opacity="0.5" rx="1" />
                    <rect x="100" y="220" width="10" height="10" fill="hsl(var(--primary))" opacity="0.5" rx="1" />
                    <rect x="160" y="170" width="10" height="10" fill="hsl(var(--primary))" opacity="0.5" rx="1" />
                    <rect x="180" y="170" width="10" height="10" fill="hsl(var(--primary))" opacity="0.5" rx="1" />
                    <rect x="200" y="170" width="10" height="10" fill="hsl(var(--primary))" opacity="0.5" rx="1" />
                    <rect x="260" y="200" width="10" height="10" fill="hsl(var(--primary))" opacity="0.5" rx="1" />
                    <rect x="280" y="200" width="10" height="10" fill="hsl(var(--primary))" opacity="0.5" rx="1" />
                    <rect x="300" y="200" width="10" height="10" fill="hsl(var(--primary))" opacity="0.5" rx="1" />
                    <rect x="360" y="180" width="10" height="10" fill="hsl(var(--primary))" opacity="0.5" rx="1" />
                    <rect x="380" y="180" width="10" height="10" fill="hsl(var(--primary))" opacity="0.5" rx="1" />

                    {/* Ground/Street */}
                    <rect x="0" y="400" width="600" height="100" fill="hsl(var(--muted))" opacity="0.2" />

                    {/* Service provider person (left) - with tool */}
                    <g>
                      <circle cx="120" cy="360" r="22" fill="hsl(var(--primary))" />
                      <rect x="98" y="382" width="44" height="55" fill="hsl(var(--primary))" rx="4" />
                      {/* Tool bag */}
                      <rect x="135" y="395" width="18" height="22" fill="hsl(var(--foreground))" opacity="0.4" rx="2" />
                      {/* Wrench icon */}
                      <path
                        d="M135 375 L140 370 L145 375 L143 377 L140 375 Z"
                        stroke="hsl(var(--foreground))"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.6"
                      />
                    </g>

                    {/* Service requester person (center) - holding phone/device */}
                    <g>
                      <circle cx="300" cy="360" r="22" fill="hsl(var(--secondary))" />
                      <rect x="278" y="382" width="44" height="55" fill="hsl(var(--secondary))" rx="4" />
                      {/* Phone/device */}
                      <rect x="310" y="390" width="12" height="18" fill="hsl(var(--primary))" opacity="0.6" rx="2" />
                    </g>

                    {/* Service provider person (right) - with cleaning supplies */}
                    <g>
                      <circle cx="480" cy="360" r="22" fill="hsl(var(--primary))" />
                      <rect x="458" y="382" width="44" height="55" fill="hsl(var(--primary))" rx="4" />
                      {/* Cleaning bucket */}
                      <ellipse cx="495" cy="400" rx="8" ry="10" fill="hsl(var(--foreground))" opacity="0.3" />
                      <rect x="490" y="395" width="10" height="12" fill="hsl(var(--foreground))" opacity="0.2" rx="1" />
                    </g>

                    {/* Connection lines (representing service connections) */}
                    <line
                      x1="142"
                      y1="360"
                      x2="278"
                      y2="360"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2.5"
                      strokeDasharray="6,4"
                      opacity="0.5"
                    />
                    <line
                      x1="322"
                      y1="360"
                      x2="458"
                      y2="360"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2.5"
                      strokeDasharray="6,4"
                      opacity="0.5"
                    />

                    {/* Connection dots */}
                    <circle cx="210" cy="360" r="4" fill="hsl(var(--primary))" opacity="0.6" />
                    <circle cx="390" cy="360" r="4" fill="hsl(var(--primary))" opacity="0.6" />

                    {/* Decorative elements - Trees/Plants */}
                    <g>
                      <circle cx="70" cy="420" r="12" fill="hsl(120, 45%, 45%)" />
                      <rect x="66" y="432" width="8" height="12" fill="hsl(30, 35%, 35%)" />
                    </g>
                    <g>
                      <circle cx="530" cy="420" r="12" fill="hsl(120, 45%, 45%)" />
                      <rect x="526" y="432" width="8" height="12" fill="hsl(30, 35%, 35%)" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features - 4 columns grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">¿Por qué elegir AidMarkt?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                La plataforma más confiable para conectar con servicios de calidad
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-none bg-transparent">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
