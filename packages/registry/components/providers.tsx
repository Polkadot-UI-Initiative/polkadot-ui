"use client";

import { PolkadotProvider as PapiProvider } from "@/registry/polkadot-ui/providers/polkadot-provider.papi";
import { PolkadotProvider as ReactiveProvider } from "@/registry/polkadot-ui/providers/polkadot-provider.reactive-dot";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactiveProvider>
      <PapiProvider>{children}</PapiProvider>
    </ReactiveProvider>
  );
}
