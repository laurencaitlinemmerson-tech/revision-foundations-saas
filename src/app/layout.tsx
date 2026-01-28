import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";
import "./premium-animations-vanilla.css";

export const metadata: Metadata = {
  title: "Revision Foundations",
  description: "Your nursing bestie for OSCEs & exams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <SmoothScroll>{children}</SmoothScroll>
        </body>
      </html>
    </ClerkProvider>
  );
}
