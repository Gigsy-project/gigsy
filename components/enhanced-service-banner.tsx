"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Calendar,
  Navigation,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "./language-provider"

interface QuickTask {
  id: number
  title: string
  budget: number
  location: string
  time: string
  urgent?: boolean
  category: string
}

const quickTasks: QuickTask[] = [
  {
    id: 1,
    title: "Mudanza de apartamento",
    budget: 25000,
    location: "Las Condes",
    time: "Hoy",
    category: "Mudanzas",
    urgent: true,
  },
  {
    id: 2,
    title: "Limpieza profunda",
    budget: 15000,
    location: "Providencia",
    time: "Mañana",
    category: "Limpieza",
  },
  {
    id: 3,
    title: "Delivery urgente",
    budget: 3000,
    location: "Santiago Centro",
    time: "2 horas",
    category: "Delivery",
    urgent: true,
  },
]

const serviceCategories = [
  "Mudanzas",
  "Limpieza",
  "Delivery",
  "Montaje",
  "Jardinería",
  "Reparaciones",
  "Pintura",
  "Electricidad",
  "Plomería",
  "Cuidado de mascotas",
  "Cuidado de niños",
  "Cuidado de adultos mayores",
  "Belleza",
  "Masajes",
  "Tutorías",
  "Traducción",
  "Fotografía",
  "Eventos",
  "Catering",
  "Seguridad",
  "Construcción",
  "Carpintería",
]

const sortOptions = [
  { value: "recommended", label: "Recomendado", icon: Star },
  { value: "recent", label: "Más recientes", icon: Clock },
  { value: "due-soon", label: "Vencen pronto", icon: Calendar },
  { value: "closest", label: "Más cercanos", icon: Navigation },
  { value: "lowest-price", label: "Precio menor", icon: DollarSign },
  { value: "highest-price", label: "Precio mayor", icon: DollarSign },
]

export function EnhancedServiceBanner() {
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([1000, 50000])
  const [distance, setDistance] = useState([50])
  const [sortBy, setSortBy] = useState("recommended")
  const [categorySearch, setCategorySearch] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const filteredCategories = serviceCategories.filter((category) =>
    category.toLowerCase().includes(categorySearch.toLowerCase()),
  )

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setPriceRange([1000, 50000])
    setDistance([50])
    setSortBy("recommended")
    setSearchQuery("")
    setCategorySearch("")
  }

  const activeFiltersCount =
    selectedCategories.length +
    (priceRange[0] !== 1000 || priceRange[1] !== 50000 ? 1 : 0) +
    (distance[0] !== 50 ? 1 : 0)

  return (
    <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container">
        <div className="py-4">
          {/* Main Banner Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="font-medium">Servicios disponibles</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {quickTasks.filter((task) => task.urgent).length} URGENTES
                </Badge>
              </div>

              {!isExpanded && (
                <div className="hidden lg:flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Mudanzas desde $15.000</span>
                  <span>•</span>
                  <span>Limpieza desde $8.000</span>
                  <span>•</span>
                  <span>Delivery desde $2.000</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="default" size="sm">
                <Link href="/browse-services">Ver todos</Link>
              </Button>

              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="p-2">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Search and Filters Row */}
          {isExpanded && (
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar servicios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  {/* Categories Filter */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Categorías
                        {selectedCategories.length > 0 && (
                          <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                            {selectedCategories.length}
                          </Badge>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                          <span className="text-muted-foreground font-normal">TODAS LAS CATEGORÍAS</span>
                          <Button variant="link" size="sm" onClick={clearAllFilters} className="text-primary p-0">
                            Limpiar todo
                          </Button>
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar categorías"
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="pl-10"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {filteredCategories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => handleCategoryToggle(category)}
                              />
                              <label
                                htmlFor={category}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setSelectedCategories([])}>
                            Cancelar
                          </Button>
                          <Button>Aplicar</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Price Filter */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Precio
                        {(priceRange[0] !== 1000 || priceRange[1] !== 50000) && (
                          <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                            1
                          </Badge>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-muted-foreground font-normal">PRECIO DE LA TAREA</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                          </p>
                        </div>

                        <div className="px-4">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={100000}
                            min={1000}
                            step={1000}
                            className="w-full"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setPriceRange([1000, 50000])}>
                            Cancelar
                          </Button>
                          <Button>Aplicar</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Distance Filter */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        Distancia
                        {distance[0] !== 50 && (
                          <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                            1
                          </Badge>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-muted-foreground font-normal">DISTANCIA</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{distance[0]}km</p>
                        </div>

                        <div className="px-4">
                          <Slider
                            value={distance}
                            onValueChange={setDistance}
                            max={100}
                            min={5}
                            step={5}
                            className="w-full"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setDistance([50])}>
                            Cancelar
                          </Button>
                          <Button>Aplicar</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Sort Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Ordenar
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {sortOptions.map((option) => {
                        const IconComponent = option.icon
                        return (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className={sortBy === option.value ? "bg-accent" : ""}
                          >
                            <IconComponent className="h-4 w-4 mr-2" />
                            {option.label}
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Limpiar filtros ({activeFiltersCount})
                    </Button>
                  )}
                </div>
              </div>

              {/* Quick Tasks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickTasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm line-clamp-2 flex-1">{task.title}</h4>
                        {task.urgent && (
                          <Badge variant="destructive" className="text-xs ml-2">
                            URGENTE
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="font-medium text-foreground">{formatCurrency(task.budget)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{task.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{task.time}</span>
                        </div>
                      </div>

                      <Button size="sm" className="w-full mt-3" variant="outline">
                        Ver detalles
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
