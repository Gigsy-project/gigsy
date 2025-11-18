"use client"

import { useLanguage } from "@/components/language-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

export default function ProfileTypePage() {
  const { t } = useLanguage()
  const router = useRouter()

  const handleSelectDemandante = () => router.push("/request-service")
  const handleSelectOferente = () => router.push("/earn")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold mb-2 text-center">{t("profile.type")}</h1>
          <p className="text-center text-muted-foreground mb-4">{t("profile.switchInfo")}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className="border-2 hover:border-primary cursor-pointer transition-all"
              onClick={handleSelectDemandante}
            >
              <CardHeader>
                <CardTitle>{t("profile.demandante")}</CardTitle>
                <CardDescription>Para personas que necesitan ayuda con tareas</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                    <span>Publica tus necesidades</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                    <span>Encuentra personas confiables</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                    <span>Pago seguro a través de la plataforma</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="border-2 hover:border-primary cursor-pointer transition-all"
              onClick={handleSelectOferente}
            >
              <CardHeader>
                <CardTitle>{t("profile.oferente")}</CardTitle>
                <CardDescription>Para personas que quieren generar ingresos ayudando</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                    <span>Ofrece tus servicios</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                    <span>Establece tu disponibilidad y tarifas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                    <span>Recibe pagos de forma segura</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
