"use client";

import type React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Upload,
  Eye,
  EyeOff,
  User,
  UserCheck,
  FileCheck,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GoogleIcon } from "@/components/icons/google-icon";
import { AppleIcon } from "@/components/icons/apple-icon";
import { authClient } from "@/lib/auth-client";

const { signUp } = authClient;

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { useSession } = authClient;
  const { data: session, isPending } = useSession();

  // Get redirect URL from query params or default to /browse-services
  const redirectTo = searchParams.get("redirect") || "/browse-services";

  // Form data state
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    type: "usuario",
    profilePhoto: null as File | null,
    idFront: null as File | null,
    idBack: null as File | null,
    backgroundCheck: null as File | null,
  });

  // UI state
  const [currentTab, setCurrentTab] = useState("basic");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);

  // Si hay sesión, no mostrar nada (se está redirigiendo)
  if (session?.user) {
    return null;
  }

  // Loading state while checking session
  if (isPending) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">
              Verificando sesión...
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateTab = (tab: string) => {
    console.log(`🔍 [REGISTER] Validating tab: ${tab}`);
    const newErrors: Record<string, string> = {};

    if (tab === "basic") {
      if (!formData.email.trim()) {
        newErrors.email = "El correo electrónico es requerido";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "El correo electrónico no es válido";
      }

      if (!formData.password) {
        newErrors.password = "La contraseña es requerida";
      } else if (formData.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    if (tab === "contact") {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "El nombre es requerido";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "El apellido es requerido";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "El teléfono es requerido";
      }

      if (!formData.address.trim()) {
        newErrors.address = "La dirección es requerida";
      }

      if (!formData.city.trim()) {
        newErrors.city = "La ciudad es requerida";
      }
    }

    if (tab === "verification") {
      if (!acceptTerms) {
        newErrors.terms = "Debes aceptar los términos y condiciones";
      }
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;

    if (isValid && !completedTabs.includes(tab)) {
      setCompletedTabs((prev) => [...prev, tab]);
    }

    return isValid;
  };

  const handleTabChange = (newTab: string) => {
    // Validate current tab before switching
    if (validateTab(currentTab)) {
      setCurrentTab(newTab);
    }
  };

  const handleSocialRegister = async (provider: "google" | "apple") => {
    console.log(`🔗 [REGISTER] Starting social register with ${provider}`);
    try {
      setIsLoading(true);
      // TODO: Implementar social register con better-auth
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(redirectTo);
    } catch (error) {
      console.error(
        `❌ [REGISTER] Social register error with ${provider}:`,
        error,
      );
      setErrors({ general: "Error al registrarse con " + provider });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 [REGISTER] Form submitted");

    if (!validateTab("verification")) {
      console.log("❌ [REGISTER] Validation failed for verification tab");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      console.log("🔄 [REGISTER] Calling signUp.email...");
      const result = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: fullName,
        type: formData.type,
        profession: "General", // Valor por defecto
        avatar: "",
      });

      console.log("📨 [REGISTER] SignUp response:", result);

      if (result.error) {
        console.error("❌ [REGISTER] Sign up error:", result.error);
        setErrors({
          general:
            "Error al crear la cuenta. Es posible que el email ya esté en uso.",
        });
      } else {
        console.log("✅ [REGISTER] Registration successful!");
        router.push(redirectTo);
      }
    } catch (error) {
      console.error(
        "💥 [REGISTER] Unexpected error during registration:",
        error,
      );
      setErrors({
        general: "Error al crear la cuenta. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="container max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("register.title")}</h1>
          <p className="text-muted-foreground">{t("register.subtitle")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Crear cuenta</CardTitle>
            <CardDescription className="text-center">
              Complete los siguientes pasos para crear su cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={currentTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 h-auto p-1 gap-2">
                <TabsTrigger
                  value="basic"
                  className={cn(
                    "flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs relative",
                    completedTabs.includes("basic") &&
                      "bg-blue-100 border-blue-300 text-blue-700",
                  )}
                >
                  <User className="h-4 w-4" />
                  <span>Básica</span>
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className={cn(
                    "flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs relative",
                    completedTabs.includes("contact") &&
                      "bg-blue-100 border-blue-300 text-blue-700",
                  )}
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Contacto</span>
                </TabsTrigger>
                <TabsTrigger
                  value="verification"
                  className={cn(
                    "flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs relative",
                    completedTabs.includes("verification") &&
                      "bg-blue-100 border-blue-300 text-blue-700",
                  )}
                >
                  <FileCheck className="h-4 w-4" />
                  <span>Verificación</span>
                </TabsTrigger>
              </TabsList>

              {/* General Error */}
              {errors.general && (
                <div className="mt-6 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {errors.general}
                </div>
              )}

              {/* Tab Content: Basic Information */}
              <TabsContent value="basic" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("form.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("register.emailPlaceholder")}
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={isLoading}
                      className={cn(errors.email && "border-destructive")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t("form.password")}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        disabled={isLoading}
                        className={cn(
                          "pr-10",
                          errors.password && "border-destructive",
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      {t("form.confirmPassword")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        disabled={isLoading}
                        className={cn(
                          "pr-10",
                          errors.confirmPassword && "border-destructive",
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {t("register.orSignUpWithSocial")}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => handleSocialRegister("google")}
                    disabled={isLoading}
                  >
                    <GoogleIcon className="h-5 w-5" />
                    {t("register.continueWithGoogle")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => handleSocialRegister("apple")}
                    disabled={isLoading}
                  >
                    <AppleIcon className="h-5 w-5" />
                    {t("register.continueWithApple")}
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleTabChange("contact")}
                    disabled={isLoading}
                  >
                    {t("button.continue")}
                  </Button>
                </div>
              </TabsContent>

              {/* Tab Content: Contact Information */}
              <TabsContent value="contact" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("register.firstName")}</Label>
                    <Input
                      id="firstName"
                      placeholder={t("register.firstNamePlaceholder")}
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      disabled={isLoading}
                      className={cn(errors.firstName && "border-destructive")}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("register.lastName")}</Label>
                    <Input
                      id="lastName"
                      placeholder={t("register.lastNamePlaceholder")}
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      disabled={isLoading}
                      className={cn(errors.lastName && "border-destructive")}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t("form.phone")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t("register.phonePlaceholder")}
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={isLoading}
                    className={cn(errors.phone && "border-destructive")}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{t("form.address")}</Label>
                  <Input
                    id="address"
                    placeholder={t("register.addressPlaceholder")}
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    disabled={isLoading}
                    className={cn(errors.address && "border-destructive")}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">{t("register.city")}</Label>
                  <Input
                    id="city"
                    placeholder={t("register.cityPlaceholder")}
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    disabled={isLoading}
                    className={cn(errors.city && "border-destructive")}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive">{errors.city}</p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentTab("basic")}
                    disabled={isLoading}
                  >
                    {t("button.back")}
                  </Button>
                  <Button
                    onClick={() => handleTabChange("verification")}
                    disabled={isLoading}
                  >
                    {t("button.continue")}
                  </Button>
                </div>
              </TabsContent>

              {/* Tab Content: Verification */}
              <TabsContent value="verification" className="mt-6 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) =>
                        setAcceptTerms(checked as boolean)
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor="terms" className="text-sm leading-5">
                      Acepto los{" "}
                      <Link
                        href="/terms"
                        className="text-primary hover:underline"
                      >
                        términos y condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
                        política de privacidad
                      </Link>
                    </Label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-destructive">{errors.terms}</p>
                  )}

                  {/* Optional File Uploads */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Documentos (opcional)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Puedes subir estos documentos ahora o completar tu perfil
                      más tarde.
                    </p>

                    {/* Profile Photo */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">
                        {t("form.profile")}
                      </Label>
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-20 h-20 border-2 border-dashed border-muted rounded-full flex items-center justify-center bg-muted/10">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isLoading}
                        >
                          {t("register.uploadPhoto")}
                        </Button>
                      </div>
                    </div>

                    {/* Documents in grid */}
                    <div className="space-y-4">
                      {/* ID Front */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          {t("register.idFront")}
                        </Label>
                        <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center bg-muted/10">
                          <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            Arrastra o haz clic
                          </p>
                        </div>
                      </div>

                      {/* ID Back */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          {t("register.idBack")}
                        </Label>
                        <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center bg-muted/10">
                          <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            Arrastra o haz clic
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Background Check */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        {t("form.criminal")}
                      </Label>
                      <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center bg-muted/10">
                        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          Certificado de antecedentes
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Arrastra o haz clic para subir
                        </p>
                      </div>
                      <Alert>
                        <AlertDescription>
                          <Link
                            href="https://www.chileatiende.gob.cl/fichas/3442-certificado-de-antecedentes"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-primary hover:underline"
                          >
                            {t("register.getCertificateLink")}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab("contact")}
                      disabled={isLoading}
                    >
                      {t("button.back")}
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creando cuenta...
                        </>
                      ) : (
                        t("register.createAccount")
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {t("register.alreadyHaveAccount")}{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                {t("button.login")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
