"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"
import { Link } from "@/i18n/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Globe, Heart, MapPin, Shield, Star, Edit } from "lucide-react"
import { ProviderProfileModal } from "@/components/provider-profile-modal"

// Mock data for CV sections
const experienceData = [
  {
    id: 1,
    position: "Especialista en Limpieza Profesional",
    company: "CleanPro Services",
    type: "Tiempo completo",
    duration: "ene. 2022 - actualidad",
    period: "2 años 4 meses",
    location: "Santiago, Chile",
    description:
      "Responsable de servicios de limpieza especializada para oficinas y hogares. Manejo de equipos profesionales y productos eco-friendly.",
    skills: ["Limpieza", "Organización", "Atención al cliente"],
    logo: "/placeholder.svg?height=40&width=40&text=CP",
  },
  {
    id: 2,
    position: "Técnico en Mantenimiento",
    company: "Servicios Integrales Pérez",
    type: "Independiente",
    duration: "mar. 2020 - dic. 2021",
    period: "1 año 10 meses",
    location: "Santiago, Chile",
    description: "Servicios de mantenimiento general, reparaciones menores y jardinería para clientes residenciales.",
    skills: ["Reparaciones", "Jardinería", "Mantenimiento"],
    logo: "/placeholder.svg?height=40&width=40&text=SP",
  },
  {
    id: 3,
    position: "Asistente de Limpieza",
    company: "Hotel Plaza Santiago",
    type: "Tiempo parcial",
    duration: "jun. 2019 - feb. 2020",
    period: "9 meses",
    location: "Santiago, Chile",
    description: "Limpieza y mantenimiento de habitaciones de hotel, siguiendo estándares de calidad internacional.",
    skills: ["Limpieza", "Trabajo en equipo", "Puntualidad"],
    logo: "/placeholder.svg?height=40&width=40&text=HP",
  },
]

const educationData = [
  {
    id: 1,
    institution: "Instituto Técnico de Santiago",
    degree: "Técnico en Servicios de Limpieza Industrial",
    field: "Limpieza y Mantenimiento",
    duration: "2018 - 2019",
    description: "Certificación en técnicas avanzadas de limpieza, uso de equipos especializados y productos químicos.",
    skills: ["Limpieza Industrial", "Seguridad Laboral"],
    logo: "/placeholder.svg?height=40&width=40&text=ITS",
  },
  {
    id: 2,
    institution: "Centro de Capacitación Laboral",
    degree: "Curso de Jardinería y Paisajismo",
    field: "Jardinería",
    duration: "2020",
    description: "Curso especializado en mantenimiento de jardines, poda y diseño básico de espacios verdes.",
    skills: ["Jardinería", "Paisajismo"],
    logo: "/placeholder.svg?height=40&width=40&text=CCL",
  },
]

const certificationsData = [
  {
    id: 1,
    name: "Certificación en Limpieza Hospitalaria",
    issuer: "Instituto de Salud Pública",
    issueDate: "sept. 2023",
    credentialId: "ISP-2023-LH-4567",
    skills: ["Limpieza Hospitalaria", "Bioseguridad"],
    logo: "/placeholder.svg?height=40&width=40&text=ISP",
  },
  {
    id: 2,
    name: "Curso de Primeros Auxilios",
    issuer: "Cruz Roja Chilena",
    issueDate: "mar. 2023",
    credentialId: "CRC-2023-PA-8901",
    skills: ["Primeros Auxilios", "Seguridad"],
    logo: "/placeholder.svg?height=40&width=40&text=CRC",
  },
  {
    id: 3,
    name: "Manejo Seguro de Productos Químicos",
    issuer: "ACHS",
    issueDate: "ene. 2022",
    credentialId: "ACHS-2022-QS-2345",
    skills: ["Seguridad Química", "Prevención de Riesgos"],
    logo: "/placeholder.svg?height=40&width=40&text=ACHS",
  },
]

