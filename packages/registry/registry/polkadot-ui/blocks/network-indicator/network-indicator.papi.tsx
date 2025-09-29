"use client";

import { usePapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { config } from "@/registry/polkadot-ui/lib/reactive-dot.config";
import { ChainId } from "@reactive-dot/core";
import { useMemo } from "react";
import {
  NetworkIndicatorBase,
  NetworkIndicatorBaseProps,
} from "./network-indicator.base";

export type NetworkIndicatorProps<TNetworkId extends string> = Omit<
  NetworkIndicatorBaseProps<TNetworkId>,
  "services"
>;

export function NetworkIndicator<T extends ChainId>(
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

  const { status, blockInfo } = usePapi(props.chainId);

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
