"use client";

import Link from "next/link";

import { examples as papiExamples } from "../examples/papi";
import { examples as dedotExamples } from "../examples/dedot";
import { PolkadotProvider as PolkadotProviderPapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { PolkadotProvider as PolkadotProviderDedot } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { ComponentPreview } from "./component-preview";
// import { LibrarySwitcher } from "./library-switcher";
// import { HooksTest as HooksTestPapi } from "../examples/papi/hooks-test";
// import { HooksTest as HooksTestDedot } from "../examples/dedot/hooks-test";

export function ComponentsSection({
  usedLibrary = "dedot",
}: {
  usedLibrary?: "papi" | "dedot";
}) {
  const examples = usedLibrary === "papi" ? papiExamples : dedotExamples;

  const ComponentExamples = examples.map((example) => {
    return <ComponentPreview key={example.code} componentInfo={example} />;
  });

  return (
    <section className="mx-8 space-y-6 pt-32" id="components">
      <h2 className="w-full text-center px-6 text-3xl font-semibold md:mb-4 md:text-5xl lg:mb-6 lg:px-10">
        Components Showcase
      </h2>
      {/* <LibrarySwitcher value={usedLibrary} /> */}
      {/* Examples grid */}
      <div className="w-full grid justify-center gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-fr">
        {usedLibrary === "papi" && (
          <PolkadotProviderPapi key={usedLibrary}>
            {/* <HooksTestPapi /> */}
            {ComponentExamples}
          </PolkadotProviderPapi>
        )}
        {usedLibrary === "dedot" && (
          <PolkadotProviderDedot key={usedLibrary}>
            {/* <HooksTestDedot /> */}
            {ComponentExamples}
          </PolkadotProviderDedot>
        )}
      </div>
      <div className="flex flex-col items-center justify-center col-span-full h-48">
        <h4 className="text-xl font-bold mb-2">What&apos;s missing here?</h4>
        <Link
          href="https://github.com/Polkadot-UI-Initiative/polkadot-ui"
          className="text-sm text-primary hover:underline"
        >
          Open an issue or PR on GitHub →
        </Link>
      </div>
    </section>
  );
}
