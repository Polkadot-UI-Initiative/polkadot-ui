"use client";

import React from "react";
import Link from "next/link";

import { examples as papiExamples } from "../examples/papi";
import { examples as dedotExamples } from "../examples/dedot";
import { PolkadotProvider as PolkadotProviderPapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { PolkadotProvider as PolkadotProviderDedot } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { ComponentPreview } from "./component-preview";
import { PreviewBoundary } from "./preview-boundary";
// useState already imported above
class SectionErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    // Optional: report error
    if (process.env.NODE_ENV !== "production") console.error(error);
  }
  render() {
    if (this.state.error)
      return (
        <div className="mx-8 pt-32 min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center">
          <h3 className="text-xl font-semibold">
            Something went wrong rendering the examples
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            This can sometimes be caused by a corrupted local connection cache.
          </p>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="default"
              onClick={() => {
                try {
                  localStorage.removeItem("TYPINK::NETWORK_CONNECTIONS");
                } catch {}
                window.location.reload();
              }}
              className="inline-flex items-center rounded-md border border-input bg-secondary text-secondary-foreground hover:opacity-90 transition-colors px-4 py-2 text-sm font-medium"
            >
              Reset connection cache & reload
            </Button>
          </div>
        </div>
      );
    return this.props.children as React.ReactElement;
  }
}

import { LibrarySwitcher } from "./library-switcher";
import { Button } from "../ui/button";

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
    <SectionErrorBoundary>
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
    </SectionErrorBoundary>
  );
}
