"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import Image from "next/image"
import {
  Shield,
  Star,
  Zap,
  ShieldCheck,
  Users,
  CheckCircle,
  MapPin,
  TrendingUp,
  Clock,
  Wrench,
  Search,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

// Lista completa de ciudades de Chile
const chileanCities = [
  "Arica", "Iquique", "Antofagasta", "Calama", "Copiapó", "La Serena", "Valparaíso", 
  "Viña del Mar", "Santiago", "Rancagua", "Talca", "Chillán", "Concepción", 
  "Temuco", "Valdivia", "Osorno", "Puerto Montt", "Coyhaique", "Punta Arenas",
  "Arica", "Iquique", "Tocopilla", "Calama", "Antofagasta", "Mejillones", 
  "Taltal", "Chañaral", "Copiapó", "Vallenar", "La Serena", "Coquimbo", 
  "Ovalle", "Illapel", "Los Vilos", "Valparaíso", "Viña del Mar", "Quilpué", 
  "Villa Alemana", "San Antonio", "Quillota", "La Calera", "Santiago", "Puente Alto", 
  "Maipú", "San Bernardo", "La Florida", "Las Condes", "Providencia", "Ñuñoa", 
  "Renca", "Peñalolén", "Macul", "San Miguel", "Rancagua", "San Fernando", 
  "Curicó", "Talca", "Linares", "Cauquenes", "Chillán", "Los Ángeles", 
  "Concepción", "Talcahuano", "Coronel", "Lota", "Arauco", "Curanilahue", 
  "Temuco", "Villarrica", "Pucón", "Angol", "Valdivia", "La Unión", 
  "Río Bueno", "Osorno", "Puerto Varas", "Puerto Montt", "Castro", "Ancud", 
  "Coyhaique", "Aysén", "Punta Arenas", "Porvenir", "Puerto Natales"
].filter((city, index, self) => self.indexOf(city) === index).sort()

export default function HomePage() {
  const t = useTranslations()
  const mainRef = useRef(null)
  const [selectedCity, setSelectedCity] = useState("Santiago")
  const [isCityDialogOpen, setIsCityDialogOpen] = useState(false)
  const [citySearchQuery, setCitySearchQuery] = useState("")

  useGSAP(
    () => {
      gsap.from(".hero-element", {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2,
      })

      const sections = gsap.utils.toArray(".animated-section")
      sections.forEach((section) => {
        gsap.from(section as HTMLElement, {
          scrollTrigger: {
            trigger: section as HTMLElement,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out",
        })
      })
    },
    { scope: mainRef }
  )

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

  const communitySteps = [
    {
      icon: MapPin,
      title: t("community.step1.title"),
      description: t("community.step1.description"),
    },
    {
      icon: Users,
      title: t("community.step2.title"),
      description: t("community.step2.description"),
    },
    {
      icon: TrendingUp,
      title: t("community.step3.title"),
      description: t("community.step3.description"),
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white" ref={mainRef}>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gray-50">
          <div className="container mx-auto grid lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="text-center lg:text-left">
              <h1 className="hero-element text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                {t("landing.hero.title")}
              </h1>
              <p className="hero-element mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 md:text-lg lg:text-base xl:text-xl">
                {t("landing.hero.subtitle")}
              </p>
              <div className="hero-element mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                {/* Location */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">{selectedCity}, CL</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCityDialogOpen(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {t("hero.changeCity")}
                  </button>
                </div>

                {/* City Selection Dialog */}
                <Dialog open={isCityDialogOpen} onOpenChange={setIsCityDialogOpen}>
                  <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Selecciona una ciudad</DialogTitle>
                    </DialogHeader>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Buscar ciudad..."
                        value={citySearchQuery}
                        onChange={(e) => setCitySearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <div className="space-y-1">
                        {chileanCities
                          .filter((city) =>
                            city.toLowerCase().includes(citySearchQuery.toLowerCase())
                          )
                          .map((city) => (
                            <button
                              type="button"
                              key={city}
                              onClick={() => {
                                setSelectedCity(city)
                                setIsCityDialogOpen(false)
                                setCitySearchQuery("")
                              }}
                              className={`w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                                selectedCity === city ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                              }`}
                            >
                              {city}
                            </button>
                          ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Search Form */}
                <div className="space-y-4">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                    <Select>
                      <SelectTrigger className="h-12 pl-10 w-full">
                        <SelectValue placeholder={t("hero.selectAction")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="search">{t("hero.searchService")}</SelectItem>
                        <SelectItem value="post">{t("hero.postService")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative">
                    <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder={t("hero.whatServicePost")}
                      className="h-12 pl-10"
                    />
                  </div>

                  <Button size="lg" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                    {t("button.search")}
                  </Button>
                </div>

                {/* Login Prompt */}
                <div className="text-center">
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 text-sm">
                    Iniciar sesión {t("hero.loginPrompt")}
                  </Link>
                </div>
              </div>
            </div>
            <div className="hero-element relative h-[300px] sm:h-[400px] lg:h-[450px] xl:h-[500px] w-full rounded-3xl overflow-hidden">
              <Image
                src="/hero.png"
                alt={t("landing.hero.imageAlt")}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="animated-section py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 lg:text-3xl xl:text-4xl">
                {t("community.title")}
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-600">
                {t("community.subtitle")}
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center">
              {/* Column 1: Image */}
              <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] w-full rounded-3xl overflow-hidden">
                <Image
                  src="/comunidad-servicios.png"
                  alt="GigSy Community Ecosystem"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Column 2: Steps */}
              <div className="space-y-8 sm:space-y-10 lg:space-y-12">
                {communitySteps.map((step, index) => (
                  <div key={index} className="flex gap-4 sm:gap-6">
                    <div className="shrink-0">
                      <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary text-white shadow-md">
                        <step.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 pl-0 sm:pl-12 lg:pl-20">
                  <Button size="lg" className="rounded-full px-6 sm:px-8" asChild>
                    <Link href="/register">{t("button.joinNow")}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Find Services Section */}
        <section className="animated-section py-16 sm:py-20 bg-gray-50">
          <div className="container mx-auto grid lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center px-4 sm:px-6 lg:px-8">
            <div className="relative h-[300px] sm:h-[350px] lg:h-[400px] xl:h-[450px] w-full order-last lg:order-first rounded-3xl overflow-hidden">
                <Image
                    src="/buscar-servicios.png"
                    alt={t("landing.findService.imageAlt")}
                    fill
                    className="object-cover"
                />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 lg:text-3xl xl:text-4xl">
                {t("landing.findService.title")}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-gray-600">
                {t("landing.findService.subtitle")}
              </p>
              <Button size="lg" className="mt-6 sm:mt-8 rounded-full h-11 sm:h-12 px-6 sm:px-8" asChild>
                <Link href="/browse-services">{t("button.exploreServices")}</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Offer Services Section */}
        <section className="animated-section py-16 sm:py-20 bg-white">
          <div className="container mx-auto grid lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center px-4 sm:px-6 lg:px-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 lg:text-3xl xl:text-4xl">
                {t("landing.offerService.title")}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-gray-600">
                {t("landing.offerService.subtitle")}
              </p>
              <ul className="mt-6 space-y-3 sm:space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">{t("landing.offerService.benefit1")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">{t("landing.offerService.benefit2")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">{t("landing.offerService.benefit3")}</span>
                </li>
              </ul>
              <Button size="lg" className="mt-6 sm:mt-8 rounded-full h-11 sm:h-12 px-6 sm:px-8" asChild>
                <Link href="/register">{t("button.startEarning")}</Link>
              </Button>
            </div>
            <div className="relative h-[300px] sm:h-[350px] lg:h-[400px] xl:h-[450px] w-full rounded-3xl overflow-hidden">
                <Image
                    src="/gana-dondequieras.png"
                    alt={t("landing.offerService.imageAlt")}
                    fill
                    className="object-cover"
                />
            </div>
          </div>
        </section>
        
        {/* Why Choose Us Section */}
        <section className="animated-section py-16 sm:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 lg:text-3xl xl:text-4xl">{t("hero.whyChoose")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-base sm:text-lg">
                {t("hero.whyChooseDesc")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="shrink-0 flex mx-auto h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mt-4 sm:mt-5 text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-sm sm:text-base text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="animated-section py-16 sm:py-20 lg:py-24 bg-primary text-white mx-2 rounded-xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight lg:text-3xl xl:text-4xl">
              {t("landing.finalCta.title")}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-primary-200">
              {t("landing.finalCta.subtitle")}
            </p>
            <div className="mt-6 sm:mt-8">
              <Button size="lg" variant="secondary" className="rounded-full h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base" asChild>
                <Link href="/register">{t("button.joinNow")}</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}