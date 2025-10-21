import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import Providers from "./providers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";
import generateMetadata from "@/lib/generate-metadata";

export const metadata = generateMetadata();

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <Providers>
            {children}
            <Toaster position="bottom-right" richColors />
            {env.NODE_ENV === "development" && <ReactQueryDevtools />}
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
