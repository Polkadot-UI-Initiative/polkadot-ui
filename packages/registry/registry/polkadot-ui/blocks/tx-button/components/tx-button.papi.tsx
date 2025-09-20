"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  beginTxStatusNotification,
  cancelTxStatusNotification,
  defaultDescriptions,
  defaultTitles,
  txStatusNotification,
} from "@/registry/polkadot-ui/blocks/tx-notification/components/tx-notification";
import { formatBalance } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { config as reactiveDotConfig } from "@/registry/polkadot-ui/reactive-dot.config";
import { useSpendableBalance } from "@reactive-dot/react";
import { Ban, CheckCheck, CheckCircle, Coins, Loader2 } from "lucide-react";
import type { Transaction as PapiTransaction } from "polkadot-api";
import { useEffect, useState } from "react";
import { TxButtonBaseProps } from "@/registry/polkadot-ui/blocks/tx-button/components/tx-button.base";
import { ChainId } from "@reactive-dot/core";
import {
  PolkadotProvider,
  usePapi,
} from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { DEFAULT_CALLER } from "@/registry/polkadot-ui/lib/utils";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";

type TxButtonProps = TxButtonBaseProps & {
  transaction: PapiTransaction<object, string, string, unknown>;
  networkId: ChainId;
};

export function TxButton(props: TxButtonProps) {
  return (
    <ClientOnly fallback={<Button onClick={() => {}} {...props} />}>
      <TxButtonInner {...props} />
    </ClientOnly>
  );
}

export function TxButtonInner(props: TxButtonProps) {
  const {
    transaction,
    networkId,
    children,
    disabled,
    icons = {
      default: null,
      loading: <Loader2 className="w-4 h-4 animate-spin" />,
      finalized: <CheckCheck className="w-4 h-4" />,
      inBestBlock: <CheckCircle className="w-4 h-4" />,
      error: <Ban className="w-4 h-4" />,
    },
    notifications = {
      titles: defaultTitles,
      descriptions: defaultDescriptions,
    },
    ...rest
  } = props;

  const { selectedAccount } = usePapi();
  const signer = selectedAccount?.polkadotSigner;

  const connectedAccount = selectedAccount;
  const isValidNetwork = true;

  type TxStatusLike = { type: string } | null;
  const [fee, setFee] = useState<bigint | null>(null);
  const [isFeeLoading, setIsFeeLoading] = useState<boolean>(false);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<TxStatusLike>(null);
  const [showResult, setShowResult] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const balanceFree = useSpendableBalance(
    selectedAccount?.address ?? DEFAULT_CALLER
  );

  const isError = !!submitError || !!feeError || !isValidNetwork;
  const status = txStatus?.type;
  const isLoading =
    status === "Loading" || status === "signed" || status === "broadcasted";
  const isInBlock = status === "txBestBlocksState" || status === "inBlock";
  const isFinalized = status === "finalized" || status === "Finalized";
  const explorerUrl = reactiveDotConfig.chains[networkId].explorerUrl;
  const symbol = reactiveDotConfig.chains[networkId].symbol;
  const decimals = reactiveDotConfig.chains[networkId].decimals;
  const canCoverFee =
    fee !== null && balanceFree !== null && balanceFree.planck >= fee;

  useEffect(() => {
    if (txStatus || isError) {
      setShowResult(true);
      const timer = setTimeout(
        () => setShowResult(false),
        props.resultDisplayDuration
      );
      return () => clearTimeout(timer);
    }
    setShowResult(false);
  }, [txStatus, isError, props.resultDisplayDuration]);

  useEffect(() => {
    setIsFeeLoading(true);
    setFeeError(null);
    setFee(null);

    transaction
      ?.getEstimatedFees(selectedAccount?.address ?? DEFAULT_CALLER)
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
    setSubmitError(null);
    setTxStatus({ type: "Loading" });

    const toastId = beginTxStatusNotification({
      network: {
        id: networkId,
        name: networkId,
      },
      title:
        notifications.title ??
        notifications.titles?.signing ??
        "Waiting for signature...",
      description:
        notifications.description ??
        notifications.descriptions?.signing ??
        "Please sign the transaction in your wallet",
    });
    transaction.signSubmitAndWatch(signer).subscribe({
      next: (ev) => {
        setTxStatus({ type: ev.type });
        txStatusNotification({
          title:
            notifications.title ??
            notifications.titles?.submitting ??
            "Waiting for confirmation...",
          successDuration: props.resultDisplayDuration ?? 10000,
          result: { txHash: ev.txHash, status: { type: ev.type } },
          toastId,

          network: {
            id: networkId,
            name: networkId,
            subscanUrl: explorerUrl,
          },
        });
      },
      error: (err) => {
        setTxStatus({ type: "Error" });
        txStatusNotification({
          title:
            notifications.title ??
            notifications.titles?.error ??
            "Transaction failed",
          successDuration: props.resultDisplayDuration ?? 10000,
          result: {
            status: { type: "Error" },
          },
          toastId,
          network: { id: networkId, name: networkId },
        });
        cancelTxStatusNotification({
          toastId,
          network: {
            id: networkId,
            name: networkId,
            subscanUrl: explorerUrl,
          },
          title:
            notifications.title ??
            notifications.titles?.error ??
            "Transaction failed",
          description: err instanceof Error ? err.message : String(err),
        });
      },
    });
  };

  const isButtonDisabled =
    disabled ||
    isLoading ||
    !connectedAccount?.address ||
    !!feeError ||
    !isValidNetwork ||
    !canCoverFee;

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="text-xs text-muted-foreground font-normal h-4 flex items-center justify-start">
        {fee !== null ? (
          <span className="flex items-center gap-1">
            <Coins className="w-3 h-3" />
            {formatBalance({
              value: fee,
              decimals: decimals,
              unit: symbol,
              nDecimals: 4,
            })}
          </span>
        ) : isFeeLoading ? (
          <div className="flex items-center">
            <Loader2 className="w-3 h-3 animate-spin pr-1" />
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
        variant={props.variant}
        size={props.size}
        disabled={isButtonDisabled}
        className={cn(isLoading && "cursor-not-allowed", props.className)}
        {...rest}
      >
        {isLoading ? (
          <>
            {children}
            {icons.loading}
          </>
        ) : isInBlock ? (
          <>
            {children}
            {icons.inBestBlock}
          </>
        ) : showResult && isFinalized ? (
          <>
            {children}
            {icons.finalized}
          </>
        ) : isError && showResult ? (
          <>
            {children}
            {icons.error}
          </>
        ) : (
          <>
            {children}
            {icons.default}
          </>
        )}
      </Button>
      <div className="text-xs font-normal h-4 flex items-center">
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

export function TxButtonWithProvider(props: TxButtonProps) {
  return (
    <PolkadotProvider>
      <TxButton {...props} />
    </PolkadotProvider>
  );
}
