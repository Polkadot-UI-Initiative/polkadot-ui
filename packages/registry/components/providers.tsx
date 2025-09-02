"use client";

import { PolkadotProvider } from "@/registry/polkadot-ui/providers/dedot-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <PolkadotProvider>{children}</PolkadotProvider>;
}
