"use client";

import { cn } from "@/registry/polkadot-ui/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/polkadot-ui/ui/tooltip";
import { useMemo, useState } from "react";
import {
  ClientConnectionStatus,
  NetworkInfoLike,
  UseBlockInfoLike,
} from "@/registry/polkadot-ui/lib/types.dot-ui";

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

  const Trigger = useMemo(() => {
    return (
      <div className="tabular-nums font-light h-6 border-foreground/20 border rounded-md px-2 text-[12px] cursor-default flex items-center gap-1">
        {showLogo && network?.logo && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={network?.logo} alt={network?.name} className="w-3 h-3" />
          </>
        )}
        {connectionStatus === ClientConnectionStatus.Connected &&
          showBlockNumber &&
          blockNumber && (
            <span className="text-[10px]">{`${blockNumber}`}</span>
          )}
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
  }, [blockNumber, connectionStatus, showBlockNumber, network]);

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
