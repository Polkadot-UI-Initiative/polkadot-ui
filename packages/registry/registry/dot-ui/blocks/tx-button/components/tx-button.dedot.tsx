"use client";

import { useMemo } from "react";
import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { TxButtonBase, type TxButtonBaseProps } from "./tx-button.base";
import { useDedot } from "@/registry/dot-ui/providers/dedot-provider";
import type { ChainId } from "@/registry/dot-ui/lib/config.dot-ui";
import type { ConfiguredChainApi } from "@/registry/dot-ui/lib/types.dedot";
import type { ISubmittableExtrinsic, ISubmittableResult } from "dedot/types";

// Strongly-typed builders for better autocomplete
export interface TxBuilderForChain<T extends ChainId> {
  (
    tx: ConfiguredChainApi<T>["tx"]
  ): ISubmittableExtrinsic<ISubmittableResult> | undefined;
}

export interface TxBuilderCtxForChain<T extends ChainId> {
  (args: {
    tx: ConfiguredChainApi<T>["tx"];
    chainId: T;
    api: ConfiguredChainApi<T>;
  }): ISubmittableExtrinsic<ISubmittableResult> | undefined;
}

type BaseOmitted = Omit<
  TxButtonBaseProps,
  "services" | "buildTx" | "buildTxCtx" | "tx" | "chainId"
>;

// When chainId is provided as a literal, infer tx type from chain
export type TxButtonPropsForChain<T extends ChainId> = BaseOmitted &
  (
    | {
        chainId: T;
        buildTx: TxBuilderForChain<T>;
        buildTxCtx?: never;
        tx?: never;
      }
    | {
        chainId: T;
        buildTxCtx: TxBuilderCtxForChain<T>;
        buildTx?: never;
        tx?: never;
      }
    | {
        chainId: T;
        tx: ISubmittableExtrinsic;
        buildTx?: never;
        buildTxCtx?: never;
      }
  );

// Fallback props when chainId is not specified (tx is less specific)
export type TxButtonPropsDefault = Omit<TxButtonBaseProps, "services">;

export type TxButtonProps<T extends ChainId = ChainId> =
  | TxButtonPropsForChain<T>
  | TxButtonPropsDefault;

export function TxButton<T extends ChainId>(props: TxButtonProps<T>) {
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

  return (
    <TxButtonBase
      {...(props as unknown as TxButtonBaseProps)}
      services={services}
    />
  );
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
