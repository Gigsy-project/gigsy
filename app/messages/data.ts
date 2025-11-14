import type { Conversation, Message, Service } from "@/lib/types"

export const initialConversations: Conversation[] = [
  {
    id: 1,
    name: "Herman",
    lastMessage: "Hola, necesito ayuda con una mudanza",
    timestamp: "10:30",
    unread: true,
    serviceId: 1,
    avatar: "/images/hernan.jpg",
  },
  {
    id: 2,
    name: "Josefa",
    lastMessage: "¿Cuándo podrías venir a limpiar?",
    timestamp: "Ayer",
    unread: false,
    serviceId: 2,
    avatar: "/images/josefa.jpg",
  },
  {
    id: 4, // Keep ID 4 for consistency with existing logic if it matters
    name: "Customer Service",
    lastMessage: "¡Hola! ¿En qué podemos ayudarte hoy?",
    timestamp: "En línea",
    unread: false,
    serviceId: 4, // Assuming serviceId 4 is for customer service
    avatar: "/images/logo.png",
  },
]

export const initialMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      sender: "other",
      text: "Hola, necesito ayuda con una mudanza el próximo fin de semana. ¿Estarías disponible?",
      timestamp: "10:30",
    },
    {
      id: 2,
      sender: "user",
      text: "¡Hola! Sí, estoy disponible. ¿Qué día exactamente y cuántas cosas hay que mover?",
      timestamp: "10:32",
    },
    {
      id: 3,
      sender: "other",
      text: "El sábado 24 de mayo. Son principalmente muebles de una habitación y algunas cajas.",
      timestamp: "10:35",
      hasAttachment: true,
    },
  ],
  2: [
    {
      id: 1,
      sender: "other",
      text: "Hola, estoy buscando alguien que pueda limpiar mi departamento una vez por semana.",
      timestamp: "Ayer",
    },
    {
      id: 2,
      sender: "user",
      text: "¡Hola! Puedo ayudarte con eso. ¿Qué día te gustaría que fuera?",
      timestamp: "Ayer",
    },
    {
      id: 3,
      sender: "other",
      text: "¿Cuándo podrías venir a limpiar?",
      timestamp: "Ayer",
    },
  ],
  4: [
    // Messages for Customer Service
    {
      id: 1,
      sender: "support",
      text: "¡Hola! Soy parte del equipo de atención al cliente de AidMarkt. Estamos aquí para ayudarte con cualquier pregunta o problema que puedas tener. ¿En qué podemos asistirte hoy?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ],
}

export const initialServices: Record<number, Service> = {
  1: {
    id: 1,
    title: "Ayuda con mudanza",
    date: "24 de mayo, 2025",
    time: "14:00 - 18:00",
    location: "Las Condes, Santiago",
    price: "$45.000 CLP",
    status: "confirmed",
    description:
      "Necesito ayuda para mover muebles de una habitación y algunas cajas. Son principalmente muebles pequeños y medianos.",
  },
  2: {
    id: 2,
    title: "Limpieza de departamento",
    date: "20 de mayo, 2025",
    time: "10:00 - 13:00",
    location: "Providencia, Santiago",
    price: "$35.000 CLP",
    status: "pending",
    description: "Limpieza general de un departamento de 2 habitaciones, incluye baños y cocina.",
  },
  4: {
    // Service details for Customer Service
    id: 4,
    title: "Atención al Cliente",
    date: "Disponible 24/7",
    time: "Siempre disponible",
    location: "Chat en línea",
    price: "Gratuito",
    status: "confirmed",
    description:
      "Soporte técnico y atención al cliente para resolver dudas sobre la plataforma, problemas técnicos, y asistencia general.",
  },
}
