"use client";

import Link from "next/link";

import { examples as papiExamples } from "../examples/papi";
import { examples as dedotExamples } from "../examples/dedot";
import { PolkadotProvider as PolkadotProviderPapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { PolkadotProvider as PolkadotProviderDedot } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { ComponentPreview } from "./component-preview";

export function ComponentsSection({
  usedLibrary = "dedot",
}: {
  usedLibrary?: "papi" | "dedot";
}) {
  const examples = usedLibrary === "papi" ? papiExamples : dedotExamples;

  const ComponentExamples = examples.map((example) => {
    return <ComponentPreview key={example.name} componentInfo={example} />;
  });

  return (
    <section className="mx-8 space-y-6 py-8 md:py-8 lg:py-12" id="components">
      {/* Examples grid */}
      <div className="w-full grid justify-center gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-fr">
        {usedLibrary === "papi" && (
          <PolkadotProviderPapi>{ComponentExamples}</PolkadotProviderPapi>
        )}
        {usedLibrary === "dedot" && (
          <PolkadotProviderDedot>{ComponentExamples}</PolkadotProviderDedot>
        )}
        <div className="flex flex-col items-center justify-center col-span-full h-48">
          <span className="text-lg font-bold">What&apos;s missing here?</span>
          <Link
            href="https://github.com/Polkadot-UI-Initiative/polkadot-ui"
            className="text-xs text-primary hover:underline"
          >
            Open an issue or PR on GitHub →
          </Link>
        </div>
      </div>
    </section>
  );
}
