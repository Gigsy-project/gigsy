"use client"

import { useState, useEffect, useMemo, useCallback } from "react" // Added useMemo, useCallback
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, MapPin, Clock, DollarSign, ImageIcon, Star, FileUp, Paperclip, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSearchParams } from "next/navigation"
import { ServiceBookingModal } from "@/components/service-booking-modal"
import { initialConversations, initialMessages, initialServices } from "./data" // Import data
import type { Conversation, Message, Service, Provider } from "@/lib/types" // Import types

const DEFAULT_ACTIVE_CONVERSATION_ID = initialConversations[0]?.id || null

export default function MessagesPage() {
  const router = useRouter()
  const [activeConversationId, setActiveConversationId] = useState<number | null>(DEFAULT_ACTIVE_CONVERSATION_ID)
  const [messageText, setMessageText] = useState("")
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [showMakeOfferModal, setShowMakeOfferModal] = useState(false)
  const [showAcceptServiceModal, setShowAcceptServiceModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [messages, setMessages] = useState<Record<number, Message[]>>(initialMessages)
  const [services, setServices] = useState<Record<number, Service>>(initialServices) // Make services stateful

  const [offerData, setOfferData] = useState({
    price: "",
    message: "",
    estimatedDuration: "",
    includesMaterials: false,
    additionalTerms: "",
  })
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)
  const [isAcceptingService, setIsAcceptingService] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    const newChatParam = searchParams?.get("newChat")
    const contactParam = searchParams?.get("contact")
    const providerIdParam = searchParams?.get("providerId")

    if (newChatParam === "customerService") {
      const existingCustomerService = conversations.find((c) => c.name === "Customer Service")
      if (existingCustomerService) {
        setActiveConversationId(existingCustomerService.id)
      } else {
        const newConvId = Date.now() // More unique ID
        const newConversation: Conversation = {
          id: newConvId,
          name: "Customer Service",
          lastMessage: "¡Hola! ¿En qué podemos ayudarte hoy?",
          timestamp: "Ahora",
          unread: true,
          serviceId: 4, // Assuming 4 is a general service ID for support
          avatar: "/images/logo.png",
        }
        setConversations((prev) => [newConversation, ...prev])
        setActiveConversationId(newConvId)
        setMessages((prev) => ({
          ...prev,
          [newConvId]: [
            {
              id: Date.now() + 1,
              sender: "support",
              text: "¡Hola! Soy parte del equipo de atención al cliente de AidMarkt. ¿En qué podemos asistirte hoy?",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        }))
        if (!services[4]) {
          setServices((prev) => ({
            ...prev,
            [4]: {
              id: 4,
              title: "Atención al Cliente",
              date: "Disponible 24/7",
              time: "Siempre disponible",
              location: "Chat en línea",
              price: "Gratuito",
              status: "confirmed",
              description: "Soporte técnico y atención al cliente.",
            },
          }))
        }
      }
    } else if (contactParam && providerIdParam) {
      const providerId = Number.parseInt(providerIdParam, 10)
      const existingConversation = conversations.find((c) => c.serviceId === providerId && c.name === contactParam)

      if (existingConversation) {
        setActiveConversationId(existingConversation.id)
      } else {
        const newConvId = Date.now()
        const newConversation: Conversation = {
          id: newConvId,
          name: contactParam,
          lastMessage: "¡Hola! Me gustaría contactarte para un servicio.",
          timestamp: "Ahora",
          unread: false, // Typically a new chat initiated by user isn't unread for them
          serviceId: providerId,
          avatar: `/placeholder.svg`, // Placeholder, ideally fetch provider avatar
        }
        setConversations((prev) => [newConversation, ...prev])
        setActiveConversationId(newConvId)
        setMessages((prev) => ({
          ...prev,
          [newConvId]: [
            {
              id: Date.now() + 1,
              sender: "user",
              text: "¡Hola! Vi tu perfil y me gustaría contactarte para solicitar un servicio.",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        }))
        if (!services[providerId]) {
          setServices((prev) => ({
            ...prev,
            [providerId]: {
              id: providerId,
              title: "Consulta de servicio",
              date: "Por definir",
              time: "Por definir",
              location: "Por definir",
              price: "Por negociar",
              status: "pending",
              description: `Consulta inicial para ${contactParam}.`,
            },
          }))
        }
      }
    }
  }, [searchParams, conversations, services]) // Added services to dependencies

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [activeConversationId, conversations],
  )

  const currentMessages = useMemo(
    () => (activeConversationId ? messages[activeConversationId] || [] : []),
    [activeConversationId, messages],
  )

  const currentService = useMemo(
    () => (activeConversation ? services[activeConversation.serviceId] : null),
    [activeConversation, services],
  )

  const handleSendMessage = useCallback(() => {
    if (messageText.trim() && activeConversationId) {
      const newMessage: Message = {
        id: Date.now(),
        sender: "user",
        text: messageText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: [...(prev[activeConversationId] || []), newMessage],
      }))
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId ? { ...conv, lastMessage: messageText.trim(), timestamp: "Ahora" } : conv,
        ),
      )
      setMessageText("")
      setShowAttachmentOptions(false)
    }
  }, [messageText, activeConversationId])

  const handleMakeOffer = useCallback(async () => {
    if (!offerData.price.trim() || !offerData.message.trim() || !activeConversationId) {
      return
    }
    setIsSubmittingOffer(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const newMessage: Message = {
        id: Date.now(),
        sender: "user",
        text: `He enviado una contraoferta: $${offerData.price} CLP - ${offerData.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: [...(prev[activeConversationId] || []), newMessage],
      }))
      setOfferData({ price: "", message: "", estimatedDuration: "", includesMaterials: false, additionalTerms: "" })
      setShowMakeOfferModal(false)
      alert("Contraoferta enviada exitosamente")
    } catch (error) {
      alert("Error al enviar la contraoferta. Intenta nuevamente.")
    } finally {
      setIsSubmittingOffer(false)
    }
  }, [offerData, activeConversationId])

  const handleAcceptService = useCallback(async () => {
    if (!activeConversationId) return
    setIsAcceptingService(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const newMessage: Message = {
        id: Date.now(),
        sender: "user",
        text: "He aceptado este servicio. ¡Nos vemos pronto!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: [...(prev[activeConversationId] || []), newMessage],
      }))
      // Update service status
      if (currentService) {
        setServices((prev) => ({ ...prev, [currentService.id]: { ...currentService, status: "confirmed" } }))
      }
      setShowAcceptServiceModal(false)
      alert("Servicio aceptado exitosamente. Revisa tu calendario para los detalles.")
    } catch (error) {
      alert("Error al aceptar el servicio. Intenta nuevamente.")
    } finally {
      setIsAcceptingService(false)
    }
  }, [activeConversationId, currentService])

  const handleBookingSuccess = useCallback(() => {
    setShowBookingModal(false)
    alert("¡Reserva enviada exitosamente! Revisa tu calendario para los detalles.")
    // Potentially navigate or update state further
  }, [])

  const currentProviderForBooking = useMemo((): Provider | null => {
    if (!activeConversation || activeConversation.name === "Customer Service") return null
    return {
      id: activeConversation.serviceId, // Assuming serviceId can represent providerId in this context
      name: activeConversation.name,
      avatar: activeConversation.avatar || "/placeholder.svg",
      services: currentService?.title ? [currentService.title] : ["Servicio General"], // Example, adjust as needed
      location: currentService?.location || "No especificada",
    }
  }, [activeConversation, currentService])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-6">
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
                <BreadcrumbPage>Mensajes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
            {/* Conversations list */}
            <div className="border rounded-lg overflow-hidden md:col-span-3">
              <div className="p-4 border-b bg-muted/30">
                <h2 className="font-semibold text-lg">Mensajes</h2>
              </div>
              <div className="overflow-y-auto h-[calc(100%-60px)]">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                      activeConversationId === conversation.id && "bg-muted/50",
                    )}
                    onClick={() => setActiveConversationId(conversation.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setActiveConversationId(conversation.id)
                    }}
                    aria-label={`Abrir chat con ${conversation.name}`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                        <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-medium truncate">{conversation.name}</h3>
                          <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                        </div>
                        <p
                          className={cn(
                            "text-sm truncate",
                            conversation.unread ? "font-medium" : "text-muted-foreground",
                          )}
                        >
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat area */}
            <div className="border rounded-lg overflow-hidden md:col-span-5 flex flex-col">
              {activeConversation ? (
                <>
                  <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={activeConversation.avatar || "/placeholder.svg"}
                        alt={activeConversation.name}
                      />
                      <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">{activeConversation.name}</h2>
                      <p className="text-xs text-muted-foreground">{currentService?.title}</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                      >
                        {message.sender !== "user" && ( // Show avatar for non-user messages
                          <Avatar className="h-8 w-8 mr-2 mt-1 shrink-0">
                            <AvatarImage
                              src={activeConversation?.avatar || "/placeholder.svg"}
                              alt={activeConversation?.name}
                            />
                            <AvatarFallback>{activeConversation?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg p-3",
                            message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <p>{message.text}</p>
                          {message.hasAttachment && (
                            <div className="mt-2 border rounded p-2 bg-background/50 flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" />
                              <span className="text-xs">foto_muebles.jpg</span> {/* Placeholder name */}
                            </div>
                          )}
                          <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t">
                    {showAttachmentOptions && (
                      <div className="mb-2 p-2 bg-muted/30 rounded-lg flex gap-2">
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4" />
                          <span>Foto</span>
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <FileUp className="h-4 w-4" />
                          <span>Archivo</span>
                        </Button>
                      </div>
                    )}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleSendMessage()
                      }}
                      className="flex gap-2"
                    >
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                        aria-label="Adjuntar archivo"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Escribe un mensaje..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                      <Button type="submit" size="icon" aria-label="Enviar mensaje">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="font-medium text-lg">Selecciona una conversación</h3>
                    <p className="text-muted-foreground">Elige un chat para ver los mensajes</p>
                  </div>
                </div>
              )}
            </div>

            {/* Service details */}
            <div className="border rounded-lg overflow-hidden md:col-span-4">
              {activeConversation && currentService ? (
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b bg-muted/30">
                    <h2 className="font-semibold text-lg">Detalles del servicio</h2>
                  </div>
                  <div className="overflow-y-auto p-4 flex-1">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold">{currentService.title}</h3>
                        <Badge className={cn(currentService.status === "confirmed" ? "bg-green-500" : "bg-yellow-500")}>
                          {currentService.status === "confirmed" ? "Confirmado" : "Pendiente"}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Fecha y hora</p>
                            <p className="text-sm text-muted-foreground">
                              {currentService.date}, {currentService.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Ubicación</p>
                            <p className="text-sm text-muted-foreground">{currentService.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Precio</p>
                            <p className="text-sm text-muted-foreground">{currentService.price}</p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Descripción</h4>
                        <p className="text-sm text-muted-foreground">{currentService.description}</p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Perfil de {activeConversation.name}</h4>
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={activeConversation.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{activeConversation.name}</p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                              <span className="text-xs ml-1">(12 reseñas)</span> {/* Placeholder */}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Miembro desde enero 2023</p> {/* Placeholder */}
                      </div>

                      {activeConversation.name !== "Customer Service" && (
                        <div className="flex flex-col gap-2">
                          <Dialog open={showAcceptServiceModal} onOpenChange={setShowAcceptServiceModal}>
                            <DialogTrigger asChild>
                              <Button className="w-full">Aceptar servicio</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Confirmar aceptación del servicio</DialogTitle>
                                <DialogDescription>
                                  Estás a punto de aceptar este servicio. Una vez confirmado, se establecerá el acuerdo.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <div className="p-4 bg-muted/30 rounded-lg">
                                  <h4 className="font-medium mb-2">Resumen del servicio:</h4>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    <strong>Servicio:</strong> {currentService.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    <strong>Fecha:</strong> {currentService.date}
                                  </p>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    <strong>Precio:</strong> {currentService.price}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    <strong>Ubicación:</strong> {currentService.location}
                                  </p>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setShowAcceptServiceModal(false)}>
                                  Cancelar
                                </Button>
                                <Button onClick={handleAcceptService} disabled={isAcceptingService}>
                                  {isAcceptingService ? "Procesando..." : "Confirmar aceptación"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" className="w-full" onClick={() => setShowBookingModal(true)}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Modificar reserva
                          </Button>

                          <Dialog open={showMakeOfferModal} onOpenChange={setShowMakeOfferModal}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full">
                                Hacer contraoferta
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Hacer contraoferta</DialogTitle>
                                <DialogDescription>Propón tus propios términos para este servicio.</DialogDescription>
                              </DialogHeader>
                              <div className="py-4 space-y-4">
                                <div>
                                  <Label htmlFor="offer-price">Precio propuesto (CLP) *</Label>
                                  <div className="relative mt-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">$</span>
                                    <Input
                                      id="offer-price"
                                      type="number"
                                      className="pl-7"
                                      placeholder="35000"
                                      value={offerData.price}
                                      onChange={(e) => setOfferData((prev) => ({ ...prev, price: e.target.value }))}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="offer-duration">Duración estimada</Label>
                                  <Input
                                    id="offer-duration"
                                    placeholder="Ej: 3 horas"
                                    value={offerData.estimatedDuration}
                                    onChange={(e) =>
                                      setOfferData((prev) => ({ ...prev, estimatedDuration: e.target.value }))
                                    }
                                    className="mt-1"
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="includes-materials"
                                    checked={offerData.includesMaterials}
                                    onCheckedChange={(checked) =>
                                      setOfferData((prev) => ({ ...prev, includesMaterials: Boolean(checked) }))
                                    }
                                  />
                                  <Label htmlFor="includes-materials" className="text-sm font-normal">
                                    Incluye materiales y herramientas
                                  </Label>
                                </div>
                                <div>
                                  <Label htmlFor="offer-message">Mensaje para el cliente *</Label>
                                  <Textarea
                                    id="offer-message"
                                    placeholder="Explica tu propuesta..."
                                    className="min-h-[100px] mt-1"
                                    value={offerData.message}
                                    onChange={(e) => setOfferData((prev) => ({ ...prev, message: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="additional-terms">Términos adicionales (opcional)</Label>
                                  <Textarea
                                    id="additional-terms"
                                    placeholder="Condiciones especiales..."
                                    className="min-h-[60px] mt-1"
                                    value={offerData.additionalTerms}
                                    onChange={(e) =>
                                      setOfferData((prev) => ({ ...prev, additionalTerms: e.target.value }))
                                    }
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setShowMakeOfferModal(false)}>
                                  Cancelar
                                </Button>
                                <Button
                                  onClick={handleMakeOffer}
                                  disabled={isSubmittingOffer || !offerData.price.trim() || !offerData.message.trim()}
                                >
                                  {isSubmittingOffer ? "Enviando..." : "Enviar contraoferta"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="font-medium text-lg">Selecciona una conversación</h3>
                    <p className="text-muted-foreground">Elige un chat para ver los detalles del servicio</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {currentProviderForBooking && (
        <ServiceBookingModal
          provider={currentProviderForBooking}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  )
}
