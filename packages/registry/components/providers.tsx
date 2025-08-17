"use client";

import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { dedotSupportedNetworks } from "@/registry/dot-ui/lib/config.dedot";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PolkadotProvider availableChains={[...dedotSupportedNetworks]}>
      {children}
    </PolkadotProvider>
  );
}
