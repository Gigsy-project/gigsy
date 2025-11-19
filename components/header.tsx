"use client"

import { useTranslations } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
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

const NavigationItem = ({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) => (
  <DropdownMenuItem asChild>
    <Link href={href} className="cursor-pointer flex items-center">
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Link>
  </DropdownMenuItem>
)

export const Header = ({className}: {className?: string}) => {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn, isGuest, logout } = useAuth()

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
    <header className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md supports-backdrop-filter:bg-white/60 transition-shadow duration-200 shadow-sm ${className || ""}`}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Logo, Post Task button, Navigation links */}
          <div className="flex items-center gap-6 md:gap-8">
            <Logo width={60} height={60} />
            
            {/* Post Task Button */}
            <Button
              onClick={() => router.push(ROUTES.requestService)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 h-10 transition-colors shadow-sm"
            >
              {t("nav.postTask")}
            </Button>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href={ROUTES.browseServices}
                className={`font-medium text-sm transition-colors relative py-1 ${
                  pathname === ROUTES.browseServices || pathname?.startsWith(ROUTES.browseServices + "/")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {t("nav.browseTasks")}
                {(pathname === ROUTES.browseServices || pathname?.startsWith(ROUTES.browseServices + "/")) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                )}
              </Link>
              <Link
                href={ROUTES.home}
                className="font-medium text-sm transition-colors relative py-1 text-gray-700 hover:text-gray-900"
              >
                {t("nav.howItWorks")}
              </Link>
            </nav>
          </div>

          {/* Right side: Language switcher and User menu */}
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
}

Header.displayName = "Header"
