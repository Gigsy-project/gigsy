"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"
import { Home, ArrowRight } from "lucide-react"
import "./globals.css"

export default function NotFound() {
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const textRef = useRef(null)
  const bgRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline()

    // Animación de fondo
    gsap.to(".bg-blob", {
      y: "20%",
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 1
    })

    // Entrada inicial
    tl.from(imageRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
    })
    .from(textRef.current, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    }, "-=0.8")

    // Animación flotante suave para la imagen
    gsap.to(imageRef.current, {
      y: 15,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
  }, { scope: containerRef })

  return (
    <div 
      ref={containerRef}
      className="relative h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50/50 to-white p-4 sm:p-6 lg:p-8 xl:p-12 text-center lg:text-left overflow-hidden"
    >
      {/* Elementos de fondo decorativos */}
      <div ref={bgRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-blob absolute top-[-10%] left-[-10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-blue-200/20 rounded-full blur-3xl" />
        <div className="bg-blob absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="bg-blob absolute top-[20%] right-[10%] w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[300px] lg:h-[300px] bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl xl:max-w-7xl gap-8 lg:gap-12 xl:gap-16">
        {/* Imagen - Izquierda en desktop, arriba en mobile */}
        <div ref={imageRef} className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[480px] xl:max-w-[550px] aspect-[4/3] lg:flex-shrink-0 drop-shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden order-1 lg:order-1">
          <Image
            src="/not-found.png"
            alt="Ilustración de página no encontrada"
            fill
            className="object-cover"
            priority
            fetchPriority="high"
          />
        </div>
        
        {/* Contenido de texto - Derecha en desktop, abajo en mobile */}
        <div ref={textRef} className="flex flex-col justify-center space-y-6 sm:space-y-7 lg:space-y-8 max-w-lg lg:max-w-xl xl:max-w-2xl px-4 sm:px-6 lg:px-0 order-2 lg:order-2">
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                ¡Oops!
              </span>
              <span className="block mt-2 sm:mt-3">Página no encontrada</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl text-gray-600 leading-relaxed">
              Parece que te has desviado del camino. La página que buscas no existe, ha sido movida o nunca estuvo aquí.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 lg:gap-4 pt-2 sm:pt-4">
            <Button asChild size="lg" className="rounded-full px-6 sm:px-8 lg:px-10 h-12 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto group">
              <Link href="/">
                <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Volver al inicio
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6 sm:px-8 lg:px-10 h-12 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-base font-semibold border-2 hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto group">
              <Link href="/help-center">
                Centro de ayuda
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
