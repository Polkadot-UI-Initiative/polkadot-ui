"use client";

import { PolkadotProvider as PolkadotProviderDedot } from "@/registry/polkadot-ui/providers/polkadot-provider.dedot";

// Mount-gated provider: renders nothing on server, hydrates client-only
export function Providers({ children }: { children: React.ReactNode }) {
  return <PolkadotProviderDedot>{children}</PolkadotProviderDedot>;
}
