import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import AutoAnimate from "@/components/AutoAnimate";
import "./globals.css";
import "./premium-animations-vanilla.css";

export const metadata: Metadata = {
  title: "Revision Foundations | OSCE & Exam-Ready Nursing Revision",
  description:
    "Your nursing bestie for OSCEs & exams. Know what to revise, how to revise, and feel confident walking into placements and assessments.",
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
          <AutoAnimate />

          <div className="rf-bg">
            <div className="rf-blob rf-blob-1" />
            <div className="rf-blob rf-blob-2" />
            <div className="rf-blob rf-blob-3" />

            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
