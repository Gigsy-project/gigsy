"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Shield, Star, Zap, ShieldCheck, ArrowRight, CheckCircle, MapPin, Clock, Loader2, Check, Wrench } from "lucide-react"
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

// Features will be created dynamically with translations

// Lista de ciudades de Chile
const CHILEAN_CITIES = [
  { value: "santiago", label: "Santiago, CL" },
  { value: "valparaiso", label: "Valparaíso, CL" },
  { value: "concepcion", label: "Concepción, CL" },
  { value: "la-serena", label: "La Serena, CL" },
  { value: "antofagasta", label: "Antofagasta, CL" },
  { value: "temuco", label: "Temuco, CL" },
  { value: "rancagua", label: "Rancagua, CL" },
  { value: "talca", label: "Talca, CL" },
  { value: "arica", label: "Arica, CL" },
  { value: "iquique", label: "Iquique, CL" },
  { value: "calama", label: "Calama, CL" },
  { value: "copiapó", label: "Copiapó, CL" },
  { value: "coquimbo", label: "Coquimbo, CL" },
  { value: "viña-del-mar", label: "Viña del Mar, CL" },
  { value: "quillota", label: "Quillota, CL" },
  { value: "los-andes", label: "Los Andes, CL" },
  { value: "san-antonio", label: "San Antonio, CL" },
  { value: "curicó", label: "Curicó, CL" },
  { value: "chillán", label: "Chillán, CL" },
  { value: "los-ángeles", label: "Los Ángeles, CL" },
  { value: "valdivia", label: "Valdivia, CL" },
  { value: "osorno", label: "Osorno, CL" },
  { value: "puerto-montt", label: "Puerto Montt, CL" },
  { value: "coyhaique", label: "Coyhaique, CL" },
  { value: "punta-arenas", label: "Punta Arenas, CL" },
] as const

// Hook para obtener la ubicación del usuario y convertirla a nombre de ciudad
const useUserCity = () => {
  const [city, setCity] = useState<string>("Santiago, CL")
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)

  useEffect(() => {
    const getCityFromLocation = async (lat: number, lng: number) => {
      try {
        // Usar Nominatim (OpenStreetMap) para geocodificación inversa
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
          {
            headers: {
              "User-Agent": "Gigsy App", // Nominatim requiere User-Agent
            },
          }
        )

        if (!response.ok) {
          throw new Error("Error al obtener la ubicación")
        }

        const data = await response.json()
        
        // Extraer ciudad y país de la respuesta
        const address = data.address
        const cityName = address.city || address.town || address.municipality || address.village || "Santiago"
        const country = address.country_code?.toUpperCase() || "CL"
        
        // Si estamos en Chile, usar el formato "Ciudad, CL"
        if (country === "CL") {
          setCity(`${cityName}, CL`)
        } else {
          setCity(`${cityName}, ${country}`)
        }
      } catch (error) {
        console.error("Error al obtener la ciudad:", error)
        setCity("Santiago, CL") // Fallback a Santiago
      } finally {
        setIsLoadingLocation(false)
      }
    }

    // Verificar si el navegador soporta geolocalización
    if (!navigator.geolocation) {
      setIsLoadingLocation(false)
      return
    }

    // Solicitar ubicación del usuario
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        console.log("Ubicación obtenida:", latitude, longitude)
        getCityFromLocation(latitude, longitude)
      },
      (error) => {
        setCity("Santiago, CL")
        setIsLoadingLocation(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // Cache por 5 minutos
      }
    )
  }, [])

  return { city, isLoadingLocation, setCity }
}

