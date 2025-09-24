"use client";

import { useMemo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import {
  ClientConnectionStatus,
  paseoAssetHub,
  usePolkadotClient,
  NetworkId,
} from "typink";
import { parseBalanceLike } from "@/registry/polkadot-ui/lib/utils.dot-ui";

export interface UseAssetBalanceArgs {
  chainId: NetworkId;
  assetId: number;
  address: string;
  enabled?: boolean;
}

export interface AssetBalanceResult {
  free: bigint | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAssetBalance({
  chainId,
  assetId,
  address,
  enabled = true,
}: UseAssetBalanceArgs): AssetBalanceResult {
  const { client, status } = usePolkadotClient(chainId ?? paseoAssetHub.id);

  const isConnected = status === ClientConnectionStatus.Connected;
  const isEnabled =
    enabled && isConnected && !!client && !!address && assetId != null;

  const queryResult = useQuery({
    queryKey: [
      "dedot-asset-balance",
      String(chainId),
      Number(assetId),
      address,
    ],
    enabled: isEnabled,
    queryFn: async (): Promise<bigint | null> => {
      if (!client) return null;
      try {
        const query = client.query.assets.account;
        const account = await query([assetId, address]);
        const raw = (account as unknown as { balance?: unknown })?.balance;
        return parseBalanceLike(raw);
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

export interface UseAssetBalancesArgs {
  chainId: NetworkId;
  assetIds: number[];
  address: string;
  enabled?: boolean;
}

export interface AssetBalancesResult {
  balances: Record<number, bigint | null>;
  isLoading: boolean;
  errors: Record<number, Error | null>;
}

export function useAssetBalances(
  args: UseAssetBalancesArgs
): AssetBalancesResult {
  const { chainId, assetIds, address, enabled = true } = args;
  const { client, status } = usePolkadotClient(chainId ?? paseoAssetHub.id);

  const isConnected = status === ClientConnectionStatus.Connected;
  const isEnabled =
    enabled && isConnected && !!client && !!address && assetIds.length > 0;

  // Sanitize assetIds: integers >= 0 and unique, to prevent injection or malformed queries
  const sortedIds = useMemo(() => {
    const sanitized = assetIds
      .map((id) =>
        typeof id === "number" && Number.isFinite(id) ? Math.floor(id) : NaN
      )
      .filter((id) => Number.isInteger(id) && id >= 0) as number[];
    return [...new Set(sanitized)].sort((a, b) => a - b);
  }, [assetIds]);

  const queryResults = useQueries({
    queries: sortedIds.map((assetId) => ({
      queryKey: [
        "dedot-asset-balance",
        String(chainId),
        Number(assetId),
        address,
      ],
      enabled: isEnabled,
      queryFn: async (): Promise<bigint | null> => {
        if (!client) return null;
        try {
          const query = client.query.assets.account;

          const account = await query([assetId, address]);
          const raw = (account as unknown as { balance?: unknown })?.balance;
          return parseBalanceLike(raw);
        } catch (error) {
          console.error(
            `Asset balance lookup failed for assetId ${assetId}:`,
            error
          );
          return null;
        }
      },
      staleTime: 30_000,
    })),
  });

  return useMemo(() => {
    const balances: Record<number, bigint | null> = {};
    const errors: Record<number, Error | null> = {};
    let isLoading = false;

    queryResults.forEach((result, index) => {
      const assetId = sortedIds[index];
      balances[assetId] = (result.data as bigint | null) ?? null;
      errors[assetId] = (result.error as Error | null) ?? null;
      if (result.isLoading) {
        isLoading = true;
      }
    });

    return {
      balances,
      isLoading,
      errors,
    };
  }, [queryResults, sortedIds]);
}

export interface UseNativeBalanceArgs {
  chainId: NetworkId;
  address: string;
  enabled?: boolean;
}

export interface NativeBalanceResult {
  free: bigint | null;
  isLoading: boolean;
  error: Error | null;
}

export function useNativeBalance({
  chainId,
  address,
  enabled = true,
}: UseNativeBalanceArgs): NativeBalanceResult {
  const { client, status } = usePolkadotClient(chainId ?? paseoAssetHub.id);

  const isConnected = status === ClientConnectionStatus.Connected;
  const isEnabled = enabled && isConnected && !!client && !!address;

  const queryResult = useQuery({
    queryKey: ["dedot-native-balance", String(chainId), address],
    enabled: isEnabled,
    queryFn: async (): Promise<bigint | null> => {
      if (!client) return null;
      try {
        const query = client.query.system.account;
        const account = await query(address);
        const raw = (account as unknown as { data?: { free?: unknown } })?.data
          ?.free;
        return parseBalanceLike(raw);
      } catch (error) {
        console.error("Native balance lookup failed:", error);
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
