"use client";

import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { supportedChains } from "@/registry/dot-ui/lib/config.dedot";
import { polkadot } from "typink";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PolkadotProvider availableChains={[...supportedChains, polkadot]}>
      {children}
    </PolkadotProvider>
  );
}
