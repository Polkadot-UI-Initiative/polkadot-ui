"use client";

import { config } from "@/registry/polkadot-ui/lib/reactive-dot.config";
import { type ChainId } from "@reactive-dot/core";
import { Suspense, useMemo } from "react";
import {
  NetworkIndicatorBase,
  NetworkIndicatorSkeleton,
  type NetworkIndicatorBaseProps,
} from "./network-indicator.base";
import { useConnectionStatus } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { useBlock } from "@reactive-dot/react";

export type NetworkIndicatorProps<TNetworkId extends string> = Omit<
  NetworkIndicatorBaseProps<TNetworkId>,
  "services"
>;

export function NetworkIndicator<T extends ChainId>(
  props: NetworkIndicatorProps<T>
) {
  return (
    <Suspense fallback={<NetworkIndicatorSkeleton />}>
      <NetworkIndicatorInner {...props} />
    </Suspense>
  );
}

function NetworkIndicatorInner<T extends ChainId>(
  props: NetworkIndicatorProps<T>
) {
  const supportedNetworks = Object.keys(config.chains).map((chainId) => {
    return {
      id: chainId,
      name: config.chains[chainId as keyof typeof config.chains].name,
      symbol: config.chains[chainId as keyof typeof config.chains].symbol,
      decimals: config.chains[chainId as keyof typeof config.chains].decimals,
      logo: config.chains[chainId as keyof typeof config.chains].logo,
    };
  });

  const { status } = useConnectionStatus({ chainId: props.chainId });
  const blockInfo = useBlock(props.at, { chainId: props.chainId });

  const services = useMemo(
    () => ({
      connectionStatus: status,
      supportedNetworks,
      blockInfo: blockInfo ? { [props.at]: blockInfo } : undefined,
    }),
    [supportedNetworks, status, blockInfo, props.at]
  );

  return <NetworkIndicatorBase {...props} services={services} />;
}
