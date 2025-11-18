"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Download, TrendingUp } from "lucide-react"
import { InteractiveChart } from "@/components/interactive-chart"

export default function WalletPage() {
  // Enhanced data for the interactive chart
  const chartData = [
    { month: "Enero", shortMonth: "ene", amount: 65000, services: 3, avgRating: 4.5 },
    { month: "Febrero", shortMonth: "feb", amount: 85000, services: 4, avgRating: 4.7 },
    { month: "Marzo", shortMonth: "mar", amount: 72000, services: 3, avgRating: 4.6 },
    { month: "Abril", shortMonth: "abr", amount: 95000, services: 5, avgRating: 4.8 },
    { month: "Mayo", shortMonth: "may", amount: 120000, services: 6, avgRating: 4.9 },
    { month: "Junio", shortMonth: "jun", amount: 105000, services: 5, avgRating: 4.7 },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6">Billetera</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Saldo disponible</CardDescription>
                <CardTitle className="text-3xl">$125.000 CLP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    <span className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +15,3% este mes
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    Retirar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Ingresos totales</CardDescription>
                <CardTitle className="text-3xl">$450.000 CLP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Desde enero 2025</div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Servicios completados</CardDescription>
                <CardTitle className="text-3xl">12</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Calificación promedio: 4.8/5</div>
                  <Button size="sm" variant="outline">
                    Ver detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="ingresos" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
              <TabsTrigger value="transacciones">Transacciones</TabsTrigger>
            </TabsList>
            <TabsContent value="ingresos">
              <Card>
                <CardHeader>
                  <CardTitle>Ingresos</CardTitle>
                  <CardDescription>Visualización de tus ingresos en el tiempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <InteractiveChart data={chartData} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="transacciones">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de transacciones</CardTitle>
                  <CardDescription>Registro de tus movimientos recientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex justify-between items-center border-b pb-3">
                        <div className="flex items-start gap-2">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <ArrowUpRight className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Servicio de limpieza</p>
                            <p className="text-sm text-muted-foreground">15 de mayo, 2025</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+$35.000 CLP</p>
                          <p className="text-sm text-muted-foreground">Completado</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
