"use client"

import { useState, useMemo, useCallback, memo, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  ArrowLeft,
  Heart,
  Flag,
  User,
  Loader2,
  Filter,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { ServiceTask } from "@/lib/types"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import dynamic from "next/dynamic"

// Types
interface ServiceLocation {
  lat: number
  lng: number
}

interface ServiceTaskWithLocation extends ServiceTask {
  coordinates: ServiceLocation
}

type WorkType = "in-person" | "remotely" | "all"

interface FilterState {
  searchQuery: string
  selectedCategory: string
  selectedLocation: string
  selectedPriceRange: string
  sortBy: string
  showAvailableOnly: boolean
  showNoOffersOnly: boolean
  workType: WorkType
  distance: number
}

// Constants
const DEFAULT_USER_LOCATION: ServiceLocation = { lat: -33.4513, lng: -70.6653 } // Santiago Centro
const DEFAULT_DISTANCE = 10
const MAX_DISTANCE = 20
const MIN_DISTANCE = 1

const CATEGORIES = [
  "Todas las categorías",
  "Aseo del hogar",
  "Lavado y planchado",
  "Ayuda académica",
  "Reparaciones menores",
  "Recados y compras",
  "Ayuda creativa",
  "Mudanzas",
  "Cuidado de mascotas",
  "Clases particulares",
] as const

const CATEGORY_DESCRIPTIONS = {
  "Aseo del hogar": "Limpieza por hora o por evento para casas de estudiantes y jóvenes profesionales.",
  "Lavado y planchado": "Lavado de ropa y planchado con retiro a domicilio. Simple, cómodo y rápido.",
  "Ayuda académica": "Tutorías entre estudiantes en ramos como Álgebra, Finanzas o Inglés.",
  "Reparaciones menores": "Arreglos simples: enchufes, llaves, muebles sueltos. Soluciones express.",
  "Recados y compras": "Delegá trámites o compras urgentes. No pierdas tiempo en filas.",
  "Ayuda creativa": "Ideas para regalos, decoración, cocina casera y soluciones fuera de lo común.",
  Mudanzas: "Ayuda con mudanzas pequeñas, transporte de muebles y organización.",
  "Cuidado de mascotas": "Paseo de perros, alimentación y cuidado temporal de mascotas.",
  "Clases particulares": "Clases personalizadas de música, idiomas, deportes y más.",
} as const

const LOCATIONS = [
  "Todas las comunas",
  "Santiago Centro",
  "Las Condes",
  "Providencia",
  "Ñuñoa",
  "La Reina",
  "Vitacura",
  "San Miguel",
  "Maipú",
  "Puente Alto",
  "La Florida",
  "Peñalolén",
  "Macul",
  "San Joaquín",
  "Pedro Aguirre Cerda",
  "Lo Espejo",
  "Estación Central",
  "Cerrillos",
  "Quinta Normal",
  "Independencia",
  "Recoleta",
  "Huechuraba",
  "Conchalí",
  "Quilicura",
  "Renca",
  "Cerro Navia",
  "Lo Prado",
  "Pudahuel",
] as const

const PRICE_RANGES = [
  "Cualquier precio",
  "Hasta $5.000",
  "$5.000 - $15.000",
  "$15.000 - $30.000",
  "Más de $30.000",
] as const

const SORT_OPTIONS = [
  "Más recientes",
  "Precio: menor a mayor",
  "Precio: mayor a menor",
  "Más ofertas",
  "Mejor calificado",
] as const

// Mock data
const MOCK_SERVICES: ServiceTaskWithLocation[] = [
  {
    id: 1,
    title: "Limpieza profunda de departamento",
    description: "Necesito limpieza completa de departamento de 2 habitaciones. Incluye baños, cocina y aspirado.",
    budget: 25000,
    location: "Las Condes, Santiago",
    date: "Mié, 4 Jun",
    time: "Mañana",
    category: "Aseo del hogar",
    status: "open",
    postedBy: {
      name: "María González",
      avatar: "/images/juan-perez.jpg",
      rating: 4.8,
      reviewCount: 23,
    },
    postedTime: "hace 1 hora",
    offers: 1,
    coordinates: { lat: -33.4189, lng: -70.5953 },
  },
  {
    id: 2,
    title: "Compras en supermercado y farmacia",
    description: "Necesito que hagan compras en el supermercado y recojan medicamentos en la farmacia. Lista incluida.",
    budget: 8000,
    location: "Santiago, Chile",
    date: "Hoy",
    time: "Cualquier hora",
    category: "Recados y compras",
    status: "open",
    postedBy: {
      name: "Carlos Ruiz",
      avatar: "/images/hernan.jpg",
      rating: 4.9,
      reviewCount: 45,
    },
    postedTime: "hace 2 horas",
    offers: 3,
    urgent: true,
    coordinates: { lat: -33.4513, lng: -70.6653 },
  },
  {
    id: 3,
    title: "Tutoría de Álgebra Lineal",
    description:
      "Necesito ayuda con ejercicios de álgebra lineal para examen. Preferiblemente estudiante de ingeniería.",
    budget: 15000,
    location: "Providencia, Santiago",
    date: "Sáb, 8 Jun",
    time: "Tarde",
    category: "Ayuda académica",
    status: "open",
    postedBy: {
      name: "Ana Morales",
      avatar: "/images/josefa.jpg",
      rating: 4.7,
      reviewCount: 18,
    },
    postedTime: "hace 3 horas",
    offers: 2,
    coordinates: { lat: -33.4314, lng: -70.6093 },
  },
  {
    id: 4,
    title: "Arreglo de llave de cocina",
    description:
      "La llave de la cocina gotea y necesita reparación. Es un arreglo simple pero no tengo las herramientas.",
    budget: 12000,
    location: "Ñuñoa, Santiago",
    date: "Dom, 9 Jun",
    time: "Mañana",
    category: "Reparaciones menores",
    status: "open",
    postedBy: {
      name: "Pedro Silva",
      rating: 4.6,
      reviewCount: 12,
    },
    postedTime: "hace 5 horas",
    offers: 0,
    coordinates: { lat: -33.4569, lng: -70.5978 },
  },
  {
    id: 5,
    title: "Lavado y planchado de ropa",
    description: "Tengo acumulada mucha ropa para lavar y planchar. Busco servicio con retiro y entrega a domicilio.",
    budget: 18000,
    location: "La Reina, Santiago",
    date: "Lun, 10 Jun",
    time: "Todo el día",
    category: "Lavado y planchado",
    status: "open",
    postedBy: {
      name: "Sofía Herrera",
      rating: 4.5,
      reviewCount: 8,
    },
    postedTime: "hace 6 horas",
    offers: 1,
    coordinates: { lat: -33.4417, lng: -70.5347 },
  },
  {
    id: 6,
    title: "Ideas para regalo de cumpleaños",
    description:
      "Necesito ideas creativas para regalo de cumpleaños de mi mejor amiga. Presupuesto limitado pero quiero algo especial.",
    budget: 5000,
    location: "Vitacura, Santiago",
    date: "Mar, 11 Jun",
    time: "Cualquier hora",
    category: "Ayuda creativa",
    status: "open",
    postedBy: {
      name: "Camila Torres",
      rating: 4.9,
      reviewCount: 15,
    },
    postedTime: "hace 8 horas",
    offers: 0,
    coordinates: { lat: -33.3903, lng: -70.5712 },
  },
  {
    id: 7,
    title: "Ayuda con mudanza pequeña",
    description: "Necesito ayuda para mover algunas cajas y muebles pequeños a mi nuevo departamento.",
    budget: 20000,
    location: "Providencia, Santiago",
    date: "Vie, 7 Jun",
    time: "Tarde",
    category: "Mudanzas",
    status: "open",
    postedBy: {
      name: "Roberto Méndez",
      rating: 4.7,
      reviewCount: 14,
    },
    postedTime: "hace 4 horas",
    offers: 2,
    coordinates: { lat: -33.4314, lng: -70.6093 },
  },
  {
    id: 8,
    title: "Paseo de perro por una semana",
    description: "Necesito alguien que pasee a mi perro durante una semana mientras estoy de viaje.",
    budget: 35000,
    location: "Las Condes, Santiago",
    date: "Lun, 10 Jun",
    time: "Mañana",
    category: "Cuidado de mascotas",
    status: "open",
    postedBy: {
      name: "Carolina Vega",
      rating: 4.9,
      reviewCount: 31,
    },
    postedTime: "hace 7 horas",
    offers: 4,
    coordinates: { lat: -33.4189, lng: -70.5953 },
  },
  {
    id: 9,
    title: "Clases de guitarra para principiante",
    description: "Busco alguien que me enseñe los básicos de guitarra. Tengo mi propio instrumento.",
    budget: 15000,
    location: "Ñuñoa, Santiago",
    date: "Sáb, 8 Jun",
    time: "Tarde",
    category: "Clases particulares",
    status: "open",
    postedBy: {
      name: "Diego Flores",
      rating: 4.5,
      reviewCount: 7,
    },
    postedTime: "hace 9 horas",
    offers: 1,
    coordinates: { lat: -33.4569, lng: -70.5978 },
  },
  {
    id: 10,
    title: "Reparación de bicicleta",
    description: "Mi bicicleta tiene problemas con los frenos y cambios. Necesito alguien que sepa repararla.",
    budget: 12000,
    location: "Santiago Centro, Chile",
    date: "Dom, 9 Jun",
    time: "Mañana",
    category: "Reparaciones menores",
    status: "open",
    postedBy: {
      name: "Valentina Rojas",
      rating: 4.6,
      reviewCount: 11,
    },
    postedTime: "hace 10 horas",
    offers: 0,
    coordinates: { lat: -33.4513, lng: -70.6653 },
  },
]

// Dynamic import with optimized loading
const InteractiveMap = dynamic(() => import("@/components/interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-muted rounded-lg flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
        <p className="text-muted-foreground">Cargando mapa...</p>
      </div>
    </div>
  ),
})

