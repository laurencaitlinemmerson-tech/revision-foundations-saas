import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScroll from "@/components/SmoothScroll";
import SkipToContent from "@/components/SkipToContent";
import JsonLd from "@/components/JsonLd";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import AppProviders from "@/components/AppProviders";
import { getOrganizationSchema, getWebsiteSchema, siteUrl } from "@/lib/seo";
import "./globals.css";
import "./premium-animations-vanilla.css";

const clerkLocalization = {
  signIn: {
    start: {
      subtitle: "Welcome back to The Nurse Lab.",
      subtitleCombined: "Continue to The Nurse Lab.",
    },
    password: {
      subtitle: "Enter your password to continue to The Nurse Lab.",
    },
    passkey: {
      subtitle: "Use your passkey to continue to The Nurse Lab.",
    },
    emailCode: {
      subtitle: "Enter the code we sent to continue to The Nurse Lab.",
    },
    emailLink: {
      subtitle: "Use the link we emailed to continue to The Nurse Lab.",
      verified: {
        subtitle: "You are signing in to The Nurse Lab.",
      },
    },
    forgotPassword: {
      subtitle: "Reset your password for The Nurse Lab.",
      subtitle_email: "Reset your password for The Nurse Lab.",
      subtitle_phone: "Reset your password for The Nurse Lab.",
    },
  },
  signUp: {
    start: {
      subtitle: "Create your The Nurse Lab account.",
      subtitleCombined: "Create your The Nurse Lab account.",
    },
    continue: {
      subtitle: "Finish creating your The Nurse Lab account.",
    },
    emailCode: {
      subtitle: "Enter the code we sent to continue to The Nurse Lab.",
    },
    emailLink: {
      subtitle: "Use the link we emailed to continue to The Nurse Lab.",
      verifiedSwitchTab: {
        subtitle: "Continue to The Nurse Lab.",
        subtitleNewTab: "Continue to The Nurse Lab.",
      },
      clientMismatch: {
        subtitle: "Return to The Nurse Lab to continue.",
      },
    },
    phoneCode: {
      subtitle: "Enter the code we sent to continue to The Nurse Lab.",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#FFFBF5",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The calm revision system for UK nursing students",
    template: "%s | The Nurse Lab",
  },
  description:
    "Practise children's nursing OSCE stations, sharpen core nursing knowledge, and keep placement-ready guides in one calm study space.",
  keywords: [
    "nursing",
    "OSCE",
    "nursing revision",
    "nursing student",
    "UK nursing",
    "UK student nurse revision",
    "exam prep",
    "nursing quiz",
    "nursing OSCE practice",
    "nursing exam preparation",
    "student nurse resources",
    "children's nursing",
    "paediatric nursing",
    "drug calculations nursing",
    "nursing placement support",
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
    title: "The calm revision system for UK nursing students",
    description:
      "Structured OSCE practice, core nursing quizzes, and placement-ready guides for UK student nurses, with children's nursing live now.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Nurse Lab for UK nursing revision, OSCE practice, and placement support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The calm revision system for UK nursing students",
    description:
      "Structured OSCE practice, quizzes, and placement-ready guides for UK student nurses.",
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
        <meta name="color-scheme" content="light" />
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
        <ClerkProvider
          localization={clerkLocalization}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        >
          <AppProviders>
            <JsonLd data={getOrganizationSchema()} />
            <JsonLd data={getWebsiteSchema()} />
            <SkipToContent />
            <SmoothScroll>{children}</SmoothScroll>
            <PWAInstallPrompt />
          </AppProviders>
        </ClerkProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
