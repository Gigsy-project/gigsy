import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "GigSy - Connect for Help",
  description: "Connect with someone who can help or start earning by helping others. Fast, secure, efficient.",
  keywords: "GigSy, help, services, connect, earn",
}

// Root layout - proxy.ts will handle locale routing and redirect to [locale]
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
