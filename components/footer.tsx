"use client"

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AppStoreButton, GooglePlayButton } from "./base/buttons/app-store-buttons"

export function Footer() {
  const t = useTranslations()
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Compañía */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.workWithUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.press")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.blog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quiénes somos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.whoWeAre")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/mission"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.ourMission")}
                </Link>
              </li>
              <li>
                <Link
                  href="/values"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.ourValues")}
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.ourTeam")}
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.ourHistory")}
                </Link>
              </li>
              <li>
                <Link
                  href="/investors"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.investors")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Lo que ofrecemos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.whatWeOffer")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.ourServices")}
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.howItWorks")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.safety")}
                </Link>
              </li>
              <li>
                <Link
                  href="/guarantee"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.guarantee")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte y Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.support")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help-center"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.helpCenter")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.faq")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.termsOfService")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.cookiePolicy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mb-6">
            <Link
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-1.745 0-2.513.829-2.513 2.437v1.543h3.68l-.736 3.667h-2.944v7.98H9.101z" />
              </svg>
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="sr-only">X (Twitter)</span>
            </Link>
            <Link
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span className="sr-only">YouTube</span>
            </Link>
            <Link
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
              <span className="sr-only">Instagram</span>
            </Link>
          </div>

          {/* App Store Buttons */}
          <div className="flex justify-center space-x-4 mb-6">
              <GooglePlayButton size="lg" link='#' />
              <AppStoreButton size="lg" link='#' />
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2024 GigSy. {t("footer.rights")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
