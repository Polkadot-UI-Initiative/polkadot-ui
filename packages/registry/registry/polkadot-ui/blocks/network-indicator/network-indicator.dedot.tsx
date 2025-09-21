"use client";

import { useMemo } from "react";
import { ClientConnectionStatus, useBlockInfo, useTypink } from "typink";
import { NetworkIndicatorBaseProps } from "./network-indicator.base";
import { NetworkIndicatorBase } from "./network-indicator.base";
import { ClientOnly } from "../client-only";

export type NetworkIndicatorProps<TNetworkId extends string> = Omit<
  NetworkIndicatorBaseProps<TNetworkId>,
  "services"
>;

export function NetworkIndicator<TNetworkId extends string>(
  props: NetworkIndicatorProps<TNetworkId>
) {
  return (
    <ClientOnly>
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
