import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedCodeBlock } from "../animated-code-block";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

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
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tight md:text-6xl lg:leading-[1.1]">
          Ship <span className="text-gradient">better</span> Polkadot <br />{" "}
          Apps <span className="text-gradient italic">faster</span>
        </h1>
        <span className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-lg my-8">
          Deliver great UX with ready-made, typesafe Polkadot components. Fully
          customizable. Fully open source. Powered by{" "}
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
          <Button variant="outline" asChild>
            <Link href="https://cursor.com/en/install-mcp?name=polkadot-ui&config=eyJ1cmwiOiJodHRwczovL3BvbGthZG90LXVpLmNvbS9hcGkvbWNwIn0%3D">
              <Image
                src="cursor.svg"
                alt="Add polkadot-ui MCP server to Cursor"
                height={24}
                width={24}
              />
              Add MCP to Cursor →{" "}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
