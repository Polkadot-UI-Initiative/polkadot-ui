"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import type { ChainId } from "@reactive-dot/core";
import { useSpendableBalance } from "@reactive-dot/react";
import type { Transaction as PapiTransaction } from "polkadot-api";
import { config } from "@/registry/polkadot-ui/lib/reactive-dot.config";
import {
  PolkadotProvider,
  useSelectedAccount,
} from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import {
  TxButtonBase,
  TxButtonSkeleton,
  type TxButtonBaseProps,
} from "@/registry/polkadot-ui/blocks/tx-button/components/tx-button.base";
import { DEFAULT_CALLER } from "@/registry/polkadot-ui/lib/utils.dot-ui";

interface PapiTxButtonProps
  extends Omit<TxButtonBaseProps, "tx" | "execute" | "services" | "networkId"> {
  transaction: PapiTransaction<object, string, string, unknown>;
  networkId: ChainId;
}

export function TxButton(props: PapiTxButtonProps) {
  return (
    <Suspense
      fallback={
        <TxButtonSkeleton
          variant={props.variant}
          size={props.size}
          className={props.className}
        >
          {props.children}
        </TxButtonSkeleton>
      }
    >
      <TxButtonInner {...props} />
    </Suspense>
  );
}

export function TxButtonInner(props: PapiTxButtonProps) {
  const { transaction, networkId, ...rest } = props;
  const { selectedAccount } = useSelectedAccount();

  const [fee, setFee] = useState<bigint | null>(null);
  const [isFeeLoading, setIsFeeLoading] = useState<boolean>(false);
  const [feeError, setFeeError] = useState<string | null>(null);

  const spendable = useSpendableBalance(
    selectedAccount?.address ?? DEFAULT_CALLER,
    {
      chainId: networkId,
    }
  );

  useEffect(() => {
    let cancelled = false;
    setIsFeeLoading(true);
    setFeeError(null);
    setFee(null);
    transaction
      ?.getEstimatedFees(selectedAccount?.address ?? DEFAULT_CALLER)
      .then((nextFee) => {
        if (!cancelled) setFee(nextFee);
      })
      .catch((error) => {
        if (!cancelled)
          setFeeError(error instanceof Error ? error.message : String(error));
      })
      .finally(() => {
        if (!cancelled) setIsFeeLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [transaction, selectedAccount]);

  const services = useMemo(() => {
    const supportedNetworks = Object.entries(config.chains).map(
      ([id, info]) => ({
        id: id as ChainId,
        decimals: info.decimals,
        symbol: info.symbol,
        name: info.name,
        logo: info.logo,
        subscanUrl: info.explorerUrl,
      })
    );
    return {
      connectedAccount: selectedAccount,
      isConnected: !!selectedAccount,
      supportedNetworks,
      fee,
      isFeeLoading,
      feeError,
      balanceFree: spendable?.planck ?? null,
    };
  }, [selectedAccount, fee, isFeeLoading, feeError, spendable?.planck]);

  const execute: NonNullable<TxButtonBaseProps["execute"]> = useCallback(
    async (opts) => {
      if (!selectedAccount?.polkadotSigner)
        throw new Error("No signer available");
      const signer = selectedAccount.polkadotSigner;
      await new Promise<void>((resolve, reject) => {
        const sub = transaction.signSubmitAndWatch(signer).subscribe({
          next: (ev) => {
            const statusType = ev.type;
            opts.onStatus({ status: { type: statusType }, txHash: ev.txHash });
            if (statusType === "finalized") {
              sub?.unsubscribe();
              resolve();
            }
          },
          error: (err) => {
            sub?.unsubscribe();
            reject(err);
          },
        });
      });
    },
    [selectedAccount, transaction]
  );

  return (
    <TxButtonBase
      {...rest}
      networkId={networkId}
      services={services}
      execute={execute}
    />
  );
}

export function TxButtonWithProvider(props: PapiTxButtonProps) {
  return (
    <PolkadotProvider>
      <TxButton {...props} />
    </PolkadotProvider>
  );
}
