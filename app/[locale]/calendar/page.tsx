"use client";

import { Header } from "@/components/header";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  DollarSign,
  MapPin,
  Calendar as CalendarIcon,
  MoreVertical,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock data for appointments
  const appointments = [
    // Past appointment for demonstration
    {
      id: 9,
      title: "Instalación de software",
      date: new Date(2025, 3, 15), // April 15, 2025 (past)
      time: "11:00 - 13:00",
      location: "Remoto",
      status: "completed",
      earnings: "$25.000 CLP",
    },
    // Appointments for August 3rd, 2025
    {
      id: 11,
      title: "Consultoría de diseño",
      date: new Date(2025, 7, 3), // August 3, 2025
      time: "10:00 - 11:00",
      location: "Online",
      status: "confirmed",
      earnings: "$30.000 CLP",
    },
    {
      id: 12,
      title: "Revisión de proyecto",
      date: new Date(2025, 7, 3), // August 3, 2025
      time: "15:00 - 16:30",
      location: "Oficina del Cliente, Santiago",
      status: "confirmed",
      earnings: "$40.000 CLP",
    },
    // Upcoming appointments from today (November 20, 2025) onwards
    {
      id: 13,
      title: "Limpieza de oficina",
      date: new Date(2025, 10, 21), // November 21, 2025
      time: "09:00 - 12:00",
      location: "Providencia, Santiago",
      status: "confirmed",
      earnings: "$45.000 CLP",
    },
    {
      id: 14,
      title: "Catering para evento",
      date: new Date(2025, 10, 27), // November 27, 2025
      time: "18:00 - 22:00",
      location: "Las Condes, Santiago",
      status: "pending",
      earnings: "$150.000 CLP",
    },
    {
      id: 15,
      title: "Mantenimiento de jardín",
      date: new Date(2025, 11, 5), // December 5, 2025
      time: "10:00 - 14:00",
      location: "La Reina, Santiago",
      status: "confirmed",
      earnings: "$60.000 CLP",
    },
    {
      id: 16,
      title: "Fotografía de producto",
      date: new Date(2025, 11, 15), // December 15, 2025
      time: "13:00 - 17:00",
      location: "Estudio, Santiago",
      status: "pending",
      earnings: "$120.000 CLP",
    },
    // Keeping some of the old data for variety
    {
      id: 1,
      title: "Limpieza de casa",
      date: new Date(2025, 4, 20), // May 20, 2025
      time: "10:00 - 12:00",
      location: "Providencia, Santiago",
      status: "completed",
      earnings: "$35.000 CLP",
    },
    {
      id: 6,
      title: "Jardinería",
      date: new Date(2025, 5, 5), // June 5, 2025
      time: "09:00 - 13:00",
      location: "Lo Barnechea, Santiago",
      status: "completed",
      earnings: "$40.000 CLP",
    },
  ];

  // Filter appointments for the selected date
  const selectedDateAppointments = appointments.filter(
    (appointment) =>
      date &&
      appointment.date.getDate() === date.getDate() &&
      appointment.date.getMonth() === date.getMonth() &&
      appointment.date.getFullYear() === date.getFullYear(),
  );

  // Upcoming appointments (from today onwards)
  const upcomingAppointments = appointments
    .filter((appointment) => appointment.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Function to highlight dates with appointments
  const isDayWithAppointment = (day: Date) => {
    return appointments.some(
      (appointment) =>
        appointment.date.getDate() === day.getDate() &&
        appointment.date.getMonth() === day.getMonth() &&
        appointment.date.getFullYear() === day.getFullYear(),
    );
  };

  const AppointmentCard = ({
    appointment,
    showDate = false,
  }: {
    appointment: any;
    showDate?: boolean;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">
          {appointment.title}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
            <DropdownMenuItem>Reprogramar</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Cancelar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {showDate && (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>
              {appointment.date.toLocaleDateString("es-ES", {
                dateStyle: "long",
              })}
            </span>
          </div>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>{appointment.time}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{appointment.location}</span>
        </div>
        <Separator className="my-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center text-green-600">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="font-semibold">{appointment.earnings}</span>
          </div>
          <Badge
            variant={appointment.status === "confirmed" ? "default" : "outline"}
            className={
              appointment.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : ""
            }
          >
            {appointment.status === "confirmed" ? "Confirmado" : "Pendiente"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Calendario</h1>
              <Breadcrumb className="hidden md:flex mt-1">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <a href="/es/dashboard">Dashboard</a>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Calendario</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg border"
          >
            <ResizablePanel defaultSize={60}>
              <div className="flex h-full flex-col p-6">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="w-full"
                  modifiers={{
                    withAppointment: (date) => isDayWithAppointment(date),
                  }}
                  modifiersClassNames={{
                    withAppointment: "relative",
                  }}
                  components={{
                    DayButton: (props) => {
                      const hasAppointment = isDayWithAppointment(
                        props.day.date,
                      );
                      return (
                        <Button
                          {...props}
                          variant="ghost"
                          size="icon"
                          className={`${props.className} relative`}
                        >
                          {props.day.date.getDate()}
                          {hasAppointment && (
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </Button>
                      );
                    },
                  }}
                />
                <Separator className="my-6" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-4">
                    Próximos servicios
                  </h2>
                  <div className="space-y-4">
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments
                        .slice(0, 3)
                        .map((appointment) => (
                          <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            showDate
                          />
                        ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No tienes servicios programados.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40}>
              <div className="flex h-full flex-col p-6">
                <h2 className="text-lg font-semibold mb-4">
                  {date
                    ? date.toLocaleDateString("es-ES", { dateStyle: "long" })
                    : "Selecciona una fecha"}
                </h2>
                {selectedDateAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      No hay nada programado para esta fecha.
                    </p>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </main>
    </div>
  );
}
