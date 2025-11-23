"use client";

import { useState, useMemo, useCallback, memo, useEffect, useRef } from "react";
import { Header } from "@/components/header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Users,
  Loader2,
  Filter,
  Star,
  Shield,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { ServiceTask } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Types
interface ServiceLocation {
  lat: number;
  lng: number;
}

interface ServiceTaskWithLocation extends ServiceTask {
  coordinates: ServiceLocation;
}

type WorkType = "in-person" | "remotely" | "all";

interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedLocation: string;
  selectedPriceRange: string;
  sortBy: string;
  showAvailableOnly: boolean;
  showNoOffersOnly: boolean;
  workType: WorkType;
  distance: number;
}

// Constants
const DEFAULT_USER_LOCATION: ServiceLocation = { lat: -33.4513, lng: -70.6653 }; // Santiago Centro
const DEFAULT_DISTANCE = 10;
const MAX_DISTANCE = 20;
const MIN_DISTANCE = 1;

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
] as const;

const CATEGORY_DESCRIPTIONS = {
  "Aseo del hogar":
    "Limpieza por hora o por evento para casas de estudiantes y jóvenes profesionales.",
  "Lavado y planchado":
    "Lavado de ropa y planchado con retiro a domicilio. Simple, cómodo y rápido.",
  "Ayuda académica":
    "Tutorías entre estudiantes en ramos como Álgebra, Finanzas o Inglés.",
  "Reparaciones menores":
    "Arreglos simples: enchufes, llaves, muebles sueltos. Soluciones express.",
  "Recados y compras":
    "Delegá trámites o compras urgentes. No pierdas tiempo en filas.",
  "Ayuda creativa":
    "Ideas para regalos, decoración, cocina casera y soluciones fuera de lo común.",
  Mudanzas:
    "Ayuda con mudanzas pequeñas, transporte de muebles y organización.",
  "Cuidado de mascotas":
    "Paseo de perros, alimentación y cuidado temporal de mascotas.",
  "Clases particulares":
    "Clases personalizadas de música, idiomas, deportes y más.",
} as const;

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
] as const;

const PRICE_RANGES = [
  "Cualquier precio",
  "Hasta $5.000",
  "$5.000 - $15.000",
  "$15.000 - $30.000",
  "Más de $30.000",
] as const;

const SORT_OPTIONS = [
  "Más recientes",
  "Precio: menor a mayor",
  "Precio: mayor a menor",
  "Más ofertas",
  "Mejor calificado",
] as const;

// Mock data
const MOCK_SERVICES: ServiceTaskWithLocation[] = [
  {
    id: 1,
    title: "Limpieza profunda de departamento",
    description:
      "Necesito limpieza completa de departamento de 2 habitaciones. Incluye baños, cocina y aspirado.",
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
    description:
      "Necesito que hagan compras en el supermercado y recojan medicamentos en la farmacia. Lista incluida.",
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
      avatar: "/images/juan-perez.jpg",
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
    description:
      "Tengo acumulada mucha ropa para lavar y planchar. Busco servicio con retiro y entrega a domicilio.",
    budget: 18000,
    location: "La Reina, Santiago",
    date: "Lun, 10 Jun",
    time: "Todo el día",
    category: "Lavado y planchado",
    status: "open",
    postedBy: {
      name: "Sofía Herrera",
      avatar: "/images/josefa.jpg",
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
      avatar: "/images/juan-perez.jpg",
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
    description:
      "Necesito ayuda para mover algunas cajas y muebles pequeños a mi nuevo departamento.",
    budget: 20000,
    location: "Providencia, Santiago",
    date: "Vie, 7 Jun",
    time: "Tarde",
    category: "Mudanzas",
    status: "open",
    postedBy: {
      name: "Roberto Méndez",
      avatar: "/images/hernan.jpg",
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
    description:
      "Necesito alguien que pasee a mi perro durante una semana mientras estoy de viaje.",
    budget: 35000,
    location: "Las Condes, Santiago",
    date: "Lun, 10 Jun",
    time: "Mañana",
    category: "Cuidado de mascotas",
    status: "open",
    postedBy: {
      name: "Carolina Vega",
      avatar: "/images/josefa.jpg",
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
    description:
      "Busco alguien que me enseñe los básicos de guitarra. Tengo mi propio instrumento.",
    budget: 15000,
    location: "Ñuñoa, Santiago",
    date: "Sáb, 8 Jun",
    time: "Tarde",
    category: "Clases particulares",
    status: "open",
    postedBy: {
      name: "Diego Flores",
      avatar: "/images/juan-perez.jpg",
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
    description:
      "Mi bicicleta tiene problemas con los frenos y cambios. Necesito alguien que sepa repararla.",
    budget: 12000,
    location: "Santiago Centro, Chile",
    date: "Dom, 9 Jun",
    time: "Mañana",
    category: "Reparaciones menores",
    status: "open",
    postedBy: {
      name: "Valentina Rojas",
      avatar: "/images/hernan.jpg",
      rating: 4.6,
      reviewCount: 11,
    },
    postedTime: "hace 10 horas",
    offers: 0,
    coordinates: { lat: -33.4513, lng: -70.6653 },
  },
];

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
});

// Custom hooks
const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<ServiceLocation | null>(
    null,
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(DEFAULT_USER_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setUserLocation(DEFAULT_USER_LOCATION);
      },
    );
  }, []);

  return userLocation;
};

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
  });

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

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
    });
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.selectedCategory !== "Todas las categorías") count++;
    if (filters.selectedLocation !== "Todas las comunas") count++;
    if (filters.selectedPriceRange !== "Cualquier precio") count++;
    if (filters.showNoOffersOnly) count++;
    if (!filters.showAvailableOnly) count++;
    if (filters.workType !== "all") count++;
    if (filters.distance !== DEFAULT_DISTANCE) count++;
    return count;
  }, [filters]);

  return { filters, updateFilter, resetFilters, activeFiltersCount };
};

