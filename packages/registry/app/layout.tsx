import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/navigation";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { RootProvider as FumadocsRootProvider } from "fumadocs-ui/provider";
import { PolkadotLogo } from "@/components/polkadot-logo";
import { Toaster } from "@/components/ui/sonner";
import { FeedbackToast } from "@/components/feedback-toast";
import { Providers } from "@/components/providers";

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
    <html
      lang="en"
      suppressHydrationWarning
      className="scroll-smooth scroll-pt-12"
    >
      <body className={`${geistSans.variable} antialiased`}>
        <FumadocsRootProvider>
          <ThemeProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navigation />
              <Providers>
                <main className="flex-1">{children}</main>
              </Providers>
              <footer className="flex justify-center items-center mt-12 mb-4 p-4">
                <PolkadotLogo withPoweredBy />
              </footer>
              {/* <MouseFollower /> */}
            </div>
            <Toaster
              position="bottom-right"
              closeButton
              // className="bg-background flex flex-row items-center gap-3"
            />
            <FeedbackToast />
          </ThemeProvider>
        </FumadocsRootProvider>
        <Analytics />
      </body>
    </html>
  );
}
