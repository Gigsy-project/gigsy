"use client"

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
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, MapPin } from "lucide-react"

export default function CalendarPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      title: "Limpieza de casa",
      date: new Date(2025, 4, 20), // May 20, 2025
      time: "10:00 - 12:00",
      location: "Providencia, Santiago",
      status: "confirmed",
      earnings: "$35.000 CLP",
    },
    {
      id: 2,
      title: "Mudanza",
      date: new Date(2025, 4, 24), // May 24, 2025
      time: "14:00 - 18:00",
      location: "Las Condes, Santiago",
      status: "pending",
      earnings: "$45.000 CLP",
    },
    {
      id: 3,
      title: "Reparación de mueble",
      date: new Date(2025, 4, 28), // May 28, 2025
      time: "09:00 - 11:00",
      location: "Ñuñoa, Santiago",
      status: "confirmed",
      earnings: "$28.000 CLP",
    },
  ]

  // Filter appointments for the selected date
  const selectedDateAppointments = appointments.filter(
    (appointment) =>
      date &&
      appointment.date.getDate() === date.getDate() &&
      appointment.date.getMonth() === date.getMonth() &&
      appointment.date.getFullYear() === date.getFullYear(),
  )

  // Function to highlight dates with appointments
  const isDayWithAppointment = (day: Date) => {
    return appointments.some(
      (appointment) =>
        appointment.date.getDate() === day.getDate() &&
        appointment.date.getMonth() === day.getMonth() &&
        appointment.date.getFullYear() === day.getFullYear(),
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto">
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
                <BreadcrumbPage>Calendario</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold mb-6">Calendario</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Mayo 2025</CardTitle>
                <CardDescription>Selecciona una fecha para ver los servicios</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="w-full rounded-md border"
                  modifiers={{
                    withAppointment: (date) => isDayWithAppointment(date),
                  }}
                  modifiersClassNames={{
                    withAppointment: "bg-primary/10 font-bold text-primary",
                  }}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {date ? date.toLocaleDateString("es-ES", { dateStyle: "full" }) : "Selecciona una fecha"}
                </CardTitle>
                <CardDescription>
                  {selectedDateAppointments.length
                    ? `${selectedDateAppointments.length} servicios programados`
                    : "No hay servicios programados para esta fecha"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedDateAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{appointment.title}</h3>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">{appointment.time}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{appointment.location}</span>
                          </div>
                          <div className="flex items-center text-green-600 mt-1">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">{appointment.earnings}</span>
                          </div>
                        </div>
                        <Badge
                          variant={appointment.status === "confirmed" ? "default" : "outline"}
                          className={appointment.status === "confirmed" ? "bg-green-500" : ""}
                        >
                          {appointment.status === "confirmed" ? "Confirmado" : "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Próximos servicios</CardTitle>
              <CardDescription>Todos tus servicios programados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{appointment.title}</h3>
                          <p className="text-muted-foreground">
                            {appointment.date.toLocaleDateString("es-ES", { dateStyle: "long" })}
                          </p>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">{appointment.time}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{appointment.location}</span>
                          </div>
                          <div className="flex items-center text-green-600 mt-1">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">{appointment.earnings}</span>
                          </div>
                        </div>
                        <Badge
                          variant={appointment.status === "confirmed" ? "default" : "outline"}
                          className={appointment.status === "confirmed" ? "bg-green-500" : ""}
                        >
                          {appointment.status === "confirmed" ? "Confirmado" : "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
