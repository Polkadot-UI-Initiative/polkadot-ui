"use client";

import { useMemo } from "react";
import {
  RequireConnectionBase,
  type RequireConnectionBaseProps,
} from "@/registry/dot-ui/blocks/require-connection/components/require-connection.base";
import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { ClientOnly } from "@/registry/dot-ui/blocks/client-only";
import { ClientConnectionStatus, usePolkadotClient } from "typink";

// Props type - removes services prop since we inject it
export type RequireConnectionProps = Omit<
  RequireConnectionBaseProps,
  "services"
>;

export function RequireConnection(props: RequireConnectionProps) {
  const { status } = usePolkadotClient(props.chainId);

  const services = useMemo(
    () => ({
      isLoading: status === ClientConnectionStatus.Connecting,
      isConnected: status === ClientConnectionStatus.Connected,
    }),
    [status]
  );

  return (
    <ClientOnly fallback={props.loadingFallback ?? props.fallback ?? null}>
      <RequireConnectionBase {...props} services={services} />
    </ClientOnly>
  );
}

// Wrapped version with provider for drop-in usage
export function RequireConnectionWithProvider(props: RequireConnectionProps) {
  return (
    <PolkadotProvider>
      <RequireConnection {...props} />
    </PolkadotProvider>
  );
}
