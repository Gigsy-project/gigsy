"use client";

import { useState, useId } from "react";
import { Header } from "@/components/header";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Edit,
  Globe,
  Heart,
  MapPin,
  Shield,
  Star,
  User,
  Building,
  GraduationCap,
  Award,
  DollarSign,
  Clock,
  CheckCircle,
} from "lucide-react";
import { ProviderProfileModal } from "@/components/provider-profile-modal";
import type { Provider } from "@/lib/types";

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
    description:
      "Servicios de mantenimiento general, reparaciones menores y jardinería para clientes residenciales.",
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
    description:
      "Limpieza y mantenimiento de habitaciones de hotel, siguiendo estándares de calidad internacional.",
    skills: ["Limpieza", "Trabajo en equipo", "Puntualidad"],
    logo: "/placeholder.svg?height=40&width=40&text=HP",
  },
];

const educationData = [
  {
    id: 1,
    institution: "Instituto Técnico de Santiago",
    degree: "Técnico en Servicios de Limpieza Industrial",
    field: "Limpieza y Mantenimiento",
    duration: "2018 - 2019",
    description:
      "Certificación en técnicas avanzadas de limpieza, uso de equipos especializados y productos químicos.",
    skills: ["Limpieza Industrial", "Seguridad Laboral"],
    logo: "/placeholder.svg?height=40&width=40&text=ITS",
  },
  {
    id: 2,
    institution: "Centro de Capacitación Laboral",
    degree: "Curso de Jardinería y Paisajismo",
    field: "Jardinería",
    duration: "2020",
    description:
      "Curso especializado en mantenimiento de jardines, poda y diseño básico de espacios verdes.",
    skills: ["Jardinería", "Paisajismo"],
    logo: "/placeholder.svg?height=40&width=40&text=CCL",
  },
];

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
];

const favoriteProviders: Provider[] = [
  {
    id: 1,
    name: "María González",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviews: 24,
    services: ["Limpieza", "Organización de espacios", "Cuidado de niños"],
    location: "Providencia, Santiago",
    lastService: "Limpieza profunda de departamento",
    lastServiceDate: "15 abril, 2025",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    avatar: "/placeholder.svg",
    rating: 4.7,
    reviews: 18,
    services: ["Reparaciones menores", "Jardinería", "Pintura"],
    location: "Las Condes, Santiago",
    lastService: "Reparación de muebles y pintura",
    lastServiceDate: "2 mayo, 2025",
  },
];

export default function ProfilePage() {
  const t = useTranslations("profile");
  const [activeTab, setActiveTab] = useState("about");
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return <AboutSection />;
      case "services":
        return <ServicesSection />;
      case "reviews":
        return <ReviewsSection />;
      case "favorites":
        return <FavoritesSection onProviderClick={handleProviderClick} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => router.back()}
                  className="cursor-pointer hover:text-primary transition-colors"
                >
                  {t("back")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("title")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 xl:col-span-3">
              <ProfileSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
            <div className="lg:col-span-8 xl:col-span-9">{renderContent()}</div>
          </div>
        </div>
      </main>
      {selectedProvider && (
        <ProviderProfileModal
          provider={selectedProvider}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onRemoveFavorite={() => {}}
        />
      )}
    </div>
  );
}

