"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFormValidation, commonValidationRules } from "@/hooks/use-form-validation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Camera,
  User,
  MapPin,
  Briefcase,
  Clock,
  Globe,
  Star,
  Heart,
  Edit3,
  ChevronRight,
  X,
  Plus,
  Trash2,
} from "lucide-react"
import Link from "next/link"

// Datos iniciales del perfil
const initialProfileData = {
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
  services: ["Limpieza", "Organización", "Mantenimiento", "Jardinería"],
  availability: {
    days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
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
      description: "Responsable de coordinar servicios de limpieza para clientes corporativos.",
    },
  ],
  interests: ["Ecología", "Tecnología", "Deportes"],
}

// Componente para editar información básica
const BasicInfoForm = ({ data, onSave }) => {
  const [formData, setFormData] = useState(data)
  const { errors, validateForm } = useFormValidation({
    name: commonValidationRules.name,
    email: commonValidationRules.email,
    phone: commonValidationRules.phone,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm(formData)) {
      onSave(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre completo" />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+56 9 XXXX XXXX" />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  )
}

// Componente para editar ubicación
const LocationForm = ({ data, onSave }) => {
  const [formData, setFormData] = useState(data)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="country">País</Label>
        <Select
          name="country"
          value={formData.country}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un país" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Chile">Chile</SelectItem>
            <SelectItem value="Argentina">Argentina</SelectItem>
            <SelectItem value="Perú">Perú</SelectItem>
            <SelectItem value="Colombia">Colombia</SelectItem>
            <SelectItem value="México">México</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">Ciudad</Label>
        <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Tu ciudad" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Dirección (opcional)"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  )
}

// Componente para editar acerca de mí
const AboutForm = ({ data, onSave }) => {
  const [formData, setFormData] = useState(data)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bio">Biografía</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Cuéntanos sobre ti, tu experiencia y habilidades..."
          className="min-h-[150px]"
        />
        <p className="text-xs text-muted-foreground">
          Una buena descripción ayuda a los clientes a conocerte mejor y aumenta tus posibilidades de ser contratado.
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  )
}

