"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { config } from "@/registry/polkadot-ui/reactive-dot.config";
import type { ChainId } from "@reactive-dot/core";

export interface TokenMetadata {
  assetId: number;
  deposit: bigint;
  name: string;
  symbol: string;
  decimals: number;
  isFrozen: boolean;
}

type ExtractAssetMetadataValue<A> = A extends {
  query: {
    Assets: {
      Metadata: { getValue: (assetId: number) => Promise<infer V> };
    };
  };
}
  ? V
  : never;

export function hasAssetMetadataPallet<A>(api: A): api is A & {
  query: {
    Assets: {
      Metadata: {
        getValue: (assetId: number) => Promise<ExtractAssetMetadataValue<A>>;
      };
    };
  };
} {
  const a = api as {
    query?: {
      Assets?: {
        Metadata?: { getValue?: (assetId: number) => Promise<never> };
      };
    };
  } | null;
  return (
    !!a &&
    typeof a === "object" &&
    !!a.query &&
    !!a.query.Assets &&
    !!a.query.Assets.Metadata &&
    typeof a.query.Assets.Metadata.getValue === "function"
  );
}

export function useAssetMetadata({
  chainId = "paseoAssetHub",
  assetIds,
}: {
  chainId?: ChainId;
  assetIds: number[];
}) {
  const { status, client } = usePapi(chainId);
  const isConnected = status === ClientConnectionStatus.Connected;

  const sortedIds = useMemo(() => {
    const sanitized = assetIds
      .map((id) =>
        typeof id === "number" && Number.isFinite(id) ? Math.floor(id) : NaN
      )
      .filter((id) => Number.isInteger(id) && id >= 0) as number[];
    return [...new Set(sanitized)].sort((a, b) => a - b);
  }, [assetIds]);

  const queryResult = useQuery({
    queryKey: ["papi-assets-metadata", String(chainId), sortedIds],
    queryFn: async (): Promise<TokenMetadata[]> => {
      const typedApiUnknown = client!.getTypedApi(
        config.chains[chainId].descriptor
      );
      if (!hasAssetMetadataPallet(typedApiUnknown)) return [];
      const assetApi = typedApiUnknown;

      const results = await Promise.all(
        sortedIds.map(async (assetId) => {
          try {
            type AssetMetadataValue = ExtractAssetMetadataValue<
              typeof assetApi
            >;
            const meta: AssetMetadataValue =
              await assetApi.query.Assets.Metadata.getValue(assetId);

            const name = decodeText((meta as { name?: unknown }).name);
            const symbol = decodeText((meta as { symbol?: unknown }).symbol);
            const decimals = (meta as { decimals?: number }).decimals ?? 0;
            const deposit = (meta as { deposit?: bigint }).deposit ?? 0n;
            const isFrozen = (meta as { isFrozen?: boolean }).isFrozen ?? false;

            return {
              assetId,
              deposit,
              isFrozen,
              name: name ?? `Asset ${assetId}`,
              symbol: symbol ?? String(assetId),
              decimals,
            } as TokenMetadata;
          } catch {
            return {
              assetId,
              deposit: 0n,
              isFrozen: false,
              name: `Asset ${assetId}`,
              symbol: String(assetId),
              decimals: 0,
            } as TokenMetadata;
          }
        })
      );

      return results;
    },
    enabled: isConnected && !!client && sortedIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const assets = useMemo(() => queryResult.data ?? [], [queryResult.data]);

  return {
    assets,
    isLoading: queryResult.isLoading,
    error: queryResult.error as Error | null,
  } as const;
}

function decodeText(data: unknown): string | undefined {
  if (!data) return undefined;

  // Handle Binary type (Uint8Array)
  if (data instanceof Uint8Array) {
    try {
      return new TextDecoder().decode(data);
    } catch {
      return undefined;
    }
  }

  // Handle string
  if (typeof data === "string") {
    return data;
  }

  // Handle object with Binary data
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;

    // Check for Raw property (common in Substrate)
    if (obj.Raw && obj.Raw instanceof Uint8Array) {
      try {
        return new TextDecoder().decode(obj.Raw);
      } catch {
        return undefined;
      }
    }

    // Check for value property
    if (typeof obj.value === "string") {
      return obj.value;
    }

    // If the object itself looks like a Uint8Array
    if (typeof obj.length === "number" && obj[0] !== undefined) {
      try {
        const uint8Array = new Uint8Array(Object.values(obj) as number[]);
        return new TextDecoder().decode(uint8Array);
      } catch {
        return undefined;
      }
    }
  }

  return undefined;
}
