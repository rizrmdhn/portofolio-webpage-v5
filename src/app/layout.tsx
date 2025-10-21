import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";
import generateMetadata from "@/lib/generate-metadata";
import { TRPCReactProvider } from "@/trpc/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Providers from "./providers";

export const metadata = generateMetadata();

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
	sheet,
}: Readonly<{ children: React.ReactNode; sheet: React.ReactNode }>) {
	return (
		<html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
			<body>
				<TRPCReactProvider>
					<Providers>
						{children}
						{sheet}
						<Toaster position="bottom-right" richColors />
						{env.NODE_ENV === "development" && <ReactQueryDevtools />}
						<div id="sheet-root" />
					</Providers>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
