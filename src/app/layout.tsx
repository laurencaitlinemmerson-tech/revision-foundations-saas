import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";
import "./premium-animations-vanilla.css";

export const metadata: Metadata = {
  title: {
    default: "Revision Foundations",
    template: "%s | Revision Foundations",
  },
  description: "Your nursing bestie for OSCEs & exams. Interactive OSCE practice, core nursing quizzes, and study resources for UK nursing students.",
  keywords: ["nursing", "OSCE", "nursing revision", "nursing student", "UK nursing", "exam prep", "nursing quiz"],
  authors: [{ name: "Lauren" }],
  creator: "Revision Foundations",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Revision Foundations",
    title: "Revision Foundations - Your Nursing Bestie",
    description: "Interactive OSCE practice, core nursing quizzes, and study resources for UK nursing students.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Revision Foundations",
    description: "Your nursing bestie for OSCEs & exams.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <SmoothScroll>{children}</SmoothScroll>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
