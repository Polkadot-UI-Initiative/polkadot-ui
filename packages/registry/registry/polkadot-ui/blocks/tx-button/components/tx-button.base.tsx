"use client";
// We intentionally allow `any` in a few generic positions to interoperate with
// typink's UseTxReturnType and conditional Args<T> utilities. This is safe
// because the runtime paths remain safe (dedot enforces submittable types) and
// this only relaxes compile-time plumbing so call sites stay simple and
// correctly inferred.

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  beginTxStatusNotification,
  cancelTxStatusNotification,
  defaultDescriptions,
  defaultTitles,
  txStatusNotification,
  type TxStatusNotificationTexts,
} from "@/registry/polkadot-ui/blocks/tx-notification/components/tx-notification";
import type {
  AnyFn,
  NetworkInfoLike,
  TxAdapter,
  TxResultLike,
} from "@/registry/polkadot-ui/lib/types.dot-ui";
import { formatBalance } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { type VariantProps } from "class-variance-authority";
import { Ban, CheckCheck, CheckCircle, Coins, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export interface TxButtonIcons {
  default?: React.ReactNode;
  loading?: React.ReactNode;
  finalized?: React.ReactNode;
  inBestBlock?: React.ReactNode;
  error?: React.ReactNode;
}

// Minimal, generic-agnostic surface for pluggable adapters (dedot, papi, etc.)
export interface TxButtonServices<TNetworkId = unknown> {
  isConnected?: boolean; //TODO not used?
  connectedAccount?: { address?: string } | null;
  symbol?: string;
  decimals?: number;
  supportedNetworks?: Array<{
    id: TNetworkId;
    decimals: number;
    symbol: string;
    name: string;
  }>;
  fee?: bigint | null;
  isFeeLoading?: boolean;
  feeError?: string | null;
  balanceFree?: bigint | null;
}

type ArgsProp = { args?: unknown[] };

export interface ExecuteAdapterProps {
  execute?: (opts: {
    args: unknown[];
    onStatus: (result: TxResultLike) => void;
  }) => Promise<void>;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export interface TxButtonBaseProps<
  TTx extends TxAdapter<AnyFn> = TxAdapter<AnyFn>,
  TNetworkId extends string = string,
> extends ButtonProps,
    ArgsProp,
    ExecuteAdapterProps {
  children: React.ReactNode;
  tx?: TTx;
  networkId?: TNetworkId;
  resultDisplayDuration?: number;
  withNotification?: boolean;
  notifications?: {
    title?: string;
    description?: string;
    titles?: TxStatusNotificationTexts;
    descriptions?: TxStatusNotificationTexts;
  };
  icons?: TxButtonIcons;
  services?: TxButtonServices<TNetworkId>;
}

export function TxButtonBase<
  TTx extends TxAdapter<AnyFn>,
  TNetworkId extends string,
>({
  children,
  tx,
  args,
  execute,
  networkId,
  className,
  variant,
  size,
  disabled,
  withNotification = true,
  resultDisplayDuration = 5000,
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
  services,
  ...props
}: TxButtonBaseProps<TTx, TNetworkId>) {
  const { supportedNetworks, connectedAccount } = services ?? {};

  const isValidNetwork = useMemo(() => {
    if (!networkId) return true;
    return supportedNetworks?.some((n) => n.id === networkId);
  }, [networkId, supportedNetworks]);

  const targetNetwork = useMemo(() => {
    if (networkId)
      return (
        supportedNetworks?.find((n) => n.id === networkId) ||
        supportedNetworks?.[0]
      );
  }, [networkId, supportedNetworks]);

  const fee = services?.fee ?? null;
  const isFeeLoading = services?.isFeeLoading ?? false;
  const feeError = services?.feeError ?? null;
  const balanceFree = services?.balanceFree ?? null;

  type TxStatusLike = { type: string } | null;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatusLike>(null);

  const isError = !!submitError || !!feeError || !isValidNetwork;
  const [localInProgress, setLocalInProgress] = useState(false);
  const [localBestBlock, setLocalBestBlock] = useState(false);

  useEffect(() => {
    if (txStatus || isError) {
      setShowResult(true);
      const timer = setTimeout(
        () => setShowResult(false),
        resultDisplayDuration
      );
      return () => clearTimeout(timer);
    }
    setShowResult(false);
  }, [txStatus, isError, resultDisplayDuration]);

  const inProgress = tx ? tx.inProgress : localInProgress;
  const inBestBlockProgress = tx ? tx.inBestBlockProgress : localBestBlock;
  const isLoading = inProgress;
  const canCoverFee =
    fee !== null && balanceFree !== null && balanceFree >= fee;
  const isButtonDisabled =
    disabled ||
    isLoading ||
    !connectedAccount?.address ||
    !!feeError ||
    !isValidNetwork ||
    !canCoverFee;

  async function handleExecuteClick() {
    setSubmitError(null);
    setTxStatus(null);

    const toastId = withNotification
      ? beginTxStatusNotification({
          toastId: undefined,
          network: targetNetwork as NetworkInfoLike<TNetworkId>,
          title:
            notifications.title ??
            notifications.titles?.submitting ??
            "Waiting for confirmation...",
          description:
            notifications.description ??
            notifications.descriptions?.submitting ??
            "Awaiting signature...",
        })
      : undefined;

    try {
      if (tx) {
        await tx.signAndSend({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          args: (args ?? ([] as unknown[])) as any,
          callback: (result: TxResultLike) => {
            console.log("aaa clean result", result);
            setTxStatus(result.status);
            if (
              result.status.type === "InBestBlock" ||
              result.status.type === "txBestBlocksState"
            )
              setLocalBestBlock(true);
            if (withNotification) {
              txStatusNotification({
                title:
                  notifications.title ??
                  notifications.titles?.submitting ??
                  "Waiting for confirmation...",
                result,
                toastId: toastId as string,
                network: targetNetwork as NetworkInfoLike<TNetworkId>,
                successDuration: resultDisplayDuration,
              });
            }
          },
        });
      } else if (execute) {
        setLocalInProgress(true);
        setLocalBestBlock(false);
        await execute({
          args: (args ?? []) as unknown[],
          onStatus: (result) => {
            setTxStatus(result.status);
            if (
              result.status.type === "InBestBlock" ||
              result.status.type === "txBestBlocksState"
            )
              setLocalBestBlock(true);
            if (withNotification) {
              txStatusNotification({
                title:
                  notifications.title ??
                  notifications.titles?.submitting ??
                  "Waiting for confirmation...",
                result,
                toastId: toastId as string,
                network: targetNetwork as NetworkInfoLike<TNetworkId>,
                successDuration: resultDisplayDuration,
              });
            }
          },
        });
      }
    } catch (e) {
      if (withNotification && toastId)
        cancelTxStatusNotification({
          toastId,
          network: targetNetwork as NetworkInfoLike<TNetworkId>,
          title:
            notifications.title ??
            notifications.titles?.error ??
            "Transaction failed",
          description: e instanceof Error ? e.message : String(e),
        });
      setSubmitError(e instanceof Error ? e.message : String(e));
      setSubmitError(e instanceof Error ? e.message : String(e));
      setTxStatus(null);
    } finally {
      if (!tx) {
        setLocalInProgress(false);
        setLocalBestBlock(false);
      }
    }
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="text-xs text-muted-foreground font-medium h-4 flex items-center justify-start">
        {fee !== null ? (
          <span className="flex items-center gap-1">
            <Coins className="w-3 h-3" />
            {formatBalance({
              value: fee,
              decimals: targetNetwork?.decimals ?? 10,
              unit: targetNetwork?.symbol ?? "UNIT",
              nDecimals: 4,
            })}
          </span>
        ) : isFeeLoading ? (
          <div className="flex items-center">
            <Loader2 className="w-3 h-3 animate-spin mr-1" />
            <span>Estimating fees...</span>
          </div>
        ) : (
          <span className="text-muted-foreground">
            Fee calculation pending... {fee} {feeError} {isFeeLoading}
          </span>
        )}
      </div>
      <Button
        onClick={handleExecuteClick}
        variant={variant}
        size={size}
        disabled={isButtonDisabled}
        type="button"
        aria-busy={isLoading || undefined}
        className={cn(
          "transition-transform duration-150 ease-out active:scale-[0.98] active:translate-y-[0.5px]",
          isLoading && "cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            {children}
            <span aria-hidden="true">{icons.loading}</span>
          </>
        ) : inBestBlockProgress ? (
          <>
            {children}
            <span aria-hidden="true">{icons.inBestBlock}</span>
          </>
        ) : txStatus &&
          showResult &&
          (txStatus.type === "Finalized" || txStatus.type === "finalized") ? (
          <>
            {children}
            <span aria-hidden="true">{icons.finalized}</span>
          </>
        ) : isError && showResult ? (
          <>
            {children}
            <span aria-hidden="true">{icons.error}</span>
          </>
        ) : (
          <>
            {children}
            <span aria-hidden="true">{icons.default}</span>
          </>
        )}
      </Button>
      {/* SR-only live region for status updates */}
      <span className="sr-only" aria-live="polite">
        {isLoading
          ? "Transaction pending"
          : inBestBlockProgress
            ? "Transaction in best block"
            : txStatus &&
                (txStatus.type === "Finalized" || txStatus.type === "finalized")
              ? "Transaction finalized"
              : isError && showResult
                ? "Transaction error"
                : ""}
      </span>
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

export function TxButtonSkeleton({
  children,
  icons = {
    default: null,
    loading: <Loader2 className="w-4 h-4 animate-spin" />,
    finalized: <CheckCheck className="w-4 h-4" />,
    inBestBlock: <CheckCircle className="w-4 h-4" />,
    error: <Ban className="w-4 h-4" />,
  },
  className,
  variant,
  size,
}: {
  children: React.ReactNode;
  icons?: TxButtonIcons;
  className?: string;
} & VariantProps<typeof buttonVariants>) {
  return (
    <div className="inline-flex flex-col gap-1">
      <div className="text-xs text-muted-foreground font-medium h-4 flex items-center justify-start gap-1">
        <Coins className="w-3 h-3" />
        <Loader2 className="w-3 h-3 animate-spin" />
      </div>
      <Button disabled variant={variant} size={size} className={className}>
        {children}
        {icons.default}
      </Button>
      <div className="text-xs font-normal h-4 flex items-center" />
    </div>
  );
}
