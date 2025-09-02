import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedCodeBlock } from "../animated-code-block";
import { ArrowRight } from "lucide-react";

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
        <h1 className="text-center text-xl font-bold leading-tight tracking-tight md:text-6xl lg:leading-[1.1]">
          Ship <span className="text-gradient">nicer</span> Polkadot <br /> Apps{" "}
          <span className="text-gradient italic">faster</span>
        </h1>
        <span className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-lg">
          Polkadot UI react components deliver best UX for your apps. <br />
          Fully typesafe, customizable, open source.
          <br />
          Powered by{" "}
          <Link href="https://papi.how" className="underline text-foreground">
            papi
          </Link>{" "}
          and{" "}
          <Link href="https://dedot.dev" className="underline text-foreground">
            dedot
          </Link>
        </span>

        <div className="py-6">
          <AnimatedCodeBlock />
        </div>

        <div className="flex w-full flex-wrap gap-4 items-center justify-center py-4 md:pb-10">
          <Button asChild size="default">
            <Link href="/docs">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="#components">Browse Components ↓</Link>
          </Button>
          <Button variant="outline" disabled>
            Add MCP to cursor →{" "}
            <span className="text-xs text-muted-foreground bg-muted rounded-md px-2 py-1">
              soon
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
