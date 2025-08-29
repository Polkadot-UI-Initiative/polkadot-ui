"use client";

import { Button, buttonVariants } from "@/components/ui/button";

import { formatBalance } from "@/registry/dot-ui/lib/utils.dot-ui";
import { cn } from "@/registry/dot-ui/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { Loader2, PenLine, CheckCheck, Check, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  TxStatus,
  ISubmittableExtrinsic,
  ISubmittableResult,
} from "dedot/types";
import { useDedot } from "@/registry/dot-ui/providers/dedot-provider";
import { toTypinkId } from "@/registry/dot-ui/lib/utils.dedot";
import { getChainIdForClient } from "@/registry/dot-ui/lib/client-map.dedot";
import { dedotConfig } from "@/registry/dot-ui/lib/config.dedot";
import type { ChainId } from "@/registry/dot-ui/lib/config.dot-ui";
import { txNotification } from "../../tx-notification/components/tx-notification.base";

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
  tx?: ISubmittableExtrinsic | undefined;
  resultDisplayDuration?: number;
  icons?: {
    default?: React.ReactNode;
    loading?: React.ReactNode;
    finalized?: React.ReactNode;
    inBestBlock?: React.ReactNode;
    error?: React.ReactNode;
  };
  classNames?: {
    button?: string;
    info?: string;
  };
  services?: TxButtonServices;
  onStatusChange?: (payload: ISubmittableResult) => void;
  withNotification?: boolean;
  chainId?: ChainId;
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
  classNames = {
    button: "",
    info: "",
  },
  services,
  onStatusChange,
  withNotification = true,
  chainId,
  ...props
}: TxButtonBaseProps) {
  const selectedAccount = services?.useSelectedAccount();
  const activeChain = services?.useActiveChain();
  const isConnected = services?.useIsConnected();

  const {
    apis,
    activeSigner,
    defaultCaller,
    availableChains,
    initializeChain,
  } = useDedot();

  // Ensure target chain is initialized if explicitly provided
  useEffect(() => {
    if (!chainId) return;
    initializeChain(chainId).catch(() => {});
  }, [chainId, initializeChain]);

  const targetChainId = useMemo<ChainId | null>(() => {
    if (chainId) return chainId;
    return null;
  }, [chainId]);

  const extrinsic = useMemo(() => {
    console.log("aaatx", tx);
    return tx ?? null;
  }, [tx]);

  // infer chain id from passed extrinsic
  const inferredChainId = useMemo(() => {
    if (targetChainId) return targetChainId;
    if (!extrinsic) return null;
    const anyExtrinsic = extrinsic as unknown as {
      client?: unknown;
      api?: unknown;
    };
    const txClient = anyExtrinsic?.client ?? anyExtrinsic?.api ?? null;
    if (!txClient) return null;
    const entry = Object.entries(apis).find(([, api]) => api === txClient);
    return (entry?.[0] as ChainId | undefined) ?? null;
  }, [extrinsic, apis, targetChainId]);

  const inferredNetwork = useMemo(() => {
    // Prefer dedotConfig as source of truth for decimals/symbol when possible
    if (inferredChainId) {
      const cfg = dedotConfig.chains[inferredChainId];
      if (cfg?.network) return cfg.network;
    }
    // Fallback: try to read from extrinsic's client via WeakMap
    if (extrinsic) {
      const anyExtrinsic = extrinsic as unknown as {
        client?: unknown;
        api?: unknown;
      };
      const client = anyExtrinsic?.client ?? anyExtrinsic?.api ?? null;
      const chainId = getChainIdForClient(client);
      if (chainId) {
        const cfg = dedotConfig.chains[chainId];
        if (cfg?.network) return cfg.network;
      }
    }
    // Last resort: use availableChains by mapping chainId -> typinkId
    if (inferredChainId) {
      const list = availableChains ?? [];
      const typinkId = toTypinkId(inferredChainId);
      const match = list.find(
        (n): n is NonNullable<typeof n> => !!n && n.id === typinkId
      );
      if (match) return match;
    }
    return null;
  }, [inferredChainId, extrinsic, availableChains]);

  const decimalsToUse =
    inferredNetwork?.decimals ?? activeChain?.decimals ?? 10;
  const symbolToUse = inferredNetwork?.symbol ?? activeChain?.symbol ?? "UNIT";

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
    const estimateAddress = selectedAccount?.address || defaultCaller;
    if (!extrinsic || !estimateAddress) return;
    let cancelled = false;
    setIsEstimating(true);
    setFeesError(null);

    async function estimateFees() {
      if (!extrinsic || !estimateAddress || cancelled) return;
      try {
        const info = await extrinsic.paymentInfo(estimateAddress);
        const fee =
          typeof info === "bigint"
            ? info
            : (info as { partialFee: bigint }).partialFee;

        setEstimatedFees(fee);
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
  }, [extrinsic, selectedAccount, defaultCaller]);

  async function onExecute() {
    if (!extrinsic || !selectedAccount?.address || !activeSigner) return;
    try {
      setIsAwaitingSignature(true);
      let toaster: ReturnType<typeof txNotification> | null = null;
      if (withNotification) {
        toaster = txNotification("Signing Transaction...", inferredNetwork);
      }
      const result = await extrinsic
        .signAndSend(
          selectedAccount.address,
          { signer: activeSigner },
          async (payload) => {
            setTxStatus(payload.status);
            onStatusChange?.(payload);
            if (withNotification && toaster) {
              toaster.onTxProgress(payload);
            }
          }
        )
        .catch((e) => {
          if (withNotification && toaster) {
            toaster.onTxError(e);
          }
        });

      console.log("result", result);
    } catch (e) {
      console.error(e);
      setTxStatus(null);
    } finally {
      setIsAwaitingSignature(false);
    }
  }

  const isButtonDisabled =
    !services ||
    disabled ||
    isLoading ||
    !isConnected ||
    !activeSigner ||
    !selectedAccount?.address ||
    isEstimating ||
    !!feesError;

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      <Button
        onClick={onExecute}
        variant={variant}
        size={size}
        disabled={isButtonDisabled}
        className={cn(isLoading && "cursor-not-allowed", classNames.button)}
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
      <div
        className={cn(
          "text-xs text-muted-foreground font-medium h-4 flex items-center",
          classNames.info
        )}
      >
        {/* connected: {isConnected ? "true" : "false"}
        address: {selectedAccount?.address ?? "null"}
        defaultCaller: {defaultCaller ?? "null"} */}
        {!isConnected ? (
          <span className="text-muted-foreground">Connect to chain</span>
        ) : !selectedAccount?.address && !defaultCaller ? (
          <span className="text-amber-500">Please select an account</span>
        ) : estimatedFees !== null ? (
          <span>
            Fee:{" "}
            {formatBalance({
              value: estimatedFees,
              decimals: decimalsToUse,
              unit: symbolToUse,
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
