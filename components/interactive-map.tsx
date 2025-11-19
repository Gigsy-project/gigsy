"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Map as MapLibreMap, Marker, Popup, NavigationControl } from "react-map-gl/maplibre";
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

interface InteractiveMapProps {
  services: ServiceTaskWithLocation[];
  userLocation: ServiceLocation;
  onSelectService: (service: ServiceTaskWithLocation) => void;
  selectedService: ServiceTaskWithLocation | null;
}

const InteractiveMap = ({
  services,
  userLocation,
  onSelectService,
  selectedService,
}: InteractiveMapProps) => {
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<{
    service: ServiceTaskWithLocation;
    longitude: number;
    latitude: number;
  } | null>(null);
  const [detectedLocation, setDetectedLocation] = useState<ServiceLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isFetchingFallback, setIsFetchingFallback] = useState(false);

  // Get user location with navigator.geolocation
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocalización no soportada por el navegador');
      return;
    }
  
    setIsLocating(true);
    setLocationError(null);
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDetectedLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
        setLocationError(null);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        setIsLocating(false);
        
        let errorMessage = 'No se pudo obtener tu ubicación';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Información de ubicación no disponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado';
            break;
          default:
            errorMessage = 'Error desconocido al obtener ubicación';
            break;
        }
        
        setLocationError(errorMessage);
        
        // Fallback usando IP geolocation (sin Google APIs)
        handleIPGeolocationFallback();
      },
      {
        enableHighAccuracy: true,    // Importante: evita servicios de Google
        timeout: 8000,               // 8 segundos timeout
        maximumAge: 600000,          // Cache por 10 minutos
      }
    );
  }, []);
  
  // Fallback usando IP geolocation sin Google APIs
  const handleIPGeolocationFallback = useCallback(async () => {
    setIsFetchingFallback(true);
    
    try {
      // Usar ipapi.co que no requiere API key para uso básico
      const response = await fetch('https://ipapi.co/json/', {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.latitude && data.longitude) {
          setDetectedLocation({ 
            lat: data.latitude, 
            lng: data.longitude 
          });
          setLocationError(null);
        } else {
          setLocationError('No se pudo determinar ubicación aproximada');
        }
      } else {
        setLocationError('Servicio de ubicación no disponible');
      }
    } catch (error) {
      console.error('Error con fallback de geolocalización:', error);
      setLocationError('Error al obtener ubicación aproximada');
    } finally {
      setIsFetchingFallback(false);
    }
  }, []);



  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

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
    [currentUserLocation]
  );

  // Fit bounds to show all markers when services change
  useEffect(() => {
    if (!mapRef.current || services.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    bounds.extend([currentUserLocation.lng, currentUserLocation.lat]);
      services.forEach((service) => {
      bounds.extend([service.coordinates.lng, service.coordinates.lat]);
    });
    
    setTimeout(() => {
      mapRef.current?.fitBounds(bounds, { padding: 50 });
    }, 100);
  }, [services, currentUserLocation]);

  // Center map on selected service
  useEffect(() => {
    if (mapRef.current && selectedService) {
      mapRef.current.flyTo({
        center: [selectedService.coordinates.lng, selectedService.coordinates.lat],
        zoom: 14,
        duration: 500,
      });
    }
  }, [selectedService]);

  // Airtasker-style map: Clean, minimalist design with soft colors
  // Similar to Airtasker's map design - light, modern, with clear streets and labels
  const mapStyle = useMemo(() => {
    // Option 1: MapTiler Streets style (similar to Airtasker) - requires API key
    // Uncomment and add your MapTiler API key to use:
    // return `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;
    
    // Option 2: OpenFreeMap Positron style (light, clean, Airtasker-like)
    return "https://tiles.openfreemap.org/styles/positron";
    
    // Option 3: Custom Airtasker-inspired style (light colors, clean design)
    // return {
    //   version: 8 as const,
    //   sources: {
    //     'carto-positron': {
    //       type: 'raster' as const,
    //       tiles: [
    //         'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    //         'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    //         'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
    //       ],
    //       tileSize: 256,
    //       attribution: '© OpenStreetMap contributors © CARTO'
    //     }
    //   },
    //   layers: [
    //     {
    //       id: 'carto-positron-layer',
    //       type: 'raster' as const,
    //       source: 'carto-positron',
    //       minzoom: 0,
    //       maxzoom: 19
    //     }
    //   ],
    //   glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
    // };
  }, []);

  // Transform request for custom tile sources (if needed for authentication)
  const transformRequest = useMemo(() => {
    return (url: string, resourceType?: string) => {
      void resourceType;
      // If using MapTiler or other services that need headers
      // if (resourceType === 'Tile' && url.includes('maptiler.com')) {
      //   return {
      //     url: url,
      //     headers: {
      //       'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
      //     }
      //   };
      // }
      return { url };
    };
  }, []);

  return (
    <div className="h-full w-full relative z-0">
      <MapLibreMap
        ref={mapRef}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        transformRequest={transformRequest}
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
              {isFetchingFallback ? "Determinando ubicación aproximada..." : "Detectando tu ubicación..."}
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
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                onSelectService(service);
                setPopupInfo({
                  service,
                  longitude: coordinates.lng,
                  latitude: coordinates.lat,
                });
              }}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  urgent ? "bg-red-500" : "bg-primary"
                } text-white font-bold shadow-lg border-2 border-white cursor-pointer transition-transform ${
                  isSelected ? "scale-125" : "scale-100"
                }`}
              >
                {category.charAt(0)}
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
            closeButton={true}
            closeOnClick={false}
            className="custom-popup"
          >
            <div className="p-1">
              <div className="font-bold">{popupInfo.service.title}</div>
              <div>{formatCurrency(popupInfo.service.budget)}</div>
            </div>
          </Popup>
        )}

        {/* Navigation controls */}
        <NavigationControl position="top-left" />
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
          border-radius: 0.375rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 0.5rem;
        }
        .maplibregl-popup-close-button {
          font-size: 1.25rem;
          padding: 0.25rem 0.5rem;
        }
        .custom-popup .maplibregl-popup-content {
          padding: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default InteractiveMap;
