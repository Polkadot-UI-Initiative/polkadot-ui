import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedCodeBlock } from "../animated-code-block";
import { ArrowRight } from "lucide-react";
import { CursorDeepLinkButton } from "./cursor-deep-link-button";

export function HeroSection() {
  return (
    <section className="container relative">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <Button variant="outline" size="sm" className="group">
          <Link href="/components" className="flex items-center gap-2">
            🎉
            <span>New Components</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
        <h1 className="text-center text-xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          Build your App with Web3 Components
        </h1>
        <span className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-lg">
          A set of beautifully-designed, accessible components for the Polkadot
          and EVM ecosystem. Type-safe, customizable, and built with modern
          React patterns. Open Source.
        </span>

        <div className="py-6">
          <AnimatedCodeBlock />
        </div>

        <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
          <Button asChild size="default">
            <Link href="/docs">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/components">Browse Components</Link>
          </Button>
          <CursorDeepLinkButton />
        </div>
      </div>
    </section>
  );
}