const ProfileSidebar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const t = useTranslations("profile");
  const navItems = [
    { id: "about", label: t("about"), icon: User },
    { id: "services", label: t("services"), icon: Briefcase },
    { id: "reviews", label: t("reviews"), icon: Star },
    { id: "favorites", label: t("favorites"), icon: Heart },
  ];
  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-28 w-28 border-4 border-background shadow-md">
            <AvatarImage src="/images/juan-perez.jpg" />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold mt-4">Juan Pérez</h1>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Santiago, Chile</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Lun - Vie, 9:00 - 18:00</span>
            <Badge
              variant="outline"
              className="text-xs text-green-600 border-green-600/50 ml-2"
            >
              {t("available")}
            </Badge>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge
              variant="outline"
              className="flex items-center gap-1.5 py-1 px-2.5"
            >
              <Shield className="h-4 w-4 text-green-600" />
              <span>{t("identityVerified")}</span>
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-1.5 py-1 px-2.5"
            >
              <Globe className="h-4 w-4 text-purple-600" />
              <span>{t("speaksSpanish")}</span>
            </Badge>
          </div>
          <Button asChild className="mt-6 w-full">
            <Link href="/profile/edit">
              <Edit className="h-4 w-4 mr-2" />
              {t("edit")}
            </Link>
          </Button>
        </div>
        <div className="mt-8">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                tabIndex={0}
                aria-label={item.label}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveTab(item.id);
                  }
                }}
                className={[
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeTab === item.id
                    ? "bg-muted text-foreground border border-border"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                ].join(" ")}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-4">{t("statistics")}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t("servicesCompleted")}
              </span>
              <span className="font-bold">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("rating")}</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold">4.8</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("totalReviews")}</span>
              <span className="font-bold">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("memberSince")}</span>
              <span className="font-bold">2023</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TimelineItem = ({
  icon: Icon,
  title,
  subtitle,
  date,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  date: string;
  children?: React.ReactNode;
}) => (
  <div className="relative pl-8">
    <div className="absolute left-0 top-1 h-full border-l-2 border-border"></div>
    <div className="absolute left-[-9px] top-1.5 bg-background p-1 rounded-full">
      <div className="h-4 w-4 bg-primary rounded-full"></div>
    </div>
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <h4 className="font-semibold text-lg">{title}</h4>
      </div>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <p className="text-xs text-muted-foreground mt-1">{date}</p>
      {children && <div className="mt-3 text-sm">{children}</div>}
    </div>
  </div>
);

