"use client";

import { PolkadotProvider as PolkadotProviderPapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";

// Mount-gated provider: renders nothing on server, hydrates client-only
export function Providers({ children }: { children: React.ReactNode }) {
  return <PolkadotProviderPapi>{children}</PolkadotProviderPapi>;
}
