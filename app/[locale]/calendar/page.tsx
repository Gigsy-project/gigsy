"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  DollarSign,
  MapPin,
  Calendar as CalendarIcon,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CalendarDayButton } from "@/components/ui/calendar";
import type { DayButtonProps } from "react-day-picker";

// Mock data
interface Appointment {
  id: number;
  title: string;
  date: Date;
  time: string;
  location: string;
  status: "confirmed" | "pending" | "completed";
  earnings: string;
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const appointments: Appointment[] = [
    // Past
    {
      id: 9,
      title: "Instalación de software",
      date: new Date(2025, 3, 15),
      time: "11:00 - 13:00",
      location: "Remoto",
      status: "completed",
      earnings: "$25.000 CLP",
    },
    // August
    {
      id: 11,
      title: "Consultoría de diseño",
      date: new Date(2025, 7, 3),
      time: "10:00 - 11:00",
      location: "Online",
      status: "confirmed",
      earnings: "$30.000 CLP",
    },
    {
      id: 12,
      title: "Revisión de proyecto",
      date: new Date(2025, 7, 3),
      time: "15:00 - 16:30",
      location: "Oficina del Cliente, Santiago",
      status: "confirmed",
      earnings: "$40.000 CLP",
    },
    // Upcoming (Nov/Dec)
    {
      id: 13,
      title: "Limpieza de oficina",
      date: new Date(2025, 10, 21),
      time: "09:00 - 12:00",
      location: "Providencia, Santiago",
      status: "confirmed",
      earnings: "$45.000 CLP",
    },
    {
      id: 14,
      title: "Catering para evento",
      date: new Date(2025, 10, 27),
      time: "18:00 - 22:00",
      location: "Las Condes, Santiago",
      status: "pending",
      earnings: "$150.000 CLP",
    },
    {
      id: 15,
      title: "Mantenimiento de jardín",
      date: new Date(2025, 11, 5),
      time: "10:00 - 14:00",
      location: "La Reina, Santiago",
      status: "confirmed",
      earnings: "$60.000 CLP",
    },
    {
      id: 16,
      title: "Fotografía de producto",
      date: new Date(2025, 11, 15),
      time: "13:00 - 17:00",
      location: "Estudio, Santiago",
      status: "pending",
      earnings: "$120.000 CLP",
    },
  ];

  const selectedDateAppointments = appointments.filter(
    (appointment) =>
      date &&
      appointment.date.getDate() === date.getDate() &&
      appointment.date.getMonth() === date.getMonth() &&
      appointment.date.getFullYear() === date.getFullYear()
  );

  const upcomingAppointments = appointments
    .filter((appointment) => appointment.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const isDayWithAppointment = (day: Date) => {
    return appointments.some(
      (appointment) =>
        appointment.date.getDate() === day.getDate() &&
        appointment.date.getMonth() === day.getMonth() &&
        appointment.date.getFullYear() === day.getFullYear()
    );
  };

  const CustomDayButton = (props: DayButtonProps) => {
    const hasAppointment = isDayWithAppointment(props.day.date);
    return (
      <div className="relative">
        <CalendarDayButton {...props} />
        {hasAppointment && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-blue-500" />
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50/50">
      <Header />
      <main className="flex-1 container mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Calendario</h1>
            <p className="text-gray-500 mt-1">Gestiona tus servicios y disponibilidad</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Sincronizar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Evento
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar: Calendar Picker & Upcoming */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-0 shadow-sm ring-1 ring-gray-200 overflow-hidden">
              <CardContent className="p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="w-full p-4"
                  classNames={{
                    day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white",
                    day_today: "bg-gray-100 text-gray-900 font-semibold",
                  }}
                  modifiers={{
                    hasAppointment: (date) => isDayWithAppointment(date),
                  }}
                  modifiersClassNames={{
                    hasAppointment: "has-appointment",
                  }}
                  components={{
                    DayButton: CustomDayButton,
                  }}
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Próximos Servicios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-2 h-12 w-12 min-w-[3rem]">
                      <span className="text-xs font-medium text-blue-600 uppercase">
                        {apt.date.toLocaleDateString("es-ES", { month: "short" }).slice(0, 3)}
                      </span>
                      <span className="text-lg font-bold text-blue-700">
                        {apt.date.getDate()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm leading-none">{apt.title}</p>
                      <p className="text-xs text-muted-foreground">{apt.time}</p>
                    </div>
                  </div>
                ))}
                {upcomingAppointments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No hay servicios próximos
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content: Agenda for Selected Date */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-blue-600 rounded-full" />
                <h2 className="text-xl font-semibold text-gray-900 capitalize">
                  {date ? date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }) : "Selecciona una fecha"}
                </h2>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                {selectedDateAppointments.length} Eventos
              </Badge>
            </div>

            <div className="space-y-4">
              {selectedDateAppointments.length > 0 ? (
                selectedDateAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <CalendarIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Sin eventos programados</h3>
                  <p className="text-sm text-gray-500 max-w-xs mt-1">
                    No tienes servicios agendados para este día. ¡Disfruta tu tiempo libre o busca nuevas oportunidades!
                  </p>
                  <Button variant="outline" className="mt-6">
                    Explorar Servicios
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const statusConfig = {
    confirmed: { label: "Confirmado", color: "bg-green-100 text-green-700 border-green-200" },
    pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    completed: { label: "Completado", color: "bg-gray-100 text-gray-700 border-gray-200" },
  };

  const config = statusConfig[appointment.status];

  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      <div className="flex flex-col sm:flex-row">
        {/* Left colored strip - visible on mobile */}
        <div className={`h-2 sm:h-auto sm:w-1.5 ${appointment.status === 'confirmed' ? 'bg-green-500' : appointment.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
        
        <CardContent className="flex-1 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex items-start justify-between sm:justify-start gap-3">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {appointment.title}
                </h3>
                <Badge variant="outline" className={cn("capitalize sm:hidden", config.color)}>
                  {config.label}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="truncate">{appointment.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start gap-4 pl-0 sm:pl-4 sm:border-l sm:border-gray-100">
              <Badge variant="outline" className={cn("capitalize hidden sm:inline-flex", config.color)}>
                {config.label}
              </Badge>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-0.5">Ganancia estimada</p>
                <p className="font-bold text-green-600 text-lg">{appointment.earnings}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
             <Button variant="ghost" size="sm" className="text-gray-500 h-8 hover:bg-transparent hover:underline">Detalles</Button>
             <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 h-8 shadow-sm border-transparent">Gestionar</Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
