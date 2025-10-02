"use client";

import Link from "next/link";

import { examples as papiExamples } from "../examples/papi";
import { examples as dedotExamples } from "../examples/dedot";
import { PolkadotProvider as PolkadotProviderPapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { PolkadotProvider as PolkadotProviderDedot } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { ComponentPreview } from "./component-preview";
import { useState } from "react";

function PreviewBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);
  if (error)
    return (
      <div className="border border-destructive/40 bg-destructive/10 text-destructive rounded-md p-3 text-sm">
        Failed to render preview: {error.message}
      </div>
    );
  return <ErrorCatcher onError={setError}>{children}</ErrorCatcher>;
}

function ErrorCatcher({
  children,
  onError,
}: {
  children: React.ReactNode;
  onError: (e: Error) => void;
}) {
  try {
    return <>{children}</>;
  } catch (e) {
    onError(e as Error);
    return null;
  }
}
import { LibrarySwitcher } from "./library-switcher";

export function ComponentsSection({
  usedLibrary = "dedot",
}: {
  usedLibrary?: "papi" | "dedot";
}) {
  const examples = usedLibrary === "papi" ? papiExamples : dedotExamples;

  const ComponentExamples = examples.map((example) => (
    <PreviewBoundary key={example.code}>
      <ComponentPreview componentInfo={example} />
    </PreviewBoundary>
  ));

  return (
    <section className="mx-8 space-y-6 pt-32" id="components">
      <h2 className="w-full text-center px-6 text-3xl font-semibold md:text-5xl lg:px-10 mb-12">
        Components Showcase
      </h2>
      <LibrarySwitcher value={usedLibrary} />
      {/* Examples grid */}
      <div className="w-full grid justify-center gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-fr">
        {usedLibrary === "papi" && (
          <PolkadotProviderPapi key={usedLibrary}>
            {ComponentExamples}
          </PolkadotProviderPapi>
        )}
        {usedLibrary === "dedot" && (
          <PolkadotProviderDedot key={usedLibrary}>
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
