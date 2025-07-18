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
  const { api, isLoading, error: apiError, currentChain } = usePolkadot();
  const apiType = useApiType();
  const [blockNumber, setBlockNumber] = useState<number | null>(null);

  useEffect(() => {
    if (!api || isLoading(currentChain)) return;

    let unsubscribe: (() => void) | undefined;

    if (apiType === "papi") {
      // Type guard for papi API
      const papiApi = api as ConfiguredChainApi<ChainId>;
      const subscription = papiApi.query.System.Number.watchValue(
        "best"
      ).subscribe((value: number) => {
        setBlockNumber(value);
      });
      unsubscribe = () => subscription?.unsubscribe();
    } else {
      // Type guard for dedot API
      const dedotApi = api as DedotClient;
      (async () => {
        try {
          unsubscribe = await dedotApi.query.system.number(
            (blockNumber: number) => {
              setBlockNumber(blockNumber);
            }
          );
        } catch (error) {
          console.error("Failed to subscribe to block number:", error);
        }
      })();
    }

    return () => {
      unsubscribe?.();
    };
  }, [api, isLoading, currentChain, apiType]);

  return {
    blockNumber,
    isLoading,
    error: apiError,
  };
}
