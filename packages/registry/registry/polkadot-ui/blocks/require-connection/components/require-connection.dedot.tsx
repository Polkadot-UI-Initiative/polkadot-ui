"use client";

import {
  RequireConnectionBase,
  type RequireConnectionBaseProps,
} from "@/registry/polkadot-ui/blocks/require-connection/components/require-connection.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import { ClientConnectionStatus, usePolkadotClient } from "typink";
import { Suspense } from "react";

// Props type - removes services prop since we inject it
export type RequireConnectionProps = Omit<
  RequireConnectionBaseProps,
  "services"
>;

export function RequireConnection(props: RequireConnectionProps) {
  const { status } = usePolkadotClient(props.chainId);

  const isLoading = status === ClientConnectionStatus.Connecting;
  const isConnected = status === ClientConnectionStatus.Connected;

  return (
    <Suspense fallback={props.loadingFallback ?? props.fallback ?? null}>
      <ClientOnly fallback={props.loadingFallback ?? props.fallback ?? null}>
        <RequireConnectionBase
          {...props}
          services={{ isLoading, isConnected }}
        />
      </ClientOnly>
    </Suspense>
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
