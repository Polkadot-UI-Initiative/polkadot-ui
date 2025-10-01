import { HeroSection } from "@/components/layout/hero-section";
import { ComponentsSection } from "@/components/layout/components-section";
import type { Metadata } from "next";
import { FeaturesSection } from "@/components/layout/features-section";

export const metadata: Metadata = {
  title: "Polkadot UI - UX first Web3 React Components with MCP",
  description:
    "Beautiful, accessible components for the Polkadot ecosystem. Type-safe, customizable, and built with modern React patterns.",
};

export default async function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <ComponentsSection usedLibrary={"papi"} />
    </div>
  );
}
