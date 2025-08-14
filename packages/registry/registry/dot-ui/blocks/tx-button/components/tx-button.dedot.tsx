"use client";

import { useMemo } from "react";
import {
  PolkadotProvider,
  useDedot,
} from "@/registry/dot-ui/providers/dedot-provider";
import { TxButtonBase, type TxButtonBaseProps } from "./tx-button.base";

// Props type - removes services prop since we inject it
export type TxButtonProps = Omit<TxButtonBaseProps, "services">;

export function TxButton(props: TxButtonProps) {
  const dedotContext = useDedot();

  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useProvider: () => ({
        isLoading: dedotContext.isLoading,
        isConnected: dedotContext.isConnected,
      }),
    }),
    [dedotContext]
  );

  return <TxButtonBase {...props} />;
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
