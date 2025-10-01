import { ComponentsSection } from "@/components/layout/components-section";
import { HeroSection } from "@/components/layout/hero-section";
import { FeaturesSection } from "@/components/layout/features-section";

export default async function ComponentsPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <ComponentsSection usedLibrary={"dedot"} />
    </div>
  );
}
