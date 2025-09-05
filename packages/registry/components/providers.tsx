"use client";

import dynamic from "next/dynamic";
import { PolkadotProvider as ReactiveDotProvider } from "@/registry/polkadot-ui/providers/polkadot-provider.papi";

// Dynamically import the provider to prevent SSR issues
const DynamicPolkadotProvider = dynamic(
  () => 
    import("@/registry/polkadot-ui/providers/polkadot-provider.papi").then(
      (mod) => ({ default: mod.PolkadotProvider })
    ),
  {
    ssr: false, // Disable server-side rendering for this component
    loading: () => <div>Loading blockchain connection...</div>,
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return <DynamicPolkadotProvider>{children}</DynamicPolkadotProvider>;
}