// Componente para editar servicios
const ServicesForm = ({ data, onSave }) => {
  const [services, setServices] = useState(data)
  const [newService, setNewService] = useState("")

  const handleAddService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()])
      setNewService("")
    }
  }

  const handleRemoveService = (index) => {
    setServices(services.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(services)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Mis servicios</Label>
        <div className="flex gap-2">
          <Input
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            placeholder="Añadir nuevo servicio"
          />
          <Button type="button" onClick={handleAddService} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {services.map((service, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
            {service}
            <button
              type="button"
              onClick={() => handleRemoveService(index)}
              className="ml-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  )
}

// Componente para editar disponibilidad
const AvailabilityForm = ({ data, onSave }) => {
  const [formData, setFormData] = useState(data)
  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

  const handleDayToggle = (day) => {
    if (formData.days.includes(day)) {
      setFormData({
        ...formData,
        days: formData.days.filter((d) => d !== day),
      })
    } else {
      setFormData({
        ...formData,
        days: [...formData.days, day],
      })
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Días disponibles</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day}`}
                checked={formData.days.includes(day)}
                onCheckedChange={() => handleDayToggle(day)}
              />
              <Label htmlFor={`day-${day}`} className="font-normal">
                {day}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Hora de inicio</Label>
          <Input id="startTime" name="startTime" type="time" value={formData.startTime} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">Hora de término</Label>
          <Input id="endTime" name="endTime" type="time" value={formData.endTime} onChange={handleChange} />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="immediateAvailability"
          name="immediateAvailability"
          checked={formData.immediateAvailability}
          onCheckedChange={(checked) => setFormData({ ...formData, immediateAvailability: !!checked })}
        />
        <Label htmlFor="immediateAvailability" className="font-normal">
          Disponibilidad inmediata
        </Label>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  )
}

// Componente para editar idiomas
const LanguagesForm = ({ data, onSave }) => {
  const [languages, setLanguages] = useState(data)
  const [newLanguage, setNewLanguage] = useState({ name: "", level: "Básico" })
  const languageLevels = ["Básico", "Intermedio", "Avanzado", "Nativo"]

  const handleAddLanguage = () => {
    if (newLanguage.name.trim() && !languages.some((lang) => lang.name === newLanguage.name.trim())) {
      setLanguages([...languages, { ...newLanguage, name: newLanguage.name.trim() }])
      setNewLanguage({ name: "", level: "Básico" })
    }
  }

  const handleRemoveLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(languages)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <Label>Añadir idioma</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={newLanguage.name}
            onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
            placeholder="Idioma (ej. Inglés)"
          />
          <Select value={newLanguage.level} onValueChange={(value) => setNewLanguage({ ...newLanguage, level: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Nivel" />
            </SelectTrigger>
            <SelectContent>
              {languageLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" onClick={handleAddLanguage} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Añadir idioma
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Idiomas</Label>
        {languages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No has añadido ningún idioma.</p>
        ) : (
          <div className="space-y-2">
            {languages.map((language, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">{language.name}</p>
                  <p className="text-sm text-muted-foreground">{language.level}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveLanguage(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  )
}

// Componente para editar experiencia
const ExperienceForm = ({ data, onSave }) => {
  const [experiences, setExperiences] = useState(data)
  const [isAddingExperience, setIsAddingExperience] = useState(false)
  const [currentExperience, setCurrentExperience] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  })
  const [editIndex, setEditIndex] = useState(-1)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setCurrentExperience({
      ...currentExperience,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSaveExperience = () => {
    if (editIndex >= 0) {
      // Editing existing experience
      const updatedExperiences = [...experiences]
      updatedExperiences[editIndex] = currentExperience
      setExperiences(updatedExperiences)
    } else {
      // Adding new experience
      setExperiences([...experiences, currentExperience])
    }
    resetExperienceForm()
  }

  const handleEditExperience = (index) => {
    setCurrentExperience(experiences[index])
    setEditIndex(index)
    setIsAddingExperience(true)
  }

  const handleRemoveExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index))
  }

  const resetExperienceForm = () => {
    setCurrentExperience({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    })
    setEditIndex(-1)
    setIsAddingExperience(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(experiences)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Experiencia laboral</Label>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsAddingExperience(true)}
          disabled={isAddingExperience}
        >
          <Plus className="h-4 w-4 mr-2" /> Añadir experiencia
        </Button>
      </div>

      {experiences.length === 0 && !isAddingExperience ? (
        <p className="text-sm text-muted-foreground">No has añadido ninguna experiencia laboral.</p>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{exp.title}</h4>
                  <p className="text-sm">{exp.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(exp.startDate).toLocaleDateString("es-ES", { year: "numeric", month: "long" })} -{" "}
                    {exp.current
                      ? "Actual"
                      : new Date(exp.endDate).toLocaleDateString("es-ES", { year: "numeric", month: "long" })}
                  </p>
                  <p className="text-xs text-muted-foreground">{exp.location}</p>
                  {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditExperience(index)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveExperience(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAddingExperience && (
        <Dialog open={isAddingExperience} onOpenChange={setIsAddingExperience}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editIndex >= 0 ? "Editar experiencia" : "Añadir experiencia"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Cargo</Label>
                  <Input
                    id="title"
                    name="title"
                    value={currentExperience.title}
                    onChange={handleChange}
                    placeholder="Ej. Desarrollador Web"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    name="company"
                    value={currentExperience.company}
                    onChange={handleChange}
                    placeholder="Ej. AidMarkt"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    name="location"
                    value={currentExperience.location}
                    onChange={handleChange}
                    placeholder="Ej. Santiago, Chile"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Fecha de inicio</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="month"
                      value={currentExperience.startDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha de término</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="month"
                      value={currentExperience.endDate}
                      onChange={handleChange}
                      disabled={currentExperience.current}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="current"
                    name="current"
                    checked={currentExperience.current}
                    onCheckedChange={(checked) => setCurrentExperience({ ...currentExperience, current: !!checked })}
                  />
                  <Label htmlFor="current" className="font-normal">
                    Trabajo actual
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={currentExperience.description}
                    onChange={handleChange}
                    placeholder="Describe tus responsabilidades y logros..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetExperienceForm}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleSaveExperience}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="flex justify-end">
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  )
}

// Componente para editar intereses
const InterestsForm = ({ data, onSave }) => {
  const [interests, setInterests] = useState(data)
  const [newInterest, setNewInterest] = useState("")

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()])
      setNewInterest("")
    }
  }

  const handleRemoveInterest = (index) => {
    setInterests(interests.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(interests)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Mis intereses</Label>
        <div className="flex gap-2">
          <Input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Añadir nuevo interés"
          />
          <Button type="button" onClick={handleAddInterest} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Los intereses te ayudan a conectar con personas afines y mostrar tu personalidad.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {interests.map((interest, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
            {interest}
            <button
              type="button"
              onClick={() => handleRemoveInterest(index)}
              className="ml-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  )
}

// Profile sections data
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
    description: "Dónde te encuentras",
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
    id: "availability",
    title: "Disponibilidad",
    description: "Cuándo estás disponible",
    icon: Clock,
    completed: true,
  },
  {
    id: "languages",
    title: "Idiomas",
    description: "Qué idiomas hablas",
    icon: Globe,
    completed: true,
  },
  {
    id: "experience",
    title: "Experiencia",
    description: "Tu experiencia profesional",
    icon: Star,
    completed: false,
  },
  {
    id: "interests",
    title: "Intereses",
    description: "Qué te gusta hacer",
    icon: Heart,
    completed: false,
  },
]

export default function EditProfilePage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [profileData, setProfileData] = useState(initialProfileData)
  const [completedSections, setCompletedSections] = useState(
    profileSections.filter((section) => section.completed).length,
  )

  const totalSections = profileSections.length
  const completionPercentage = Math.round((completedSections / totalSections) * 100)

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId)
  }

  const handlePhotoEdit = () => {
    // En una aplicación real, esto abriría un modal para subir una foto
    console.log("Editando foto de perfil")
  }

  const handleSaveProfile = () => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      router.push("/profile")
    }, 2000)
  }

  const handleSaveSection = (sectionId: string, data: any) => {
    setProfileData((prev) => ({
      ...prev,
      [sectionId === "basic-info" ? "basicInfo" : sectionId]: data,
    }))

    // Marcar la sección como completada si no lo estaba
    const sectionIndex = profileSections.findIndex((section) => section.id === sectionId)
    if (sectionIndex !== -1 && !profileSections[sectionIndex].completed) {
      profileSections[sectionIndex].completed = true
      setCompletedSections(completedSections + 1)
    }

    // Mostrar mensaje de éxito
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedSection(null)
    }, 1500)
  }

  const renderSectionForm = () => {
    switch (selectedSection) {
      case "basic-info":
        return <BasicInfoForm data={profileData.basicInfo} onSave={(data) => handleSaveSection("basic-info", data)} />
      case "location":
        return <LocationForm data={profileData.location} onSave={(data) => handleSaveSection("location", data)} />
      case "about":
        return <AboutForm data={profileData.about} onSave={(data) => handleSaveSection("about", data)} />
      case "services":
        return <ServicesForm data={profileData.services} onSave={(data) => handleSaveSection("services", data)} />
      case "availability":
        return (
          <AvailabilityForm
            data={profileData.availability}
            onSave={(data) => handleSaveSection("availability", data)}
          />
        )
      case "languages":
        return <LanguagesForm data={profileData.languages} onSave={(data) => handleSaveSection("languages", data)} />
      case "experience":
        return <ExperienceForm data={profileData.experience} onSave={(data) => handleSaveSection("experience", data)} />
      case "interests":
        return <InterestsForm data={profileData.interests} onSave={(data) => handleSaveSection("interests", data)} />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="mb-6">
            <Link href="/profile" className="flex items-center text-primary hover:underline">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al perfil
            </Link>
          </div>

          {showSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                {selectedSection
                  ? "Sección actualizada exitosamente!"
                  : "¡Perfil actualizado exitosamente! Redirigiendo..."}
              </AlertDescription>
            </Alert>
          )}

          {/* Header Section */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Profile Photo */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src="/images/juan-perez.jpg" alt="Juan Pérez" />
                      <AvatarFallback className="text-2xl">JP</AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full"
                      onClick={handlePhotoEdit}
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Mi perfil</h1>
                    <p className="text-muted-foreground">
                      Los clientes y oferentes pueden ver tu perfil para conocerte mejor y generar confianza en nuestra
                      comunidad.
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Completitud del perfil</span>
                      <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-xl font-bold">{completedSections}</div>
                      <div className="text-xs text-muted-foreground">Secciones completas</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-xl font-bold">4.8</div>
                      <div className="text-xs text-muted-foreground">Calificación</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-xl font-bold">{profileData.services.length}</div>
                      <div className="text-xs text-muted-foreground">Servicios</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedSection ? (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    {profileSections.find((section) => section.id === selectedSection)?.title}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSection(null)}>
                    <X className="h-4 w-4 mr-1" /> Cerrar
                  </Button>
                </div>
                {renderSectionForm()}
              </CardContent>
            </Card>
          ) : (
            /* Profile Sections Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {profileSections.map((section) => {
                const IconComponent = section.icon
                return (
                  <Card
                    key={section.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/20"
                    onClick={() => handleSectionClick(section.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{section.title}</h3>
                            <p className="text-sm text-muted-foreground">{section.description}</p>

                            {/* Show preview of data */}
                            <div className="mt-2">
                              {section.id === "basic-info" && (
                                <p className="text-sm font-medium">{profileData.basicInfo.name}</p>
                              )}
                              {section.id === "location" && (
                                <p className="text-sm font-medium">
                                  {profileData.location.city}, {profileData.location.country}
                                </p>
                              )}
                              {section.id === "services" && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {profileData.services?.slice(0, 2).map((service, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {service}
                                    </Badge>
                                  ))}
                                  {profileData.services && profileData.services.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{profileData.services.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              {section.id === "about" && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {profileData.about.bio?.substring(0, 60)}...
                                </p>
                              )}
                              {section.id === "availability" && (
                                <p className="text-sm text-muted-foreground">
                                  {profileData.availability.days.length > 0
                                    ? `${profileData.availability.days[0]}${
                                        profileData.availability.days.length > 1 ? "..." : ""
                                      } ${profileData.availability.startTime} - ${profileData.availability.endTime}`
                                    : "Sin especificar"}
                                </p>
                              )}
                              {section.id === "languages" && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {profileData.languages?.slice(0, 2).map((lang, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {lang.name}
                                    </Badge>
                                  ))}
                                  {profileData.languages && profileData.languages.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{profileData.languages.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              {section.id === "experience" && (
                                <p className="text-sm text-muted-foreground">
                                  {profileData.experience.length > 0
                                    ? `${profileData.experience[0].title} en ${profileData.experience[0].company}`
                                    : "Sin experiencia registrada"}
                                </p>
                              )}
                              {section.id === "interests" && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {profileData.interests?.slice(0, 2).map((interest, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {interest}
                                    </Badge>
                                  ))}
                                  {profileData.interests && profileData.interests.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{profileData.interests.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              {!section.completed && (
                                <p className="text-sm text-muted-foreground italic">Sin completar</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {section.completed && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button onClick={handleSaveProfile} size="lg" className="px-8">
              Guardar cambios
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push("/profile")}>
              Cancelar
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
