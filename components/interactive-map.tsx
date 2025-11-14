"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { ServiceTask } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

// Fix Leaflet icon issues
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

interface ServiceLocation {
  lat: number
  lng: number
}

interface ServiceTaskWithLocation extends ServiceTask {
  coordinates: ServiceLocation
}

interface InteractiveMapProps {
  services: ServiceTaskWithLocation[]
  userLocation: ServiceLocation
  onSelectService: (service: ServiceTaskWithLocation) => void
  selectedService: ServiceTaskWithLocation | null
}

const InteractiveMap = ({ services, userLocation, onSelectService, selectedService }: InteractiveMapProps) => {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: number]: L.Marker }>({})
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialize map
  useEffect(() => {
    fixLeafletIcon()

    if (!mapRef.current) {
      const map = L.map("map", {
        zIndex: 1, // Set map container z-index to be lower
      }).setView([userLocation.lat, userLocation.lng], 12)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Add user location marker
      const userIcon = L.divIcon({
        className: "user-location-marker",
        html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindTooltip("Tu ubicación", { permanent: false, direction: "top" })

      mapRef.current = map
      setMapLoaded(true)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [userLocation])

  // Add service markers
  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      // Clear existing markers
      Object.values(markersRef.current).forEach((marker) => {
        marker.remove()
      })
      markersRef.current = {}

      // Add new markers
      services.forEach((service) => {
        const { coordinates, id, title, budget, category, urgent } = service

        // Create custom marker icon
        const markerIcon = L.divIcon({
          className: "service-marker",
          html: `
            <div class="flex items-center justify-center w-8 h-8 rounded-full ${
              urgent ? "bg-red-500" : "bg-primary"
            } text-white font-bold shadow-lg border-2 border-white">
              ${category.charAt(0)}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })

        // Create marker
        const marker = L.marker([coordinates.lat, coordinates.lng], { icon: markerIcon })
          .addTo(mapRef.current!)
          .bindTooltip(
            `
            <div class="p-1">
              <div class="font-bold">${title}</div>
              <div>${formatCurrency(budget)}</div>
            </div>
          `,
            { permanent: false, direction: "top" },
          )
          .on("click", () => {
            onSelectService(service)
          })

        markersRef.current[id] = marker
      })

      // Fit bounds to show all markers plus user location
      if (services.length > 0) {
        const bounds = L.latLngBounds([userLocation])
        services.forEach((service) => {
          bounds.extend([service.coordinates.lat, service.coordinates.lng])
        })
        mapRef.current.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [services, mapLoaded, userLocation, onSelectService])

  // Highlight selected service on map
  useEffect(() => {
    if (mapRef.current && selectedService && markersRef.current[selectedService.id]) {
      const marker = markersRef.current[selectedService.id]

      // Center map on selected marker
      mapRef.current.setView([selectedService.coordinates.lat, selectedService.coordinates.lng], 14)

      // Highlight the marker (you could change the icon here)
      Object.values(markersRef.current).forEach((m) => {
        const icon = m._icon
        if (icon) {
          icon.classList.remove("selected-marker")
        }
      })

      const selectedIcon = marker._icon
      if (selectedIcon) {
        selectedIcon.classList.add("selected-marker")
      }
    }
  }, [selectedService])

  return (
    <div id="map" className="h-full w-full rounded-lg relative z-0">
      <style jsx global>{`
        .leaflet-container {
          z-index: 1 !important;
        }
        .leaflet-control-container {
          z-index: 2 !important;
        }
        .user-location-marker {
          z-index: 10;
        }
        .service-marker {
          z-index: 9;
        }
        .selected-marker {
          transform: scale(1.2);
          z-index: 11;
          transition: transform 0.2s ease;
        }
        .leaflet-tooltip {
          font-family: inherit;
          font-size: 0.875rem;
          padding: 0.5rem;
          border-radius: 0.375rem;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          z-index: 12 !important;
        }
        .leaflet-popup {
          z-index: 12 !important;
        }
      `}</style>
    </div>
  )
}

export default InteractiveMap