// Custom hooks
const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<ServiceLocation | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(DEFAULT_USER_LOCATION)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {
        setUserLocation(DEFAULT_USER_LOCATION)
      },
    )
  }, [])

  return userLocation
}

const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedCategory: "Todas las categorías",
    selectedLocation: "Todas las comunas",
    selectedPriceRange: "Cualquier precio",
    sortBy: "Más recientes",
    showAvailableOnly: true,
    showNoOffersOnly: false,
    workType: "in-person",
    distance: DEFAULT_DISTANCE,
  })

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      selectedCategory: "Todas las categorías",
      selectedLocation: "Todas las comunas",
      selectedPriceRange: "Cualquier precio",
      sortBy: "Más recientes",
      showAvailableOnly: true,
      showNoOffersOnly: false,
      workType: "in-person",
      distance: DEFAULT_DISTANCE,
    })
  }, [])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.selectedCategory !== "Todas las categorías") count++
    if (filters.selectedLocation !== "Todas las comunas") count++
    if (filters.selectedPriceRange !== "Cualquier precio") count++
    if (filters.showNoOffersOnly) count++
    if (!filters.showAvailableOnly) count++
    if (filters.workType !== "all") count++
    if (filters.distance !== DEFAULT_DISTANCE) count++
    return count
  }, [filters])

  return { filters, updateFilter, resetFilters, activeFiltersCount }
}

