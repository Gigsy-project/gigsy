"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/file-upload"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, CreditCard, Send, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Message = {
  id: number
  sender: "user" | "support"
  text: string
  timestamp: string
}

export default function HelpPage() {
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [date, setDate] = useState<Date>()
  const [submitted, setSubmitted] = useState(false)
  const [locationType, setLocationType] = useState<"presencial" | "online">("presencial")
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "support",
      text: "¡Hola! Soy el asistente de soporte de AidMarkt. ¿En qué puedo ayudarte hoy? Puedo asistirte con problemas de la plataforma o con otros usuarios.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const router = useRouter()

  useEffect(() => {
    router.push("/messages?tab=help")
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Add user message
      const newUserMessage: Message = {
        id: messages.length + 1,
        sender: "user",
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, newUserMessage])
      setMessageText("")

      // Simulate support response after a short delay
      setTimeout(() => {
        const supportMessage: Message = {
          id: messages.length + 2,
          sender: "support",
          text: "Gracias por tu mensaje. Un agente de soporte se pondrá en contacto contigo pronto. Mientras tanto, ¿hay algo más en lo que pueda ayudarte?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setMessages((prev) => [...prev, supportMessage])
      }, 1000)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-2xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Busca ayuda inmediata</h1>

          {!submitted ? (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between mb-8">
                <div className={cn("flex flex-col items-center", step >= 1 ? "text-primary" : "text-muted-foreground")}>
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center mb-2 border-2",
                      step >= 1 ? "border-primary bg-primary/10" : "border-muted",
                    )}
                  >
                    1
                  </div>
                  <span className="text-xs">Detalles</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className={cn("h-1 w-full", step >= 2 ? "bg-primary" : "bg-muted")} />
                </div>
                <div className={cn("flex flex-col items-center", step >= 2 ? "text-primary" : "text-muted-foreground")}>
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center mb-2 border-2",
                      step >= 2 ? "border-primary bg-primary/10" : "border-muted",
                    )}
                  >
                    2
                  </div>
                  <span className="text-xs">Solicitud</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input id="title" placeholder="Ej: Necesito ayuda para reparar una fuga de agua" />
                    </div>

                    <div className="space-y-2">
                      <Label>{t("form.when")}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Selecciona una fecha</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Lugar</Label>
                      <RadioGroup
                        value={locationType}
                        onValueChange={(value) => setLocationType(value as "presencial" | "online")}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="presencial" id="presencial" />
                          <Label htmlFor="presencial">Presencial</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="online" id="online" />
                          <Label htmlFor="online">Online</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {locationType === "presencial" && (
                      <div className="space-y-2">
                        <Label htmlFor="address">Dirección exacta</Label>
                        <Input id="address" placeholder="Calle, número, comuna, ciudad" />
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button type="button" onClick={() => setStep(2)}>
                        Continuar
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="description">{t("form.description")}</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe detalladamente lo que necesitas"
                        className="min-h-[150px]"
                      />
                    </div>

                    <FileUpload
                      label={t("form.uploadPhotos")}
                      multiple={true}
                      accept="image/*,video/*"
                      onChange={() => {}}
                    />

                    <div className="space-y-2">
                      <Label htmlFor="price">{t("form.price")}</Label>
                      <Input id="price" type="number" placeholder="$" />
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Atrás
                      </Button>
                      <Button type="submit">{t("form.submit")}</Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="mb-6 mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">{t("success.help")}</h2>
              <div className="mt-8 p-6 border rounded-lg bg-muted/30">
                <h3 className="text-lg font-medium mb-4">{t("payment.title")}</h3>
                <Button className="w-full flex items-center justify-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {t("payment.button")}
                </Button>
                <p className="mt-4 text-sm text-muted-foreground">
                  El pago se mantendrá en una billetera segura hasta que confirmes que el servicio ha sido completado
                  satisfactoriamente.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <div className="container py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Centro de Ayuda</h1>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Bienvenido al Centro de Ayuda</AlertTitle>
            <AlertDescription>
              Aquí puedes obtener asistencia con problemas relacionados con la plataforma o con otros usuarios. Nuestro
              equipo de soporte está disponible para ayudarte.
            </AlertDescription>
          </Alert>

          <div className="border rounded-lg overflow-hidden flex flex-col h-[calc(100vh-300px)] min-h-[500px]">
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">Soporte AidMarkt</h2>
                  <p className="text-xs text-muted-foreground">En línea</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                >
                  {message.sender === "support" && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe tu mensaje..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
