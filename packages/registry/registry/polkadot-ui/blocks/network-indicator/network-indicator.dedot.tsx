"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/polkadot-ui/ui/tooltip";
import { useMemo, useState } from "react";
import {
  ClientConnectionStatus,
  NetworkId,
  useBlockInfo,
  useTypink,
} from "typink";

export interface NetworkIndicatorProps {
  chainId: NetworkId;
  showBlockNumber?: boolean;
  at: "best" | "finalized";
}

export function NetworkIndicator({
  chainId,
  showBlockNumber = true,
  at = "best",
}: NetworkIndicatorProps) {
  const { connectionStatus, supportedNetworks } = useTypink();
  const [isOpen, setIsOpen] = useState(false);
  const network = supportedNetworks.find((n) => n.id === chainId);
  const chainConnectionStatus = connectionStatus.get(chainId);
  const { best, finalized } = useBlockInfo({ networkId: chainId });
  const blockNumber = at === "best" ? best?.number : finalized?.number;

  const Trigger = useMemo(() => {
    return (
      <div className="tabular-nums font-light h-6 border-foreground/20 border rounded-md px-2 text-[12px] cursor-default flex items-center gap-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={network?.logo} alt={network?.name} className="w-3 h-3" />
        {chainConnectionStatus === ClientConnectionStatus.Connected &&
          showBlockNumber &&
          blockNumber && (
            <span className="text-[10px]">{`${blockNumber}`}</span>
          )}
        {chainConnectionStatus === ClientConnectionStatus.Connected ? (
          <>
            <span className="block rounded-full w-2 h-2 bg-green-400 animate-pulse" />
          </>
        ) : chainConnectionStatus === ClientConnectionStatus.Error ? (
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
  }, [blockNumber, chainConnectionStatus, showBlockNumber, network]);

  const Content = useMemo(() => {
    return (
      <>
        {chainConnectionStatus === ClientConnectionStatus.Connected ? (
          <>
            connected to <b>{network?.name}</b>
          </>
        ) : chainConnectionStatus === ClientConnectionStatus.Error ? (
          <>error: Connection error</>
        ) : (
          <>
            connecting to <b>{network?.name}</b>
          </>
        )}
      </>
    );
  }, [network, chainConnectionStatus]);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100} open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild className="flex items-center">
          {Trigger}
        </TooltipTrigger>
        <TooltipContent side="top" className="">
          {Content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
