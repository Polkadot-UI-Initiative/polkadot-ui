import { Blocks, BookOpen, Palette, Zap } from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: "feature-1",
    title: "Web 3 components",
    description:
      "Production‑ready react components for Polkadot apps. Type‑safe, accessible, and Tailwind‑powered.",
    icon: <Blocks className="size-10" strokeWidth={1} />,
  },
  {
    id: "feature-2",
    title: "Registry & CLI",
    description: (
      <span>
        Install from the hosted registry with a single command
        <code> pnpm dlx polkadot-ui add &lt;component&gt;.</code>
      </span>
    ),
    icon: <BookOpen className="size-10" strokeWidth={1} />,
  },
  {
    id: "feature-3",
    title: "Fully customizable",
    description:
      "Make the components fit your design system. Works with Tailwind v4. Built with shadcn/ui.",
    icon: <Palette className="size-10" strokeWidth={1} />,
  },
  {
    id: "feature-4",
    title: "Performance & DX",
    description: (
      <>
        Works with your existing{" "}
        <Link href="https://reactive-dot.dev" className="underline">
          reactive-dot
        </Link>{" "}
        and{" "}
        <Link href="https://docs.dedot.dev/typink/" className="underline">
          Typink
        </Link>{" "}
        Apps. Optimized for Next.js App Router and RSC. typed hooks (PAPI &
        Dedot)
      </>
    ),
    icon: <Zap className="size-10" strokeWidth={1} />,
  },
];

export function FeaturesSection() {
  return (
    <section className="relative pt-12">
      <div className="relative z-10 flex flex-col space-y-14">
        <h2 className="w-full text-center px-6 text-3xl font-semibold md:mb-4 md:text-5xl lg:mb-6 lg:px-10">
          Polkadot UI Features
        </h2>
        <div className="relative mt-6 md:mt-10">
          <div className="bg-border absolute left-0 right-0 top-0 h-px" />
          <div className="divide-border grid md:grid-cols-4 md:divide-x">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="relative px-6 pb-20 md:pb-10 lg:px-10"
              >
                <div className="bg-border absolute left-0 right-0 top-0 h-px md:hidden" />
                <div className="bg-background relative -mt-6 mb-10 flex aspect-square w-12 items-center justify-center md:-mt-10 md:mb-10 md:w-20">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="mb-3 max-w-[16rem] text-lg font-semibold md:mb-4 md:text-2xl lg:mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-border absolute bottom-0 left-0 right-0 h-px" />
        </div>
      </div>
      {/* <div className="container absolute inset-0 hidden h-full md:block">
        <div className="relative h-full">
          <div className="bg-border absolute inset-y-0 left-0 h-full w-px"></div>
          <div className="bg-border absolute inset-y-0 right-0 h-full w-px"></div>
        </div>
      </div> */}
    </section>
  );
}
