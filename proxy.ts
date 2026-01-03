import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Get the response from the intl middleware first
  const intlResponse = intlMiddleware(request) || NextResponse.next();

  // Add CORS headers
  intlResponse.headers.set("Access-Control-Allow-Origin", "*");
  intlResponse.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  intlResponse.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  intlResponse.headers.set("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: intlResponse.headers,
    });
  }

  // Check for session token
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;
  const pathname = request.nextUrl.pathname;

  // If user is authenticated and trying to access home page, redirect to browse-services
  if (sessionToken && (pathname === "/" || pathname.match(/^\/[a-z]{2}$/))) {
    try {
      // Verify the session using Better Auth endpoint
      const response = await fetch(
        `${request.nextUrl.origin}/api/auth/get-session`,
        {
          method: "GET",
          headers: {
            Cookie: request.headers.get("cookie") || "",
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const sessionData = await response.json();

        if (sessionData && sessionData.user) {
          // User is authenticated and trying to access home, redirect to browse-services
          const browseUrl = new URL("/browse-services", request.url);
          return NextResponse.redirect(browseUrl);
        }
      }
    } catch (error) {
      // If session verification fails, continue normally
      console.error("Session verification failed:", error);
    }
  }

  // Routes that require authentication (protected routes)
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/messages",
    "/wallet",
    "/calendar",
  ];
  // Check if the current path (removing locale prefix) is protected
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathWithoutLocale.startsWith(route) || pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the session for protected routes
    try {
      const response = await fetch(
        `${request.nextUrl.origin}/api/auth/get-session`,
        {
          method: "GET",
          headers: {
            Cookie: request.headers.get("cookie") || "",
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      const sessionData = await response.json();

      if (!sessionData || !sessionData.user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlResponse;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
