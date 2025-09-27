"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ClientConnectionStatus,
  paseoAssetHub,
  usePolkadotClient,
} from "typink";
import { isHex, hexToU8a, u8aToString } from "@polkadot/util";
import { useChaindata } from "@/registry/polkadot-ui/hooks/use-chaindata-json";
import {
  NATIVE_TOKEN_KEY,
  chainIdToKebabCase,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";

export interface TokenMetadata {
  assetId: number;
  name: string;
  symbol: string;
  decimals: number;
}

export function useAssetMetadata({
  chainId,
  assetIds,
}: {
  chainId: string;
  assetIds: number[];
}) {
  const { client, status } = usePolkadotClient(chainId ?? paseoAssetHub.id);

  const isConnected = status === ClientConnectionStatus.Connected;

  const sortedIds = useMemo(() => {
    const sanitized = assetIds
      .map((id) =>
        typeof id === "number" && Number.isFinite(id) ? Math.floor(id) : NaN
      )
      .filter((id) => Number.isInteger(id) && id >= -1) as number[];
    return [...new Set(sanitized)].sort((a, b) => a - b);
  }, [assetIds]);

  const includesNative = sortedIds.includes(NATIVE_TOKEN_KEY);
  console.log("includesNative", includesNative);
  const palletAssetIds = useMemo(
    () => sortedIds.filter((id) => id >= 0),
    [sortedIds]
  );

  // Fetch chaindata once to derive native metadata when requested
  const { chains } = useChaindata();
  const nativeMeta: TokenMetadata | null = useMemo(() => {
    if (!includesNative) return null;
    const network = chains.find((c) => c.id === chainIdToKebabCase(chainId));
    const native = network?.nativeCurrency;
    if (!native) return null;
    return {
      assetId: NATIVE_TOKEN_KEY,
      name: native.name || "Native",
      symbol: native.symbol || "UNIT",
      decimals:
        typeof native.decimals === "number"
          ? native.decimals
          : Number(native.decimals ?? 12),
    } as TokenMetadata;
  }, [includesNative, chains, chainId]);

  const queryResult = useQuery({
    queryKey: ["dedot-assets-metadata", String(chainId), palletAssetIds],
    queryFn: async (): Promise<TokenMetadata[]> => {
      if (!client) return [];

      const query = client.query.assets.metadata;

      const results = await Promise.all(
        palletAssetIds.map(async (assetId) => {
          try {
            const meta = await query(assetId);
            const name = decodeText(meta?.name);
            const symbol = decodeText(meta?.symbol);
            const decimals =
              typeof meta?.decimals === "number"
                ? meta.decimals
                : Number(meta?.decimals ?? 0);
            return {
              assetId,
              name: name ?? `Asset ${assetId}`,
              symbol: symbol ?? String(assetId),
              decimals,
            } as TokenMetadata;
          } catch {
            return {
              assetId,
              name: `Asset ${assetId}`,
              symbol: String(assetId),
              decimals: 0,
            } as TokenMetadata;
          }
        })
      );

      return results;
    },
    enabled: isConnected && !!client && palletAssetIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const assets = useMemo(() => {
    const list = queryResult.data ?? [];
    if (nativeMeta) return [nativeMeta, ...list];
    return list;
  }, [queryResult.data, nativeMeta]);

  return {
    assets,
    isLoading: queryResult.isLoading,
    error: queryResult.error as Error | null,
  } as const;
}

function decodeText(data: unknown): string | undefined {
  if (!data) return undefined;
  if (typeof data === "string") {
    if (isHex(data)) {
      try {
        return u8aToString(hexToU8a(data));
      } catch {
        return data;
      }
    }
    return data;
  }
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (obj.Raw && obj.Raw instanceof Uint8Array)
      return new TextDecoder().decode(obj.Raw);
    if (typeof obj.value === "string") return obj.value;
  }
  return undefined;
}
