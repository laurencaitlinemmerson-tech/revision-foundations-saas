import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScroll from "@/components/SmoothScroll";
import SkipToContent from "@/components/SkipToContent";
import JsonLd from "@/components/JsonLd";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/seo";
import "./globals.css";
import "./premium-animations-vanilla.css";

// Viewport configuration for better mobile support
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFBF5" },
    { media: "(prefers-color-scheme: dark)", color: "#322659" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://revisionfoundations.com"),
  title: {
    default: "Revision Foundations - Your Nursing Bestie for OSCEs & Exams",
    template: "%s | Revision Foundations",
  },
  description: "Your nursing bestie for OSCEs & exams. Interactive OSCE practice, core nursing quizzes, and study resources for UK nursing students. Pass your exams with confidence.",
  keywords: [
    "nursing",
    "OSCE",
    "nursing revision",
    "nursing student",
    "UK nursing",
    "exam prep",
    "nursing quiz",
    "nursing OSCE practice",
    "nursing exam preparation",
    "student nurse resources",
    "child nursing",
    "pediatric nursing",
  ],
  authors: [{ name: "Lauren" }],
  creator: "Revision Foundations",
  publisher: "Revision Foundations",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Revision Foundations",
    title: "Revision Foundations - Your Nursing Bestie",
    description: "Interactive OSCE practice, core nursing quizzes, and study resources for UK nursing students.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Revision Foundations - Nursing Study Resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Revision Foundations",
    description: "Your nursing bestie for OSCEs & exams.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification tokens here when available
    // google: 'your-google-verification-token',
  },
  alternates: {
    canonical: "/",
  },
  category: "education",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en-GB" dir="ltr">
        <head>
          {/* Preconnect to external resources */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          {/* DNS prefetch for third-party services */}
          <link rel="dns-prefetch" href="https://clerk.com" />
          <link rel="dns-prefetch" href="https://js.stripe.com" />
          
          {/* Structured data */}
          <JsonLd data={getOrganizationSchema()} />
          <JsonLd data={getWebsiteSchema()} />
        </head>
        <body className="antialiased">
          <SkipToContent />
          <SmoothScroll>{children}</SmoothScroll>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
