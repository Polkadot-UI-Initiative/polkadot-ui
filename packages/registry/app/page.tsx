import { HeroSection } from "@/components/layout/hero-section";
import { ComponentsSection } from "@/components/layout/components-section";
import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <PolkadotProvider>
        <ComponentsSection />
      </PolkadotProvider>
    </div>
  );
}
