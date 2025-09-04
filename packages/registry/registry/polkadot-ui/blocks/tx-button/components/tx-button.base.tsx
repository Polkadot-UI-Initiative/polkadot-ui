"use client";
// We intentionally allow `any` in a few generic positions to interoperate with
// typink's UseTxReturnType and conditional Args<T> utilities. This is safe
// because the runtime paths remain safe (dedot enforces submittable types) and
// this only relaxes compile-time plumbing so call sites stay simple and
// correctly inferred.

import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import {
  beginTxStatusNotification,
  cancelTxStatusNotification,
  txStatusNotification,
} from "@/registry/polkadot-ui/blocks/tx-notification/components/tx-notification.base";
import { formatBalance } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { type VariantProps } from "class-variance-authority";
import type {
  TxResultLike,
  AnyFn,
  TxAdapter,
} from "@/registry/polkadot-ui/lib/types.dot-ui";
import {
  Ban,
  CheckCheck,
  CheckCircle,
  Coins,
  Loader2,
  PenLine,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export interface TxButtonIcons {
  default?: React.ReactNode;
  loading?: React.ReactNode;
  finalized?: React.ReactNode;
  inBestBlock?: React.ReactNode;
  error?: React.ReactNode;
}

// Minimal, generic-agnostic surface for pluggable adapters (dedot, polkadot.js, etc.)
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

export type TxButtonBaseProps<
  TTx extends TxAdapter<AnyFn> = TxAdapter<AnyFn>,
  TNetworkId = unknown,
> = ButtonProps &
  ArgsProp &
  ExecuteAdapterProps & {
    children: React.ReactNode;
    tx?: TTx;
    networkId?: TNetworkId;
    resultDisplayDuration?: number;
    withNotification?: boolean;
    icons?: TxButtonIcons;
    services?: TxButtonServices<TNetworkId>;
  };

export function TxButtonBase<
  TTx extends TxAdapter<AnyFn> = TxAdapter<AnyFn>,
  TNetworkId = unknown,
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
  services,
  ...props
}: TxButtonBaseProps<TTx, TNetworkId>) {
  const { supportedNetworks, connectedAccount } = services ?? {};

  const isValidNetwork = useMemo(() => {
    if (!networkId) return true;
    return supportedNetworks?.some((n) => n.id === networkId);
  }, [networkId, supportedNetworks]);

  const targetNetwork = useMemo(() => {
    if (networkId) return supportedNetworks?.find((n) => n.id === networkId);
    return supportedNetworks?.[0];
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
  const inProgress = tx ? tx.inProgress : localInProgress;
  const inBestBlockProgress = tx ? tx.inBestBlockProgress : localBestBlock;
  const isLoading = inProgress;

  const canCoverFee =
    fee !== null && balanceFree !== null && balanceFree >= fee;

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

  async function handleExecuteClick() {
    setSubmitError(null);
    setTxStatus(null);

    const toastId = withNotification
      ? beginTxStatusNotification(undefined, targetNetwork)
      : undefined;

    try {
      if (tx) {
        await tx.signAndSend({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          args: (args ?? ([] as unknown[])) as any,
          callback: (result: TxResultLike) => {
            setTxStatus(result.status);
            if (result.status.type === "InBestBlock") setLocalBestBlock(true);
            if (withNotification) {
              txStatusNotification({
                result,
                toastId: toastId as string,
                network: undefined,
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
            if (result.status.type === "InBestBlock") setLocalBestBlock(true);
            if (withNotification) {
              txStatusNotification({
                result,
                toastId: toastId as string,
                network: undefined,
                successDuration: resultDisplayDuration,
              });
            }
          },
        });
      }
    } catch (e) {
      if (withNotification && toastId)
        cancelTxStatusNotification(
          toastId as string,
          undefined,
          e instanceof Error ? e.message : String(e)
        );
      setSubmitError(e instanceof Error ? e.message : String(e));
      setTxStatus(null);
    } finally {
      if (!tx) {
        setLocalInProgress(false);
        setLocalBestBlock(false);
      }
    }
  }

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
              decimals: targetNetwork?.decimals ?? 10,
              unit: targetNetwork?.symbol ?? "UNIT",
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
        onClick={handleExecuteClick}
        variant={variant}
        size={size}
        disabled={isButtonDisabled}
        className={cn(isLoading && "cursor-not-allowed", className)}
        {...props}
      >
        {isLoading ? (
          <>
            {children}
            {icons.loading}
          </>
        ) : inBestBlockProgress ? (
          <>
            {children}
            {icons.inBestBlock}
          </>
        ) : txStatus && showResult && txStatus.type === "Finalized" ? (
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

export function TxButtonSkeleton({
  children,
  icons = {
    default: null,
    loading: <Loader2 className="w-4 h-4 animate-spin" />,
    finalized: <CheckCheck className="w-4 h-4" />,
    inBestBlock: <CheckCircle className="w-4 h-4" />,
    error: <Ban className="w-4 h-4" />,
  },
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    children: React.ReactNode;
    icons?: TxButtonBaseProps["icons"];
  }) {
  return (
    <div className="inline-flex flex-col gap-2">
      <div className="text-xs text-muted-foreground font-medium h-2 flex items-center justify-start gap-1">
        <Coins className="w-3 h-3" />
        <Skeleton className="h-4 w-8" />
      </div>
      <Button disabled {...props}>
        {children}
        {icons.default}
      </Button>
      <div className="text-xs text-muted-foreground font-medium h-4 flex items-center">
        Establishing connection...
      </div>
    </div>
  );
}
