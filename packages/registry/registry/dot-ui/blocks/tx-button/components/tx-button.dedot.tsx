"use client";

import { useMemo } from "react";
import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { TxButtonBase, type TxButtonBaseProps } from "./tx-button.base";
import {
  useActiveChain,
  useIsConnected,
  useSelectedAccount,
} from "@/registry/dot-ui/hooks/polkadot-hooks.dedot";

// Props type - removes services prop since we inject it
export type TxButtonProps = Omit<TxButtonBaseProps, "services">;

export function TxButton(props: TxButtonProps) {
  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useSelectedAccount: () => ({
        address: useSelectedAccount()?.address ?? "",
      }),
      useActiveChain: () => ({
        decimals: useActiveChain()?.decimals ?? 0,
        symbol: useActiveChain()?.name ?? "",
      }),
      useIsConnected: () => useIsConnected(),
    }),
    []
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
