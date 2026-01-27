import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Revision Foundations | Premium Nursing Study Tools",
  description: "Master your nursing knowledge with premium OSCE and quiz tools designed for nursing students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          {/* Fixed gradient background */}
          <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#c4b5fd] via-[#f9a8d4] to-[#fde68a]" />

          {/* Texture overlay */}
          <div className="texture-overlay" />

          {/* Animated blobs */}
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />

          {/* Main content */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
