import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WalletProvider from "@/registry/polkadot-ui/providers/wallet-provider";
import ApiProvider from "@/registry/polkadot-ui/providers/api-provider";
import { Navigation } from "@/components/layout/navigation";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { MouseFollower } from "@/components/mouse-follower";

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
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <WalletProvider appName="Dot UI">
              <ApiProvider>
                <MouseFollower />
                <main className="flex-1">{children}</main>
              </ApiProvider>
            </WalletProvider>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}