// Mock data for favorite service providers
const favoriteProviders = [
  {
    id: 1,
    name: "María González",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviews: 24,
    services: ["Limpieza", "Organización"],
    location: "Providencia, Santiago",
    lastService: "Limpieza de hogar",
    lastServiceDate: "15 abril, 2025",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    avatar: "/placeholder.svg",
    rating: 4.7,
    reviews: 18,
    services: ["Reparaciones", "Jardinería"],
    location: "Las Condes, Santiago",
    lastService: "Reparación de muebles",
    lastServiceDate: "2 mayo, 2025",
  },
  {
    id: 3,
    name: "Ana Martínez",
    avatar: "/placeholder.svg",
    rating: 5.0,
    reviews: 32,
    services: ["Clases", "Tutorías"],
    location: "Ñuñoa, Santiago",
    lastService: "Clases de matemáticas",
    lastServiceDate: "28 abril, 2025",
  },
]

export default function ProfilePage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState(favoriteProviders)
  const [selectedProvider, setSelectedProvider] = useState<(typeof favoriteProviders)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAllExperience, setShowAllExperience] = useState(false)
  const [showAllEducation, setShowAllEducation] = useState(false)
  const [showAllCertifications, setShowAllCertifications] = useState(false)

  const handleRemoveFavorite = (id: number) => {
    setFavorites(favorites.filter((provider) => provider.id !== id))
  }

  const handleProviderClick = (provider: (typeof favoriteProviders)[0]) => {
    setSelectedProvider(provider)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProvider(null)
  }

  const displayedExperience = showAllExperience ? experienceData : experienceData.slice(0, 2)
  const displayedEducation = showAllEducation ? educationData : educationData.slice(0, 1)
  const displayedCertifications = showAllCertifications ? certificationsData : certificationsData.slice(0, 2)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => router.back()}
                  className="cursor-pointer"
                >
                  Volver
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Perfil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/images/juan-perez.jpg" />
                  <AvatarFallback>JP</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold">Juan Pérez</h1>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Santiago, Chile</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild>
                        <Link href="/profile/edit">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar perfil
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-sm text-muted-foreground">Servicios</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">4.8</div>
                      <div className="text-sm text-muted-foreground">Calificación</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">8</div>
                      <div className="text-sm text-muted-foreground">Reseñas</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">2</div>
                      <div className="text-sm text-muted-foreground">Años</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-6">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Identidad verificada</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Oferente de servicios</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Habla español</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="about">Acerca de mí</TabsTrigger>
              <TabsTrigger value="services">Servicios</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              {/* Resumen Profesional */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-3">Resumen Profesional</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Profesional con más de 5 años de experiencia en servicios de limpieza, mantenimiento y jardinería.
                    Especializado en limpieza hospitalaria y manejo de productos químicos. Comprometido con la
                    excelencia en el servicio y la satisfacción del cliente.
                  </p>
                </CardContent>
              </Card>

              {/* Experiencia y Educación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Experiencia */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Experiencia</h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowAllExperience(!showAllExperience)}>
                        {showAllExperience ? "Ver menos" : "Ver todo"}
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {displayedExperience.map((exp) => (
                        <div key={exp.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <h4 className="font-medium">{exp.position}</h4>
                          <p className="text-sm text-muted-foreground">
                            {exp.company} • {exp.type}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{exp.duration}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Educación */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Educación</h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowAllEducation(!showAllEducation)}>
                        {showAllEducation ? "Ver menos" : "Ver todo"}
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {displayedEducation.map((edu) => (
                        <div key={edu.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <h4 className="font-medium">{edu.institution}</h4>
                          <p className="text-sm text-muted-foreground">{edu.degree}</p>
                          <p className="text-xs text-muted-foreground mt-1">{edu.duration}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Certificaciones y Habilidades */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Certificaciones */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Certificaciones</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllCertifications(!showAllCertifications)}
                      >
                        {showAllCertifications ? "Ver menos" : "Ver todo"}
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {displayedCertifications.map((cert) => (
                        <div key={cert.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <h4 className="font-medium">{cert.name}</h4>
                          <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                          <p className="text-xs text-muted-foreground mt-1">{cert.issueDate}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Habilidades */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Habilidades</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Limpieza</Badge>
                      <Badge variant="secondary">Organización</Badge>
                      <Badge variant="secondary">Mantenimiento</Badge>
                      <Badge variant="secondary">Jardinería</Badge>
                      <Badge variant="secondary">Reparaciones menores</Badge>
                      <Badge variant="secondary">Limpieza Hospitalaria</Badge>
                      <Badge variant="secondary">Bioseguridad</Badge>
                      <Badge variant="secondary">Primeros Auxilios</Badge>
                      <Badge variant="secondary">Seguridad Laboral</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Disponibilidad */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-3">Disponibilidad</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline">Lunes - Viernes</Badge>
                    <Badge variant="outline">9:00 - 18:00</Badge>
                    <Badge variant="outline">Sábados 9:00 - 14:00</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Servicios de emergencia disponibles con costo adicional.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Servicios ofrecidos</CardTitle>
                  <CardDescription>Servicios que puedo realizar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">Limpieza de hogar</h3>
                          <p className="text-muted-foreground">
                            Limpieza completa de hogares, incluyendo cocina, baños, dormitorios y áreas comunes.
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$15.000 / hora</p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">Jardinería</h3>
                          <p className="text-muted-foreground">
                            Mantenimiento de jardines, poda de plantas, riego y cuidado general.
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$12.000 / hora</p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">Reparaciones menores</h3>
                          <p className="text-muted-foreground">
                            Arreglos básicos en el hogar como cambio de bombillas, reparación de grifos, etc.
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$18.000 / hora</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Reseñas</CardTitle>
                  <CardDescription>Lo que dicen mis clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/images/josefa.jpg" />
                            <AvatarFallback>MG</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">María González</h3>
                            <p className="text-sm text-muted-foreground">Mayo 2025</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        Excelente servicio. Juan fue muy profesional y dejó mi casa impecable. Definitivamente lo
                        recomendaría y volveré a contratarlo.
                      </p>
                    </div>

                    <div className="border-b pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/images/hernan.jpg" />
                            <AvatarFallback>CR</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">Carlos Rodríguez</h3>
                            <p className="text-sm text-muted-foreground">Abril 2025</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        Muy buen trabajo con las reparaciones en mi departamento. Puntual y eficiente. Le faltó traer
                        algunas herramientas, pero supo improvisar.
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>AM</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">Ana Martínez</h3>
                            <p className="text-sm text-muted-foreground">Marzo 2025</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        Juan hizo un excelente trabajo con mi jardín. Es muy detallista y conoce bien su oficio. Lo
                        recomiendo ampliamente para cualquier trabajo de jardinería.
                      </p>
                    </div>

                    <Button variant="outline" className="w-full">
                      Ver todas las reseñas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Oferentes favoritos</CardTitle>
                  <CardDescription>Profesionales que has marcado como favoritos para futuros servicios</CardDescription>
                </CardHeader>
                <CardContent>
                  {favorites.length > 0 ? (
                    <div className="space-y-6">
                      {favorites.map((provider) => (
                        <div key={provider.id} className="border rounded-lg p-4">
                          <div
                            className="flex flex-col md:flex-row gap-4 cursor-pointer"
                            onClick={() => handleProviderClick(provider)}
                          >
                            <div className="flex items-start gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={provider.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium text-lg">{provider.name}</h3>
                                <div className="flex items-center mt-1">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="ml-1 text-sm">{provider.rating}</span>
                                  </div>
                                  <span className="mx-2 text-muted-foreground">•</span>
                                  <span className="text-sm text-muted-foreground">{provider.reviews} reseñas</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{provider.location}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {provider.services.map((service, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {service}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="md:ml-auto flex flex-col justify-between">
                              <div className="text-right">
                                <p className="text-sm font-medium">Último servicio:</p>
                                <p className="text-sm text-muted-foreground">{provider.lastService}</p>
                                <p className="text-xs text-muted-foreground">{provider.lastServiceDate}</p>
                              </div>
                              <div className="flex gap-2 mt-3 md:mt-0 md:justify-end">
                                <Button variant="outline" size="sm">
                                  Contactar
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRemoveFavorite(provider.id)}
                                >
                                  Quitar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No tienes oferentes favoritos</h3>
                      <p className="text-muted-foreground mb-6">
                        Marca como favoritos a los oferentes que te brindaron un buen servicio para contratarlos
                        fácilmente en el futuro.
                      </p>
                      <Button variant="outline">Explorar oferentes</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {selectedProvider && (
            <ProviderProfileModal
              provider={selectedProvider}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onRemoveFavorite={handleRemoveFavorite}
            />
          )}
        </div>
      </main>
    </div>
  )
}
