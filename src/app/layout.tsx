import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScroll from "@/components/SmoothScroll";
import SkipToContent from "@/components/SkipToContent";
import JsonLd from "@/components/JsonLd";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/seo";
import "./globals.css";
import "./premium-animations-vanilla.css";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://nurselab.co.uk"
  ),
  title: {
    default: "The Nurse Lab | Nursing revision for OSCEs, exams, and placement",
    template: "%s | The Nurse Lab",
  },
  description:
    "Study tools, OSCE practice, quizzes, and revision resources that help student nurses pass exams, build confidence, and thrive on placement.",
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
  creator: "The Nurse Lab",
  publisher: "The Nurse Lab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "The Nurse Lab",
    title: "The Nurse Lab | Nursing revision that helps you pass",
    description:
      "Study tools, OSCE practice, quizzes, and revision resources for student nurses who want to pass exams and thrive on placement.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Nurse Lab nursing study resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Nurse Lab",
    description: "Nursing revision for OSCEs, exams, and placement confidence.",
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
    // google: "your-google-verification-token",
  },
  alternates: {
    canonical: "/",
  },
  category: "education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" dir="ltr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (
                    theme === 'dark' ||
                    (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
                  ) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://clerk.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
      </head>
      <body className="antialiased">
        <ClerkProvider>
          <ThemeProvider>
            <JsonLd data={getOrganizationSchema()} />
            <JsonLd data={getWebsiteSchema()} />
            <SkipToContent />
            <SmoothScroll>{children}</SmoothScroll>
            <PWAInstallPrompt />
          </ThemeProvider>
        </ClerkProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
