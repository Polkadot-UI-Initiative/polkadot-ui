import { Blocks, Zap } from "lucide-react";
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
        Install from the hosted registry with a single command:
        <br />
        <code className="p-1 rounded-md text-sm">
          pnpm dlx polkadot-ui add &lt;component&gt;
        </code>
      </span>
    ),
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        className="size-10"
      >
        <rect width="256" height="256" fill="none"></rect>
        <line
          x1="208"
          y1="128"
          x2="128"
          y2="208"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
        ></line>
        <line
          x1="192"
          y1="40"
          x2="40"
          y2="192"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
        ></line>
      </svg>
    ),
  },
  {
    id: "feature-3",
    title: "Fully customizable",
    description:
      "Make the components fit your design system with Tailwind v4. Own the code change anything!",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 54 33"
        className="size-10"
      >
        <g clipPath="url(#prefix__clip0)">
          <path
            fill="#38bdf8"
            fillRule="evenodd"
            d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
            clipRule="evenodd"
          />
        </g>
        <defs>
          <clipPath id="prefix__clip0">
            <path fill="#fff" d="M0 0h54v32.4H0z" />
          </clipPath>
        </defs>
      </svg>
    ),
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
    <section className="relative pt-12 mx-8">
      <div className="relative z-10 flex flex-col space-y-14">
        <h2 className="w-full text-center px-6 text-3xl font-semibold md:text-5xl lg:px-10 mb-2">
          Polkadot UI Features
        </h2>
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="group relative p-6 pb-20 md:pb-10 lg:px-10 mt-10 hover:shadow-lg rounded-lg transition-all duration-300 border hover:border-primary/20 hover:translate-y-[-5px]"
              >
                <div className="mb-4">{feature.icon}</div>
                <div>
                  <h3 className="mb-3 max-w-[16rem] text-lg font-semibold md:mb-4 md:text-2xl lg:mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
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
