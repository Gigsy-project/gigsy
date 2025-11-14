"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Briefcase, MapPin, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "./language-provider"

interface QuickTask {
  id: number
  title: string
  budget: number
  location: string
  time: string
  urgent?: boolean
}

const quickTasks: QuickTask[] = [
  {
    id: 1,
    title: "Mudanza de apartamento",
    budget: 25000,
    location: "Las Condes",
    time: "Hoy",
    urgent: true,
  },
  {
    id: 2,
    title: "Limpieza profunda",
    budget: 15000,
    location: "Providencia",
    time: "Mañana",
  },
  {
    id: 3,
    title: "Delivery urgente",
    budget: 3000,
    location: "Santiago Centro",
    time: "2 horas",
    urgent: true,
  },
]

export function ServiceBanner() {
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container">
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="font-medium">Servicios disponibles</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {quickTasks.filter((task) => task.urgent).length} URGENTES
                </Badge>
              </div>

              {!isExpanded && (
                <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Mudanzas desde $15.000</span>
                  <span>•</span>
                  <span>Limpieza desde $8.000</span>
                  <span>•</span>
                  <span>Delivery desde $2.000</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="default" size="sm">
                <Link href="/browse-services">Ver todos los servicios</Link>
              </Button>

              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="p-2">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-2 flex-1">{task.title}</h4>
                      {task.urgent && (
                        <Badge variant="destructive" className="text-xs ml-2">
                          URGENTE
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-medium text-foreground">{formatCurrency(task.budget)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{task.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{task.time}</span>
                      </div>
                    </div>

                    <Button size="sm" className="w-full mt-3" variant="outline">
                      Ver detalles
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
