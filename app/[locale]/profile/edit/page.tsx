"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import {
  User,
  MapPin,
  FileText,
  Briefcase,
  Clock,
  Globe,
  Trophy,
  Plus,
  X,
  ArrowLeft,
  Camera,
  ChevronRight,
  Check,
  Settings,
  Edit3,
  Lock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Interfaces
interface BasicInfo {
  name: string;
  email: string;
  phone: string;
}

interface Location {
  country: string;
  city: string;
  address: string;
}

interface About {
  bio: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Availability {
  days: string[];
  startTime: string;
  endTime: string;
  immediateAvailability: boolean;
}

interface Language {
  name: string;
  level: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ProfileData {
  basicInfo: BasicInfo;
  location: Location;
  about: About;
  services: string[];
  availability: Availability;
  languages: Language[];
  experience: Experience[];
  interests: string[];
}

interface FormProps<T> {
  data: T;
  onSave: (data: T) => void;
}

// Initial data
const initialProfileData: ProfileData = {
  basicInfo: {
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    phone: "+56 9 1234 5678",
  },
  location: {
    country: "Chile",
    city: "Santiago",
    address: "Av. Providencia 1234",
  },
  about: {
    bio: "Soy un profesional con experiencia en servicios de limpieza y mantenimiento. Me especializo en ofrecer soluciones eficientes y de alta calidad para hogares y oficinas.",
  },
  services: ["Limpieza", "Plomería", "Electricidad"],
  availability: {
    days: ["Lunes", "Martes", "Miércoles"],
    startTime: "09:00",
    endTime: "18:00",
    immediateAvailability: true,
  },
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Intermedio" },
  ],
  experience: [
    {
      title: "Especialista en Limpieza",
      company: "CleanPro Services",
      location: "Santiago, Chile",
      startDate: "2020-01",
      endDate: "2023-04",
      current: false,
      description:
        "Responsable de coordinar servicios de limpieza para clientes corporativos.",
    },
  ],
  interests: ["Jardinería", "Cocina", "Tecnología"],
};

// Form Components
const BasicInfoForm = ({ data, onSave }: FormProps<BasicInfo>) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">Guardar cambios</Button>
    </form>
  );
};

const LocationForm = ({ data, onSave }: FormProps<Location>) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">País</Label>
          <Select
            value={formData.country}
            onValueChange={(value) =>
              setFormData({ ...formData, country: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chile">Chile</SelectItem>
              <SelectItem value="Argentina">Argentina</SelectItem>
              <SelectItem value="Perú">Perú</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">Guardar cambios</Button>
    </form>
  );
};

const AboutForm = ({ data, onSave }: FormProps<About>) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="bio">Acerca de mí</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Cuéntanos sobre ti, tu experiencia y qué te hace único..."
          rows={5}
        />
      </div>
      <Button type="submit">Guardar cambios</Button>
    </form>
  );
};

