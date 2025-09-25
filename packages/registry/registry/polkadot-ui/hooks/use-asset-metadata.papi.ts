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

            const nameField = (meta as { name?: unknown }).name;
            const symbolField = (meta as { symbol?: unknown }).symbol;

            const name = decodeBinaryField(nameField);
            const symbol = decodeBinaryField(symbolField);
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

function decodeBinaryField(binaryField: unknown): string | undefined {
  if (!binaryField) return undefined;

  try {
    const field = binaryField as {
      asText?: () => string;
      asBytes?: () => Uint8Array;
      asHex?: () => string;
      asOpaqueBytes?: () => Uint8Array;
      asOpaqueHex?: () => string;
    };

    // Try asText() method first (most common for readable metadata)
    if (typeof field?.asText === "function") {
      const text = field.asText();
      return text && text.length > 0 ? text : undefined;
    }

    // Try asBytes() method and decode as UTF-8
    if (typeof field?.asBytes === "function") {
      const bytes = field.asBytes();
      if (bytes && bytes.length > 0) {
        return new TextDecoder("utf-8", { ignoreBOM: true }).decode(bytes);
      }
    }

    // Try asHex() method and convert hex to string
    if (typeof field?.asHex === "function") {
      const hex = field.asHex();
      if (hex && hex.length > 2) {
        // Skip '0x' prefix
        const hexString = hex.startsWith("0x") ? hex.slice(2) : hex;
        const bytes = new Uint8Array(
          hexString
            .match(/.{1,2}/g)
            ?.map((byte: string) => parseInt(byte, 16)) || []
        );
        return new TextDecoder("utf-8", { ignoreBOM: true }).decode(bytes);
      }
    }

    // Fallback: check if it's already a string
    if (typeof binaryField === "string") {
      return binaryField;
    }

    // Fallback: check if it's a Uint8Array
    if (binaryField instanceof Uint8Array) {
      return new TextDecoder("utf-8", { ignoreBOM: true }).decode(binaryField);
    }
  } catch (error) {
    console.warn("Failed to decode binary field:", error);
  }

  return undefined;
}
