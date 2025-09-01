"use client";

import { useMemo } from "react";
import type { ChainId } from "@/registry/dot-ui/providers/papi-provider";
import {
  RequireConnectionBase,
  type RequireConnectionBaseProps,
} from "./require-connection.base";
import {
  PolkadotProvider,
  usePapi,
} from "@/registry/dot-ui/providers/papi-provider";
import { ClientOnly } from "@/registry/dot-ui/blocks/client-only";

// Props type - removes services prop since we inject it
export type RequireConnectionProps = Omit<
  RequireConnectionBaseProps<ChainId>,
  "services"
>;

export function RequireConnection(props: RequireConnectionProps) {
  const { isLoading, isConnected } = usePapi();

  const services = useMemo(
    () => ({
      isLoading: isLoading(props.chainId),
      isConnected: isConnected(props.chainId),
    }),
    [isLoading, isConnected, props.chainId]
  );

  return (
    <ClientOnly fallback={props.loadingFallback ?? props.fallback ?? null}>
      <RequireConnectionBase<ChainId> {...props} services={services} />
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
