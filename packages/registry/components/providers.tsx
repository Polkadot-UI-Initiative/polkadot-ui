"use client";

import { PolkadotProvider as ReactiveDotProvider } from "@/registry/polkadot-ui/providers/polkadot-provider.papi";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ReactiveDotProvider>{children}</ReactiveDotProvider>;
}
