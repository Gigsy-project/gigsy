export const APP_CONFIG = {
  name: "AidMarkt",
  version: "2.0",
  supportEmail: "soporte@aidmarkt.com",
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedImageTypes: ["image/jpeg", "image/png", "image/webp"],
  supportedDocumentTypes: [".pdf", ".doc", ".docx"],
} as const

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  profile: "/profile",
  profileEdit: "/profile/edit",
  profileType: "/profile-type",
  messages: "/messages",
  calendar: "/calendar",
  wallet: "/wallet",
  helpCenter: "/help-center",
  help: "/help",
  requestService: "/request-service",
  earn: "/earn",
  browseServices: "/browse-services",
} as const

export const STORAGE_KEYS = {
  isLoggedIn: "isLoggedIn",
  language: "language",
  theme: "theme",
} as const

export const BANKS = [
  { value: "santander", label: "Santander" },
  { value: "estado", label: "Banco Estado" },
  { value: "chile", label: "Banco de Chile" },
  { value: "bci", label: "BCI" },
  { value: "scotiabank", label: "Scotiabank" },
  { value: "itau", label: "Itaú" },
] as const

export const ACCOUNT_TYPES = [
  { value: "corriente", label: "Cuenta Corriente" },
  { value: "vista", label: "Cuenta Vista" },
  { value: "ahorro", label: "Cuenta de Ahorro" },
  { value: "rut", label: "Cuenta RUT" },
] as const

export const SERVICE_CATEGORIES = [
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
] as const

export const LOCATIONS = [
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
] as const
