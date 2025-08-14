"use client";

import { PolkadotProvider } from "@/registry/dot-ui/providers/papi-provider";
import { TxButtonBase, type TxButtonBaseProps } from "./tx-button.base";

// Props type - removes services prop since we inject it
export type TxButtonProps = Omit<TxButtonBaseProps, "services">;

export function TxButton() {
  return <TxButtonBase>Papi not implemented</TxButtonBase>;
}

// Wrapped version with provider for drop-in usage
export function TxButtonWithProvider() {
  return (
    <PolkadotProvider>
      <TxButton />
    </PolkadotProvider>
  );
}

TxButtonWithProvider.displayName = "TxButtonWithProvider";
