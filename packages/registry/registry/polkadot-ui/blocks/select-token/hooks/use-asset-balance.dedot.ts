"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClientConnectionStatus, usePolkadotClient } from "typink";

export interface UseAssetBalanceArgs {
  chainId: string;
  assetId: number;
  address: string;
  enabled?: boolean;
}

export interface AssetBalanceResult {
  free: bigint | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAssetBalance(args: UseAssetBalanceArgs): AssetBalanceResult {
  const { chainId, assetId, address, enabled = true } = args;
  const { client, status } = usePolkadotClient(chainId);

  const isConnected = status === ClientConnectionStatus.Connected;
  const isEnabled =
    enabled && isConnected && !!client && !!address && assetId != null;

  const queryResult = useQuery({
    queryKey: ["dedot-asset-balance", chainId, assetId, address],
    enabled: isEnabled,
    queryFn: async (): Promise<bigint | null> => {
      if (!client) return null;
      try {
        const query = client.query.assets.account;

        const account = await query([assetId, address]);
        console.log("aaaassetId", assetId);
        console.log("aaaaddress", address);
        console.log("aaaaccount", account);
        const raw = (account as unknown as { balance?: unknown })?.balance;
        if (typeof raw === "bigint") return raw;
        if (typeof raw === "number") return BigInt(raw);
        if (
          raw &&
          typeof (raw as { toBigInt?: () => bigint }).toBigInt === "function"
        )
          return (raw as { toBigInt: () => bigint }).toBigInt();
        if (
          raw &&
          typeof (raw as { toString?: () => string }).toString === "function"
        )
          return BigInt((raw as { toString: () => string }).toString());
        return null;
      } catch (error) {
        console.error("Asset balance lookup failed:", error);
        return null;
      }
    },
    staleTime: 30_000,
  });

  return useMemo(
    () => ({
      free: (queryResult.data as bigint | null) ?? null,
      isLoading: queryResult.isLoading,
      error: (queryResult.error as Error | null) ?? null,
    }),
    [queryResult.data, queryResult.isLoading, queryResult.error]
  );
}