export default function HomePage() {
  const t = useTranslations()
  const { status, isLoggedIn, isLoading, continueAsGuest } = useAuth()
  const router = useRouter()
  const { city, isLoadingLocation, setCity: setUserCity } = useUserCity()
  const [isCityDialogOpen, setIsCityDialogOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedAction, setSelectedAction] = useState("")

  const features = [
    {
      icon: Shield,
      title: t("hero.features.verified"),
      description: t("hero.features.verifiedDesc"),
    },
    {
      icon: Star,
      title: t("hero.features.quality"),
      description: t("hero.features.qualityDesc"),
    },
    {
      icon: Zap,
      title: t("hero.features.fast"),
      description: t("hero.features.fastDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("hero.features.protected"),
      description: t("hero.features.protectedDesc"),
    },
  ]
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Only for non-logged users */}
        <section className="relative overflow-hidden bg-background">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] lg:min-h-[700px] pt-4 lg:pt-6 pb-12 lg:pb-16">
              {/* Left Section - Content and Form */}
              <div className="space-y-6">
                {/* Main Heading */}
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
                  {t("hero.title")}
                </h1>

                {/* Location Indicator */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {isLoadingLocation ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>{t("hero.gettingLocation")}</span>
                    </div>
                  ) : (
                    <>
                      <span>{city}</span>
                      <Button
                        variant="link"
                        onClick={() => setIsCityDialogOpen(true)}
                        className="text-primary hover:underline ml-1"
                      >
                        {t("hero.changeCity")}
                      </Button>
                    </>
                  )}
                </div>

                {/* Service Request Form */}
                <div className="space-y-4 pt-4">
                  {/* Action Type Selector */}
                  <Select value={selectedAction} onValueChange={setSelectedAction}>
                    <SelectTrigger className="w-full h-14 text-base rounded-xl min-h-[56px]">
                      <div className="flex items-center gap-2 flex-1 justify-start">
                        <Clock className="h-4 w-4" />
                        <SelectValue placeholder={t("hero.selectAction")} className="text-left" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accion" disabled>
                        {t("hero.selectAction")}
                      </SelectItem>
                      <SelectItem value="buscar">{t("hero.searchService")}</SelectItem>
                      <SelectItem value="publicar">{t("hero.postService")}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Service Input */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      placeholder={selectedAction === "buscar" ? t("hero.whatServiceSearch") : t("hero.whatServicePost")}
                      className="pl-12 h-14 text-base rounded-xl"
                    />
                  </div>

                  {/* Action Button */}
                  <Button
                    size="lg"
                    className="w-full h-14 text-base font-semibold rounded-xl"
                    onClick={() => router.push("/browse-services")}
                  >
                    {t("button.search")}
                  </Button>

                  {/* Login Prompt */}
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    <Link href="/login" className="text-primary hover:underline">
                      {t("button.login")}
                    </Link>{" "}
                    {t("hero.loginPrompt")}
                  </p>
                </div>
              </div>

              <Image
                src="/hero-image.png"
                alt="Servicios en tu comunidad"
                width={500}
                height={500}
                className="w-full h-full max-h-[500px] rounded-xl object-cover" style={{ objectPosition: '85% center' }}
                priority
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* Dialog para cambiar ciudad */}
        <Dialog open={isCityDialogOpen} onOpenChange={setIsCityDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("hero.changeLocation")}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Command>
                <CommandInput placeholder={t("hero.searchCity")} />
                <CommandList>
                  <CommandEmpty>{t("hero.cityNotFound")}</CommandEmpty>
                  <CommandGroup>
                    {CHILEAN_CITIES.map((cityOption) => (
                      <CommandItem
                        key={cityOption.value}
                        value={cityOption.label}
                        onSelect={(currentValue) => {
                          const selected = CHILEAN_CITIES.find(
                            (c) => c.label.toLowerCase() === currentValue.toLowerCase()
                          )
                          if (selected) {
                            setSelectedCity(selected.value)
                            setUserCity(selected.label)
                            setIsCityDialogOpen(false)
                          }
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            city === cityOption.label ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {cityOption.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </DialogContent>
        </Dialog>

        {/* Features - 4 columns grid */}
        <section className="py-4 lg:py-6">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">{t("hero.whyChoose")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("hero.whyChooseDesc")}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <Card key={feature.title} className="border-0 shadow-none bg-transparent">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed text-center line-clamp-3 xl:line-clamp-2">{feature.description}</p>
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
