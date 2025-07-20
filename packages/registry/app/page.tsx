import { HeroSection } from "@/components/layout/hero-section";
import { ComponentsSection } from "@/components/layout/components-section";

/**
 * Renders the home page layout with a hero section and a components showcase.
 *
 * Displays the main landing content by composing the `HeroSection` and `ComponentsSection` components within a vertically stacked layout.
 */
export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ComponentsSection />
    </div>
  );
}
