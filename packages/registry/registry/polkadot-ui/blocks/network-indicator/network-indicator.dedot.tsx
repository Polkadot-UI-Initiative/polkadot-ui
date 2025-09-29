"use client";

import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  NetworkIndicatorBase,
  NetworkIndicatorSkeleton,
  type NetworkIndicatorBaseProps,
} from "@/registry/polkadot-ui/blocks/network-indicator/network-indicator.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { useMemo } from "react";
import { ClientConnectionStatus, useBlockInfo, useTypink } from "typink";

export type NetworkIndicatorProps<TNetworkId extends string> = Omit<
  NetworkIndicatorBaseProps<TNetworkId>,
  "services"
>;

export function NetworkIndicator<TNetworkId extends string>(
  props: NetworkIndicatorProps<TNetworkId>
) {
  return (
    <ClientOnly fallback={<NetworkIndicatorSkeleton />}>
      <NetworkIndicatorInner {...props} />
    </ClientOnly>
  );
}

export function NetworkIndicatorInner<TNetworkId extends string>(
  props: NetworkIndicatorProps<TNetworkId>
) {
  const { chainId } = props;
  const { connectionStatus, supportedNetworks } = useTypink();
  const { best, finalized } = useBlockInfo({ networkId: chainId });

  const services = useMemo(
    () => ({
      connectionStatus:
        connectionStatus.get(chainId) ?? ClientConnectionStatus.NotConnected,
      supportedNetworks,
      blockInfo: { best, finalized },
    }),
    [connectionStatus, supportedNetworks, best, finalized, chainId]
  );

  return <NetworkIndicatorBase {...props} services={services} />;
}

export function NetworkIndicatorWithProvider(
  props: NetworkIndicatorProps<string>
) {
  return (
    <PolkadotProvider>
      <NetworkIndicator {...props} />
    </PolkadotProvider>
  );
}
