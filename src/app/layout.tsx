import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
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
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
