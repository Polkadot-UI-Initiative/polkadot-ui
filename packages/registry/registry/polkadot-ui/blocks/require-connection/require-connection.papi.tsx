"use client";

import { useMemo, Suspense } from "react";
import {
  RequireConnectionBase,
  type RequireConnectionBaseProps,
} from "./require-connection.base";
import {
  PolkadotProvider,
  useConnectionStatus,
} from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { type ChainId } from "@reactive-dot/core";
import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { config } from "@/registry/polkadot-ui/lib/reactive-dot.config";

// Props type - removes services prop since we inject it
export type RequireConnectionProps = Omit<
  RequireConnectionBaseProps<ChainId>,
  "services"
>;

export function RequireConnection(props: RequireConnectionProps) {
  return (
    <Suspense fallback={props.loadingFallback ?? props.fallback ?? null}>
      <RequireConnectionInner {...props} />
    </Suspense>
  );
}

function RequireConnectionInner(props: RequireConnectionProps) {
  const defaultChainId = Object.keys(config.chains)[0] as ChainId;
  const { status } = useConnectionStatus({
    chainId: props.chainId || defaultChainId,
  });

  const services = useMemo(
    () => ({
      isLoading: status === ClientConnectionStatus.Connecting,
      isConnected: status === ClientConnectionStatus.Connected,
    }),
    [status]
  );

  return <RequireConnectionBase {...props} services={services} />;
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