// Utility functions
const matchesPriceRange = (budget: number, priceRange: string): boolean => {
  switch (priceRange) {
    case "Hasta $5.000":
      return budget <= 5000;
    case "$5.000 - $15.000":
      return budget > 5000 && budget <= 15000;
    case "$15.000 - $30.000":
      return budget > 15000 && budget <= 30000;
    case "Más de $30.000":
      return budget > 30000;
    default:
      return true;
  }
};

const filterServices = (
  services: ServiceTaskWithLocation[],
  filters: FilterState,
): ServiceTaskWithLocation[] => {
  return services.filter((service) => {
    const matchesSearch =
      filters.searchQuery === "" ||
      service.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      service.description
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase());

    const matchesCategory =
      filters.selectedCategory === "Todas las categorías" ||
      service.category === filters.selectedCategory ||
      filters.selectedCategory.includes(service.category);

    const matchesLocation =
      filters.selectedLocation === "Todas las comunas" ||
      service.location.includes(filters.selectedLocation);

    const matchesPrice =
      filters.selectedPriceRange === "Cualquier precio" ||
      matchesPriceRange(service.budget, filters.selectedPriceRange);

    const matchesAvailableOnly =
      !filters.showAvailableOnly || service.status === "open";
    const matchesNoOffersOnly =
      !filters.showNoOffersOnly || service.offers === 0;
    const matchesWorkType = filters.workType === "all" || true; // Would be based on service.workType in real data

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLocation &&
      matchesPrice &&
      matchesAvailableOnly &&
      matchesNoOffersOnly &&
      matchesWorkType
    );
  });
};

