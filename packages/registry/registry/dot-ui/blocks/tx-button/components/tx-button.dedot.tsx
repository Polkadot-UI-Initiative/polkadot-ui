"use client";

import { useMemo } from "react";
import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { TxButtonBase, type TxButtonBaseProps } from "./tx-button.base";
import { useDedot } from "@/registry/dot-ui/providers/dedot-provider";

// Props type - removes services prop since we inject it
export type TxButtonProps = Omit<TxButtonBaseProps, "services">;

export function TxButton(props: TxButtonProps) {
  const { availableChains, currentChain, activeAccount } = useDedot();
  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useSelectedAccount: () => ({
        address: activeAccount?.address ?? "",
      }),
      useActiveChain: () => ({
        decimals:
          availableChains.find((chain) => chain?.id === currentChain?.id)
            ?.decimals ?? 0,
        symbol:
          availableChains.find((chain) => chain?.id === currentChain?.id)
            ?.symbol ?? "",
      }),
      useIsConnected: () => !!activeAccount?.address,
    }),
    [availableChains, currentChain, activeAccount]
  );

  return <TxButtonBase {...props} services={services} />;
}

// Wrapped version with provider for drop-in usage
export function TxButtonWithProvider(props: TxButtonProps) {
  return (
    <PolkadotProvider>
      <TxButton {...props} />
    </PolkadotProvider>
  );
}

TxButtonWithProvider.displayName = "TxButtonWithProvider";
