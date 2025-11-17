import { Book, HelpCircle, MessageCircleIcon } from "lucide-react" // Renamed to avoid conflict
import type { HelpCategory, FAQ } from "@/lib/types"

export const helpCategoriesData: HelpCategory[] = [
  {
    id: "getting-started",
    title: "Primeros pasos",
    icon: <Book className="h-5 w-5" />,
    description: "Aprende lo básico para usar AidMarkt",
    articles: [
      {
        id: "create-account",
        title: "Cómo crear una cuenta",
        content:
          "Para crear una cuenta en AidMarkt, sigue estos pasos:\n\n1. Haz clic en 'Registrarse' en la página principal\n2. Completa tus datos personales\n3. Verifica tu email\n4. Sube los documentos requeridos\n5. ¡Listo! Ya puedes usar la plataforma",
        tags: ["registro", "cuenta", "verificación"],
        helpful: 45,
        views: 234,
      },
      {
        id: "profile-setup",
        title: "Configurar tu perfil",
        content:
          "Un perfil completo te ayuda a conseguir más trabajos:\n\n• Sube una foto profesional\n• Describe tus habilidades\n• Agrega tu experiencia\n• Establece tu disponibilidad\n• Completa la verificación de identidad",
        tags: ["perfil", "configuración", "verificación"],
        helpful: 38,
        views: 189,
      },
    ],
  },
  {
    id: "services",
    title: "Servicios",
    icon: <HelpCircle className="h-5 w-5" />,
    description: "Todo sobre ofrecer y solicitar servicios",
    articles: [
      {
        id: "request-service",
        title: "Cómo solicitar un servicio",
        content:
          "Para solicitar ayuda:\n\n1. Haz clic en 'Buscar ayuda'\n2. Describe detalladamente lo que necesitas\n3. Establece fecha, hora y ubicación\n4. Define tu presupuesto\n5. Publica tu solicitud\n6. Revisa las ofertas que recibas",
        tags: ["solicitar", "servicio", "ayuda"],
        helpful: 52,
        views: 312,
      },
      {
        id: "offer-service",
        title: "Cómo ofrecer servicios",
        content:
          "Para generar ingresos ayudando:\n\n1. Completa tu perfil profesional\n2. Define tus servicios y tarifas\n3. Establece tu disponibilidad\n4. Responde a solicitudes relevantes\n5. Negocia términos si es necesario\n6. Confirma el trabajo",
        tags: ["ofrecer", "trabajo", "ingresos"],
        helpful: 41,
        views: 278,
      },
    ],
  },
  {
    id: "payments",
    title: "Pagos y facturación",
    icon: <MessageCircleIcon className="h-5 w-5" />, // Use renamed import
    description: "Información sobre pagos seguros",
    articles: [
      {
        id: "payment-process",
        title: "Cómo funcionan los pagos",
        content:
          "AidMarkt garantiza pagos seguros:\n\n• El dinero se retiene hasta completar el servicio\n• El cliente confirma la satisfacción\n• Se libera el pago al oferente\n• Comisión del 10% por transacción\n• Pagos procesados en 24-48 horas",
        tags: ["pagos", "seguridad", "comisión"],
        helpful: 67,
        views: 445,
      },
      {
        id: "withdraw-money",
        title: "Retirar dinero",
        content:
          "Para retirar tus ganancias:\n\n1. Ve a tu billetera\n2. Haz clic en 'Retirar'\n3. Selecciona tu método de pago\n4. Confirma la cantidad\n5. El dinero llegará en 1-3 días hábiles",
        tags: ["retiro", "billetera", "ganancias"],
        helpful: 29,
        views: 156,
      },
    ],
  },
  {
    id: "safety",
    title: "Seguridad",
    icon: <HelpCircle className="h-5 w-5" />,
    description: "Mantente seguro en la plataforma",
    articles: [
      {
        id: "safety-tips",
        title: "Consejos de seguridad",
        content:
          "Para tu seguridad:\n\n• Verifica siempre la identidad del usuario\n• Comunícate solo a través de la plataforma\n• Reporta comportamientos sospechosos\n• No compartas información personal sensible\n• Confía en tu instinto",
        tags: ["seguridad", "consejos", "protección"],
        helpful: 73,
        views: 521,
      },
    ],
  },
]

export const faqsData: FAQ[] = [
  {
    id: "faq-1",
    question: "¿Cómo puedo cambiar mi contraseña?",
    answer:
      "Ve a tu perfil, haz clic en 'Editar perfil' y luego en 'Cambiar contraseña'. Ingresa tu contraseña actual y la nueva.",
    category: "cuenta",
  },
  {
    id: "faq-2",
    question: "¿Qué hago si no recibo respuestas a mi solicitud?",
    answer:
      "Asegúrate de que tu solicitud sea clara y detallada. También puedes ajustar el presupuesto o ampliar la zona de búsqueda.",
    category: "servicios",
  },
  {
    id: "faq-3",
    question: "¿Cuánto tiempo tarda en procesarse un pago?",
    answer:
      "Los pagos se procesan automáticamente 24 horas después de que el cliente confirme la satisfacción del servicio.",
    category: "pagos",
  },
  {
    id: "faq-4",
    question: "¿Puedo cancelar un servicio ya confirmado?",
    answer:
      "Sí, pero debe hacerse con al menos 24 horas de anticipación. Cancelaciones tardías pueden afectar tu calificación.",
    category: "servicios",
  },
  {
    id: "faq-5",
    question: "¿Cómo reporto un problema con otro usuario?",
    answer: "Usa el botón 'Reportar' en el perfil del usuario o contacta directamente a soporte a través del chat.",
    category: "seguridad",
  },
]
