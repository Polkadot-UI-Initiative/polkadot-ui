"use client";

import { cn } from "@/registry/polkadot-ui/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/polkadot-ui/ui/tooltip";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ClientConnectionStatus,
  type NetworkInfoLike,
  type UseBlockInfoLike,
} from "@/registry/polkadot-ui/lib/types.dot-ui";
import { Skeleton } from "@/components/ui/skeleton";

export interface NetworkIndicatorBaseProps<TNetworkId extends string> {
  chainId: TNetworkId;
  showBlockNumber?: boolean;
  showLogo?: boolean;
  at: "best" | "finalized";
  className?: string;
  services: NetworkIndicatorServices<TNetworkId>;
}

export interface NetworkIndicatorServices<TNetworkId extends string> {
  connectionStatus: ClientConnectionStatus;
  supportedNetworks: NetworkInfoLike<TNetworkId>[];
  blockInfo: UseBlockInfoLike | undefined;
}

export function NetworkIndicatorBase<TNetworkId extends string>({
  chainId,
  showBlockNumber = true,
  showLogo = true,
  at = "best",
  className,
  services,
}: NetworkIndicatorBaseProps<TNetworkId>) {
  const { connectionStatus, supportedNetworks, blockInfo } = services;
  const [isOpen, setIsOpen] = useState(false);
  const { best, finalized } = blockInfo ?? {};

  const blockNumber = at === "best" ? best?.number : finalized?.number;
  const network = supportedNetworks.find((n) => n.id === chainId);

  // Animate width of the block number area and fade-in the number when available
  const showNumber =
    connectionStatus === ClientConnectionStatus.Connected &&
    showBlockNumber &&
    Boolean(blockNumber);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [numWidth, setNumWidth] = useState(0);
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setNumWidth(rect.width);
  }, [blockNumber, showBlockNumber]);

  const Trigger = useMemo(() => {
    const blockText = blockNumber != null ? String(blockNumber) : "";
    const measureText =
      blockText.length > 0 ? "0".repeat(blockText.length) : "";
    return (
      <div className="tabular-nums font-light min-h-7 h-auto py-1 border-foreground/20 border rounded-md px-2 text-[12px] cursor-default flex items-center gap-1.5">
        {showLogo && network?.logo && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={network?.logo} alt={network?.name} className="size-3.5" />
          </>
        )}
        {/* hidden measurer for width animation (use zero digits for tabular width) */}
        <span
          ref={measureRef}
          className="absolute opacity-0 pointer-events-none -z-10 font-mono"
          aria-hidden
        >
          {measureText}
        </span>
        {/* animated width container for number */}
        <span
          aria-hidden={!showNumber}
          style={{
            width: showNumber ? numWidth : 0,
            transition: "width 200ms ease",
          }}
          className="overflow-hidden flex"
        >
          {showNumber && (
            <span
              className="tabular-nums font-mono"
              style={{
                opacity: showNumber ? 1 : 0,
                transition: "opacity 200ms ease",
              }}
            >
              {blockNumber}
            </span>
          )}
        </span>
        {connectionStatus === ClientConnectionStatus.Connected ? (
          <>
            <span className="block rounded-full w-2 h-2 bg-green-400 animate-pulse" />
          </>
        ) : connectionStatus === ClientConnectionStatus.Error ? (
          <>
            <span className="block rounded-full w-2 h-2 bg-red-400" />
          </>
        ) : (
          <>
            <span className="block rounded-full w-2 h-2 bg-yellow-400 animate-pulse" />
          </>
        )}
      </div>
    );
  }, [blockNumber, connectionStatus, network, showLogo, numWidth, showNumber]);

  const Content = useMemo(() => {
    return (
      <>
        {connectionStatus === ClientConnectionStatus.Connected ? (
          <>
            connected to <b>{network?.name}</b>
          </>
        ) : connectionStatus === ClientConnectionStatus.Error ? (
          <>error: Connection error</>
        ) : (
          <>
            connecting to <b>{network?.name}</b>
          </>
        )}
      </>
    );
  }, [network, connectionStatus]);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100} open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild className={cn("flex items-center", className)}>
          {Trigger}
        </TooltipTrigger>
        <TooltipContent side="top" className="">
          {Content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function NetworkIndicatorSkeleton() {
  return (
    <div className="tabular-nums font-light min-h-7 h-auto py-1 border-foreground/20 border rounded-md px-2 text-[18px] cursor-default flex items-center gap-1.5">
      <Skeleton className="w-3.5 h-3.5 rounded-full" />
      <div />
      <span className="block rounded-full w-2 h-2 bg-yellow-400 animate-pulse" />
    </div>
  );
}
