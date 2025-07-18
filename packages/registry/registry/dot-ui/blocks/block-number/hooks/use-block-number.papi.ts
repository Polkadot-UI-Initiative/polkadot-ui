"use client";
import { usePapi } from "@/registry/dot-ui/providers/papi-provider";
import { useEffect, useState } from "react";

export function useBlockNumber() {
  const { api, isLoading, error, currentChain, isConnected } = usePapi();
  const [blockNumber, setBlockNumber] = useState<number | null>(null);

  useEffect(() => {
    if (!api || isLoading(currentChain) || !isConnected(currentChain)) {
      return;
    }

    let unsubscribe: (() => void) | undefined = () => {};
    let isMounted = true;

    try {
      const subscription = api.query.System.Number.watchValue("best").subscribe(
        (value: number) => {
          if (isMounted) {
            setBlockNumber(value);
          }
        }
      );
      unsubscribe = () => subscription?.unsubscribe();
    } catch (error) {
      console.error("Failed to subscribe to block number:", error);
    }

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
