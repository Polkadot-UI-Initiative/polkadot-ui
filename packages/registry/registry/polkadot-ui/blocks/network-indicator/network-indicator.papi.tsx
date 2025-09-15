"use client";

import { useMemo } from "react";
import { NetworkIndicatorBaseProps } from "./network-indicator.base";
import { NetworkIndicatorBase } from "./network-indicator.base";
import { config } from "@/registry/polkadot-ui/reactive-dot.config";
import { usePapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { ChainId } from "@reactive-dot/core";

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
      //TODO add logo
    };
  });

export function usePapi(chainId?: ChainId) {
  const ctx = useContext(PapiContext);
  if (!ctx) throw new Error("usePapi must be used within PolkadotProvider");

  const chainClient = useClient(chainId ? { chainId } : undefined);
  const { status, blockInfo } = usePapiClientStatus(chainId);

  return chainId ? { ...ctx, client: chainClient, status, blockInfo } : ctx;
}
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
