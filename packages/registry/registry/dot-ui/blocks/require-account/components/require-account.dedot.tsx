"use client";

import { useMemo } from "react";
import { ClientOnly } from "@/registry/dot-ui/blocks/client-only";
import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import {
  RequireAccountBase,
  type RequireAccountBaseProps,
} from "@/registry/dot-ui/blocks/require-account/components/require-account.base";
import { ClientConnectionStatus, useTypink } from "typink";

export type RequireAccountProps = Omit<RequireAccountBaseProps, "services">;

export function RequireAccount(props: RequireAccountProps) {
  const { connectedAccount, connectionStatus } = useTypink();

  const services = useMemo(
    () => ({
      isLoading:
        connectionStatus?.get?.(props.chainId) ===
        ClientConnectionStatus.Connecting,
      hasAccount: !!connectedAccount?.address,
    }),
    [connectionStatus, connectedAccount?.address, props.chainId]
  );

  return (
    <ClientOnly fallback={props.loadingFallback ?? props.fallback ?? null}>
      <RequireAccountBase {...props} services={services} />
    </ClientOnly>
  );
}

export function RequireAccountWithProvider(props: RequireAccountProps) {
  return (
    <PolkadotProvider>
      <RequireAccount {...props} />
    </PolkadotProvider>
  );
}
