"use client";

import { PolkadotProvider } from "@/registry/dot-ui/providers/papi-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <PolkadotProvider>{children}</PolkadotProvider>;
}
