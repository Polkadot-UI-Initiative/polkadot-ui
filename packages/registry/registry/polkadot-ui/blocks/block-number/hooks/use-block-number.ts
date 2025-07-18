"use client";
import {
  usePolkadot,
  useApiType,
} from "@/registry/polkadot-ui/providers/unified-polkadot-provider";
import { useEffect, useState } from "react";
import type { ConfiguredChainApi } from "@/registry/polkadot-ui/providers/papi-provider";
import type { DedotClient } from "dedot";
import type { ChainId } from "@/registry/polkadot-ui/lib/config.polkadot-ui";

export function useBlockNumber() {
  const {
    api,
    isLoading,
    error: apiError,
    currentChain,
    isConnected,
  } = usePolkadot();
  const apiType = useApiType();
  const [blockNumber, setBlockNumber] = useState<number | null>(null);

  useEffect(() => {
    // Check if API is connected and not loading
    if (!api || isLoading(currentChain) || !isConnected(currentChain)) {
      return;
    }

    let unsubscribe: (() => void) | undefined = () => {}; // Initialize to prevent cleanup issues
    let isMounted = true; // Track if component is still mounted

    const subscribeToBlockNumber = async () => {
      try {
        if (apiType === "papi") {
          // Type guard for papi API
          const papiApi = api as ConfiguredChainApi<ChainId>;
          const subscription = papiApi.query.System.Number.watchValue(
            "best"
          ).subscribe((value: number) => {
            if (isMounted) {
              setBlockNumber(value);
            }
          });
          unsubscribe = () => subscription?.unsubscribe();
        } else {
          // Type guard for dedot API
          const dedotApi = api as DedotClient;
          const dedotUnsubscribe = await dedotApi.query.system.number(
            (blockNumber: number) => {
              if (isMounted) {
                setBlockNumber(blockNumber);
              }
            }
          );
          unsubscribe = dedotUnsubscribe;
        }
      } catch (error) {
        console.error("Failed to subscribe to block number:", error);
      }
    };

    subscribeToBlockNumber();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [api, isLoading, currentChain, apiType, isConnected]);

  return {
    blockNumber,
    isLoading: isLoading(currentChain),
    error: apiError,
  };
}
