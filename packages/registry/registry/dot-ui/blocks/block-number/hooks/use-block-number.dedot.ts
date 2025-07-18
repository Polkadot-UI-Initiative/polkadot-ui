"use client";
import { useDedot } from "@/registry/dot-ui/providers/dedot-provider";
import { useEffect, useState } from "react";

export function useBlockNumber() {
  const { api, isLoading, error, currentChain, isConnected } = useDedot();
  const [blockNumber, setBlockNumber] = useState<number | null>(null);

  useEffect(() => {
    if (!api || isLoading(currentChain) || !isConnected(currentChain)) {
      return;
    }

    let unsubscribe: (() => void) | undefined = () => {};
    let isMounted = true;

    const subscribeToBlockNumber = async () => {
      try {
        const dedotUnsubscribe = await api.query.system.number(
          (blockNumber: number) => {
            if (isMounted) {
              setBlockNumber(blockNumber);
            }
          }
        );
        unsubscribe = dedotUnsubscribe;
      } catch (error) {
        console.error("Failed to subscribe to block number:", error);
      }
    };

    subscribeToBlockNumber();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [api, currentChain, isLoading, isConnected]);

  return {
    blockNumber,
    isLoading: isLoading(currentChain),
    error,
  };
}
