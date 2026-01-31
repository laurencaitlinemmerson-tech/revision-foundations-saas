"use client";
import { ClerkProvider, ClerkProviderProps } from "@clerk/nextjs";
import { ReactNode } from "react";

interface ClerkClientProviderProps extends ClerkProviderProps {
  children: ReactNode;
}

export default function ClerkClientProvider({ children, ...props }: ClerkClientProviderProps) {
  return (
    <ClerkProvider afterSignInUrl="/success" {...props}>
      {children}
    </ClerkProvider>
  );
}
