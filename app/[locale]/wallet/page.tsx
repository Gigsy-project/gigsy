"use client"

import { Header } from "@/components/header"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  DollarSign,
  Briefcase,
  Star,
  Plus,
  Clock,
} from "lucide-react"
import { InteractiveChart } from "@/components/interactive-chart"
import { Separator } from "@/components/ui/separator"

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

  // Mock data for transactions
  const transactions = [
    {
      id: 1,
      type: "income",
      title: "Servicio de limpieza",
      date: "15 de mayo, 2025",
      amount: "+$35.000 CLP",
      status: "Completado",
    },
    {
      id: 2,
      type: "withdrawal",
      title: "Retiro a cuenta bancaria",
      date: "12 de mayo, 2025",
      amount: "-$50.000 CLP",
      status: "Procesado",
    },
    {
      id: 3,
      type: "income",
      title: "Reparación de mueble",
      date: "10 de mayo, 2025",
      amount: "+$28.000 CLP",
      status: "Completado",
    },
    {
      id: 4,
      type: "income",
      title: "Jardinería",
      date: "5 de mayo, 2025",
      amount: "+$40.000 CLP",
      status: "Completado",
    },
    {
      id: 5,
      type: "pending",
      title: "Servicio de mudanza",
      date: "20 de mayo, 2025",
      amount: "+$75.000 CLP",
      status: "Pendiente",
    },
  ]

  const totalIncome = chartData.reduce((acc, item) => acc + item.amount, 0)
  const totalServices = chartData.reduce((acc, item) => acc + item.services, 0)
  const avgRating = (
    chartData.reduce((acc, item) => acc + item.avgRating, 0) / chartData.length
  ).toFixed(1)

  const StatCard = ({
    icon: Icon,
    title,
    value,
    description,
  }: {
    icon: React.ElementType
    title: string
    value: string
    description?: string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )

  const TransactionItem = ({ transaction }: { transaction: any }) => {
    const iconMap = {
      income: <ArrowUpRight className="h-5 w-5 text-green-500" />,
      withdrawal: <ArrowDownLeft className="h-5 w-5 text-red-500" />,
      pending: <Clock className="h-5 w-5 text-yellow-500" />,
    }
    const colorMap = {
      income: "text-green-500",
      withdrawal: "text-red-500",
      pending: "text-yellow-500",
    }
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center bg-muted`}
          >
            {iconMap[transaction.type as keyof typeof iconMap]}
          </div>
          <div>
            <p className="font-medium">{transaction.title}</p>
            <p className="text-sm text-muted-foreground">{transaction.date}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${colorMap[transaction.type as keyof typeof colorMap]}`}>
            {transaction.amount}
          </p>
          <p className="text-sm text-muted-foreground">{transaction.status}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-8">
        <div className="mx-auto grid max-w-7xl gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Billetera</h1>
              <Breadcrumb className="hidden md:flex mt-2">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <a href="/es/dashboard">Dashboard</a>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Billetera</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar Reporte
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Ingresos</CardTitle>
                  <CardDescription>
                    Visualización de tus ingresos en los últimos 6 meses.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <InteractiveChart data={chartData} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Transacciones Recientes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {transactions.map((tx) => (
                    <TransactionItem key={tx.id} transaction={tx} />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardDescription>Saldo disponible</CardDescription>
                  <CardTitle className="text-4xl font-bold">$125.000</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Button>Retirar</Button>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir fondos
                  </Button>
                </CardContent>
              </Card>
              <div className="space-y-6">
                <StatCard
                  icon={DollarSign}
                  title="Ingresos Totales (6 meses)"
                  value={`$${totalIncome.toLocaleString("es-CL")}`}
                  description="Suma de todos los ingresos."
                />
                <StatCard
                  icon={Briefcase}
                  title="Servicios Completados"
                  value={totalServices.toString()}
                  description="Total de trabajos finalizados."
                />
                <StatCard
                  icon={Star}
                  title="Calificación Promedio"
                  value={avgRating}
                  description="Sobre 5 estrellas."
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