// Utility functions
const matchesPriceRange = (budget: number, priceRange: string): boolean => {
  switch (priceRange) {
    case "Hasta $5.000":
      return budget <= 5000
    case "$5.000 - $15.000":
      return budget > 5000 && budget <= 15000
    case "$15.000 - $30.000":
      return budget > 15000 && budget <= 30000
    case "Más de $30.000":
      return budget > 30000
    default:
      return true
  }
}

const filterServices = (services: ServiceTaskWithLocation[], filters: FilterState): ServiceTaskWithLocation[] => {
  return services.filter((service) => {
    const matchesSearch =
      filters.searchQuery === "" ||
      service.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(filters.searchQuery.toLowerCase())

    const matchesCategory =
      filters.selectedCategory === "Todas las categorías" ||
      service.category === filters.selectedCategory ||
      filters.selectedCategory.includes(service.category)

    const matchesLocation =
      filters.selectedLocation === "Todas las comunas" || service.location.includes(filters.selectedLocation)

    const matchesPrice =
      filters.selectedPriceRange === "Cualquier precio" || matchesPriceRange(service.budget, filters.selectedPriceRange)

    const matchesAvailableOnly = !filters.showAvailableOnly || service.status === "open"
    const matchesNoOffersOnly = !filters.showNoOffersOnly || service.offers === 0
    const matchesWorkType = filters.workType === "all" || true // Would be based on service.workType in real data

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLocation &&
      matchesPrice &&
      matchesAvailableOnly &&
      matchesNoOffersOnly &&
      matchesWorkType
    )
  })
}

