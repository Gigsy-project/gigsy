"use client"

import { useState } from "react"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const mainNavLinks = [
    { href: "/", label: "Home" },
    { href: ROUTES.browseServices, label: t("nav.browseTasks") },
    { href: null, label: t("nav.howItWorks") },
  ]

  return (
    <>
      <header className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md supports-backdrop-filter:bg-white/60 transition-shadow duration-200 shadow-sm ${className || ""}`}>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left side: Logo, Post Task button, Navigation links */}
            <div className="flex items-center gap-3 md:gap-6 lg:gap-8">
              {/* Logo - smaller on mobile */}
              <div className="hidden sm:block">
                <Logo width={60} height={60} />
              </div>
              <div className="sm:hidden">
                <Logo width={50} height={50} />
              </div>
              
              {/* Post Task Button - hidden on mobile */}
              <Button
                onClick={() => router.push(ROUTES.requestService)}
                className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 h-10 transition-colors shadow-sm"
              >
                {t("nav.postTask")}
              </Button>

              {/* Navigation Links - Desktop only */}
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

            {/* Right side: Language switcher, Mobile menu button and User menu */}
            <div className="flex items-center gap-2 md:gap-4">
              <LanguageSwitcher />
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-9 w-9 p-0"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden md:flex rounded-full h-9 w-9 p-0">
                      <User className="h-4 w-4" />
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
                  className="flex items-center gap-2 px-3 md:px-4"
                  onClick={() => router.push("/login")}
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("button.login")}</span>
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="px-3 md:px-4 text-sm" onClick={() => router.push("/login")}>
                    {t("button.login")}
                  </Button>
                  <Button size="sm" className="px-3 md:px-4 text-sm" onClick={() => router.push("/register")}>
                    {t("button.register")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[300px]">
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-1">
            {/* Main Navigation Links */}
            {mainNavLinks.map((link) => {
              if (link.href === null) {
                // How it works - no link, just text
                return (
                  <div
                    key={link.label}
                    className="flex items-center px-4 py-3 text-base font-medium rounded-lg text-gray-700 cursor-default"
                  >
                    {link.label}
                  </div>
                )
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    pathname === link.href || (link.href === ROUTES.browseServices && pathname?.startsWith(ROUTES.browseServices + "/"))
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            
            {/* Post Task Button in Mobile Menu */}
            <Button
              onClick={() => {
                router.push(ROUTES.requestService)
                setMobileMenuOpen(false)
              }}
              className="mt-4 mx-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full h-11"
            >
              {t("nav.postTask")}
            </Button>

            {/* User Account Links (if logged in) */}
            {isLoggedIn && (
              <>
                <div className="mt-6 pt-6 border-t">
                  <p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2">{t("nav.account")}</p>
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    {t("button.logout")}
                  </button>
                </div>
              </>
            )}

            {/* Login/Register Links (if not logged in) */}
            {!isLoggedIn && !isGuest && (
              <div className="mt-6 pt-6 border-t flex flex-col gap-2 px-4">
                <Button
                  variant="outline"
                  className="w-full h-11"
                  onClick={() => {
                    router.push("/login")
                    setMobileMenuOpen(false)
                  }}
                >
                  {t("button.login")}
                </Button>
                <Button
                  className="w-full h-11"
                  onClick={() => {
                    router.push("/register")
                    setMobileMenuOpen(false)
                  }}
                >
                  {t("button.register")}
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

Header.displayName = "Header"
