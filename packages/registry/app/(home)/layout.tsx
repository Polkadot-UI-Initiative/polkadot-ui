import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "polkadot-ui - Polkadot React Components",
  description:
    "Beautiful, accessible components for the Polkadot ecosystem. Type-safe, customizable, and built with modern React patterns.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <>{children}</>
      <Footer />
    </>
  );
}
