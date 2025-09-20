"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ClientConnectionStatus,
  paseoAssetHub,
  usePolkadotClient,
} from "typink";
import { isHex, hexToU8a, u8aToString } from "@polkadot/util";

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

  const queryResult = useQuery({
    queryKey: ["dedot-assets-metadata", chainId, assetIds],
    queryFn: async (): Promise<TokenMetadata[]> => {
      if (!client) return [];

      const query = client.query.assets.metadata;

      const results = await Promise.all(
        assetIds.map(async (assetId) => {
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
    enabled: isConnected && !!client && assetIds.length > 0,
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
