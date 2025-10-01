"use client";

import { useMemo } from "react";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { TxButtonBase, type TxButtonBaseProps } from "./tx-button.base";
import { useTypink, useTxFee, useBalance } from "typink";
import { DEFAULT_CALLER } from "@/registry/polkadot-ui/lib/utils";
// UseTxReturnType only appears in imported types; remove unused local import
import type { NetworkId } from "typink/types";
import {
  type ExtractUseTxFn,
  type TxButtonProps,
  type AnyUseTx,
} from "@/registry/polkadot-ui/lib/types.dedot";

export function TxButton<TTx extends AnyUseTx>(props: TxButtonProps<TTx>) {
  const { connectedAccount, supportedNetworks } = useTypink();
  const { tx, args, networkId } = props as unknown as {
    tx?: TTx;
    args?: Parameters<ExtractUseTxFn<TTx>> | undefined;
    networkId?: NetworkId | undefined;
  };

  const feeState = useTxFee({
    tx: tx!,
    enabled: true,
    networkId,
    args: (args ?? []) as Parameters<ExtractUseTxFn<TTx>>,
  } as Parameters<typeof useTxFee>[0]);

  const balanceState = useBalance(connectedAccount?.address ?? DEFAULT_CALLER, {
    networkId,
  });
  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      connectedAccount,
      isConnected: !!connectedAccount,
      decimals: 0,
      symbol: "",
      supportedNetworks,
      fee: (feeState.fee as bigint | null) ?? null,
      isFeeLoading: feeState.isLoading,
      feeError: (feeState.error as string | null) ?? null,
      balanceFree: (balanceState?.free as bigint | null) ?? null,
    }),
    [
      connectedAccount,
      supportedNetworks,
      feeState.fee,
      feeState.isLoading,
      feeState.error,
      balanceState?.free,
    ]
  );

  return (
    <TxButtonBase
      {...(props as unknown as TxButtonBaseProps<TTx, NetworkId>)}
      services={services}
    />
  );
}

// Wrapped version with provider for drop-in usage
export function TxButtonWithProvider<TTx extends AnyUseTx>(
  props: TxButtonProps<TTx>
) {
  return (
    <PolkadotProvider>
      <TxButton {...props} />
    </PolkadotProvider>
  );
}

TxButtonWithProvider.displayName = "TxButtonWithProvider";
