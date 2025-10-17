import { Navigation } from "@/components/layout/navigation";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { RootProvider as FumadocsRootProvider } from "fumadocs-ui/provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import { getGitHubStars, getRegistryItems } from "@/lib/utils";
import { Banner } from "@/components/banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Polkadot UI - Polkadot React Components",
  description:
    "Beautiful, accessible components for the Polkadot ecosystem. Type-safe, customizable, and built with modern React patterns.",
  metadataBase: new URL("https://polkadot-ui.com"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const registryItems = await getRegistryItems();
  const githubStars = await getGitHubStars(
    "Polkadot-UI-Initiative/polkadot-ui"
  );

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="scroll-smooth scroll-pt-12"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} antialiased`}
      >
        <FumadocsRootProvider>
          <ThemeProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navigation
                registryItems={registryItems}
                githubStars={githubStars}
              />

              <main className="flex-1">{children}</main>
              {/* <MouseFollower /> */}
            </div>
            <Toaster
              position="bottom-right"
              closeButton
              className="bg-background flex flex-row items-center gap-3"
            />
            <Banner
              buttonText="Report Issue on GitHub"
              buttonUrl="https://github.com/Polkadot-UI-Initiative/polkadot-ui/issues"
            />
          </ThemeProvider>
        </FumadocsRootProvider>
        <Analytics />
      </body>
    </html>
  );
}
