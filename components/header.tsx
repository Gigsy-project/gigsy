"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import Image from "next/image";
import { LanguageSwitcher } from "./language-switcher";
import {
  MessageSquare,
  User,
  Calendar,
  Wallet,
  Menu,
  LogOut,
  HelpCircle,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ROUTES } from "@/lib/constants";
import { authClient } from "@/lib/auth-client";

const NavigationItem = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) => (
  <DropdownMenuItem asChild>
    <Link href={href} className="cursor-pointer flex items-center">
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Link>
  </DropdownMenuItem>
);

export const Header = ({ className }: { className?: string }) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  // const { isLoggedIn, isGuest, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { useSession, signOut } = authClient;
  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback: redirect to login anyway
      router.push("/");
    }
  };

  const navigationItems = [
    { href: ROUTES.profile, icon: User, label: t("nav.profile") },
    { href: ROUTES.messages, icon: MessageSquare, label: t("nav.messages") },
    { href: ROUTES.calendar, icon: Calendar, label: t("nav.calendar") },
    { href: ROUTES.wallet, icon: Wallet, label: t("nav.wallet") },
    { href: ROUTES.helpCenter, icon: HelpCircle, label: t("nav.help") },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md supports-backdrop-filter:bg-white/60 transition-shadow duration-200 shadow-sm ${className || ""}`}
      >
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
                className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 h-9 transition-colors shadow-sm"
              >
                {t("nav.postTask")}
              </Button>

              {/* Navigation Links - Desktop only */}
              <nav className="hidden md:flex items-center gap-8">
                <Link
                  href={ROUTES.browseServices}
                  className={`font-medium text-sm transition-colors relative py-1 ${
                    pathname === ROUTES.browseServices ||
                    pathname?.startsWith(ROUTES.browseServices + "/")
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {t("nav.browseTasks")}
                  {(pathname === ROUTES.browseServices ||
                    pathname?.startsWith(ROUTES.browseServices + "/")) && (
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

              {/* Desktop auth section */}
              <div className="hidden md:flex items-center gap-2">
                {isPending ? (
                  // Loading state
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                ) : session?.user ? (
                  // Logged in state
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full h-9 w-9 p-0"
                      >
                        {session.user.avatar ? (
                          <Image
                            src={session.user.avatar}
                            alt={session.user.name || "User"}
                            width={40}
                            height={40}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span className="sr-only">{t("nav.account")}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        <div>
                          <p className="font-medium text-foreground">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {navigationItems.map((item) => (
                        <NavigationItem key={item.href} {...item} />
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t("button.logout")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // Not logged in state
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 md:px-4 text-sm rounded-full"
                      onClick={() => router.push("/login")}
                    >
                      {t("button.login")}
                    </Button>
                    <Button
                      size="sm"
                      className="px-3 md:px-4 text-sm rounded-full"
                      onClick={() => router.push("/register")}
                    >
                      {t("button.register")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>{t("nav.menu")}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col space-y-4 mt-6">
            {session?.user ? (
              <>
                <div className="flex items-center gap-3 p-3 border rounded-lg mx-2">
                  {session.user.avatar ? (
                    <Image
                      src={session.user.avatar}
                      alt={session.user.name || "User"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </div>

                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}

                <Button
                  variant="ghost"
                  className="justify-start p-3 h-auto text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  {t("button.logout")}
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => {
                    router.push("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {t("button.login")}
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    router.push("/register");
                    setMobileMenuOpen(false);
                  }}
                >
                  {t("button.register")}
                </Button>
              </div>
            )}

            <div className="border-t pt-4">
              <Link
                href="/browse-services"
                className="block p-3 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.browseTasks")}
              </Link>
              <Link
                href="/request-service"
                className="block p-3 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.howItWorks")}
              </Link>
              <Link
                href="/about"
                className="block p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 transition-colors shadow-sm text-center mx-3 mt-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.postTask")}
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

Header.displayName = "Header";