const ServicesForm = ({ data, onSave }: FormProps<string[]>) => {
  const [services, setServices] = useState(data);
  const [newService, setNewService] = useState("");

  const handleAddService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService("");
    }
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(services);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Mis servicios</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            placeholder="Añadir nuevo servicio"
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddService())
            }
          />
          <Button type="button" onClick={handleAddService} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {services.length > 0 && (
        <div className="space-y-2">
          <Label>Servicios actuales</Label>
          <div className="flex flex-wrap gap-2">
            {services.map((service, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-2"
              >
                {service}
                <button
                  type="button"
                  onClick={() => handleRemoveService(index)}
                  className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Button type="submit">Guardar cambios</Button>
    </form>
  );
};

const PasswordForm = ({ data, onSave }: FormProps<PasswordData>) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "La contraseña actual es requerida";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "La nueva contraseña es requerida";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu nueva contraseña";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword()) {
      onSave(formData);
      // Reset form after successful save
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="currentPassword">Contraseña actual</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Ingresa tu contraseña actual"
          required
        />
        {errors.currentPassword && (
          <p className="text-sm text-destructive mt-1">
            {errors.currentPassword}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="newPassword">Nueva contraseña</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Ingresa tu nueva contraseña"
          required
        />
        {errors.newPassword && (
          <p className="text-sm text-destructive mt-1">{errors.newPassword}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Mínimo 6 caracteres
        </p>
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirma tu nueva contraseña"
          required
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive mt-1">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Seguridad</h4>
            <p className="text-sm text-muted-foreground">
              Te recomendamos usar una contraseña fuerte que incluya letras,
              números y símbolos.
            </p>
          </div>
        </div>
      </div>

      <Button type="submit">Cambiar contraseña</Button>
    </form>
  );
};

// Profile sections configuration
const profileSections = [
  {
    id: "basic-info",
    title: "Información básica",
    description: "Nombre, email y teléfono",
    icon: User,
    completed: true,
  },
  {
    id: "location",
    title: "Ubicación",
    description: "País, ciudad y dirección",
    icon: MapPin,
    completed: true,
  },
  {
    id: "about",
    title: "Acerca de mí",
    description: "Cuéntanos sobre ti",
    icon: Edit3,
    completed: true,
  },
  {
    id: "services",
    title: "Mis servicios",
    description: "Qué servicios ofreces",
    icon: Briefcase,
    completed: true,
  },
  {
    id: "password",
    title: "Contraseña",
    description: "Cambia tu contraseña",
    icon: Lock,
    completed: true,
  },
];

export default function EditProfilePage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [profileData, setProfileData] = useState(initialProfileData);
  const [completedSections, setCompletedSections] = useState(
    profileSections.filter((section) => section.completed).length,
  );

  const totalSections = profileSections.length;
  const completionPercentage = Math.round(
    (completedSections / totalSections) * 100,
  );

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
  };

  const handlePhotoEdit = () => {
    console.log("Editando foto de perfil");
  };

  const handleSaveProfile = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      router.push("/profile");
    }, 2000);
  };

  const handleSaveSection = (sectionId: string, data: any) => {
    setProfileData((prev) => ({
      ...prev,
      [sectionId === "basic-info" ? "basicInfo" : sectionId]: data,
    }));

    const sectionIndex = profileSections.findIndex(
      (section) => section.id === sectionId,
    );
    if (sectionIndex !== -1 && !profileSections[sectionIndex].completed) {
      profileSections[sectionIndex].completed = true;
      setCompletedSections(completedSections + 1);
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedSection(null);
    }, 1500);
  };

  const renderSectionForm = () => {
    switch (selectedSection) {
      case "basic-info":
        return (
          <BasicInfoForm
            data={profileData.basicInfo}
            onSave={(data) => handleSaveSection("basic-info", data)}
          />
        );
      case "location":
        return (
          <LocationForm
            data={profileData.location}
            onSave={(data) => handleSaveSection("location", data)}
          />
        );
      case "about":
        return (
          <AboutForm
            data={profileData.about}
            onSave={(data) => handleSaveSection("about", data)}
          />
        );
      case "services":
        return (
          <ServicesForm
            data={profileData.services}
            onSave={(data) => handleSaveSection("services", data)}
          />
        );
      case "password":
        return (
          <PasswordForm
            data={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
            onSave={(data) => handleSaveSection("password", data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Container - Centered */}
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-4xl">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              href="/profile"
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al perfil
            </Link>
          </div>

          {/* Success Alert */}
          {showSuccess && (
            <Alert className="mb-6 border-primary/20 bg-primary/5">
              <Check className="h-4 w-4" />
              <AlertDescription className="text-primary">
                {selectedSection
                  ? "Sección actualizada exitosamente!"
                  : "¡Perfil actualizado exitosamente! Redirigiendo..."}
              </AlertDescription>
            </Alert>
          )}

          {/* Header Card */}
          <Card className="mb-8 border-border/50 shadow-sm">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Profile Photo */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                      <AvatarImage
                        src="/images/juan-perez.jpg"
                        alt="Juan Pérez"
                      />
                      <AvatarFallback className="text-xl">JP</AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handlePhotoEdit}
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h1 className="text-3xl font-semibold mb-3 text-foreground">
                      Editar mi perfil
                    </h1>
                    <p className="text-muted-foreground text-base">
                      Completa tu perfil para generar más confianza en nuestra
                      comunidad y recibir mejores oportunidades.
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        Completitud del perfil
                      </span>
                      <span className="text-sm text-primary font-semibold">
                        {completionPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-muted/70 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="text-2xl font-semibold text-foreground">
                        {completedSections}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Secciones completas
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="text-2xl font-semibold text-foreground">
                        4.8
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Calificación
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="text-2xl font-semibold text-foreground">
                        {profileData.services.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Servicios
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Form or Sections Grid */}
          {selectedSection ? (
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      {React.createElement(
                        profileSections.find((s) => s.id === selectedSection)
                          ?.icon || Settings,
                        { className: "h-5 w-5 text-primary" },
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {
                        profileSections.find(
                          (section) => section.id === selectedSection,
                        )?.title
                      }
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSection(null)}
                    className="hover:bg-muted"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cerrar
                  </Button>
                </div>
                <div className="max-w-2xl">{renderSectionForm()}</div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileSections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <Card
                      key={section.id}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/20 border-border/50 group"
                      onClick={() => handleSectionClick(section.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/15 transition-colors">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-foreground mb-1">
                                {section.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {section.description}
                              </p>

                              {/* Preview of data */}
                              <div className="space-y-1">
                                {section.id === "basic-info" && (
                                  <p className="text-sm font-medium text-foreground">
                                    {profileData.basicInfo.name}
                                  </p>
                                )}
                                {section.id === "location" && (
                                  <p className="text-sm font-medium text-foreground">
                                    {profileData.location.city},{" "}
                                    {profileData.location.country}
                                  </p>
                                )}
                                {section.id === "services" && (
                                  <div className="flex flex-wrap gap-1">
                                    {profileData.services
                                      ?.slice(0, 2)
                                      .map((service, index) => (
                                        <Badge
                                          key={index}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {service}
                                        </Badge>
                                      ))}
                                    {profileData.services &&
                                      profileData.services.length > 2 && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          +{profileData.services.length - 2}
                                        </Badge>
                                      )}
                                  </div>
                                )}
                                {section.id === "about" && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {profileData.about.bio?.substring(0, 80)}...
                                  </p>
                                )}
                                {section.id === "password" && (
                                  <p className="text-sm text-muted-foreground">
                                    ••••••••
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {section.completed && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-6">
                <Button onClick={handleSaveProfile} size="lg" className="px-8">
                  <Check className="h-4 w-4 mr-2" />
                  Guardar cambios
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/profile")}
                  className="px-8"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
