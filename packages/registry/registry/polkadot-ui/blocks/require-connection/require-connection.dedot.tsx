"use client";

import {
  RequireConnectionBase,
  type RequireConnectionBaseProps,
} from "./require-connection.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import { ClientConnectionStatus, usePolkadotClient, useTypink } from "typink";

// Props type - removes services prop since we inject it
export type RequireConnectionProps = Omit<
  RequireConnectionBaseProps,
  "services"
>;

export function RequireConnection(props: RequireConnectionProps) {
  const { supportedNetworks } = useTypink();
  const network = supportedNetworks?.find((n) => n.id === props.chainId);
  const { status } = usePolkadotClient(network?.id ?? props.chainId);

  const isLoading = status === ClientConnectionStatus.Connecting;
  const isConnected = status === ClientConnectionStatus.Connected;

  return (
    <ClientOnly fallback={props.loadingFallback ?? props.fallback ?? null}>
      <RequireConnectionBase {...props} services={{ isLoading, isConnected }} />
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
