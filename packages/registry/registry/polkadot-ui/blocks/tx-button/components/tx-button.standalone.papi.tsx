"use client";

import { Button } from "@/components/ui/button";

import type { Transaction as PapiTransaction } from "polkadot-api";
import type { SupportedChainId } from "@/registry/polkadot-ui/providers/polkadot-provider.reactive-dot";
import { useSelectedAccount } from "../../../providers/polkadot-provider.reactive-dot";
import { formatBalance } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { Coins, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  beginTxStatusNotification,
  cancelTxStatusNotification,
  txStatusNotification,
} from "../../tx-notification/components/tx-notification.base";
import { TxButtonBaseProps } from "./tx-button.base";

export function TxButtonStandalone(
  props: TxButtonBaseProps & {
    transaction: PapiTransaction<any, string, string, unknown>;
    networkId: SupportedChainId;
  }
) {
  const { transaction, networkId, children, disabled, icons } = props;

  const { selectedAccount } = useSelectedAccount();
  const signer = selectedAccount?.polkadotSigner;

  type TxStatusLike = { type: string } | null;
  const [fee, setFee] = useState<bigint | null>(null);
  const [isFeeLoading, setIsFeeLoading] = useState<boolean>(false);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<TxStatusLike>(null);

  useEffect(() => {
    setIsFeeLoading(true);
    setFeeError(null);
    setFee(null);

    transaction
      ?.getEstimatedFees(selectedAccount?.address ?? "")
      .then((fee) => setFee(fee))
      .catch((error) =>
        setFeeError(error instanceof Error ? error.message : String(error))
      )
      .finally(() => {
        setIsFeeLoading(false);
      });
  }, [transaction, selectedAccount]);

  if (!signer) return "no signer";

  const handleClick = () => {
    if (!transaction) return;
    const toastId = beginTxStatusNotification(undefined, {
      name: networkId,
    });
    transaction.signSubmitAndWatch(signer).subscribe({
      next: (ev) => {
        console.log(ev);
        setTxStatus(ev);
        txStatusNotification({
          successDuration: props.resultDisplayDuration ?? 10000,
          result: {
            status: { type: ev.type },
          },
          toastId,
          network: { name: networkId },
        });
      },
      error: (err) => {
        setTxStatus(null);
        txStatusNotification({
          successDuration: props.resultDisplayDuration ?? 10000,
          result: {
            status: { type: "Error" },
          },
          toastId,
          network: { name: networkId },
        });
        cancelTxStatusNotification(
          toastId,
          {
            name: networkId,
          },
          err instanceof Error ? err.message : String(err)
        );
      },
    });
  };

  console.log("fee", fee);

  const isLoading = false;

  const inBestBlockProgress = false;
  const showResult = false;
  const isError = false;
  const connectedAccount = selectedAccount;
  const isValidNetwork = true;
  const canCoverFee = true;

  const isButtonDisabled =
    disabled ||
    isLoading ||
    !connectedAccount?.address ||
    !!feeError ||
    !isValidNetwork ||
    !canCoverFee;

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="text-xs text-muted-foreground font-medium h-4 flex items-center justify-start">
        {fee !== null ? (
          <span className="flex items-center gap-1">
            <Coins className="w-3 h-3" />
            {formatBalance({
              value: fee,
              decimals: 10,
              unit: "UNIT",
              nDecimals: 4,
            })}
          </span>
        ) : isFeeLoading ? (
          <div className="flex items-center">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Estimating fees...</span>
          </div>
        ) : (
          <span className="text-muted-foreground">
            Fee calculation pending... {fee} {feeError} {isFeeLoading}
          </span>
        )}
      </div>
      <Button
        onClick={handleClick}
        // variant={variant}
        // size={size}
        disabled={isButtonDisabled}
        // className={cn(isLoading && "cursor-not-allowed", className)}
        {...props}
      >
        {isLoading ? (
          <>
            {children}
            {icons?.loading}
          </>
        ) : inBestBlockProgress ? (
          <>
            {children}
            {icons?.inBestBlock}
          </>
        ) : txStatus && showResult && txStatus.type === "Finalized" ? (
          <>
            {children}
            {icons?.finalized}
          </>
        ) : isError && showResult ? (
          <>
            {children}
            {icons?.error}
          </>
        ) : (
          <>
            {children}
            {icons?.default}
          </>
        )}
      </Button>
      <div className="text-xs font-medium h-4 flex items-center">
        {!connectedAccount?.address ? (
          <span className="text-amber-500">Please select an account</span>
        ) : !isValidNetwork ? (
          <span className="text-destructive">Invalid network</span>
        ) : feeError ? (
          <span className="text-destructive">{feeError}</span>
        ) : fee !== null && !canCoverFee ? (
          <span className="text-destructive">Insufficient balance for fee</span>
        ) : (
          <span className="text-transparent">_</span>
        )}
      </div>
    </div>
  );
}
