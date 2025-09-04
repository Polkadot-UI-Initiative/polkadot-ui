"use client";

import { PolkadotProvider } from "@/registry/polkadot-ui/providers/polkadot-provider.papi";
import { TxButtonBase, type TxButtonBaseProps } from "./tx-button.base";
import { usePapi } from "@/registry/polkadot-ui/providers/polkadot-provider.reactive-dot";
import { useEffect, useMemo, useState } from "react";
import {
  useChainIds,
  useClient,
  useSpendableBalance,
} from "@reactive-dot/react";
import { config } from "@/registry/polkadot-ui/reactive-dot.config";
import type { TxResultLike } from "@/registry/polkadot-ui/lib/types.dot-ui";
import type { TypedApi } from "polkadot-api";
import type { SupportedChainId } from "@/registry/polkadot-ui/providers/polkadot-provider.reactive-dot";

// Local minimal typings for PAPI transactions built from typed API
type PapiTx = TypedApi<
  (typeof config)["chains"][SupportedChainId]["descriptor"]
>["tx"];

interface PapiTxEventBase {
  type: string;
  txHash?: string;
  found?: boolean;
  isValid?: boolean;
}

interface PapiTransaction {
  getEstimatedFees: (from: string) => Promise<bigint>;
  signSubmitAndWatch: (signer: unknown) => {
    subscribe: (handlers: {
      next: (ev: PapiTxEventBase) => void;
      error: (err: unknown) => void;
    }) => { unsubscribe: () => void };
  };
}

type PapiTxFn = (...args: unknown[]) => PapiTransaction;

// Props type - removes services/tx/execute/args since we inject execute + services
export interface PapiTxButtonProps
  extends Omit<TxButtonBaseProps, "services" | "tx" | "args" | "execute"> {
  txBuilder: (tx: PapiTx) => PapiTxFn;
  args?: unknown[];
  networkId?: SupportedChainId;
}

