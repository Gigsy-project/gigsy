"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Language = "es" | "en" | "pt"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Comprehensive translations for all sections
const translations = {
  es: {
    // General
    "app.name": "AidMarkt",
    "app.tagline": "Conectando personas que necesitan ayuda con quienes pueden ofrecerla",

    // Hero section
    "hero.title": "Conecta con alguien que te ayude o empieza a generar ingresos ayudando a otros",
    "hero.subtitle": "Rápido, seguro, eficiente",

    // Buttons
    "button.register": "Registrarse",
    "button.login": "Iniciar sesión",
    "button.submit": "Enviar",
    "button.continue": "Continuar",
    "button.back": "Atrás",
    "button.cancel": "Cancelar",
    "button.save": "Guardar",
    "button.edit": "Editar",
    "button.delete": "Eliminar",
    "button.search": "Buscar",
    "button.filter": "Filtrar",
    "button.earn": "Ofrecer servicios",
    "button.help": "Buscar ayuda",
    "button.logout": "Cerrar sesión",
    "button.complete": "Completar perfil",

    // Forms
    "form.id": "Foto de ID (frente y reverso)",
    "form.profile": "Foto de perfil",
    "form.criminal": "Certificado de antecedentes penales",
    "form.phone": "Teléfono",
    "form.email": "Correo electrónico",
    "form.password": "Contraseña",
    "form.confirmPassword": "Confirmar contraseña",
    "form.need": "¿Qué necesitas?",
    "form.when": "¿Cuándo?",
    "form.where": "¿Dónde? (Dirección o en línea)",
    "form.description": "Descripción",
    "form.price": "¿Cuánto ofreces?",
    "form.services": "¿Qué tipo de servicios puedes ofrecer?",
    "form.location": "¿En qué comuna trabajas?",
    "form.availability": "¿Cuál es tu disponibilidad horaria?",
    "form.transport": "¿Tienes cómo movilizarte?",
    "form.bank": "Datos bancarios",
    "form.submit": "Enviar",
    "form.upload": "Subir",
    "form.uploadFiles": "Subir archivos",
    "form.uploadPhotos": "Subir fotos/videos",
    "form.title": "Título",
    "form.address": "Dirección exacta",
    "form.startTime": "Hora inicio",
    "form.endTime": "Hora fin",
    "form.bankName": "Banco",
    "form.accountType": "Tipo de cuenta",
    "form.accountNumber": "Número de cuenta",
    "form.rut": "RUT",

    // Success messages
    "success.help": "Gracias. Te contactaremos pronto con alguien que pueda ayudarte.",
    "success.earn": "Gracias. Te avisaremos cuando tengamos una solicitud para ti.",

    // Payment
    "payment.title": "Pago seguro",
    "payment.button": "Pagar ahora",
    "payment.secure":
      "El pago se mantendrá en una billetera segura hasta que confirmes que el servicio ha sido completado satisfactoriamente.",

    // Navigation
    "nav.messages": "Mensajes",
    "nav.profile": "Perfil",
    "nav.calendar": "Calendario",
    "nav.income": "Ingresos",
    "nav.wallet": "Billetera",
    "nav.help": "Centro de Ayuda",
    "nav.home": "Inicio",
    "nav.account": "Mi cuenta",

    // Services
    "services.cleaning": "Aseo",
    "services.classes": "Clases",
    "services.moving": "Mudanzas",
    "services.repairs": "Reparaciones",
    "services.errands": "Trámites",
    "services.other": "Otro",

    // Profile
    "profile.type": "Tipo de perfil",
    "profile.demandante": "Busco ayuda (Demandante)",
    "profile.oferente": "Ofrezco servicios (Oferente)",
    "profile.complete": "Completar perfil",
    "profile.about": "Acerca de mí",
    "profile.skills": "Habilidades",
    "profile.availability": "Disponibilidad",
    "profile.services": "Servicios",
    "profile.reviews": "Reseñas",
    "profile.favorites": "Favoritos",
    "profile.edit": "Editar perfil",
    "profile.switch": "Cambiar a",
    "profile.switchInfo":
      "No te preocupes, podrás cambiar entre ambos perfiles en cualquier momento desde la aplicación.",

    // Register
    "register.title": "Crear una cuenta",
    "register.subtitle": "Regístrate para comenzar",
    "register.step1": "Información básica",
    "register.step2": "Verificación",

    // Login
    "login.title": "Iniciar sesión",
    "login.subtitle": "Ingresa tus credenciales para acceder a tu cuenta",
    "login.forgotPassword": "¿Olvidaste tu contraseña?",
    "login.noAccount": "¿No tienes una cuenta?",
    "login.continueWithGoogle": "Continuar con Google",
    "login.continueWithApple": "Continuar con Apple",
    "login.orContinueWithSocial": "O continuar con redes sociales",

    // Help center
    "help.title": "Centro de Ayuda",
    "help.subtitle": "Estamos aquí para ayudarte",
    "help.welcome": "Bienvenido al Centro de Ayuda",
    "help.description":
      "Aquí puedes obtener asistencia con problemas relacionados con la plataforma o con otros usuarios.",
    "help.support": "Soporte AidMarkt",
    "help.online": "En línea",
    "help.message": "Escribe tu mensaje...",

    // Calendar
    "calendar.title": "Calendario",
    "calendar.upcoming": "Próximos servicios",
    "calendar.select": "Selecciona una fecha",
    "calendar.noServices": "No hay servicios programados para esta fecha",
    "calendar.confirmed": "Confirmado",
    "calendar.pending": "Pendiente",

    // Wallet
    "wallet.title": "Billetera",
    "wallet.balance": "Saldo disponible",
    "wallet.income": "Ingresos totales",
    "wallet.services": "Servicios completados",
    "wallet.withdraw": "Retirar",
    "wallet.export": "Exportar",
    "wallet.details": "Ver detalles",
    "wallet.transactions": "Historial de transacciones",
    "wallet.chart": "Ingresos por mes",

    // Messages
    "messages.title": "Mensajes",
    "messages.helpCenter": "Centro de Ayuda 24/7",
    "messages.select": "Selecciona una conversación",
    "messages.details": "Detalles del servicio",
    "messages.write": "Escribe un mensaje...",
    "messages.date": "Fecha y hora",
    "messages.location": "Ubicación",
    "messages.price": "Precio",
    "messages.description": "Descripción",
    "messages.accept": "Aceptar servicio",
    "messages.counter": "Hacer contraoferta",

    // How it works
    "how.title": "¿Cómo funciona?",
    "how.step1": "Regístrate",
    "how.step1desc": "Crea tu perfil como demandante u oferente de servicios.",
    "how.step2": "Conecta",
    "how.step2desc": "Solicita ayuda o recibe notificaciones de trabajos disponibles.",
    "how.step3": "Completa",
    "how.step3desc": "Realiza el servicio, recibe el pago y deja una reseña.",

    // Footer
    "footer.terms": "Términos",
    "footer.privacy": "Privacidad",
    "footer.help": "Ayuda",
    "footer.rights": "Todos los derechos reservados.",

    // Days
    "days.monday": "Lunes",
    "days.tuesday": "Martes",
    "days.wednesday": "Miércoles",
    "days.thursday": "Jueves",
    "days.friday": "Viernes",
    "days.saturday": "Sábado",
    "days.sunday": "Domingo",

    // Service request
    "request.title": "Busca ayuda inmediata",
    "request.subtitle": "Cuéntanos qué tipo de ayuda necesitas para encontrar a la persona adecuada.",
    "request.place": "Lugar",
    "request.presential": "Presencial",
    "request.online": "Online",

    // Oferente
    "oferente.title": "Información de servicios",
    "oferente.subtitle": "Cuéntanos qué servicios puedes ofrecer y tu disponibilidad",

    "register.continueWithGoogle": "Continuar con Google",
    "register.continueWithApple": "Continuar con Apple",
    "register.orSignUpWithSocial": "O regístrate con redes sociales",
    "register.getCertificateLink": "Obtén tu certificado de antecedentes gratis aquí",
    "register.alreadyHaveAccount": "¿Ya tienes una cuenta?",
  },

  en: {
    // General
    "app.name": "AidMarkt",
    "app.tagline": "Connecting people who need help with those who can offer it",

    // Hero section
    "hero.title": "Connect with someone who can help or start earning by helping others",
    "hero.subtitle": "Fast, secure, efficient",

    // Buttons
    "button.register": "Register",
    "button.login": "Login",
    "button.submit": "Submit",
    "button.continue": "Continue",
    "button.back": "Back",
    "button.cancel": "Cancel",
    "button.save": "Save",
    "button.edit": "Edit",
    "button.delete": "Delete",
    "button.search": "Search",
    "button.filter": "Filter",
    "button.earn": "Offer services",
    "button.help": "Find help",
    "button.logout": "Logout",
    "button.complete": "Complete profile",

    // Forms
    "form.id": "ID Photo (front and back)",
    "form.profile": "Profile photo",
    "form.criminal": "Criminal background certificate",
    "form.phone": "Phone",
    "form.email": "Email",
    "form.password": "Password",
    "form.confirmPassword": "Confirm password",
    "form.need": "What do you need?",
    "form.when": "When?",
    "form.where": "Where? (Address or online)",
    "form.description": "Description",
    "form.price": "How much are you offering?",
    "form.services": "What type of services can you offer?",
    "form.location": "In which district do you work?",
    "form.availability": "What is your availability?",
    "form.transport": "Do you have transportation?",
    "form.bank": "Bank details",
    "form.submit": "Submit",
    "form.upload": "Upload",
    "form.uploadFiles": "Upload files",
    "form.uploadPhotos": "Upload photos/videos",
    "form.title": "Title",
    "form.address": "Exact address",
    "form.startTime": "Start time",
    "form.endTime": "End time",
    "form.bankName": "Bank",
    "form.accountType": "Account type",
    "form.accountNumber": "Account number",
    "form.rut": "Tax ID",

    // Success messages
    "success.help": "Thank you. We will contact you soon with someone who can help you.",
    "success.earn": "Thank you. We will notify you when we have a request for you.",

    // Payment
    "payment.title": "Secure payment",
    "payment.button": "Pay now",
    "payment.secure":
      "The payment will be held in a secure wallet until you confirm that the service has been completed satisfactorily.",

    // Navigation
    "nav.messages": "Messages",
    "nav.profile": "Profile",
    "nav.calendar": "Calendar",
    "nav.income": "Income",
    "nav.wallet": "Wallet",
    "nav.help": "Help Center",
    "nav.home": "Home",
    "nav.account": "My account",

    // Services
    "services.cleaning": "Cleaning",
    "services.classes": "Classes",
    "services.moving": "Moving",
    "services.repairs": "Repairs",
    "services.errands": "Errands",
    "services.other": "Other",

    // Profile
    "profile.type": "Profile type",
    "profile.demandante": "Looking for help (Requester)",
    "profile.oferente": "Offering services (Provider)",
    "profile.complete": "Complete profile",
    "profile.about": "About me",
    "profile.skills": "Skills",
    "profile.availability": "Availability",
    "profile.services": "Services",
    "profile.reviews": "Reviews",
    "profile.favorites": "Favorites",
    "profile.edit": "Edit profile",
    "profile.switch": "Switch to",
    "profile.switchInfo": "Don't worry, you can switch between both profiles at any time from the application.",

    // Register
    "register.title": "Create an account",
    "register.subtitle": "Register to get started",
    "register.step1": "Basic information",
    "register.step2": "Verification",

    // Login
    "login.title": "Login",
    "login.subtitle": "Enter your credentials to access your account",
    "login.forgotPassword": "Forgot your password?",
    "login.noAccount": "Don't have an account?",
    "login.continueWithGoogle": "Continue with Google",
    "login.continueWithApple": "Continue with Apple",
    "login.orContinueWithSocial": "Or continue with social media",

    // Help center
    "help.title": "Help Center",
    "help.subtitle": "We're here to help you",
    "help.welcome": "Welcome to the Help Center",
    "help.description": "Here you can get assistance with platform-related issues or with other users.",
    "help.support": "AidMarkt Support",
    "help.online": "Online",
    "help.message": "Write your message...",

    // Calendar
    "calendar.title": "Calendar",
    "calendar.upcoming": "Upcoming services",
    "calendar.select": "Select a date",
    "calendar.noServices": "No services scheduled for this date",
    "calendar.confirmed": "Confirmed",
    "calendar.pending": "Pending",

    // Wallet
    "wallet.title": "Wallet",
    "wallet.balance": "Available balance",
    "wallet.income": "Total income",
    "wallet.services": "Completed services",
    "wallet.withdraw": "Withdraw",
    "wallet.export": "Export",
    "wallet.details": "View details",
    "wallet.transactions": "Transaction history",
    "wallet.chart": "Income by month",

    // Messages
    "messages.title": "Messages",
    "messages.helpCenter": "24/7 Help Center",
    "messages.select": "Select a conversation",
    "messages.details": "Service details",
    "messages.write": "Write a message...",
    "messages.date": "Date and time",
    "messages.location": "Location",
    "messages.price": "Price",
    "messages.description": "Description",
    "messages.accept": "Accept service",
    "messages.counter": "Make counter-offer",

    // How it works
    "how.title": "How does it work?",
    "how.step1": "Register",
    "how.step1desc": "Create your profile as a requester or service provider.",
    "how.step2": "Connect",
    "how.step2desc": "Request help or receive notifications of available jobs.",
    "how.step3": "Complete",
    "how.step3desc": "Perform the service, receive payment, and leave a review.",

    // Footer
    "footer.terms": "Terms",
    "footer.privacy": "Privacy",
    "footer.help": "Help",
    "footer.rights": "All rights reserved.",

    // Days
    "days.monday": "Monday",
    "days.tuesday": "Tuesday",
    "days.wednesday": "Wednesday",
    "days.thursday": "Thursday",
    "days.friday": "Friday",
    "days.saturday": "Saturday",
    "days.sunday": "Sunday",

    // Service request
    "request.title": "Find immediate help",
    "request.subtitle": "Tell us what kind of help you need to find the right person.",
    "request.place": "Place",
    "request.presential": "In-person",
    "request.online": "Online",

    // Oferente
    "oferente.title": "Service information",
    "oferente.subtitle": "Tell us what services you can offer and your availability",

    "register.continueWithGoogle": "Continue with Google",
    "register.continueWithApple": "Continue with Apple",
    "register.orSignUpWithSocial": "Or sign up with social media",
  },

  pt: {
    // General
    "app.name": "AidMarkt",
    "app.tagline": "Conectando pessoas que precisam de ajuda com aquelas que podem oferecê-la",

    // Hero section
    "hero.title": "Conecte-se com alguém que possa ajudar ou comece a ganhar ajudando os outros",
    "hero.subtitle": "Rápido, seguro, eficiente",

    // Buttons
    "button.register": "Registrar",
    "button.login": "Entrar",
    "button.submit": "Enviar",
    "button.continue": "Continuar",
    "button.back": "Voltar",
    "button.cancel": "Cancelar",
    "button.save": "Salvar",
    "button.edit": "Editar",
    "button.delete": "Excluir",
    "button.search": "Buscar",
    "button.filter": "Filtrar",
    "button.earn": "Oferecer serviços",
    "button.help": "Buscar ajuda",
    "button.logout": "Sair",
    "button.complete": "Completar perfil",

    // Forms
    "form.id": "Foto do ID (frente e verso)",
    "form.profile": "Foto de perfil",
    "form.criminal": "Certificado de antecedentes criminais",
    "form.phone": "Telefone",
    "form.email": "Email",
    "form.password": "Senha",
    "form.confirmPassword": "Confirmar senha",
    "form.need": "O que você precisa?",
    "form.when": "Quando?",
    "form.where": "Onde? (Endereço ou online)",
    "form.description": "Descrição",
    "form.price": "Quanto você está oferecendo?",
    "form.services": "Que tipo de serviços você pode oferecer?",
    "form.location": "Em qual distrito você trabalha?",
    "form.availability": "Qual é a sua disponibilidade?",
    "form.transport": "Você tem transporte?",
    "form.bank": "Dados bancários",
    "form.submit": "Enviar",
    "form.upload": "Carregar",
    "form.uploadFiles": "Carregar arquivos",
    "form.uploadPhotos": "Carregar fotos/vídeos",
    "form.title": "Título",
    "form.address": "Endereço exato",
    "form.startTime": "Hora de início",
    "form.endTime": "Hora de término",
    "form.bankName": "Banco",
    "form.accountType": "Tipo de conta",
    "form.accountNumber": "Número da conta",
    "form.rut": "CPF",

    // Success messages
    "success.help": "Obrigado. Entraremos em contato em breve com alguém que possa ajudá-lo.",
    "success.earn": "Obrigado. Notificaremos você quando tivermos uma solicitação para você.",

    // Payment
    "payment.title": "Pagamento seguro",
    "payment.button": "Pagar agora",
    "payment.secure":
      "O pagamento será mantido em uma carteira segura até que você confirme que o serviço foi concluído satisfatoriamente.",

    // Navigation
    "nav.messages": "Mensagens",
    "nav.profile": "Perfil",
    "nav.calendar": "Calendário",
    "nav.income": "Renda",
    "nav.wallet": "Carteira",
    "nav.help": "Central de Ajuda",
    "nav.home": "Início",
    "nav.account": "Minha conta",

    // Services
    "services.cleaning": "Limpeza",
    "services.classes": "Aulas",
    "services.moving": "Mudanças",
    "services.repairs": "Reparos",
    "services.errands": "Recados",
    "services.other": "Outro",

    // Profile
    "profile.type": "Tipo de perfil",
    "profile.demandante": "Procurando ajuda (Solicitante)",
    "profile.oferente": "Oferecendo serviços (Provedor)",
    "profile.complete": "Completar perfil",
    "profile.about": "Sobre mim",
    "profile.skills": "Habilidades",
    "profile.availability": "Disponibilidade",
    "profile.services": "Serviços",
    "profile.reviews": "Avaliações",
    "profile.favorites": "Favoritos",
    "profile.edit": "Editar perfil",
    "profile.switch": "Mudar para",
    "profile.switchInfo": "Não se preocupe, você pode alternar entre os dois perfis a qualquer momento no aplicativo.",

    // Register
    "register.title": "Criar uma conta",
    "register.subtitle": "Registre-se para começar",
    "register.step1": "Informações básicas",
    "register.step2": "Verificação",

    // Login
    "login.title": "Entrar",
    "login.subtitle": "Digite suas credenciais para acessar sua conta",
    "login.forgotPassword": "Esqueceu sua senha?",
    "login.noAccount": "Não tem uma conta?",
    "login.continueWithGoogle": "Continuar com Google",
    "login.continueWithApple": "Continuar com Apple",
    "login.orContinueWithSocial": "Ou continuar com as redes sociais",

    // Help center
    "help.title": "Central de Ajuda",
    "help.subtitle": "Estamos aqui para ajudá-lo",
    "help.welcome": "Bem-vindo à Central de Ajuda",
    "help.description":
      "Aqui você pode obter assistência com problemas relacionados à plataforma ou com outros usuários.",
    "help.support": "Suporte AidMarkt",
    "help.online": "Online",
    "help.message": "Escreva sua mensagem...",

    // Calendar
    "calendar.title": "Calendário",
    "calendar.upcoming": "Próximos serviços",
    "calendar.select": "Selecione uma data",
    "calendar.noServices": "Não há serviços agendados para esta data",
    "calendar.confirmed": "Confirmado",
    "calendar.pending": "Pendente",

    // Wallet
    "wallet.title": "Carteira",
    "wallet.balance": "Saldo disponível",
    "wallet.income": "Renda total",
    "wallet.services": "Serviços concluídos",
    "wallet.withdraw": "Retirar",
    "wallet.export": "Exportar",
    "wallet.details": "Ver detalhes",
    "wallet.transactions": "Histórico de transações",
    "wallet.chart": "Renda por mês",

    // Messages
    "messages.title": "Mensagens",
    "messages.helpCenter": "Central de Ajuda 24/7",
    "messages.select": "Selecione uma conversa",
    "messages.details": "Detalhes do serviço",
    "messages.write": "Escreva uma mensagem...",
    "messages.date": "Data e hora",
    "messages.location": "Localização",
    "messages.price": "Preço",
    "messages.description": "Descrição",
    "messages.accept": "Aceitar serviço",
    "messages.counter": "Fazer contraproposta",

    // How it works
    "how.title": "Como funciona?",
    "how.step1": "Registre-se",
    "how.step1desc": "Crie seu perfil como solicitante ou provedor de serviços.",
    "how.step2": "Conecte-se",
    "how.step2desc": "Solicite ajuda ou receba notificações de trabalhos disponíveis.",
    "how.step3": "Complete",
    "how.step3desc": "Realize o serviço, receba o pagamento e deixe uma avaliação.",

    // Footer
    "footer.terms": "Termos",
    "footer.privacy": "Privacidade",
    "footer.help": "Ajuda",
    "footer.rights": "Todos os direitos reservados.",

    // Days
    "days.monday": "Segunda-feira",
    "days.tuesday": "Terça-feira",
    "days.wednesday": "Quarta-feira",
    "days.thursday": "Quinta-feira",
    "days.friday": "Sexta-feira",
    "days.saturday": "Sábado",
    "days.sunday": "Domingo",

    // Service request
    "request.title": "Encontre ajuda imediata",
    "request.subtitle": "Conte-nos que tipo de ajuda você precisa para encontrar a pessoa certa.",
    "request.place": "Local",
    "request.presential": "Presencial",
    "request.online": "Online",

    // Oferente
    "oferente.title": "Informações de serviço",
    "oferente.subtitle": "Conte-nos quais serviços você pode oferecer e sua disponibilidade",

    "register.continueWithGoogle": "Continuar com Google",
    "register.continueWithApple": "Continuar com Apple",
    "register.orSignUpWithSocial": "Ou cadastre-se com as redes sociais",
  },
} as const

const LanguageContext = createContext<LanguageContextType>({
  language: "es",
  setLanguage: () => {},
  t: () => "",
})

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useLocalStorage<Language>("language", "es")

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    document.documentElement.lang = lang
  }

  const t = useMemo(() => {
    return (key: string): string => {
      return translations[language][key as keyof (typeof translations)[typeof language]] || key
    }
  }, [language])

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage: handleSetLanguage,
      t,
    }),
    [language, t],
  )

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}
