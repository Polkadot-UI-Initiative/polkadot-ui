"use client";
import { useDedot } from "@/registry/polkadot-ui/providers/dedot-provider";
import { useEffect, useState } from "react";

export function useBlockNumber() {
  // Use the new provider API without specifying a chain - it uses the currently active chain
  const { api, isLoading, error: apiError, currentChain } = useDedot();
  const [blockNumber, setBlockNumber] = useState<number | null>(null);

  useEffect(() => {
    if (!api || isLoading(currentChain)) return;

    // Dedot uses async subscription pattern
    let unsubscribe: (() => void) | undefined;

    (async () => {
      try {
        unsubscribe = await api.query.system.number((blockNumber: number) => {
          setBlockNumber(blockNumber);
        });
      } catch (error) {
        console.error("Failed to subscribe to block number:", error);
      }
    })();

    return () => {
      unsubscribe?.();
    };
  }, [api, isLoading, currentChain]);

  return {
    blockNumber,
    isLoading,
    error: apiError,
  };
}
