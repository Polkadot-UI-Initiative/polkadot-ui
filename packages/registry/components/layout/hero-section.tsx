import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedCodeBlock } from "../animated-code-block";

export function HeroSection() {
  return (
    <section className="container relative">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <Link href="/blocks/block-number">
          <Button variant="outline" size="sm">
            🎉
            <span className="ml-2">New Block Number Component</span>
            <svg
              width="12"
              height="12"
              className="ml-2"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.78141 5.33312L5.20641 1.75812L6.14641 0.818115L11.3281 5.99979L6.14641 11.1815L5.20641 10.2415L8.78141 6.66645H0.671405V5.33312H8.78141Z"
                fill="currentColor"
              />
            </svg>
          </Button>
        </Link>
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          Build your App with Polkadot Components
        </h1>
        <span className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          A set of beautifully-designed, accessible components for the Polkadot
          ecosystem. Type-safe, customizable, and built with modern React
          patterns. Open Source.
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
        </div>
      </div>
    </section>
  );
}
