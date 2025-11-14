"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Star, Zap, ShieldCheck, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

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
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          <div className="container relative mx-auto">
            <div className="mx-auto max-w-3xl text-center py-24 lg:py-32">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
                Servicios de confianza
                <span className="block text-primary">en tu comunidad</span>
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Conecta con proveedores verificados para cualquier tarea. Desde limpieza hasta mudanzas, todo en un solo
                lugar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button asChild size="lg" className="text-base h-12 px-8">
                  <Link href="/register">
                    Comenzar ahora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-base h-12 px-8" onClick={handleContinueAsGuest}>
                  Explorar sin registro
                </Button>
              </div>

              {/* Benefits List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto justify-items-center">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
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
