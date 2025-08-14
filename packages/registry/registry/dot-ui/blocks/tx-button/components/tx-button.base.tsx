"use client";

import { Button, buttonVariants } from "@/components/ui/button";

import { formatBalance } from "@/registry/dot-ui/lib/utils.dot-ui";
import { cn } from "@/registry/dot-ui/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { Loader2, PenLine, CheckCheck, Check, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useClient, useTypink } from "typink";
import type { TxStatus, ISubmittableExtrinsic } from "dedot/types";

type ClientType = NonNullable<ReturnType<typeof useClient>["client"]>;
type ChainTx = ClientType["tx"];

export interface TxButtonServices {
  useSelectedAccount: () => {
    address: string;
  };
  useActiveChain: () => {
    decimals: number;
    symbol: string;
  };
  useIsConnected: () => boolean;
}

export interface TxButtonBaseProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  tx:
    | ISubmittableExtrinsic
    | ((tx: ChainTx) => ISubmittableExtrinsic | undefined)
    | undefined;
  resultDisplayDuration?: number;
  icons?: {
    default?: React.ReactNode;
    loading?: React.ReactNode;
    finalized?: React.ReactNode;
    inBestBlock?: React.ReactNode;
    error?: React.ReactNode;
  };
  services: TxButtonServices;
}

export function TxButtonBase({
  children,
  tx,
  className,
  variant,
  size,
  disabled,
  resultDisplayDuration = 5000,
  icons = {
    default: <PenLine className="w-4 h-4" />,
    loading: <Loader2 className="w-4 h-4 animate-spin" />,
    finalized: <CheckCheck className="w-4 h-4 text-green-500" />,
    inBestBlock: <Check className="w-4 h-4 text-green-500 animate-pulse" />,
    error: <X className="w-4 h-4 text-red-500" />,
  },
  services,
  ...props
}: TxButtonBaseProps) {
  const selectedAccount = services.useSelectedAccount();
  const activeChain = services.useActiveChain();
  const isConnected = services.useIsConnected();
  const { client, defaultCaller } = useTypink();

  const extrinsic = useMemo(() => {
    if (!tx) return null;
    if (typeof tx !== "function") return tx;
    if (!client) return null;
    try {
      return tx(client.tx) ?? null;
    } catch (e) {
      console.error("Failed to build extrinsic", e);
      return null;
    }
  }, [client, tx]);

  const [submitError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus | null>(null);
  const [isAwaitingSignature, setIsAwaitingSignature] = useState(false);

  const isError = !!submitError;
  const isLoading =
    isAwaitingSignature ||
    (txStatus &&
      ["Broadcasting", "Validated", "NoLongerInBestChain"].includes(
        txStatus.type
      ));

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

  const [estimatedFees, setEstimatedFees] = useState<bigint | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [feesError, setFeesError] = useState<string | null>(null);

  useEffect(() => {
    const estimateAddress = selectedAccount?.address ?? defaultCaller;
    if (!extrinsic || !estimateAddress) return;
    let cancelled = false;
    setIsEstimating(true);
    setFeesError(null);

    async function estimateFees() {
      if (!extrinsic || !estimateAddress || cancelled) return;
      try {
        const { partialFee } = await extrinsic.paymentInfo(estimateAddress);

        console.log("partialFee", partialFee);
        setEstimatedFees(partialFee);
      } catch (e) {
        console.error(e, "Failed to estimate fees");
        setFeesError("Failed to estimate fees");
      } finally {
        setIsEstimating(false);
      }
    }

    estimateFees();

    return () => {
      cancelled = true;
    };
  }, [extrinsic, selectedAccount?.address, defaultCaller]);

  async function onExecute() {
    if (!extrinsic || !selectedAccount?.address) return;
    try {
      setIsAwaitingSignature(true);
      const result = await extrinsic.signAndSend(
        selectedAccount.address,
        async ({ status }) => {
          console.log("status", status);
          setTxStatus(status);
        }
      );

      console.log("result", result);
    } catch (e) {
      console.error(e);
      setTxStatus(null);
    } finally {
      setIsAwaitingSignature(false);
    }
  }

  const isButtonDisabled =
    disabled ||
    isLoading ||
    !isConnected ||
    !client ||
    !selectedAccount?.address ||
    isEstimating ||
    !!feesError;

  return (
    <div className="inline-flex flex-col gap-1">
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
        ) : txStatus && showResult && txStatus.type === "Finalized" ? (
          <>
            {children}
            {icons.finalized}
          </>
        ) : txStatus && txStatus.type === "BestChainBlockIncluded" ? (
          <>
            {children}
            {icons.inBestBlock}
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

      <div className="text-xs text-muted-foreground font-medium h-4 flex items-center">
        {!isConnected ? (
          <span className="text-muted-foreground">Connect to chain</span>
        ) : !selectedAccount?.address && !defaultCaller ? (
          <span className="text-amber-500">Please select an account</span>
        ) : estimatedFees !== null ? (
          <span>
            Fee:{" "}
            {formatBalance({
              value: estimatedFees,
              decimals: activeChain?.decimals ?? 10,
              unit: activeChain?.symbol ?? "UNIT",
              nDecimals: 4,
            })}
          </span>
        ) : feesError ? (
          <span className="text-red-500">{feesError}</span>
        ) : isEstimating ? (
          <div className="flex items-center">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Estimating fees...</span>
          </div>
        ) : (
          <span className="text-muted-foreground">
            Fee calculation pending...
          </span>
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
    finalized: <CheckCheck className="w-4 h-4 text-green-500" />,
    inBestBlock: <Check className="w-4 h-4 text-green-500 animate-pulse" />,
    error: <X className="w-4 h-4 text-red-500" />,
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
