"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { parseBalanceLike } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { config } from "@/registry/polkadot-ui/reactive-dot.config";
import type { ChainId } from "@reactive-dot/core";

export interface UseAssetBalanceArgs {
  chainId: ChainId;
  assetId: number;
  address: string;
  enabled?: boolean;
}

export interface AssetBalanceResult {
  free: bigint | null;
  isLoading: boolean;
  error: Error | null;
}

type ExtractAssetBalanceOfValue<A> = A extends {
  query: {
    Assets: {
      Account: {
        getValue: (assetId: number, address: string) => Promise<infer V>;
      };
    };
  };
}
  ? V
  : never;

type ExtractAssetBalanceOfEntries<A> = A extends {
  query: {
    Assets: {
      Account: { getValues: (keys: [number, string][]) => Promise<infer E> };
    };
  };
}
  ? E
  : never;

export function hasAssetPallet<A>(api: A): api is A & {
  query: {
    Assets: {
      Account: {
        getValue: (
          assetId: number,
          address: string
        ) => Promise<ExtractAssetBalanceOfValue<A>>;
        getValues: (
          keys: [number, string][]
        ) => Promise<ExtractAssetBalanceOfEntries<A>>;
      };
    };
  };
} {
  const a = api as {
    query?: {
      Assets?: {
        Account?: {
          getValue?: (assetId: number, address: string) => Promise<never>;
          getValues?: (keys: [number, string][]) => Promise<never>;
        };
      };
    };
  } | null;
  return (
    !!a &&
    typeof a === "object" &&
    !!a.query &&
    !!a.query.Assets &&
    !!a.query.Assets.Account &&
    typeof a.query.Assets.Account.getValue === "function" &&
    typeof a.query.Assets.Account.getValues === "function"
  );
}

export function useAssetBalance({
  chainId = "paseoAssetHub",
  assetId,
  address,
  enabled = true,
}: UseAssetBalanceArgs): AssetBalanceResult {
  const { status, client } = usePapi(chainId);
  const isConnected = status === ClientConnectionStatus.Connected;
  const isEnabled =
    enabled && isConnected && !!client && !!address && assetId != null;

  const queryResult = useQuery({
    queryKey: ["papi-asset-balance", String(chainId), Number(assetId), address],
    enabled: isEnabled,
    queryFn: async (): Promise<bigint | null> => {
      const typedApiUnknown = client!.getTypedApi(
        config.chains[chainId].descriptor
      );
      if (!hasAssetPallet(typedApiUnknown)) return null;
      const assetApi = typedApiUnknown;

      try {
        type AssetBalanceOfValue = ExtractAssetBalanceOfValue<typeof assetApi>;
        const raw: AssetBalanceOfValue =
          await assetApi.query.Assets.Account.getValue(assetId, address);
        if (!raw) return null;

        return parseBalanceLike(raw.balance);
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
  chainId: ChainId;
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
  const { client, status } = usePapi(chainId ?? "paseoAssetHub");

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

  const batched = useQuery({
    queryKey: ["papi-asset-balances", String(chainId), address, sortedIds],
    enabled: isEnabled,
    queryFn: async (): Promise<unknown[]> => {
      if (!client) return [];
      try {
        const typedApiUnknown = client.getTypedApi(
          config.chains[chainId].descriptor
        );
        if (!hasAssetPallet(typedApiUnknown)) return [];
        const assetApi = typedApiUnknown;

        const keys = sortedIds.map(
          (assetId) => [assetId, address] as [number, string]
        );
        const rows = await assetApi.query.Assets.Account.getValues(keys);
        return rows;
      } catch (error) {
        console.error("Asset balances lookup failed:", error);
        return [];
      }
    },
    staleTime: 30_000,
  });

  return useMemo(() => {
    const balances: Record<number, bigint | null> = {};
    const errors: Record<number, Error | null> = {};

    sortedIds.forEach((assetId, index) => {
      const row = batched.data?.[index];
      const account = row as { balance?: unknown };
      balances[assetId] = parseBalanceLike(account.balance);
      errors[assetId] = (batched.error as Error | null) ?? null;
    });

    return {
      balances,
      isLoading: batched.isLoading,
      errors,
    };
  }, [batched.data, batched.error, batched.isLoading, sortedIds]);
}

export interface UseNativeBalanceArgs {
  chainId: ChainId;
  address: string;
  enabled?: boolean;
}

export interface NativeBalanceResult {
  free: bigint | null;
  isLoading: boolean;
  error: Error | null;
}

type ExtractSystemAccountValue<A> = A extends {
  query: {
    System: {
      Account: { getValue: (address: string) => Promise<infer V> };
    };
  };
}
  ? V
  : never;

export function hasSystemPallet<A>(api: A): api is A & {
  query: {
    System: {
      Account: {
        getValue: (address: string) => Promise<ExtractSystemAccountValue<A>>;
      };
    };
  };
} {
  const a = api as {
    query?: {
      System?: {
        Account?: { getValue?: (address: string) => Promise<never> };
      };
    };
  } | null;
  return (
    !!a &&
    typeof a === "object" &&
    !!a.query &&
    !!a.query.System &&
    !!a.query.System.Account &&
    typeof a.query.System.Account.getValue === "function"
  );
}

export function useNativeBalance({
  chainId,
  address,
  enabled = true,
}: UseNativeBalanceArgs): NativeBalanceResult {
  const { client, status } = usePapi(chainId ?? "paseoAssetHub");

  const isConnected = status === ClientConnectionStatus.Connected;
  const isEnabled = enabled && isConnected && !!client && !!address;

  const queryResult = useQuery({
    queryKey: ["papi-native-balance", String(chainId), address],
    enabled: isEnabled,
    queryFn: async (): Promise<bigint | null> => {
      const typedApiUnknown = client!.getTypedApi(
        config.chains[chainId].descriptor
      );
      if (!hasSystemPallet(typedApiUnknown)) return null;
      const systemApi = typedApiUnknown;

      try {
        type SystemAccountValue = ExtractSystemAccountValue<typeof systemApi>;
        const account: SystemAccountValue =
          await systemApi.query.System.Account.getValue(address);
        const raw = account.data?.free;

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