export function TxButton(props: PapiTxButtonProps) {
  const { txBuilder, args, networkId, ...rest } = props;
  const { selectedAccount } = usePapi();

  const chainIds = useChainIds();
  const targetChainId: SupportedChainId | undefined = useMemo(() => {
    if (networkId) return networkId as SupportedChainId;
    return (chainIds && chainIds[0]) as SupportedChainId | undefined;
  }, [networkId, chainIds]);

  const client = useClient(
    targetChainId ? { chainId: targetChainId } : undefined
  );

  const typedApi = useMemo(() => {
    if (!client || !targetChainId) return null;
    const descriptor = config.chains[targetChainId]
      ?.descriptor as (typeof config)["chains"][SupportedChainId]["descriptor"];
    return client.getTypedApi(descriptor);
  }, [client, targetChainId]);

  // Fee estimation state
  const [fee, setFee] = useState<bigint | null>(null);
  const [isFeeLoading, setIsFeeLoading] = useState<boolean>(false);
  const [feeError, setFeeError] = useState<string | null>(null);

  // Build call function lazily
  const callFn = useMemo(() => {
    if (!typedApi) return null as unknown as PapiTxFn | null;
    return txBuilder(typedApi.tx as PapiTx) as unknown as PapiTxFn;
  }, [typedApi, txBuilder]);

  // Estimate fee whenever inputs change
  useEffect(() => {
    let cancelled = false;
    async function run() {
      setFeeError(null);
      setFee(null);
      setIsFeeLoading(true);
      try {
        if (!typedApi || !callFn || !selectedAccount?.address) return;
        const callArgs = (args ?? []) as unknown[];
        const tx = (callFn as (...fnArgs: unknown[]) => PapiTransaction)(
          ...callArgs
        );
        const estimated = await tx.getEstimatedFees(selectedAccount.address);
        if (!cancelled) setFee(estimated);
      } catch (e) {
        if (!cancelled) setFeeError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setIsFeeLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [typedApi, callFn, selectedAccount?.address, args]);

  // Balance via reactive-dot for can-pay check
  const balance = useSpendableBalance(
    (selectedAccount?.address ?? "") as unknown as string,
    {
      chainId: targetChainId,
    } as unknown as { chainId?: SupportedChainId }
  );

  const nativeToken = useMemo((): { decimals: number; symbol: string } => {
    if (!targetChainId) return { decimals: 10, symbol: "UNIT" };
    const token = (
      config as unknown as {
        chains: Record<
          string,
          { nativeToken?: { decimals?: number; symbol?: string } }
        >;
      }
    ).chains[targetChainId as string]?.nativeToken;
    return {
      decimals: token?.decimals ?? 10,
      symbol: token?.symbol ?? "UNIT",
    };
  }, [targetChainId]);

  // Execute function consumed by base
  const execute = useMemo(() => {
    return async ({
      args: execArgs,
      onStatus,
    }: {
      args: unknown[];
      onStatus: (r: TxResultLike) => void;
    }) => {
      if (!typedApi || !callFn) throw new Error("API not ready");
      if (!selectedAccount?.polkadotSigner)
        throw new Error("No signer available");

      const tx = (callFn as (...fnArgs: unknown[]) => PapiTransaction)(
        ...((execArgs ?? []) as unknown[])
      );

      await new Promise<void>((resolve, reject) => {
        try {
          const sub = tx
            .signSubmitAndWatch(selectedAccount.polkadotSigner)
            .subscribe({
              next: (ev: PapiTxEventBase) => {
                if (ev.type === "signed")
                  onStatus({ status: { type: "Signed" } });
                if (ev.type === "broadcasted")
                  onStatus({ status: { type: "Broadcasted" } });
                if (ev.type === "txBestBlocksState") {
                  if (ev.found) {
                    onStatus({
                      status: { type: "InBestBlock" },
                      txHash: ev.txHash,
                    });
                  } else {
                    onStatus({
                      status: { type: ev.isValid ? "Valid" : "Invalid" },
                    });
                  }
                }
                if (ev.type === "finalized") {
                  onStatus({
                    status: { type: "Finalized" },
                    txHash: ev.txHash,
                  });
                  sub.unsubscribe();
                  resolve();
                }
              },
              error: (err: unknown) => reject(err),
            });
        } catch (e) {
          reject(e);
        }
      });
    };
  }, [callFn, typedApi, selectedAccount?.polkadotSigner]);

  function getPlanckMaybe(value: unknown): bigint | null {
    if (
      value &&
      typeof value === "object" &&
      "planck" in (value as Record<string, unknown>)
    ) {
      const p = (value as Record<string, unknown>).planck as unknown;
      if (typeof p === "bigint") return p as bigint;
    }
    return null;
  }

  const services = useMemo(
    () => ({
      connectedAccount: selectedAccount,
      supportedNetworks: (chainIds ?? []).map((id) => ({
        id,
        decimals: ((
          config as unknown as {
            chains: Record<string, { nativeToken?: { decimals?: number } }>;
          }
        ).chains[id as string]?.nativeToken?.decimals ?? 10) as number,
        symbol: ((
          config as unknown as {
            chains: Record<string, { nativeToken?: { symbol?: string } }>;
          }
        ).chains[id as string]?.nativeToken?.symbol ?? "UNIT") as string,
        name: id,
      })),
      balanceFree: getPlanckMaybe(balance as unknown),
      isFeeLoading,
      fee,
      feeError,
      decimals: nativeToken.decimals,
      symbol: nativeToken.symbol,
    }),
    [
      selectedAccount,
      chainIds,
      balance,
      isFeeLoading,
      fee,
      feeError,
      nativeToken.decimals,
      nativeToken.symbol,
    ]
  );

  return (
    <TxButtonBase
      {...(rest as unknown as TxButtonBaseProps)}
      execute={execute}
      args={(args ?? []) as unknown[]}
      networkId={targetChainId}
      services={services}
    />
  );
}

// Wrapped version with provider for drop-in usage
export function TxButtonWithProvider(props: PapiTxButtonProps) {
  return (
    <PolkadotProvider>
      <TxButton {...props} />
    </PolkadotProvider>
  );
}

TxButtonWithProvider.displayName = "TxButtonWithProvider";
