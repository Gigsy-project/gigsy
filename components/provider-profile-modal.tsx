"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Briefcase,
  Globe,
  Shield,
  Calendar,
  MessageCircle,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ServiceBookingModal } from "./service-booking-modal";
import type { Provider } from "@/lib/types"; // Import the shared Provider type

interface ProviderProfileModalProps {
  provider: Provider; // Use the shared Provider type
  isOpen: boolean;
  onClose: () => void;
  onRemoveFavorite: (id: number) => void;
}

export function ProviderProfileModal({
  provider,
  isOpen,
  onClose,
  onRemoveFavorite,
}: ProviderProfileModalProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isContacting, setIsContacting] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const router = useRouter();

  const handleRemoveFavorite = () => {
    setIsRemoving(true);
    onRemoveFavorite(provider.id);
    setTimeout(() => {
      setIsRemoving(false);
      onClose();
    }, 500);
  };

  const handleContact = async () => {
    setIsContacting(true);

    try {
      // Simulate creating/finding conversation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close modal first
      onClose();

      // Navigate to messages with the specific provider
      router.push(
        `/messages?contact=${encodeURIComponent(provider.name)}&providerId=${provider.id}`,
      );
    } catch (error) {
      console.error("Error starting conversation:", error);
    } finally {
      setIsContacting(false);
    }
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    onClose();
    // Navigate to calendar or show success message
    router.push("/calendar");
  };

  const stats = [
    {
      number: provider.services.length,
      label: "Servicios",
    },
    {
      number: provider.reviews,
      label: "Reseñas",
    },
    {
      number: provider.joinDate
        ? new Date().getFullYear() - new Date(provider.joinDate).getFullYear()
        : 2,
      label: "Años en AidMarkt",
    },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <DialogTitle className="text-2xl font-bold">
              Información sobre mí
            </DialogTitle>
            <Button variant="outline" size="sm">
              Editar
            </Button>
          </DialogHeader>

          {/* Profile Section */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={provider.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {provider.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {provider.verified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            <h3 className="text-3xl font-bold mb-2">{provider.name}</h3>
            <p className="text-muted-foreground text-lg">{provider.location}</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Information Sections */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-4 p-4 rounded-lg border">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
              <div>
                <span className="font-medium">A qué me dedico: </span>
                <span>
                  {provider.description || "Servicios profesionales de calidad"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg border">
              <Globe className="h-6 w-6 text-muted-foreground" />
              <div>
                <span className="font-medium">Habla </span>
                <span>{provider.languages?.join(", ") || "español"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg border">
              <MapPin className="h-6 w-6 text-muted-foreground" />
              <div>
                <span className="font-medium">Vive en </span>
                <span>{provider.location}</span>
              </div>
            </div>

            {provider.verified && (
              <div className="flex items-center gap-4 p-4 rounded-lg border">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <span className="font-medium underline text-green-600">
                    Identidad verificada
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Services Section */}
          <div className="mb-8">
            <h4 className="font-semibold mb-3">Servicios que ofrece:</h4>
            <div className="flex flex-wrap gap-2">
              {provider.services.map((service, index) => (
                <Badge key={index} variant="secondary">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{provider.rating}</span>
              <span className="text-muted-foreground">
                ({provider.reviews} reseñas)
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Último servicio: {provider.lastService} -{" "}
              {provider.lastServiceDate}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              className="flex-1"
              onClick={handleContact}
              disabled={isContacting}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {isContacting ? "Iniciando chat..." : "Contactar"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowBookingModal(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Reservar servicio
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleRemoveFavorite}
              disabled={isRemoving}
            >
              <Heart
                className={`h-5 w-5 ${isRemoving ? "animate-pulse" : "fill-current"}`}
              />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Booking Modal */}
      <ServiceBookingModal
        provider={provider}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSuccess={handleBookingSuccess}
      />
    </>
  );
}
