"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import {
  Shield,
  Star,
  Zap,
  ShieldCheck,
  Heart,
  Briefcase,
  Users,
  CheckCircle,
  MapPin,
  TrendingUp,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const t = useTranslations()
  const mainRef = useRef(null)

  useGSAP(
    () => {
      gsap.from(".hero-element", {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2,
      })

      const sections = gsap.utils.toArray(".animated-section")
      sections.forEach((section) => {
        gsap.from(section as HTMLElement, {
          scrollTrigger: {
            trigger: section as HTMLElement,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out",
        })
      })
    },
    { scope: mainRef }
  )

  const features = [
    {
      icon: Shield,
      title: t("hero.features.verified"),
      description: t("hero.features.verifiedDesc"),
    },
    {
      icon: Star,
      title: t("hero.features.quality"),
      description: t("hero.features.qualityDesc"),
    },
    {
      icon: Zap,
      title: t("hero.features.fast"),
      description: t("hero.features.fastDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("hero.features.protected"),
      description: t("hero.features.protectedDesc"),
    },
  ]

  const communitySteps = [
    {
      icon: MapPin,
      title: t("community.step1.title"),
      description: t("community.step1.description"),
    },
    {
      icon: Users,
      title: t("community.step2.title"),
      description: t("community.step2.description"),
    },
    {
      icon: TrendingUp,
      title: t("community.step3.title"),
      description: t("community.step3.description"),
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white" ref={mainRef}>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gray-50">
          <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)] px-4 py-16">
            <div className="text-center lg:text-left">
              <h1 className="hero-element text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                {t("landing.hero.title")}
              </h1>
              <p className="hero-element mt-6 text-lg text-gray-600 md:text-xl">
                {t("landing.hero.subtitle")}
              </p>
              <div className="hero-element mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="rounded-full h-12 px-8 text-base" asChild>
                  <Link href="/browse-services">
                    <Briefcase className="mr-2 h-5 w-5" />
                    {t("button.findService")}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base" asChild>
                  <Link href="/register">
                    <Heart className="mr-2 h-5 w-5" />
                    {t("button.offerService")}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hero-element relative h-[400px] lg:h-[500px] w-full rounded-3xl overflow-hidden">
              <Image
                src="/hero.png"
                alt={t("landing.hero.imageAlt")}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="animated-section py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {t("community.title")}
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                {t("community.subtitle")}
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Column 1: Image */}
              <div className="relative h-[400px] lg:h-[600px] w-full rounded-3xl overflow-hidden">
                <Image
                  src="/comunidad-servicios.png"
                  alt="GigSy Community Ecosystem"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Column 2: Steps */}
              <div className="space-y-12">
                {communitySteps.map((step, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-md">
                        <step.icon className="h-7 w-7" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 pl-20">
                  <Button size="lg" className="rounded-full px-8" asChild>
                    <Link href="/register">{t("button.joinNow")}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Find Services Section */}
        <section className="animated-section py-20 bg-gray-50">
          <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center px-4">
            <div className="relative h-[350px] lg:h-[450px] w-full order-last lg:order-first rounded-3xl overflow-hidden">
                <Image
                    src="/buscar-servicios.png"
                    alt={t("landing.findService.imageAlt")}
                    fill
                    className="object-cover"
                />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {t("landing.findService.title")}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {t("landing.findService.subtitle")}
              </p>
              <Button size="lg" className="mt-8 rounded-full h-12 px-8" asChild>
                <Link href="/browse-services">{t("button.exploreServices")}</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Offer Services Section */}
        <section className="animated-section py-20 bg-white">
          <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center px-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {t("landing.offerService.title")}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {t("landing.offerService.subtitle")}
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-gray-600">{t("landing.offerService.benefit1")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-gray-600">{t("landing.offerService.benefit2")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-gray-600">{t("landing.offerService.benefit3")}</span>
                </li>
              </ul>
              <Button size="lg" className="mt-8 rounded-full h-12 px-8" asChild>
                <Link href="/register">{t("button.startEarning")}</Link>
              </Button>
            </div>
            <div className="relative h-[350px] lg:h-[450px] w-full rounded-3xl overflow-hidden">
                <Image
                    src="/gana-dondequieras.png"
                    alt={t("landing.offerService.imageAlt")}
                    fill
                    className="object-cover"
                />
            </div>
          </div>
        </section>
        
        {/* Why Choose Us Section */}
        <section className="animated-section py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t("hero.whyChoose")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
                {t("hero.whyChooseDesc")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="flex-shrink-0 flex mx-auto h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mt-5 text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="animated-section py-24 bg-primary text-white mx-2 rounded-xl">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("landing.finalCta.title")}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-200">
              {t("landing.finalCta.subtitle")}
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" className="rounded-full h-14 px-10 text-base" asChild>
                <Link href="/register">{t("button.joinNow")}</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}