"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Map as MapLibreMap,
  Marker,
  Popup,
  NavigationControl,
  GeolocateControl,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { ServiceTask } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import type { MapRef } from "react-map-gl/maplibre";

interface ServiceLocation {
  lat: number;
  lng: number;
}

interface ServiceTaskWithLocation extends ServiceTask {
  coordinates: ServiceLocation;
}

/**
 * Interactive Map Component with GSAP-powered Service Details Panel
 *
 * Usage example:
 *
 * const [selectedService, setSelectedService] = useState<ServiceTaskWithLocation | null>(null);
 *
 * const handleSelectService = (service: ServiceTaskWithLocation | null) => {
 *   setSelectedService(service);
 * };
 *
 * <InteractiveMap
 *   services={services}
 *   userLocation={userLocation}
 *   selectedService={selectedService}
 *   onSelectService={handleSelectService}
 *   flyToServiceTrigger={flyToServiceTrigger}
 * />
 *
 * Features:
 * - Service markers with hover popups
 * - User location detection and display
 * - Service selection for full-screen overlay (handled by parent)
 * - Built-in geolocation controls
 */

interface InteractiveMapProps {
  services: ServiceTaskWithLocation[];
  userLocation: ServiceLocation;
  onSelectService: (service: ServiceTaskWithLocation | null) => void;
  selectedService: ServiceTaskWithLocation | null;
  flyToServiceTrigger?: number; // Timestamp trigger to force flyTo
}

