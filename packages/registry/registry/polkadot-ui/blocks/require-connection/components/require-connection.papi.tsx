"use client";

import { useMemo } from "react";
import {
  RequireConnectionBase,
  type RequireConnectionBaseProps,
} from "@/registry/polkadot-ui/blocks/require-connection/components/require-connection.base";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  ClientConnectionStatus,
  PolkadotProvider,
  usePapiClientStatus,
} from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { ChainId } from "@reactive-dot/core";

// Props type - removes services prop since we inject it
export type RequireConnectionProps = Omit<
  RequireConnectionBaseProps<ChainId>,
  "services"
>;

export function RequireConnection(props: RequireConnectionProps) {
  const defaultChainId = "paseo";
  const { status } = usePapiClientStatus(props.chainId || defaultChainId);

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

RequireConnectionWithProvider.displayName = "RequireConnectionWithProvider";