// Optimized components
const ServiceTaskCard = memo<{
  service: ServiceTaskWithLocation;
  onSelect: (service: ServiceTaskWithLocation) => void;
  isSelected?: boolean;
}>(({ service, onSelect, isSelected }) => {
  const handleClick = useCallback(() => onSelect(service), [service, onSelect]);

  return (
    <Card
      className={`cursor-pointer border transition-all shadow-sm hover:shadow-md rounded-xl overflow-hidden group ${
        isSelected 
          ? "bg-blue-50/50 border-blue-500 ring-1 ring-blue-500" 
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-5 flex flex-col h-full">
        {/* Header: Avatar + Title + Price */}
        <div className="flex gap-4 mb-4">
          <Avatar className="h-12 w-12 shrink-0 border border-gray-100 shadow-sm">
            <AvatarImage
              src={service.postedBy.avatar || "/placeholder-user.jpg"}
              className="object-cover"
            />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
              {service.postedBy.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-3">
              <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              <span className="font-bold text-lg text-blue-600 whitespace-nowrap shrink-0 tracking-tight">
                {formatCurrency(service.budget)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 truncate">
              Publicado por {service.postedBy.name}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-y-2.5 mb-4 text-sm text-gray-600 bg-gray-50/80 p-3 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
            <span className="truncate font-medium">{service.location}</span>
          </div>
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
              <span>{service.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500 shrink-0" />
              <span>{service.time}</span>
            </div>
          </div>
        </div>

        {/* Footer: Status + Offers */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <Badge 
            variant={service.status === "open" ? "secondary" : "outline"} 
            className={`${
              service.status === "open" 
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } font-medium px-3 py-1 rounded-full transition-colors`}
          >
            {service.status === "open" ? "Abierto" : "Asignado"}
          </Badge>
          
          {service.offers > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Users className="h-3.5 w-3.5" />
              <span>{service.offers} {service.offers === 1 ? "oferta" : "ofertas"}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

ServiceTaskCard.displayName = "ServiceTaskCard";

const ServiceDetails = memo<{
  service: ServiceTaskWithLocation;
  onBack: () => void;
  onViewOnMap: () => void;
}>(({ service, onBack, onViewOnMap }) => {
  const isMobile = useIsMobile();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState(service.budget.toString());
  const [offerMessage, setOfferMessage] = useState("");

  const handleMakeOfferClick = useCallback(() => {
    setIsOfferModalOpen(true);
  }, []);

  const handleSubmitOffer = useCallback(() => {
    // Logic to submit offer would go here
    console.log("Submitting offer:", {
      serviceId: service.id,
      amount: offerAmount,
      message: offerMessage,
    });
    setIsOfferModalOpen(false);
    setOfferMessage("");
  }, [service.id, offerAmount, offerMessage]);

  const toggleFollow = useCallback(() => {
    setIsFollowing((prev) => !prev);
  }, []);

  return (
    <>
      <div className="p-6 overflow-y-auto h-full flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Button variant="ghost" onClick={onBack} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isMobile ? "Volver a servicios" : "Volver al mapa"}
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant={service.status === "open" ? "default" : "secondary"}
                className="h-8 px-3 flex items-center justify-center"
              >
                {service.status === "open" ? "ABIERTO" : "ASIGNADO"}
              </Badge>
              {service.urgent && (
                <Badge
                  variant="destructive"
                  className="h-8 px-3 flex items-center justify-center"
                >
                  URGENTE
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFollow}
                className="h-8 px-3"
              >
                <Heart
                  className={`h-4 w-4 mr-1.5 ${isFollowing ? "fill-current text-red-500" : ""}`}
                />
                {isFollowing ? "Siguiendo" : "Seguir"}
              </Button>
            </div>

            <h1 className="text-4xl font-bold mb-6 text-gray-900 leading-tight">
              {service.title}
            </h1>

            <div className="space-y-8">
              {/* Posted By Section */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12 border border-gray-200">
                    <AvatarImage
                      src={service.postedBy.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-gray-100 text-gray-500 font-medium text-lg">
                      {service.postedBy.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <button
                          type="button"
                          className="font-semibold text-base text-gray-900 hover:text-blue-600 transition-colors cursor-pointer text-left"
                        >
                          {service.postedBy.name}
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {service.postedBy.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {service.location}
                            </p>
                          </div>

                          {/* Star Rating */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }, (_, i) => {
                                const starIndex = i;
                                const rating = service.postedBy.rating;
                                const filled = starIndex < rating;

                                return (
                                  <Star
                                    key={`star-${starIndex}-${service.postedBy.name}`}
                                    className={`h-5 w-5 ${
                                      filled
                                        ? "fill-gray-400 text-gray-400"
                                        : "fill-none text-gray-300"
                                    }`}
                                  />
                                );
                              })}
                            </div>
                            <span className="text-sm text-gray-600">
                              ({service.postedBy.reviewCount}{" "}
                              {service.postedBy.reviewCount === 1
                                ? "reseña"
                                : "reseñas"}
                              )
                            </span>
                          </div>

                          <div className="pt-2 border-t border-gray-200">
                            <Button
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 rounded-lg"
                              onClick={() => {
                                // Navigate to profile page
                                window.location.href = `/profile/${service.postedBy.name}`;
                              }}
                            >
                              Ver perfil público
                            </Button>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                      <span>Publicado {service.postedTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg shrink-0 mt-0.5">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      UBICACIÓN
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-blue-600 hover:text-blue-700 font-medium"
                      onClick={onViewOnMap}
                    >
                      Ver mapa
                    </Button>
                  </div>
                  <p className="font-medium text-gray-900 text-base">
                    {service.location}
                  </p>
                </div>
              </div>

              {/* Date/Time Section */}
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg shrink-0 mt-0.5">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                    FECHA DE REALIZACIÓN
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-base capitalize">
                      {service.date}
                    </p>
                    <span className="text-gray-300">•</span>
                    <p className="text-gray-600">{service.time}</p>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-lg mb-3 text-gray-900">
                  Detalles
                </h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  {service.description}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl !gap-2 !py-2">
              <CardHeader className="pb-2 pt-6 px-6">
                <div className="text-center">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    PRESUPUESTO DE LA TAREA
                  </p>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">
                    {formatCurrency(service.budget)}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5 px-5 pb-5">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 rounded-lg shadow-sm text-sm"
                  onClick={handleMakeOfferClick}
                >
                  Hacer una oferta
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium h-10 rounded-lg text-sm"
                    >
                      Más opciones
                      <ChevronDown className="h-3.5 w-3.5 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full z-9999">
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

      {/* Make Offer Modal */}
      <Dialog open={isOfferModalOpen} onOpenChange={setIsOfferModalOpen}>
        <DialogContent className="sm:max-w-md bg-white p-0 gap-0 overflow-hidden rounded-xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Hacer una oferta
            </DialogTitle>
            <DialogDescription>
              Envía tu propuesta para esta tarea
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Task Summary Card */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-start gap-3">
              <div className="bg-white p-2 rounded-md border border-gray-200 shrink-0">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                  {service.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Presupuesto del cliente:{" "}
                  <span className="font-semibold text-gray-700">
                    {formatCurrency(service.budget)}
                  </span>
                </p>
              </div>
            </div>

            {/* Offer Amount */}
            <div className="space-y-3">
              <Label
                htmlFor="amount"
                className="text-sm font-semibold text-gray-700"
              >
                Tu oferta ($)
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="pl-8 text-lg h-12 font-semibold text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Pago seguro a través de la plataforma
              </p>
            </div>

            {/* Offer Message */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="message"
                  className="text-sm font-semibold text-gray-700"
                >
                  Mensaje
                </Label>
                <span className="text-[10px] text-gray-400 uppercase font-medium tracking-wide">
                  Opcional
                </span>
              </div>
              <Textarea
                id="message"
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder="Hola, me interesa tu tarea. Tengo experiencia en..."
                className="min-h-[100px] resize-none text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-row">
            <Button
              variant="outline"
              onClick={() => setIsOfferModalOpen(false)}
              className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-white hover:text-gray-900"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitOffer}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
            >
              Enviar oferta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

ServiceDetails.displayName = "ServiceDetails";

// Main component
const BrowseServicesPage = () => {
  const [selectedService, setSelectedService] =
    useState<ServiceTaskWithLocation | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [flyToServiceTrigger, setFlyToServiceTrigger] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  const userLocation = useUserLocation();
  const { filters, updateFilter, resetFilters, activeFiltersCount } =
    useFilters();

  const filteredServices = useMemo(
    () => filterServices(MOCK_SERVICES, filters),
    [filters],
  );

  const handleSelectService = useCallback(
    (service: ServiceTaskWithLocation | null) => {
      if (service) {
        setSelectedService(service);
        setShowDetails(true);
      }
    },
    [],
  );

  const handleClearSelectedService = () => {
    // En lugar de cambiar el estado directamente, ejecutar animación de salida
    handleExitAnimation();
  }

  const handleViewOnMap = useCallback(() => {
    setShowDetails(false);
    // Trigger flyTo immediately by updating timestamp
    setFlyToServiceTrigger(Date.now());
  }, []);

  const handleCloseFilters = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  // Ref para la animación del panel de detalles
  const detailsPanelRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Ref para controlar si estamos en proceso de salida
  const isExitingRef = useRef(false);

  // Animación GSAP para el panel de detalles (entrada y salida)
  // Animación GSAP para el panel de detalles (entrada y salida)
  useGSAP(() => {
    const panel = detailsPanelRef.current;
    if (!panel) return;

    // Limpiar timeline anterior si existe
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    if (showDetails && selectedService && !isExitingRef.current) {
      // === ANIMACIÓN DE ENTRADA ===
      // Estado inicial: todo el panel fuera de pantalla
      gsap.set(panel, {
        x: "100%", // Desplazado completamente a la derecha
        opacity: 1, // Opaco (el panel en sí)
        visibility: "visible", // Visible para poder animarlo
      });

      // Animar todo el contenedor hacia dentro
      gsap.to(panel, {
        x: "0%", // Desliza hacia su posición final
        duration: 0.8,
        ease: "power2.out", // Lento al inicio, rápido al final
      });
    }
  }, [showDetails, selectedService]);

  // Función separada para manejar la animación de salida
  const handleExitAnimation = useCallback(() => {
    const panel = detailsPanelRef.current;
    if (!panel || isExitingRef.current) return;

    isExitingRef.current = true;

    // === ANIMACIÓN DE SALIDA ===
    // Animar todo el panel hacia fuera
    gsap.to(panel, {
      x: "100%", // Desliza completamente hacia la derecha
      duration: 0.6,
      ease: "power2.in", // Rápido al inicio, lento al final
      onComplete: () => {
        // Cambiar el estado DESPUÉS de que termine la animación
        setShowDetails(false);
        setSelectedService(null);
        isExitingRef.current = false;

        // Ocultar completamente
        gsap.set(panel, {
          visibility: "hidden",
          x: "100%",
        });
      },
    });
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />

      {/* Search and Filters Bar */}
      <div className="border-b border-gray-200 bg-white/95 backdrop-blur shrink-0 z-50">
        <div className="container mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar una tarea"
                value={filters.searchQuery}
                onChange={(e) => updateFilter("searchQuery", e.target.value)}
                className="pl-12 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
              />
            </div>

            {/* Filters Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button className="h-12 px-3 md:px-6 gap-2 text-base bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm">
                  <Filter className="h-5 w-5" />
                  <span className="hidden md:inline">Filtros</span>
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-blue-100 text-blue-700 border-0"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:max-w-md flex flex-col bg-white p-0"
              >
                <SheetHeader className="pb-6 px-6 pt-6 border-b border-gray-200">
                  <SheetTitle className="text-xl font-semibold text-gray-900">
                    Filtros
                  </SheetTitle>
                  <SheetDescription className="text-sm text-gray-600 mt-2">
                    Ajusta los filtros para encontrar exactamente lo que buscas
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col py-6 overflow-y-auto flex-1 min-h-0 px-6">
                  {/* Category Filter */}
                  <div className="space-y-3 mb-8">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      CATEGORÍA
                    </h3>
                    <Select
                      value={filters.selectedCategory}
                      onValueChange={(value) =>
                        updateFilter("selectedCategory", value)
                      }
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
                                CATEGORY_DESCRIPTIONS[
                                  category as keyof typeof CATEGORY_DESCRIPTIONS
                                ] && (
                                  <span className="text-xs text-muted-foreground mt-1 max-w-[250px]">
                                    {
                                      CATEGORY_DESCRIPTIONS[
                                        category as keyof typeof CATEGORY_DESCRIPTIONS
                                      ]
                                    }
                                  </span>
                                )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-3 mb-8">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      UBICACIÓN
                    </h3>
                    <Select
                      value={filters.selectedLocation}
                      onValueChange={(value) =>
                        updateFilter("selectedLocation", value)
                      }
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
                  <div className="space-y-3 mb-8">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      RANGO DE PRECIO
                    </h3>
                    <Select
                      value={filters.selectedPriceRange}
                      onValueChange={(value) =>
                        updateFilter("selectedPriceRange", value)
                      }
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
                  <div className="space-y-3 mb-8">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      ORDENAR POR
                    </h3>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) => updateFilter("sortBy", value)}
                    >
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
                  <div className="space-y-3 mb-8">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      TIPO DE TRABAJO
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant={
                          filters.workType === "in-person"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => updateFilter("workType", "in-person")}
                        className="flex-1"
                      >
                        Presencial
                      </Button>
                      <Button
                        variant={
                          filters.workType === "remotely"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => updateFilter("workType", "remotely")}
                        className="flex-1"
                      >
                        Remoto
                      </Button>
                      <Button
                        variant={
                          filters.workType === "all" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => updateFilter("workType", "all")}
                        className="flex-1"
                      >
                        Todos
                      </Button>
                    </div>
                  </div>

                  {/* Distance Slider - Animated */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      filters.workType !== "remotely"
                        ? "grid-rows-[1fr] opacity-100 mb-8"
                        : "grid-rows-[0fr] opacity-0 mb-0"
                    }`}
                  >
                    <div className="overflow-hidden min-h-0">
                      <div className="space-y-4 pt-1 px-1">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          DISTANCIA
                        </h3>
                        <div className="text-center py-2">
                          <p className="text-2xl font-bold text-gray-900">
                            {filters.distance} km
                          </p>
                        </div>
                        <div className="px-4 pb-2">
                          <Slider
                            value={[filters.distance]}
                            onValueChange={(value) =>
                              updateFilter("distance", value[0])
                            }
                            max={MAX_DISTANCE}
                            min={MIN_DISTANCE}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other Filters */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      OTROS FILTROS
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                        <div className="space-y-1 flex-1">
                          <h4 className="text-sm font-semibold text-gray-900">
                            Solo tareas disponibles
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Ocultar tareas que ya están asignadas
                          </p>
                        </div>
                        <Switch
                          checked={filters.showAvailableOnly}
                          onCheckedChange={(checked) =>
                            updateFilter("showAvailableOnly", checked)
                          }
                          className="mt-0.5"
                        />
                      </div>

                      <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                        <div className="space-y-1 flex-1">
                          <h4 className="text-sm font-semibold text-gray-900">
                            Solo tareas sin ofertas
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Ocultar tareas que tienen ofertas
                          </p>
                        </div>
                        <Switch
                          checked={filters.showNoOffersOnly}
                          onCheckedChange={(checked) =>
                            updateFilter("showNoOffersOnly", checked)
                          }
                          className="mt-0.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <SheetFooter className="flex gap-3 pt-4 px-6 pb-6 border-t border-gray-200 mt-auto shrink-0">
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Limpiar filtros
                    </Button>
                  )}
                  <Button
                    onClick={handleCloseFilters}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Aplicar filtros
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-gray-50/50 overflow-hidden">
        <div className="container mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* Services List */}
            <div className="lg:col-span-1 relative z-10 flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h2 className="text-base font-semibold text-gray-900">
                  {filteredServices.length} tareas disponibles
                </h2>
              </div>

              <div
                ref={scrollContainerRef}
                className="space-y-3 overflow-y-auto pr-2 flex-1 min-h-0 scrollbar-hide-on-idle"
                onScroll={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.classList.add("scrolling");
                    if (scrollTimeoutRef.current) {
                      clearTimeout(scrollTimeoutRef.current);
                    }
                    scrollTimeoutRef.current = setTimeout(() => {
                      if (scrollContainerRef.current) {
                        scrollContainerRef.current.classList.remove(
                          "scrolling",
                        );
                      }
                    }, 1000);
                  }
                }}
              >
                {filteredServices.map((service) => (
                  <ServiceTaskCard
                    key={service.id}
                    service={service}
                    onSelect={handleSelectService}
                    isSelected={selectedService?.id === service.id}
                  />
                ))}

                {filteredServices.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">
                      No se encontraron tareas que coincidan con tus filtros.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Map - Hidden on mobile */}
            <div className="hidden lg:block lg:col-span-2 relative z-0 h-full overflow-hidden">
              <Card className="p-0 h-full bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-0 h-full rounded-xl overflow-hidden relative">
                  {/* Keep map mounted but hidden when showing details */}
                  <div className={showDetails ? "hidden" : "h-full"}>
                    {userLocation && (
                      <InteractiveMap
                        services={filteredServices}
                        userLocation={userLocation}
                        onSelectService={handleSelectService}
                        selectedService={selectedService}
                        flyToServiceTrigger={flyToServiceTrigger}
                      />
                    )}
                  </div>

                  {/* Show details overlay when selected - Desktop only */}
                  {(showDetails || isExitingRef.current) && selectedService && (
                    <div
                      ref={detailsPanelRef}
                      className="hidden lg:block absolute inset-0 bg-white z-10"
                      style={{
                        transform: "translateX(100%)", // Estado inicial fuera de pantalla
                        visibility: "hidden", // Oculto hasta que GSAP tome control
                      }}
                    >
                      <ServiceDetails
                        service={selectedService}
                        onBack={handleClearSelectedService}
                        onViewOnMap={handleViewOnMap}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sheet for Service Details */}
      <Sheet 
        open={isMobile && selectedService !== null && showDetails} 
        onOpenChange={(open) => {
          if (!open) {
            handleClearSelectedService();
          }
        }}
      >
        <SheetContent 
          side="right" 
          className="w-full sm:max-w-lg p-0 overflow-y-auto [&>button]:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Detalles del servicio</SheetTitle>
          </SheetHeader>
          {selectedService && (
            <div className="h-full">
              <ServiceDetails
                service={selectedService}
                onBack={handleClearSelectedService}
                onViewOnMap={() => {
                  // En mobile, no hay mapa, así que solo cerramos
                  handleClearSelectedService();
                }}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BrowseServicesPage;
