"use client";

import { useEffect, useState } from "react";
import { PolkadotProvider as ReactiveDotProvider } from "@/registry/polkadot-ui/providers/polkadot-provider.papi";

// Mount-gated provider: renders nothing on server, hydrates client-only
export function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <ReactiveDotProvider>{children}</ReactiveDotProvider>;
}
