"use client"
import { useState, useMemo, useCallback } from "react" // Added useMemo and useCallback
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
import { Send, Search, ChevronRight, MessageCircle, Mail, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { helpCategoriesData, faqsData } from "./data" // Import data
import type { Message as HelpMessage } from "@/lib/types" // Use Message from lib/types

export default function HelpCenterPage() {
  const router = useRouter()
  const [helpMessageText, setHelpMessageText] = useState("")
  const [helpView, setHelpView] = useState<"main" | "category" | "article" | "chat" | "contact">("main")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null) // Renamed for clarity
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null) // Renamed for clarity
  const [searchQuery, setSearchQuery] = useState("")

  const [helpMessages, setHelpMessages] = useState<HelpMessage[]>([
    {
      id: 1,
      sender: "support",
      text: "¡Hola! Soy el asistente de soporte de AidMarkt. Estamos disponibles 24/7 para ayudarte con cualquier problema relacionado con la plataforma o con otros usuarios. ¿En qué podemos ayudarte hoy?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return []

    const lowerCaseQuery = searchQuery.toLowerCase()
    const allArticlesWithCategory = helpCategoriesData.flatMap((category) =>
      category.articles.map((article) => ({ ...article, categoryTitle: category.title })),
    )

    return allArticlesWithCategory.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerCaseQuery) ||
        article.content.toLowerCase().includes(lowerCaseQuery) ||
        article.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery)),
    )
  }, [searchQuery])

  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return faqsData // Return all FAQs if no search query

    const lowerCaseQuery = searchQuery.toLowerCase()
    return faqsData.filter(
      (faq) => faq.question.toLowerCase().includes(lowerCaseQuery) || faq.answer.toLowerCase().includes(lowerCaseQuery),
    )
  }, [searchQuery])

  const handleStartLiveChat = useCallback(() => {
    // Consider using Next.js router for internal navigation if possible,
    // but window.location.href is kept as per "not altering functionalities"
    window.location.href = "/messages?newChat=customerService"
  }, [])

  const handleSendHelpMessage = useCallback(() => {
    if (helpMessageText.trim()) {
      const newUserMessage: HelpMessage = {
        id: Date.now(), // Use timestamp for potentially more unique ID
        sender: "user",
        text: helpMessageText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setHelpMessages((prev) => [...prev, newUserMessage])
      setHelpMessageText("")

      setTimeout(() => {
        const supportMessage: HelpMessage = {
          id: Date.now() + 1, // Ensure unique ID
          sender: "support",
          text: "Gracias por tu mensaje. Un agente de soporte está revisando tu consulta y te responderá a la brevedad. Nuestro tiempo de respuesta promedio es de 5 minutos.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setHelpMessages((prev) => [...prev, supportMessage])
      }, 1000)
    }
  }, [helpMessageText])

  const currentCategory = useMemo(
    () => helpCategoriesData.find((c) => c.id === selectedCategoryId),
    [selectedCategoryId],
  )

  const currentArticle = useMemo(() => {
    if (!selectedArticleId) return null
    return helpCategoriesData.flatMap((cat) => cat.articles).find((a) => a.id === selectedArticleId)
  }, [selectedArticleId])

  const renderHelpContent = () => {
    switch (helpView) {
      case "main":
        return (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar en el centro de ayuda..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar en el centro de ayuda"
              />
            </div>

            {searchQuery.trim() && (
              <div className="space-y-4">
                <h3 className="font-semibold">Resultados de búsqueda</h3>
                {filteredArticles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Artículos</h4>
                    <div className="space-y-2">
                      {filteredArticles.map((article) => (
                        <Card
                          key={article.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            setSelectedArticleId(article.id)
                            // Find the category of the article to set selectedCategoryId for back navigation
                            const parentCategory = helpCategoriesData.find((cat) =>
                              cat.articles.some((art) => art.id === article.id),
                            )
                            if (parentCategory) setSelectedCategoryId(parentCategory.id)
                            setHelpView("article")
                          }}
                        >
                          <CardContent className="p-4">
                            <h5 className="font-medium">{article.title}</h5>
                            <p className="text-sm text-muted-foreground">{article.categoryTitle}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {filteredFAQs.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Preguntas frecuentes</h4>
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFAQs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                          <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}
                {filteredArticles.length === 0 && filteredFAQs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No se encontraron resultados para "{searchQuery}"</p>
                    <Button variant="outline" className="mt-4" onClick={() => setHelpView("chat")}>
                      Contactar soporte
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!searchQuery.trim() && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {helpCategoriesData.map((category) => (
                    <Card
                      key={category.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setSelectedCategoryId(category.id)
                        setHelpView("category")
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">{category.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{category.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                            <p className="text-xs text-muted-foreground">{category.articles.length} artículos</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={handleStartLiveChat}
                  >
                    <MessageCircle className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Chat en vivo</div>
                      <div className="text-xs text-muted-foreground">Respuesta inmediata</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setHelpView("contact")}
                  >
                    <Mail className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Email</div>
                      <div className="text-xs text-muted-foreground">soporte@aidmarkt.com</div>
                    </div>
                  </Button>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Preguntas frecuentes</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {faqsData.slice(0, 3).map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {/* TODO: Implement "Ver todas las preguntas frecuentes" functionality or remove button */}
                  {/* <Button variant="ghost" className="w-full mt-2">
                    Ver todas las preguntas frecuentes
                  </Button> */}
                </div>
              </>
            )}
          </div>
        )

      case "category":
        if (!currentCategory) return null
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setHelpView("main")}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver
              </Button>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">{currentCategory.icon}</div>
              <div>
                <h2 className="text-2xl font-bold">{currentCategory.title}</h2>
                <p className="text-muted-foreground">{currentCategory.description}</p>
              </div>
            </div>
            <div className="space-y-4">
              {currentCategory.articles.map((article) => (
                <Card
                  key={article.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setSelectedArticleId(article.id)
                    setHelpView("article")
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{article.content.substring(0, 100)}...</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{article.views} vistas</span>
                          <span>{article.helpful} útiles</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "article":
        if (!currentArticle) return null
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setHelpView("category")
                  // selectedCategoryId should already be set if navigating from category view or search
                  // If not, might need to find its category again if direct link to article is possible
                  if (!selectedCategoryId) {
                    const parentCategory = helpCategoriesData.find((cat) =>
                      cat.articles.some((art) => art.id === currentArticle.id),
                    )
                    if (parentCategory) setSelectedCategoryId(parentCategory.id)
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver
              </Button>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">{currentArticle.title}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span>{currentArticle.views} vistas</span>
                <span>{currentArticle.helpful} personas encontraron esto útil</span>
              </div>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-sm leading-relaxed">{currentArticle.content}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentArticle.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">¿Te resultó útil este artículo?</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  👍 Sí
                </Button>
                <Button variant="outline" size="sm">
                  👎 No
                </Button>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">¿Necesitas más ayuda?</p>
              <Button variant="outline" size="sm" onClick={() => setHelpView("chat")}>
                Contactar soporte
              </Button>
            </div>
          </div>
        )

      case "contact":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setHelpView("main")}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver
              </Button>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Contactar soporte</h2>
              <p className="text-muted-foreground">Elige la forma que prefieras para contactarnos</p>
            </div>
            <div className="grid gap-4">
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleStartLiveChat}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Chat en vivo</h3>
                      <p className="text-sm text-muted-foreground">Respuesta inmediata • Disponible 24/7</p>
                    </div>
                    <Badge className="bg-green-500">En línea</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-sm text-muted-foreground">soporte@aidmarkt.com</p>
                      <p className="text-xs text-muted-foreground">Respuesta en 24 horas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "chat":
        return (
          <div className="flex flex-col min-h-[600px]">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setHelpView("main")}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver
              </Button>
            </div>
            <div className="p-4 border-b bg-muted/30 rounded-t-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/images/logo.png" alt="AidMarkt Support" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">Soporte AidMarkt</h2>
                  <p className="text-xs text-green-600 flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-600 mr-1"></span>
                    En línea
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 border border-x-0 border-t-0">
              {helpMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                >
                  {message.sender === "support" && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 shrink-0">
                      {" "}
                      {/* Added shrink-0 */}
                      <AvatarImage src="/images/logo.png" alt="AidMarkt Support" />
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
            <div className="p-4 border-t border-x border-b rounded-b-lg">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendHelpMessage()
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Escribe tu mensaje..."
                  value={helpMessageText}
                  onChange={(e) => setHelpMessageText(e.target.value)}
                />
                <Button type="submit" size="icon" aria-label="Enviar mensaje">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-6">
          <div className="max-w-4xl mx-auto">
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
                  <BreadcrumbPage>Centro de Ayuda</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Centro de Ayuda</h1>
              <p className="text-muted-foreground">
                Encuentra respuestas a tus preguntas o contacta con nuestro equipo de soporte
              </p>
            </div>
            <div className="py-6">{renderHelpContent()}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