const AboutSection = () => {
  const t = useTranslations("profile");
  return (
  <div className="space-y-8">
    <Card>
      <CardHeader>
        <CardTitle>{t("professionalSummary")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          Profesional con más de 5 años de experiencia en servicios de limpieza,
          mantenimiento y jardinería. Especializado en limpieza hospitalaria y
          manejo de productos químicos. Comprometido con la excelencia en el
          servicio y la satisfacción del cliente.
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>{t("skills")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {[
            "Limpieza",
            "Organización",
            "Mantenimiento",
            "Jardinería",
            "Reparaciones menores",
            "Limpieza Hospitalaria",
            "Bioseguridad",
            "Primeros Auxilios",
            "Seguridad Laboral",
          ].map((skill) => (
            <Badge key={skill} variant="secondary" className="py-1 px-3">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>{t("workExperience")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {experienceData.map((exp) => (
            <TimelineItem
              key={exp.id}
              icon={Building}
              title={exp.position}
              subtitle={`${exp.company} • ${exp.type}`}
              date={`${exp.duration} • ${exp.location}`}
            >
              <p className="text-muted-foreground">{exp.description}</p>
            </TimelineItem>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>{t("educationCertifications")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {educationData.map((edu) => (
            <TimelineItem
              key={edu.id}
              icon={GraduationCap}
              title={edu.institution}
              subtitle={edu.degree}
              date={edu.duration}
            >
              <p className="text-muted-foreground">{edu.description}</p>
            </TimelineItem>
          ))}
          {certificationsData.map((cert) => (
            <TimelineItem
              key={cert.id}
              icon={Award}
              title={cert.name}
              subtitle={cert.issuer}
              date={`Emitido ${cert.issueDate}`}
            >
              <p className="text-muted-foreground">
                ID de credencial: {cert.credentialId}
              </p>
            </TimelineItem>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
  );
};

const ServicesSection = () => {
  const t = useTranslations("profile");
  return (
  <Card>
    <CardHeader>
      <CardTitle>{t("servicesOffered")}</CardTitle>
      <CardDescription>
        Estos son los servicios que Juan Pérez puede realizar.
      </CardDescription>
    </CardHeader>
    <CardContent className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {[
        {
          title: "Limpieza de hogar",
          desc: "Limpieza completa de hogares, incluyendo cocina, baños, dormitorios y áreas comunes.",
          price: "15.000",
        },
        {
          title: "Jardinería",
          desc: "Mantenimiento de jardines, poda de plantas, riego y cuidado general.",
          price: "12.000",
        },
        {
          title: "Reparaciones menores",
          desc: "Arreglos básicos en el hogar como cambio de bombillas, reparación de grifos, etc.",
          price: "18.000",
        },
      ].map((service) => (
        <Card key={service.title} className="flex flex-col pb-0">
          <CardHeader>
            <h3 className="font-semibold text-lg">{service.title}</h3>
          </CardHeader>
          <CardContent className="grow">
            <p className="text-muted-foreground text-sm">{service.desc}</p>
          </CardContent>
          <CardFooter className="flex items-center justify-between bg-muted/50 py-3 px-4 rounded-b-lg">
            <div className="flex items-baseline font-semibold">
              <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{service.price}</span>
              <span className="text-xs text-muted-foreground ml-1">/hr</span>
            </div>
            <Button size="sm">{t("request")}</Button>
          </CardFooter>
        </Card>
      ))}
    </CardContent>
  </Card>
  );
};

const ReviewsSection = () => {
  const t = useTranslations("profile");
  const starsId = useId();
  const starIds = Array.from({ length: 5 }, (_, i) => `${starsId}-star-${i}`);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("clientReviews")}</CardTitle>
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center">
            {starIds.map((starKey, i) => (
              <Star
                key={starKey}
                className={`h-5 w-5 ${4.8 > i ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
              />
            ))}
          </div>
          <span className="font-bold text-lg">4.8</span>
          <span className="text-muted-foreground text-sm">
            ({t("basedOnReviews", { count: 8 })})
          </span>
        </div>
      </CardHeader>
    <CardContent className="space-y-6">
      <ReviewItem
        name="María González"
        avatar="/images/josefa.jpg"
        date="Mayo 2025"
        rating={5}
        comment="Excelente servicio. Juan fue muy profesional y dejó mi casa impecable. Definitivamente lo recomendaría y volveré a contratarlo."
      />
      <ReviewItem
        name="Carlos Rodríguez"
        avatar="/images/hernan.jpg"
        date="Abril 2025"
        rating={4}
        comment="Muy buen trabajo con las reparaciones en mi departamento. Puntual y eficiente. Le faltó traer algunas herramientas, pero supo improvisar."
      />
      <ReviewItem
        name="Ana Martínez"
        avatar=""
        date="Marzo 2025"
        rating={4}
        comment="Juan hizo un excelente trabajo con mi jardín. Es muy detallista y conoce bien su oficio. Lo recomiendo ampliamente para cualquier trabajo de jardinería."
      />
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full">
        {t("viewAllReviews")}
      </Button>
    </CardFooter>
  </Card>
  );
};

const ReviewItem = ({
  name,
  avatar,
  date,
  rating,
  comment,
}: {
  name: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
}) => {
  const reviewStarsId = useId();
  const starIds = Array.from({ length: 5 }, (_, i) => `${reviewStarsId}-star-${i}`);
  return (
    <div className="border-b pb-6 last:border-0 last:pb-0">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11">
            <AvatarImage src={avatar} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
        </div>
        <div className="flex items-center">
          {starIds.map((starKey, i) => (
            <Star
              key={starKey}
              className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
            />
          ))}
        </div>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">{comment}</p>
    </div>
  );
};

const FavoritesSection = ({
  onProviderClick,
}: {
  onProviderClick: (provider: Provider) => void;
}) => {
  const t = useTranslations("profile");
  const [favorites, setFavorites] = useState(favoriteProviders);

  const handleRemoveFavorite = (id: number) => {
    setFavorites(favorites.filter((provider) => provider.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("favoriteProviders")}</CardTitle>
        <CardDescription>
          Profesionales que has guardado para futuros servicios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((provider) => (
              <Card
                key={provider.id}
                className="overflow-hidden transition-all hover:shadow-lg pb-0"
                tabIndex={0}
                aria-label={`Ver detalles de ${provider.name}`}
                role="button"
                onClick={() => onProviderClick(provider)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onProviderClick(provider);
                  }
                }}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage
                        src={provider.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{provider.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1.5" />
                        <span>{provider.rating || 0}</span>
                        <span className="mx-2">•</span>
                        <span>{t("reviewsCount", { count: provider.reviews || 0 })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {provider.services.slice(0, 3).map((service) => (
                        <Badge
                          key={`service-${service}`}
                          variant="secondary"
                          className="text-xs"
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{t("lastService")}: {provider.lastService}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{provider.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardFooter className="bg-muted/50 px-4 py-3 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(provider.id);
                    }}
                  >
                    {t("remove")}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t("contact")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              {t("noFavorites")}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {t("noFavoritesDesc")}
            </p>
            <Button variant="outline">{t("exploreProviders")}</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

