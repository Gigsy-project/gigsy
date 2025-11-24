"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/file-upload";
import { es } from "date-fns/locale";
import {
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Sun,
  Clock,
  Sunset,
  Moon,
  Calendar,
  MapPin,
  Monitor,
  Shield,
  Check,
  DollarSign,
  FileText,
  Camera,
  Star,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/date-picker";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AuthGuard } from "@/components/auth-guard";

export default function RequestServicePage() {
  const t = useTranslations("requestService");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const { status, isLoggedIn, isGuest, startRegistration } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [exactDate, setExactDate] = useState<Date>();
  const [beforeDate, setBeforeDate] = useState<Date>();
  const [datePreference, setDatePreference] = useState<
    "exact" | "before" | "flexible"
  >("flexible");
  const [submitted, setSubmitted] = useState(false);
  const [locationType, setLocationType] = useState<"presencial" | "online">(
    "presencial",
  );
  const [timePreference, setTimePreference] = useState<string>("");
  const [needSpecificTime, setNeedSpecificTime] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If guest, redirect to complete registration
    if (isGuest) {
      startRegistration("/request-service");
      return;
    }

    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get locale for date formatting based on selected language
  const getLocale = () => {
    switch (locale) {
      case "en":
        return undefined; // Default locale
      case "es":
        return es;
      case "pt":
        return undefined; // Use default for now, add Portuguese locale if needed
      default:
        return undefined;
    }
  };

  const timeOptions = useMemo(() => [
    { id: "morning", label: t("timeMorning"), subtitle: t("timeMorningSub"), icon: Sun },
    { id: "midday", label: t("timeMidday"), subtitle: t("timeMiddaySub"), icon: Clock },
    { id: "afternoon", label: t("timeAfternoon"), subtitle: t("timeAfternoonSub"), icon: Sunset },
    { id: "evening", label: t("timeEvening"), subtitle: t("timeEveningSub"), icon: Moon },
  ], [t]);

  const stepTitles = useMemo(() => [
    t("stepTitle1"),
    t("stepTitle2"),
    t("stepTitle3"),
  ], [t]);

  // Show loading state while checking auth
  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div>{tCommon("loading")}</div>
        </main>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={false} allowGuest={true}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 py-4 sm:py-6 lg:py-8">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6">
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("backToHome")}
              </Link>
            </div>

            {!submitted ? (
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                {/* Left Sidebar - Steps Navigation (Desktop only) */}
                <div className="hidden lg:block w-72 flex-shrink-0">
                  <div className="bg-card border rounded-lg p-6 sticky top-8">
                    <h2 className="text-xl font-semibold mb-6 text-foreground">
                      {t("publishTask")}
                    </h2>
                    <div className="space-y-3">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                            currentStep === step
                              ? "bg-primary text-primary-foreground"
                              : currentStep > step
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted/50"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                              currentStep === step
                                ? "bg-primary-foreground text-primary"
                                : currentStep > step
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {currentStep > step ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              step
                            )}
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">
                              {step === 1 && t("step1")}
                              {step === 2 && t("step2")}
                              {step === 3 && t("step3")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile Steps Indicator */}
                <div className="lg:hidden bg-card border rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      {t("publishTask")}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {tCommon("step")} {currentStep} {tCommon("of")} 3
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex-1 flex items-center gap-2">
                        <div
                          className={`flex-1 h-2 rounded-full transition-colors ${
                            currentStep >= step
                              ? "bg-primary"
                              : "bg-muted"
                          }`}
                        />
                        {step < 3 && (
                          <div
                            className={`w-2 h-2 rounded-full transition-colors ${
                              currentStep > step
                                ? "bg-primary"
                                : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-sm font-medium text-foreground">
                      {currentStep === 1 && t("step1")}
                      {currentStep === 2 && t("step2")}
                      {currentStep === 3 && t("step3")}
                    </span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="bg-card border rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="text-center mb-6 sm:mb-8">
                      <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-foreground">
                        {stepTitles[currentStep - 1]}
                      </h1>
                      <div className="w-12 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                      {/* Step 1: Basics */}
                      {currentStep === 1 && (
                        <div className="space-y-6 sm:space-y-8">
                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                              <h3 className="text-base sm:text-lg font-medium text-foreground">
                                {t("whatNeed")}
                              </h3>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground">
                              {t("whatNeedDesc")}
                            </p>
                            <Input
                              placeholder={t("whatNeedPlaceholder")}
                              className="h-11 sm:h-12 text-base"
                            />
                          </div>

                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                              <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                              <h3 className="text-base sm:text-lg font-medium text-foreground">
                                {t("whenNeed")}
                              </h3>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                              {t("whenNeedDesc")}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                              {[
                                {
                                  id: "exact",
                                  label: t("dateExact"),
                                  desc: t("dateExactDesc"),
                                },
                                {
                                  id: "before",
                                  label: t("dateBefore"),
                                  desc: t("dateBeforeDesc"),
                                },
                                {
                                  id: "flexible",
                                  label: t("dateFlexible"),
                                  desc: t("dateFlexibleDesc"),
                                },
                              ].map((option) => (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() =>
                                    setDatePreference(option.id as any)
                                  }
                                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                                    datePreference === option.id
                                      ? "border-primary bg-primary/5 text-foreground"
                                      : "border-border bg-card hover:border-primary/30"
                                  }`}
                                >
                                  <div className="font-medium mb-1 text-sm sm:text-base">
                                    {option.label}
                                  </div>
                                  <div className="text-xs sm:text-sm text-muted-foreground">
                                    {option.desc}
                                  </div>
                                </button>
                              ))}
                            </div>

                            {/* Date Picker based on selection */}
                            {datePreference === "exact" && (
                              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/30 rounded-lg border">
                                <DatePicker
                                  label={t("selectExactDate")}
                                  placeholder={t("selectExactDatePlaceholder")}
                                  value={exactDate}
                                  onChange={setExactDate}
                                  size="lg"
                                  locale={locale === "es" ? "es" : "en"}
                                />
                              </div>
                            )}

                            {datePreference === "before" && (
                              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/30 rounded-lg border">
                                <DatePicker
                                  label={t("selectBeforeDate")}
                                  placeholder={t("selectBeforeDatePlaceholder")}
                                  value={beforeDate}
                                  onChange={setBeforeDate}
                                  size="lg"
                                  locale={locale === "es" ? "es" : "en"}
                                />
                              </div>
                            )}

                            {datePreference === "flexible" && (
                              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-secondary/20 border border-secondary/30 rounded-lg">
                                <div className="flex items-start gap-2 sm:gap-3">
                                  <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="h-3 w-3 text-secondary-foreground" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm sm:text-base text-foreground mb-1">
                                      {t("dateFlexibleGood")}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                      {t("dateFlexibleGoodDesc")}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="specific-time"
                                checked={needSpecificTime}
                                onChange={(e) =>
                                  setNeedSpecificTime(e.target.checked)
                                }
                                className="w-4 h-4 text-primary rounded focus:ring-primary border-border flex-shrink-0"
                              />
                              <Label
                                htmlFor="specific-time"
                                className="text-sm sm:text-base text-foreground cursor-pointer"
                              >
                                {t("needSpecificTime")}
                              </Label>
                            </div>

                            {needSpecificTime && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3 sm:mt-4">
                                {timeOptions.map((option) => {
                                  const IconComponent = option.icon;
                                  return (
                                    <button
                                      key={option.id}
                                      type="button"
                                      onClick={() =>
                                        setTimePreference(option.id)
                                      }
                                      className={`p-3 sm:p-4 rounded-lg border-2 text-center transition-all ${
                                        timePreference === option.id
                                          ? "border-primary bg-primary/5 text-foreground"
                                          : "border-border bg-card hover:border-primary/30"
                                      }`}
                                    >
                                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-primary" />
                                      <div className="font-medium text-xs sm:text-sm mb-0.5 sm:mb-1">
                                        {option.label}
                                      </div>
                                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                                        {option.subtitle}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Step 2: Budget + Description */}
                      {currentStep === 2 && (
                        <div className="space-y-6 sm:space-y-8">
                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                              <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
                              <h3 className="text-base sm:text-lg font-medium text-foreground">
                                {t("budget")}
                              </h3>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                              {t("budgetDesc")}
                            </p>
                            <div className="w-full sm:max-w-sm">
                              <Label className="text-sm font-medium text-foreground mb-2 block">
                                {t("budgetLabel")}
                              </Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base sm:text-lg font-semibold text-primary">
                                  $
                                </span>
                                <Input
                                  type="number"
                                  className="pl-8 h-11 sm:h-12 text-base sm:text-lg font-medium"
                                  placeholder={t("budgetPlaceholder")}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t("budgetNote")}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                              <h3 className="text-base sm:text-lg font-medium text-foreground">
                                {t("describeProject")}
                              </h3>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                              {t("describeProjectDesc")}
                            </p>
                            <Textarea
                              placeholder={t("describeProjectPlaceholder")}
                              className="min-h-[120px] sm:min-h-[150px] text-sm sm:text-base resize-none"
                            />
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                              {[
                                t("tip1"),
                                t("tip2"),
                                t("tip3"),
                              ].map((tip, index) => (
                                <span
                                  key={index}
                                  className="text-[10px] sm:text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground"
                                >
                                  {tip}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                              <h3 className="text-base sm:text-lg font-medium text-foreground">
                                {t("whereWork")}
                              </h3>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                              {t("whereWorkDesc")}
                            </p>
                            <RadioGroup
                              value={locationType}
                              onValueChange={(value) =>
                                setLocationType(
                                  value as "presencial" | "online",
                                )
                              }
                              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                            >
                              <div
                                className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                  locationType === "presencial"
                                    ? "border-primary bg-primary/5 text-foreground"
                                    : "border-border bg-card hover:border-primary/30"
                                }`}
                              >
                                <RadioGroupItem
                                  value="presencial"
                                  id="presencial"
                                  className="sr-only"
                                />
                                <Label
                                  htmlFor="presencial"
                                  className="cursor-pointer block"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                                    <span className="font-medium text-sm sm:text-base">
                                      {t("locationPresential")}
                                    </span>
                                  </div>
                                  <div className="text-xs sm:text-sm text-muted-foreground">
                                    {t("locationPresentialDesc")}
                                  </div>
                                </Label>
                              </div>
                              <div
                                className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                  locationType === "online"
                                    ? "border-primary bg-primary/5 text-foreground"
                                    : "border-border bg-card hover:border-primary/30"
                                }`}
                              >
                                <RadioGroupItem
                                  value="online"
                                  id="online"
                                  className="sr-only"
                                />
                                <Label
                                  htmlFor="online"
                                  className="cursor-pointer block"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                    <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                                    <span className="font-medium text-sm sm:text-base">
                                      {t("locationOnline")}
                                    </span>
                                  </div>
                                  <div className="text-xs sm:text-sm text-muted-foreground">
                                    {t("locationOnlineDesc")}
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>

                            {locationType === "presencial" && (
                              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-muted/30 rounded-lg border">
                                <Label
                                  htmlFor="address"
                                  className="text-sm font-medium text-foreground mb-2 block"
                                >
                                  {t("addressLabel")}
                                </Label>
                                <Input
                                  id="address"
                                  placeholder={t("addressPlaceholder")}
                                  className="h-11"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  {t("addressNote")}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                              <Camera className="h-5 w-5 text-primary flex-shrink-0" />
                              <h3 className="text-base sm:text-lg font-medium text-foreground">
                                {t("addImages")}
                              </h3>
                              <span className="text-[10px] sm:text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                                {tCommon("optional")}
                              </span>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                              {t("addImagesDesc")}
                            </p>
                            <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6">
                              <FileUpload
                                label=""
                                multiple={true}
                                accept="image/*,video/*"
                                onChange={() => {}}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Payment */}
                      {currentStep === 3 && (
                        <div className="space-y-6 sm:space-y-8">
                          <div className="text-center">
                            <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 sm:mb-3">
                              {t("paymentTitle")}
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-2">
                              {t("paymentDesc")}
                              <span className="font-medium text-foreground">
                                {" "}
                                {t("paymentDesc2")}
                              </span>
                            </p>
                          </div>

                          <div className="bg-muted/30 rounded-lg p-4 sm:p-6 border">
                            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 text-center">
                              {t("orderSummary")}
                            </h3>
                            <div className="bg-card rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 border">
                              <div className="flex justify-between items-center">
                                <span className="text-sm sm:text-base text-foreground font-medium">
                                  {t("publishCost")}
                                </span>
                                <span className="text-xl sm:text-2xl font-bold text-foreground">
                                  $2.990
                                </span>
                              </div>
                              <div className="border-t pt-2 sm:pt-3">
                                <div className="flex justify-between items-center text-primary">
                                  <span className="flex items-center gap-2 text-xs sm:text-sm">
                                    <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                                    {t("paymentProtection")}
                                  </span>
                                  <span className="font-semibold text-sm sm:text-base">{t("free")}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                              <CreditCard className="h-5 w-5 text-primary flex-shrink-0" />
                              <h3 className="text-base sm:text-lg font-medium text-foreground">
                                {t("choosePayment")}
                              </h3>
                            </div>

                            <div className="grid gap-2 sm:gap-3">
                              <button
                                type="button"
                                className="p-3 sm:p-4 border-2 border-primary bg-primary/5 rounded-lg flex items-center gap-3 sm:gap-4 transition-colors"
                              >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                  <div className="font-medium text-sm sm:text-base text-foreground">
                                    {t("paymentCard")}
                                  </div>
                                  <div className="text-xs sm:text-sm text-muted-foreground">
                                    {t("paymentCardDesc")}
                                  </div>
                                </div>
                                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" />
                                </div>
                              </button>

                              <button
                                type="button"
                                className="p-3 sm:p-4 border-2 border-border bg-card rounded-lg flex items-center gap-3 sm:gap-4 hover:border-primary/30 transition-colors"
                              >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-muted-foreground rounded text-background text-[10px] sm:text-xs font-bold flex items-center justify-center">
                                    T
                                  </div>
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                  <div className="font-medium text-sm sm:text-base text-foreground">
                                    {t("paymentTransfer")}
                                  </div>
                                  <div className="text-xs sm:text-sm text-muted-foreground">
                                    {t("paymentTransferDesc")}
                                  </div>
                                </div>
                              </button>
                            </div>
                          </div>

                          <div className="bg-secondary/20 rounded-lg p-4 sm:p-6 border border-secondary/30">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-foreground" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold text-base sm:text-lg text-foreground mb-2">
                                  {t("paymentProtected")}
                                </div>
                                <div className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                                  {t("paymentProtectedDesc")}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                                  {[
                                    { icon: Shield, label: t("paymentSecure") },
                                    {
                                      icon: Check,
                                      label: t("paymentRefund"),
                                    },
                                    { icon: Star, label: t("paymentSupport") },
                                  ].map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 text-secondary"
                                    >
                                      <item.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                      <span className="text-xs sm:text-sm font-medium">
                                        {item.label}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentStep === 1}
                          className="flex items-center justify-center gap-2 h-11 px-4 sm:px-6 order-2 sm:order-1 w-full sm:w-auto"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          {t("previous")}
                        </Button>

                        {currentStep < 3 ? (
                          <Button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center justify-center gap-2 h-11 px-4 sm:px-6 order-1 sm:order-2 w-full sm:w-auto"
                          >
                            {t("next")}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="flex items-center justify-center gap-2 h-11 px-4 sm:px-6 font-semibold order-1 sm:order-2 w-full sm:w-auto"
                          >
                            <span className="text-sm sm:text-base">
                              {isGuest
                                ? t("completeRegister")
                                : t("publishMyTask")}
                            </span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border p-12 text-center">
                <div className="mb-6 mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-semibold mb-4 text-foreground">
                  {t("successTitle")}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  {t("successDesc")}
                </p>
                <div className="mt-8 p-6 border rounded-lg bg-secondary/10 border-secondary/20">
                  <h3 className="text-xl font-semibold mb-6 text-foreground">
                    {t("nextSteps")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                      {
                        icon: FileText,
                        title: t("receiveProposals"),
                        desc: t("receiveProposalsDesc"),
                      },
                      {
                        icon: Monitor,
                        title: t("compareChat"),
                        desc: t("compareChatDesc"),
                      },
                      {
                        icon: Check,
                        title: t("chooseConfirm"),
                        desc: t("chooseConfirmDesc"),
                      },
                    ].map((step, index) => (
                      <div key={index} className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <step.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-medium text-foreground mb-2">
                          {step.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full max-w-md mx-auto h-12 text-base font-medium">
                    {t("viewActiveTasks")}
                  </Button>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {t("paymentProtectedNote")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
