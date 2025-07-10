"use client";
import { usePolkadot } from "@/registry/polkadot-ui/providers/polkadot-provider";
import { useEffect, useState } from "react";

export function useBlockNumber() {
  // Use the new provider API without specifying a chain - it uses the currently active chain
  const { api, isLoading, error: apiError, currentChain } = usePolkadot();
  const [blockNumber, setBlockNumber] = useState<number | null>(null);

  useEffect(() => {
    if (!api || isLoading(currentChain)) return;

    // No type assertions needed - TypeScript knows the exact API structure!
    const subscription = api.query.System.Number.watchValue("best").subscribe(
      (value: number) => {
        setBlockNumber(value);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [api, isLoading, currentChain]);

  return {
    blockNumber,
    isLoading,
    error: apiError,
  };
}
