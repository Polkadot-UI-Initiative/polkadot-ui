"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "@/registry/dot-ui/blocks/tx-notification/components/tx-notification.base";
import { formatBalance } from "@/registry/dot-ui/lib/utils.dot-ui";
import { type VariantProps } from "class-variance-authority";
import type { ISubmittableResult, TxStatus } from "dedot/types";
import {
  CheckCheck,
  CheckCircle,
  Coins,
  Loader2,
  PenLine,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useBalance, useTxFee, useTypink } from "typink";
import type { UseTxReturnType } from "typink/hooks/useTx";
import type { Args, NetworkId } from "typink/types";

export interface TxButtonIcons {
  default?: React.ReactNode;
  loading?: React.ReactNode;
  finalized?: React.ReactNode;
  inBestBlock?: React.ReactNode;
  error?: React.ReactNode;
}

// Minimal, generic-agnostic surface for pluggable adapters (dedot, polkadot.js, etc.)
export interface TxButtonServices {
  isConnected?: boolean;
  connectedAccount?: { address?: string } | null;
  symbol?: string;
  decimals?: number;
}

type AnyFn = (...args: any[]) => any;
type ArgsProp<TxFn extends AnyFn> =
  Parameters<TxFn> extends [] ? { args?: [] } : { args: Parameters<TxFn> };

type ExtractTxFn<TTx> = TTx extends UseTxReturnType<infer U> ? U : never;

export type TxButtonBaseProps<
  TTx extends UseTxReturnType<any> = UseTxReturnType<any>,
> = ButtonProps &
  ArgsProp<ExtractTxFn<TTx>> & {
    children: React.ReactNode;
    tx: TTx;
    networkId?: NetworkId;
    resultDisplayDuration?: number;
    withNotification?: boolean;
    icons?: TxButtonIcons;
    services?: TxButtonServices;
  };

export function TxButtonBase<
  TTx extends UseTxReturnType<AnyFn> = UseTxReturnType<AnyFn>,
>({
  children,
  tx,
  args,
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
    error: <X className="w-4 h-4" />,
  },
  ...props
}: TxButtonBaseProps<TTx>) {
  const { connectedAccount, supportedNetworks } = useTypink();

  const isValidNetwork = useMemo(() => {
    if (!networkId) return true;
    return supportedNetworks.some((n) => n.id === networkId);
  }, [networkId, supportedNetworks]);

  const targetNetwork = useMemo(() => {
    if (networkId) return supportedNetworks.find((n) => n.id === networkId);
    return supportedNetworks[0];
  }, [networkId, supportedNetworks]);

  const feeInputForHook = {
    tx: tx as UseTxReturnType<ExtractTxFn<TTx>>,
    enabled: true,
    networkId,
    args: (args ?? ([] as [])) as Parameters<ExtractTxFn<TTx>>,
  } as unknown as Args<Parameters<ExtractTxFn<TTx>>> & {
    tx: UseTxReturnType<ExtractTxFn<TTx>>;
    enabled?: boolean;
    networkId?: NetworkId;
  };

  const {
    fee,
    isLoading: isFeeLoading,
    error: feeError,
  } = useTxFee<ExtractTxFn<TTx>>(feeInputForHook);

  const balance = useBalance(connectedAccount?.address, {
    networkId,
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus | null>(null);

  const isError = !!submitError || !!feeError || !isValidNetwork;
  const inProgress = tx.inProgress;
  const inBestBlockProgress = tx.inBestBlockProgress;
  const isLoading = inProgress;

  const canCoverFee = !!balance && !!fee && balance.free >= fee;

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

  async function onExecute() {
    setSubmitError(null);
    setTxStatus(null);

    const toastId = withNotification
      ? beginTxStatusNotification(undefined, targetNetwork)
      : undefined;

    try {
      await tx.signAndSend({
        args: ["test"],
        callback: (result: ISubmittableResult) => {
          setTxStatus(result.status);
          console.log("tx status", result);
          if (withNotification) {
            txStatusNotification({
              result,
              toastId: toastId as string,
              network: targetNetwork,
              successDuration: resultDisplayDuration,
            });
          }
        },
      });
    } catch (e) {
      if (withNotification && toastId)
        cancelTxStatusNotification(
          toastId as string,
          targetNetwork,
          e instanceof Error ? e.message : String(e)
        );
      setSubmitError(e instanceof Error ? e.message : String(e));
      setTxStatus(null);
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
        onClick={onExecute}
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
          <span className="text-red-500">Invalid network</span>
        ) : feeError ? (
          <span className="text-red-500">{feeError}</span>
        ) : fee !== null && !canCoverFee ? (
          <span className="text-red-500">Insufficient balance for fee</span>
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
    default: <PenLine className="w-4 h-4" />,
    loading: <Loader2 className="w-4 h-4 animate-spin" />,
    finalized: <CheckCheck className="w-4 h-4" />,
    inBestBlock: <CheckCircle className="w-4 h-4" />,
    error: <X className="w-4 h-4" />,
  },
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    children: React.ReactNode;
    icons?: TxButtonBaseProps["icons"];
  }) {
  return (
    <div className="inline-flex flex-col gap-1">
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
