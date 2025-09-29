"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ClientConnectionStatus,
  paseoAssetHub,
  usePolkadotClient,
  type NetworkId,
} from "typink";
import {
  NATIVE_TOKEN_KEY,
  parseBalanceLike,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { type AccountId32Like } from "dedot/codecs";

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

  // Always call native hook; gate by enabled flag to keep hooks order stable
  const native = useNativeBalance({
    chainId,
    address,
    enabled: isEnabled && assetId === NATIVE_TOKEN_KEY,
  });

  const queryResult = useQuery({
    queryKey: [
      "dedot-asset-balance",
      String(chainId),
      Number(assetId),
      address,
    ],
    enabled: isEnabled && assetId !== NATIVE_TOKEN_KEY,
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
      free:
        assetId === NATIVE_TOKEN_KEY
          ? (native.free as bigint | null)
          : ((queryResult.data as bigint | null) ?? null),
      isLoading:
        assetId === NATIVE_TOKEN_KEY ? native.isLoading : queryResult.isLoading,
      error:
        assetId === NATIVE_TOKEN_KEY
          ? ((native.error as Error | null) ?? null)
          : ((queryResult.error as Error | null) ?? null),
    }),
    [
      assetId,
      native.free,
      native.isLoading,
      native.error,
      queryResult.data,
      queryResult.isLoading,
      queryResult.error,
    ]
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

  // Sanitize assetIds: integers >= -1 (allow native sentinel) and unique
  const sortedIds = useMemo(() => {
    const sanitized = assetIds
      .map((id) =>
        typeof id === "number" && Number.isFinite(id) ? Math.floor(id) : NaN
      )
      .filter((id) => Number.isInteger(id) && id >= -1) as number[];
    return [...new Set(sanitized)].sort((a, b) => a - b);
  }, [assetIds]);

  const includesNative = sortedIds.includes(NATIVE_TOKEN_KEY);
  const palletAssetIds = useMemo(
    () => sortedIds.filter((id) => id >= 0),
    [sortedIds]
  );

  const native = useNativeBalance({
    chainId,
    address,
    enabled: isEnabled && includesNative,
  });

  const batched = useQuery({
    queryKey: [
      "dedot-asset-balances",
      String(chainId),
      address,
      palletAssetIds,
    ],
    enabled: isEnabled && palletAssetIds.length > 0,
    queryFn: async (): Promise<unknown[]> => {
      if (!client) return [];
      const keys = sortedIds.map(
        (assetId) => [assetId, address] as [number, AccountId32Like]
      );
      const rows = await client.query.assets.account.multi(
        keys.filter(([id]) => id >= 0)
      );
      return rows;
    },
    staleTime: 30_000,
  });

  return useMemo(() => {
    const balances: Record<number, bigint | null> = {};
    const errors: Record<number, Error | null> = {};

    // Map pallet assets from batched query
    palletAssetIds.forEach((assetId, index) => {
      const row = batched.data?.[index];
      balances[assetId] = parseBalanceLike(
        (row as unknown as { balance?: unknown })?.balance
      );
      errors[assetId] = (batched.error as Error | null) ?? null;
    });

    // Add native balance if requested
    if (includesNative) {
      balances[NATIVE_TOKEN_KEY] = native.free ?? null;
      errors[NATIVE_TOKEN_KEY] = (native.error as Error | null) ?? null;
    }

    return {
      balances,
      isLoading:
        batched.isLoading || (includesNative ? native.isLoading : false),
      errors,
    };
  }, [
    batched.data,
    batched.error,
    batched.isLoading,
    palletAssetIds,
    includesNative,
    native.free,
    native.isLoading,
    native.error,
  ]);
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