const InteractiveMap = ({
  services,
  userLocation,
  onSelectService,
  selectedService,
  flyToServiceTrigger,
}: InteractiveMapProps) => {
  const mapRef = useRef<MapRef>(null);
  const hasInitiallyZoomedToUserRef = useRef(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [popupInfo, setPopupInfo] = useState<{
    service: ServiceTaskWithLocation;
    longitude: number;
    latitude: number;
  } | null>(null);
  const [detectedLocation, setDetectedLocation] =
    useState<ServiceLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isFetchingFallback, setIsFetchingFallback] = useState(false);

  // Fallback usando IP geolocation sin Google APIs
  const handleIPGeolocationFallback = useCallback(async () => {
    setIsFetchingFallback(true);

    try {
      // Usar ipapi.co que no requiere API key para uso básico
      const response = await fetch("https://ipapi.co/json/", {
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.latitude && data.longitude) {
          const newLocation = {
            lat: data.latitude,
            lng: data.longitude,
          };
          setDetectedLocation(newLocation);
          setLocationError(null);

          // Zoom and pan to user location from IP geolocation ONLY on first detection
          if (mapRef.current && !hasInitiallyZoomedToUserRef.current) {
            mapRef.current.flyTo({
              center: [data.longitude, data.latitude],
              zoom: 15, // Slightly less zoom for IP-based location (less accurate)
              duration: 1000,
            });
            hasInitiallyZoomedToUserRef.current = true;
          }
        } else {
          setLocationError("No se pudo determinar ubicación aproximada");
        }
      } else {
        setLocationError("Servicio de ubicación no disponible");
      }
    } catch (error) {
      console.error("Error con fallback de geolocalización:", error);
      setLocationError("Error al obtener ubicación aproximada");
    } finally {
      setIsFetchingFallback(false);
    }
  }, []);

  // Get user location with navigator.geolocation
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocalización no soportada por el navegador");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setDetectedLocation(newLocation);
        setIsLocating(false);
        setLocationError(null);

        console.log(newLocation);
        // Zoom and pan to user location ONLY on first detection
        if (mapRef.current && !hasInitiallyZoomedToUserRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            duration: 1000,
          });
          hasInitiallyZoomedToUserRef.current = true;
        }
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        setIsLocating(false);

        let errorMessage = "No se pudo obtener tu ubicación";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permiso de ubicación denegado";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Información de ubicación no disponible";
            break;
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado";
            break;
          default:
            errorMessage = "Error desconocido al obtener ubicación";
            break;
        }

        setLocationError(errorMessage);

        // Fallback usando IP geolocation (sin Google APIs)
        handleIPGeolocationFallback();
      },
      {
        enableHighAccuracy: true, // Importante: evita servicios de Google
        timeout: 8000, // 8 segundos timeout
        maximumAge: 600000, // Cache por 10 minutos
      },
    );
  }, [handleIPGeolocationFallback]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // Cleanup popup timeout on unmount
  useEffect(() => {
    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
    };
  }, []);

  // Retry handler
  const handleRetry = useCallback(() => {
    getUserLocation();
  }, [getUserLocation]);

  // Use detected location if available, otherwise use provided userLocation
  const currentUserLocation = detectedLocation || userLocation;

  // Initial view state
  const initialViewState = useMemo(
    () => ({
      longitude: currentUserLocation.lng,
      latitude: currentUserLocation.lat,
      zoom: 12,
    }),
    [currentUserLocation],
  );

  // Fit bounds to show all markers only on initial mount (not when coming back from details view)
  const hasFitBoundsRef = useRef(false);

  useEffect(() => {
    // Don't run fitBounds if there's a selected service (user is returning from details view)
    if (
      !mapRef.current ||
      services.length === 0 ||
      hasFitBoundsRef.current ||
      selectedService
    )
      return;

    const bounds = new maplibregl.LngLatBounds();
    bounds.extend([currentUserLocation.lng, currentUserLocation.lat]);
    services.forEach((service) => {
      bounds.extend([service.coordinates.lng, service.coordinates.lat]);
    });

    setTimeout(() => {
      mapRef.current?.fitBounds(bounds, { padding: 50 });
      hasFitBoundsRef.current = true;
    }, 100);
  }, [
    services,
    currentUserLocation.lng,
    currentUserLocation.lat,
    selectedService,
  ]);

  // IMPORTANT: We do NOT automatically center the map on a service when it's selected
  // This prevents unwanted map movement when users are just browsing services
  // The map will ONLY move to a service location when:
  // 1. The flyToServiceTrigger changes (external trigger)
  // 2. The initial fitBounds on component mount
  // This provides better UX by keeping the map stable during service browsing

  // Clean up any effects that were related to the removed panel
  useEffect(() => {
    // No panel-specific logic needed anymore
  }, [selectedService]);

  // Force flyTo when trigger changes (external trigger)
  useEffect(() => {
    if (mapRef.current && selectedService && flyToServiceTrigger) {
      // Immediate flyTo without delay
      mapRef.current.flyTo({
        center: [
          selectedService.coordinates.lng,
          selectedService.coordinates.lat,
        ],
        zoom: 16,
        duration: 800,
        essential: true,
      });
    }
  }, [flyToServiceTrigger, selectedService]);

  // Airtasker-style map: Clean, minimalist design with soft colors
  // Similar to Airtasker's map design - light, modern, with clear streets and labels
  const mapStyle = useMemo(() => {
    return "https://tiles.openfreemap.org/styles/positron";
  }, []);

  return (
    <div className="h-full w-full relative z-0">
      <MapLibreMap
        ref={mapRef}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
      >
        {/* User location marker */}
        {!isLocating && (
          <Marker
            longitude={currentUserLocation.lng}
            latitude={currentUserLocation.lat}
            anchor="center"
          >
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          </Marker>
        )}

        {/* Loading indicator while detecting location */}
        {(isLocating || isFetchingFallback) && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-700">
              {isFetchingFallback
                ? "Determinando ubicación aproximada..."
                : "Detectando tu ubicación..."}
            </span>
          </div>
        )}

        {/* Error message with retry button */}
        {locationError && !isLocating && !isFetchingFallback && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-3">
            <span className="text-sm text-gray-600">{locationError}</span>
            <button
              onClick={handleRetry}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium underline"
              type="button"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Service markers */}
        {services.map((service) => {
          const { coordinates, id, category, urgent } = service;
          const isSelected = selectedService?.id === id;

          return (
            <Marker
              key={id}
              longitude={coordinates.lng}
              latitude={coordinates.lat}
              anchor="center"
            >
              <div className="relative">
                <button
                  type="button"
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    urgent ? "bg-red-500" : "bg-primary"
                  } text-white font-bold shadow-lg border-2 border-white cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "scale-125 shadow-xl ring-4 ring-blue-300"
                      : "scale-100 hover:scale-110"
                  }`}
                  onMouseEnter={() => {
                    // Clear any pending timeout
                    if (popupTimeoutRef.current) {
                      clearTimeout(popupTimeoutRef.current);
                    }
                    // Show popup immediately
                    setPopupInfo({
                      service,
                      longitude: coordinates.lng,
                      latitude: coordinates.lat,
                    });
                  }}
                  onMouseLeave={() => {
                    // Delay closing to allow moving to popup
                    popupTimeoutRef.current = setTimeout(() => {
                      setPopupInfo(null);
                    }, 100);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectService(service);
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectService(service);
                  }}
                >
                  {category.charAt(0)}
                </button>
              </div>
            </Marker>
          );
        })}

        {/* Popup for service details */}
        {popupInfo && (
          <Popup
            anchor="bottom"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
            closeOnClick={false}
            className="custom-popup"
            offset={15}
          >
            <div
              role="tooltip"
              className="min-w-[230px] max-w-[270px] bg-white p-4"
              onMouseEnter={() => {
                if (popupTimeoutRef.current) {
                  clearTimeout(popupTimeoutRef.current);
                }
              }}
              onMouseLeave={() => {
                setPopupInfo(null);
              }}
            >
              <div className="flex flex-col gap-3">
                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    {popupInfo.service.category}
                  </span>
                  {popupInfo.service.urgent && (
                    <span
                      className="h-2 w-2 rounded-full bg-red-500 animate-pulse"
                      title="Urgente"
                    />
                  )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                  {popupInfo.service.title}
                </h3>

                {/* Footer with Price */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-1">
                  <span className="text-xs font-medium text-gray-500">
                    Presupuesto
                  </span>
                  <span className="font-bold text-blue-600 text-lg">
                    {formatCurrency(popupInfo.service.budget)}
                  </span>
                </div>
              </div>
            </div>
          </Popup>
        )}

        {/* Navigation controls */}
        <NavigationControl position="top-left" />

        {/* Geolocate control - button to center on user location */}
        <GeolocateControl
          position="top-left"
          trackUserLocation={false}
          showAccuracyCircle={false}
          showUserLocation={true}
          fitBoundsOptions={{
            maxZoom: 16,
            padding: 20,
          }}
          onGeolocate={(e) => {
            if (mapRef.current) {
              mapRef.current.flyTo({
                center: [e.coords.longitude, e.coords.latitude],
                zoom: 16,
                duration: 1000,
              });
            }
          }}
          positionOptions={{
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 60000,
          }}
        />
      </MapLibreMap>

      <style jsx global>{`
        .maplibregl-map {
          height: 100% !important;
          width: 100% !important;
        }
        .maplibregl-control-container {
          z-index: 2 !important;
        }
        .maplibregl-popup {
          font-family: inherit;
          z-index: 12 !important;
        }
        .maplibregl-popup-content {
          border-radius: 0.75rem; /* rounded-xl */
          box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
          padding: 0 !important;
          border: 1px solid #f3f4f6; /* border-gray-100 */
          overflow: hidden;
        }
        .custom-popup .maplibregl-popup-content {
          padding: 1rem; /* p-4 */
        }
        /* Hide close button as we use hover */
        .maplibregl-popup-close-button {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default InteractiveMap;
