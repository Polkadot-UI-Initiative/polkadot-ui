import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PolkadotProvider } from "@/registry/dot-ui/providers/papi-provider";
import { Navigation } from "@/components/layout/navigation";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { MouseFollower } from "@/components/mouse-follower";
import { RootProvider as FumadocsRootProvider } from "fumadocs-ui/provider";
import { PolkadotLogo } from "@/components/polkadot-logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dot-ui - Polkadot UI Components",
  description:
    "Beautiful, accessible components for the Polkadot ecosystem. Type-safe, customizable, and built with modern React patterns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FumadocsRootProvider>
          <ThemeProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navigation />
              <PolkadotProvider>
                <main className="flex-1">{children}</main>
              </PolkadotProvider>
              <footer className="flex justify-center items-center mt-12 mb-4 p-4">
                <PolkadotLogo withPoweredBy />
              </footer>
              <MouseFollower />
            </div>
          </ThemeProvider>
        </FumadocsRootProvider>
        <Analytics />
      </body>
    </html>
  );
}
