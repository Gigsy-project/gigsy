"use client"

import { memo, useState, useEffect } from "react"
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { LanguageSwitcher } from "./language-switcher"
import { useAuth } from "@/hooks/use-auth"
import { MessageSquare, User, Calendar, Wallet, Menu, LogOut, HelpCircle, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "./logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ROUTES } from "@/lib/constants"

const NavigationItem = memo(({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
  <DropdownMenuItem asChild>
    <Link href={href} className="cursor-pointer flex items-center">
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Link>
  </DropdownMenuItem>
))

NavigationItem.displayName = "NavigationItem"

export const Header = memo(() => {
  const t = useTranslations()
  const router = useRouter()
  const { status, isLoggedIn, isGuest, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop
      setIsScrolled(scrollPosition > 0)
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    router.push(ROUTES.home)
    setTimeout(() => {
      window.location.href = ROUTES.home
    }, 100)
  }

  const navigationItems = [
    { href: ROUTES.profile, icon: User, label: t("nav.profile") },
    { href: ROUTES.messages, icon: MessageSquare, label: t("nav.messages") },
    { href: ROUTES.calendar, icon: Calendar, label: t("nav.calendar") },
    { href: ROUTES.wallet, icon: Wallet, label: t("nav.wallet") },
    { href: ROUTES.helpCenter, icon: HelpCircle, label: t("nav.help") },
  ]

  return (
    <header className={`sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-shadow duration-200 ${isScrolled ? "shadow-sm" : ""}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <Logo width={60} height={60} />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSwitcher />

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">{t("nav.account")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">{t("nav.account")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {navigationItems.map((item) => (
                    <NavigationItem key={item.href} {...item} />
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("button.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : isGuest ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 px-4"
                onClick={() => router.push("/login")}
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">{t("button.login")}</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="px-4" onClick={() => router.push("/login")}>
                  {t("button.login")}
                </Button>
                <Button size="sm" className="px-4" onClick={() => router.push("/register")}>
                  {t("button.register")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
})

Header.displayName = "Header"