// Optimized components
const ServiceTaskCard = memo<{
  service: ServiceTaskWithLocation
  onSelect: (service: ServiceTaskWithLocation) => void
  isSelected?: boolean
}>(({ service, onSelect, isSelected }) => {
  const handleClick = useCallback(() => onSelect(service), [service, onSelect])

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${isSelected ? "border-primary border-2" : ""}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm line-clamp-2">{service.title}</h3>
          <span className="font-bold text-lg ml-2">{formatCurrency(service.budget)}</span>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{service.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{service.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{service.time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={service.status === "open" ? "default" : "secondary"} className="text-xs">
              {service.status === "open" ? "Abierto" : "Asignado"}
            </Badge>
            {service.urgent && (
              <Badge variant="destructive" className="text-xs">
                URGENTE
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {service.offers} {service.offers === 1 ? "oferta" : "ofertas"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
})

ServiceTaskCard.displayName = "ServiceTaskCard"

const ServiceDetails = memo<{
  service: ServiceTaskWithLocation
  onBack: () => void
}>(({ service, onBack }) => {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleMakeOffer = useCallback(() => {
    console.log("Making offer for service:", service.id)
  }, [service.id])

  const toggleFollow = useCallback(() => {
    setIsFollowing((prev) => !prev)
  }, [])

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Button variant="ghost" onClick={onBack} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al mapa
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant={service.status === "open" ? "default" : "secondary"}>
              {service.status === "open" ? "ABIERTO" : "ASIGNADO"}
            </Badge>
            {service.urgent && <Badge variant="destructive">URGENTE</Badge>}
            <Button variant="outline" size="sm" onClick={toggleFollow}>
              <Heart className={`h-4 w-4 mr-1 ${isFollowing ? "fill-current" : ""}`} />
              {isFollowing ? "Siguiendo" : "Seguir"}
            </Button>
          </div>

          <h1 className="text-2xl font-bold mb-4">{service.title}</h1>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">PUBLICADO POR</span>
                <span className="text-sm text-muted-foreground ml-auto">{service.postedTime}</span>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={service.postedBy.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{service.postedBy.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{service.postedBy.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ⭐ {service.postedBy.rating} ({service.postedBy.reviewCount} reseñas)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">UBICACIÓN</span>
                <Button variant="link" size="sm" className="ml-auto p-0">
                  Ver mapa
                </Button>
              </div>
              <p className="font-medium">{service.location}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">PARA REALIZAR EL</span>
              </div>
              <p className="font-medium">{service.date}</p>
              <p className="text-muted-foreground">{service.time}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Detalles</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">PRESUPUESTO DE LA TAREA</p>
                <p className="text-3xl font-bold">{formatCurrency(service.budget)}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg" onClick={handleMakeOffer}>
                Hacer una oferta
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Más opciones
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full z-[9999]">
                  <DropdownMenuItem>
                    <Flag className="h-4 w-4 mr-2" />
                    Reportar esta tarea
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
})

ServiceDetails.displayName = "ServiceDetails"

// Main component
const BrowseServicesPage = () => {
  const [selectedService, setSelectedService] = useState<ServiceTaskWithLocation | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const userLocation = useUserLocation()
  const { filters, updateFilter, resetFilters, activeFiltersCount } = useFilters()

  const filteredServices = useMemo(() => filterServices(MOCK_SERVICES, filters), [filters])

  const handleSelectService = useCallback((service: ServiceTaskWithLocation) => {
    setSelectedService(service)
  }, [])

  const handleClearSelectedService = useCallback(() => {
    setSelectedService(null)
  }, [])

  const handleCloseFilters = useCallback(() => {
    setIsFilterOpen(false)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Search and Filters Bar */}
      <div className="border-t-0 border-b bg-background/95 backdrop-blur sticky top-14 z-40 -mt-[1px]">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar una tarea"
                value={filters.searchQuery}
                onChange={(e) => updateFilter("searchQuery", e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>

            {/* Filters Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button className="h-12 px-6 gap-2 text-base">
                  <Filter className="h-5 w-5" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                  <SheetDescription>Ajusta los filtros para encontrar exactamente lo que buscas</SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6 overflow-y-auto flex-1 max-h-[calc(100vh-200px)]">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">CATEGORÍA</h3>
                    <Select
                      value={filters.selectedCategory}
                      onValueChange={(value) => updateFilter("selectedCategory", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{category}</span>
                              {category !== "Todas las categorías" &&
                                CATEGORY_DESCRIPTIONS[category as keyof typeof CATEGORY_DESCRIPTIONS] && (
                                  <span className="text-xs text-muted-foreground mt-1 max-w-[250px]">
                                    {CATEGORY_DESCRIPTIONS[category as keyof typeof CATEGORY_DESCRIPTIONS]}
                                  </span>
                                )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">UBICACIÓN</h3>
                    <Select
                      value={filters.selectedLocation}
                      onValueChange={(value) => updateFilter("selectedLocation", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">RANGO DE PRECIO</h3>
                    <Select
                      value={filters.selectedPriceRange}
                      onValueChange={(value) => updateFilter("selectedPriceRange", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Precio" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRICE_RANGES.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">ORDENAR POR</h3>
                    <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ordenar" />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Work Type Selection */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">TIPO DE TRABAJO</h3>
                    <div className="flex gap-2">
                      <Button
                        variant={filters.workType === "in-person" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter("workType", "in-person")}
                        className="flex-1"
                      >
                        Presencial
                      </Button>
                      <Button
                        variant={filters.workType === "remotely" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter("workType", "remotely")}
                        className="flex-1"
                      >
                        Remoto
                      </Button>
                      <Button
                        variant={filters.workType === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter("workType", "all")}
                        className="flex-1"
                      >
                        Todos
                      </Button>
                    </div>
                  </div>

                  {/* Distance Slider */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">DISTANCIA</h3>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{filters.distance}km</p>
                    </div>
                    <div className="px-4">
                      <Slider
                        value={[filters.distance]}
                        onValueChange={(value) => updateFilter("distance", value[0])}
                        max={MAX_DISTANCE}
                        min={MIN_DISTANCE}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Other Filters */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">OTROS FILTROS</h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-base font-medium">Solo tareas disponibles</h4>
                        <p className="text-sm text-muted-foreground">Ocultar tareas que ya están asignadas</p>
                      </div>
                      <Switch
                        checked={filters.showAvailableOnly}
                        onCheckedChange={(checked) => updateFilter("showAvailableOnly", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-base font-medium">Solo tareas sin ofertas</h4>
                        <p className="text-sm text-muted-foreground">Ocultar tareas que tienen ofertas</p>
                      </div>
                      <Switch
                        checked={filters.showNoOffersOnly}
                        onCheckedChange={(checked) => updateFilter("showNoOffersOnly", checked)}
                      />
                    </div>
                  </div>
                </div>

                <SheetFooter className="flex gap-2">
                  {activeFiltersCount > 0 && (
                    <Button variant="outline" onClick={resetFilters} className="flex-1">
                      Limpiar filtros
                    </Button>
                  )}
                  <Button onClick={handleCloseFilters} className="flex-1">
                    Aplicar filtros
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Services List */}
            <div className="lg:col-span-1 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{filteredServices.length} tareas disponibles</h2>
              </div>

              <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: "calc(100vh - 180px)" }}>
                {filteredServices.map((service) => (
                  <ServiceTaskCard
                    key={service.id}
                    service={service}
                    onSelect={handleSelectService}
                    isSelected={selectedService?.id === service.id}
                  />
                ))}

                {filteredServices.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No se encontraron tareas que coincidan con tus filtros.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-2 relative z-0">
              <div className="sticky top-[180px]">
                <Card className="h-[calc(100vh-180px)]">
                  <CardContent className="p-0 h-full">
                    {selectedService ? (
                      <ServiceDetails service={selectedService} onBack={handleClearSelectedService} />
                    ) : (
                      userLocation && (
                        <InteractiveMap
                          services={filteredServices}
                          userLocation={userLocation}
                          onSelectService={handleSelectService}
                          selectedService={selectedService}
                        />
                      )
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default BrowseServicesPage
